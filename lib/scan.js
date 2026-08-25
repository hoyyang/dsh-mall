/**
 * 运行时 top-up 扫描（v1.7.24，R5）：CI 一天一批，这里补新鲜度——对
 * bundled 未知 或 CI 扫描后又有 push 的条目做页级抽查（每页 ≤24 仓）：
 * raw 读根 package.json（不占 API 额度）命中 dsh.bundle → true；
 * 无根 manifest 时用 GitHub API 树抽查（token 可用时更宽裕；匿名额度耗尽
 * 自动停止）。结果缓存 state.json 24h。发现「曾有 bundle、现在没了」的条目
 * 会返回 false（插件作废信号），由 UI 打失效徽章；数据修正仍走索引 CI。
 */
import { readState, writeState } from "./catalog.js";
const TTL_MS = 24 * 60 * 60 * 1000;
const MAX_REPOS = 24;
const FETCH_TIMEOUT_MS = 10_000;
const REPO_RE = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
async function manifestHasBundle(repo, token) {
    // v1.7.55：monorepo 误判修复——根 manifest 存在但无 dsh.bundle 时不再直接判 false
    // （如 dsh-web-ui：插件清单在 packages/* 子包），改走全树抽查；
    // 树抽查失败（限流/网络）→ null 下轮重试，绝不误判。
    const hasBundle = (pkg) => {
        const p = pkg;
        return p !== null && typeof p === 'object' && p.dsh !== undefined && typeof p.dsh === 'object' && p.dsh.bundle !== undefined;
    };
    // 1) raw 根 package.json（零额度）——命中即 true；未命中继续全树抽查
    let rootMissing = false;
    try {
        const res = await fetch('https://raw.githubusercontent.com/' + repo + '/HEAD/package.json', {
            headers: { 'user-agent': 'dsh-store', ...(token !== '' ? { authorization: 'Bearer ' + token } : {}) },
            signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        });
        if (res.ok) {
            const pkg = JSON.parse((await res.text()).slice(0, 200_000));
            if (hasBundle(pkg))
                return true;
        }
        else if (res.status === 404) {
            rootMissing = true;
        }
        else {
            return null; // 限流/网络：本次不判定
        }
    }
    catch {
        return null;
    }
    // 2) GitHub API 树抽查（子包 monorepo 判定；有限预算，额度耗尽即停）
    try {
        const res = await fetch('https://api.github.com/repos/' + repo + '/git/trees/HEAD?recursive=1', {
            headers: { 'user-agent': 'dsh-store', accept: 'application/vnd.github+json', ...(token !== '' ? { authorization: 'Bearer ' + token } : {}) },
            signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        });
        if (!res.ok)
            return null;
        const body = await res.json();
        if (body.truncated === true)
            return null;
        const pkgs = (body.tree ?? [])
            .filter(t => t.type === 'blob' && (t.path ?? '').endsWith('package.json') && !/node_modules/.test(t.path ?? ''))
            .sort((a, b) => ((a.path ?? '').split('/').length - (b.path ?? '').split('/').length))
            .slice(0, 20);
        if (pkgs.length === 0)
            return rootMissing ? false : null;
        let checked = 0;
        for (const pkg of pkgs) {
            const raw = await fetch('https://raw.githubusercontent.com/' + repo + '/HEAD/' + pkg.path, {
                headers: { 'user-agent': 'dsh-store', ...(token !== '' ? { authorization: 'Bearer ' + token } : {}) },
                signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
            });
            if (!raw.ok)
                continue;
            checked++;
            const parsed = JSON.parse((await raw.text()).slice(0, 200_000));
            if (hasBundle(parsed))
                return true;
        }
        // 全树抽查到 package.json 但没有一个带 bundle → 才可判 false
        return checked > 0 ? false : null;
    }
    catch {
        return null;
    }
}
/** skill 型检测（v1.7.45）：根 SKILL.md raw 直读（零额度）命中 → true；
 *  无根 SKILL.md 时用 GitHub API 树找 skills?/ 目录下的 SKILL.md；
 *  两者都无 → false；网络失败 → null（不判定）。结果缓存 state.json 24h。 */
async function manifestSkill(repo, token) {
    // 1) raw 根 SKILL.md（零额度）
    try {
        const res = await fetch('https://raw.githubusercontent.com/' + repo + '/HEAD/SKILL.md', {
            headers: { 'user-agent': 'dsh-store', ...(token !== '' ? { authorization: 'Bearer ' + token } : {}) },
            signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        });
        if (res.ok)
            return true;
        if (res.status !== 404)
            return null; // 限流/网络：本次不判定
    }
    catch {
        return null;
    }
    // 2) 无根 SKILL.md：GitHub API 树找 skills?/ 目录下的 SKILL.md
    try {
        const res = await fetch('https://api.github.com/repos/' + repo + '/git/trees/HEAD?recursive=1', {
            headers: { 'user-agent': 'dsh-store', accept: 'application/vnd.github+json', ...(token !== '' ? { authorization: 'Bearer ' + token } : {}) },
            signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        });
        if (!res.ok)
            return null;
        const body = await res.json();
        if (body.truncated === true)
            return null;
        const skillFiles = (body.tree ?? []).filter(t => t.type === 'blob' && /^skills?\/[^/]+\/SKILL\.md$/i.test(t.path ?? ''));
        return skillFiles.length > 0;
    }
    catch {
        return null;
    }
}
export async function ensureSkillScans(profile, token, rawRepos) {
    const repos = [...new Set(rawRepos.filter(r => REPO_RE.test(r)))].slice(0, MAX_REPOS);
    const out = {};
    if (repos.length === 0)
        return out;
    const state = readState(profile);
    const cache = state.skillScans ?? {};
    const now = Date.now();
    for (const repo of repos) {
        const key = repo.toLowerCase();
        const hit = cache[key];
        if (hit !== undefined && now - hit.at < TTL_MS) {
            out[repo] = hit.value;
            continue;
        }
        const value = await manifestSkill(repo, token);
        if (value === null)
            continue; // 不可判定：不缓存、不返回
        cache[key] = { at: now, value };
        out[repo] = value;
    }
    state.skillScans = cache;
    writeState(profile, state);
    return out;
}
export async function ensureBundleScans(profile, token, rawRepos) {
    const repos = [...new Set(rawRepos.filter(r => REPO_RE.test(r)))].slice(0, MAX_REPOS);
    const out = {};
    if (repos.length === 0)
        return out;
    const state = readState(profile);
    const cache = state.bundleScans ?? {};
    const now = Date.now();
    // v1.7.61：未通过扫描（false）缓存缩短为 6h——「下次重新扫」；已扫描/其他仍 24h。
    const FALSE_TTL_MS = 6 * 60 * 60 * 1000;
    for (const repo of repos) {
        const key = repo.toLowerCase();
        const hit = cache[key];
        if (hit !== undefined && now - hit.at < TTL_MS && (hit.value !== false || now - hit.at < FALSE_TTL_MS)) {
            out[repo] = hit.value;
            continue;
        }
        const value = await manifestHasBundle(repo, token);
        if (value === null)
            continue; // 不可判定：不缓存、不返回
        cache[key] = { at: now, value };
        out[repo] = value;
    }
    state.bundleScans = cache;
    writeState(profile, state);
    return out;
}
