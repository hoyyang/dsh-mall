/**
 * Catalog pipeline: shard-fetch GitHub topic repos -> classify (curated map,
 * rule categories, isPlugin heuristic/verdicts) -> compute today's star
 * delta from the local snapshot -> serve through an in-memory TTL cache with
 * a bundled snapshot fallback. State (star baselines, verdicts) persists
 * under the profile directory.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchTopicPages, packageJsonVerdict, searchDshTopicRepos } from "./github.js";
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
];
const CDN_MAX_AGE_MS = 6 * 3600 * 1000;
/** 从索引条目收集 description_<lang> 富化字段为 { lang: 文本 } 映射。 */
function collectDescriptions(repo) {
    const out = {};
    for (const [k, v] of Object.entries(repo)) {
        if (k.startsWith('description_') && typeof v === 'string' && v !== '')
            out[k.slice('description_'.length)] = v;
    }
    return Object.keys(out).length > 0 ? out : null;
}
/** GitHub 仓库 → npm 发布名人工对照表：仓库根没有 package.json（monorepo 等）
 *  导致索引 pkg_name 富化失败时，用这里补上真实发布名（如 tt-a1i/archify 的
 *  DSH 集成发布为 @tt-a1i/archify-dsh），使本地安装能与 GitHub 卡正确关联。 */
const NPM_OVERRIDES = {
    'tt-a1i/archify': '@tt-a1i/archify-dsh',
};
/** Map the community index's 12 categories onto the dshmarket category set. */
const CDN_CATEGORY_MAP = {
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
};
function cdnEntry(repo, known, verdicts) {
    const key = repo.full_name.toLowerCase();
    const knownEntry = known[key];
    const verdict = verdicts[key];
    const [owner, name] = repo.full_name.split('/');
    const rawCategory = repo.category ?? 'other';
    const description = knownEntry?.description?.en ?? knownEntry?.description?.zh ?? repo.description ?? '';
    const topics = repo.topics ?? [];
    const hay = (name + ' ' + description + ' ' + topics.join(' ')).toLowerCase();
    let category = knownEntry?.category;
    if (category === undefined) {
        // Refine the CDN index's coarse buckets into the dshmarket category set:
        // web-ui splits into theme when skin/theme words hit; fun/workflow have no
        // CDN bucket at all and are picked up by rules instead.
        if (rawCategory === 'web-ui' && /(theme|skin|配色|主题|皮肤)/i.test(hay))
            category = 'theme';
        else if (/(game|pet|meme|娱乐|宠物|游戏)/i.test(hay))
            category = 'fun';
        else if (/(workflow|automation|scheduler|定时|自动化|工作流)/i.test(hay))
            category = 'workflow';
        else
            category = CDN_CATEGORY_MAP[rawCategory] ?? ruleCategory(name ?? key, description, topics);
    }
    const heuristic = heuristicIsPlugin({ name: name ?? key, description: repo.description, topics });
    let isPlugin = verdict !== undefined ? verdict : heuristic;
    if (verdict === undefined) {
        if (repo.installable === 'non-plugin')
            isPlugin = false;
        else if (repo.market_tags?.includes('verified-install') === true || (repo.pkg_name ?? null) !== null)
            isPlugin = true;
    }
    const npm = knownEntry?.npm ?? NPM_OVERRIDES[key] ?? (typeof repo.pkg_name === 'string' && repo.pkg_name !== '' && repo.installable !== 'non-plugin' ? repo.pkg_name : null);
    const verified = typeof repo.verdict === 'string' && repo.verdict !== ''
        ? { by: repo.verifiedBy ?? '', at: repo.verifiedAt ?? '', reportUrl: repo.reportUrl ?? null }
        : null;
    const d = repo.disclosure;
    return {
        name: name ?? key,
        owner: owner ?? '',
        url: repo.html_url,
        category,
        description: description.length > 200 ? description.slice(0, 200) + '…' : description,
        descriptions: collectDescriptions(repo),
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
    };
}
/** Decompress a gzip response body (registry.json.gz via jsDelivr/raw). */
async function gunzipText(res) {
    const body = res.body;
    if (body === null)
        throw new Error('empty body');
    const stream = body.pipeThrough(new DecompressionStream('gzip'));
    return new Response(stream).text();
}
/** Fetch one index URL. The .gz variant (6.3MB -> ~1MB) and the plain JSON are
 *  tried IN PARALLEL — whichever answers first wins. This matters on diverse
 *  networks: raw can be fast where jsDelivr times out and vice versa, and the
 *  gz path is dramatically cheaper on slow links. 30s per attempt keeps the
 *  CDN channel budget small so the crawl/snapshot fallbacks engage quickly. */
async function fetchIndexUrl(url) {
    const variants = url.endsWith('.json') ? [url + '.gz', url] : [url];
    const attempt = async (variant) => {
        const res = await fetch(variant, {
            headers: { accept: 'application/json', 'accept-encoding': 'gzip', 'user-agent': 'dsh-store' },
            signal: AbortSignal.timeout(30_000),
        });
        if (!res.ok)
            throw new Error('HTTP ' + res.status);
        const contentEncoding = (res.headers.get('content-encoding') ?? '').toLowerCase();
        const raw = contentEncoding.includes('gzip') || variant.endsWith('.gz')
            ? await gunzipText(res)
            : await res.text();
        return JSON.parse(raw);
    };
    const results = await Promise.allSettled(variants.map(attempt));
    for (const result of results) {
        if (result.status === 'fulfilled')
            return result.value;
    }
    const reason = results.find((r) => r.status === 'rejected')?.reason;
    throw new Error('index fetch failed: ' + (reason instanceof Error ? reason.message : String(reason)));
}
async function fetchCdnRegistry(profile, customUrl) {
    let lastError = '';
    // A user-configured source (settings card or DSH_STORE_REGISTRY_URL env) is
    // tried first; the default CDN index remains the fallback when it fails.
    const urls = customUrl.trim() !== '' ? [customUrl.trim(), ...CDN_URLS] : CDN_URLS;
    for (const url of urls) {
        try {
            const body = await fetchIndexUrl(url);
            if (!Array.isArray(body.repos) || body.repos.length === 0)
                throw new Error('empty index');
            const age = Date.now() - Date.parse(body.generated_at ?? '');
            if (Number.isFinite(age) && age > CDN_MAX_AGE_MS)
                throw new Error('index too old (' + Math.round(age / 3600_000) + 'h)');
            const known = loadKnown();
            const verdicts = verdictsOf(profile);
            const entries = body.repos.map(repo => cdnEntry(repo, known, verdicts));
            const withDelta = computeTodayStars(profile, entries);
            return normalizeCategories({
                updated: body.generated_at ?? new Date().toISOString(),
                count: withDelta.length,
                source: 'cdn',
                categories: CATEGORIES,
                plugins: withDelta,
            });
        }
        catch (err) {
            lastError = err instanceof Error ? err.message : String(err);
        }
    }
    throw new Error('CDN index unavailable: ' + lastError);
}
export const CATEGORIES = {
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
};
const TTL_MS = 30 * 60 * 1000;
let cache = null;
function dataPath(name) {
    return fileURLToPath(new URL('../data/' + name, import.meta.url));
}
/** Bundled curated catalog: owner/repo -> category/npm/localized text. */
let knownCache = null;
export function loadKnown() {
    if (knownCache !== null)
        return knownCache;
    try {
        knownCache = JSON.parse(readFileSync(dataPath('awesome-known.json'), 'utf8'));
    }
    catch {
        knownCache = {};
    }
    return knownCache;
}
/** Keep only categories that actually have entries; 'other' always stays. */
function normalizeCategories(registry) {
    const counts = new Map();
    for (const p of registry.plugins)
        counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    const categories = {};
    for (const id of Object.keys(CATEGORIES)) {
        if ((counts.get(id) ?? 0) > 0 || id === 'other')
            categories[id] = CATEGORIES[id];
    }
    registry.categories = categories;
    return registry;
}
function snapshot() {
    try {
        const parsed = JSON.parse(readFileSync(dataPath('registry-snapshot.json'), 'utf8'));
        parsed.source = 'snapshot';
        return normalizeCategories(parsed);
    }
    catch {
        return { updated: new Date().toISOString(), count: 0, source: 'snapshot', categories: CATEGORIES, plugins: [] };
    }
}
/** 快照通道同样套用「今日新增」基线（与 live/CDN 通道同一份基线）。 */
function snapshotWithDeltas(profile) {
    const snap = snapshot();
    snap.plugins = computeTodayStars(profile, snap.plugins);
    return snap;
}
// ---------------------------------------------------------------- state I/O
export function stateFile(profile) {
    const home = process.env.DSH_HOME ?? join(process.env.HOME ?? '', '.dsh');
    return join(home, 'profiles', profile, 'dsh-store', 'state.json');
}
export function readState(profile) {
    try {
        return JSON.parse(readFileSync(stateFile(profile), 'utf8'));
    }
    catch {
        return { verdicts: {} };
    }
}
export function writeState(profile, state) {
    try {
        const file = stateFile(profile);
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, JSON.stringify(state, null, 2));
    }
    catch { /* state writes must never break browsing */ }
}
export function verdictsOf(profile) {
    return readState(profile).verdicts ?? {};
}
export function readFavorites(profile) {
    return readState(profile).favorites ?? [];
}
export function readSkipUpdates(profile) {
    return new Set((readState(profile).skipUpdates ?? []).map(n => n.toLowerCase()));
}
export function setSkipUpdate(profile, name, skip) {
    const state = readState(profile);
    const list = (state.skipUpdates ?? []).filter(n => n !== name);
    if (skip)
        list.push(name);
    state.skipUpdates = list;
    writeState(profile, state);
    return list;
}
export function toggleFavorite(profile, key) {
    const state = readState(profile);
    const list = state.favorites ?? [];
    const hit = list.findIndex((k) => k === key);
    if (hit >= 0)
        list.splice(hit, 1);
    else
        list.push(key);
    state.favorites = list;
    writeState(profile, state);
    return list;
}
export function applyVerdicts(profile, updates) {
    const state = readState(profile);
    state.verdicts = { ...(state.verdicts ?? {}), ...updates };
    writeState(profile, state);
}
// ------------------------------------------------- localized descriptions
// 卡片多语言简介的按需富化通道：切换语言时，client 把当前页缺少
// description_<lang> 的仓库发给 host，host 并发抓 README.<lang>.md 首段
// （raw 直连、不占 API 额度），结果缓存到进程内。
const descCache = new Map();
/** README 首段提取：剥 HTML/图片/链接/徽章噪声。
 *  CJK 语言（zh/ja/ko）优先定位到第一个含 CJK 字符的句子开始收集，
 *  跳过开头常见的 HTML 对齐段与语言切换链接行。 */
function firstParagraph(md, lang) {
    const cjk = /[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/;
    const needCjk = lang === 'zh' || lang === 'ja' || lang === 'ko';
    const text = [];
    let started = !needCjk;
    for (const raw of md.split(/\r?\n/)) {
        const line = raw
            .replace(/<[^>]+>/g, '')
            .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
            .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
            .replace(/[#>|_~]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        if (line === '')
            continue;
        if (needCjk && !started) {
            if (!cjk.test(line))
                continue;
            started = true;
        }
        if (line.length < 4)
            continue;
        text.push(line);
        if (text.join(' ').length > 180)
            break;
    }
    const joined = text.join(' ').trim();
    return joined.length > 220 ? joined.slice(0, 220) + '…' : joined;
}
/** 某语言 README 的候选文件名（按常见约定排序：zh 优先 zh-CN 变体；
 *  常见子目录约定 docs/ 一并探测）。 */
function readmeCandidates(lang) {
    const base = [];
    if (lang === 'en')
        base.push('README.md');
    else if (lang === 'zh')
        base.push('README.zh-CN.md', 'README.zh.md', 'README.zh_CN.md', 'README.cn.md');
    else
        base.push('README.' + lang + '.md');
    const out = [];
    for (const f of base) {
        out.push(f);
        out.push('docs/' + f);
    }
    return out;
}
export async function fetchLocalizedDescriptions(lang, repos) {
    const out = {};
    const todo = [];
    for (const repo of repos) {
        const key = lang + ':' + repo;
        const hit = descCache.get(key);
        if (hit !== undefined) {
            if (hit !== '')
                out[repo] = hit;
            continue;
        }
        todo.push(repo);
    }
    let cursor = 0;
    const worker = async () => {
        while (cursor < todo.length) {
            const repo = todo[cursor++];
            const key = lang + ':' + repo;
            const owner = repo.split('/')[0] ?? '';
            const name = repo.split('/')[1] ?? '';
            let text = '';
            for (const file of readmeCandidates(lang)) {
                const url = 'https://raw.githubusercontent.com/' + owner + '/' + name + '/HEAD/' + file;
                try {
                    const res = await fetch(url, { headers: { 'user-agent': 'dsh-store' }, signal: AbortSignal.timeout(10_000) });
                    if (res.ok) {
                        const raw = await res.text();
                        const first = firstParagraph(raw.slice(0, 6_000), lang);
                        if (first !== '')
                            text = first;
                    }
                }
                catch { /* 网络失败：尝试下一个候选 */ }
                if (text !== '')
                    break;
            }
            descCache.set(key, text);
            if (text !== '')
                out[repo] = text;
        }
    };
    await Promise.all(Array.from({ length: 6 }, () => worker()));
    return out;
}
const VERSION_RE = /v?(\d+)\.(\d+)\.(\d+)(?:[-+][0-9A-Za-z.-]+)?/;
/** 从依赖 spec（^1.2.3 / 1.2.3 / npm:x@1.2.3 / github:...#semver:1.2.3）提取 x.y.z。 */
export function extractVersion(spec) {
    const m = VERSION_RE.exec(String(spec));
    return m === null ? null : m[1] + '.' + m[2] + '.' + m[3];
}
/** 语义化三段版本比较：a<b → 负数；相等 → 0；a>b → 正数。 */
export function compareVersions(a, b) {
    const pa = a.split('.').map(Number);
    const pb = b.split('.').map(Number);
    for (let i = 0; i < 3; i++) {
        const d = (pa[i] ?? 0) - (pb[i] ?? 0);
        if (d !== 0)
            return d;
    }
    return 0;
}
/** 已装依赖 × 目录索引：npm 最新版 > 已装版 → 可更新。link/file 安装跳过；
 *  无版本 spec 跳过；「不参与一键更新」名单与商店自身（dsh-store）排除。 */
export function computeUpdates(registry, deps, skip) {
    const out = [];
    const seen = new Set();
    for (const [name, spec] of Object.entries(deps)) {
        const s = String(spec).trim();
        if (s.startsWith('link:') || s.startsWith('file:'))
            continue;
        const lower = name.toLowerCase();
        if (lower === 'dsh-store')
            continue; // 商店自身走独立的「更新 DSH 商店」按钮
        if (skip?.has(lower) === true)
            continue;
        const from = extractVersion(s);
        if (from === null)
            continue;
        let hit = null;
        for (const p of registry.plugins) {
            if (p.npm !== null && p.npm.toLowerCase() === lower) {
                hit = p;
                break;
            }
            if (p.name.toLowerCase() === lower) {
                hit = p;
                break;
            }
        }
        if (hit === null || hit.npmVersion === null)
            continue;
        if (compareVersions(hit.npmVersion, from) <= 0)
            continue;
        if (seen.has(lower))
            continue;
        seen.add(lower);
        out.push({ name, from, to: hit.npmVersion, repo: hit.owner + '/' + hit.name, npm: hit.npm ?? name });
    }
    out.sort((a, b) => a.name.localeCompare(b.name));
    return out;
}
// ------------------------------------------------------------- classification
const CATEGORY_RULES = [
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
];
function ruleCategory(name, description, topics) {
    const hay = (name + ' ' + description + ' ' + topics.join(' ')).toLowerCase();
    for (const rule of CATEGORY_RULES)
        if (rule.re.test(hay))
            return rule.category;
    return 'other';
}
const PLUGIN_NAME_RE = /(^dsh[-_]|[-_]dsh[-_]|dsh[-_]plugin|dshplugin)/i;
const DSH_HINT_RE = /(dsh|deepseek[ -]?harness|cordis)/i;
export function heuristicIsPlugin(repo) {
    const hay = (repo.name + ' ' + (repo.description ?? '') + ' ' + repo.topics.join(' ')).toLowerCase();
    if (!DSH_HINT_RE.test(hay))
        return false;
    if (PLUGIN_NAME_RE.test(hay))
        return true;
    if (/(plugin|插件)\b/i.test(hay))
        return true;
    return null;
}
function buildEntry(fullName, known, verdicts, search, html) {
    const key = fullName.toLowerCase();
    const knownEntry = known[key];
    const verdict = verdicts[key];
    const name = search?.name ?? fullName.split('/')[1] ?? fullName;
    const owner = search?.owner.login ?? fullName.split('/')[0] ?? '';
    const description = knownEntry?.description?.en
        ?? knownEntry?.description?.zh
        ?? search?.description
        ?? '';
    const topics = search?.topics ?? [];
    const heuristic = heuristicIsPlugin({ name, description: search?.description ?? null, topics });
    const isPlugin = verdict !== undefined ? verdict : heuristic;
    return {
        name,
        owner,
        url: search?.html_url ?? 'https://github.com/' + fullName,
        category: knownEntry?.category ?? ruleCategory(name, description, topics),
        description: description.length > 200 ? description.slice(0, 200) + '…' : description,
        descriptions: search !== undefined ? collectDescriptions(search) : null,
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
    };
}
function todayKey() { return new Date().toISOString().slice(0, 10); }
export function computeTodayStars(profile, entries) {
    const state = readState(profile);
    const snap = state.starsSnapshot;
    const current = {};
    for (const entry of entries) {
        if (entry.stars === null)
            continue;
        current[(entry.owner + '/' + entry.name).toLowerCase()] = entry.stars;
    }
    if (Object.keys(current).length === 0) {
        // 本次抓取没有任何 star 数据（HTML 兜底通道全 null）：不落基线，
        // 否则会用空表覆盖当天已记录的真实基线，导致「今日新增」全为「—」。
        return entries;
    }
    if (snap === undefined || snap.date !== todayKey()) {
        // First successful fetch of the day: record the baseline, deltas unknown.
        writeState(profile, { ...state, starsSnapshot: { date: todayKey(), stars: current } });
        return entries;
    }
    const baseline = snap.stars;
    if (Object.keys(baseline).length === 0) {
        // 当天基线曾被无 star 通道污染（stars: {}）：用当前数据重录基线。
        // 今日增量从下一次刷新开始显示，而不是永远「—」。
        writeState(profile, { ...state, starsSnapshot: { date: todayKey(), stars: current } });
        return entries;
    }
    for (const entry of entries) {
        if (entry.stars === null) {
            entry.todayStars = null;
            continue;
        }
        const prev = baseline[(entry.owner + '/' + entry.name).toLowerCase()];
        entry.todayStars = prev === undefined ? null : entry.stars - prev;
    }
    return entries;
}
export const progress = { running: false, shard: 0, shards: 0, repos: 0, lastError: null };
let lastSearchFailAt = 0;
let htmlCache = null;
function makeRegistry(profile, htmlByKey, searchByKey) {
    const known = loadKnown();
    const verdicts = verdictsOf(profile);
    const entries = [];
    const keys = new Set([...htmlByKey.keys(), ...searchByKey.keys()]);
    for (const key of keys) {
        entries.push(buildEntry(key, known, verdicts, searchByKey.get(key), htmlByKey.get(key)));
    }
    const withDelta = computeTodayStars(profile, entries);
    return normalizeCategories({
        updated: new Date().toISOString(),
        count: withDelta.length,
        source: 'live',
        categories: CATEGORIES,
        plugins: withDelta,
    });
}
async function fetchLive(profile, token, registryUrl) {
    // Pass 0: the community CDN index — complete catalog, no API quota.
    try {
        return await fetchCdnRegistry(profile, registryUrl);
    }
    catch (err) {
        progress.lastError = 'CDN channel failed (' + (err instanceof Error ? err.message : String(err)) + '); falling back to direct crawl';
    }
    // Pass 1: HTML topic pages — the complete repo list this network allows
    // (4 sort views × 50 pages, no API quota). Reused for 30 minutes so a
    // search-phase failure does not force a full re-crawl on the next refresh.
    let htmlByKey;
    if (htmlCache !== null && Date.now() - htmlCache.at < 30 * 60 * 1000) {
        htmlByKey = htmlCache.byKey;
    }
    else {
        const htmlRepos = await fetchTopicPages({
            onShard: (index, total, repos) => {
                progress.shard = index;
                progress.shards = total;
                progress.repos = repos;
            },
            onError: (message) => { progress.lastError = message; },
        });
        htmlByKey = new Map();
        for (const repo of htmlRepos)
            htmlByKey.set(repo.full_name.toLowerCase(), { pushed_at: repo.pushed_at, language: repo.language });
        htmlCache = { at: Date.now(), byKey: htmlByKey };
        cache = { at: Date.now(), data: makeRegistry(profile, htmlByKey, new Map()) };
    }
    // Pass 2: search API union (full fields). Qualifiers are broken on this
    // network, so six ordered views of the bare topic query are unioned.
    // Failures keep the HTML-only cache; retries back off for 10 minutes.
    if (cache === null)
        cache = { at: Date.now(), data: makeRegistry(profile, htmlByKey, new Map()) };
    if (Date.now() - lastSearchFailAt < 10 * 60 * 1000)
        return cache.data;
    const searchByKey = new Map();
    try {
        const raw = await searchDshTopicRepos(token, {
            onShard: (index, total, repos) => {
                progress.shard = index;
                progress.shards = total;
                progress.repos = repos;
            },
            onError: (message) => { progress.lastError = message; },
        });
        for (const item of raw) {
            const repo = item;
            if (repo.fork || repo.archived)
                continue;
            searchByKey.set(repo.full_name.toLowerCase(), repo);
        }
        cache = { at: Date.now(), data: makeRegistry(profile, htmlByKey, searchByKey) };
    }
    catch (err) {
        lastSearchFailAt = Date.now();
        progress.lastError = 'search pass failed (' + (err instanceof Error ? err.message : String(err)) + '); HTML-only catalog kept';
    }
    if (cache === null)
        cache = { at: Date.now(), data: makeRegistry(profile, htmlByKey, new Map()) };
    return cache.data;
}
export async function loadRegistry(profile, token, opts = {}) {
    if (cache !== null && Date.now() - cache.at < TTL_MS && opts.force !== true) {
        return { registry: cache.data, refreshing: progress.running };
    }
    if (progress.running) {
        // A refresh is already in flight: serve what we have while it finishes.
        return { registry: cache?.data ?? snapshotWithDeltas(profile), refreshing: true };
    }
    progress.running = true;
    progress.lastError = null;
    progress.shard = 0;
    progress.shards = 0;
    progress.repos = 0;
    const immediate = cache?.data ?? snapshotWithDeltas(profile);
    void (async () => {
        try {
            const live = await fetchLive(profile, token, opts.registryUrl ?? '');
            cache = { at: Date.now(), data: live };
        }
        catch (err) {
            // Keep the previous cache (or fall back to the bundled snapshot).
            progress.lastError = err instanceof Error ? err.message : String(err);
        }
        finally {
            progress.running = false;
        }
    })();
    return { registry: immediate, refreshing: true };
}
/** Deep verdict batch: returns verdicts for the given repos (only true/false). */
export async function verifyRepos(profile, token, repos) {
    const updates = {};
    const known = verdictsOf(profile);
    for (const repo of repos) {
        if (known[repo.toLowerCase()] !== undefined)
            continue;
        const verdict = await packageJsonVerdict(token, repo);
        if (verdict !== null)
            updates[repo.toLowerCase()] = verdict;
    }
    if (Object.keys(updates).length > 0)
        applyVerdicts(profile, updates);
    return updates;
}
