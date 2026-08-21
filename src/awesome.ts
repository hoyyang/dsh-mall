/**
 * awesome-dsh-plugin 人工目录自动保持最新（v1.7.2，需求⑥）：
 * - 数据源：https://awesome-dsh-plugin.com/plugins.json（与 dshmarket 同源，
 *   目录自带 description.{en,zh} 多语言简介 + category/npm/added/stars/downloads）
 * - 进程启动 + 每 24h 拉取一次，转换为 KnownMap 格式缓存在
 *   profiles/<profile>/dsh-store/awesome-cache.json；
 * - catalog.ts 的 loadKnown() 优先使用该缓存（刷新成功即覆盖），
 *   拉取失败永远回退打包快照（data/awesome-known.json），浏览不中断。
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { CATEGORIES, setKnownOverride } from './catalog.ts'
import type { KnownEntry } from './types.ts'
import type { KnownMap } from './types.ts'

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

let timer: NodeJS.Timeout | null = null

/** KnownMap 覆盖：拉取成功后经 setKnownOverride 写入 catalog。 */
let knownOverride: KnownMap | null = null

function cachePath(profile: string): string {
  const home = process.env.DSH_HOME ?? join(process.env.HOME ?? '', '.dsh')
  return join(home, 'profiles', profile, 'dsh-store', 'awesome-cache.json')
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
export async function refreshAwesome(profile: string): Promise<{ count: number }> {
  const res = await fetch(AWESOME_URL, {
    headers: { accept: 'application/json', 'user-agent': 'dsh-store' },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  })
  if (!res.ok) throw new Error('awesome catalog HTTP ' + res.status)
  const body = (await res.json()) as { plugins?: AwesomePlugin[] }
  if (!Array.isArray(body.plugins) || body.plugins.length === 0) throw new Error('awesome catalog empty')
  const known = toKnown(body.plugins)
  const count = Object.keys(known).length
  if (count < 100) throw new Error('awesome catalog suspiciously small (' + count + ')')
  writeFileSync(cachePath(profile), JSON.stringify({ at: new Date().toISOString(), count, known }))
  knownOverride = known
  setKnownOverride(known)
  return { count }
}

/** 进程启动：先读本地缓存（立即生效），再后台拉最新。 */
export function startAwesomeRefresh(profile: string): void {
  // 已有缓存直接生效（不阻塞目录加载）
  try {
    const cached = JSON.parse(readFileSync(cachePath(profile), 'utf8')) as { known?: KnownMap }
    if (cached.known !== undefined && Object.keys(cached.known).length > 0) {
      knownOverride = cached.known
      setKnownOverride(cached.known)
    }
  } catch { /* 无缓存：用打包快照 */ }
  const run = () => {
    refreshAwesome(profile).catch(() => { /* 网络失败：保持现有缓存/快照，24h 后重试 */ })
  }
  run()
  timer = setInterval(run, REFRESH_MS)
  timer.unref?.()
}

export function stopAwesomeRefresh(): void {
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
}
