/**
 * dsh-mall find tool + result staging:
 * - find_dsh_mall_plugin tool (any agent can call it): searches the local
 *   store catalog (CDN index already in memory), returns recommended +
 *   related plugin lists, and renders a button-link that opens the store
 *   results window.
 * - query-result staging: the tool payload is staged in memory under a
 *   random token; the client fetches it when the user clicks the button.
 */
import type { MarketEntry } from './types.ts';
export declare const FIND_TOOL_NAME = "find_dsh_mall_plugin";
interface FindPayload {
    query: string;
    recommended: MarketEntry[];
    related: MarketEntry[];
    /** 结果条目的分类表（与主商场同款 catLabel 数据源）。 */
    categories?: Record<string, {
        en: string;
        zh: string;
    }>;
}
export declare function stageResults(profile: string, payload: FindPayload): string;
export declare function takeResults(profile: string, token: string): FindPayload | null;
/** Search the in-memory catalog for a natural-language requirement. */
export declare function findPlugins(profile: string, token: string, query: string, limit: number): Promise<FindPayload>;
/** 智能搜索：用用户主模型（dsh --profile headless）把需求解析成
 *  英文检索词（JSON {query}），再跑目录评分推荐；模型不可用直接原词。 */
export declare function smartSearch(profile: string, token: string, rawQuery: string, limit: number): Promise<FindPayload & {
    aiUsed: boolean;
}>;
export declare function installFindTool(ctx: {
    tools: {
        register(tool: unknown): void;
    };
}, profile: string, githubToken: () => string, webOrigin: () => string): void;
export {};
