/**
 * README 安全预渲染（v1.7.26，R7）：host 端清洗后下发，详情面板消费。
 * - 图片域名白名单：raw/camo/user-images/avatars.githubusercontent.com、github.com；
 *   白名单外图片（第三方图床/跟踪像素）移除并留占位说明。
 * - 剥离 <script>/<style> 与其余原始 HTML（标题/段落/换行转 Markdown）。
 * - 标题降级（H1→H2…，详情面板内不出现超大标题）。
 * - 相对链接/图片改 absolute（raw 或 github blob），MarkdownText 可渲染。
 * - 24h 内存缓存；仓库/文件名严格白名单（防路径穿越）。
 */
const ALLOWED_IMG_HOSTS = new Set([
    'raw.githubusercontent.com',
    'camo.githubusercontent.com',
    'user-images.githubusercontent.com',
    'avatars.githubusercontent.com',
    'github.com',
]);
const TTL_MS = 24 * 60 * 60 * 1000;
const README_MAX = 200_000;
const REPO_RE = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
const FILE_RE = /^(docs\/)?[A-Za-z0-9._-]+\.md$/;
const cache = new Map();
const rawCache = new Map();
function imgHostAllowed(url) {
    try {
        const host = new URL(url).hostname.toLowerCase();
        for (const h of ALLOWED_IMG_HOSTS)
            if (host === h || host.endsWith('.' + h))
                return true;
        return false;
    }
    catch {
        return false;
    }
}
/** 原始 README（不做任何清洗）：评分/安装命令解析用；24h 缓存。 */
export async function fetchRawReadme(repo, file, branch) {
    if (!REPO_RE.test(repo) || !FILE_RE.test(file) || file.includes('..'))
        return { ok: false, text: 'invalid repo or file' };
    const safeBranch = /^[A-Za-z0-9._/-]+$/.test(branch) && !branch.includes('..') ? branch : 'main';
    const key = (repo + '@' + safeBranch + '/' + file).toLowerCase();
    const hit = rawCache.get(key);
    if (hit !== undefined && Date.now() - hit.at < TTL_MS)
        return hit.value;
    const rawBase = 'https://raw.githubusercontent.com/' + repo + '/' + safeBranch + '/';
    let md = '';
    try {
        const res = await fetch(rawBase + file, { headers: { 'user-agent': 'dsh-store' }, signal: AbortSignal.timeout(15_000) });
        if (!res.ok) {
            const value = { ok: false, text: 'HTTP ' + res.status };
            rawCache.set(key, { at: Date.now(), value });
            return value;
        }
        md = (await res.text()).slice(0, README_MAX);
    }
    catch (err) {
        const value = { ok: false, text: err instanceof Error ? err.message : 'fetch failed' };
        rawCache.set(key, { at: Date.now(), value });
        return value;
    }
    const value = { ok: true, text: md };
    rawCache.set(key, { at: Date.now(), value });
    return value;
}
export async function fetchSanitizedReadme(repo, file, branch) {
    if (!REPO_RE.test(repo) || !FILE_RE.test(file) || file.includes('..'))
        return { ok: false, text: 'invalid repo or file' };
    const safeBranch = /^[A-Za-z0-9._/-]+$/.test(branch) && !branch.includes('..') ? branch : 'main';
    const key = (repo + '@' + safeBranch + '/' + file).toLowerCase();
    const hit = cache.get(key);
    if (hit !== undefined && Date.now() - hit.at < TTL_MS)
        return hit.value;
    const rawBase = 'https://raw.githubusercontent.com/' + repo + '/' + safeBranch + '/';
    const ghBase = 'https://github.com/' + repo + '/blob/' + safeBranch + '/';
    const raw = await fetchRawReadme(repo, file, safeBranch);
    if (!raw.ok) {
        const value = raw;
        cache.set(key, { at: Date.now(), value });
        return value;
    }
    let md = raw.text;
    const absolutize = (url, base) => {
        if (/^(https?:|data:|#|mailto:)/i.test(url))
            return url;
        if (url.startsWith('/'))
            return base + url.replace(/^\//, '');
        return base + url;
    };
    md = md
        .replace(/<script\b[\s\S]*?<\/script>/gi, '')
        .replace(/<style\b[\s\S]*?<\/style>/gi, '')
        .replace(/<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/gi, (_m, tag, inner) => '#'.repeat(Math.min(6, Number(tag[1]) + 1)) + ' ' + inner.replace(/\s+/g, ' ').trim())
        .replace(/<p\b[^>]*>/gi, '\n\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<hr\s*\/?>/gi, '\n\n---\n\n')
        .replace(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*\/?>/gi, (_m, src) => (imgHostAllowed(absolutize(src, rawBase)) ? '![image](' + absolutize(src, rawBase) + ')' : '〔非白名单图片已移除〕'))
        .replace(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_m, href, label) => (/^(https?:|#|mailto:)/i.test(href) ? '[' + label.replace(/\s+/g, ' ').trim() + '](' + href + ')' : label.replace(/\s+/g, ' ').trim()))
        .replace(/<[^>]+>/g, '')
        .replace(/^([ \t]{1,6})(?=\S)/gm, '')
        .replace(/^#{1,5} /gm, '#$&')
        .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_m, alt, url) => (/^https?:/i.test(url) || url.startsWith('#') ? _m : '![' + alt + '](' + absolutize(url, rawBase) + ')'))
        .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label, url) => (/^(https?:|#|mailto:)/i.test(url) ? _m : '[' + label + '](' + absolutize(url, ghBase) + ')'));
    const value = { ok: true, text: md };
    cache.set(key, { at: Date.now(), value });
    return value;
}
