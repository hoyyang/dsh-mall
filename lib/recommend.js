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
import { loadRegistry, readState, writeState } from "./catalog.js";
import { readManifest } from "./install.js";
const MMR_LAMBDA = 0.7;
const NOVEL_DAYS = 30;
const HISTORY_CAP = 60;
const DECAY_HALF_DAYS = 14;
const THIN_INSTALLS = 2;
/** v1.7.55：问卷功能 id → 匹配关键词（topics/tags/分类/简介/名称，中英混合）。 */
export const QUIZ_KEYWORDS = {
    vision: ['vision', 'ocr', 'screenshot', 'image', 'captcha', '视觉', '识别', '截图', '看图'],
    files: ['file', 'doc', 'pdf', 'excel', 'markdown', 'office', '文件', '文档', '表格'],
    browser: ['browser', 'web', 'playwright', 'puppeteer', 'chrome', 'page', '浏览器', '网页', '页面'],
    notify: ['wechat', 'feishu', 'slack', 'telegram', 'notification', 'push', 'dingtalk', '通知', '推送', '消息'],
    search: ['search', '搜索', '检索', '查询'],
    memory: ['memory', 'context', 'note', '记忆', '上下文', '笔记', '会话'],
    devtools: ['terminal', 'shell', 'git', 'dev', 'cli', 'tool', 'code', '开发', '终端', '工具', '命令行'],
    data: ['dashboard', 'analytics', 'chart', 'data', 'stats', '看板', '数据', '统计'],
    fun: ['game', 'fun', 'pet', 'entertain', '游戏', '娱乐', '桌面宠物', '摸鱼'],
    theme: ['skin', 'theme', 'ui', 'style', 'beauty', '皮肤', '主题', '界面', '美化'],
    voice: ['voice', 'tts', 'asr', 'audio', 'speech', '语音', '音频', '朗读'],
    imagegen: ['image-gen', 'image generation', 'diffusion', 'draw', 'paint', '图像生成', '生图', '绘画', '生成图片'],
    agent: ['agent', 'automation', 'workflow', '智能体', '自动化', '工作流', '自主'],
    security: ['security', 'audit', 'scan', 'vuln', '安全', '审计', '扫描', '漏洞'],
};
function featureOf(e) {
    const out = new Set();
    if (e.category !== 'other')
        out.add('cat:' + e.category);
    for (const t of e.topics ?? [])
        out.add('topic:' + t.toLowerCase());
    for (const t of e.tagsZh ?? [])
        out.add('tag:' + t);
    return [...out];
}
function jaccard(a, b) {
    if (a.length === 0 || b.length === 0)
        return 0;
    const setB = new Set(b);
    const inter = a.filter((x) => setB.has(x)).length;
    return inter / new Set([...a, ...b]).size;
}
/** 已装判定：npm 包名 / owner-repo 匹配目录条目。 */
function isInstalledEntry(e, installed) {
    if (installed.has((e.owner + '/' + e.name).toLowerCase()))
        return true;
    if (e.npm !== null && installed.has(e.npm.toLowerCase()))
        return true;
    return false;
}
/** 问卷匹配度：答案关键词命中条目 topics/tags/分类/简介/名称 的比例。 */
function quizSimilarity(e, answers) {
    if (answers.length === 0)
        return { sim: 0, hits: [] };
    const hay = [
        ...featureOf(e),
        e.name,
        e.description,
        (e.tagDescriptions?.zh ?? ''),
        (e.tagDescriptions?.en ?? ''),
    ].join(' ').toLowerCase();
    const hits = [];
    for (const a of answers) {
        const kws = QUIZ_KEYWORDS[a] ?? [];
        if (kws.some((k) => hay.includes(k.toLowerCase())))
            hits.push(a);
    }
    return { sim: hits.length / answers.length, hits };
}
function reasonsFor(e, profileFeatures, novelty, quizHits) {
    const out = [];
    const feats = featureOf(e);
    // v1.7.54：问卷命中的理由置顶（用户主动选的功能是最强个性化信号）
    if (quizHits.length > 0)
        out.push('符合你选的功能：' + quizHits.slice(0, 3).join('、'));
    const hitCats = profileFeatures.filter((f) => f.startsWith('cat:') && feats.includes(f));
    if (hitCats.length > 0)
        out.push('与你已装的「' + (e.category === 'other' ? '同域' : (hitCats[0] ?? '').slice(4)) + '」同类');
    const hitTags = profileFeatures.filter((f) => (f.startsWith('tag:') || f.startsWith('topic:')) && feats.includes(f));
    if (hitTags.length > 0)
        out.push('标签相似（' + hitTags.length + ' 个共同点）');
    if ((e.score?.total ?? 0) >= 85)
        out.push('综合分 ' + e.score?.total + '，质量过硬');
    if (novelty)
        out.push('近 30 天更新活跃');
    if (e.curated)
        out.push('awesome 人工策展精选');
    if (out.length === 0)
        out.push((e.score?.total ?? 0) >= 70 ? '综合评分靠前' : '社区关注度高');
    return out.slice(0, 3);
}
/** 老手路径：画像相似 + MMR 多样性。 */
function veteranRecommend(plugins, installed, weights, quiz, limit) {
    const now = Date.now();
    const profNorm = Math.sqrt([...weights.values()].reduce((a, b) => a + b * b, 0));
    const pool = plugins.filter((e) => !isInstalledEntry(e, installed) && e.excluded == null);
    const scored = pool.map((e) => {
        const feats = featureOf(e);
        let dot = 0;
        let hits = 0;
        for (const f of feats) {
            const w = weights.get(f) ?? 0;
            if (w > 0) {
                dot += w;
                hits++;
            }
        }
        const similarity = profNorm === 0 ? 0 : Math.min(1, dot / (Math.sqrt(hits) * profNorm));
        const novel = e.pushed !== null && now - Date.parse(e.pushed) <= NOVEL_DAYS * 86400000;
        const qz = quizSimilarity(e, quiz);
        const composite = similarity * 0.6 + ((e.score?.total ?? 0) / 100) * 0.3 + (novel ? 0.1 : 0) + qz.sim * 0.12;
        return { e, similarity: similarity + qz.sim * 0.2, novel, composite, feats, qz };
    }).filter((s) => s.similarity > 0.02 || s.novel || s.qz.sim > 0 || (s.e.score?.total ?? 0) >= 80);
    // MMR 贪心
    const selected = [];
    const poolSet = [...scored];
    while (poolSet.length > 0 && selected.length < limit) {
        let bestIdx = 0;
        let bestScore = Number.NEGATIVE_INFINITY;
        for (let i = 0; i < poolSet.length; i++) {
            const c = poolSet[i];
            let maxSim = 0;
            for (const s of selected) {
                const sim = jaccard(c.feats, s.feats);
                if (sim > maxSim)
                    maxSim = sim;
            }
            const mmr = MMR_LAMBDA * c.composite - (1 - MMR_LAMBDA) * maxSim;
            if (mmr > bestScore) {
                bestScore = mmr;
                bestIdx = i;
            }
        }
        selected.push(poolSet[bestIdx]);
        poolSet.splice(bestIdx, 1);
    }
    return selected.map((s) => ({
        entry: s.e,
        similarity: Math.round(Math.min(1, s.similarity) * 100) / 100,
        reasons: reasonsFor(s.e, [...weights.keys()], s.novel, s.qz.hits),
    }));
}
/** 冷启动问卷路径：问卷匹配×0.7 + 综合分×0.3 + 近 30 天×0.1（画像薄弱时主力）。 */
function quizRecommend(plugins, installed, quiz, limit) {
    const now = Date.now();
    const pool = plugins.filter((e) => !isInstalledEntry(e, installed) && e.excluded == null);
    const scored = pool.map((e) => {
        const qz = quizSimilarity(e, quiz);
        const novel = e.pushed !== null && now - Date.parse(e.pushed) <= NOVEL_DAYS * 86400000;
        const composite = qz.sim * 0.7 + ((e.score?.total ?? 0) / 100) * 0.3 + (novel ? 0.1 : 0);
        return { e, composite, qz, novel };
    }).filter((s) => s.qz.sim > 0 || (s.e.score?.total ?? 0) >= 75);
    scored.sort((a, b) => b.composite - a.composite);
    return scored.slice(0, limit).map((s) => ({
        entry: s.e,
        similarity: Math.round(s.qz.sim * 100) / 100,
        reasons: reasonsFor(s.e, [], s.novel, s.qz.hits),
    }));
}
/** 新手路径：高分精选 + 无需配置 + 置信度（dsh.market noviceGuess 同款）。 */
function noviceRecommend(plugins, installed, limit) {
    const pool = plugins.filter((e) => !isInstalledEntry(e, installed) && e.excluded == null);
    const scored = pool.map((e) => {
        let s = e.score?.total ?? 0;
        if (e.readmeSig?.needsConfig === false)
            s += 8;
        if (e.curated)
            s += 10;
        if ((e.score?.confidence ?? 0) > 0.5)
            s += 3;
        return { e, s };
    });
    scored.sort((a, b) => b.s - a.s);
    return scored.slice(0, limit).map(({ e }) => ({
        entry: e,
        similarity: 0,
        reasons: reasonsFor(e, [], false, []),
    }));
}
// ------------------------------------------------------------ 画像持久化
function todayStr() {
    return new Date().toISOString().slice(0, 10);
}
/** 把当前已装画像按日期快照写进 state.json（同日覆盖、跨天累积、保留 60 天）。 */
function snapshotProfile(profile, features, installCount) {
    const state = readState(profile);
    const rp = state.recommendProfile ?? { history: [] };
    const today = todayStr();
    const cats = {};
    const topics = {};
    const tags = {};
    for (const f of features) {
        if (f.startsWith('cat:')) {
            const k = f.slice(4);
            cats[k] = (cats[k] ?? 0) + 1;
        }
        else if (f.startsWith('topic:')) {
            const k = f.slice(6);
            topics[k] = (topics[k] ?? 0) + 1;
        }
        else if (f.startsWith('tag:')) {
            const k = f.slice(4);
            tags[k] = (tags[k] ?? 0) + 1;
        }
    }
    const history = (rp.history ?? []).filter((h) => h.date !== today);
    history.push({ date: today, cats, topics, tags, installs: installCount });
    rp.history = history.slice(-HISTORY_CAP);
    state.recommendProfile = rp;
    writeState(profile, state);
}
/** 跨天历史聚合：权重 = 0.5^(天数/14)，半衰期 14 天。 */
function aggregateHistory(profile, todayFeatures, todayInstalls) {
    const state = readState(profile);
    const history = (state.recommendProfile?.history ?? []).filter((h) => h.date !== todayStr());
    const weights = new Map();
    let installs = 0;
    const now = Date.now();
    const add = (pref, map, w) => {
        for (const [k, v] of Object.entries(map ?? {}))
            weights.set(pref + k, (weights.get(pref + k) ?? 0) + v * w);
    };
    for (const h of history) {
        const daysAgo = Math.max(0, Math.round((now - Date.parse(h.date)) / 86400000));
        const w = Math.pow(0.5, daysAgo / DECAY_HALF_DAYS);
        add('cat:', h.cats, w);
        add('topic:', h.topics, w);
        add('tag:', h.tags, w);
        installs += (h.installs ?? 0) * w;
    }
    // 今日快照全额计入（w=1）
    for (const f of todayFeatures)
        weights.set(f, (weights.get(f) ?? 0) + 1);
    installs += todayInstalls;
    return { weights, installs: Math.round(installs), days: history.length + (todayInstalls > 0 ? 1 : 0) };
}
// ------------------------------------------------------------------ 主入口
/** 主入口：返回「为你推荐」列表（含理由）+ 画像统计；quizAnswers 时先持久化问卷。 */
export async function recommendFor(profile, token, limit = 10, quizAnswers) {
    const { registry } = await loadRegistry(profile, token, {});
    const manifest = readManifest(profile);
    const installed = new Set();
    for (const dep of Object.keys(manifest.dependencies))
        installed.add(dep.toLowerCase());
    for (const bundle of manifest.bundles)
        installed.add(bundle.toLowerCase());
    // 画像：已装条目特征聚合（今日快照）
    const todayFeatures = [];
    let installedCount = 0;
    for (const e of registry.plugins) {
        if (!isInstalledEntry(e, installed))
            continue;
        installedCount++;
        for (const f of featureOf(e))
            todayFeatures.push(f);
    }
    // 问卷持久化（POST quiz 时传入）
    if (Array.isArray(quizAnswers) && quizAnswers.length > 0) {
        const state = readState(profile);
        const rp = state.recommendProfile ?? { history: [] };
        rp.quiz = { answers: [...new Set(quizAnswers)].slice(0, 5), at: new Date().toISOString() };
        state.recommendProfile = rp;
        writeState(profile, state);
    }
    const stateNow = readState(profile);
    const quiz = stateNow.recommendProfile?.quiz?.answers ?? [];
    const hasQuiz = quiz.length > 0;
    // 今日快照落盘（跨天累积）
    if (todayFeatures.length > 0)
        snapshotProfile(profile, todayFeatures, installedCount);
    const agg = aggregateHistory(profile, todayFeatures, installedCount);
    const weights = agg.weights;
    let items;
    if (hasQuiz && agg.installs < THIN_INSTALLS) {
        // 画像薄弱 + 已答卷：问卷路径为主
        items = quizRecommend(registry.plugins, installed, quiz, limit);
    }
    else if (weights.size === 0 && !hasQuiz) {
        items = noviceRecommend(registry.plugins, installed, limit);
    }
    else {
        items = veteranRecommend(registry.plugins, installed, weights, quiz, limit);
    }
    // 画像推荐不足时用新手路径补齐
    if (items.length < limit) {
        const have = new Set(items.map((r) => r.entry.owner + '/' + r.entry.name));
        for (const n of noviceRecommend(registry.plugins, installed, limit * 2)) {
            if (items.length >= limit)
                break;
            if (!have.has(n.entry.owner + '/' + n.entry.name))
                items.push(n);
        }
    }
    const stats = {
        days: agg.days,
        installs: agg.installs,
        hasQuiz,
        quizAt: stateNow.recommendProfile?.quiz?.at ?? null,
        showQuiz: !hasQuiz && agg.installs < THIN_INSTALLS,
    };
    return { items: items.slice(0, limit), stats };
}
