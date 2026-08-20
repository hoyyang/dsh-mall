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
export declare function loadKnown(): KnownMap;
export declare function stateFile(profile: string): string;
export declare function readState(profile: string): MarketState;
export declare function writeState(profile: string, state: MarketState): void;
export declare function verdictsOf(profile: string): Record<string, boolean>;
export declare function readFavorites(profile: string): string[];
export declare function toggleFavorite(profile: string, key: string): string[];
export declare function applyVerdicts(profile: string, updates: Record<string, boolean>): void;
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
