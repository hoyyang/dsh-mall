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
const WEIGHTS = { maintain: 0.3, practical: 0.25, popularity: 0.2, ease: 0.15, signal: 0.1 };
function clip(v, min = 0, max = 100) {
    return Math.max(min, Math.min(max, v));
}
function log1p(x) {
    return Math.log(1 + x);
}
/** Wilson Score 置信区间下界（小样本比例的稳健估计，dsh.market 同款）。 */
export function wilsonLowerBound(positives, total, z = 1.96) {
    if (total <= 0)
        return 0;
    const p = positives / total;
    const z2 = z * z;
    return (p + z2 / (2 * total) - z * Math.sqrt((p * (1 - p)) / total + z2 / (4 * total * total))) / (1 + z2 / total);
}
/** 1. 维护活跃：pushed 新鲜度×0.6 + issue 健康度×0.4。
 *  openIssues 缺失（索引 v1.17 前无此字段）时 issue 健康度取中性 0.5 降级。 */
export function scoreMaintain(pushedAt, stars, openIssues) {
    if (pushedAt === null || pushedAt === '')
        return null;
    const t = Date.parse(pushedAt);
    if (Number.isNaN(t))
        return null;
    const days = Math.max(0, (Date.now() - t) / 86_400_000);
    const commitActivity = days < 7 ? 1.0 : days < 30 ? 0.8 : days < 90 ? 0.5 : days < 180 ? 0.3 : 0.1;
    // issue 健康度：问题率越低越健康（小样本用 Wilson）
    const issueHealth = openIssues === null || openIssues === undefined
        ? 0.5
        : 1 - Math.min(wilsonLowerBound(openIssues, Math.max(stars ?? 0, 1)) * 10, 1);
    return Math.round(clip(commitActivity * 0.6 + issueHealth * 0.4) * 100);
}
function practicalCount(value) {
    return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0;
}
export const PRACTICAL_EVIDENCE_VERSION = 3;
export const PRACTICAL_PARSER_REVISION = 3;
const PRACTICAL_SCORER_REVISION = 4;
const PRACTICAL_CURVE_EXPONENT = 0.9;
export function currentPracticalEvidence(evidence) {
    return evidence?.version === PRACTICAL_EVIDENCE_VERSION && evidence.parserRevision === PRACTICAL_PARSER_REVISION;
}
function practicalEvidenceFingerprint(evidence) {
    return currentPracticalEvidence(evidence)
        ? [
            evidence.version,
            evidence.parserRevision,
            PRACTICAL_SCORER_REVISION,
            evidence.capabilityItems,
            evidence.usageItems,
            evidence.usageActions,
            evidence.ioPairs,
            evidence.codeExamples,
            evidence.usecaseItems,
            evidence.outputItems,
            evidence.media,
            evidence.reliabilityItems,
            evidence.confidence.overall,
            evidence.confidence.coverage,
            evidence.confidence.fallbackShare,
        ]
            .map((value, index) => index < 3 ? value : Math.round(practicalCount(value) * 1000) / 1000)
            .join(':')
        : null;
}
/**
 * 实用度 V3 的五个可审计子维度。证据先由 parser 做语义归属、全局去重与 family cap，再在 scorer 中映射。
 * 每个 anchor 严格等于 frozen rubric/parser cap，保证 cap 内每条合法证据都有边际价值且满证据严格为 100；
 * 共享 0.9 次幂是 citation-grounded 全门控 5-fold 的中位数，也是完整开发集综合第一；只有轻微边际递减；
 * confidence 仅描述证据、不改变分数。
 */
export function scorePracticalDimensions(evidence) {
    if (!currentPracticalEvidence(evidence))
        return null;
    const credit = (count, anchor, points) => points * Math.min(1, Math.pow(practicalCount(count) / anchor, PRACTICAL_CURVE_EXPONENT));
    return {
        capability: credit(evidence.capabilityItems, 12, 25),
        usage: Math.min(25, credit(evidence.usageItems, 10, 8)
            + credit(evidence.usageActions, 10, 8)
            + credit(evidence.ioPairs, 8, 4)
            + credit(evidence.codeExamples, 4, 5)),
        usecases: credit(evidence.usecaseItems, 10, 20),
        demo: Math.min(15, credit(evidence.outputItems, 8, 6) + credit(evidence.media, 6, 9)),
        reliability: credit(evidence.reliabilityItems, 10, 15),
    };
}
/** 2. 实用度 v3：加权 README 实证；长度/安装/配置不参与，代码示例最多 5 分。 */
export function scorePractical(evidence) {
    const dimensions = scorePracticalDimensions(evidence);
    if (dimensions === null)
        return null;
    return Math.round(clip(Object.values(dimensions).reduce((sum, value) => sum + value, 0)));
}
/**
 * 3. 生态热度 v2（v1.8.0，用户拍板口径）：
 *   热度 = 0.40·starScore + 0.25·dlScore + 0.20·momentum + 0.15·forkScore
 * 公平原则：有实测下载量（dl30≥100，防 pkg_name 撞名护栏）用实测值；
 * 无实测用 star 数无偏换算的等效下载量 774·(stars+1)^0.16，同权参与——
 * 「有/无 npm 数据」身份零加成，分差只来自真实值与预测值的偏差。
 * 动量 = 真实 dl 周环比（0.7，小样本闸门 dl7prev<50 中性）+ 星 30 天增量
 * （0.3，基线<10 星中性）；缺数据取中性 50，不惩罚。
 */
const DL_SIM_A = 774;
const DL_SIM_B = 0.16;
/** dl30 低于该值视为占位/撞名噪声信号，走 star 换算路径。 */
const DL_FLOOR = 100;
// downloads.json 拉取落地前的中性基准（随后由 setDownloadBaselines 覆盖并强制重算）。
let P99_DL30 = 5000;
let P99_DL_YTD = 20000;
/** v1.8.0 热数据模块态：downloads.json / star-history.json 拉取结果（hotdata.ts 写入）。 */
let HOT_DL = null;
let HOT_STAR_DELTA = null;
export function setHotScores(dl, starDelta) {
    HOT_DL = dl;
    HOT_STAR_DELTA = starDelta;
}
export function hotScoresReady() {
    return HOT_DL !== null;
}
export function setDownloadBaselines(p99dl30, p99dlYTD) {
    if (Number.isFinite(p99dl30) && p99dl30 > 0)
        P99_DL30 = p99dl30;
    if (Number.isFinite(p99dlYTD) && p99dlYTD > 0)
        P99_DL_YTD = p99dlYTD;
}
function dlScoreOf(dl30, dlYTD) {
    return clip(0.7 * (100 * log1p(dl30) / log1p(Math.max(P99_DL30, 1)))
        + 0.3 * (100 * log1p(dlYTD) / log1p(Math.max(P99_DL_YTD, 1))));
}
export function scorePopularity(stars, forks, p99Stars, dl, starDelta30) {
    if (stars === null || stars === undefined)
        return null;
    const starScore = clip(100 * log1p(stars) / log1p(Math.max(p99Stars, 1)));
    const hasReal = dl !== null && dl !== undefined && dl.dl30 >= DL_FLOOR;
    if (stars === 0 && !hasReal)
        return 0; // 零星且无实测：无任何热度证据，不给模拟分
    const dlScore = hasReal
        ? dlScoreOf(dl.dl30, dl.dlYTD)
        : dlScoreOf(DL_SIM_A * Math.pow(stars + 1, DL_SIM_B), DL_SIM_A * Math.pow(stars + 1, DL_SIM_B));
    let dlMomentum = 50;
    if (hasReal && dl.dl7prev >= 50) {
        const x = (dl.dl7 - dl.dl7prev) / (dl.dl7prev + Math.max(50, 0.1 * dl.dl7prev));
        dlMomentum = 50 + 50 * Math.tanh(1.1 * x);
    }
    let starMomentum = 50;
    if (starDelta30 !== null && starDelta30 !== undefined) {
        const baseline = Math.max(stars - starDelta30, 0);
        if (baseline >= 10) {
            const x = starDelta30 / (baseline + Math.max(10, 0.1 * baseline));
            starMomentum = 50 + 50 * Math.tanh(1.1 * x);
        }
    }
    const momentum = 0.7 * dlMomentum + 0.3 * starMomentum;
    let forkScore = 50;
    if (forks !== null && forks !== undefined) {
        const rate = forks / Math.max(stars, 1);
        if (stars === 0)
            forkScore = 0;
        else if (rate <= 0.05)
            forkScore = (rate / 0.05) * 40;
        else if (rate <= 0.3)
            forkScore = 40 + ((rate - 0.05) / 0.25) * 50;
        else if (rate <= 0.5)
            forkScore = 90 - ((rate - 0.3) / 0.2) * 40;
        else
            forkScore = Math.max(10, 50 - (rate - 0.5) * 50);
    }
    return Math.round(clip(0.40 * starScore + 0.25 * dlScore + 0.20 * momentum + 0.15 * forkScore));
}
/** 4a. 便捷度（索引 CI 结构信号版）：安装命令/无需配置/结构说明，零网络。 */
export function scoreEaseFromSig(sig) {
    if (sig.len === null)
        return null;
    let s = 0;
    if (sig.cmds.length > 0)
        s += 35;
    else if (sig.installSection)
        s += 15;
    if (!sig.needsConfig)
        s += 35;
    if (sig.heading && sig.len > 100)
        s += 30;
    return Math.round(clip(s));
}
/** 4. 便捷度：README 有明确安装命令 + 无需额外配置（README 缺失时 null）。 */
export function scoreEase(readme, needsConfig) {
    if (readme === null)
        return null;
    const text = readme;
    let s = 0;
    if (/(git clone|pnpm add|npm install -g|npx skills add|npm i -g|pip install|dsh plugin add|dsh plugin)/i.test(text))
        s += 35;
    else if (/(install|安装)/i.test(text))
        s += 15;
    if (!needsConfig)
        s += 35;
    if (/^#\s+.+/m.test(text) && text.length > 100)
        s += 30;
    return Math.round(clip(s));
}
/** 5. 信号质量：description/license/homepage/topics/README 完备度。 */
export function scoreSignal(input) {
    let s = 0;
    if (input.hasDescription)
        s += 20;
    if (input.descriptionLen > 60)
        s += 15;
    if (input.hasLicense)
        s += 25;
    if (input.hasHomepage)
        s += 15;
    if (input.topics.length > 0)
        s += 20;
    if (input.readme !== null && input.readme.length > 100)
        s += 20;
    return Math.round(clip(s));
}
/** 加权几何平均（+1 平滑防 0 归零）；缺失维度剔除并把权重归一化。 */
function weightedGeometricMean(breakdown) {
    let sumW = 0;
    let prod = 1;
    const dims = ['maintain', 'practical', 'popularity', 'ease', 'signal'];
    for (const k of dims) {
        const v = breakdown[k];
        if (v === null)
            continue;
        sumW += WEIGHTS[k];
        prod *= Math.pow(v + 1, WEIGHTS[k]);
    }
    if (sumW <= 0)
        return null;
    return clip(Math.pow(prod, 1 / sumW) - 1);
}
/** 贝叶斯置信：description/license/readme/topics 四字段命中比例。 */
function confidenceOf(input) {
    const hits = [
        input.hasDescription,
        input.hasLicense,
        input.readme !== null,
        input.topics.length > 0,
    ].filter(Boolean).length;
    return hits / 4;
}
// ---------- 解释层（为什么推荐）----------
const REASONS = {
    maintain: { zh: '近期仍在更新，DSH 迭代快也不怕坏', en: 'actively maintained — survives fast DSH iterations' },
    practical: { zh: 'README 提供多类能力、用法、场景、产出与可靠性证据', en: 'README provides capability, usage, use-case, output, and reliability evidence' },
    popularity: { zh: '社区认可度高', en: 'well recognized by the community' },
    ease: { zh: '无需额外配置，开箱即用', en: 'works out of the box, no extra config' },
    signal: { zh: '项目信息完整（license/主题/文档齐全）', en: 'complete project metadata (license/topics/docs)' },
};
export function buildExplanation(breakdown, stars, pushedAt, extras = {}) {
    const zh = [];
    const en = [];
    const dims = ['maintain', 'practical', 'popularity', 'ease', 'signal'];
    let days = null;
    if (pushedAt !== null && pushedAt !== '') {
        const t = Date.parse(pushedAt);
        if (!Number.isNaN(t))
            days = Math.round((Date.now() - t) / 86_400_000);
    }
    const downloadReason = extras.dlActive === true && extras.dl30 != null && extras.dl30 > 0
        ? (extras.dl30 >= 1000 ? (Math.round(extras.dl30 / 100) / 10) + 'k' : String(extras.dl30))
        : null;
    for (const k of dims) {
        const v = breakdown[k];
        if (v === null || v < 70)
            continue;
        if (k === 'popularity' && downloadReason !== null) {
            zh.push('近 30 天 npm 下载 ' + downloadReason + ' 次');
            en.push('actively downloaded on npm (' + downloadReason + '/mo)');
            continue;
        }
        if (k === 'maintain' && days !== null && days >= 30) {
            zh.push('维护活跃（' + days + ' 天前有提交）');
            en.push('maintained (' + days + ' days since last push)');
            continue;
        }
        zh.push(REASONS[k].zh);
        en.push(REASONS[k].en);
    }
    if ((stars ?? 0) > 0) {
        const s = (stars ?? 0) >= 1000 ? (Math.round((stars ?? 0) / 100) / 10) + 'k stars' : (stars ?? 0) + ' stars';
        zh.push(s);
        en.push(s);
    }
    if (extras.curated === true) {
        zh.push('awesome 人工策展精选');
        en.push('awesome curated pick');
    }
    if (extras.verified === true) {
        zh.push('人工实测验证');
        en.push('human-verified');
    }
    if (extras.bundled === true) {
        zh.push('机器扫描可装配安装');
        en.push('machine-verified installable');
    }
    const dedupe = (arr) => [...new Set(arr)];
    const zhOut = dedupe(zh).slice(0, 3).join('；');
    const enOut = dedupe(en).slice(0, 3).join('; ');
    return { zh: zhOut, en: enOut };
}
/** 目录加载即算（零网络）：维护/热度/信号三维；实用/便捷 = null。
 *  v1.7.47：forks/open_issues/homepage 字段存在时按 dsh.market 全公式计算
 *  （索引 v1.18 起提供；缺失时自动降级，不编造数据）。 */
export function computeBaseScore(input) {
    const maintain = scoreMaintain(input.pushedAt, input.stars, input.openIssues);
    const popularity = scorePopularity(input.stars, input.forks, input.p99Stars, input.dl, input.starDelta);
    const signal = scoreSignal({ hasDescription: input.hasDescription, descriptionLen: input.descriptionLen, hasLicense: input.hasLicense, hasHomepage: input.hasHomepage, topics: input.topics, readme: null });
    // v1.7.50：索引 CI README 信号在场时实用/便捷零网络可算，五维当场齐全。
    const sig = input.readmeSig ?? null;
    const practical = sig !== null ? scorePractical(sig.practical) : null;
    const ease = sig !== null ? scoreEaseFromSig(sig) : null;
    const breakdown = { maintain, practical, popularity, ease, signal };
    const total = weightedGeometricMean(breakdown);
    const confidence = confidenceOf({ hasDescription: input.hasDescription, hasLicense: input.hasLicense, readme: sig !== null ? 'sig' : null, topics: input.topics });
    const complete = maintain !== null && practical !== null && popularity !== null && ease !== null;
    return {
        total: total === null ? null : Math.round(clip(total * confidence)),
        breakdown,
        confidence: Math.round(confidence * 100) / 100,
        explanation: buildExplanation(breakdown, input.stars, input.pushedAt, {
            dlActive: input.dl != null && input.dl.dl30 >= DL_FLOOR && popularity !== null && popularity >= 70,
            dl30: input.dl != null ? input.dl.dl30 : null,
        }),
        complete,
        starsAt: input.stars,
        pushedAt: input.pushedAt,
        dlActiveAt: input.dl != null && input.dl.dl30 >= DL_FLOOR && popularity !== null && popularity >= 70,
        dl30At: input.dl?.dl30 ?? null,
        practicalEvidenceAt: practicalEvidenceFingerprint(sig?.practical),
    };
}
/** v1.7.68：README 富化维度（实用/便捷/信号）保留、基础维度重算后的重新融合。 */
function refoldScore(score, extras = {}) {
    const total = weightedGeometricMean(score.breakdown);
    score.total = total === null ? null : Math.round(clip(total * score.confidence));
    score.complete = score.breakdown.maintain !== null && score.breakdown.practical !== null && score.breakdown.popularity !== null && score.breakdown.ease !== null;
    const dlActive = extras.dlActive ?? score.dlActiveAt;
    const dl30 = extras.dl30 ?? score.dl30At;
    score.explanation = buildExplanation(score.breakdown, score.starsAt ?? null, score.pushedAt ?? null, { ...extras, dlActive, dl30 });
    score.dlActiveAt = dlActive;
    score.dl30At = dl30;
    return score;
}
/** README 到手后只补全便捷/信号并重新融合（详情页/find/卡片页级富化）。
 *  practical 只能来自索引 readmeSig.practical，详情路径不得重解析或覆盖。 */
export function enrichScore(base, readme, needsConfig, extras = {}) {
    const ease = scoreEase(readme, needsConfig);
    const description = extras.description ?? '';
    const license = extras.license ?? null;
    const topics = extras.topics ?? [];
    const signal = readme === null ? base.breakdown.signal : scoreSignal({
        hasDescription: description !== '',
        descriptionLen: description.length,
        hasLicense: typeof license === 'string' && license !== '',
        hasHomepage: extras.hasHomepage === true,
        topics,
        readme,
    });
    const breakdown = { ...base.breakdown, ease, signal };
    const total = weightedGeometricMean(breakdown);
    const confidence = confidenceOf({ hasDescription: description !== '', hasLicense: typeof license === 'string' && license !== '', readme, topics });
    const complete = breakdown.maintain !== null && breakdown.practical !== null && breakdown.popularity !== null && breakdown.ease !== null;
    const stars = extras.stars ?? base.starsAt;
    const pushedAt = extras.pushedAt ?? base.pushedAt;
    const dlActive = extras.dlActive ?? base.dlActiveAt;
    const dl30 = extras.dl30 ?? base.dl30At;
    return {
        total: total === null ? null : Math.round(clip(total * confidence)),
        breakdown,
        confidence: Math.round(confidence * 100) / 100,
        explanation: buildExplanation(breakdown, stars ?? null, pushedAt ?? null, { ...extras, dlActive, dl30 }),
        complete,
        starsAt: stars,
        pushedAt,
        dlActiveAt: dlActive,
        dl30At: dl30,
        practicalEvidenceAt: base.practicalEvidenceAt ?? null,
    };
}
/** 全量 stars 的 p99（动态基准，避免硬编码）。 */
export function computeP99Stars(starsList) {
    const nums = starsList.filter((s) => typeof s === 'number' && s >= 0);
    if (nums.length === 0)
        return 1;
    const sorted = nums.sort((a, b) => a - b);
    const idx = Math.min(sorted.length - 1, Math.floor(sorted.length * 0.99));
    return Math.max(sorted[idx], 1);
}
/** 目录加载时为整批条目挂基础分（原地修改，返回同一数组）。
 *  v1.8.0：force=true 时无条件重算（downloads.json/star-history 拉取落地后
 *  由 reapplyHotScores 触发），热度维随后接上实测下载量与星动量。 */
export function attachScores(entries, force = false) {
    // 身份证据态不应间接改写本期评分算法。新目录显式携带 v1.8.2 的候选人口；
    // 旧缓存/旧调用方没有该字段时回退历史 isPlugin 口径。
    const baselineStars = entries
        .filter(e => e.scoreBaselineEligible === true || (e.scoreBaselineEligible === undefined && e.isPlugin === true))
        .map(e => e.stars);
    const p99 = computeP99Stars(baselineStars.length > 0 ? baselineStars : entries.map(e => e.stars));
    for (const e of entries) {
        // v1.7.68：stars/pushed 变化时重算基础分（此前 score 一经挂载就跨刷新保留，
        // 星数涨了热度维还是旧值——「★2 但热度 0」的数据不同步根因）。
        // 重算时保留 README 富化维度（实用/便捷/信号），只刷新基础三维并重新融合。
        const practicalEvidenceAt = practicalEvidenceFingerprint(e.readmeSig?.practical);
        if (!force && e.score != null && e.score.starsAt === e.stars && e.score.pushedAt === e.pushed && e.score.practicalEvidenceAt === practicalEvidenceAt)
            continue;
        const old = e.score;
        // v1.8.0：热数据查表——实测下载量/星 30 天增量；缺失走无偏换算与中性动量。
        const npmKey = typeof e.npm === 'string' && e.npm !== '' ? e.npm.toLowerCase() : null;
        const dl = npmKey !== null && HOT_DL !== null ? (HOT_DL[npmKey] ?? null) : null;
        const starKey = (e.owner ?? '').trim().toLowerCase() + '/' + (e.name ?? '').trim().toLowerCase();
        const starDelta = HOT_STAR_DELTA !== null ? (HOT_STAR_DELTA[starKey] ?? null) : null;
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
            dl,
            starDelta,
            readmeSig: e.readmeSig ?? null,
        });
        if (old != null) {
            // practical/ease 仅当 canonical 输入指纹未变化时可继承；索引升级或证据变化必须用新值。
            if (old.complete === true && old.practicalEvidenceAt === practicalEvidenceAt) {
                e.score.breakdown.practical = old.breakdown.practical;
                e.score.breakdown.ease = old.breakdown.ease;
                if (old.breakdown.signal > e.score.breakdown.signal)
                    e.score.breakdown.signal = old.breakdown.signal;
            }
            refoldScore(e.score, {
                curated: e.curated === true,
                verified: e.verified != null,
                bundled: e.bundled === true,
                dlActive: dl != null && dl.dl30 >= DL_FLOOR && e.score.breakdown.popularity !== null && e.score.breakdown.popularity >= 70,
                dl30: dl?.dl30 ?? null,
            });
        }
    }
}
