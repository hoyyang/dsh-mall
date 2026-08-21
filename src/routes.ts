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
import { computeUpdates, compareVersions, fetchLocalizedDescriptions, loadRegistry, progress, readFavorites, readSkipUpdates, readState, setSkipUpdate, toggleFavorite, verifyRepos, writeState } from './catalog.ts'
import { takeResults } from './find.ts'
import { getRepoTopics, lastRateInfo, listMyRepos, putRepoTopics } from './github.ts'
import { installState, patchDisables, pluginStatesOf, readManifest as readProfileManifest, rollbackDep, runDsh, runSelfUpdate } from './install.ts'
import { runInstall, runUninstall, runUpdate, setPluginEnabled, snapshotDep, withMutationLock } from './install.ts'
import { autoUpdateStateOf, setAutoUpdateEnabled, startAutoUpdate, stopAutoUpdate } from './auto-update.ts'

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

/** npm registry 上 dsh-store 的 latest 版本（缓存 10 分钟；查不到 = 尚未发布）。 */
let selfUpdateCache: { at: number; from: string; to: string | null } | null = null
async function selfUpdateInfo(): Promise<{ from: string; to: string | null }> {
  const from = marketVersion()
  if (selfUpdateCache !== null && Date.now() - selfUpdateCache.at < 10 * 60_000) return selfUpdateCache
  let to: string | null = null
  try {
    const res = await fetch('https://registry.npmjs.org/dsh-store/latest', {
      headers: { 'user-agent': 'dsh-store' },
      signal: AbortSignal.timeout(15_000),
    })
    if (res.ok) {
      const body = (await res.json()) as { version?: string }
      if (typeof body.version === 'string' && body.version !== '') to = body.version
    }
  } catch { /* 网络失败：无更新信息 */ }
  if (to !== null && compareVersions(to, from) <= 0) to = null
  selfUpdateCache = { at: Date.now(), from, to }
  return { from, to }
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

export function mountMarketRoutes(host: MarketHost, config: MarketConfig, loaderIds?: Set<string>): () => void {
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
    handler: async (request, response) => {
      if (request.method !== 'GET') {
        response.writeHead(405, { allow: 'GET' })
        response.end()
        return
      }
      const manifest = readProfileManifest(config.profile)
      // 可更新检测随 status 一起下发——与商店所有刷新时机天然对齐。
      let updates: Array<{ name: string; from: string; to: string; repo: string; npm: string }> = []
      try {
        const { registry } = await loadRegistry(config.profile, config.githubToken, {})
        const skip = readSkipUpdates(config.profile)
        updates = computeUpdates(registry, manifest.dependencies, skip)
      } catch { /* registry 不可用时 updates 留空，不阻塞状态 */ }
      // 激活状态（live/disabled/restart）：bundle 装配 + patch 停用判定。 */
      const states = pluginStatesOf(config.profile, manifest)
      const state = readState(config.profile)
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
        updates,
        pluginStates: states,
        rollbacks: state.rollbacks ?? {},
        skipUpdates: state.skipUpdates ?? [],
        patchDisables: patchDisables(config.profile),
        selfUpdate: await selfUpdateInfo(),
        autoUpdate: autoUpdateStateOf(config.profile),
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

  // find 工具结果暂存读取：GET ?id=<token> — 结果浮窗数据源（30 分钟有效）。
  disposers.push(host.webServer.register({
    kind: 'exact',
    path: '/dsh-store/query-result',
    handler: (request, response) => {
      if (request.method !== 'GET') {
        response.writeHead(405, { allow: 'GET' })
        response.end()
        return
      }
      const url = new URL(request.url ?? '/', 'http://localhost')
      const id = url.searchParams.get('id') ?? ''
      if (!/^[a-z0-9]{10,24}$/i.test(id)) {
        sendJson(response, 400, { ok: false, error: 'invalid id' })
        return
      }
      const payload = takeResults(id)
      if (payload === null) {
        sendJson(response, 404, { ok: false, error: 'results expired — re-run /dsh-store' })
        return
      }
      sendJson(response, 200, { ok: true, payload })
    },
  }))

  // 多语言简介按需富化：POST {lang, repos[]} — 抓 README.<lang>.md 首段。
  disposers.push(host.webServer.register({
    kind: 'exact',
    path: '/dsh-store/descriptions',
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
      const lang = typeof body.lang === 'string' && /^[a-z]{2}$/i.test(body.lang) ? body.lang.toLowerCase() : null
      const repos = Array.isArray(body.repos) ? body.repos.filter(parseRepo).slice(0, 48) : []
      if (lang === null || repos.length === 0) {
        sendJson(response, 200, { ok: true, descriptions: {} })
        return
      }
      const descriptions = await fetchLocalizedDescriptions(lang, repos)
      sendJson(response, 200, { ok: true, descriptions })
    },
  }))

  // 启用/停用：cordis.patch.yml 顶层 "- id: X" + disabled 行（官方机制，HMR 生效）。
  disposers.push(host.webServer.register({
    kind: 'exact',
    path: '/dsh-store/toggle',
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
      const name = typeof body.name === 'string' && /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/i.test(body.name) ? body.name : null
      if (name === null || typeof body.enabled !== 'boolean') {
        sendJson(response, 400, { ok: false, error: 'invalid name or enabled' })
        return
      }
      const result = setPluginEnabled(config.profile, name, body.enabled)
      sendJson(response, result.ok ? 200 : 400, result)
    },
  }))

  // 回退到上个版本：恢复更新前快照的 spec → pnpm install。
  disposers.push(host.webServer.register({
    kind: 'exact',
    path: '/dsh-store/rollback',
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
      const name = typeof body.name === 'string' && body.name.length > 0 && body.name.length < 214 ? body.name : null
      if (name === null) {
        sendJson(response, 400, { ok: false, error: 'invalid name' })
        return
      }
      const locked = await withMutationLock(async () => {
        const state = readState(config.profile)
        const restored = rollbackDep(config.profile, name, state)
        writeState(config.profile, state)
        if (restored === null) return { ok: false, message: 'no rollback snapshot for ' + name }
        if (!restored.ok) return restored
        // pnpm install 按恢复后的 spec 装回旧版
        const install = await runDsh(config.profile, ['install'])
        const ok = install.exitCode === 0 && !install.timedOut
        return { ok, message: ok ? restored.message + '. Refresh to activate.' : restored.message + ' — pnpm install failed' }
      })
      if (locked.busy) {
        sendJson(response, 409, { ok: false, error: 'another plugin operation is running' })
        return
      }
      sendJson(response, locked.value.ok ? 200 : 400, locked.value)
    },
  }))

  // 「不参与一键更新」开关：持久化在 state.json。
  disposers.push(host.webServer.register({
    kind: 'exact',
    path: '/dsh-store/skip',
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
      const name = typeof body.name === 'string' && body.name.length > 0 && body.name.length < 214 ? body.name : null
      if (name === null || typeof body.skip !== 'boolean') {
        sendJson(response, 400, { ok: false, error: 'invalid name or skip' })
        return
      }
      const list = setSkipUpdate(config.profile, name, body.skip)
      sendJson(response, 200, { ok: true, skipUpdates: list })
    },
  }))

  // 自动一键更新开关：GET 读状态，POST {enabled} 切换并重排每日定时器。
  disposers.push(host.webServer.register({
    kind: 'exact',
    path: '/dsh-store/auto-update',
    handler: async (request, response) => {
      if (request.method === 'GET') {
        sendJson(response, 200, { ok: true, autoUpdate: autoUpdateStateOf(config.profile) })
        return
      }
      if (request.method !== 'POST' || !sameOrigin(request)) {
        response.writeHead(405, { allow: 'POST, GET' })
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
      if (typeof body.enabled !== 'boolean') {
        sendJson(response, 400, { ok: false, error: 'invalid enabled' })
        return
      }
      const state = setAutoUpdateEnabled(config.profile, body.enabled)
      if (state.enabled) startAutoUpdate(config)
      else stopAutoUpdate()
      sendJson(response, 200, { ok: true, autoUpdate: state })
    },
  }))

  // 商店自身更新：POST 执行 dsh plugin add dsh-store@latest（重启后生效）。
  disposers.push(host.webServer.register({
    kind: 'exact',
    path: '/dsh-store/self-update',
    handler: async (request, response) => {
      if (request.method === 'GET') {
        sendJson(response, 200, await selfUpdateInfo())
        return
      }
      if (request.method !== 'POST' || !sameOrigin(request)) {
        response.writeHead(405, { allow: 'POST' })
        response.end()
        return
      }
      const locked = await withMutationLock(async () => runSelfUpdate(config))
      if (locked.busy) {
        sendJson(response, 409, { ok: false, error: 'another plugin operation is running' })
        return
      }
      sendJson(response, locked.value.ok ? 200 : 400, locked.value)
    },
  }))

  // Updates: POST {names?: string[]} — 更新全部可更新插件（或指定列表），
  // 串行执行 dsh plugin add <name>（不带版本即 latest）。
  disposers.push(host.webServer.register({
    kind: 'exact',
    path: '/dsh-store/update',
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
      const wanted = Array.isArray(body.names)
        ? body.names.filter((n): n is string => typeof n === 'string' && n !== '').slice(0, 50)
        : null
      const manifest = readProfileManifest(config.profile)
      const { registry } = await loadRegistry(config.profile, config.githubToken, {})
      const skip = readSkipUpdates(config.profile)
      let targets = computeUpdates(registry, manifest.dependencies, skip)
      if (wanted !== null) {
        const want = new Set(wanted.map(n => n.toLowerCase()))
        targets = targets.filter(u => want.has(u.name.toLowerCase()))
      }
      if (targets.length === 0) {
        sendJson(response, 200, { ok: true, message: 'No updates.', results: [] })
        return
      }
      const locked = await withMutationLock(async () => {
        // 更新前快照旧 spec —— 「回退到上个版本」数据源（落盘持久化）。
        const state = readState(config.profile)
        for (const target of targets) {
          snapshotDep(config.profile, target.name, String(manifest.dependencies[target.name] ?? target.from), target.to, state)
        }
        writeState(config.profile, state)
        return runUpdate(config, targets)
      })
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

  // Favorites: persisted in the profile's dsh-store/state.json (next to the
  // plugin's other local state), keyed by lowercase owner/repo (or local:name).
  disposers.push(host.webServer.register({
    kind: 'exact',
    path: '/dsh-store/favorites',
    handler: async (request, response) => {
      if (request.method === 'GET') {
        sendJson(response, 200, { favorites: readFavorites(config.profile) })
        return
      }
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
      const key = typeof body.key === 'string' ? body.key.trim().toLowerCase() : ''
      if (key === '' || key.length > 160) {
        sendJson(response, 400, { ok: false, error: 'invalid key' })
        return
      }
      const favorites = toggleFavorite(config.profile, key)
      sendJson(response, 200, { ok: true, favorites })
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
