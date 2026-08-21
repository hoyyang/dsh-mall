/**
 * dsh-store find tool + result staging:
 * - find_dsh_store_plugin tool (any agent can call it): searches the local
 *   store catalog (CDN index already in memory), returns recommended +
 *   related plugin lists, and renders a button-link that opens the store
 *   results window.
 * - query-result staging: the tool payload is staged in memory under a
 *   random token; the client fetches it when the user clicks the button.
 */

import { defineTool } from '@deepseek-ai/dsh-tools'
import { CATEGORIES, loadRegistry } from './catalog.ts'
import type { MarketEntry } from './types.ts'

export const FIND_TOOL_NAME = 'find_dsh_store_plugin'

interface FindPayload {
  query: string
  recommended: MarketEntry[]
  related: MarketEntry[]
  /** 结果条目的分类表（与主商店同款 catLabel 数据源）。 */
  categories?: Record<string, { en: string; zh: string }>
}

/** Staged results: token -> payload (memory only, TTL 30 min). */
const staged = new Map<string, { at: number; payload: FindPayload }>()

export function stageResults(payload: FindPayload): string {
  const token = Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
  staged.set(token, { at: Date.now(), payload })
  for (const [key, value] of staged) {
    if (Date.now() - value.at > 30 * 60_000) staged.delete(key)
  }
  return token
}

export function takeResults(token: string): FindPayload | null {
  const hit = staged.get(token)
  if (hit === undefined) return null
  if (Date.now() - hit.at > 30 * 60_000) {
    staged.delete(token)
    return null
  }
  return hit.payload
}

/** 中文查询串按 2-4 字滑动窗口拆 token（"应用市场"能命中中文简介/分类名）。 */
function tokensOf(needle: string): Array<{ t: string; w: number }> {
  const out: Array<{ t: string; w: number }> = []
  for (const w of needle.split(/\s+/)) {
    if (w === '') continue
    if (/[\u4e00-\u9fff]/.test(w)) {
      for (let len = 4; len >= 2; len--) {
        for (let i = 0; i + len <= w.length; i++) out.push({ t: w.slice(i, i + len), w: len === 4 ? 6 : len === 3 ? 3 : 1 })
      }
    } else {
      const lw = w.toLowerCase()
      out.push({ t: lw, w: 6 })
      // 英文长词加词干子串（marketplace → market）：dsh-market 这类命名也能命中。
      if (lw.length >= 5) {
        for (let len = lw.length - 1; len >= 4; len--) {
          for (let i = 0; i + len <= lw.length; i++) out.push({ t: lw.slice(i, i + len), w: 2 })
        }
      }
    }
  }
  return out
}

function scoreEntry(e: MarketEntry, needle: string): number {
  const zh = e.descriptions?.zh ?? ''
  const catNames = CATEGORIES[e.category] !== undefined ? (CATEGORIES[e.category]?.en ?? '') + ' ' + (CATEGORIES[e.category]?.zh ?? '') : ''
  const hay = (e.name + ' ' + e.owner + ' ' + e.description + ' ' + zh + ' ' + e.category + ' ' + catNames).toLowerCase()
  const name = e.name.toLowerCase()
  const desc = (e.description + ' ' + zh).toLowerCase()
  const owner = e.owner.toLowerCase()
  let kw = 0
  for (const token of tokensOf(needle)) {
    if (name.includes(token.t)) kw += token.w + 3
    else if (desc.includes(token.t)) kw += token.w
    else if (owner.includes(token.t)) kw += 1
  }
  if (needle.trim() !== '' && kw === 0) return Number.NEGATIVE_INFINITY
  // 关键词分设上限：name+desc 多处命中不无限叠加，防止"marketplace"字样
  // 淹没 dsh-market 这类命名。
  kw = Math.min(kw, 12)
  // 关键词弱命中（<3）的仓库不进推荐：大 star 蹭词仓库（8 万星项目
  // 恰好带"市场"字样）不该挤掉真正的插件。
  if (needle.trim() !== '' && kw < 3) return Number.NEGATIVE_INFINITY
  // star 取对数（1k≈3 分、10k≈4 分）：口碑信号，但不霸榜。
  let score = kw + Math.log10(1 + (e.stars ?? 0))
  if (e.curated) score += 2
  if (e.verified != null) score += 3
  // v1.7.5：非插件不再扣分——插件与非插件都要找，靠关键词/星/精选排名，
  // 结果条目自带 isPlugin 标记（卡片有「插件/非插件」徽章区分）。
  if (e.category === 'market') score += 4
  return score
}

/** Search the in-memory catalog for a natural-language requirement. */
export async function findPlugins(profile: string, token: string, query: string, limit: number): Promise<FindPayload> {
  const needle = String(query ?? '').trim().toLowerCase()
  const { registry } = await loadRegistry(profile, token, {})
  const ranked = registry.plugins
    .filter(p => (p as MarketEntry & { local?: boolean }).local !== true)
    .map(p => ({ p, score: scoreEntry(p, needle) }))
    .sort((a, b) => b.score - a.score)
  const recommended = ranked.filter(r => r.score > 0).slice(0, Math.min(limit, 5)).map(r => r.p)
  const related = ranked
    .filter(r => r.score > 0 && !recommended.includes(r.p))
    .slice(0, Math.min(Math.max(limit, 8), 10))
    .map(r => r.p)
  const categories: Record<string, { en: string; zh: string }> = {}
  for (const p of [...recommended, ...related]) {
    const c = registry.categories[p.category]
    if (c !== undefined) categories[p.category] = c
  }
  return { query: String(query ?? '').trim(), recommended, related, categories }
}

/** 智能搜索：用用户主模型（dsh --profile headless）把需求解析成
 *  英文检索词（JSON {query}），再跑目录评分推荐；模型不可用直接原词。 */
export async function smartSearch(profile: string, token: string, rawQuery: string, limit: number): Promise<FindPayload & { aiUsed: boolean }> {
  const original = String(rawQuery ?? '').trim()
  let refined = original
  let aiUsed = false
  if (original !== '') {
    const prompt = [
      '你是 DSH 插件搜索助手。把用户的需求改写/翻译成适合检索 GitHub 插件仓库的英文关键词（空格分隔，8 个以内，包含核心功能词）。只输出 JSON：{"query": "..."}',
      '用户需求：' + original,
    ].join('\n')
    try {
      const { spawn } = await import('node:child_process')
      const output = await new Promise<string>(resolve => {
        const child = spawn('dsh', ['--profile', 'headless', prompt], { env: { ...process.env }, stdio: ['ignore', 'pipe', 'pipe'] })
        let stdout = ''
        let stderr = ''
        const timer = setTimeout(() => { child.kill('SIGKILL') }, 150_000)
        child.stdout.on('data', (c: Buffer) => { stdout += c.toString() })
        child.stderr.on('data', (c: Buffer) => { stderr += c.toString() })
        child.on('close', () => { clearTimeout(timer); resolve((stdout + stderr).trim()) })
        child.on('error', () => { clearTimeout(timer); resolve('') })
      })
      const start = output.indexOf('{')
      const end = output.lastIndexOf('}')
      if (start >= 0 && end > start) {
        const parsed = JSON.parse(output.slice(start, end + 1)) as { query?: string }
        if (typeof parsed.query === 'string' && parsed.query.trim() !== '') {
          refined = parsed.query.trim()
          aiUsed = true
        }
      }
    } catch { /* 模型不可用：原词兜底 */ }
  }
  // 改写词与原词相同/包含原词时只用原词，避免标题出现重复。
  const combined = refined === original || (refined !== '' && refined.includes(original)) ? original : original + ' ' + refined
  const payload = await findPlugins(profile, token, combined, limit)
  return { ...payload, aiUsed }
}

export function installFindTool(ctx: { tools: { register(tool: unknown): void } }, profile: string, githubToken: () => string, webOrigin: () => string): void {
  ctx.tools.register(defineTool({
    name: FIND_TOOL_NAME,
    description:
      'Search the local DSH Store catalog (a full index of every GitHub repo tagged ' +
      'dsh-plugin, refreshed daily) for plugins AND related non-plugin tools matching the user\'s requirement. ' +
      'Both kinds are returned and labeled (plugin vs non-plugin). Returns a recommended list plus ' +
      'other related entries with stars, descriptions and install commands. ' +
      'Use whenever the user asks for a plugin, capability, or tool they might install. ' +
      'Always end your reply with the button link returned in the tool output so the user can ' +
      'open the visual store window.',
    parameters: {
      query: {
        type: 'string',
        required: true,
        description: "The user's requirement in their own words, e.g. '通知插件' or 'wechat notifications', '代码审查', 'TUI'",
      },
      limit: {
        type: 'number',
        description: 'How many recommended plugins to return (default 3, max 5)',
      },
      lang: {
        type: 'string',
        description: "Preferred description language for the reply, e.g. 'zh' or 'en'",
      },
    },
    output: {
      schema: { type: 'object', additionalProperties: true },
      render: (_args, value) => renderFindResult(value as unknown as FindPayload & { buttonUrl?: string; lang?: string }, webOrigin()),
    },
    execute: async args => {
      const limit = Math.max(1, Math.min(args.limit ?? 3, 5))
      const payload = await findPlugins(profile, githubToken(), String(args.query ?? ''), limit)
      const buttonUrl = stageResults(payload)
      const result = { ...payload, lang: String(args.lang ?? 'en'), buttonUrl }
      return JSON.parse(JSON.stringify(result)) as unknown as Record<string, import('@deepseek-ai/dsh-tools').JsonValue>
    },
    timeoutMs: 30_000,
  }))
}

function renderFindResult(value: FindPayload & { buttonUrl?: string; lang?: string }, origin: string): Array<{ type: 'text'; text: string }> {
  const lang = value.lang as string | undefined
  const desc = (e: MarketEntry): string => {
    if (lang === 'zh' && e.descriptions?.zh) return e.descriptions.zh
    return e.description
  }
  const lines: string[] = []
  if (value.recommended.length > 0) {
    lines.push('**推荐**')
    value.recommended.forEach((p, i) => {
      const install = p.npm !== null ? 'dsh plugin add ' + p.npm : 'dsh plugin add github:' + p.owner + '/' + p.name
      const kindMark = p.isPlugin === true ? '' : p.isPlugin === false ? ' 〔非插件〕' : ' 〔待判定〕'
      lines.push((i + 1) + '. ' + p.name + ' ★' + (p.stars ?? '—') + (p.verified != null ? ' ✓已验证' : '') + (p.curated ? ' ⚑精选' : '') + kindMark)
      lines.push('   ' + (desc(p) || '—').slice(0, 200))
      lines.push('   ' + install)
    })
  }
  if (value.related.length > 0) {
    lines.push('')
    lines.push('**其他相关**')
    value.related.forEach((p, i) => {
      const kindMark = p.isPlugin === true ? '' : p.isPlugin === false ? ' 〔非插件〕' : ' 〔待判定〕'
      lines.push((i + 1) + '. ' + p.name + ' ★' + (p.stars ?? '—') + kindMark + ' — ' + (desc(p) || '—').slice(0, 120))
    })
  }
  if (value.recommended.length === 0 && value.related.length === 0) {
    lines.push('No plugins in the store matched that requirement. Try broader keywords.')
  }
  if (value.buttonUrl !== undefined) {
    lines.push('')
    lines.push('[打开 DSH 商店查看插件详情](' + origin + '/dsh-store/open-results?id=' + value.buttonUrl + ')')
  }
  return [{ type: 'text', text: lines.join('\n') }]
}
