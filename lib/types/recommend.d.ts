/**
 * 本地已装 + 推荐（v1.7.52，借鉴 2BingLing/dsh-market recommend.ts 架构，MIT）：
 * - 画像来源：profile 的 package.json dependencies + dsh.profile.bundles（readManifest）
 *   → 匹配目录条目 → 聚合其 category/topics/tagsZh 为「用户画像向量」。
 * - v1.7.55 画像跨天持久化：每次推荐把当天画像快照写入 state.json
 *   （recommendProfile.history，同日覆盖、跨天累积、保留 60 天），
 *   聚合权重按半衰期 14 天衰减——装越多、越近，推荐越准。
 * - v1.7.55 冷启动问卷：画像薄弱（历史装机 <2）且无问卷时前端引导选功能；
 *   quiz 答案持久化 state.json（recommendProfile.quiz），匹配条目 topics/标签/简介/名称。
 * - 新手（无画像无问卷）：高分精选 + 无需配置加分 + 置信度加分（dsh.market noviceGuess 同款）。
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
/** v1.7.55：画像统计（前端徽标 + 冷启动判断）。 */
export interface ProfileStats {
    /** 有快照的天数（跨天累积）。 */
    days: number;
    /** 衰减聚合后的装机数。 */
    installs: number;
    hasQuiz: boolean;
    quizAt: string | null;
    /** 画像薄弱且未做问卷——前端显示冷启动问卷 CTA。 */
    showQuiz: boolean;
}
export interface RecommendResult {
    items: Recommendation[];
    stats: ProfileStats;
}
/** v1.7.55：问卷功能 id → 匹配关键词（topics/tags/分类/简介/名称，中英混合）。 */
export declare const QUIZ_KEYWORDS: Record<string, string[]>;
/** 主入口：返回「为你推荐」列表（含理由）+ 画像统计；quizAnswers 时先持久化问卷。 */
export declare function recommendFor(profile: string, token: string, limit?: number, quizAnswers?: string[]): Promise<RecommendResult>;
