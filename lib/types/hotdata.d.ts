/**
 * 热度数据保持最新（v1.8.0）：dsh-market-index 的 downloads.json（npm 下载统计，
 * CI 每日采集）+ star-history.json（星数 30 天滚动快照，星动量数据源）——
 * 进程启动 + 每 24h 拉取一次，写入 profiles/<p>/dsh-mall/hotdata-cache.json，
 * 经 setHotScores/setDownloadBaselines 注入 score.ts 热度 v2，并 reapplyHotScores
 * 强制重算当前目录（拉取前热度走 star 无偏换算路径，两者同权、身份零加成）。
 * 拉取失败永远保留上次缓存，浏览不中断；数据无需商场升版本即可分发。
 */
/** 拉取两个数据文件并应用；失败抛错（调用方保持缓存）。 */
export declare function refreshHotData(profile: string, signal?: AbortSignal): Promise<{
    dl: number;
    hist: number;
}>;
/** 进程启动：先读本地缓存（立即生效），再后台拉最新；返回本代专属 disposer。 */
export declare function startHotData(profile: string): () => void;
/** 兼容旧调用：停止当前 hotdata owner。 */
export declare function stopHotData(): void;
