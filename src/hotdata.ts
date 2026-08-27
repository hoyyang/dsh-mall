/**
 * 热度数据保持最新（v1.8.0）：dsh-market-index 的 downloads.json（npm 下载统计，
 * CI 每日采集）+ star-history.json（星数 30 天滚动快照，星动量数据源）——
 * 进程启动 + 每 24h 拉取一次，写入 profiles/<p>/dsh-mall/hotdata-cache.json，
 * 经 setHotScores/setDownloadBaselines 注入 score.ts 热度 v2，并 reapplyHotScores
 * 强制重算当前目录（拉取前热度走 star 无偏换算路径，两者同权、身份零加成）。
 * 拉取失败永远保留上次缓存，浏览不中断；数据无需商场升版本即可分发。
 */

import { readFileSync } from 'node:fs'
import { cacheFile, writeCacheJson } from './cache.ts'
import { reapplyHotScores } from './catalog.ts'
import { setDownloadBaselines, setHotScores, type DlStats } from './score.ts'

const BASE = 'https://raw.githubusercontent.com/hoyyang/dsh-market-index/main/'
const BASE_CDN = 'https://cdn.jsdelivr.net/gh/hoyyang/dsh-market-index@main/'
const FILES = ['downloads.json', 'star-history.json'] as const
const REFRESH_MS = 24 * 60 * 60 * 1000
const FETCH_TIMEOUT_MS = 30_000
const MIN_ENTRIES = 10

interface HotPayload {
  dl: Record<string, DlStats>
  starDelta: Record<string, number | null>
  p99dl30: number
  p99dlYTD: number
}

interface DownloadPart {
  dl: Record<string, DlStats>
  p99dl30: number
  p99dlYTD: number
}

type Parser<T> = (body: unknown) => T
let activeDisposer: (() => void) | null = null

function cachePath(profile: string): string {
  return cacheFile(profile, 'hotdata-cache.json')
}

function objectEntries(body: unknown, label: string): Record<string, unknown> {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) throw new Error(label + ' 根结构不对')
  const entries = (body as { entries?: unknown }).entries
  if (entries === null || typeof entries !== 'object' || Array.isArray(entries)) throw new Error(label + ' entries 结构不对')
  return entries as Record<string, unknown>
}

function finiteNonNegative(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) throw new Error(field + ' 必须是非负有限数')
  return value
}

/** p99（与 computeP99Stars 同口径：sorted[floor(0.99·n)]）。 */
function p99Of(nums: number[]): number {
  const sorted = nums.filter(n => Number.isFinite(n) && n > 0).sort((a, b) => a - b)
  if (sorted.length === 0) return 1
  return Math.max(sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.99))], 1)
}

function parseDownloads(body: unknown): DownloadPart {
  const raw = objectEntries(body, 'downloads.json')
  const dl: Record<string, DlStats> = {}
  for (const [key, value] of Object.entries(raw)) {
    if (key === '' || value === null || typeof value !== 'object' || Array.isArray(value)) throw new Error('downloads.json 条目结构不对')
    const item = value as Record<string, unknown>
    dl[key.toLowerCase()] = {
      dl7: finiteNonNegative(item.dl7, key + '.dl7'),
      dl7prev: finiteNonNegative(item.dl7prev, key + '.dl7prev'),
      dl30: finiteNonNegative(item.dl30, key + '.dl30'),
      dlYTD: finiteNonNegative(item.dlYTD, key + '.dlYTD'),
    }
  }
  const count = Object.keys(dl).length
  if (count < MIN_ENTRIES) throw new Error('downloads.json 可疑地小（' + count + '）')
  return {
    dl,
    p99dl30: p99Of(Object.values(dl).map(v => v.dl30)),
    p99dlYTD: p99Of(Object.values(dl).map(v => v.dlYTD)),
  }
}

function parseHistory(body: unknown): Record<string, number | null> {
  const raw = objectEntries(body, 'star-history.json')
  const starDelta: Record<string, number | null> = {}
  for (const [key, value] of Object.entries(raw)) {
    if (key === '' || !Array.isArray(value) || value.length === 0) throw new Error('star-history.json 条目结构不对')
    const pts = value.map((point, index) => {
      if (point === null || typeof point !== 'object' || Array.isArray(point)) throw new Error(key + '[' + index + '] 结构不对')
      const item = point as { d?: unknown; s?: unknown }
      if (typeof item.d !== 'string' || !Number.isFinite(Date.parse(item.d))) throw new Error(key + '[' + index + '].d 日期无效')
      return { d: item.d, s: finiteNonNegative(item.s, key + '[' + index + '].s') }
    }).sort((a, b) => a.d < b.d ? -1 : a.d > b.d ? 1 : 0)
    if (pts.length < 2) { starDelta[key.toLowerCase()] = null; continue }
    const oldest = pts[0]!
    const newest = pts[pts.length - 1]!
    const spanDays = (Date.parse(newest.d) - Date.parse(oldest.d)) / 86_400_000
    starDelta[key.toLowerCase()] = spanDays < 7 ? null : newest.s - oldest.s
  }
  const count = Object.keys(starDelta).length
  if (count < MIN_ENTRIES) throw new Error('star-history.json 可疑地小（' + count + '）')
  return starDelta
}

function validateCachedPayload(value: unknown): HotPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) throw new Error('hotdata cache 结构不对')
  const raw = value as Partial<HotPayload>
  const downloads = parseDownloads({ entries: raw.dl })
  if (raw.starDelta === null || typeof raw.starDelta !== 'object' || Array.isArray(raw.starDelta)) throw new Error('hotdata cache starDelta 结构不对')
  const starDelta: Record<string, number | null> = {}
  for (const [key, delta] of Object.entries(raw.starDelta)) {
    if (delta !== null && (typeof delta !== 'number' || !Number.isFinite(delta))) throw new Error('hotdata cache starDelta 数值无效')
    starDelta[key.toLowerCase()] = delta
  }
  if (Object.keys(starDelta).length < MIN_ENTRIES) throw new Error('hotdata cache starDelta 可疑地小')
  return { dl: downloads.dl, starDelta, p99dl30: downloads.p99dl30, p99dlYTD: downloads.p99dlYTD }
}

async function fetchValid<T>(urls: string[], label: string, parse: Parser<T>, signal?: AbortSignal): Promise<T> {
  let lastError: Error | null = null
  for (const url of urls) {
    try {
      const timeout = AbortSignal.timeout(FETCH_TIMEOUT_MS)
      const requestSignal = signal === undefined ? timeout : AbortSignal.any([signal, timeout])
      const res = await fetch(url, {
        headers: { accept: 'application/json', 'user-agent': 'dsh-mall' },
        signal: requestSignal,
      })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      return parse(await res.json())
    } catch (error) {
      if (signal?.aborted === true) throw error
      lastError = error instanceof Error ? error : new Error(String(error))
    }
  }
  throw new Error(label + ' 双源均失败：' + (lastError?.message ?? 'fetch failed'))
}

function apply(payload: HotPayload): void {
  setHotScores(payload.dl, payload.starDelta)
  setDownloadBaselines(payload.p99dl30, payload.p99dlYTD)
  reapplyHotScores()
}

/** 拉取两个数据文件并应用；失败抛错（调用方保持缓存）。 */
export async function refreshHotData(profile: string, signal?: AbortSignal): Promise<{ dl: number; hist: number }> {
  const [downloads, starDelta] = await Promise.all([
    fetchValid([BASE + FILES[0], BASE_CDN + FILES[0]], FILES[0], parseDownloads, signal),
    fetchValid([BASE + FILES[1], BASE_CDN + FILES[1]], FILES[1], parseHistory, signal),
  ])
  signal?.throwIfAborted()
  const payload: HotPayload = { ...downloads, starDelta }
  const cache: HotPayload & { at: string } = { ...payload, at: new Date().toISOString() }
  writeCacheJson(profile, 'hotdata-cache.json', cache)
  apply(payload)
  return { dl: Object.keys(payload.dl).length, hist: Object.keys(payload.starDelta).length }
}

/** 进程启动：先读本地缓存（立即生效），再后台拉最新；返回本代专属 disposer。 */
export function startHotData(profile: string): () => void {
  activeDisposer?.()
  try { apply(validateCachedPayload(JSON.parse(readFileSync(cachePath(profile), 'utf8')))) } catch { /* 无/坏缓存：走 star 换算 */ }

  const controller = new AbortController()
  let timer: NodeJS.Timeout | null = null
  let inFlight: Promise<void> | null = null
  let disposed = false
  const run = (): void => {
    if (disposed || inFlight !== null) return
    let task: Promise<void>
    task = refreshHotData(profile, controller.signal)
      .then(() => undefined)
      .catch(() => { /* 网络/语义失败：保持现有缓存，24h 后重试 */ })
      .finally(() => { if (inFlight === task) inFlight = null })
    inFlight = task
  }
  const dispose = (): void => {
    if (disposed) return
    disposed = true
    controller.abort()
    if (timer !== null) clearInterval(timer)
    timer = null
    if (activeDisposer === dispose) activeDisposer = null
  }
  activeDisposer = dispose
  run()
  timer = setInterval(run, REFRESH_MS)
  timer.unref?.()
  return dispose
}

/** 兼容旧调用：停止当前 hotdata owner。 */
export function stopHotData(): void {
  activeDisposer?.()
}
