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
    maintain: number | null;
    practical: number | null;
    popularity: number | null;
    ease: number | null;
    signal: number;
}
export interface ScoreView {
    total: number | null;
    breakdown: ScoreBreakdown;
    /** 字段齐全度 0-1（description/license/readme/topics 命中比例）。 */
    confidence: number;
    explanation: {
        zh: string;
        en: string;
    };
    /** 五维全部可得（卡片雷达图渲染门槛）。 */
    complete: boolean;
}
/** 1. 维护活跃：pushed 新鲜度（无 open_issues 数据，issue 健康度降级）。 */
export declare function scoreMaintain(pushedAt: string | null): number | null;
/** 2. 实用度：README 结构完备度（README 缺失时 null）。 */
export declare function scorePractical(readme: string | null): number | null;
/** 3. 生态热度：stars 对数归一化（p99 动态基准；无 forks 数据，fork 参与率降级）。 */
export declare function scorePopularity(stars: number | null, p99Stars: number): number | null;
/** 4. 便捷度：README 有明确安装命令 + 无需额外配置（README 缺失时 null）。 */
export declare function scoreEase(readme: string | null, needsConfig: boolean): number | null;
/** 5. 信号质量：description/license/topics/README 完备度。 */
export declare function scoreSignal(input: {
    hasDescription: boolean;
    descriptionLen: number;
    hasLicense: boolean;
    topics: string[];
    readme: string | null;
}): number;
export declare function buildExplanation(breakdown: ScoreBreakdown, stars: number | null, pushedAt: string | null, extras?: {
    curated?: boolean;
    verified?: boolean;
    bundled?: boolean;
}): {
    zh: string;
    en: string;
};
export interface ScoreInput {
    pushedAt: string | null;
    stars: number | null;
    hasDescription: boolean;
    descriptionLen: number;
    hasLicense: boolean;
    topics: string[];
    p99Stars: number;
}
/** 目录加载即算（零网络）：维护/热度/信号三维；实用/便捷 = null。 */
export declare function computeBaseScore(input: ScoreInput): ScoreView;
/** README 到手后补全实用/便捷两维并重新融合（详情页/find/卡片页级富化）。 */
export declare function enrichScore(base: ScoreView, readme: string | null, needsConfig: boolean, extras?: {
    stars?: number | null;
    pushedAt?: string | null;
    curated?: boolean;
    verified?: boolean;
    bundled?: boolean;
}): ScoreView;
/** 全量 stars 的 p99（动态基准，避免硬编码）。 */
export declare function computeP99Stars(starsList: Array<number | null>): number;
/** 目录加载时为整批条目挂基础分（原地修改，返回同一数组）。 */
export declare function attachScores(entries: Array<{
    pushed: string | null;
    stars: number | null;
    license: string | null;
    description: string;
    topics: string[];
    score?: ScoreView | null;
}>): void;
