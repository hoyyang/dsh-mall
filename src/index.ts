/**
 * dsh-store host entry: mounts the market's HTTP routes once the
 * profile composes the webServer service, and registers the settings
 * namespace for the GitHub token (rc.7+ hosts).
 */

import type { Context } from '@deepseek-ai/cordis'
import { mountMarketRoutes, type MarketHost } from './routes.ts'
import { installMarketSettings } from './settings.ts'
import type { MarketConfig } from './types.ts'

export const name = 'dsh-store'

/** Optional cordis.yml configuration; the profile defaults to \`web\`. */
export type Config = Partial<Pick<MarketConfig, 'profile' | 'githubToken'>>

function argvProfile(): string | undefined {
  const argv = process.argv
  const flag = argv.indexOf('--profile')
  if (flag !== -1 && flag + 1 < argv.length && !argv[flag + 1]!.startsWith('-')) return argv[flag + 1]
  return undefined
}

export function apply(ctx: Context, config?: Config): void {
  ctx.inject(['webServer'], (hostCtx: Context) => {
    const host = hostCtx as unknown as MarketHost
    const resolved: MarketConfig = {
      profile: config?.profile ?? argvProfile() ?? 'web',
      githubToken: config?.githubToken ?? process.env.DSHM_GITHUB_TOKEN ?? '',
    }
    installMarketSettings(ctx, resolved)
    host.effect?.(() => mountMarketRoutes(host, resolved), 'dsh-store: http routes')
  })
}
