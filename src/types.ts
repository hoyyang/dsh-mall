/** Shared host-side types for the market data pipeline. */

export interface GhRepo {
  full_name: string
  name: string
  description: string | null
  stargazers_count: number
  created_at: string
  pushed_at: string
  updated_at: string
  topics: string[]
  archived: boolean
  fork: boolean
  html_url: string
  language: string | null
  owner: { login: string; avatar_url: string }
  /** 索引富化出的中文简介（README.zh 首段），可能缺失。 */
  description_zh?: string | null
}

export interface KnownEntry {
  name: string
  category: string
  npm?: string | null
  description?: { en?: string; zh?: string }
  added?: string
}

export type KnownMap = Record<string, KnownEntry>

export interface MarketEntry {
  name: string
  owner: string
  url: string
  category: string
  description: string
  /** 中文简介（README.zh 首段，索引富化）；缺失时前端回退英文。 */
  descriptionZh?: string | null
  /** null when the repo came from the HTML crawl and search never covered it. */
  stars: number | null
  /** Star delta since the last snapshot; null when no baseline exists. */
  todayStars: number | null
  created: string | null
  pushed: string | null
  /** true = verified plugin, false = verified non-plugin, null = unknown. */
  isPlugin: boolean | null
  /** Listed in the awesome-dsh-plugin curated catalog. */
  curated: boolean
  npm: string | null
  avatar: string
  language: string | null
}

export interface Registry {
  updated: string
  count: number
  source: 'cdn' | 'live' | 'cache' | 'snapshot'
  categories: Record<string, { en: string; zh: string }>
  plugins: MarketEntry[]
}

export interface StarsSnapshot {
  date: string
  stars: Record<string, number>
}

export interface MarketState {
  starsSnapshot?: StarsSnapshot
  /** owner/repo -> verdict from package.json deep-check. */
  verdicts: Record<string, boolean>
  /** 收藏条目（小写 owner/repo 或 local:包名），持久化在 profile 的 dsh-store/state.json。 */
  favorites?: string[]
}

export interface InstallState {
  active: boolean
  kind: 'install' | 'uninstall' | null
  phase: string | null
  target: string | null
  line: string | null
  startedAt: number | null
  lastResult: { ok: boolean; message: string } | null
}

export interface RefreshProgress {
  running: boolean
  shard: number
  shards: number
  repos: number
  lastError: string | null
}

export interface MarketConfig {
  profile: string
  githubToken: string
  /** Custom registry source URL (registry.json format); empty = default CDN index. */
  registryUrl: string
}
