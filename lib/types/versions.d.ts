/**
 * 仓库版本号按需富化（v1.7.12）：对 npm 未发布（npmVersion=null）且索引
 * 根 package.json 无 version 的条目（如 WeKnora monorepo），按需查 GitHub
 * Releases latest 的 tag_name 作为版本号展示。
 * - API：api.github.com/repos/<repo>/releases/latest（单仓 1 请求，带 token
 *   时额度充足；匿名 60/h，缓存后翻页成本可忽略）
 * - 缓存：profile dsh-mall/state.json（repoVersions），TTL 24h
 * - 上限：单次 24 仓（翻页一屏量）
 */
export declare function ensureRepoVersions(profile: string, token: string, rawRepos: string[]): Promise<Record<string, string | null>>;
