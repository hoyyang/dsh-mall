/**
 * 中文打标数据保持最新（v1.7.52）：dsh-market-index 的 tags.json（手动/半自动
 * LLM 打标产物，独立于 registry.json，见 scripts/tag-zh.mjs）——
 * 进程启动 + 每 24h 拉取一次，写入 profiles/<p>/dsh-store/tags-cache.json，
 * 经 setTagsOverride 挂到 catalog 的条目上（tagsZh 字段）。
 * 拉取失败永远保留上次缓存/空值，浏览不中断；打标结果无需商店升版本即可分发。
 */
/** 拉取一次并写缓存；失败抛错（由调用方决定重试节奏）。 */
export declare function refreshTags(profile: string): Promise<{
    count: number;
}>;
/** 进程启动：先读本地缓存（立即生效），再后台拉最新。 */
export declare function startTagsRefresh(profile: string): void;
export declare function stopTagsRefresh(): void;
