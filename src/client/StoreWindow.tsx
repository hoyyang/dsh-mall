/**
 * 独立浮窗入口 + find 工具结果浮窗。
 * - SidebarStoreButton: sidebar 底部「DSH 商场」按钮 → 全尺寸商场浮窗。
 * - StoreResultsLauncher: 全局点击拦截（/dsh-mall/open-results 链接，
 *   由 find_dsh_mall_plugin 工具输出）→ 打开「推荐 + 其他相关」结果浮窗，
 *   卡片样式与商场主页面一致（安装/源码/收藏星可用）。
 */

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { storeLang } from './locales.ts'
import { createPortal } from 'react-dom'
import { Button, IconCloseOutline16, IconGlobeOutline14, IconLoadingOutline16, IconSettingsOutline16, Menu, type MenuEntry } from '@deepseek-ai/dsh-client-ui-primitives'
import { MarketSection } from './MarketSection.tsx'
import { SettingsContent } from './SettingsWindow.tsx'
import type { MarketEntry } from './market-data.ts'
import { ICON_DATA } from './icon.ts'

interface LocaleLike {
  subscribe(callback: () => void): () => void
  getSnapshot(): { active: string }
}

// ---------------------------------------------------------------- 单例商场浮窗
// v1.7.5：无论从首页「DSH 商场」、设置页「打开 DSH 商场」还是结果浮窗进入，
// 商场浮窗都是同一个实例（StoreSingleton 挂载一次，keep-mounted）。
interface StoreState {
  mounted: boolean
  open: boolean
  /** 浮窗来源：sidebar=首页入口；settings=设置页「打开 DSH 商场」。 */
  source: 'sidebar' | 'settings' | null
  /** true=官方设置浮窗临时盖在商场浮窗上面（主浮窗不关闭，点「打开 DSH 商场」=关设置浮窗）。 */
  settingsOnTop: boolean
}
let storeState: StoreState = { mounted: false, open: false, source: null, settingsOnTop: false }
const storeListeners = new Set<() => void>()
function emitStore(): void { for (const l of storeListeners) l() }
export function openStoreFrom(source: 'sidebar' | 'settings'): void {
  storeState = { mounted: true, open: true, source, settingsOnTop: false }
  emitStore()
}
export function setStoreOpen(open: boolean): void {
  storeState = { ...storeState, open }
  emitStore()
}
export function setSettingsOnTop(onTop: boolean): void {
  storeState = { ...storeState, settingsOnTop: onTop }
  emitStore()
}
export function getStoreState(): StoreState { return storeState }
export function subscribeStore(fn: () => void): () => void {
  storeListeners.add(fn)
  return () => { storeListeners.delete(fn) }
}

/** 打开官方设置浮窗并自动定位到「DSH商场-设置」section（DOM 触发）。 */
function openSettingsAtStoreSection(): void {
  window.setTimeout(() => {
    const trigger = Array.from(document.querySelectorAll('button')).find(b => (b.textContent ?? '').trim() === '设置')
    trigger?.click()
    let tries = 0
    const timer = window.setInterval(() => {
      tries += 1
      const nav = Array.from(document.querySelectorAll('button')).find(b => (b.textContent ?? '').includes('DSH商场'))
      if (nav !== undefined) {
        nav.click()
        window.clearInterval(timer)
      } else if (tries > 25) {
        window.clearInterval(timer)
      }
    }, 200)
  }, 80)
}

/** 关闭官方设置浮窗（.VOzbGW_close）。 */
export function closeSettingsWindow(): void {
  const close = document.querySelector<HTMLElement>('.VOzbGW_close')
  if (close !== null) close.click()
}

/** 唯一商场浮窗宿主：订阅 store 状态，渲染同一个 StoreWindow 实例。 */
export function StoreSingleton(props: { t: (key: string) => string; locale: LocaleLike }) {
  const state = useSyncExternalStore(subscribeStore, () => storeState)
  // v1.7.53：商场 UI 语言切换时重渲染整个浮窗（含设置页/任务面板）
  useSyncExternalStore(cb => storeLang.subscribe(cb), () => storeLang.get())
  if (!state.mounted) return null
  return (
    <StoreWindow
      t={props.t}
      locale={props.locale}
      open={state.open}
      settingsOnTop={state.settingsOnTop}
      onClose={() => setStoreOpen(false)}
    />
  )
}

export function SidebarStoreButton(props: {
  wide: boolean
  t: (key: string) => string
  locale: LocaleLike
}) {
  // 首页侧边栏（设置按钮上方、平级对齐）「DSH 商场」→ 打开唯一商场浮窗。
  // 渲染由 StoreSingleton 统一承担（单例、keep-mounted）。
  // v1.7.56：订阅商场语言——切换后按钮文案即时更新
  useSyncExternalStore(cb => storeLang.subscribe(cb), () => storeLang.get())
  return (
    <button
      type="button"
      className={'pcm-sidebar-btn' + (props.wide ? '' : ' pcm-sidebar-rail')}
      title={props.t('nav')}
      onClick={() => openStoreFrom('sidebar')}
    >
      <img className="pcm-sidebar-icon" src={ICON_DATA} alt="" width={24} height={24} />
      <span className="pcm-sidebar-label">{props.t('nav')}</span>
    </button>
  )
}

/** 设置浮窗里的「DSH商场-设置」section：设置内容 + 顶部大按钮打开商场浮窗。 */
export function SettingsSection(props: {
  t: (key: string) => string
  locale: LocaleLike
}) {
  // v1.7.56：订阅商场语言——设置页随语言切换即时刷新（此前停留在旧语言）
  useSyncExternalStore(cb => storeLang.subscribe(cb), () => storeLang.get())
  const openStore = useCallback(() => {
    const st = getStoreState()
    if (st.mounted && st.source === 'sidebar') {
      // 首页路径（主浮窗先开、设置浮窗盖在上面）：「打开 DSH 商场」=关闭设置浮窗，
      // 商场浮窗恢复置顶（主浮窗从未关闭）。
      closeSettingsWindow()
      setSettingsOnTop(false)
      setStoreOpen(true)
    } else {
      openStoreFrom('settings')
    }
  }, [])
  return (
    <SettingsContent t={props.t} onOpenStore={openStore} />
  )
}

/** 全局点击拦截器：find 工具输出的按钮链接 → 结果浮窗；
 *  也监听 window 事件 'dsh-mall-open-results'（智能搜索直接带 payload 弹窗）。 */
export function StoreResultsLauncher(props: { t: (key: string) => string; locale: LocaleLike }) {
  // v1.7.53：UI 语言切换重渲染结果浮窗
  useSyncExternalStore(cb => storeLang.subscribe(cb), () => storeLang.get())
  const [token, setToken] = useState<string | null>(null)
  const [direct, setDirect] = useState<ResultsPayload | null>(null)
  const onClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement | null
    const anchor = target?.closest?.('a[href]') as HTMLAnchorElement | null
    if (anchor === null) return
    const href = anchor.getAttribute('href') ?? ''
    if (!href.includes('/dsh-mall/open-results')) return
    e.preventDefault()
    e.stopPropagation()
    const id = new URL(href, window.location.origin).searchParams.get('id')
    if (id !== null && id !== '') setToken(id)
  }, [])
  useEffect(() => {
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [onClick])
  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent).detail as { payload?: ResultsPayload } | undefined
      if (detail?.payload !== undefined && detail.payload !== null) {
        setToken(null)
        setDirect(detail.payload)
      }
    }
    window.addEventListener('dsh-mall-open-results', onOpen)
    return () => window.removeEventListener('dsh-mall-open-results', onOpen)
  }, [])
  const open = token !== null || direct !== null
  if (!open) return null
  return (
    <ResultsWindow
      t={props.t}
      locale={props.locale}
      token={token}
      initialPayload={direct}
      onClose={() => { setToken(null); setDirect(null) }}
    />
  )
}

export interface ResultsPayload {
  query: string
  recommended: MarketEntry[]
  related: MarketEntry[]
  categories?: Record<string, { en: string; zh: string }>
}

/** v1.7.4：#9 结果浮窗内嵌完整 MarketSection（seed=推荐+相关条目）——
 *  卡片内容/交互/功能与主商场浮窗完全一致（安装/卸载/更新/收藏/详情/任务）。 */
function ResultsWindow(props: {
  t: (key: string) => string
  locale: LocaleLike
  token: string | null
  initialPayload: ResultsPayload | null
  onClose: () => void
}) {
  const headActionsRef = useRef<HTMLDivElement | null>(null)
  const [payload, setPayload] = useState<ResultsPayload | null>(props.initialPayload)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    // 新的 direct payload（再次智能搜索）到达时刷新结果。
    if (props.initialPayload !== null) {
      setPayload(props.initialPayload)
      setFailed(false)
    }
  }, [props.initialPayload])
  // 语言按钮与主浮窗同款（样式/交互/持久化同 key），父组件控制并下传 langOverride。
  const LANGS = ['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ru'] as const
  const LANG_LABELS: Record<string, string> = { en: 'English', zh: '中文', ja: '日本語', ko: '한국어', es: 'Español', fr: 'Français', de: 'Deutsch', pt: 'Português', ru: 'Русский' }
  const LANG_SHORT: Record<string, string> = { en: 'EN', zh: '中文', ja: '日本語', ko: '한국어', es: 'ES', fr: 'FR', de: 'DE', pt: 'PT', ru: 'RU' }
  const [lang, setLang] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('dsh-mall-lang')
      if (saved !== null && (LANGS as readonly string[]).includes(saved)) return saved
    } catch { /* ignore */ }
    return 'en'
  })
  const [langOpen, setLangOpen] = useState(false)
  const langItems = useMemo<MenuEntry[]>(() => LANGS.map(l => ({ id: l, label: LANG_LABELS[l] ?? l })), [])
  // v1.7.84：结果浮窗语言切换必须同步模块 storeLang——t() 全部读模块 store，
  // 只改本窗 lang 状态会导致浮窗 UI 文案永远停在旧语言（截图双语对照发现的真 bug）。
  const setLangPersist = (l: string) => {
    setLang(l)
    storeLang.set(l === 'zh' ? 'zh' : 'en')
    try { localStorage.setItem('dsh-mall-lang', l) } catch { /* ignore */ }
  }
  const token = props.token
  useEffect(() => {
    if (token === null || props.initialPayload !== null) return
    let alive = true
    fetch('/dsh-mall/query-result?id=' + encodeURIComponent(token), { cache: 'no-store' })
      .then(res => res.json())
      .then((body: { ok?: boolean; payload?: ResultsPayload }) => {
        if (alive) {
          if (body.payload !== undefined) setPayload(body.payload)
          else setFailed(true)
        }
      })
      .catch(() => { if (alive) setFailed(true) })
    return () => { alive = false }
  }, [token, props.initialPayload])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') props.onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [props])
  const t = props.t
  return createPortal(
    <div className="pcm-store-overlay" style={{ zIndex: 1200 }}>
      <div className="pcm-store-mask" onClick={props.onClose} />
      <div className="pcm-store-window pcm-results-window" role="dialog" aria-modal="true" aria-label={t('resultsTitle')}>
        <div className="pcm-store-head pcm-store-head-dark">
          <div className="pcm-store-head-actions" ref={headActionsRef}>
            <Menu
              open={langOpen}
              onClose={() => setLangOpen(false)}
              onSelect={id => { setLangPersist(id); setLangOpen(false) }}
              align="end"
              anchor={(
                <button type="button" className={'pcm-lang-btn pcm-lang-btn-head' + (langOpen ? ' pcm-lang-btn-open' : '')} onClick={() => setLangOpen(o => !o)}>
                  <span className="pcm-lang-flag"><IconGlobeOutline14 size={12} /></span>
                  <span className="pcm-lang-label">{LANG_SHORT[lang] ?? lang.toUpperCase()}</span>
                  <span className="pcm-lang-caret" aria-hidden="true" />
                </button>
              )}
              items={langItems}
              selectedId={lang}
            />
          </div>
          <Button variant="ghost" size="sm" icon={<IconCloseOutline16 size={14} />} onClick={props.onClose} className="pcm-store-close" title={t('close')} />
        </div>
        <div className="pcm-store-body">
          {failed && <div className="pcm-empty">{t('resultsExpired')}</div>}
          {payload === null && !failed && (
            <div className="pcm-empty"><span className="pcm-spin"><IconLoadingOutline16 size={14} /></span> {t('loading')}</div>
          )}
          {payload !== null && (
            <MarketSection
              t={t}
              locale={props.locale}
              floating
              headRef={headActionsRef}
              langOverride={lang}
              seed={{
                plugins: [...payload.recommended, ...payload.related],
                categories: payload.categories ?? {},
                recommendedCount: payload.recommended.length,
              }}
            />
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}

function StoreWindow(props: {
  t: (key: string) => string
  locale: LocaleLike
  /** false = 隐藏但保持挂载（保留页面状态），true = 显示。 */
  open: boolean
  /** true=设置浮窗临时在上层（商场浮窗降到 z900 让位，但保持显示）。 */
  settingsOnTop: boolean
  onClose: () => void
}) {
  const headActionsRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!props.open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') props.onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [props.open, props])
  // v1.7.6：#2 交互修正——来源为设置页：设置按钮=关闭浮窗（设置浮窗在下面）；
  // 首页来源：主浮窗保持打开，设置浮窗盖到上面（商场浮窗 z 降到 900）。
  const onHeadSettings = useCallback(() => {
    const st = getStoreState()
    if (st.source === 'settings') {
      setStoreOpen(false)
    } else {
      setSettingsOnTop(true)
      openSettingsAtStoreSection()
    }
  }, [])
  return createPortal(
    <div
      className="pcm-store-overlay"
      // 默认 1000：与官方设置浮窗同级但 DOM 在其后（商场浮窗显示在上）；
      // settingsOnTop 时降到 900 让位。绝不高于 1000——否则 primitives Modal
      // （z1000）等弹层会被主浮窗盖住（“弹窗跑浮窗后面”的根因）。
      style={props.open ? { zIndex: props.settingsOnTop ? 900 : 1000 } : { display: 'none' }}
    >
      <div className="pcm-store-mask" onClick={props.onClose} />
      <div className="pcm-store-window" role="dialog" aria-label={props.t('nav')} aria-modal="true">
        <div className="pcm-store-head pcm-store-head-dark">
          <div className="pcm-store-head-actions" ref={headActionsRef} />
          <Button
            variant="ghost"
            size="sm"
            icon={<IconSettingsOutline16 size={15} />}
            onClick={onHeadSettings}
            className="pcm-store-head-settings"
            title={props.t('settingsNav')}
          />
          <Button variant="ghost" size="sm" icon={<IconCloseOutline16 size={14} />} onClick={props.onClose} className="pcm-store-close" title={props.t('close')} />
        </div>
        <div className="pcm-store-body">
          <MarketSection t={props.t} locale={props.locale} floating headRef={headActionsRef} />
        </div>
      </div>
    </div>,
    document.body,
  )
}
