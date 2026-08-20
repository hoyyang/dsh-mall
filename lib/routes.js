/**
 * HTTP routes bridging the browser market UI to the host: registry data,
 * refresh status, install/uninstall, verify (isPlugin deep check) and
 * publish (add the dsh-plugin topic to the user's own repo).
 *
 * Security: install/uninstall/publish accept only same-origin POSTs. The
 * GitHub token never leaves the process and never appears in responses.
 */
import { readFileSync } from 'node:fs';
import { loadRegistry, progress, verifyRepos } from "./catalog.js";
import { getRepoTopics, lastRateInfo, listMyRepos, putRepoTopics } from "./github.js";
import { installState, readManifest as readProfileManifest, runInstall, runUninstall, withMutationLock } from "./install.js";
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
export function mountMarketRoutes(host, config) {
    const disposers = [];
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
            const { registry, refreshing } = await loadRegistry(config.profile, config.githubToken, { force });
            sendJson(response, 200, { registry, refreshing, fetchAt: new Date().toISOString(), progress: { ...progress } });
        },
    }));
    disposers.push(host.webServer.register({
        kind: 'exact',
        path: '/dsh-store/status',
        handler: (request, response) => {
            if (request.method !== 'GET') {
                response.writeHead(405, { allow: 'GET' });
                response.end();
                return;
            }
            const manifest = readProfileManifest(config.profile);
            sendJson(response, 200, {
                version: marketVersion(),
                refreshing: progress.running,
                progress: { ...progress },
                install: { ...installState },
                installed: manifest.dependencies,
                bundles: manifest.bundles,
                tokenConfigured: config.githubToken !== '',
                rateLimit: lastRateInfo(),
            });
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
            const locked = await withMutationLock(async () => runInstall(config, repo, npm));
            if (locked.busy) {
                sendJson(response, 409, { ok: false, error: 'another plugin operation is running' });
                return;
            }
            sendJson(response, 200, locked.value);
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
            if (repo === null) {
                sendJson(response, 400, { ok: false, error: 'invalid repo' });
                return;
            }
            const locked = await withMutationLock(async () => runUninstall(config, repo));
            if (locked.busy) {
                sendJson(response, 409, { ok: false, error: 'another plugin operation is running' });
                return;
            }
            sendJson(response, 200, locked.value);
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
