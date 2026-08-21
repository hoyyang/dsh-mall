/**
 * 自动一键更新（v1.7）：每天一次（本地时间 03:30），先强制刷新目录数据，
 * 再对「可更新 + 未 skip」的已装插件串行执行一键更新（复用 /dsh-store/update
 * 的同一套逻辑：computeUpdates → runUpdate，更新前落回退快照）。
 *
 * 开关持久化在 profile 的 dsh-store/state.json（autoUpdate 字段）；进程启动
 * 时若开关为开则自动续期定时器。商店自身（dsh-store）不参与自动更新——
 * 更新运行中的宿主需要重启，仍由设置页的「更新 DSH 商店」按钮手动执行。
 */
import { computeUpdates, loadRegistry, readSkipUpdates, readState, writeState } from "./catalog.js";
import { readManifest, runUpdate, snapshotDep, withMutationLock } from "./install.js";
let timer = null;
let running = false;
/** 每天自动更新的本地时间（03:30）。 */
const AUTO_UPDATE_HOUR = 3;
const AUTO_UPDATE_MINUTE = 30;
export function autoUpdateStateOf(profile) {
    const au = readState(profile).autoUpdate;
    return {
        enabled: au?.enabled === true,
        lastRunAt: au?.lastRunAt ?? null,
        lastUpdated: au?.lastUpdated ?? 0,
        lastMessage: au?.lastMessage ?? null,
    };
}
export function setAutoUpdateEnabled(profile, enabled) {
    const state = readState(profile);
    const prev = state.autoUpdate ?? { enabled: false, lastRunAt: null, lastUpdated: 0, lastMessage: null };
    const next = { ...prev, enabled };
    state.autoUpdate = next;
    writeState(profile, state);
    return next;
}
function msUntilNext(hour, minute) {
    const now = new Date();
    const next = new Date(now);
    next.setHours(hour, minute, 0, 0);
    if (next.getTime() <= now.getTime())
        next.setDate(next.getDate() + 1);
    return next.getTime() - now.getTime();
}
async function runDailyAutoUpdate(config) {
    if (running)
        return;
    running = true;
    let updated = 0;
    let message = 'No updates.';
    try {
        const { registry } = await loadRegistry(config.profile, config.githubToken, { force: true });
        const manifest = readManifest(config.profile);
        const skip = readSkipUpdates(config.profile);
        const targets = computeUpdates(registry, manifest.dependencies, skip);
        if (targets.length > 0) {
            const locked = await withMutationLock(async () => {
                const state = readState(config.profile);
                for (const target of targets) {
                    snapshotDep(config.profile, target.name, String(manifest.dependencies[target.name] ?? target.from), target.to, state);
                }
                writeState(config.profile, state);
                return runUpdate(config, targets);
            });
            if (locked.busy) {
                message = 'Another plugin operation was running.';
            }
            else {
                updated = locked.value.results.filter(result => result.ok).length;
                message = locked.value.message;
            }
        }
    }
    catch (err) {
        message = err instanceof Error ? err.message : String(err);
    }
    finally {
        running = false;
        const state = readState(config.profile);
        const prev = state.autoUpdate ?? { enabled: true, lastRunAt: null, lastUpdated: 0, lastMessage: null };
        state.autoUpdate = { ...prev, lastRunAt: new Date().toISOString(), lastUpdated: updated, lastMessage: message };
        writeState(config.profile, state);
        scheduleNext(config);
    }
}
function scheduleNext(config) {
    stopAutoUpdate();
    if (readState(config.profile).autoUpdate?.enabled !== true)
        return;
    const delay = Math.min(msUntilNext(AUTO_UPDATE_HOUR, AUTO_UPDATE_MINUTE), 2 ** 31 - 1);
    timer = setTimeout(() => { void runDailyAutoUpdate(config); }, delay);
    timer.unref?.();
}
/** 开关打开 / 进程启动时调用：按当前开关状态重排定时器。 */
export function startAutoUpdate(config) {
    scheduleNext(config);
}
export function stopAutoUpdate() {
    if (timer !== null) {
        clearTimeout(timer);
        timer = null;
    }
}
