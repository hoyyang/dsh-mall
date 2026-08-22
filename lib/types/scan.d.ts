/**
 * 运行时 top-up 扫描（v1.7.24，R5）：CI 一天一批，这里补新鲜度——对
 * bundled 未知 或 CI 扫描后又有 push 的条目做页级抽查（每页 ≤24 仓）：
 * raw 读根 package.json（不占 API 额度）命中 dsh.bundle → true；
 * 无根 manifest 时用 GitHub API 树抽查（token 可用时更宽裕；匿名额度耗尽
 * 自动停止）。结果缓存 state.json 24h。发现「曾有 bundle、现在没了」的条目
 * 会返回 false（插件作废信号），由 UI 打失效徽章；数据修正仍走索引 CI。
 */
export declare function ensureBundleScans(profile: string, token: string, rawRepos: string[]): Promise<Record<string, boolean | null>>;
