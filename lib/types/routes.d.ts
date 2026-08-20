/**
 * HTTP routes bridging the browser market UI to the host: registry data,
 * refresh status, install/uninstall, verify (isPlugin deep check) and
 * publish (add the dsh-plugin topic to the user's own repo).
 *
 * Security: install/uninstall/publish accept only same-origin POSTs. The
 * GitHub token never leaves the process and never appears in responses.
 */
import type { IncomingMessage, ServerResponse } from 'node:http';
/** The market's own version from its package.json (read once per process). */
export declare function marketVersion(): string;
import type { MarketConfig } from './types.ts';
export interface WebServerService {
    register(route: {
        kind: 'exact' | 'prefix';
        path: string;
        handler: (request: IncomingMessage, response: ServerResponse) => void | Promise<void>;
    }): () => void;
}
export interface MarketHost {
    webServer: WebServerService;
    effect?(callback: () => void | (() => void), label?: string): void;
}
export declare function mountMarketRoutes(host: MarketHost, config: MarketConfig): () => void;
