/**
 * Install/uninstall through the dsh CLI. The CLI forwards to pnpm in the
 * profile directory and reconciles the profile's dsh.profile.bundles roster
 * at install time, so the next boot loads the plugin through the normal
 * bundle layer. Most plugins work after a page refresh; no hot-mount here.
 */
import type { InstallState, MarketConfig } from './types.ts';
interface RunResult {
    exitCode: number;
    stdout: string;
    stderr: string;
    timedOut: boolean;
}
export declare function runDsh(profile: string, args: string[]): Promise<RunResult>;
export declare const installState: InstallState;
export declare function profileDir(profile: string): string;
export declare function readManifest(profile: string): {
    dependencies: Record<string, string>;
    bundles: string[];
};
/** The installed dependency whose name/spec matches this repo, if any. */
export declare function installedDepFor(repo: string): {
    name: string;
    spec: string;
} | null;
export declare function installedDepForProfile(profile: string, repo: string): {
    name: string;
    spec: string;
} | null;
export declare function withMutationLock<T>(fn: () => Promise<T> | T): Promise<{
    busy: true;
} | {
    busy: false;
    value: T;
}>;
export declare function runInstall(config: MarketConfig, repo: string, npmName: string | null): Promise<{
    ok: boolean;
    message: string;
}>;
/** 批量更新：对每个 npm 包名跑 dsh plugin add <name>（不带版本 = 装 latest），
 *  串行执行、逐个汇报结果；全部成功才算 ok。installState.kind = 'update'。 */
/** 商店自身更新：dsh plugin add dsh-store@latest。host 代码更新后需要重启
 *  dsh 才生效（bundle 层的 JS 已经加载），返回值固定带 needRestart。 */
export declare function runSelfUpdate(config: MarketConfig): Promise<{
    ok: boolean;
    message: string;
    needRestart: boolean;
}>;
export declare function runUpdate(config: MarketConfig, targets: Array<{
    name: string;
    to: string;
}>): Promise<{
    ok: boolean;
    message: string;
    results: Array<{
        name: string;
        ok: boolean;
        message: string;
    }>;
}>;
export declare function patchFilePath(profile: string): string;
/** 用户 patch 层当前停用的 loader id 列表。 */
export declare function patchDisables(profile: string): string[];
/** 停用（enabled=false）或重新启用（enabled=true）一个 loader 条目。 */
export declare function setPluginEnabled(profile: string, loaderId: string, enabled: boolean): {
    ok: boolean;
    message: string;
};
/** 已装依赖的激活状态（借鉴 dshmarket 的状态模型，精简为三态）：
 *  live=启用中（bundle 层已装配且未被停用；官方组件经 patch insert 挂载恒为 live）；
 *  disabled=patch 层停用（cordis.patch.yml 的 disabled: true）；
 *  restart=bundle 未声明（如刚安装还没被装配/刷新）。 */
export declare function pluginStatesOf(profile: string, manifest: {
    dependencies: Record<string, string>;
    bundles: string[];
}): Record<string, 'live' | 'disabled' | 'restart'>;
export declare function snapshotDep(profile: string, name: string, spec: string, to: string, state: {
    rollbacks?: Record<string, {
        name: string;
        from: string;
        to: string;
        spec: string;
        at: string;
    }>;
}): Record<string, {
    name: string;
    from: string;
    to: string;
    spec: string;
    at: string;
}>;
export declare function rollbackDep(profile: string, name: string, state: {
    rollbacks?: Record<string, {
        name: string;
        from: string;
        to: string;
        spec: string;
        at: string;
    }>;
}): {
    ok: boolean;
    message: string;
} | null;
export declare function runUninstall(config: MarketConfig, repo: string, name?: string): Promise<{
    ok: boolean;
    message: string;
}>;
export {};
