/**
 * 本地已装 + 推荐（v1.7.52，借鉴 2BingLing/dsh-market recommend.ts 架构，MIT）：
 * - 画像来源：profile 的 package.json dependencies + dsh.profile.bundles（readManifest）
 *   → 匹配目录条目 → 聚合其 category/topics/tagsZh 为「用户画像向量」。
 * - 新手（无画像）：高分精选 + 无需配置加分 + 置信度加分（dsh.market noviceGuess 同款）。
 * - 老手（有画像）：标签/分类加权余弦相似×0.6 + 五维总分/100×0.3 + 近 30 天更新×0.1，
 *   MMR 贪心（λ=0.7）去同类；排除已装与剔除条目；理由规则生成（中文）。
 * 不依赖 LLM：tagsZh 来自 tags.json（手动打标），缺失时回退 topics/分类。
 */
import type { MarketEntry } from './types.ts';
export interface Recommendation {
    entry: MarketEntry;
    reasons: string[];
    similarity: number;
}
/** 主入口：返回「为你推荐」列表（含理由）。 */
export declare function recommendFor(profile: string, token: string, limit?: number): Promise<Recommendation[]>;
