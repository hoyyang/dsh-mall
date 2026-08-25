/**
 * 自动一键更新（v1.7）：每天一次（本地时间 03:30），先强制刷新目录数据，
 * 再对「可更新 + 未 skip」的已装插件串行执行一键更新（复用 /dsh-mall/update
 * 的同一套逻辑：computeUpdates → runUpdate，更新前落回退快照）。
 *
 * 开关持久化在 profile 的 dsh-mall/state.json（autoUpdate 字段）；进程启动
 * 时若开关为开则自动续期定时器。商场自身（dsh-mall）不参与自动更新——
 * 更新运行中的宿主需要重启，仍由设置页的「更新 DSH 商场」按钮手动执行。
 */
import type { MarketConfig } from './types.ts';
export interface AutoUpdateState {
    enabled: boolean;
    lastRunAt: string | null;
    lastUpdated: number;
    lastMessage: string | null;
}
export declare function autoUpdateStateOf(profile: string): AutoUpdateState;
export declare function setAutoUpdateEnabled(profile: string, enabled: boolean): AutoUpdateState;
/** 开关打开 / 进程启动时调用：按当前开关状态重排定时器。 */
export declare function startAutoUpdate(config: MarketConfig): void;
export declare function stopAutoUpdate(): void;
