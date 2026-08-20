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
}

export interface Registry {
  updated: string
  count: number
  source: 'cdn' | 'live' | 'cache' | 'snapshot'
  categories: Record<string, { en: string; zh: string }>
  plugins: MarketEntry[]
}

export type SortKey = 'stars-asc' | 'stars-desc' | 'today-asc' | 'today-desc' | 'created-asc' | 'created-desc'
export type PluginKind = 'all' | 'plugin' | 'nonplugin'
export type SinceDays = 0 | 1 | 7 | 30 | 365

export interface ListQuery {
  category: string
  kind: PluginKind
  curatedOnly: boolean
  installedOnly: boolean
  favOnly: boolean
  query: string
  sort: SortKey
  sinceDays: SinceDays
  lang: string
}

export function visiblePlugins(plugins: MarketEntry[], options: ListQuery, isInstalled?: (p: MarketEntry) => boolean, isFav?: (p: MarketEntry) => boolean): MarketEntry[] {
  const needle = options.query.trim().toLowerCase()
  const now = Date.now()
  const list = plugins.filter((p) => {
    if (options.category !== 'all' && p.category !== options.category) return false
    if (options.kind === 'plugin' && p.isPlugin !== true) return false
    if (options.kind === 'nonplugin' && p.isPlugin === true) return false
    if (options.curatedOnly && !p.curated) return false
    if (options.installedOnly && !(isInstalled?.(p) ?? false)) return false
    if (options.favOnly && !(isFav?.(p) ?? false)) return false
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
  return sorted
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
  if (hours < 24) return t('hoursAgo').replace('{0}', String(hours))
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
