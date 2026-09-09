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

/** README practical v3：索引输出去重后的加权证据单元；商城统一决定维度权重。 */
export interface ReadmePracticalEvidence {
  version: 3
  parserRevision: 3
  capabilityItems: number
  usageItems: number
  usageActions: number
  ioPairs: number
  codeExamples: number
  usecaseItems: number
  outputItems: number
  media: number
  reliabilityItems: number
  /** 解析置信仅用于审计与 UI 提示，绝不乘入实用分。 */
  confidence: {
    overall: number
    coverage: number
    fallbackShare: number
  }
}

export interface ReadmeSig {
  len: number | null
  installSection: boolean
  codeBlocks: number
  heading: boolean
  cmds: string[]
  needsConfig: boolean
  practical: ReadmePracticalEvidence | null
}

/** 技术身份与目录政策正交：只有可审计证据才能给确定结论。 */
export type PluginStatus = 'verified-plugin' | 'verified-non-plugin' | 'conflict' | 'unknown'
export type PluginEvidence =
  | 'manifest-contract'
  | 'index-bundle-scan'
  | 'index-verified-install'
  | 'independent-verification'
  | 'index-non-plugin'

export interface DownloadCacheEntry {
  at: number
  value: number | null
  /** npm 官方 point 响应覆盖区间；旧缓存缺失时强制刷新补齐。 */
  start?: string
  end?: string
}

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
  /** 兼容投影：true/false 仅代表已验证，null = 未知或证据冲突。 */
  isPlugin: boolean | null
  /** 技术身份状态；目录排除政策单独见 excluded。 */
  pluginStatus: PluginStatus
  /** 得出技术身份所用的可审计证据。 */
  pluginEvidence: PluginEvidence[]
  /** 评分 p99 人口兼容字段；仅冻结 v1.8.2 基线，不参与技术身份/UI。 */
  scoreBaselineEligible?: boolean
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
  /** v1.7.47+：仓库 forks 数（索引 v1.18 起提供；评分热度维度）。 */
  forks?: number | null
  /** v1.7.47+：open issues 数（索引 v1.18 起提供；评分维护维度）。 */
  openIssues?: number | null
  /** v1.7.47+：仓库 homepage（索引 v1.18 起提供；评分信号维度）。 */
  homepage?: string | null
  /** v1.7.52+：中文功能标签（tags.json 手动 LLM 打标产物，CDN 分发）。 */
  tagsZh?: string[]
  /** v1.7.53+：英文功能标签（多语言打标产物）。 */
  tagsEn?: string[]
  /** v1.7.53+：多语言打标简介（lang → 一句话简介）。 */
  tagDescriptions?: Record<string, string>
  /** v1.7.50+：索引 CI README 结构信号（评分实用/便捷两维静态数据源；
   *  字段齐全时目录加载即可算完整五维，无需运行时拉 README）。 */
  readmeSig?: ReadmeSig | null
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
  /** npm 下载量（近 30 天，npm API 按需富化）；undefined=未拉取，null=未发布。 */
  downloads?: number | null
  /** npm API 实际返回区间内的下载量（按需富化；不承诺固定起点）。 */
  totalDownloads?: number | null
  /** npm 官方统计截止/本地查询时间；与数字一起按需富化。 */
  downloadFreshness?: {
    periodStart: string | null
    periodEnd: string | null
    totalPeriodStart: string | null
    totalPeriodEnd: string | null
    queriedAt: string | null
    totalQueriedAt: string | null
  } | null
  /** GitHub Releases latest 版本号（按需富化；npm 未发布的仓库用）。 */
  repoVersion?: string | null
  /** 黑名单/剔除条目（v1.7.22，exclusions.json）：kind=excluded 非插件或蹭 topic、
   *  market=市场目录本身、leaderboard=不进榜单但可见；reason=公开剔除理由。 */
  excluded?: { kind: 'excluded' | 'market' | 'leaderboard'; reason: string } | null
  /** v1.7.23+：dsh.bundle 全树扫描结论（机器可安装性）；null=未扫描。 */
  bundled?: boolean | null
  /** v1.7.23+：扫描批次时间（ISO）。 */
  bundledAt?: string | null
  /** v1.7.23+：registry 包 repository 字段是否回指本仓库（防抢注）；null=未校验。 */
  npmLinked?: boolean | null
  /** v1.7.23+：pushed_at 距今超过 180 天（腐烂信号）。 */
  dormant?: boolean | null
  /** v1.7.45+：skill 型检测（根 SKILL.md / skills/ 目录）；null=未扫描。 */
  hasSkill?: boolean | null
  /** v1.7.45+：实用五维评分（目录加载算基础分，README 富化后补全）。 */
  score?: {
    total: number | null
    breakdown: {
      maintain: number | null
      practical: number | null
      popularity: number | null
      ease: number | null
      signal: number
    }
    confidence: number
    explanation: { zh: string; en: string }
    complete: boolean
    starsAt?: number | null
    pushedAt?: string | null
    dlActiveAt?: boolean
    dl30At?: number | null
    practicalEvidenceAt?: string | null
  } | null
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
  /** 最新一次成功抓取的星数（滚动更新，跨天时作为下一天的基线来源）。 */
  stars: Record<string, number>
  /** 今日基线（v1.7.43：跨天时用昨日 stars 作为今日基线，今日=相对昨日末次）。 */
  base?: Record<string, number>
}

export interface MarketState {
  starsSnapshot?: StarsSnapshot
  /** owner/repo -> 已验证的正证据；v1.8.3 起不再持久化根 manifest 的负猜测。 */
  verdicts: Record<string, true>
  /** v1.7.75: install/update timestamps (pkg -> ms), compared with process start. */
  installs?: Record<string, number>
  /** 收藏条目（小写 owner/repo 或 local:包名），持久化在 profile 的 dsh-mall/state.json。 */  favorites?: string[]
  /** 更新前快照（包名 → 旧 spec/版本），「回退到上个版本」数据源。 */
  rollbacks?: Record<string, RollbackEntry>
  /** 「不参与一键更新」的包名列表。 */
  skipUpdates?: string[]
  /** 自动一键更新（开关 + 最近一次运行结果），持久化在 state.json。 */
  autoUpdate?: { enabled: boolean; lastRunAt: string | null; lastUpdated: number; lastMessage: string | null }
  /** npm 下载量缓存：包名 → 官方值、查询时间与统计区间（value null = 未发布）。 */
  downloads?: Record<string, DownloadCacheEntry>
  /** GitHub Releases latest 版本缓存：owner/repo → {at, value}。 */
  repoVersions?: Record<string, { at: number; value: string | null }>
  /** find 工具结果暂存（token → payload）：跟随 session 生命周期（不再 30 分钟过期），
   *  持久化在 state.json，宿主重启不丢；上限 20 条（超出丢最旧）。 */
  findResults?: Record<string, { at: number; payload: unknown }>
  /** 运行时 bundle top-up 扫描缓存：owner/repo → {at, value}（24h TTL）。 */
  bundleScans?: Record<string, { at: number; value: boolean | null }>
  /** v1.7.45：运行时 skill 检测缓存：owner/repo → {at, value}（24h TTL）。 */
  skillScans?: Record<string, { at: number; value: boolean | null }>
  /** v1.7.55：推荐画像持久化——跨天历史快照（同日覆盖/60天上限/半衰期14天聚合）+ 冷启动问卷答案。 */
  recommendProfile?: {
    history?: Array<{ date: string; cats: Record<string, number>; topics: Record<string, number>; tags: Record<string, number>; installs: number }>
    quiz?: { answers: string[]; at: string }
  }
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

/** 已装插件激活状态（借鉴 dshmarket 的激活状态模型，按其语义精简）。 */
export type PluginState = 'live' | 'disabled' | 'restart'

/** 回退快照：更新前记录的旧版本信息，供「回退到上个版本」恢复。 */
export interface RollbackEntry {
  name: string
  from: string
  to: string
  spec: string
  at: string
}
