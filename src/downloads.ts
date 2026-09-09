/**
 * npm 下载量按需富化：官方 point API + profile 派生缓存。
 * v1.8.3 起缓存并下发 npm 响应的统计区间与本地查询时间，避免把
 * “页面刚查询”误读为“npm 已统计到现在”。
 */

import { readState, writeState } from './catalog.ts'
import type { DownloadCacheEntry } from './types.ts'

const BULK_LIMIT = 100
const MAX_NAMES_PER_CALL = 2000
const TTL_MS = 24 * 60 * 60 * 1000
const TTL_NULL_MS = 6 * 60 * 60 * 1000
const FETCH_TIMEOUT_MS = 20_000

const PKG_RE = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/i

interface PointValue {
  value: number | null
  start?: string
  end?: string
}

export interface DownloadFreshness {
  /** last-month point 响应的统计区间；periodEnd 是 npm 当前可观察截止日。 */
  periodStart: string | null
  periodEnd: string | null
  /** 本地最近一次查询 last-month / total 端点的时间。 */
  totalPeriodStart: string | null
  totalPeriodEnd: string | null
  queriedAt: string | null
  totalQueriedAt: string | null
}

/** 总下载量：npm range 端点（单包才支持任意区间，bulk 上限 365 天）。 */
async function fetchTotal(name: string): Promise<PointValue> {
  const res = await fetch('https://api.npmjs.org/downloads/point/2019-01-01:2030-01-01/' + name, {
    headers: { 'user-agent': 'dsh-mall', accept: 'application/json' },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  })
  if (!res.ok) throw new Error('npm downloads API HTTP ' + res.status)
  const body = (await res.json()) as { downloads?: number; start?: string; end?: string; error?: string }
  return {
    value: typeof body.downloads === 'number' ? body.downloads : null,
    start: typeof body.start === 'string' ? body.start : undefined,
    end: typeof body.end === 'string' ? body.end : undefined,
  }
}

async function fetchBulk(names: string[]): Promise<Record<string, PointValue>> {
  const res = await fetch('https://api.npmjs.org/downloads/point/last-month/' + names.join(','), {
    headers: { 'user-agent': 'dsh-mall', accept: 'application/json' },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  })
  if (!res.ok) throw new Error('npm downloads API HTTP ' + res.status)
  type RawPoint = { downloads?: number; start?: string; end?: string; package?: string }
  const body = (await res.json()) as Record<string, RawPoint | null> & RawPoint
  const out: Record<string, PointValue> = {}
  const point = (raw: RawPoint | null | undefined): PointValue => ({
    value: raw !== null && raw !== undefined && typeof raw.downloads === 'number' ? raw.downloads : null,
    start: raw !== null && raw !== undefined && typeof raw.start === 'string' ? raw.start : undefined,
    end: raw !== null && raw !== undefined && typeof raw.end === 'string' ? raw.end : undefined,
  })
  // 单包响应：{ package, downloads, start, end }；批量响应按包名键控。
  if (typeof body.package === 'string' && body[body.package] === undefined) out[body.package] = point(body)
  for (const name of names) {
    if (name === body.package && out[name] !== undefined) continue
    out[name] = point(body[name])
  }
  return out
}

function cacheFresh(hit: DownloadCacheEntry, now: number, requirePeriod: boolean): boolean {
  const ttl = hit.value === null ? TTL_NULL_MS : TTL_MS
  if (now - hit.at >= ttl) return false
  // 数值型旧缓存没有 npm 区间，强制刷新一次补齐 freshness；null 无区间可接受。
  return !requirePeriod || hit.value === null || typeof hit.end === 'string'
}

/** 补齐缓存：返回全部请求过的包名 → 近 30 天下载量（null=未发布）。 */
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
    if (hit !== undefined && cacheFresh(hit, now, true)) out[name] = hit.value
    else missing.push(name)
  }
  if (missing.length > 0) {
    // npm bulk API 不支持 scoped 包：scoped 逐个查，非 scoped 批量查。
    const scoped = missing.filter(name => name.startsWith('@'))
    const unscoped = missing.filter(name => !name.startsWith('@'))
    const remember = (name: string, point: PointValue | undefined) => {
      if (point === undefined) return
      cache[name] = { at: Date.now(), value: point.value, start: point.start, end: point.end }
      out[name] = point.value
    }
    for (let i = 0; i < unscoped.length; i += BULK_LIMIT) {
      const batch = unscoped.slice(i, i + BULK_LIMIT)
      try {
        const got = await fetchBulk(batch)
        for (const name of batch) remember(name, got[name])
      } catch { /* 网络失败：本批不落缓存，下次再试 */ }
    }
    for (const name of scoped) {
      try {
        const got = await fetchBulk([name])
        remember(name, got[name])
      } catch { /* 同上 */ }
    }
    state.downloads = cache
    writeState(profile, state)
  }
  return out
}

/** 总下载量（2019-01-01 起累计），缓存 key 为 total:<name>。 */
export async function ensureTotals(profile: string, rawNames: string[]): Promise<Record<string, number | null>> {
  const names = [...new Set(rawNames.filter(n => typeof n === 'string' && PKG_RE.test(n) && n.length < 214))].slice(0, 96)
  const out: Record<string, number | null> = {}
  if (names.length === 0) return out
  const state = readState(profile)
  const cache = state.downloads ?? {}
  const now = Date.now()
  for (const name of names) {
    const key = 'total:' + name
    const hit = cache[key]
    if (hit !== undefined && cacheFresh(hit, now, true)) {
      out[name] = hit.value
      continue
    }
    try {
      const point = await fetchTotal(name)
      cache[key] = { at: Date.now(), value: point.value, start: point.start, end: point.end }
      out[name] = point.value
    } catch { /* 网络失败：下次再试 */ }
  }
  state.downloads = cache
  writeState(profile, state)
  return out
}

/** 已落缓存的 npm 数据新鲜度；不发网络请求。 */
export function downloadsFreshnessOf(profile: string, rawNames: string[]): Record<string, DownloadFreshness> {
  const names = [...new Set(rawNames.filter(n => typeof n === 'string' && PKG_RE.test(n) && n.length < 214))]
  const cache = readState(profile).downloads ?? {}
  const out: Record<string, DownloadFreshness> = {}
  for (const name of names) {
    const recent = cache[name]
    const total = cache['total:' + name]
    if (recent === undefined && total === undefined) continue
    out[name] = {
      periodStart: recent?.start ?? null,
      periodEnd: recent?.end ?? null,
      totalPeriodStart: total?.start ?? null,
      totalPeriodEnd: total?.end ?? null,
      queriedAt: recent !== undefined ? new Date(recent.at).toISOString() : null,
      totalQueriedAt: total !== undefined ? new Date(total.at).toISOString() : null,
    }
  }
  return out
}
