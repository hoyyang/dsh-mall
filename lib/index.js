/**
 * dsh-store host entry: mounts the market's HTTP routes once the
 * profile composes the webServer service, and registers the settings
 * namespace for the GitHub token (rc.7+ hosts).
 */
import { mountMarketRoutes } from "./routes.js";
import { installMarketSettings } from "./settings.js";
export const name = 'dsh-store';
function argvProfile() {
    const argv = process.argv;
    const flag = argv.indexOf('--profile');
    if (flag !== -1 && flag + 1 < argv.length && !argv[flag + 1].startsWith('-'))
        return argv[flag + 1];
    return undefined;
}
export function apply(ctx, config) {
    ctx.inject(['webServer'], (hostCtx) => {
        const host = hostCtx;
        const resolved = {
            profile: config?.profile ?? argvProfile() ?? 'web',
            githubToken: config?.githubToken ?? process.env.DSHM_GITHUB_TOKEN ?? '',
            registryUrl: config?.registryUrl ?? process.env.DSH_STORE_REGISTRY_URL ?? '',
        };
        installMarketSettings(ctx, resolved);
        host.effect?.(() => mountMarketRoutes(host, resolved), 'dsh-store: http routes');
    });
}
