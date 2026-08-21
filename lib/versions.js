/**
 * 仓库版本号按需富化（v1.7.12）：对 npm 未发布（npmVersion=null）且索引
 * 根 package.json 无 version 的条目（如 WeKnora monorepo），按需查 GitHub
 * Releases latest 的 tag_name 作为版本号展示。
 * - API：api.github.com/repos/<repo>/releases/latest（单仓 1 请求，带 token
 *   时额度充足；匿名 60/h，缓存后翻页成本可忽略）
 * - 缓存：profile dsh-store/state.json（repoVersions），TTL 24h
 * - 上限：单次 24 仓（翻页一屏量）
 */
import { readState, writeState } from "./catalog.js";
const TTL_MS = 24 * 60 * 60 * 1000;
const FETCH_TIMEOUT_MS = 12_000;
const MAX_REPOS = 24;
const REPO_RE = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
export async function ensureRepoVersions(profile, token, rawRepos) {
    const repos = [...new Set(rawRepos.filter(r => REPO_RE.test(r)))].slice(0, MAX_REPOS);
    const out = {};
    if (repos.length === 0)
        return out;
    const state = readState(profile);
    const cache = state.repoVersions ?? {};
    const now = Date.now();
    for (const repo of repos) {
        const key = repo.toLowerCase();
        const hit = cache[key];
        if (hit !== undefined && now - hit.at < TTL_MS) {
            out[repo] = hit.value;
            continue;
        }
        try {
            const res = await fetch('https://api.github.com/repos/' + repo + '/releases/latest', {
                headers: {
                    'user-agent': 'dsh-store',
                    accept: 'application/vnd.github+json',
                    ...(token !== '' ? { authorization: 'Bearer ' + token } : {}),
                },
                signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
            });
            let value = null;
            if (res.ok) {
                const body = (await res.json());
                if (typeof body.tag_name === 'string' && body.tag_name !== '')
                    value = body.tag_name;
            }
            else if (res.status === 404) {
                value = null; // 无 release
            }
            else {
                continue; // 限流/网络：本次跳过不缓存
            }
            cache[key] = { at: Date.now(), value };
            out[repo] = value;
        }
        catch {
            /* 网络失败：下次再试 */
        }
    }
    state.repoVersions = cache;
    writeState(profile, state);
    return out;
}
