/**
 * The market's own settings namespace: exposes the GitHub token as a field
 * on the plugin configuration page (dsh >= rc.7). The routes read the live
 * object on every request, so a saved change applies immediately. The token
 * is memory-only: never persisted, never logged, never sent back.
 */

import type { Context } from '@deepseek-ai/cordis'
import { installSettingsSection, settingsNamespace } from '@deepseek-ai/dsh-settings'
import z from '@deepseek-ai/schemastery'

export const MARKET_SETTINGS_NS = settingsNamespace('dsh-store')

export interface MarketSettings {
  githubToken: string
}

export const MarketSettings: z<MarketSettings> = z.object({
  githubToken: z.string().default(''),
})

export function installMarketSettings(ctx: Context, resolved: { githubToken?: string }): void {
  const entry = { githubToken: resolved.githubToken ?? '' }
  let source = (): MarketSettings => entry
  installSettingsSection(
    ctx,
    MARKET_SETTINGS_NS,
    MarketSettings,
    entry,
    {
      setSource: (current) => { source = current },
      onChange: () => { resolved.githubToken = source().githubToken },
    },
  )
}
