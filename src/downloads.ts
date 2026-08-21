/**
 * npm 下载量（近 30 天）按需富化（v1.7.1）：
 * - 数据源：api.npmjs.org/downloads/point/last-month/{pkg1,pkg2,...}（bulk，每批 ≤100）
 * - 缓存：profile 的 dsh-store/state.json（downloads 字段），TTL 24h；
 *   未发布（null）也缓存但 TTL 缩短到 6h（随时可能首次发布）。
 * - 边界：单次请求最多 2000 个包名，批间串行（npm API 对突发敏感）。
 */

import { readState, writeState } from './catalog.ts'

const BULK_LIMIT = 100
const MAX_NAMES_PER_CALL = 2000
const TTL_MS = 24 * 60 * 60 * 1000
const TTL_NULL_MS = 6 * 60 * 60 * 1000
const FETCH_TIMEOUT_MS = 20_000

const PKG_RE = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/i

async function fetchBulk(names: string[]): Promise<Record<string, number | null>> {
  const res = await fetch('https://api.npmjs.org/downloads/point/last-month/' + names.join(','), {
    headers: { 'user-agent': 'dsh-store', accept: 'application/json' },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  })
  if (!res.ok) throw new Error('npm downloads API HTTP ' + res.status)
  const body = (await res.json()) as Record<string, { downloads?: number } | null> & { package?: string }
  const out: Record<string, number | null> = {}
  // 单包响应形状：{ package, downloads, start, end }（非按名字键控）——scoped 包走这个。
  if (typeof body.package === 'string' && body[body.package] === undefined) {
    const single = (body as unknown as { downloads?: number })
    out[body.package] = typeof single.downloads === 'number' ? single.downloads : null
  }
  for (const name of names) {
    if (name === body.package) continue
    const hit = body[name]
    out[name] = hit !== null && hit !== undefined && typeof hit.downloads === 'number' ? hit.downloads : null
  }
  return out
}

/** 补齐缓存：返回全部请求过的包名 → 下载量（null=未发布）。 */
export async function ensureDownloads(profile: string, rawNames: string[]): Promise<Record<string, number | null>> {
  const names = [...new Set(rawNames.filter(n => typeof n === 'string' && PKG_RE.test(n) && n.length < 214))].slice(0, MAX_NAMES_PER_CALL)
  const out: Record<string, number | null> = {}
  if (names.length === 0) return out
  const state = readState(profile)
  const cache = state.downloads ?? {}
  const now = Date.now()
  const missing: string[] = []
  for (const name of names) {
    const hit = cache[name]
    if (hit !== undefined && now - hit.at < (hit.value === null ? TTL_NULL_MS : TTL_MS)) {
      out[name] = hit.value
    } else {
      missing.push(name)
    }
  }
  if (missing.length > 0) {
    // npm bulk API 不支持 scoped 包（报 "scoped packages are not currently
    // supported in bulk lookups"）：scoped 逐个查，非 scoped 批量查。
    const scoped = missing.filter(name => name.startsWith('@'))
    const unscoped = missing.filter(name => !name.startsWith('@'))
    const remember = (name: string, value: number | null | undefined) => {
      if (value === undefined) return
      cache[name] = { at: Date.now(), value }
      out[name] = value
    }
    for (let i = 0; i < unscoped.length; i += BULK_LIMIT) {
      const batch = unscoped.slice(i, i + BULK_LIMIT)
      try {
        const got = await fetchBulk(batch)
        for (const name of batch) remember(name, got[name] ?? null)
      } catch { /* 网络失败：本批不落缓存，下次再试 */ }
    }
    for (const name of scoped) {
      try {
        const got = await fetchBulk([name])
        remember(name, got[name] ?? null)
      } catch { /* 同上 */ }
    }
    state.downloads = cache
    writeState(profile, state)
  }
  return out
}
