/**
 * GitHub API client: topic search with date-sharded pagination, package.json
 * verdict checks, topics read/write, and rate-limit bookkeeping. All network
 * calls live on the host side; the browser only talks to our own routes.
 */
const API = 'https://api.github.com';
const RAW = 'https://raw.githubusercontent.com';
export const UA = 'dsh-store';
export function rateInfo(headers) {
    return {
        limit: Number(headers.get('x-ratelimit-limit') ?? 0),
        remaining: Number(headers.get('x-ratelimit-remaining') ?? 0),
        reset: Number(headers.get('x-ratelimit-reset') ?? 0),
    };
}
let lastRate = null;
export function lastRateInfo() { return lastRate; }
function headers(token) {
    const h = { accept: 'application/vnd.github+json', 'user-agent': UA, 'x-github-api-version': '2022-11-28' };
    if (token !== '')
        h.authorization = 'Bearer ' + token;
    return h;
}
async function gh(path, token, init = {}) {
    const res = await fetch(API + path, { ...init, headers: { ...headers(token), ...(init.headers ?? {}) }, signal: AbortSignal.timeout(20_000) });
    lastRate = rateInfo(res.headers);
    if (res.status === 403 || res.status === 429) {
        const reset = res.headers.get('x-ratelimit-reset');
        const wait = reset !== null ? Math.max(0, Number(reset) * 1000 - Date.now()) : 60_000;
        throw new Error('GitHub rate limit (HTTP ' + res.status + '); resets in ' + Math.round(wait / 1000) + 's');
    }
    if (!res.ok)
        throw new Error('GitHub HTTP ' + res.status + ' for ' + path);
    return { body: (await res.json()), rate: rateInfo(res.headers) };
}
/** Pause between shard requests so the shared-IP quota is never burst. */
export function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
export function shardInterval(token) { return token === '' ? 9000 : 3000; }
/**
 * Fetch every public repo with the dsh-plugin topic. A single search query
 * caps at 1000 results, so the space is sliced by creation year (and month
 * when a year exceeds the cap) and merged with full_name de-duplication.
 */
export async function searchDshTopicRepos(token, cb = {}) {
    // The search API on this network only answers bare topic queries (every
    // qualifier — created:/stars:/language:/pushed: — returns total_count 0),
    // and each query caps at 1000 results. To cover as much of the catalog as
    // possible, run six ordered views of the same topic and union them.
    const views = [
        { label: 'stars desc', sort: 'stars', order: 'desc' },
        { label: 'stars asc', sort: 'stars', order: 'asc' },
        { label: 'created desc', sort: 'created', order: 'desc' },
        { label: 'created asc', sort: 'created', order: 'asc' },
        { label: 'updated desc', sort: 'updated', order: 'desc' },
        { label: 'updated asc', sort: 'updated', order: 'asc' },
    ];
    const repos = new Map();
    let shardIndex = 0;
    const totalShards = 6 * 10;
    for (const view of views) {
        let pages = 10;
        try {
            const probe = await gh('/search/repositories?q=' + encodeURIComponent('topic:dsh-plugin') + '&per_page=100&page=1&sort=' + view.sort + '&order=' + view.order, token);
            pages = Math.min(10, Math.ceil(probe.body.total_count / 100));
        }
        catch (err) {
            cb.onError?.(err instanceof Error ? err.message : String(err));
            throw err;
        }
        for (let page = 1; page <= pages; page++) {
            shardIndex += 1;
            cb.onShard?.(shardIndex, totalShards, repos.size);
            try {
                const res = await gh('/search/repositories?q=' + encodeURIComponent('topic:dsh-plugin') + '&per_page=100&page=' + page + '&sort=' + view.sort + '&order=' + view.order, token);
                for (const item of res.body.items) {
                    const repo = item;
                    if (repo.full_name !== undefined)
                        repos.set(repo.full_name, item);
                }
            }
            catch (err) {
                cb.onError?.(err instanceof Error ? err.message : String(err));
                throw err;
            }
            await sleep(shardInterval(token));
        }
    }
    return [...repos.values()];
}
/**
 * Scrape the GitHub topic HTML pages (no API quota): every public repo
 * tagged dsh-plugin, ~30 per page. Parses owner/repo, pushed date and
 * language from the repository cards.
 */
export async function fetchTopicPages(cb = {}) {
    const repos = new Map();
    // The topic listing caps at 50 pages per sort view, so four ordered views
    // are unioned to widen coverage beyond the star-leaderboard head.
    const views = [
        { label: 'stars desc', sort: 'stars', order: 'desc' },
        { label: 'stars asc', sort: 'stars', order: 'asc' },
        { label: 'updated desc', sort: 'updated', order: 'desc' },
        { label: 'created desc', sort: 'created', order: 'desc' },
    ];
    let page = 1;
    let empty = 0;
    let viewIndex = 0;
    const url = (p, sort, order) => 'https://github.com/topics/dsh-plugin?o=' + order + '&s=' + sort + '&page=' + p;
    while (viewIndex < views.length) {
        const view = views[viewIndex];
        let html = '';
        let attempts = 0;
        for (;;) {
            attempts += 1;
            try {
                const res = await fetch(url(page, view.sort, view.order), { headers: { 'user-agent': 'Mozilla/5.0 (compatible; dsh-store/0.1; +local catalog crawl)' }, signal: AbortSignal.timeout(20_000) });
                if (res.status === 429) {
                    const retryAfter = Number(res.headers.get('retry-after') ?? 0);
                    const base = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : 15;
                    const waitMs = Math.min(120_000, Math.max(5000, base * 1000 * Math.min(attempts, 8)));
                    if (attempts > 8) {
                        // Rate-limited hard: keep what we already have instead of failing
                        // the whole refresh; the next refresh continues later.
                        cb.onError?.('topic page rate limit exhausted at page ' + page + ' — partial catalog kept');
                        return [...repos.values()];
                    }
                    cb.onShard?.(viewIndex * 50 + page, views.length * 50, repos.size);
                    await sleep(waitMs);
                    continue;
                }
                if (!res.ok)
                    throw new Error('HTTP ' + res.status);
                html = await res.text();
                break;
            }
            catch (err) {
                if (err instanceof Error && /HTTP 429/.test(err.message))
                    continue;
                cb.onError?.(err instanceof Error ? err.message : String(err));
                return [...repos.values()];
            }
        }
        const articles = html.split('<article class="border rounded');
        let found = 0;
        for (let i = 1; i < articles.length; i++) {
            const seg = articles[i];
            const repoMatch = /href="\/([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)"/.exec(seg);
            if (repoMatch === null)
                continue;
            const full = repoMatch[1];
            if (full.split('/').length !== 2 || repos.has(full.toLowerCase()))
                continue;
            const pushedMatch = /<relative-time datetime="([^"]+)"[^>]*>/.exec(seg);
            const langMatch = /<span itemprop="programmingLanguage">([^<]*)<\/span>/.exec(seg);
            repos.set(full.toLowerCase(), {
                full_name: full,
                name: full.split('/')[1],
                owner: full.split('/')[0],
                html_url: 'https://github.com/' + full,
                pushed_at: pushedMatch?.[1] ?? null,
                language: langMatch?.[1]?.trim() || null,
            });
            found += 1;
        }
        cb.onShard?.(viewIndex * 50 + page, views.length * 50, repos.size);
        if (found === 0 || page >= 50) {
            // Advance to the next sort view; bail early on an empty page.
            viewIndex += 1;
            page = 1;
            empty = found === 0 ? empty + 1 : 0;
            if (empty >= 2)
                break;
        }
        else {
            page += 1;
            empty = 0;
        }
        await sleep(1500);
    }
    return [...repos.values()];
}
/**
 * Deep verdict: does this repo look like a real dsh plugin? Reads the repo
 * root package.json and checks the dsh bundle/client fields and cordis
 * dependencies. null = undecidable (404 / rate limited / unreadable).
 */
export async function packageJsonVerdict(token, repo) {
    const res = await fetch(RAW + '/' + repo + '/HEAD/package.json', { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(15_000) });
    if (res.status === 403 || res.status === 429 || res.status === 404 || res.status === 451)
        return null;
    if (!res.ok)
        return null;
    try {
        const pkg = (await res.json());
        const dsh = pkg.dsh;
        if (dsh !== null && typeof dsh === 'object' && (('bundle' in dsh) || ('client' in dsh)))
            return true;
        const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}), ...(pkg.peerDependencies ?? {}) };
        for (const key of Object.keys(deps)) {
            if (key === '@deepseek-ai/cordis' || key.startsWith('@deepseek-ai/dsh-') || key === 'cosmokit')
                return true;
        }
        if (Array.isArray(pkg.keywords) && pkg.keywords.includes('dsh-plugin'))
            return true;
        return false;
    }
    catch {
        return null;
    }
}
export async function getRepoTopics(token, repo) {
    const res = await gh('/repos/' + repo + '/topics', token);
    return { names: res.body.names ?? [], rate: res.rate };
}
export async function putRepoTopics(token, repo, names) {
    const res = await gh('/repos/' + repo + '/topics', token, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ names }),
    });
    return { names: res.body.names ?? [], rate: res.rate };
}
/** Repos the token owner can push to (for the publish picker). */
export async function listMyRepos(token) {
    const res = await gh('/user/repos?per_page=100&sort=updated&affiliation=owner,collaborator,organization_member', token);
    return res.body;
}
