/**
 * dsh-store client: registers the "DSH Plugin Market" settings
 * section plus the plugin-configuration card (GitHub token, dsh >= rc.7).
 * Built by tsdown into lib/client.js; react and the primitives module are
 * resolved through the loader module table at runtime.
 */

import { createElement as h } from 'react'
import * as primitives from '@deepseek-ai/dsh-client-ui-primitives'
import { en, zh } from './locales.ts'
import { MarketSection } from './MarketSection.tsx'
import { SettingsCard } from './SettingsCard.tsx'
import { injectStyles } from './styles.ts'

const NS = 'dsh-store'

export const REQUIRED_PRIMITIVES = ['Menu', 'Modal', 'Tooltip', 'Toast', 'Pill', 'Button', 'Input'] as const

export function missingPrimitives(mod: Record<string, unknown>, required: readonly string[] = REQUIRED_PRIMITIVES): string[] {
  return required.filter(name => mod[name] === undefined)
}

interface LocaleService {
  register(namespace: string, dicts: { zh: Record<string, string>; en: Record<string, string> }): unknown
  bind(namespace: string): (key: string) => string
  subscribe(callback: () => void): () => void
  getSnapshot(): { active: string }
}

interface SlotsService {
  inject(slot: string, register: () => unknown): void
  register(meta: Record<string, unknown>, component: () => unknown): unknown
}

interface MarketClientContext {
  effect(callback: () => unknown, label?: string): void
  locale: LocaleService
  slots: SlotsService
}

export const name = NS
export const inject = ['slots', 'locale']

export function apply(ctx: MarketClientContext): void {
  const gaps = missingPrimitives(primitives as unknown as Record<string, unknown>)
  if (gaps.length > 0) {
    console.warn('[dsh-store] host ui-primitives missing ' + gaps.join(', ') + ' — market section disabled (dsh web >= 0.1.0-rc.6 required)')
    return
  }

  ctx.effect(() => ctx.locale.register(NS, { zh, en }), NS + ': dictionaries')
  const t = ctx.locale.bind(NS)
  injectStyles()

  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'plugin-market',
    order: 45,
    label: () => t('nav'),
    locale: NS,
    inject: () => ({ t }),
  }, () => h(MarketSection, {
    t,
    locale: ctx.locale,
  })))

  // Settings card (dsh >= rc.7): nested inject so older hosts simply skip it.
  const settingsCtx = ctx as unknown as {
    inject(services: string[], callback: (scoped: { slots: SlotsService }) => void): void
  }
  settingsCtx.inject(['settingsScope'], (scoped) => {
    scoped.slots.inject('settings.plugin.item', () => scoped.slots.register({
      name: 'settings.plugin.item',
      key: NS,
      locale: NS,
      inject: () => ({ t }),
    }, () => h(SettingsCard, { t })))
  })
}
