/**
 * dsh-store find tool + result staging:
 * - find_dsh_store_plugin tool (any agent can call it): searches the local
 *   store catalog (CDN index already in memory), returns recommended +
 *   related plugin lists, and renders a button-link that opens the store
 *   results window.
 * - query-result staging: the tool payload is staged in memory under a
 *   random token; the client fetches it when the user clicks the button.
 */
import type { MarketEntry } from './types.ts';
export declare const FIND_TOOL_NAME = "find_dsh_store_plugin";
interface FindPayload {
    query: string;
    recommended: MarketEntry[];
    related: MarketEntry[];
}
export declare function stageResults(payload: FindPayload): string;
export declare function takeResults(token: string): FindPayload | null;
/** Search the in-memory catalog for a natural-language requirement. */
export declare function findPlugins(profile: string, token: string, query: string, limit: number): Promise<FindPayload>;
export declare function installFindTool(ctx: {
    tools: {
        register(tool: unknown): void;
    };
}, profile: string, githubToken: () => string, webOrigin: () => string): void;
export {};
