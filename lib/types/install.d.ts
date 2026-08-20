/**
 * Install/uninstall through the dsh CLI. The CLI forwards to pnpm in the
 * profile directory and reconciles the profile's dsh.profile.bundles roster
 * at install time, so the next boot loads the plugin through the normal
 * bundle layer. Most plugins work after a page refresh; no hot-mount here.
 */
import type { InstallState, MarketConfig } from './types.ts';
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
export declare function runUninstall(config: MarketConfig, repo: string): Promise<{
    ok: boolean;
    message: string;
}>;
