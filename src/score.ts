/**
 * 实用五维评分（v1.7.45，借鉴 2BingLing/dsh-market scoring.ts，MIT）：
 * 维护 0.30 / 实用 0.25 / 热度 0.20 / 便捷 0.15 / 信号 0.10，
 * 加权几何平均（+1 平滑）× 贝叶斯置信（字段齐全度）+ 解释层（为什么推荐）。
 *
 * 我们的注册表没有 forks/open_issues/README 静态内容，做诚实降级：
 * - 维护 = pushed 新鲜度 only（issue 健康度降级为中性，权重归一化）
 * - 热度 = stars 对数归一化 only（p99 动态基准；fork 参与率降级）
 * - 实用/便捷 依赖 README：基础分里为 null，拿到 README 后 enrich 补全
 *   并重新融合总分（complete 标记供 UI 决定是否渲染雷达图）
 */

export interface ScoreBreakdown {
  maintain: number | null
  practical: number | null
  popularity: number | null
  ease: number | null
  signal: number
}

export interface ScoreView {
  total: number | null
  breakdown: ScoreBreakdown
  /** 字段齐全度 0-1（description/license/readme/topics 命中比例）。 */
  confidence: number
  explanation: { zh: string; en: string }
  /** 五维全部可得（卡片雷达图渲染门槛）。 */
  complete: boolean
  /** v1.7.68：基础分所用输入指纹——stars/pushed 变化时重算（星数与热度分同步）。 */
  starsAt?: number | null
  pushedAt?: string | null
}

const WEIGHTS = { maintain: 0.3, practical: 0.25, popularity: 0.2, ease: 0.15, signal: 0.1 } as const

function clip(v: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, v))
}

function log1p(x: number): number {
  return Math.log(1 + x)
}

/** Wilson Score 置信区间下界（小样本比例的稳健估计，dsh.market 同款）。 */
export function wilsonLowerBound(positives: number, total: number, z = 1.96): number {
  if (total <= 0) return 0
  const p = positives / total
  const z2 = z * z
  return (p + z2 / (2 * total) - z * Math.sqrt((p * (1 - p)) / total + z2 / (4 * total * total))) / (1 + z2 / total)
}

/** 1. 维护活跃：pushed 新鲜度×0.6 + issue 健康度×0.4。
 *  openIssues 缺失（索引 v1.17 前无此字段）时 issue 健康度取中性 0.5 降级。 */
export function scoreMaintain(pushedAt: string | null, stars: number | null, openIssues: number | null): number | null {
  if (pushedAt === null || pushedAt === '') return null
  const t = Date.parse(pushedAt)
  if (Number.isNaN(t)) return null
  const days = Math.max(0, (Date.now() - t) / 86_400_000)
  const commitActivity = days < 7 ? 1.0 : days < 30 ? 0.8 : days < 90 ? 0.5 : days < 180 ? 0.3 : 0.1
  // issue 健康度：问题率越低越健康（小样本用 Wilson）
  const issueHealth = openIssues === null || openIssues === undefined
    ? 0.5
    : 1 - Math.min(wilsonLowerBound(openIssues, Math.max(stars ?? 0, 1)) * 10, 1)
  return Math.round(clip(commitActivity * 0.6 + issueHealth * 0.4) * 100)
}

/** 2a. 实用度（索引 CI 结构信号版）：len/安装章节/代码块，零网络。 */
export function scorePracticalFromSig(sig: { len: number | null; installSection: boolean; codeBlocks: number }): number | null {
  if (sig.len === null) return null
  let s = 0
  if (sig.len > 2000) s += 30
  else if (sig.len > 500) s += 20
  else if (sig.len > 0) s += 10
  if (sig.installSection) s += 30
  if (sig.codeBlocks >= 2) s += 20
  return Math.round(clip(s))
}

/** 2. 实用度：README 结构完备度（README 缺失时 null）。 */
export function scorePractical(readme: string | null): number | null {
  if (readme === null) return null
  const text = readme
  let s = 0
  if (text.length > 2000) s += 30
  else if (text.length > 500) s += 20
  else if (text.length > 0) s += 10
  if (/(install|installation|usage|getting started|quick start|setup|安装|使用说明|快速开始)/i.test(text)) s += 30
  const codeBlocks = (text.match(/```/g) ?? []).length
  if (codeBlocks >= 2) s += 20
  if (/^#{1,3}\s+(features?|功能)/im.test(text) && /^#{1,3}\s+(config|配置|example|示例)/im.test(text)) s += 10
  if (/^(#{1,4})\s+(技能|skill)/im.test(text)) s += 10
  return Math.round(clip(s))
}

/** 3. 生态热度：stars 对数归一化×0.6 + fork 参与率×0.4（理想区间 0.05-0.3，
 *  过高(刷 fork)/过低(无人参与)都扣分）。forks 缺失时仅 star 分降级。 */
export function scorePopularity(stars: number | null, forks: number | null, p99Stars: number): number | null {
  if (stars === null || stars === undefined) return null
  const p99 = Math.max(p99Stars, 1)
  const starScore = 100 * (log1p(stars) / log1p(p99))
  if (forks === null || forks === undefined) return Math.round(clip(starScore))
  const rate = forks / Math.max(stars, 1)
  let forkScore: number
  if (stars === 0) forkScore = 0
  else if (rate <= 0.05) forkScore = (rate / 0.05) * 40
  else if (rate <= 0.3) forkScore = 40 + ((rate - 0.05) / 0.25) * 50
  else if (rate <= 0.5) forkScore = 90 - ((rate - 0.3) / 0.2) * 40
  else forkScore = Math.max(10, 50 - (rate - 0.5) * 50)
  return Math.round(clip(starScore * 0.6 + forkScore * 0.4))
}

/** 4a. 便捷度（索引 CI 结构信号版）：安装命令/无需配置/结构说明，零网络。 */
export function scoreEaseFromSig(sig: { cmds: string[]; installSection: boolean; heading: boolean; len: number | null; needsConfig: boolean }): number | null {
  if (sig.len === null) return null
  let s = 0
  if (sig.cmds.length > 0) s += 35
  else if (sig.installSection) s += 15
  if (!sig.needsConfig) s += 35
  if (sig.heading && sig.len > 100) s += 30
  return Math.round(clip(s))
}

/** 4. 便捷度：README 有明确安装命令 + 无需额外配置（README 缺失时 null）。 */
export function scoreEase(readme: string | null, needsConfig: boolean): number | null {
  if (readme === null) return null
  const text = readme
  let s = 0
  if (/(git clone|pnpm add|npm install -g|npx skills add|npm i -g|pip install|dsh plugin add|dsh plugin)/i.test(text)) s += 35
  else if (/(install|安装)/i.test(text)) s += 15
  if (!needsConfig) s += 35
  if (/^#\s+.+/m.test(text) && text.length > 100) s += 30
  return Math.round(clip(s))
}

/** 5. 信号质量：description/license/homepage/topics/README 完备度。 */
export function scoreSignal(input: {
  hasDescription: boolean
  descriptionLen: number
  hasLicense: boolean
  hasHomepage: boolean
  topics: string[]
  readme: string | null
}): number {
  let s = 0
  if (input.hasDescription) s += 20
  if (input.descriptionLen > 60) s += 15
  if (input.hasLicense) s += 25
  if (input.hasHomepage) s += 15
  if (input.topics.length > 0) s += 20
  if (input.readme !== null && input.readme.length > 100) s += 20
  return Math.round(clip(s))
}

/** 加权几何平均（+1 平滑防 0 归零）；缺失维度剔除并把权重归一化。 */
function weightedGeometricMean(breakdown: ScoreBreakdown): number | null {
  let sumW = 0
  let prod = 1
  const dims: Array<keyof typeof WEIGHTS> = ['maintain', 'practical', 'popularity', 'ease', 'signal']
  for (const k of dims) {
    const v = breakdown[k]
    if (v === null) continue
    sumW += WEIGHTS[k]
    prod *= Math.pow(v + 1, WEIGHTS[k])
  }
  if (sumW <= 0) return null
  return clip(Math.pow(prod, 1 / sumW) - 1)
}

/** 贝叶斯置信：description/license/readme/topics 四字段命中比例。 */
function confidenceOf(input: {
  hasDescription: boolean
  hasLicense: boolean
  readme: string | null
  topics: string[]
}): number {
  const hits = [
    input.hasDescription,
    input.hasLicense,
    input.readme !== null,
    input.topics.length > 0,
  ].filter(Boolean).length
  return hits / 4
}

// ---------- 解释层（为什么推荐）----------

const REASONS: Record<string, { zh: string; en: string }> = {
  maintain: { zh: '近期仍在更新，DSH 迭代快也不怕坏', en: 'actively maintained — survives fast DSH iterations' },
  practical: { zh: 'README 含完整安装与使用说明，上手即用', en: 'README has complete install & usage docs' },
  popularity: { zh: '社区认可度高', en: 'well recognized by the community' },
  ease: { zh: '无需额外配置，开箱即用', en: 'works out of the box, no extra config' },
  signal: { zh: '项目信息完整（license/主题/文档齐全）', en: 'complete project metadata (license/topics/docs)' },
}

export function buildExplanation(
  breakdown: ScoreBreakdown,
  stars: number | null,
  pushedAt: string | null,
  extras: { curated?: boolean; verified?: boolean; bundled?: boolean } = {},
): { zh: string; en: string } {
  const zh: string[] = []
  const en: string[] = []
  const dims: Array<keyof typeof WEIGHTS> = ['maintain', 'practical', 'popularity', 'ease', 'signal']
  let days: number | null = null
  if (pushedAt !== null && pushedAt !== '') {
    const t = Date.parse(pushedAt)
    if (!Number.isNaN(t)) days = Math.round((Date.now() - t) / 86_400_000)
  }
  for (const k of dims) {
    const v = breakdown[k]
    if (v === null || v < 70) continue
    if (k === 'maintain' && days !== null && days >= 30) {
      zh.push('维护活跃（' + days + ' 天前有提交）')
      en.push('maintained (' + days + ' days since last push)')
      continue
    }
    zh.push(REASONS[k].zh)
    en.push(REASONS[k].en)
  }
  if ((stars ?? 0) > 0) {
    const s = (stars ?? 0) >= 1000 ? (Math.round((stars ?? 0) / 100) / 10) + 'k stars' : (stars ?? 0) + ' stars'
    zh.push(s)
    en.push(s)
  }
  if (extras.curated === true) { zh.push('awesome 人工策展精选'); en.push('awesome curated pick') }
  if (extras.verified === true) { zh.push('人工实测验证'); en.push('human-verified') }
  if (extras.bundled === true) { zh.push('机器扫描可装配安装'); en.push('machine-verified installable') }
  const dedupe = (arr: string[]): string[] => [...new Set(arr)]
  const zhOut = dedupe(zh).slice(0, 3).join('；')
  const enOut = dedupe(en).slice(0, 3).join('; ')
  return { zh: zhOut, en: enOut }
}

// ---------- 主入口 ----------

export interface ScoreInput {
  pushedAt: string | null
  stars: number | null
  openIssues: number | null
  forks: number | null
  hasDescription: boolean
  descriptionLen: number
  hasLicense: boolean
  hasHomepage: boolean
  topics: string[]
  p99Stars: number
  /** v1.7.50+：索引 CI README 结构信号（有则实用/便捷两维零网络可算）。 */
  readmeSig?: { len: number | null; installSection: boolean; codeBlocks: number; heading: boolean; cmds: string[]; needsConfig: boolean } | null
}

/** 目录加载即算（零网络）：维护/热度/信号三维；实用/便捷 = null。
 *  v1.7.47：forks/open_issues/homepage 字段存在时按 dsh.market 全公式计算
 *  （索引 v1.18 起提供；缺失时自动降级，不编造数据）。 */
export function computeBaseScore(input: ScoreInput): ScoreView {
  const maintain = scoreMaintain(input.pushedAt, input.stars, input.openIssues)
  const popularity = scorePopularity(input.stars, input.forks, input.p99Stars)
  const signal = scoreSignal({ hasDescription: input.hasDescription, descriptionLen: input.descriptionLen, hasLicense: input.hasLicense, hasHomepage: input.hasHomepage, topics: input.topics, readme: null })
  // v1.7.50：索引 CI README 信号在场时实用/便捷零网络可算，五维当场齐全。
  const sig = input.readmeSig ?? null
  const practical = sig !== null ? scorePracticalFromSig(sig) : null
  const ease = sig !== null ? scoreEaseFromSig(sig) : null
  const breakdown: ScoreBreakdown = { maintain, practical, popularity, ease, signal }
  const total = weightedGeometricMean(breakdown)
  const confidence = confidenceOf({ hasDescription: input.hasDescription, hasLicense: input.hasLicense, readme: sig !== null ? 'sig' : null, topics: input.topics })
  const complete = maintain !== null && practical !== null && popularity !== null && ease !== null
  return {
    total: total === null ? null : Math.round(clip(total * confidence)),
    breakdown,
    confidence: Math.round(confidence * 100) / 100,
    explanation: buildExplanation(breakdown, input.stars, input.pushedAt),
    complete,
    starsAt: input.stars,
    pushedAt: input.pushedAt,
  }
}

/** v1.7.68：README 富化维度（实用/便捷/信号）保留、基础维度重算后的重新融合。 */
function refoldScore(score: ScoreView): ScoreView {
  const total = weightedGeometricMean(score.breakdown)
  score.total = total === null ? null : Math.round(clip(total * score.confidence))
  score.complete = score.breakdown.maintain !== null && score.breakdown.practical !== null && score.breakdown.popularity !== null && score.breakdown.ease !== null
  score.explanation = buildExplanation(score.breakdown, score.starsAt ?? null, score.pushedAt ?? null)
  return score
}

/** README 到手后补全实用/便捷两维并重新融合（详情页/find/卡片页级富化）。
 *  v1.7.46：signal 重算必须沿用原始字段（description/license/topics）——
 *  此前传空 topics/license 会把信号分算低（dsh-web-ui 65 vs 应有的 85）。 */
export function enrichScore(base: ScoreView, readme: string | null, needsConfig: boolean, extras: {
  stars?: number | null
  pushedAt?: string | null
  curated?: boolean
  verified?: boolean
  bundled?: boolean
  description?: string
  license?: string | null
  topics?: string[]
  hasHomepage?: boolean
} = {}): ScoreView {
  const practical = scorePractical(readme)
  const ease = scoreEase(readme, needsConfig)
  const description = extras.description ?? ''
  const license = extras.license ?? null
  const topics = extras.topics ?? []
  const signal = readme === null ? base.breakdown.signal : scoreSignal({
    hasDescription: description !== '',
    descriptionLen: description.length,
    hasLicense: typeof license === 'string' && license !== '',
    hasHomepage: extras.hasHomepage === true,
    topics,
    readme,
  })
  const breakdown: ScoreBreakdown = { ...base.breakdown, practical, ease, signal }
  const total = weightedGeometricMean(breakdown)
  const confidence = confidenceOf({ hasDescription: description !== '', hasLicense: typeof license === 'string' && license !== '', readme, topics })
  const complete = breakdown.maintain !== null && breakdown.practical !== null && breakdown.popularity !== null && breakdown.ease !== null
  return {
    total: total === null ? null : Math.round(clip(total * confidence)),
    breakdown,
    confidence: Math.round(confidence * 100) / 100,
    explanation: buildExplanation(breakdown, extras.stars ?? null, extras.pushedAt ?? null, extras),
    complete,
  }
}

/** 全量 stars 的 p99（动态基准，避免硬编码）。 */
export function computeP99Stars(starsList: Array<number | null>): number {
  const nums = starsList.filter((s): s is number => typeof s === 'number' && s >= 0)
  if (nums.length === 0) return 1
  const sorted = nums.sort((a, b) => a - b)
  const idx = Math.min(sorted.length - 1, Math.floor(sorted.length * 0.99))
  return Math.max(sorted[idx], 1)
}

/** 目录加载时为整批条目挂基础分（原地修改，返回同一数组）。 */
export function attachScores(entries: Array<{
  pushed: string | null
  stars: number | null
  license: string | null
  description: string
  topics: string[]
  openIssues?: number | null
  forks?: number | null
  homepage?: string | null
  readmeSig?: { len: number | null; installSection: boolean; codeBlocks: number; heading: boolean; cmds: string[]; needsConfig: boolean } | null
  score?: ScoreView | null
  isPlugin?: boolean | null
}>): void {
  // v1.7.52：p99 口径修正——只在 isPlugin===true 的插件群体上取（与 dsh.market
  // 在其已收录插件集上取 p99 同口径）。此前用全量 topic 仓库（含 react-resume
  // 等 8 万星非插件）当基准，p99 被抬高、热度分被系统性压低——「90 分以上只有
  // 一个」的重要原因之一。无任何判定插件时回退全量。
  const pluginStars = entries.filter(e => e.isPlugin === true).map(e => e.stars)
  const p99 = computeP99Stars(pluginStars.length > 0 ? pluginStars : entries.map(e => e.stars))
  for (const e of entries) {
    // v1.7.68：stars/pushed 变化时重算基础分（此前 score 一经挂载就跨刷新保留，
    // 星数涨了热度维还是旧值——「★2 但热度 0」的数据不同步根因）。
    // 重算时保留 README 富化维度（实用/便捷/信号），只刷新基础三维并重新融合。
    if (e.score != null && e.score.starsAt === e.stars && e.score.pushedAt === e.pushed) continue
    const old = e.score
    e.score = computeBaseScore({
      pushedAt: e.pushed,
      stars: e.stars,
      openIssues: typeof e.openIssues === 'number' ? e.openIssues : null,
      forks: typeof e.forks === 'number' ? e.forks : null,
      hasDescription: typeof e.description === 'string' && e.description !== '',
      descriptionLen: typeof e.description === 'string' ? e.description.length : 0,
      hasLicense: typeof e.license === 'string' && e.license !== '',
      hasHomepage: typeof e.homepage === 'string' && e.homepage !== '',
      topics: e.topics ?? [],
      p99Stars: p99,
      readmeSig: e.readmeSig ?? null,
    })
    if (old != null && old.complete === true) {
      e.score.breakdown.practical = old.breakdown.practical
      e.score.breakdown.ease = old.breakdown.ease
      if (old.breakdown.signal > e.score.breakdown.signal) e.score.breakdown.signal = old.breakdown.signal
      refoldScore(e.score)
    }
  }
}
