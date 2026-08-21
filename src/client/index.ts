/**
 * dsh-store client: registers the "DSH Plugin Market" settings
 * section plus the plugin-configuration card (GitHub token, dsh >= rc.7).
 * Built by tsdown into lib/client.js; react and the primitives module are
 * resolved through the loader module table at runtime.
 */

import { createElement as h } from 'react'
import { createRoot } from 'react-dom/client'
import * as primitives from '@deepseek-ai/dsh-client-ui-primitives'
import { en, zh } from './locales.ts'
import { SettingsCard } from './SettingsCard.tsx'
import { SettingsSection, SidebarStoreButton, StoreResultsLauncher } from './StoreWindow.tsx'
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

  // find 工具结果浮窗：全局 React 根 + 点击拦截（按钮链接 → 结果浮窗）。
  ctx.effect(() => {
    const mount = document.createElement('div')
    mount.id = 'dsh-store-launcher'
    document.body.appendChild(mount)
    const root = createRoot(mount)
    root.render(h(StoreResultsLauncher, { t, locale: ctx.locale }))
    return () => {
      root.unmount()
      mount.remove()
    }
  }, NS + ': results launcher')

  // 官方设置浮窗里的「DSH 商店设置」section（v1.7.1 布局纠正）：
  // 点击显示 DSH 商店设置页（顶部大按钮可打开商店浮窗），不再直接渲染商店。
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'plugin-market',
    order: 45,
    label: () => t('settingsNav'),
    locale: NS,
    inject: () => ({ t }),
  }, () => h(SettingsSection, {
    t,
    locale: ctx.locale,
  })))

  // 首页侧边栏底部（设置按钮上方）：「DSH 商店」入口按钮 → 独立浮窗。
  // sidebar.footer.action 是 list slot（官方 sidebar 契约，owner props 带
  // wide）；注册失败（老宿主没有该 slot）时静默跳过，不影响设置内入口。
  ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
    name: 'sidebar.footer.action',
    id: 'dsh-store',
    order: 10,
    locale: NS,
  }, ((props?: { wide?: boolean }) => h(SidebarStoreButton, {
    wide: props?.wide === true,
    t,
    locale: ctx.locale,
  })) as unknown as () => unknown))

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
