/**
 * Pure helpers shared between the market section and its dialogs. No React
 * imports, no I/O — fully unit-testable.
 */

export interface MarketEntry {
  name: string
  owner: string
  url: string
  category: string
  description: string
  /** 各语言简介（索引富化的 README.<lang> 首段，lang → 文本）；缺失语言回退英文。 */
  descriptions?: Record<string, string> | null
  stars: number | null
  todayStars: number | null
  created: string | null
  pushed: string | null
  isPlugin: boolean | null
  curated: boolean
  npm: string | null
  avatar: string
  language: string | null
  /** 本地已装但不在市场索引里的包（合成卡片，非 GitHub 仓库条目）。 */
  local?: boolean
  /** npm registry latest version（索引 npm_version）；更新检测数据源。 */
  npmVersion: string | null
  /** repo 根 package.json 的 version（索引 version 字段）。 */
  version: string | null
  /** 仓库默认分支；详情面板拉取 README 用。 */
  defaultBranch: string | null
  /** SPDX license id（索引 license 字段）。 */
  license: string | null
  /** qing3a/dsh-plugin-verify 验证证据；null = 未验证。 */
  verified: { by: string; at: string; reportUrl: string | null } | null
  /** 合规披露；null = 未披露。 */
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
  /** npm 下载量（近 30 天，按需富化）；undefined=未拉取，null=未发布。 */
  downloads?: number | null
  /** npm 总下载量（2019 起累计，按需富化）。 */
  totalDownloads?: number | null
  /** GitHub Releases latest 版本号（按需富化；npm 未发布的仓库用）。 */
  repoVersion?: string | null
  /** 黑名单/剔除条目（exclusions.json）；null=正常条目。 */
  excluded?: { kind: 'excluded' | 'market' | 'leaderboard'; reason: string } | null
  /** dsh.bundle 全树扫描结论（机器可安装性）；null=未扫描。 */
  bundled?: boolean | null
  /** 扫描批次时间（ISO）。 */
  bundledAt?: string | null
  /** registry 包 repository 字段是否回指本仓库（防抢注）。 */
  npmLinked?: boolean | null
  /** pushed_at 距今超过 180 天（腐烂信号）。 */
  dormant?: boolean | null
}

export interface Registry {
  updated: string
  count: number
  source: 'cdn' | 'live' | 'cache' | 'snapshot'
  categories: Record<string, { en: string; zh: string }>
  plugins: MarketEntry[]
}

export type SortKey = 'stars-asc' | 'stars-desc' | 'today-asc' | 'today-desc' | 'created-asc' | 'created-desc' | 'downloads-asc' | 'downloads-desc'
export type PluginKind = 'all' | 'plugin' | 'nonplugin'
export type SinceDays = 0 | 1 | 7 | 30 | 365

export interface ListQuery {
  category: string
  kind: PluginKind
  curatedOnly: boolean
  verifiedOnly: boolean
  installedOnly: boolean
  favOnly: boolean
  query: string
  sort: SortKey
  sinceDays: SinceDays
  lang: string
  scannedOnly: boolean
}

export function visiblePlugins(plugins: MarketEntry[], options: ListQuery, isInstalled?: (p: MarketEntry) => boolean, isFav?: (p: MarketEntry) => boolean): MarketEntry[] {
  const needle = options.query.trim().toLowerCase()
  const now = Date.now()
  const list = plugins.filter((p) => {
    if (options.category !== 'all' && p.category !== options.category) return false
    if (options.kind === 'plugin' && p.isPlugin !== true) return false
    if (options.kind === 'nonplugin' && p.isPlugin === true) return false
    if (options.curatedOnly && !p.curated) return false
    if (options.verifiedOnly && p.verified == null) return false
    if (options.installedOnly && !(isInstalled?.(p) ?? false)) return false
    if (options.favOnly && !(isFav?.(p) ?? false)) return false
    // v1.7.23：已扫描筛选（bundled===true 为机器校验通过）。
    if (options.scannedOnly && p.bundled !== true) return false
    if (options.sinceDays > 0) {
      if (p.pushed === null) return false
      const pushed = Date.parse(p.pushed)
      if (Number.isNaN(pushed) || now - pushed > options.sinceDays * 86_400_000) return false
    }
    if (needle !== '') {
      const hay = (p.name + ' ' + p.owner + ' ' + p.description).toLowerCase()
      if (!hay.includes(needle)) return false
    }
    return true
  })
  const todayRank = (v: number | null): number => (v === null ? Number.NEGATIVE_INFINITY : v)
  const starRank = (v: number | null): number => (v === null ? Number.NEGATIVE_INFINITY : v)
  const createdRank = (v: string | null): number => (v === null ? Number.NEGATIVE_INFINITY : Date.parse(v))
  const sorted = [...list]
  if (options.sort === 'stars-desc') sorted.sort((a, b) => starRank(b.stars) - starRank(a.stars))
  else if (options.sort === 'stars-asc') sorted.sort((a, b) => starRank(a.stars) - starRank(b.stars))
  else if (options.sort === 'today-desc') sorted.sort((a, b) => todayRank(b.todayStars) - todayRank(a.todayStars))
  else if (options.sort === 'today-asc') sorted.sort((a, b) => todayRank(a.todayStars) - todayRank(b.todayStars))
  else if (options.sort === 'created-desc') sorted.sort((a, b) => createdRank(b.created) - createdRank(a.created))
  else if (options.sort === 'created-asc') sorted.sort((a, b) => createdRank(a.created) - createdRank(b.created))
  else if (options.sort === 'downloads-desc' || options.sort === 'downloads-asc') {
    // 下载量排序：null/undefined（未发布/未拉取）恒排尾，之后按 star 兜底（dshmarket 同款语义）
    const dl = (v: number | null | undefined): number => (typeof v === 'number' ? v : Number.NEGATIVE_INFINITY)
    const dir = options.sort === 'downloads-desc' ? 1 : -1
    sorted.sort((a, b) => {
      const da = dl(a.downloads)
      const db = dl(b.downloads)
      if (da !== db) return (db - da) * dir
      return ((b.stars ?? -1) - (a.stars ?? -1)) * dir
    })
  }
  return sorted
}

export function formatDownloads(n: number): string {
  if (n >= 1_000_000) return Math.round(n / 100_000) / 10 + 'M'
  if (n >= 1000) return Math.round(n / 100) / 10 + 'k'
  return String(n)
}

export function formatStars(n: number | null): string {
  if (n === null) return '—'
  if (n >= 1000) {
    const k = n / 1000
    return (k >= 10 ? Math.round(k) : Math.round(k * 10) / 10) + 'k'
  }
  return String(n)
}

/** Relative time like "3 days ago" / "2 years ago". */
export function relativeFromNow(iso: string | null, t: (key: string) => string): string {
  if (iso === null) return '—'
  const time = Date.parse(iso)
  if (Number.isNaN(time)) return '—'
  const diff = Date.now() - time
  if (diff < 0) return t('justNow')
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return t('justNow')
  if (minutes < 60) return t('minsAgo').replace('{0}', String(minutes))
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return t('hoursMinsAgo').replace('{0}', String(hours)).replace('{1}', String(minutes % 60))
  const days = Math.floor(hours / 24)
  if (days < 30) return t('daysAgo').replace('{0}', String(days))
  const months = Math.floor(days / 30)
  if (months < 12) return t('monthsAgo').replace('{0}', String(months))
  const years = Math.floor(months / 12)
  return t('yearsAgo').replace('{0}', String(years))
}

/** Duration between two ISO dates, like "2y 3mo" / "3mo 4d" / "12d". */
export function durationBetween(fromIso: string | null, toIso: string): string {
  if (fromIso === null) return '—'
  const from = Date.parse(fromIso)
  const to = Date.parse(toIso)
  if (Number.isNaN(from) || Number.isNaN(to) || to < from) return '—'
  let days = Math.floor((to - from) / 86_400_000)
  const years = Math.floor(days / 365)
  days -= years * 365
  const months = Math.floor(days / 30)
  days -= months * 30
  if (years > 0) return years + 'y ' + months + 'mo'
  if (months > 0) return months + 'mo ' + days + 'd'
  return days + 'd'
}

export function pageItems(current: number, total: number): Array<number | '…'> {
  if (total <= 7) {
    const all: number[] = []
    for (let i = 1; i <= total; i++) all.push(i)
    return all
  }
  const items: Array<number | '…'> = [1]
  let start = Math.max(2, current - 1)
  let end = Math.min(total - 1, current + 1)
  if (current <= 4) end = 5
  if (current >= total - 3) start = total - 4
  if (start > 2) items.push('…')
  for (let i = start; i <= end; i++) items.push(i)
  if (end < total - 1) items.push('…')
  items.push(total)
  return items
}

/** Category chip order: stable registry order — chips never move around. */
export function orderedCategories(categories: string[], _active: string, _open: boolean): string[] {
  return categories
}

export function avatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0
  return 'hsl(' + (((hash % 360) + 360) % 360) + ' 55% 52%)'
}
