/**
 * Catalog pipeline: shard-fetch GitHub topic repos -> classify (curated map,
 * rule categories, isPlugin heuristic/verdicts) -> compute today's star
 * delta from the local snapshot -> serve through an in-memory TTL cache with
 * a bundled snapshot fallback. State (star baselines, verdicts) persists
 * under the profile directory.
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { fetchTopicPages, packageJsonVerdict, searchDshTopicRepos } from './github.ts'

// ------------------------------------------------------------ CDN channel
// Primary source: the community-built static index (GitHub Actions, token
// authenticated, star-segment binary split past the 1000/query cap, rebuilt
// every 2h, daily full refresh) served through jsDelivr — zero API quota on
// the user side. See https://github.com/bradeGithub/DSH-Plugins-Marketplace

const CDN_URLS = [
  // Own index first — raw is always freshest (jsDelivr cache can lag hours).
  'https://raw.githubusercontent.com/hoyyang/dsh-market-index/main/registry.json',
  'https://cdn.jsdelivr.net/gh/hoyyang/dsh-market-index@main/registry.json',
  // Community index as fallback channel.
  'https://raw.githubusercontent.com/bradeGithub/DSH-Plugins-Marketplace/main/registry.json',
  'https://cdn.jsdelivr.net/gh/bradeGithub/DSH-Plugins-Marketplace@main/registry.json',
]
const CDN_MAX_AGE_MS = 6 * 3600 * 1000

interface CdnRepo {
  full_name: string
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  updated_at: string
  topics?: string[]
  license?: string | null
  category?: string
  pkg_name?: string | null
  installable?: 'non-plugin' | 'manual' | undefined
  market_tags?: string[]
  npm_version?: string | null
  npm_pkg_name?: string | null
  version?: string | null
  default_branch?: string | null
  size?: number | null
  verdict?: string | null
  verifiedBy?: string | null
  verifiedAt?: string | null
  reportUrl?: string | null
  disclosure?: {
    cloud?: string | null
    network?: string | null
    offlineMode?: boolean | null
    apiKeys?: string[] | null
    jurisdiction?: string | null
    retention?: string | null
  } | null
}

/** 从索引条目收集 description_<lang> 富化字段为 { lang: 文本 } 映射。 */
function collectDescriptions(repo: Record<string, unknown>): Record<string, string> | null {
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(repo)) {
    if (k.startsWith('description_') && typeof v === 'string' && v !== '') out[k.slice('description_'.length)] = v
  }
  return Object.keys(out).length > 0 ? out : null
}

/** GitHub 仓库 → npm 发布名人工对照表：仓库根没有 package.json（monorepo 等）
 *  导致索引 pkg_name 富化失败时，用这里补上真实发布名（如 tt-a1i/archify 的
 *  DSH 集成发布为 @tt-a1i/archify-dsh），使本地安装能与 GitHub 卡正确关联。 */
const NPM_OVERRIDES: Record<string, string> = {
  'tt-a1i/archify': '@tt-a1i/archify-dsh',
}

/** Map the community index's 12 categories onto the dshmarket category set. */
const CDN_CATEGORY_MAP: Record<string, string> = {
  'web-ui': 'ui',
  tool: 'tools',
  coding: 'dev',
  memory: 'memory',
  other: 'other',
  resource: 'market',
  vision: 'vision',
  agent: 'skill',
  conversation: 'session',
  model: 'model',
  notify: 'notify',
  document: 'docs',
  security: 'security',
}

function cdnEntry(repo: CdnRepo, known: KnownMap, verdicts: Record<string, boolean>): MarketEntry {
  const key = repo.full_name.toLowerCase()
  const knownEntry = known[key]
  const verdict = verdicts[key]
  const [owner, name] = repo.full_name.split('/')
  const rawCategory = repo.category ?? 'other'
  const description = knownEntry?.description?.en ?? knownEntry?.description?.zh ?? repo.description ?? ''
  const topics = repo.topics ?? []
  const hay = (name + ' ' + description + ' ' + topics.join(' ')).toLowerCase()
  let category = knownEntry?.category
  if (category === undefined) {
    // Refine the CDN index's coarse buckets into the dshmarket category set:
    // web-ui splits into theme when skin/theme words hit; fun/workflow have no
    // CDN bucket at all and are picked up by rules instead.
    if (rawCategory === 'web-ui' && /(theme|skin|配色|主题|皮肤)/i.test(hay)) category = 'theme'
    else if (/(game|pet|meme|娱乐|宠物|游戏)/i.test(hay)) category = 'fun'
    else if (/(workflow|automation|scheduler|定时|自动化|工作流)/i.test(hay)) category = 'workflow'
    else category = CDN_CATEGORY_MAP[rawCategory] ?? ruleCategory(name ?? key, description, topics)
  }
  const heuristic = heuristicIsPlugin({ name: name ?? key, description: repo.description, topics })
  let isPlugin = verdict !== undefined ? verdict : heuristic
  if (verdict === undefined) {
    if (repo.installable === 'non-plugin') isPlugin = false
    else if (repo.market_tags?.includes('verified-install') === true || (repo.pkg_name ?? null) !== null) isPlugin = true
  }
  const npm = knownEntry?.npm ?? NPM_OVERRIDES[key] ?? (typeof repo.pkg_name === 'string' && repo.pkg_name !== '' && repo.installable !== 'non-plugin' ? repo.pkg_name : null)
  const verified = typeof repo.verdict === 'string' && repo.verdict !== ''
    ? { by: repo.verifiedBy ?? '', at: repo.verifiedAt ?? '', reportUrl: repo.reportUrl ?? null }
    : null
  const d = repo.disclosure
  return {
    name: name ?? key,
    owner: owner ?? '',
    url: repo.html_url,
    category,
    description: description.length > 200 ? description.slice(0, 200) + '…' : description,
    descriptions: collectDescriptions(repo as unknown as Record<string, unknown>),
    stars: repo.stargazers_count ?? null,
    todayStars: null,
    created: knownEntry?.added ?? null,
    pushed: repo.updated_at ?? null,
    isPlugin,
    curated: knownEntry !== undefined,
    npm,
    avatar: 'https://github.com/' + owner + '.png?size=96',
    language: null,
    npmVersion: typeof repo.npm_version === 'string' && repo.npm_version !== '' ? repo.npm_version : null,
    version: typeof repo.version === 'string' && repo.version !== '' ? repo.version : null,
    defaultBranch: typeof repo.default_branch === 'string' && repo.default_branch !== '' ? repo.default_branch : null,
    license: typeof repo.license === 'string' && repo.license !== '' ? repo.license : null,
    verified,
    disclosure: d !== undefined && d !== null
      ? {
          cloud: d.cloud ?? null,
          network: d.network ?? null,
          offlineMode: d.offlineMode ?? null,
          apiKeys: Array.isArray(d.apiKeys) ? d.apiKeys : null,
          jurisdiction: d.jurisdiction ?? null,
          retention: d.retention ?? null,
        }
      : null,
    installable: repo.installable === 'non-plugin' || repo.installable === 'manual' ? repo.installable : null,
    topics: Array.isArray(repo.topics) ? repo.topics.map(String) : [],
  }
}

/** Decompress a gzip response body (registry.json.gz via jsDelivr/raw). */
async function gunzipText(res: Response): Promise<string> {
  const body = res.body
  if (body === null) throw new Error('empty body')
  const stream = body.pipeThrough(new DecompressionStream('gzip'))
  return new Response(stream).text()
}

/** Fetch one index URL. The .gz variant (6.3MB -> ~1MB) and the plain JSON are
 *  tried IN PARALLEL — whichever answers first wins. This matters on diverse
 *  networks: raw can be fast where jsDelivr times out and vice versa, and the
 *  gz path is dramatically cheaper on slow links. 30s per attempt keeps the
 *  CDN channel budget small so the crawl/snapshot fallbacks engage quickly. */
async function fetchIndexUrl(url: string): Promise<{ generated_at?: string; repos?: CdnRepo[] }> {
  const variants = url.endsWith('.json') ? [url + '.gz', url] : [url]
  const attempt = async (variant: string): Promise<{ generated_at?: string; repos?: CdnRepo[] }> => {
    const res = await fetch(variant, {
      headers: { accept: 'application/json', 'accept-encoding': 'gzip', 'user-agent': 'dsh-store' },
      signal: AbortSignal.timeout(30_000),
    })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    const contentEncoding = (res.headers.get('content-encoding') ?? '').toLowerCase()
    const raw = contentEncoding.includes('gzip') || variant.endsWith('.gz')
      ? await gunzipText(res)
      : await res.text()
    return JSON.parse(raw) as { generated_at?: string; repos?: CdnRepo[] }
  }
  const results = await Promise.allSettled(variants.map(attempt))
  for (const result of results) {
    if (result.status === 'fulfilled') return result.value
  }
  const reason = results.find((r): r is PromiseRejectedResult => r.status === 'rejected')?.reason
  throw new Error('index fetch failed: ' + (reason instanceof Error ? reason.message : String(reason)))
}

async function fetchCdnRegistry(profile: string, customUrl: string): Promise<Registry> {
  let lastError = ''
  // A user-configured source (settings card or DSH_STORE_REGISTRY_URL env) is
  // tried first; the default CDN index remains the fallback when it fails.
  const urls = customUrl.trim() !== '' ? [customUrl.trim(), ...CDN_URLS] : CDN_URLS
  for (const url of urls) {
    try {
      const body = await fetchIndexUrl(url)
      if (!Array.isArray(body.repos) || body.repos.length === 0) throw new Error('empty index')
      const age = Date.now() - Date.parse(body.generated_at ?? '')
      if (Number.isFinite(age) && age > CDN_MAX_AGE_MS) throw new Error('index too old (' + Math.round(age / 3600_000) + 'h)')
      const known = loadKnown()
      const verdicts = verdictsOf(profile)
      const entries = body.repos.map(repo => cdnEntry(repo, known, verdicts))
      const withDelta = computeTodayStars(profile, entries)
      return normalizeCategories({
        updated: body.generated_at ?? new Date().toISOString(),
        count: withDelta.length,
        source: 'cdn',
        categories: CATEGORIES,
        plugins: withDelta,
      })
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err)
    }
  }
  throw new Error('CDN index unavailable: ' + lastError)
}
import type { GhRepo, KnownMap, MarketEntry, MarketState, Registry, RefreshProgress } from './types.ts'

export const CATEGORIES: Record<string, { en: string; zh: string }> = {
  ui: { en: 'UI Enhancements', zh: 'UI 增强' },
  usage: { en: 'Usage & Billing', zh: '用量与计费' },
  theme: { en: 'Themes & Appearance', zh: '主题与外观' },
  model: { en: 'Models & Providers', zh: '模型与账号接入' },
  session: { en: 'Sessions & Messages', zh: '会话与消息' },
  memory: { en: 'Memory', zh: '记忆' },
  tools: { en: 'Tools & Capabilities', zh: '工具与能力' },
  browser: { en: 'Browser & Web', zh: '浏览器与网页' },
  vision: { en: 'Vision & Multimodal', zh: '视觉与多模态' },
  voice: { en: 'Voice & Audio', zh: '语音与音频' },
  docs: { en: 'Docs & Rendering', zh: '文档与渲染' },
  skill: { en: 'Skills', zh: '技能包' },
  workflow: { en: 'Workflow & Automation', zh: '工作流与自动化' },
  git: { en: 'Git & Code Review', zh: 'Git 与代码评审' },
  notify: { en: 'Notifications & Integrations', zh: '通知与集成' },
  dev: { en: 'Development & Runtime', zh: '开发与运行时' },
  security: { en: 'Security & Permissions', zh: '安全与权限' },
  remote: { en: 'Remote & Mobile', zh: '远程与移动端' },
  market: { en: 'Plugin Markets & Managers', zh: '插件市场与管理' },
  fun: { en: 'Just for Fun', zh: '娱乐' },
  other: { en: 'Others', zh: '其他' },
}

const TTL_MS = 30 * 60 * 1000
let cache: { at: number; data: Registry } | null = null

function dataPath(name: string): string {
  return fileURLToPath(new URL('../data/' + name, import.meta.url))
}

/** Bundled curated catalog: owner/repo -> category/npm/localized text. */
let knownCache: KnownMap | null = null
export function loadKnown(): KnownMap {
  if (knownCache !== null) return knownCache
  try {
    knownCache = JSON.parse(readFileSync(dataPath('awesome-known.json'), 'utf8')) as KnownMap
  } catch {
    knownCache = {}
  }
  return knownCache
}

/** Keep only categories that actually have entries; 'other' always stays. */
function normalizeCategories(registry: Registry): Registry {
  const counts = new Map<string, number>()
  for (const p of registry.plugins) counts.set(p.category, (counts.get(p.category) ?? 0) + 1)
  const categories: Record<string, { en: string; zh: string }> = {}
  for (const id of Object.keys(CATEGORIES)) {
    if ((counts.get(id) ?? 0) > 0 || id === 'other') categories[id] = CATEGORIES[id]!
  }
  registry.categories = categories
  return registry
}

function snapshot(): Registry {
  try {
    const parsed = JSON.parse(readFileSync(dataPath('registry-snapshot.json'), 'utf8')) as Registry
    parsed.source = 'snapshot'
    return normalizeCategories(parsed)
  } catch {
    return { updated: new Date().toISOString(), count: 0, source: 'snapshot', categories: CATEGORIES, plugins: [] }
  }
}

// ---------------------------------------------------------------- state I/O

export function stateFile(profile: string): string {
  const home = process.env.DSH_HOME ?? join(process.env.HOME ?? '', '.dsh')
  return join(home, 'profiles', profile, 'dsh-store', 'state.json')
}

export function readState(profile: string): MarketState {
  try {
    return JSON.parse(readFileSync(stateFile(profile), 'utf8')) as MarketState
  } catch {
    return { verdicts: {} }
  }
}

export function writeState(profile: string, state: MarketState): void {
  try {
    const file = stateFile(profile)
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, JSON.stringify(state, null, 2))
  } catch { /* state writes must never break browsing */ }
}

export function verdictsOf(profile: string): Record<string, boolean> {
  return readState(profile).verdicts ?? {}
}

export function readFavorites(profile: string): string[] {
  return readState(profile).favorites ?? []
}

export function toggleFavorite(profile: string, key: string): string[] {
  const state = readState(profile)
  const list = state.favorites ?? []
  const hit = list.findIndex((k) => k === key)
  if (hit >= 0) list.splice(hit, 1)
  else list.push(key)
  state.favorites = list
  writeState(profile, state)
  return list
}

export function applyVerdicts(profile: string, updates: Record<string, boolean>): void {
  const state = readState(profile)
  state.verdicts = { ...(state.verdicts ?? {}), ...updates }
  writeState(profile, state)
}

// ------------------------------------------------------- update detection

/** 可更新插件：已装依赖 spec 里的版本 vs 索引 npm_version（npm registry latest）。 */
export interface PluginUpdate {
  /** profile 依赖键名（npm 包名） */
  name: string
  /** 已装版本 */
  from: string
  /** npm 最新版本 */
  to: string
  /** 对应 GitHub 仓库 owner/repo（可能为空） */
  repo: string
  /** 索引里的 npm 发布名 */
  npm: string
}

const VERSION_RE = /v?(\d+)\.(\d+)\.(\d+)(?:[-+][0-9A-Za-z.-]+)?/

/** 从依赖 spec（^1.2.3 / 1.2.3 / npm:x@1.2.3 / github:...#semver:1.2.3）提取 x.y.z。 */
export function extractVersion(spec: string): string | null {
  const m = VERSION_RE.exec(String(spec))
  return m === null ? null : m[1] + '.' + m[2] + '.' + m[3]
}

/** 语义化三段版本比较：a<b → 负数；相等 → 0；a>b → 正数。 */
export function compareVersions(a: string, b: string): number {
  const pa = a.split('.').map(Number)
  const pb = b.split('.').map(Number)
  for (let i = 0; i < 3; i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0)
    if (d !== 0) return d
  }
  return 0
}

/** 已装依赖 × 目录索引：npm 最新版 > 已装版 → 可更新。link/file 安装跳过；无版本 spec 跳过。 */
export function computeUpdates(registry: Registry, deps: Record<string, string>): PluginUpdate[] {
  const out: PluginUpdate[] = []
  const seen = new Set<string>()
  for (const [name, spec] of Object.entries(deps)) {
    const s = String(spec).trim()
    if (s.startsWith('link:') || s.startsWith('file:')) continue
    const from = extractVersion(s)
    if (from === null) continue
    const lower = name.toLowerCase()
    let hit: MarketEntry | null = null
    for (const p of registry.plugins) {
      if (p.npm !== null && p.npm.toLowerCase() === lower) { hit = p; break }
      if (p.name.toLowerCase() === lower) { hit = p; break }
    }
    if (hit === null || hit.npmVersion === null) continue
    if (compareVersions(hit.npmVersion, from) <= 0) continue
    if (seen.has(lower)) continue
    seen.add(lower)
    out.push({ name, from, to: hit.npmVersion, repo: hit.owner + '/' + hit.name, npm: hit.npm ?? name })
  }
  out.sort((a, b) => a.name.localeCompare(b.name))
  return out
}

// ------------------------------------------------------------- classification

const CATEGORY_RULES: Array<{ category: string; re: RegExp }> = [
  { category: 'theme', re: /(theme|skin|appearance|配色|主题|皮肤)/i },
  { category: 'usage', re: /(usage|billing|balance|quota|token[- ]?usage|用量|计费|余额)/i },
  { category: 'vision', re: /(vision|ocr|multimodal|screenshot|识图|视觉|多模态|截图)/i },
  { category: 'voice', re: /(voice|audio|speech|tts|stt|语音|音频|朗读)/i },
  { category: 'docs', re: /(pdf|docx|excel|markdown|render|文档|渲染|表格)/i },
  { category: 'git', re: /(\bgit\b|commit|review|diff|merge|代码评审|提交)/i },
  { category: 'security', re: /(security|permission|sandbox|auth|安全|权限|沙箱)/i },
  { category: 'remote', re: /(remote|mobile|android|ios|desktop|远程|移动端|桌面)/i },
  { category: 'browser', re: /(browser|web[- ]?page|chrome|puppeteer|playwright|浏览器|网页)/i },
  { category: 'model', re: /(provider|model|api[- ]?key|endpoint|llm|deepseek[- ]api)/i },
  { category: 'session', re: /(session|conversation|history|export|import|会话|对话)/i },
  { category: 'memory', re: /(memory|remember|recall|记忆)/i },
  { category: 'tools', re: /(mcp|tool|search|翻译|搜索)/i },
  { category: 'skill', re: /(skill|prompt|agent-preset|技能)/i },
  { category: 'workflow', re: /(workflow|automation|scheduler|task|定时|自动化|工作流)/i },
  { category: 'notify', re: /(notify|notification|push|wechat|wecom|telegram|feishu|邮件|通知)/i },
  { category: 'dev', re: /(dev|debug|log|terminal|cli|ssh|code|诊断|日志|开发)/i },
  { category: 'market', re: /(market|plugin[- ]?manager|插件市场|plugin hub)/i },
  { category: 'fun', re: /(pet|game|fun|meme|娱乐|宠物|游戏)/i },
]

function ruleCategory(name: string, description: string, topics: string[]): string {
  const hay = (name + ' ' + description + ' ' + topics.join(' ')).toLowerCase()
  for (const rule of CATEGORY_RULES) if (rule.re.test(hay)) return rule.category
  return 'other'
}

const PLUGIN_NAME_RE = /(^dsh[-_]|[-_]dsh[-_]|dsh[-_]plugin|dshplugin)/i
const DSH_HINT_RE = /(dsh|deepseek[ -]?harness|cordis)/i

export function heuristicIsPlugin(repo: { name: string; description: string | null; topics: string[] }): boolean | null {
  const hay = (repo.name + ' ' + (repo.description ?? '') + ' ' + repo.topics.join(' ')).toLowerCase()
  if (!DSH_HINT_RE.test(hay)) return false
  if (PLUGIN_NAME_RE.test(hay)) return true
  if (/(plugin|插件)\b/i.test(hay)) return true
  return null
}

function buildEntry(
  fullName: string,
  known: KnownMap,
  verdicts: Record<string, boolean>,
  search: GhRepo | undefined,
  html: { pushed_at: string | null; language: string | null } | undefined,
): MarketEntry {
  const key = fullName.toLowerCase()
  const knownEntry = known[key]
  const verdict = verdicts[key]
  const name = search?.name ?? fullName.split('/')[1] ?? fullName
  const owner = search?.owner.login ?? fullName.split('/')[0] ?? ''
  const description = knownEntry?.description?.en
    ?? knownEntry?.description?.zh
    ?? search?.description
    ?? ''
  const topics = search?.topics ?? []
  const heuristic = heuristicIsPlugin({ name, description: search?.description ?? null, topics })
  const isPlugin = verdict !== undefined ? verdict : heuristic
  return {
    name,
    owner,
    url: search?.html_url ?? 'https://github.com/' + fullName,
    category: knownEntry?.category ?? ruleCategory(name, description, topics),
    description: description.length > 200 ? description.slice(0, 200) + '…' : description,
    descriptions: search !== undefined ? collectDescriptions(search as unknown as Record<string, unknown>) : null,
    stars: search?.stargazers_count ?? null,
    todayStars: null,
    created: search?.created_at ?? null,
    pushed: search?.pushed_at ?? html?.pushed_at ?? null,
    isPlugin,
    curated: knownEntry !== undefined,
    npm: knownEntry?.npm ?? NPM_OVERRIDES[key] ?? null,
    avatar: search?.owner.avatar_url ?? 'https://github.com/' + owner + '.png?size=96',
    language: search?.language ?? html?.language ?? null,
    npmVersion: null,
    version: null,
    defaultBranch: null,
    license: null,
    verified: null,
    disclosure: null,
    installable: null,
    topics: search?.topics ?? [],
  }
}

function todayKey(): string { return new Date().toISOString().slice(0, 10) }

export function computeTodayStars(profile: string, entries: MarketEntry[]): MarketEntry[] {
  const state = readState(profile)
  const snap = state.starsSnapshot
  const current: Record<string, number> = {}
  for (const entry of entries) {
    if (entry.stars === null) continue
    current[(entry.owner + '/' + entry.name).toLowerCase()] = entry.stars
  }
  if (snap === undefined || snap.date !== todayKey()) {
    // First successful fetch of the day: record the baseline, deltas unknown.
    writeState(profile, { ...state, starsSnapshot: { date: todayKey(), stars: current } })
    return entries
  }
  const baseline = snap.stars
  for (const entry of entries) {
    if (entry.stars === null) { entry.todayStars = null; continue }
    const prev = baseline[(entry.owner + '/' + entry.name).toLowerCase()]
    entry.todayStars = prev === undefined ? null : entry.stars - prev
  }
  return entries
}

// ------------------------------------------------------------------ loading

export interface LoadResult {
  registry: Registry
  refreshing: boolean
}

export const progress: RefreshProgress = { running: false, shard: 0, shards: 0, repos: 0, lastError: null }

let lastSearchFailAt = 0
let htmlCache: { at: number; byKey: Map<string, { pushed_at: string | null; language: string | null }> } | null = null

function makeRegistry(profile: string, htmlByKey: Map<string, { pushed_at: string | null; language: string | null }>, searchByKey: Map<string, GhRepo>): Registry {
  const known = loadKnown()
  const verdicts = verdictsOf(profile)
  const entries: MarketEntry[] = []
  const keys = new Set<string>([...htmlByKey.keys(), ...searchByKey.keys()])
  for (const key of keys) {
    entries.push(buildEntry(key, known, verdicts, searchByKey.get(key), htmlByKey.get(key)))
  }
  const withDelta = computeTodayStars(profile, entries)
  return normalizeCategories({
    updated: new Date().toISOString(),
    count: withDelta.length,
    source: 'live',
    categories: CATEGORIES,
    plugins: withDelta,
  })
}

async function fetchLive(profile: string, token: string, registryUrl: string): Promise<Registry> {
  // Pass 0: the community CDN index — complete catalog, no API quota.
  try {
    return await fetchCdnRegistry(profile, registryUrl)
  } catch (err) {
    progress.lastError = 'CDN channel failed (' + (err instanceof Error ? err.message : String(err)) + '); falling back to direct crawl'
  }
  // Pass 1: HTML topic pages — the complete repo list this network allows
  // (4 sort views × 50 pages, no API quota). Reused for 30 minutes so a
  // search-phase failure does not force a full re-crawl on the next refresh.
  let htmlByKey: Map<string, { pushed_at: string | null; language: string | null }>
  if (htmlCache !== null && Date.now() - htmlCache.at < 30 * 60 * 1000) {
    htmlByKey = htmlCache.byKey
  } else {
    const htmlRepos = await fetchTopicPages({
      onShard: (index, total, repos) => {
        progress.shard = index
        progress.shards = total
        progress.repos = repos
      },
      onError: (message) => { progress.lastError = message },
    })
    htmlByKey = new Map<string, { pushed_at: string | null; language: string | null }>()
    for (const repo of htmlRepos) htmlByKey.set(repo.full_name.toLowerCase(), { pushed_at: repo.pushed_at, language: repo.language })
    htmlCache = { at: Date.now(), byKey: htmlByKey }
    cache = { at: Date.now(), data: makeRegistry(profile, htmlByKey, new Map()) }
  }

  // Pass 2: search API union (full fields). Qualifiers are broken on this
  // network, so six ordered views of the bare topic query are unioned.
  // Failures keep the HTML-only cache; retries back off for 10 minutes.
  if (cache === null) cache = { at: Date.now(), data: makeRegistry(profile, htmlByKey, new Map()) }
  if (Date.now() - lastSearchFailAt < 10 * 60 * 1000) return cache.data
  const searchByKey = new Map<string, GhRepo>()
  try {
    const raw = await searchDshTopicRepos(token, {
      onShard: (index, total, repos) => {
        progress.shard = index
        progress.shards = total
        progress.repos = repos
      },
      onError: (message) => { progress.lastError = message },
    })
    for (const item of raw) {
      const repo = item as GhRepo
      if (repo.fork || repo.archived) continue
      searchByKey.set(repo.full_name.toLowerCase(), repo)
    }
    cache = { at: Date.now(), data: makeRegistry(profile, htmlByKey, searchByKey) }
  } catch (err) {
    lastSearchFailAt = Date.now()
    progress.lastError = 'search pass failed (' + (err instanceof Error ? err.message : String(err)) + '); HTML-only catalog kept'
  }
  if (cache === null) cache = { at: Date.now(), data: makeRegistry(profile, htmlByKey, new Map()) }
  return cache.data
}

export async function loadRegistry(profile: string, token: string, opts: { force?: boolean; registryUrl?: string } = {}): Promise<LoadResult> {
  if (cache !== null && Date.now() - cache.at < TTL_MS && opts.force !== true) {
    return { registry: cache.data, refreshing: progress.running }
  }
  if (progress.running) {
    // A refresh is already in flight: serve what we have while it finishes.
    return { registry: cache?.data ?? snapshot(), refreshing: true }
  }
  progress.running = true
  progress.lastError = null
  progress.shard = 0
  progress.shards = 0
  progress.repos = 0
  const immediate = cache?.data ?? snapshot()
  void (async () => {
    try {
      const live = await fetchLive(profile, token, opts.registryUrl ?? '')
      cache = { at: Date.now(), data: live }
    } catch (err) {
      // Keep the previous cache (or fall back to the bundled snapshot).
      progress.lastError = err instanceof Error ? err.message : String(err)
    } finally {
      progress.running = false
    }
  })()
  return { registry: immediate, refreshing: true }
}

/** Deep verdict batch: returns verdicts for the given repos (only true/false). */
export async function verifyRepos(profile: string, token: string, repos: string[]): Promise<Record<string, boolean>> {
  const updates: Record<string, boolean> = {}
  const known = verdictsOf(profile)
  for (const repo of repos) {
    if (known[repo.toLowerCase()] !== undefined) continue
    const verdict = await packageJsonVerdict(token, repo)
    if (verdict !== null) updates[repo.toLowerCase()] = verdict
  }
  if (Object.keys(updates).length > 0) applyVerdicts(profile, updates)
  return updates
}
