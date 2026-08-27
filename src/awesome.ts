/**
 * awesome-dsh-plugin 人工目录自动保持最新（v1.7.2，需求⑥）：
 * - 数据源：https://awesome-dsh-plugin.com/plugins.json（与 dshmarket 同源，
 *   目录自带 description.{en,zh} 多语言简介 + category/npm/added/stars/downloads）
 * - 进程启动 + 每 24h 拉取一次，转换为 KnownMap 格式缓存在
 *   profiles/<profile>/dsh-mall/awesome-cache.json；
 * - catalog.ts 的 loadKnown() 优先使用该缓存（刷新成功即覆盖），
 *   拉取失败永远回退打包快照（data/awesome-known.json），浏览不中断。
 */

import { readFileSync } from 'node:fs'
import { cacheFile, writeCacheJson } from './cache.ts'
import { CATEGORIES, setKnownOverride } from './catalog.ts'
import type { KnownEntry, KnownMap } from './types.ts'

const AWESOME_URL = 'https://awesome-dsh-plugin.com/plugins.json'
const REFRESH_MS = 24 * 60 * 60 * 1000
const FETCH_TIMEOUT_MS = 30_000

interface AwesomePlugin {
  name?: string
  owner?: string
  category?: string
  npm?: string | null
  description?: { en?: string; zh?: string }
  added?: string
}

let activeDisposer: (() => void) | null = null

function cachePath(profile: string): string {
  return cacheFile(profile, 'awesome-cache.json')
}

function toKnown(list: AwesomePlugin[]): KnownMap {
  const out: KnownMap = {}
  for (const p of list) {
    if (typeof p.owner !== 'string' || typeof p.name !== 'string' || p.owner === '' || p.name === '') continue
    const key = (p.owner + '/' + p.name).toLowerCase()
    const category = p.category !== undefined && CATEGORIES[p.category] !== undefined ? p.category : 'other'
    const entry: KnownEntry = {
      name: p.name,
      category,
      npm: typeof p.npm === 'string' && p.npm !== '' ? p.npm : null,
      description: {
        en: typeof p.description?.en === 'string' && p.description.en !== '' ? p.description.en : undefined,
        zh: typeof p.description?.zh === 'string' && p.description.zh !== '' ? p.description.zh : undefined,
      },
      added: typeof p.added === 'string' && p.added !== '' ? p.added : undefined,
    }
    out[key] = entry
  }
  return out
}

/** 拉取一次并写缓存；失败抛错（由调用方决定重试节奏）。 */
export async function refreshAwesome(profile: string, signal?: AbortSignal): Promise<{ count: number }> {
  const timeout = AbortSignal.timeout(FETCH_TIMEOUT_MS)
  const requestSignal = signal === undefined ? timeout : AbortSignal.any([signal, timeout])
  const res = await fetch(AWESOME_URL, {
    headers: { accept: 'application/json', 'user-agent': 'dsh-mall' },
    signal: requestSignal,
  })
  if (!res.ok) throw new Error('awesome catalog HTTP ' + res.status)
  const body = (await res.json()) as { plugins?: AwesomePlugin[] }
  if (!Array.isArray(body.plugins) || body.plugins.length === 0) throw new Error('awesome catalog empty')
  const known = toKnown(body.plugins)
  const count = Object.keys(known).length
  if (count < 100) throw new Error('awesome catalog suspiciously small (' + count + ')')
  signal?.throwIfAborted()
  writeCacheJson(profile, 'awesome-cache.json', { at: new Date().toISOString(), count, known })
  setKnownOverride(known)
  return { count }
}

/** 进程启动：先读本地缓存（立即生效），再后台拉最新；返回本代专属 disposer。 */
export function startAwesomeRefresh(profile: string): () => void {
  activeDisposer?.()
  try {
    const cached = JSON.parse(readFileSync(cachePath(profile), 'utf8')) as { known?: KnownMap }
    if (cached.known !== undefined && Object.keys(cached.known).length > 0) setKnownOverride(cached.known)
  } catch { /* 无缓存：用打包快照 */ }

  const controller = new AbortController()
  let timer: NodeJS.Timeout | null = null
  let inFlight: Promise<void> | null = null
  let disposed = false
  const run = (): void => {
    if (disposed || inFlight !== null) return
    let task: Promise<void>
    task = refreshAwesome(profile, controller.signal)
      .then(() => undefined)
      .catch(() => { /* 网络失败：保持现有缓存/快照，24h 后重试 */ })
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

/** 兼容旧调用：停止当前 awesome refresh owner。 */
export function stopAwesomeRefresh(): void {
  activeDisposer?.()
}
