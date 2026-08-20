/**
 * HTTP routes bridging the browser market UI to the host: registry data,
 * refresh status, install/uninstall, verify (isPlugin deep check) and
 * publish (add the dsh-plugin topic to the user's own repo).
 *
 * Security: install/uninstall/publish accept only same-origin POSTs. The
 * GitHub token never leaves the process and never appears in responses.
 */

import { readFileSync } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { loadRegistry, progress, verifyRepos } from './catalog.ts'
import { getRepoTopics, lastRateInfo, listMyRepos, putRepoTopics } from './github.ts'
import { installState, readManifest as readProfileManifest, runInstall, runUninstall, withMutationLock } from './install.ts'

let cachedVersion: string | null = null
/** The market's own version from its package.json (read once per process). */
export function marketVersion(): string {
  if (cachedVersion !== null) return cachedVersion
  try {
    const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as { version?: string }
    cachedVersion = manifest.version ?? 'unknown'
  } catch {
    cachedVersion = 'unknown'
  }
  return cachedVersion
}
import type { MarketConfig } from './types.ts'

export interface WebServerService {
  register(route: {
    kind: 'exact' | 'prefix'
    path: string
    handler: (request: IncomingMessage, response: ServerResponse) => void | Promise<void>
  }): () => void
}

export interface MarketHost {
  webServer: WebServerService
  effect?(callback: () => void | (() => void), label?: string): void
}

function sendJson(response: ServerResponse, status: number, body: unknown): void {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
  response.end(JSON.stringify(body))
}

function readJsonBody(request: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let raw = ''
    request.on('data', (chunk: Buffer) => {
      raw += chunk.toString()
      if (raw.length > 64 * 1024) {
        reject(new Error('body too large'))
        request.destroy()
      }
    })
    request.on('end', () => {
      try {
        resolve(JSON.parse(raw) as Record<string, unknown>)
      } catch {
        reject(new Error('invalid JSON body'))
      }
    })
    request.on('error', reject)
  })
}

/** Only same-origin browsers may drive mutations (ported from dsh-market). */
function sameOrigin(request: IncomingMessage): boolean {
  const origin = request.headers.origin
  if (origin === undefined) return true
  const host = request.headers.host
  if (host === undefined) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

function notGet(request: IncomingMessage): boolean { return request.method !== 'GET' && request.method !== 'HEAD' }

const REPO_RE = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/

function parseRepo(value: unknown): string | null {
  if (typeof value !== 'string' || !REPO_RE.test(value)) return null
  return value
}

export function mountMarketRoutes(host: MarketHost, config: MarketConfig): () => void {
  const disposers: Array<() => void> = []

  disposers.push(host.webServer.register({
    kind: 'exact',
    path: '/dsh-store/registry',
    handler: async (request, response) => {
      if (request.method !== 'GET') {
        response.writeHead(405, { allow: 'GET' })
        response.end()
        return
      }
      const url = new URL(request.url ?? '/', 'http://localhost')
      const force = url.searchParams.get('force') === '1'
      const { registry, refreshing } = await loadRegistry(config.profile, config.githubToken, { force, registryUrl: config.registryUrl })
      sendJson(response, 200, { registry, refreshing, fetchAt: new Date().toISOString(), progress: { ...progress } })
    },
  }))

  disposers.push(host.webServer.register({
    kind: 'exact',
    path: '/dsh-store/status',
    handler: (request, response) => {
      if (request.method !== 'GET') {
        response.writeHead(405, { allow: 'GET' })
        response.end()
        return
      }
      const manifest = readProfileManifest(config.profile)
      sendJson(response, 200, {
        version: marketVersion(),
        refreshing: progress.running,
        progress: { ...progress },
        install: { ...installState },
        installed: manifest.dependencies,
        bundles: manifest.bundles,
        tokenConfigured: config.githubToken !== '',
        registryUrl: config.registryUrl,
        rateLimit: lastRateInfo(),
      })
    },
  }))

  disposers.push(host.webServer.register({
    kind: 'exact',
    path: '/dsh-store/install',
    handler: async (request, response) => {
      if (request.method !== 'POST' || !sameOrigin(request)) {
        response.writeHead(405, { allow: 'POST' })
        response.end()
        return
      }
      let body: Record<string, unknown>
      try {
        body = await readJsonBody(request)
      } catch {
        sendJson(response, 400, { ok: false, error: 'invalid body' })
        return
      }
      const repo = parseRepo(body.repo)
      if (repo === null) {
        sendJson(response, 400, { ok: false, error: 'invalid repo' })
        return
      }
      const npm = typeof body.npm === 'string' && body.npm !== '' ? body.npm : null
      const locked = await withMutationLock(async () => runInstall(config, repo, npm))
      if (locked.busy) {
        sendJson(response, 409, { ok: false, error: 'another plugin operation is running' })
        return
      }
      sendJson(response, 200, locked.value)
    },
  }))

  disposers.push(host.webServer.register({
    kind: 'exact',
    path: '/dsh-store/uninstall',
    handler: async (request, response) => {
      if (request.method !== 'POST' || !sameOrigin(request)) {
        response.writeHead(405, { allow: 'POST' })
        response.end()
        return
      }
      let body: Record<string, unknown>
      try {
        body = await readJsonBody(request)
      } catch {
        sendJson(response, 400, { ok: false, error: 'invalid body' })
        return
      }
      const repo = parseRepo(body.repo)
      const pkgName = typeof body.name === 'string' && /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/i.test(body.name) && body.name.length < 214
        ? body.name
        : null
      if (repo === null && pkgName === null) {
        sendJson(response, 400, { ok: false, error: 'invalid repo or name' })
        return
      }
      const locked = await withMutationLock(async () => runUninstall(config, repo ?? pkgName ?? '', pkgName ?? undefined))
      if (locked.busy) {
        sendJson(response, 409, { ok: false, error: 'another plugin operation is running' })
        return
      }
      sendJson(response, 200, locked.value)
    },
  }))

  // Deep verdict batch for isPlugin: called by the client for unknown entries
  // on the current page. Stops on GitHub rate-limit errors and reports what
  // it managed to check.
  disposers.push(host.webServer.register({
    kind: 'exact',
    path: '/dsh-store/verify',
    handler: async (request, response) => {
      if (request.method !== 'POST' || !sameOrigin(request)) {
        response.writeHead(405, { allow: 'POST' })
        response.end()
        return
      }
      let body: Record<string, unknown>
      try {
        body = await readJsonBody(request)
      } catch {
        sendJson(response, 400, { ok: false, error: 'invalid body' })
        return
      }
      const repos = Array.isArray(body.repos) ? body.repos.filter(parseRepo) : []
      try {
        const verdicts = await verifyRepos(config.profile, config.githubToken, repos.slice(0, 40))
        sendJson(response, 200, { ok: true, verdicts })
      } catch (err) {
        sendJson(response, 200, { ok: false, error: err instanceof Error ? err.message : String(err) })
      }
    },
  }))

  // Data source: custom registry URL (registry.json format). Empty resets to
  // the default CDN index. Not a secret; still same-origin POST only, and only
  // http(s) URLs are accepted (no file:// or javascript: scheme injection).
  disposers.push(host.webServer.register({
    kind: 'exact',
    path: '/dsh-store/source',
    handler: async (request, response) => {
      if (request.method !== 'POST' || !sameOrigin(request)) {
        response.writeHead(405, { allow: 'POST' })
        response.end()
        return
      }
      let body: Record<string, unknown>
      try {
        body = await readJsonBody(request)
      } catch {
        sendJson(response, 400, { ok: false, error: 'invalid body' })
        return
      }
      const url = typeof body.url === 'string' ? body.url.trim() : ''
      if (url !== '') {
        let parsed: URL
        try {
          parsed = new URL(url)
        } catch {
          sendJson(response, 400, { ok: false, error: 'invalid url' })
          return
        }
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          sendJson(response, 400, { ok: false, error: 'only http(s) urls are allowed' })
          return
        }
      }
      config.registryUrl = url
      sendJson(response, 200, { ok: true, registryUrl: config.registryUrl })
    },
  }))

  // Token: set the GitHub token for this process (memory only; never echoed back).
  disposers.push(host.webServer.register({
    kind: 'exact',
    path: '/dsh-store/token',
    handler: async (request, response) => {
      if (request.method !== 'POST' || !sameOrigin(request)) {
        response.writeHead(405, { allow: 'POST' })
        response.end()
        return
      }
      let body: Record<string, unknown>
      try {
        body = await readJsonBody(request)
      } catch {
        sendJson(response, 400, { ok: false, error: 'invalid body' })
        return
      }
      if (typeof body.token !== 'string' || body.token.length > 200) {
        sendJson(response, 400, { ok: false, error: 'invalid token' })
        return
      }
      config.githubToken = body.token.trim()
      sendJson(response, 200, { ok: true })
    },
  }))

  // Publish: add the dsh-plugin topic to a repo the user can push to.
  disposers.push(host.webServer.register({
    kind: 'exact',
    path: '/dsh-store/publish',
    handler: async (request, response) => {
      if (request.method !== 'POST' || !sameOrigin(request) || !notGet(request)) {
        response.writeHead(405, { allow: 'POST' })
        response.end()
        return
      }
      let body: Record<string, unknown>
      try {
        body = await readJsonBody(request)
      } catch {
        sendJson(response, 400, { ok: false, error: 'invalid body' })
        return
      }
      const repo = parseRepo(body.repo)
      if (repo === null) {
        sendJson(response, 400, { ok: false, error: 'invalid repo' })
        return
      }
      if (config.githubToken === '') {
        sendJson(response, 200, {
          ok: false,
          needToken: true,
          hint: 'Add the topic on GitHub (repo page -> About -> Topics -> add "dsh-plugin"), or run: gh api -X PUT repos/' + repo + '/topics -f "names[]=dsh-plugin"',
        })
        return
      }
      try {
        const current = await getRepoTopics(config.githubToken, repo)
        if (body.checkOnly === true) {
          sendJson(response, 200, { ok: true, topics: current.names })
          return
        }
        const names = current.names.includes('dsh-plugin') ? current.names : [...current.names, 'dsh-plugin']
        const updated = await putRepoTopics(config.githubToken, repo, names)
        sendJson(response, 200, { ok: true, topics: updated.names, note: 'GitHub indexes topics within minutes; search for it in the market shortly.' })
      } catch (err) {
        sendJson(response, 200, { ok: false, error: err instanceof Error ? err.message : String(err) })
      }
    },
  }))

  // My repos picker for the publish dialog (token required).
  disposers.push(host.webServer.register({
    kind: 'exact',
    path: '/dsh-store/publish/repos',
    handler: async (request, response) => {
      if (request.method !== 'GET') {
        response.writeHead(405, { allow: 'GET' })
        response.end()
        return
      }
      if (config.githubToken === '') {
        sendJson(response, 200, { ok: false, needToken: true, repos: [] })
        return
      }
      try {
        const repos = await listMyRepos(config.githubToken)
        sendJson(response, 200, { ok: true, repos })
      } catch (err) {
        sendJson(response, 200, { ok: false, error: err instanceof Error ? err.message : String(err) })
      }
    },
  }))

  return () => { for (const dispose of disposers) dispose() }
}
