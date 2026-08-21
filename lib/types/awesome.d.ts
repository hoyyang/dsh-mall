/**
 * awesome-dsh-plugin 人工目录自动保持最新（v1.7.2，需求⑥）：
 * - 数据源：https://awesome-dsh-plugin.com/plugins.json（与 dshmarket 同源，
 *   目录自带 description.{en,zh} 多语言简介 + category/npm/added/stars/downloads）
 * - 进程启动 + 每 24h 拉取一次，转换为 KnownMap 格式缓存在
 *   profiles/<profile>/dsh-store/awesome-cache.json；
 * - catalog.ts 的 loadKnown() 优先使用该缓存（刷新成功即覆盖），
 *   拉取失败永远回退打包快照（data/awesome-known.json），浏览不中断。
 */
/** 拉取一次并写缓存；失败抛错（由调用方决定重试节奏）。 */
export declare function refreshAwesome(profile: string): Promise<{
    count: number;
}>;
/** 进程启动：先读本地缓存（立即生效），再后台拉最新。 */
export declare function startAwesomeRefresh(profile: string): void;
export declare function stopAwesomeRefresh(): void;
