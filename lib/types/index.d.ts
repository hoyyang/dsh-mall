/**
 * dsh-store host entry: mounts the market's HTTP routes once the
 * profile composes the webServer service, and registers the settings
 * namespace for the GitHub token (rc.7+ hosts).
 */
import type { Context } from '@deepseek-ai/cordis';
import type { MarketConfig } from './types.ts';
export declare const name = "dsh-store";
/** Optional cordis.yml configuration; the profile defaults to \`web\`. */
export type Config = Partial<Pick<MarketConfig, 'profile' | 'githubToken'>>;
export declare function apply(ctx: Context, config?: Config): void;
