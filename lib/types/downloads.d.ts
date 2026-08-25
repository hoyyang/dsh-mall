/**
 * npm 下载量（近 30 天）按需富化（v1.7.1）：
 * - 数据源：api.npmjs.org/downloads/point/last-month/{pkg1,pkg2,...}（bulk，每批 ≤100）
 * - 缓存：profile 的 dsh-mall/state.json（downloads 字段），TTL 24h；
 *   未发布（null）也缓存但 TTL 缩短到 6h（随时可能首次发布）。
 * - 边界：单次请求最多 2000 个包名，批间串行（npm API 对突发敏感）。
 */
/** 补齐缓存：返回全部请求过的包名 → 下载量（null=未发布）。 */
export declare function ensureDownloads(profile: string, rawNames: string[]): Promise<Record<string, number | null>>;
/** 总下载量（2019-01-01 起累计）：单包逐个查（range bulk 上限 365 天），
 *  缓存 key 为 'total:<name>'。单次上限 96 个包（防止一次刷爆 npm API）。 */
export declare function ensureTotals(profile: string, rawNames: string[]): Promise<Record<string, number | null>>;
