/**
 * 本地已装 + 推荐（v1.7.52，借鉴 2BingLing/dsh-market recommend.ts 架构，MIT）：
 * - 画像来源：profile 的 package.json dependencies + dsh.profile.bundles（readManifest）
 *   → 匹配目录条目 → 聚合其 category/topics/tagsZh 为「用户画像向量」。
 * - 新手（无画像）：高分精选 + 无需配置加分 + 置信度加分（dsh.market noviceGuess 同款）。
 * - 老手（有画像）：标签/分类加权余弦相似×0.6 + 五维总分/100×0.3 + 近 30 天更新×0.1，
 *   MMR 贪心（λ=0.7）去同类；排除已装与剔除条目；理由规则生成（中文）。
 * 不依赖 LLM：tagsZh 来自 tags.json（手动打标），缺失时回退 topics/分类。
 */

import { loadRegistry, readState } from './catalog.ts'
import { readManifest } from './install.ts'
import type { MarketEntry } from './types.ts'

const MMR_LAMBDA = 0.7
const NOVEL_DAYS = 30

interface Reason {
  zh: string
}

export interface Recommendation {
  entry: MarketEntry
  reasons: string[]
  similarity: number
}

function featureOf(e: MarketEntry): string[] {
  const out = new Set<string>()
  if (e.category !== 'other') out.add('cat:' + e.category)
  for (const t of e.topics ?? []) out.add('topic:' + t.toLowerCase())
  for (const t of e.tagsZh ?? []) out.add('tag:' + t)
  return [...out]
}

function jaccard(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0
  const setB = new Set(b)
  const inter = a.filter((x) => setB.has(x)).length
  return inter / new Set([...a, ...b]).size
}

/** 已装判定：npm 包名 / owner-repo 匹配目录条目。 */
function isInstalledEntry(e: MarketEntry, installed: Set<string>): boolean {
  if (installed.has((e.owner + '/' + e.name).toLowerCase())) return true
  if (e.npm !== null && installed.has(e.npm.toLowerCase())) return true
  return false
}

function reasonsFor(e: MarketEntry, profileFeatures: string[], novelty: boolean): string[] {
  const out: string[] = []
  const feats = featureOf(e)
  const hitCats = profileFeatures.filter((f) => f.startsWith('cat:') && feats.includes(f))
  if (hitCats.length > 0) out.push('与你已装的「' + (e.category === 'other' ? '同域' : (hitCats[0] ?? '').slice(4)) + '」同类')
  const hitTags = profileFeatures.filter((f) => (f.startsWith('tag:') || f.startsWith('topic:')) && feats.includes(f))
  if (hitTags.length > 0) out.push('标签相似（' + hitTags.length + ' 个共同点）')
  if ((e.score?.total ?? 0) >= 85) out.push('综合分 ' + e.score?.total + '，质量过硬')
  if (novelty) out.push('近 30 天更新活跃')
  if (e.curated) out.push('awesome 人工策展精选')
  if (out.length === 0) out.push((e.score?.total ?? 0) >= 70 ? '综合评分靠前' : '社区关注度高')
  return out.slice(0, 3)
}

/** 老手路径：画像相似 + MMR 多样性。 */
function veteranRecommend(plugins: MarketEntry[], installed: Set<string>, profileFeatures: string[], limit: number): Recommendation[] {
  const now = Date.now()
  const weights = new Map<string, number>()
  for (const f of profileFeatures) weights.set(f, (weights.get(f) ?? 0) + 1)
  const profNorm = Math.sqrt([...weights.values()].reduce((a, b) => a + b * b, 0))
  const pool = plugins.filter((e) => !isInstalledEntry(e, installed) && e.excluded == null)
  const scored = pool.map((e) => {
    const feats = featureOf(e)
    let dot = 0
    let hits = 0
    for (const f of feats) {
      const w = weights.get(f) ?? 0
      if (w > 0) { dot += w; hits++ }
    }
    const similarity = profNorm === 0 ? 0 : Math.min(1, dot / (Math.sqrt(hits) * profNorm))
    const novel = e.pushed !== null && now - Date.parse(e.pushed) <= NOVEL_DAYS * 86400000
    const composite = similarity * 0.6 + ((e.score?.total ?? 0) / 100) * 0.3 + (novel ? 0.1 : 0)
    return { e, similarity, novel, composite, feats }
  }).filter((s) => s.similarity > 0.02 || s.novel || (s.e.score?.total ?? 0) >= 80)

  // MMR 贪心
  const selected: typeof scored = []
  const poolSet = [...scored]
  while (poolSet.length > 0 && selected.length < limit) {
    let bestIdx = 0
    let bestScore = Number.NEGATIVE_INFINITY
    for (let i = 0; i < poolSet.length; i++) {
      const c = poolSet[i]
      let maxSim = 0
      for (const s of selected) {
        const sim = jaccard(c.feats, s.feats)
        if (sim > maxSim) maxSim = sim
      }
      const mmr = MMR_LAMBDA * c.composite - (1 - MMR_LAMBDA) * maxSim
      if (mmr > bestScore) { bestScore = mmr; bestIdx = i }
    }
    selected.push(poolSet[bestIdx])
    poolSet.splice(bestIdx, 1)
  }
  return selected.map((s) => ({
    entry: s.e,
    similarity: Math.round(s.similarity * 100) / 100,
    reasons: reasonsFor(s.e, profileFeatures, s.novel),
  }))
}

/** 新手路径：高分精选 + 无需配置 + 置信度（dsh.market noviceGuess 同款）。 */
function noviceRecommend(plugins: MarketEntry[], installed: Set<string>, limit: number): Recommendation[] {
  const pool = plugins.filter((e) => !isInstalledEntry(e, installed) && e.excluded == null)
  const scored = pool.map((e) => {
    let s = e.score?.total ?? 0
    if (e.readmeSig?.needsConfig === false) s += 8
    if (e.curated) s += 10
    if ((e.score?.confidence ?? 0) > 0.5) s += 3
    return { e, s }
  })
  scored.sort((a, b) => b.s - a.s)
  return scored.slice(0, limit).map(({ e }) => ({
    entry: e,
    similarity: 0,
    reasons: reasonsFor(e, [], false),
  }))
}

/** 主入口：返回「为你推荐」列表（含理由）。 */
export async function recommendFor(profile: string, token: string, limit = 8): Promise<Recommendation[]> {
  const { registry } = await loadRegistry(profile, token, {})
  const manifest = readManifest(profile)
  const installed = new Set<string>()
  for (const dep of Object.keys(manifest.dependencies)) installed.add(dep.toLowerCase())
  for (const bundle of manifest.bundles) installed.add(bundle.toLowerCase())

  // 画像：已装条目特征聚合
  const profileFeatures: string[] = []
  for (const e of registry.plugins) {
    if (!isInstalledEntry(e, installed)) continue
    for (const f of featureOf(e)) profileFeatures.push(f)
  }
  if (profileFeatures.length === 0) {
    return noviceRecommend(registry.plugins, installed, limit)
  }
  const recs = veteranRecommend(registry.plugins, installed, profileFeatures, limit)
  // 画像推荐不足时用新手路径补齐
  if (recs.length < limit) {
    const have = new Set(recs.map((r) => r.entry.owner + '/' + r.entry.name))
    for (const n of noviceRecommend(registry.plugins, installed, limit * 2)) {
      if (recs.length >= limit) break
      if (!have.has(n.entry.owner + '/' + n.entry.name)) recs.push(n)
    }
  }
  return recs.slice(0, limit)
}
