/**
 * The market's own settings namespace: exposes the GitHub token as a field
 * on the plugin configuration page (dsh >= rc.7). The routes read the live
 * object on every request, so a saved change applies immediately. The token
 * is memory-only: never persisted, never logged, never sent back.
 */
import type { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
export declare const MARKET_SETTINGS_NS: import("@deepseek-ai/dsh-settings").SettingsNamespace;
export interface MarketSettings {
    githubToken: string;
}
export declare const MarketSettings: z<MarketSettings>;
export declare function installMarketSettings(ctx: Context, resolved: {
    githubToken?: string;
}): void;
