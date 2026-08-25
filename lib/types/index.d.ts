/**
 * dsh-mall host entry: mounts the market's HTTP routes once the
 * profile composes the webServer service, registers the settings
 * namespace for the GitHub token (rc.7+ hosts), installs the
 * find_dsh_mall_plugin tool, and provisions the /dsh-mall skill.
 */
import type { Context } from '@deepseek-ai/cordis';
import type { MarketConfig } from './types.ts';
export declare const name = "dsh-mall";
/** Optional cordis.yml configuration; the profile defaults to `web`. */
export type Config = Partial<Pick<MarketConfig, 'profile' | 'githubToken' | 'registryUrl'>>;
export declare function apply(ctx: Context, config?: Config): void;
