#!/usr/bin/env node
/**
 * Build-time snapshot: writes data/awesome-known.json (curated catalog) and
 * data/registry-snapshot.json (GitHub #dsh-plugin topic repos, classified
 * with the same rules as the host pipeline). The host falls back to these
 * files when GitHub is unreachable or rate limited.
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DATA = join(ROOT, 'data')
const TOKEN = process.env.DSHM_GITHUB_TOKEN ?? ''
const UA = 'dsh-store-snapshot'

const CATEGORIES = {
  ui: { en: 'UI Enhancements', zh: 'UI 增强' },
  theme: { en: 'Themes & Appearance', zh: '主题与外观' },
  model: { en: 'Models & Providers', zh: '模型与账号接入' },
  session: { en: 'Sessions & Messages', zh: '会话与消息' },
  memory: { en: 'Memory', zh: '记忆' },
  tools: { en: 'Tools & Capabilities', zh: '工具与能力' },
  skill: { en: 'Skills', zh: '技能包' },
  workflow: { en: 'Workflow & Automation', zh: '工作流与自动化' },
  notify: { en: 'Notifications & Integrations', zh: '通知与集成' },
  dev: { en: 'Development & Runtime', zh: '开发与运行时' },
  market: { en: 'Plugin Markets & Managers', zh: '插件市场与管理' },
  fun: { en: 'Just for Fun', zh: '娱乐' },
  other: { en: 'Others', zh: '其他' },
}

const CATEGORY_RULES = [
  ['theme', /(theme|skin|appearance|配色|主题|皮肤)/i],
  ['model', /(provider|model|api[- ]?key|endpoint|llm|deepseek[- ]api)/i],
  ['session', /(session|conversation|history|export|import|会话|对话)/i],
  ['memory', /(memory|remember|recall|记忆)/i],
  ['tools', /(mcp|tool|search|vision|ocr|image|browser|web|tts|voice|翻译|搜索)/i],
  ['skill', /(skill|prompt|agent-preset|技能)/i],
  ['workflow', /(workflow|automation|scheduler|task|定时|自动化|工作流)/i],
  ['notify', /(notify|notification|push|wechat|wecom|telegram|feishu|邮件|通知)/i],
  ['dev', /(dev|debug|log|terminal|cli|ssh|git|code|诊断|日志|开发)/i],
  ['market', /(market|plugin[- ]?manager|插件市场|plugin hub)/i],
  ['fun', /(pet|game|fun|meme|娱乐|宠物|游戏)/i],
]

function ruleCategory(name, description, topics) {
  const hay = (name + ' ' + description + ' ' + topics.join(' ')).toLowerCase()
  for (const [category, re] of CATEGORY_RULES) if (re.test(hay)) return category
  return 'other'
}

const PLUGIN_NAME_RE = /(^dsh[-_]|[-_]dsh[-_]|dsh[-_]plugin|dshplugin)/i
const DSH_HINT_RE = /(dsh|deepseek[ -]?harness|cordis)/i

function heuristicIsPlugin(name, description, topics) {
  const hay = (name + ' ' + description + ' ' + topics.join(' ')).toLowerCase()
  if (!DSH_HINT_RE.test(hay)) return false
  if (PLUGIN_NAME_RE.test(hay)) return true
  if (/(plugin|插件)\b/i.test(hay)) return true
  return null
}

async function gh(path, token) {
  const headers = { accept: 'application/vnd.github+json', 'user-agent': UA, 'x-github-api-version': '2022-11-28' }
  if (token !== '') headers.authorization = 'Bearer ' + token
  const res = await fetch('https://api.github.com' + path, { headers })
  if (res.status === 403 || res.status === 429) throw new Error('rate limited (HTTP ' + res.status + ')')
  if (!res.ok) throw new Error('HTTP ' + res.status + ' for ' + path)
  return res.json()
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function fetchAllRepos(token) {
  const base = 'topic:dsh-plugin+fork:false+archived:false'
  const probe = await gh('/search/repositories?q=' + encodeURIComponent(base + '+created:>=2020-01-01') + '&per_page=1&page=1', token)
  console.log('total dsh-plugin repos:', probe.total_count)
  const thisYear = new Date().getUTCFullYear()
  const thisMonth = new Date().getUTCMonth() + 1
  const slices = []
  for (let year = 2020; year < thisYear; year++) slices.push({ q: base + '+created:' + year + '-01-01..' + year + '-12-31' })
  for (let month = 1; month <= thisMonth; month++) {
    const start = thisYear + '-' + String(month).padStart(2, '0') + '-01'
    const end = month === thisMonth ? thisYear + '-' + String(month).padStart(2, '0') + '-31' : thisYear + '-' + String(month + 1).padStart(2, '0') + '-01'
    slices.push({ q: base + '+created:' + start + '..' + end })
  }
  const repos = new Map()
  let index = 0
  for (let si = 0; si < slices.length; si++) {
    const slice = slices[si]
    index += 1
    const first = await gh('/search/repositories?q=' + encodeURIComponent(slice.q) + '&per_page=100&page=1&sort=created&order=asc', token)
    const pages = Math.min(10, Math.ceil(first.total_count / 100))
    for (let page = 1; page <= pages; page++) {
      const res = await gh('/search/repositories?q=' + encodeURIComponent(slice.q) + '&per_page=100&page=' + page + '&sort=created&order=asc', token)
      for (const item of res.items) if (item.full_name !== undefined) repos.set(item.full_name, item)
      console.log('slice ' + index + '/' + slices.length + ' page ' + page + '/' + pages + ' — ' + repos.size + ' repos')
      await sleep(token === '' ? 9000 : 3000)
    }
    if (si < slices.length - 1) await sleep(token === '' ? 9000 : 3000)
  }
  return [...repos.values()]
}

/** CDN-first snapshot: 从自有索引（registry.json，gzip 变体优先）直接生成快照，
 *  零 API 额度、秒级完成，快照数据与运行时 CDN 通道同源一致。
 *  失败时回退到下面的 GitHub Search 全量爬取。 */
async function fetchCdnRepos() {
  const urls = [
    'https://raw.githubusercontent.com/hoyyang/dsh-market-index/main/registry.json.gz',
    'https://raw.githubusercontent.com/hoyyang/dsh-market-index/main/registry.json',
    'https://cdn.jsdelivr.net/gh/hoyyang/dsh-market-index@main/registry.json.gz',
    'https://cdn.jsdelivr.net/gh/hoyyang/dsh-market-index@main/registry.json',
  ]
  let lastError = ''
  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: { 'user-agent': UA, 'accept-encoding': 'gzip' }, signal: AbortSignal.timeout(60_000) })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      let raw = await res.text()
      if (url.endsWith('.gz') && raw.charCodeAt(0) === 0x1f) {
        const buf = await res.arrayBuffer()
        raw = await new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream('gzip'))).text()
      }
      const body = JSON.parse(raw)
      if (!Array.isArray(body.repos) || body.repos.length === 0) throw new Error('empty index')
      return body
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err)
    }
  }
  throw new Error('CDN unavailable: ' + lastError)
}

async function main() {
  mkdirSync(DATA, { recursive: true })

  // 1. Curated catalog.
  let known = {}
  try {
    const res = await fetch('https://awesome-dsh-plugin.com/plugins.json', { headers: { 'user-agent': UA } })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    const catalog = await res.json()
    for (const plugin of catalog.plugins ?? []) {
      const m = /^https:\/\/github\.com\/([^/]+\/[^/]+?)\/?$/.exec(plugin.url ?? '')
      if (m === null) continue
      known[m[1].toLowerCase()] = {
        name: plugin.name ?? m[1].split('/')[1],
        category: plugin.category ?? 'other',
        npm: plugin.npm ?? null,
        description: plugin.description ?? null,
        added: plugin.added ?? null,
      }
    }
    writeFileSync(join(DATA, 'awesome-known.json'), JSON.stringify(known, null, 2))
    console.log('awesome-known.json:', Object.keys(known).length, 'entries')
  } catch (err) {
    console.warn('curated catalog fetch failed:', err.message)
    try { known = JSON.parse(readFileSync(join(DATA, 'awesome-known.json'), 'utf8')) } catch { /* keep {} */ }
  }

  // 2. Repo snapshot: CDN index first (fresh, quota-free), Search crawl as fallback.
  const toEntry = (repo) => {
    const key = String(repo.full_name ?? '').toLowerCase()
    const knownEntry = known[key]
    const description = knownEntry?.description?.en ?? knownEntry?.description?.zh ?? repo.description ?? ''
    const topics = Array.isArray(repo.topics) ? repo.topics : []
    const npmName = knownEntry?.npm ?? (typeof repo.pkg_name === 'string' && repo.pkg_name !== '' && repo.installable !== 'non-plugin' ? repo.pkg_name : null)
    const descriptions = {}
    for (const [k, v] of Object.entries(repo)) {
      if (k.startsWith('description_') && typeof v === 'string' && v !== '') descriptions[k.slice('description_'.length)] = v
    }
    return {
      name: repo.name,
      owner: String(repo.full_name ?? '').split('/')[0] ?? '',
      url: repo.html_url,
      category: knownEntry?.category ?? ruleCategory(String(repo.name ?? ''), String(repo.description ?? ''), topics),
      description: (description.length > 200 ? description.slice(0, 200) + '…' : description) || '',
      ...(Object.keys(descriptions).length > 0 ? { descriptions } : {}),
      stars: repo.stargazers_count ?? null,
      todayStars: null,
      created: knownEntry?.added ?? null,
      pushed: repo.updated_at ?? null,
      isPlugin: repo.installable === 'non-plugin' ? false : (knownEntry !== undefined || npmName !== null ? true : heuristicIsPlugin(String(repo.name ?? ''), String(repo.description ?? ''), topics)),
      curated: knownEntry !== undefined,
      npm: npmName,
      avatar: 'https://github.com/' + String(repo.full_name ?? '').split('/')[0] + '.png?size=96',
      language: null,
      ...(typeof repo.npm_version === 'string' && repo.npm_version !== '' ? { npmVersion: repo.npm_version } : { npmVersion: null }),
      ...(typeof repo.version === 'string' && repo.version !== '' ? { version: repo.version } : { version: null }),
      defaultBranch: typeof repo.default_branch === 'string' ? repo.default_branch : null,
      license: typeof repo.license === 'string' ? repo.license : null,
      verified: typeof repo.verdict === 'string' && repo.verdict !== ''
        ? { by: repo.verifiedBy ?? '', at: repo.verifiedAt ?? '', reportUrl: repo.reportUrl ?? null }
        : null,
      disclosure: null,
      installable: repo.installable === 'non-plugin' || repo.installable === 'manual' ? repo.installable : null,
      topics,
    }
  }
  try {
    const body = await fetchCdnRepos()
    const plugins = body.repos.map(toEntry)
    const registry = {
      updated: body.generated_at ?? new Date().toISOString(),
      count: plugins.length,
      source: 'snapshot',
      categories: CATEGORIES,
      plugins,
    }
    writeFileSync(join(DATA, 'registry-snapshot.json'), JSON.stringify(registry))
    console.log('registry-snapshot.json (from CDN index):', plugins.length, 'repos')
  } catch (err) {
    console.warn('CDN snapshot failed (' + err.message + '); falling back to GitHub Search crawl')
    try {
      const repos = await fetchAllRepos(TOKEN)
      const plugins = repos.map((repo) => {
        const key = repo.full_name.toLowerCase()
        const knownEntry = known[key]
        const description = knownEntry?.description?.en ?? knownEntry?.description?.zh ?? repo.description ?? ''
        return {
          name: repo.name,
          owner: repo.owner.login,
          url: repo.html_url,
          category: knownEntry?.category ?? ruleCategory(repo.name, repo.description ?? '', repo.topics ?? []),
          description: (description.length > 200 ? description.slice(0, 200) + '…' : description) || '',
          stars: repo.stargazers_count,
          todayStars: null,
          created: repo.created_at,
          pushed: repo.pushed_at,
          isPlugin: knownEntry !== undefined ? true : heuristicIsPlugin(repo.name, repo.description, repo.topics ?? []),
          curated: knownEntry !== undefined,
          npm: knownEntry?.npm ?? null,
          avatar: repo.owner.avatar_url,
          language: repo.language ?? null,
        }
      })
      const registry = {
        updated: new Date().toISOString(),
        count: plugins.length,
        source: 'snapshot',
        categories: CATEGORIES,
        plugins,
      }
      writeFileSync(join(DATA, 'registry-snapshot.json'), JSON.stringify(registry))
      console.log('registry-snapshot.json (from Search):', plugins.length, 'repos')
    } catch (err2) {
      console.warn('repo snapshot failed:', err2.message)
    }
  }
}

main().catch(err => { console.error(err); process.exit(1) })
