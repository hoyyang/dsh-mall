/**
 * 中文打标数据保持最新（v1.7.52）：dsh-market-index 的 tags.json（手动/半自动
 * LLM 打标产物，独立于 registry.json，见 scripts/tag-zh.mjs）——
 * 进程启动 + 每 24h 拉取一次，写入 profiles/<p>/dsh-mall/tags-cache.json，
 * 经 setTagsOverride 挂到 catalog 的条目上（tagsZh 字段）。
 * 拉取失败永远保留上次缓存/空值，浏览不中断；打标结果无需商场升版本即可分发。
 */

import { readFileSync } from 'node:fs'
import { cacheFile, writeCacheJson } from './cache.ts'
import { setTagsOverride } from './catalog.ts'

const TAGS_URLS = [
  'https://raw.githubusercontent.com/hoyyang/dsh-market-index/main/tags.json',
  'https://cdn.jsdelivr.net/gh/hoyyang/dsh-market-index@main/tags.json',
]
const REFRESH_MS = 24 * 60 * 60 * 1000
const FETCH_TIMEOUT_MS = 30_000

type TagMap = Record<string, { descriptions: Record<string, string>; tagsZh: string[]; tagsEn: string[] }>
let activeDisposer: (() => void) | null = null

function cachePath(profile: string): string {
  return cacheFile(profile, 'tags-cache.json')
}

/** 拉取一次并写缓存；失败抛错（由调用方决定重试节奏）。 */
export async function refreshTags(profile: string, signal?: AbortSignal): Promise<{ count: number }> {
  let lastError: Error | null = null
  for (const url of TAGS_URLS) {
    try {
      const timeout = AbortSignal.timeout(FETCH_TIMEOUT_MS)
      const requestSignal = signal === undefined ? timeout : AbortSignal.any([signal, timeout])
      const res = await fetch(url, {
        headers: { accept: 'application/json', 'user-agent': 'dsh-mall' },
        signal: requestSignal,
      })
      if (!res.ok) throw new Error('tags HTTP ' + res.status)
      const body = (await res.json()) as { entries?: Record<string, { descriptions?: Record<string, string>; descriptionZh?: string; tags?: { zh?: string[]; en?: string[] }; tagsZh?: string[] }> }
      if (body.entries === undefined || typeof body.entries !== 'object') throw new Error('tags.json 结构不对')
      const entries: TagMap = {}
      for (const [key, value] of Object.entries(body.entries)) {
        if (value === null || typeof value !== 'object') continue
        const descriptions: Record<string, string> = {}
        if (value.descriptions !== undefined && typeof value.descriptions === 'object') {
          for (const [lang, text] of Object.entries(value.descriptions)) {
            if (typeof text === 'string' && text !== '') descriptions[lang] = text.slice(0, 200)
          }
        }
        const tagsZh = Array.isArray(value.tags?.zh) ? value.tags.zh.filter((t): t is string => typeof t === 'string' && t !== '').slice(0, 6) : []
        const tagsEn = Array.isArray(value.tags?.en) ? value.tags.en.filter((t): t is string => typeof t === 'string' && t !== '').slice(0, 6) : []
        if (Object.keys(descriptions).length === 0 && tagsZh.length === 0 && tagsEn.length === 0) continue
        entries[key.toLowerCase()] = { descriptions, tagsZh, tagsEn }
      }
      const count = Object.keys(entries).length
      if (count < 10) throw new Error('tags.json 可疑地小（' + count + '）')
      signal?.throwIfAborted()
      writeCacheJson(profile, 'tags-cache.json', { at: new Date().toISOString(), count, entries })
      setTagsOverride(entries)
      return { count }
    } catch (error) {
      if (signal?.aborted === true) throw error
      lastError = error instanceof Error ? error : new Error(String(error))
    }
  }
  throw lastError ?? new Error('tags fetch failed')
}

/** 进程启动：先读本地缓存（立即生效），再后台拉最新；返回本代专属 disposer。 */
export function startTagsRefresh(profile: string): () => void {
  activeDisposer?.()
  try {
    const cached = JSON.parse(readFileSync(cachePath(profile), 'utf8')) as { entries?: TagMap }
    if (cached.entries !== undefined && Object.keys(cached.entries).length > 0) setTagsOverride(cached.entries)
  } catch { /* 无缓存：目录无标签 */ }

  const controller = new AbortController()
  let timer: NodeJS.Timeout | null = null
  let inFlight: Promise<void> | null = null
  let disposed = false
  const run = (): void => {
    if (disposed || inFlight !== null) return
    let task: Promise<void>
    task = refreshTags(profile, controller.signal)
      .then(() => undefined)
      .catch(() => { /* 网络失败：保持现有缓存，24h 后重试 */ })
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

/** 兼容旧调用：停止当前 tags refresh owner。 */
export function stopTagsRefresh(): void {
  activeDisposer?.()
}
