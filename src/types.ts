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
  /** 各语言简介（索引富化的 README.<lang> 首段）；缺失语言回退英文。 */
  descriptions?: Record<string, string> | null
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
  /** npm registry latest version (索引 npm_version)；更新检测数据源。 */
  npmVersion: string | null
  /** repo 根 package.json 的 version（索引 version 字段）。 */
  version: string | null
  /** 仓库默认分支；详情面板拉取 README 用。 */
  defaultBranch: string | null
  /** SPDX license id（索引 license 字段）。 */
  license: string | null
  /** qing3a/dsh-plugin-verify 验证证据；null = 未验证。 */
  verified: { by: string; at: string; reportUrl: string | null } | null
  /** 合规披露（cloud/network/offlineMode/apiKeys/jurisdiction/retention）；null = 未披露。 */
  disclosure: {
    cloud: string | null
    network: string | null
    offlineMode: boolean | null
    apiKeys: string[] | null
    jurisdiction: string | null
    retention: string | null
  } | null
  /** 可安装性判定：non-plugin / manual（手工安装）/ null（未判定）。 */
  installable: 'non-plugin' | 'manual' | null
  /** GitHub topics（详情面板展示）。 */
  topics: string[]
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
  kind: 'install' | 'uninstall' | 'update' | null
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
