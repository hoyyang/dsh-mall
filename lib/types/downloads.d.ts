/**
 * npm 下载量按需富化：官方 point API + profile 派生缓存。
 * v1.8.3 起缓存并下发 npm 响应的统计区间与本地查询时间，避免把
 * “页面刚查询”误读为“npm 已统计到现在”。
 */
export interface DownloadFreshness {
    /** last-month point 响应的统计区间；periodEnd 是 npm 当前可观察截止日。 */
    periodStart: string | null;
    periodEnd: string | null;
    /** 本地最近一次查询 last-month / total 端点的时间。 */
    totalPeriodStart: string | null;
    totalPeriodEnd: string | null;
    queriedAt: string | null;
    totalQueriedAt: string | null;
}
/** 补齐缓存：返回全部请求过的包名 → 近 30 天下载量（null=未发布）。 */
export declare function ensureDownloads(profile: string, rawNames: string[]): Promise<Record<string, number | null>>;
/** 总下载量（2019-01-01 起累计），缓存 key 为 total:<name>。 */
export declare function ensureTotals(profile: string, rawNames: string[]): Promise<Record<string, number | null>>;
/** 已落缓存的 npm 数据新鲜度；不发网络请求。 */
export declare function downloadsFreshnessOf(profile: string, rawNames: string[]): Record<string, DownloadFreshness>;
