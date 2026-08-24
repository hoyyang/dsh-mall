/**
 * HTTP routes bridging the browser market UI to the host: registry data,
 * refresh status, install/uninstall, verify (isPlugin deep check) and
 * publish (add the dsh-plugin topic to the user's own repo).
 *
 * Security: install/uninstall/publish accept only same-origin POSTs. The
 * GitHub token never leaves the process and never appears in responses.
 */
import { readFileSync } from 'node:fs';
import { computeUpdates, compareVersions, fetchLocalizedDescriptions, loadRegistry, progress, readFavorites, readSkipUpdates, readState, setSkipUpdate, toggleFavorite, verifyRepos, writeState } from "./catalog.js";
import { smartSearch, takeResults } from "./find.js";
import { getRepoTopics, lastRateInfo, listMyRepos, putRepoTopics } from "./github.js";
import { installState, loaderIdOf, patchDisables, pluginStatesOf, readManifest as readProfileManifest, removeLegacyPatchEntry, rollbackDep, runDsh, runSelfUpdate } from "./install.js";
import { runInstall, runUninstall, runUpdate, setPluginEnabled, snapshotDep, withMutationLock } from "./install.js";
import { autoUpdateStateOf, setAutoUpdateEnabled, startAutoUpdate, stopAutoUpdate } from "./auto-update.js";
import { ensureDownloads, ensureTotals } from "./downloads.js";
import { ensureRepoVersions } from "./versions.js";
import { ensureBundleScans, ensureSkillScans } from "./scan.js";
import { fetchRawReadme, fetchSanitizedReadme } from "./readme.js";
import { parseInstallCommands, detectNeedsConfig } from "./install-parse.js";
import { enrichScore } from "./score.js";
import { runSmartInstall, runSmartUninstall, runSmartUpdate } from "./smart.js";
import { recommendFor } from "./recommend.js";
let cachedVersion = null;
/** The market's own version from its package.json (read once per process). */
export function marketVersion() {
    if (cachedVersion !== null)
        return cachedVersion;
    try {
        const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
        cachedVersion = manifest.version ?? 'unknown';
    }
    catch {
        cachedVersion = 'unknown';
    }
    return cachedVersion;
}
/** npm registry 上 dsh-store 的 latest 版本（缓存 10 分钟；查不到 = 尚未发布）。 */
let selfUpdateCache = null;
async function selfUpdateInfo() {
    const from = marketVersion();
    if (selfUpdateCache !== null && Date.now() - selfUpdateCache.at < 10 * 60_000)
        return selfUpdateCache;
    let to = null;
    try {
        const res = await fetch('https://registry.npmjs.org/dsh-store/latest', {
            headers: { 'user-agent': 'dsh-store' },
            signal: AbortSignal.timeout(15_000),
        });
        if (res.ok) {
            const body = (await res.json());
            if (typeof body.version === 'string' && body.version !== '')
                to = body.version;
        }
    }
    catch { /* 网络失败：无更新信息 */ }
    if (to !== null && compareVersions(to, from) <= 0)
        to = null;
    selfUpdateCache = { at: Date.now(), from, to };
    return { from, to };
}
function sendJson(response, status, body) {
    response.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
    response.end(JSON.stringify(body));
}
function readJsonBody(request) {
    return new Promise((resolve, reject) => {
        let raw = '';
        request.on('data', (chunk) => {
            raw += chunk.toString();
            if (raw.length > 64 * 1024) {
                reject(new Error('body too large'));
                request.destroy();
            }
        });
        request.on('end', () => {
            try {
                resolve(JSON.parse(raw));
            }
            catch {
                reject(new Error('invalid JSON body'));
            }
        });
        request.on('error', reject);
    });
}
/** Only same-origin browsers may drive mutations (ported from dsh-market). */
function sameOrigin(request) {
    const origin = request.headers.origin;
    if (origin === undefined)
        return true;
    const host = request.headers.host;
    if (host === undefined)
        return false;
    try {
        return new URL(origin).host === host;
    }
    catch {
        return false;
    }
}
function notGet(request) { return request.method !== 'GET' && request.method !== 'HEAD'; }
const REPO_RE = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
function parseRepo(value) {
    if (typeof value !== 'string' || !REPO_RE.test(value))
        return null;
    return value;
}
// ---- 任务取消（v1.7.18）：客户端把 taskId 带进 POST body，宿主按 id 注册
// AbortController；「查看进行中的任务」面板的取消按钮 → /dsh-store/cancel → abort。
// runDsh / headless 子进程监听 signal 后 SIGKILL，操作返回 cancelled 结果。 ----
const activeOps = new Map();
function beginTask(id) {
    if (typeof id !== 'string' || id === '' || id.length > 64)
        return undefined;
    const ctrl = new AbortController();
    activeOps.set(id, ctrl);
    return ctrl.signal;
}
function endTask(id) {
    if (typeof id === 'string')
        activeOps.delete(id);
}
function isCancelled(id) {
    if (typeof id !== 'string')
        return false;
    const ctrl = activeOps.get(id);
    return ctrl !== undefined && ctrl.signal.aborted;
}
/** 文档阅读按钮（v1.7.21）：把仓库 docs/*.md 以可点击 HTML 页暴露给浏览器。 */
const DOC_FILES = {
    plan: '../docs/plans/2026-08-22-data-governance-plan.md',
    report: '../docs/awesome-dsh-plugin-gap-analysis.md',
};
function escapeHtml(value) {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
export function mountMarketRoutes(host, config, loaderIds) {
    const disposers = [];
    disposers.push(host.webServer.register({
        kind: 'exact',
        path: '/dsh-store/doc',
        handler: async (request, response) => {
            if (request.method !== 'GET') {
                response.writeHead(405, { allow: 'GET' });
                response.end();
                return;
            }
            const url = new URL(request.url ?? '/', 'http://localhost');
            const key = url.searchParams.get('f') ?? '';
            const rel = DOC_FILES[key];
            if (rel === undefined) {
                response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
                response.end('doc not found');
                return;
            }
            const text = readFileSync(new URL(rel, import.meta.url), 'utf8');
            const html = '<!doctype html><html lang="zh"><head><meta charset="utf-8"><title>' + escapeHtml(key) + '</title>' +
                '<style>body{margin:0;background:#0d1117;color:#e6edf3;font:14px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace;padding:24px 28px}pre{white-space:pre-wrap;word-break:break-word}</style></head>' +
                '<body><pre>' + escapeHtml(text) + '</pre></body></html>';
            response.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
            response.end(html);
        },
    }));
    disposers.push(host.webServer.register({
        kind: 'exact',
        path: '/dsh-store/registry',
        handler: async (request, response) => {
            if (request.method !== 'GET') {
                response.writeHead(405, { allow: 'GET' });
                response.end();
                return;
            }
            const url = new URL(request.url ?? '/', 'http://localhost');
            const force = url.searchParams.get('force') === '1';
            const { registry, refreshing } = await loadRegistry(config.profile, config.githubToken, { force, registryUrl: config.registryUrl });
            sendJson(response, 200, { registry, refreshing, fetchAt: new Date().toISOString(), progress: { ...progress } });
        },
    }));
    disposers.push(host.webServer.register({
        kind: 'exact',
        path: '/dsh-store/status',
        handler: async (request, response) => {
            if (request.method !== 'GET') {
                response.writeHead(405, { allow: 'GET' });
                response.end();
                return;
            }
            const manifest = readProfileManifest(config.profile);
            // 可更新检测随 status 一起下发——与商店所有刷新时机天然对齐。
            let updates = [];
            // v1.7.3：updatesAll=不排 skip 的全量可更新列表（卡片「更新」按钮数据源——
            // 「不参与一键更新」只影响一键更新/自动更新，不影响单插件手动更新）。
            let updatesAll = [];
            try {
                const { registry } = await loadRegistry(config.profile, config.githubToken, {});
                const skip = readSkipUpdates(config.profile);
                updates = computeUpdates(registry, manifest.dependencies, skip);
                updatesAll = computeUpdates(registry, manifest.dependencies, undefined);
            }
            catch { /* registry 不可用时 updates 留空，不阻塞状态 */ }
            // 激活状态（live/disabled/restart）：bundle 装配 + patch 停用判定。 */
            const states = pluginStatesOf(config.profile, manifest);
            const state = readState(config.profile);
            sendJson(response, 200, {
                version: marketVersion(),
                refreshing: progress.running,
                progress: { ...progress },
                install: { ...installState },
                installed: manifest.dependencies,
                bundles: manifest.bundles,
                tokenConfigured: config.githubToken !== '',
                registryUrl: config.registryUrl,
                rateLimit: lastRateInfo(),
                updates,
                updatesAll,
                pluginStates: states,
                rollbacks: state.rollbacks ?? {},
                skipUpdates: state.skipUpdates ?? [],
                patchDisables: patchDisables(config.profile),
                selfUpdate: await selfUpdateInfo(),
                autoUpdate: autoUpdateStateOf(config.profile),
            });
        },
    }));
    disposers.push(host.webServer.register({
        kind: 'exact',
        path: '/dsh-store/cancel',
        handler: async (request, response) => {
            if (request.method !== 'POST' || !sameOrigin(request)) {
                response.writeHead(405, { allow: 'POST' });
                response.end();
                return;
            }
            let body;
            try {
                body = await readJsonBody(request);
            }
            catch {
                sendJson(response, 400, { ok: false, error: 'invalid body' });
                return;
            }
            const id = typeof body.id === 'string' ? body.id : '';
            const ctrl = activeOps.get(id);
            if (ctrl === undefined) {
                sendJson(response, 404, { ok: false, error: 'task not running' });
                return;
            }
            ctrl.abort();
            sendJson(response, 200, { ok: true, cancelled: true });
        },
    }));
    disposers.push(host.webServer.register({
        kind: 'exact',
        path: '/dsh-store/install',
        handler: async (request, response) => {
            if (request.method !== 'POST' || !sameOrigin(request)) {
                response.writeHead(405, { allow: 'POST' });
                response.end();
                return;
            }
            let body;
            try {
                body = await readJsonBody(request);
            }
            catch {
                sendJson(response, 400, { ok: false, error: 'invalid body' });
                return;
            }
            const repo = parseRepo(body.repo);
            if (repo === null) {
                sendJson(response, 400, { ok: false, error: 'invalid repo' });
                return;
            }
            const npm = typeof body.npm === 'string' && body.npm !== '' ? body.npm : null;
            // v1.7.25：npm 未回指本仓库（防抢注）→ 降级 github: 源码安装。
            let effectiveNpm = npm;
            if (npm !== null) {
                const { registry } = await loadRegistry(config.profile, config.githubToken, {});
                const entry = registry.plugins.find(p => (p.npm !== null && p.npm.toLowerCase() === npm.toLowerCase()) || (p.owner + '/' + p.name).toLowerCase() === repo.toLowerCase());
                if (entry?.npmLinked === false)
                    effectiveNpm = null;
            }
            const taskId = body.id;
            const signal = beginTask(taskId);
            try {
                const locked = await withMutationLock(async () => runInstall(config, repo, effectiveNpm, signal));
                if (locked.busy) {
                    sendJson(response, 409, { ok: false, error: 'another plugin operation is running' });
                    return;
                }
                sendJson(response, 200, { ...locked.value, cancelled: isCancelled(taskId) });
            }
            finally {
                endTask(taskId);
            }
        },
    }));
    disposers.push(host.webServer.register({
        kind: 'exact',
        path: '/dsh-store/uninstall',
        handler: async (request, response) => {
            if (request.method !== 'POST' || !sameOrigin(request)) {
                response.writeHead(405, { allow: 'POST' });
                response.end();
                return;
            }
            let body;
            try {
                body = await readJsonBody(request);
            }
            catch {
                sendJson(response, 400, { ok: false, error: 'invalid body' });
                return;
            }
            const repo = parseRepo(body.repo);
            const pkgName = typeof body.name === 'string' && /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/i.test(body.name) && body.name.length < 214
                ? body.name
                : null;
            if (repo === null && pkgName === null) {
                sendJson(response, 400, { ok: false, error: 'invalid repo or name' });
                return;
            }
            const taskId = body.id;
            const signal = beginTask(taskId);
            try {
                const locked = await withMutationLock(async () => runUninstall(config, repo ?? pkgName ?? '', pkgName ?? undefined, signal));
                if (locked.busy) {
                    sendJson(response, 409, { ok: false, error: 'another plugin operation is running' });
                    return;
                }
                sendJson(response, 200, { ...locked.value, cancelled: isCancelled(taskId) });
            }
            finally {
                endTask(taskId);
            }
        },
    }));
    // find 工具结果暂存读取：GET ?id=<token> — 结果浮窗数据源（跟随 session
    // 生命周期，持久化 state.json；v1.7.15 起不再 30 分钟过期）。
    disposers.push(host.webServer.register({
        kind: 'exact',
        path: '/dsh-store/query-result',
        handler: (request, response) => {
            if (request.method !== 'GET') {
                response.writeHead(405, { allow: 'GET' });
                response.end();
                return;
            }
            const url = new URL(request.url ?? '/', 'http://localhost');
            const id = url.searchParams.get('id') ?? '';
            if (!/^[a-z0-9]{10,24}$/i.test(id)) {
                sendJson(response, 400, { ok: false, error: 'invalid id' });
                return;
            }
            const payload = takeResults(config.profile, id);
            if (payload === null) {
                sendJson(response, 404, { ok: false, error: 'results expired — re-run /dsh-store' });
                return;
            }
            sendJson(response, 200, { ok: true, payload });
        },
    }));
    // 智能搜索：用户主模型（dsh --profile headless）改写需求 → 目录评分推荐。
    // 返回 payload 与 /query-result 同构（含 categories），客户端直接弹结果浮窗。
    disposers.push(host.webServer.register({
        kind: 'exact',
        path: '/dsh-store/smart-search',
        handler: async (request, response) => {
            if (request.method !== 'POST' || !sameOrigin(request)) {
                response.writeHead(405, { allow: 'POST' });
                response.end();
                return;
            }
            let body;
            try {
                body = await readJsonBody(request);
            }
            catch {
                sendJson(response, 400, { ok: false, error: 'invalid body' });
                return;
            }
            const query = typeof body.query === 'string' ? body.query.trim().slice(0, 300) : '';
            if (query === '') {
                sendJson(response, 400, { ok: false, error: 'empty query' });
                return;
            }
            const payload = await smartSearch(config.profile, config.githubToken, query, 5);
            sendJson(response, 200, { ok: true, payload });
        },
    }));
    // 多语言简介按需富化：POST {lang, repos[]} — 抓 README.<lang>.md 首段。
    disposers.push(host.webServer.register({
        kind: 'exact',
        path: '/dsh-store/descriptions',
        handler: async (request, response) => {
            if (request.method !== 'POST' || !sameOrigin(request)) {
                response.writeHead(405, { allow: 'POST' });
                response.end();
                return;
            }
            let body;
            try {
                body = await readJsonBody(request);
            }
            catch {
                sendJson(response, 400, { ok: false, error: 'invalid body' });
                return;
            }
            const lang = typeof body.lang === 'string' && /^[a-z]{2}$/i.test(body.lang) ? body.lang.toLowerCase() : null;
            const repos = Array.isArray(body.repos) ? body.repos.filter(parseRepo).slice(0, 48) : [];
            if (lang === null || repos.length === 0) {
                sendJson(response, 200, { ok: true, descriptions: {} });
                return;
            }
            const descriptions = await fetchLocalizedDescriptions(lang, repos);
            sendJson(response, 200, { ok: true, descriptions });
        },
    }));
    // 启用/停用：cordis.patch.yml 顶层 "- id: X" + disabled 行（官方机制，HMR 生效）。
    disposers.push(host.webServer.register({
        kind: 'exact',
        path: '/dsh-store/toggle',
        handler: async (request, response) => {
            if (request.method !== 'POST' || !sameOrigin(request)) {
                response.writeHead(405, { allow: 'POST' });
                response.end();
                return;
            }
            let body;
            try {
                body = await readJsonBody(request);
            }
            catch {
                sendJson(response, 400, { ok: false, error: 'invalid body' });
                return;
            }
            const name = typeof body.name === 'string' && /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/i.test(body.name) ? body.name : null;
            if (name === null || typeof body.enabled !== 'boolean') {
                sendJson(response, 400, { ok: false, error: 'invalid name or enabled' });
                return;
            }
            // v1.7.10：开关按真实 loader id 写 patch（dshmarket→dsh-market）；
            // 顺带清理旧版误写的同名条目（无效 id，留着会误导状态）。
            const loaderId = loaderIdOf(config.profile, name);
            if (loaderId !== name)
                removeLegacyPatchEntry(config.profile, name);
            const result = setPluginEnabled(config.profile, loaderId, body.enabled);
            sendJson(response, result.ok ? 200 : 400, result);
        },
    }));
    // 回退到上个版本：恢复更新前快照的 spec → pnpm install。
    disposers.push(host.webServer.register({
        kind: 'exact',
        path: '/dsh-store/rollback',
        handler: async (request, response) => {
            if (request.method !== 'POST' || !sameOrigin(request)) {
                response.writeHead(405, { allow: 'POST' });
                response.end();
                return;
            }
            let body;
            try {
                body = await readJsonBody(request);
            }
            catch {
                sendJson(response, 400, { ok: false, error: 'invalid body' });
                return;
            }
            const name = typeof body.name === 'string' && body.name.length > 0 && body.name.length < 214 ? body.name : null;
            if (name === null) {
                sendJson(response, 400, { ok: false, error: 'invalid name' });
                return;
            }
            const taskId = body.id;
            const signal = beginTask(taskId);
            try {
                const locked = await withMutationLock(async () => {
                    const state = readState(config.profile);
                    const restored = rollbackDep(config.profile, name, state);
                    writeState(config.profile, state);
                    if (restored === null)
                        return { ok: false, message: 'no rollback snapshot for ' + name };
                    if (!restored.ok)
                        return restored;
                    // pnpm install 按恢复后的 spec 装回旧版
                    const install = await runDsh(config.profile, ['install'], signal);
                    if (signal?.aborted === true)
                        return { ok: false, message: 'Cancelled by user' };
                    const ok = install.exitCode === 0 && !install.timedOut;
                    return { ok, message: ok ? restored.message + '. Refresh to activate.' : restored.message + ' — pnpm install failed' };
                });
                if (locked.busy) {
                    sendJson(response, 409, { ok: false, error: 'another plugin operation is running' });
                    return;
                }
                sendJson(response, locked.value.ok ? 200 : 400, { ...locked.value, cancelled: isCancelled(taskId) });
            }
            finally {
                endTask(taskId);
            }
        },
    }));
    // 「不参与一键更新」开关：持久化在 state.json。
    disposers.push(host.webServer.register({
        kind: 'exact',
        path: '/dsh-store/skip',
        handler: async (request, response) => {
            if (request.method !== 'POST' || !sameOrigin(request)) {
                response.writeHead(405, { allow: 'POST' });
                response.end();
                return;
            }
            let body;
            try {
                body = await readJsonBody(request);
            }
            catch {
                sendJson(response, 400, { ok: false, error: 'invalid body' });
                return;
            }
            const name = typeof body.name === 'string' && body.name.length > 0 && body.name.length < 214 ? body.name : null;
            if (name === null || typeof body.skip !== 'boolean') {
                sendJson(response, 400, { ok: false, error: 'invalid name or skip' });
                return;
            }
            const list = setSkipUpdate(config.profile, name, body.skip);
            sendJson(response, 200, { ok: true, skipUpdates: list });
        },
    }));
    // npm 下载量（近 30 天）按需富化：POST {names[]} —— 批量查 npm API，
    // 24h 缓存（未发布 6h），单次最多 2000 个包名。
    disposers.push(host.webServer.register({
        kind: 'exact',
        path: '/dsh-store/downloads',
        handler: async (request, response) => {
            if (request.method !== 'POST' || !sameOrigin(request)) {
                response.writeHead(405, { allow: 'POST' });
                response.end();
                return;
            }
            let body;
            try {
                body = await readJsonBody(request);
            }
            catch {
                sendJson(response, 400, { ok: false, error: 'invalid body' });
                return;
            }
            const names = Array.isArray(body.names) ? body.names.filter((n) => typeof n === 'string' && n !== '') : [];
            if (names.length === 0) {
                sendJson(response, 200, { ok: true, downloads: {} });
                return;
            }
            const downloads = await ensureDownloads(config.profile, names);
            const totals = await ensureTotals(config.profile, names);
            sendJson(response, 200, { ok: true, downloads, totals });
        },
    }));
    // 智能卸载：AI 审查（有风险先 review 报告、确认后才执行）+ dsh plugin remove + 残留检查。
    disposers.push(host.webServer.register({
        kind: 'exact',
        path: '/dsh-store/smart-uninstall',
        handler: async (request, response) => {
            if (request.method !== 'POST' || !sameOrigin(request)) {
                response.writeHead(405, { allow: 'POST' });
                response.end();
                return;
            }
            let body;
            try {
                body = await readJsonBody(request);
            }
            catch {
                sendJson(response, 400, { ok: false, error: 'invalid body' });
                return;
            }
            const name = typeof body.name === 'string' && /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/i.test(body.name) && body.name.length < 214
                ? body.name
                : null;
            if (name === null) {
                sendJson(response, 400, { ok: false, error: 'invalid name' });
                return;
            }
            const taskId = body.id;
            const signal = beginTask(taskId);
            try {
                const locked = await withMutationLock(async () => runSmartUninstall(config, name, body.confirm === true, signal));
                if (locked.busy) {
                    sendJson(response, 409, { ok: false, error: 'another plugin operation is running' });
                    return;
                }
                sendJson(response, 200, { ...locked.value, cancelled: isCancelled(taskId) });
            }
            finally {
                endTask(taskId);
            }
        },
    }));
    // 智能安装：AI 装前审查（refuse 终止）+ dsh plugin add + 装后 AI 诊断。
    disposers.push(host.webServer.register({
        kind: 'exact',
        path: '/dsh-store/smart-install',
        handler: async (request, response) => {
            if (request.method !== 'POST' || !sameOrigin(request)) {
                response.writeHead(405, { allow: 'POST' });
                response.end();
                return;
            }
            let body;
            try {
                body = await readJsonBody(request);
            }
            catch {
                sendJson(response, 400, { ok: false, error: 'invalid body' });
                return;
            }
            const repo = parseRepo(body.repo);
            if (repo === null) {
                sendJson(response, 400, { ok: false, error: 'invalid repo' });
                return;
            }
            const npm = typeof body.npm === 'string' && body.npm !== '' ? body.npm : null;
            const taskId = body.id;
            const signal = beginTask(taskId);
            try {
                const locked = await withMutationLock(async () => runSmartInstall(config, repo, npm, signal));
                if (locked.busy) {
                    sendJson(response, 409, { ok: false, error: 'another plugin operation is running' });
                    return;
                }
                sendJson(response, 200, { ...locked.value, cancelled: isCancelled(taskId) });
            }
            finally {
                endTask(taskId);
            }
        },
    }));
    // 智能更新（v1.7.16）：AI 装前审查 → 快照旧版本 → runUpdate → 装后 AI 诊断。
    disposers.push(host.webServer.register({
        kind: 'exact',
        path: '/dsh-store/smart-update',
        handler: async (request, response) => {
            if (request.method !== 'POST' || !sameOrigin(request)) {
                response.writeHead(405, { allow: 'POST' });
                response.end();
                return;
            }
            let body;
            try {
                body = await readJsonBody(request);
            }
            catch {
                sendJson(response, 400, { ok: false, error: 'invalid body' });
                return;
            }
            const name = typeof body.name === 'string' && body.name.length > 0 && body.name.length < 214 ? body.name : null;
            const from = typeof body.from === 'string' && body.from !== '' ? body.from : '';
            const to = typeof body.to === 'string' && body.to !== '' ? body.to : '';
            if (name === null || to === '') {
                sendJson(response, 400, { ok: false, error: 'invalid name or version' });
                return;
            }
            const repo = parseRepo(body.repo);
            const npm = typeof body.npm === 'string' && body.npm !== '' ? body.npm : null;
            const taskId = body.id;
            const signal = beginTask(taskId);
            try {
                const locked = await withMutationLock(async () => runSmartUpdate(config, { name, from, to, repo, npm }, signal));
                if (locked.busy) {
                    sendJson(response, 409, { ok: false, error: 'another plugin operation is running' });
                    return;
                }
                sendJson(response, 200, { ...locked.value, cancelled: isCancelled(taskId) });
            }
            finally {
                endTask(taskId);
            }
        },
    }));
    // v1.7.52：本地已装+推荐——GET 返回「为你推荐」列表（含理由，中文）。
    disposers.push(host.webServer.register({
        kind: 'exact',
        path: '/dsh-store/recommend',
        handler: async (request, response) => {
            if (request.method !== 'GET') {
                response.writeHead(405, { allow: 'GET' });
                response.end();
                return;
            }
            try {
                const items = await recommendFor(config.profile, config.githubToken, 8);
                sendJson(response, 200, { ok: true, items });
            }
            catch (err) {
                sendJson(response, 200, { ok: true, items: [], error: err instanceof Error ? err.message : 'recommend failed' });
            }
        },
    }));
    // README 安全预渲染（v1.7.26）：GET ?repo=&file=&branch= —— host 清洗后下发。
    disposers.push(host.webServer.register({
        kind: 'exact',
        path: '/dsh-store/readme',
        handler: async (request, response) => {
            if (request.method !== 'GET') {
                response.writeHead(405, { allow: 'GET' });
                response.end();
                return;
            }
            const url = new URL(request.url ?? '/', 'http://localhost');
            const repo = url.searchParams.get('repo') ?? '';
            const file = url.searchParams.get('file') ?? '';
            const branch = url.searchParams.get('branch') ?? 'main';
            const value = await fetchSanitizedReadme(repo, file, branch);
            // v1.7.45：顺带解析 README 安装命令（展示-only，不执行）。
            // 该语言 README 无安装章节时，回退 README.md 再解析一次。
            const extra = {};
            if (value.ok) {
                const raw = await fetchRawReadme(repo, file, branch);
                let parsed = parseInstallCommands(raw.ok ? raw.text : null);
                if (parsed.commands.length === 0 && file.toLowerCase() !== 'readme.md') {
                    const en = await fetchRawReadme(repo, 'README.md', branch);
                    parsed = parseInstallCommands(en.ok ? en.text : null);
                }
                extra.installCmds = parsed.commands;
                extra.cmdSource = parsed.source;
                extra.needsConfig = detectNeedsConfig(raw.ok ? raw.text : null);
            }
            sendJson(response, value.ok ? 200 : 404, { ...value, ...extra });
        },
    }));
    // 运行时 bundle top-up 扫描（v1.7.24）：POST {repos[]} —— 页级抽查，24h 缓存。
    disposers.push(host.webServer.register({
        kind: 'exact',
        path: '/dsh-store/scan',
        handler: async (request, response) => {
            if (request.method !== 'POST' || !sameOrigin(request)) {
                response.writeHead(405, { allow: 'POST' });
                response.end();
                return;
            }
            let body;
            try {
                body = await readJsonBody(request);
            }
            catch {
                sendJson(response, 400, { ok: false, error: 'invalid body' });
                return;
            }
            const repos = Array.isArray(body.repos) ? body.repos.filter((r) => typeof r === 'string' && r !== '') : [];
            const bundles = await ensureBundleScans(config.profile, config.githubToken, repos);
            const skills = await ensureSkillScans(config.profile, config.githubToken, repos);
            sendJson(response, 200, { ok: true, bundles, skills });
        },
    }));
    // v1.7.45：页级评分富化——POST {items:[{repo,branch}]} 对当前页条目拉
    // README（24h 缓存）补全实用/便捷两维 + 重融合总分 + 安装命令解析。
    disposers.push(host.webServer.register({
        kind: 'exact',
        path: '/dsh-store/scores',
        handler: async (request, response) => {
            if (request.method !== 'POST' || !sameOrigin(request)) {
                response.writeHead(405, { allow: 'POST' });
                response.end();
                return;
            }
            let body;
            try {
                body = await readJsonBody(request);
            }
            catch {
                sendJson(response, 400, { ok: false, error: 'invalid body' });
                return;
            }
            const items = Array.isArray(body.items)
                ? body.items.filter((it) => it !== null && typeof it === 'object' && typeof it.repo === 'string')
                : [];
            const { registry } = await loadRegistry(config.profile, config.githubToken, {});
            const out = {};
            for (const it of items.slice(0, 48)) {
                const repo = it.repo;
                const branch = typeof it.branch === 'string' && it.branch !== '' ? it.branch : 'main';
                const entry = registry.plugins.find(p => (p.owner + '/' + p.name).toLowerCase() === repo.toLowerCase());
                const base = entry?.score ?? null;
                const raw = await fetchRawReadme(repo, 'README.md', branch);
                const readmeText = raw.ok ? raw.text : null;
                const needsConfig = detectNeedsConfig(readmeText);
                const parsed = parseInstallCommands(readmeText);
                const score = base !== null
                    ? enrichScore(base, readmeText, needsConfig, { stars: entry?.stars ?? null, pushedAt: entry?.pushed ?? null, curated: entry?.curated === true, verified: entry?.verified != null, bundled: entry?.bundled === true, description: entry?.description ?? '', license: entry?.license ?? null, topics: entry?.topics ?? [], hasHomepage: typeof entry?.homepage === 'string' && entry.homepage !== '' })
                    : null;
                out[repo] = { score, needsConfig, installCmds: parsed.commands, cmdSource: parsed.source };
            }
            sendJson(response, 200, { ok: true, scores: out });
        },
    }));
    // 仓库版本号按需富化：POST {repos[]} —— GitHub Releases latest（npm 未发布的仓库用）。
    disposers.push(host.webServer.register({
        kind: 'exact',
        path: '/dsh-store/versions',
        handler: async (request, response) => {
            if (request.method !== 'POST' || !sameOrigin(request)) {
                response.writeHead(405, { allow: 'POST' });
                response.end();
                return;
            }
            let body;
            try {
                body = await readJsonBody(request);
            }
            catch {
                sendJson(response, 400, { ok: false, error: 'invalid body' });
                return;
            }
            const repos = Array.isArray(body.repos) ? body.repos.filter((r) => typeof r === 'string' && r !== '') : [];
            const versions = await ensureRepoVersions(config.profile, config.githubToken, repos);
            sendJson(response, 200, { ok: true, versions });
        },
    }));
    // 自动一键更新开关：GET 读状态，POST {enabled} 切换并重排每日定时器。
    disposers.push(host.webServer.register({
        kind: 'exact',
        path: '/dsh-store/auto-update',
        handler: async (request, response) => {
            if (request.method === 'GET') {
                sendJson(response, 200, { ok: true, autoUpdate: autoUpdateStateOf(config.profile) });
                return;
            }
            if (request.method !== 'POST' || !sameOrigin(request)) {
                response.writeHead(405, { allow: 'POST, GET' });
                response.end();
                return;
            }
            let body;
            try {
                body = await readJsonBody(request);
            }
            catch {
                sendJson(response, 400, { ok: false, error: 'invalid body' });
                return;
            }
            if (typeof body.enabled !== 'boolean') {
                sendJson(response, 400, { ok: false, error: 'invalid enabled' });
                return;
            }
            const state = setAutoUpdateEnabled(config.profile, body.enabled);
            if (state.enabled)
                startAutoUpdate(config);
            else
                stopAutoUpdate();
            sendJson(response, 200, { ok: true, autoUpdate: state });
        },
    }));
    // 商店自身更新：POST 执行 dsh plugin add dsh-store@latest（重启后生效）。
    disposers.push(host.webServer.register({
        kind: 'exact',
        path: '/dsh-store/self-update',
        handler: async (request, response) => {
            if (request.method === 'GET') {
                sendJson(response, 200, await selfUpdateInfo());
                return;
            }
            if (request.method !== 'POST' || !sameOrigin(request)) {
                response.writeHead(405, { allow: 'POST' });
                response.end();
                return;
            }
            let body;
            try {
                body = await readJsonBody(request);
            }
            catch {
                body = {};
            }
            const taskId = body.id;
            const signal = beginTask(taskId);
            try {
                const locked = await withMutationLock(async () => runSelfUpdate(config, signal));
                if (locked.busy) {
                    sendJson(response, 409, { ok: false, error: 'another plugin operation is running' });
                    return;
                }
                sendJson(response, locked.value.ok ? 200 : 400, { ...locked.value, cancelled: isCancelled(taskId) });
            }
            finally {
                endTask(taskId);
            }
        },
    }));
    // Updates: POST {names?: string[]} — 更新全部可更新插件（或指定列表），
    // 串行执行 dsh plugin add <name>（不带版本即 latest）。
    disposers.push(host.webServer.register({
        kind: 'exact',
        path: '/dsh-store/update',
        handler: async (request, response) => {
            if (request.method !== 'POST' || !sameOrigin(request)) {
                response.writeHead(405, { allow: 'POST' });
                response.end();
                return;
            }
            let body;
            try {
                body = await readJsonBody(request);
            }
            catch {
                sendJson(response, 400, { ok: false, error: 'invalid body' });
                return;
            }
            const wanted = Array.isArray(body.names)
                ? body.names.filter((n) => typeof n === 'string' && n !== '').slice(0, 50)
                : null;
            const manifest = readProfileManifest(config.profile);
            const { registry } = await loadRegistry(config.profile, config.githubToken, {});
            const skip = readSkipUpdates(config.profile);
            let targets = computeUpdates(registry, manifest.dependencies, skip);
            if (wanted !== null) {
                const want = new Set(wanted.map(n => n.toLowerCase()));
                targets = targets.filter(u => want.has(u.name.toLowerCase()));
            }
            if (targets.length === 0) {
                sendJson(response, 200, { ok: true, message: 'No updates.', results: [] });
                return;
            }
            const taskId = body.id;
            const signal = beginTask(taskId);
            try {
                const locked = await withMutationLock(async () => {
                    // 更新前快照旧 spec —— 「回退到上个版本」数据源（落盘持久化）。
                    const state = readState(config.profile);
                    for (const target of targets) {
                        snapshotDep(config.profile, target.name, String(manifest.dependencies[target.name] ?? target.from), target.to, state);
                    }
                    writeState(config.profile, state);
                    return runUpdate(config, targets, signal);
                });
                if (locked.busy) {
                    sendJson(response, 409, { ok: false, error: 'another plugin operation is running' });
                    return;
                }
                sendJson(response, 200, { ...locked.value, cancelled: isCancelled(taskId) });
            }
            finally {
                endTask(taskId);
            }
        },
    }));
    // Deep verdict batch for isPlugin: called by the client for unknown entries
    // on the current page. Stops on GitHub rate-limit errors and reports what
    // it managed to check.
    disposers.push(host.webServer.register({
        kind: 'exact',
        path: '/dsh-store/verify',
        handler: async (request, response) => {
            if (request.method !== 'POST' || !sameOrigin(request)) {
                response.writeHead(405, { allow: 'POST' });
                response.end();
                return;
            }
            let body;
            try {
                body = await readJsonBody(request);
            }
            catch {
                sendJson(response, 400, { ok: false, error: 'invalid body' });
                return;
            }
            const repos = Array.isArray(body.repos) ? body.repos.filter(parseRepo) : [];
            try {
                const verdicts = await verifyRepos(config.profile, config.githubToken, repos.slice(0, 40));
                sendJson(response, 200, { ok: true, verdicts });
            }
            catch (err) {
                sendJson(response, 200, { ok: false, error: err instanceof Error ? err.message : String(err) });
            }
        },
    }));
    // Favorites: persisted in the profile's dsh-store/state.json (next to the
    // plugin's other local state), keyed by lowercase owner/repo (or local:name).
    disposers.push(host.webServer.register({
        kind: 'exact',
        path: '/dsh-store/favorites',
        handler: async (request, response) => {
            if (request.method === 'GET') {
                sendJson(response, 200, { favorites: readFavorites(config.profile) });
                return;
            }
            if (request.method !== 'POST' || !sameOrigin(request)) {
                response.writeHead(405, { allow: 'POST' });
                response.end();
                return;
            }
            let body;
            try {
                body = await readJsonBody(request);
            }
            catch {
                sendJson(response, 400, { ok: false, error: 'invalid body' });
                return;
            }
            const key = typeof body.key === 'string' ? body.key.trim().toLowerCase() : '';
            if (key === '' || key.length > 160) {
                sendJson(response, 400, { ok: false, error: 'invalid key' });
                return;
            }
            const favorites = toggleFavorite(config.profile, key);
            sendJson(response, 200, { ok: true, favorites });
        },
    }));
    // Data source: custom registry URL (registry.json format). Empty resets to
    // the default CDN index. Not a secret; still same-origin POST only, and only
    // http(s) URLs are accepted (no file:// or javascript: scheme injection).
    disposers.push(host.webServer.register({
        kind: 'exact',
        path: '/dsh-store/source',
        handler: async (request, response) => {
            if (request.method !== 'POST' || !sameOrigin(request)) {
                response.writeHead(405, { allow: 'POST' });
                response.end();
                return;
            }
            let body;
            try {
                body = await readJsonBody(request);
            }
            catch {
                sendJson(response, 400, { ok: false, error: 'invalid body' });
                return;
            }
            const url = typeof body.url === 'string' ? body.url.trim() : '';
            if (url !== '') {
                let parsed;
                try {
                    parsed = new URL(url);
                }
                catch {
                    sendJson(response, 400, { ok: false, error: 'invalid url' });
                    return;
                }
                if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
                    sendJson(response, 400, { ok: false, error: 'only http(s) urls are allowed' });
                    return;
                }
            }
            config.registryUrl = url;
            sendJson(response, 200, { ok: true, registryUrl: config.registryUrl });
        },
    }));
    // Token: set the GitHub token for this process (memory only; never echoed back).
    disposers.push(host.webServer.register({
        kind: 'exact',
        path: '/dsh-store/token',
        handler: async (request, response) => {
            if (request.method !== 'POST' || !sameOrigin(request)) {
                response.writeHead(405, { allow: 'POST' });
                response.end();
                return;
            }
            let body;
            try {
                body = await readJsonBody(request);
            }
            catch {
                sendJson(response, 400, { ok: false, error: 'invalid body' });
                return;
            }
            if (typeof body.token !== 'string' || body.token.length > 200) {
                sendJson(response, 400, { ok: false, error: 'invalid token' });
                return;
            }
            config.githubToken = body.token.trim();
            sendJson(response, 200, { ok: true });
        },
    }));
    // Publish: add the dsh-plugin topic to a repo the user can push to.
    disposers.push(host.webServer.register({
        kind: 'exact',
        path: '/dsh-store/publish',
        handler: async (request, response) => {
            if (request.method !== 'POST' || !sameOrigin(request) || !notGet(request)) {
                response.writeHead(405, { allow: 'POST' });
                response.end();
                return;
            }
            let body;
            try {
                body = await readJsonBody(request);
            }
            catch {
                sendJson(response, 400, { ok: false, error: 'invalid body' });
                return;
            }
            const repo = parseRepo(body.repo);
            if (repo === null) {
                sendJson(response, 400, { ok: false, error: 'invalid repo' });
                return;
            }
            if (config.githubToken === '') {
                sendJson(response, 200, {
                    ok: false,
                    needToken: true,
                    hint: 'Add the topic on GitHub (repo page -> About -> Topics -> add "dsh-plugin"), or run: gh api -X PUT repos/' + repo + '/topics -f "names[]=dsh-plugin"',
                });
                return;
            }
            try {
                const current = await getRepoTopics(config.githubToken, repo);
                if (body.checkOnly === true) {
                    sendJson(response, 200, { ok: true, topics: current.names });
                    return;
                }
                const names = current.names.includes('dsh-plugin') ? current.names : [...current.names, 'dsh-plugin'];
                const updated = await putRepoTopics(config.githubToken, repo, names);
                sendJson(response, 200, { ok: true, topics: updated.names, note: 'GitHub indexes topics within minutes; search for it in the market shortly.' });
            }
            catch (err) {
                sendJson(response, 200, { ok: false, error: err instanceof Error ? err.message : String(err) });
            }
        },
    }));
    // My repos picker for the publish dialog (token required).
    disposers.push(host.webServer.register({
        kind: 'exact',
        path: '/dsh-store/publish/repos',
        handler: async (request, response) => {
            if (request.method !== 'GET') {
                response.writeHead(405, { allow: 'GET' });
                response.end();
                return;
            }
            if (config.githubToken === '') {
                sendJson(response, 200, { ok: false, needToken: true, repos: [] });
                return;
            }
            try {
                const repos = await listMyRepos(config.githubToken);
                sendJson(response, 200, { ok: true, repos });
            }
            catch (err) {
                sendJson(response, 200, { ok: false, error: err instanceof Error ? err.message : String(err) });
            }
        },
    }));
    return () => { for (const dispose of disposers)
        dispose(); };
}
