/**
 * Catalog pipeline: shard-fetch GitHub topic repos -> classify (curated map,
 * rule categories, isPlugin heuristic/verdicts) -> compute today's star
 * delta from the local snapshot -> serve through an in-memory TTL cache with
 * a bundled snapshot fallback. State (star baselines, verdicts) persists
 * under the profile directory.
 */
import type { KnownMap, MarketEntry, MarketState, Registry, RefreshProgress } from './types.ts';
export declare const CATEGORIES: Record<string, {
    en: string;
    zh: string;
}>;
export declare function setKnownOverride(map: KnownMap | null): void;
export declare function loadKnown(): KnownMap;
export declare function stateFile(profile: string): string;
export declare function readState(profile: string): MarketState;
export declare function writeState(profile: string, state: MarketState): void;
export declare function verdictsOf(profile: string): Record<string, boolean>;
export declare function readFavorites(profile: string): string[];
export declare function readSkipUpdates(profile: string): Set<string>;
export declare function setSkipUpdate(profile: string, name: string, skip: boolean): string[];
export declare function toggleFavorite(profile: string, key: string): string[];
export declare function applyVerdicts(profile: string, updates: Record<string, boolean>): void;
export declare function fetchLocalizedDescriptions(lang: string, repos: string[]): Promise<Record<string, string>>;
/** 可更新插件：已装依赖 spec 里的版本 vs 索引 npm_version（npm registry latest）。 */
export interface PluginUpdate {
    /** profile 依赖键名（npm 包名） */
    name: string;
    /** 已装版本 */
    from: string;
    /** npm 最新版本 */
    to: string;
    /** 对应 GitHub 仓库 owner/repo（可能为空） */
    repo: string;
    /** 索引里的 npm 发布名 */
    npm: string;
}
/** 从依赖 spec（^1.2.3 / 1.2.3 / npm:x@1.2.3 / github:...#semver:1.2.3）提取 x.y.z。 */
export declare function extractVersion(spec: string): string | null;
/** 语义化三段版本比较：a<b → 负数；相等 → 0；a>b → 正数。 */
export declare function compareVersions(a: string, b: string): number;
/** 已装依赖 × 目录索引：npm 最新版 > 已装版 → 可更新。link/file 安装跳过；
 *  无版本 spec 跳过；「不参与一键更新」名单与商店自身（dsh-store）排除。 */
export declare function computeUpdates(registry: Registry, deps: Record<string, string>, skip?: Set<string>): PluginUpdate[];
export declare function heuristicIsPlugin(repo: {
    name: string;
    description: string | null;
    topics: string[];
}): boolean | null;
export declare function computeTodayStars(profile: string, entries: MarketEntry[]): MarketEntry[];
export interface LoadResult {
    registry: Registry;
    refreshing: boolean;
}
export declare const progress: RefreshProgress;
export declare function loadRegistry(profile: string, token: string, opts?: {
    force?: boolean;
    registryUrl?: string;
}): Promise<LoadResult>;
/** Deep verdict batch: returns verdicts for the given repos (only true/false). */
export declare function verifyRepos(profile: string, token: string, repos: string[]): Promise<Record<string, boolean>>;
