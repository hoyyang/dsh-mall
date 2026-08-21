/**
 * 独立浮窗入口 + find 工具结果浮窗。
 * - SidebarStoreButton: sidebar 底部「DSH 商店」按钮 → 全尺寸商店浮窗。
 * - StoreResultsLauncher: 全局点击拦截（/dsh-store/open-results 链接，
 *   由 find_dsh_store_plugin 工具输出）→ 打开「推荐 + 其他相关」结果浮窗，
 *   卡片样式与商店主页面一致（安装/源码/收藏星可用）。
 */

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { Button, IconCloseOutline16, IconLoadingOutline16, IconSettingsOutline16 } from '@deepseek-ai/dsh-client-ui-primitives'
import { MarketSection } from './MarketSection.tsx'
import { SettingsContent } from './SettingsWindow.tsx'
import type { MarketEntry } from './market-data.ts'
import { ICON_DATA } from './icon.ts'

interface LocaleLike {
  subscribe(callback: () => void): () => void
  getSnapshot(): { active: string }
}

// ---------------------------------------------------------------- 单例商店浮窗
// v1.7.5：无论从首页「DSH 商店」、设置页「打开 DSH 商店」还是结果浮窗进入，
// 商店浮窗都是同一个实例（StoreSingleton 挂载一次，keep-mounted）。
interface StoreState {
  mounted: boolean
  open: boolean
  /** 浮窗来源：sidebar=首页入口；settings=设置页「打开 DSH 商店」。 */
  source: 'sidebar' | 'settings' | null
}
let storeState: StoreState = { mounted: false, open: false, source: null }
const storeListeners = new Set<() => void>()
function emitStore(): void { for (const l of storeListeners) l() }
export function openStoreFrom(source: 'sidebar' | 'settings'): void {
  storeState = { mounted: true, open: true, source }
  emitStore()
}
export function setStoreOpen(open: boolean): void {
  storeState = { ...storeState, open }
  emitStore()
}
export function getStoreState(): StoreState { return storeState }
export function subscribeStore(fn: () => void): () => void {
  storeListeners.add(fn)
  return () => { storeListeners.delete(fn) }
}

/** 打开官方设置浮窗并自动定位到「DSH商店-设置」section（DOM 触发）。 */
function openSettingsAtStoreSection(): void {
  window.setTimeout(() => {
    const trigger = Array.from(document.querySelectorAll('button')).find(b => (b.textContent ?? '').trim() === '设置')
    trigger?.click()
    let tries = 0
    const timer = window.setInterval(() => {
      tries += 1
      const nav = Array.from(document.querySelectorAll('button')).find(b => (b.textContent ?? '').includes('DSH商店'))
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

/** 唯一商店浮窗宿主：订阅 store 状态，渲染同一个 StoreWindow 实例。 */
export function StoreSingleton(props: { t: (key: string) => string; locale: LocaleLike }) {
  const state = useSyncExternalStore(subscribeStore, () => storeState)
  if (!state.mounted) return null
  return (
    <StoreWindow
      t={props.t}
      locale={props.locale}
      open={state.open}
      onClose={() => setStoreOpen(false)}
    />
  )
}

export function SidebarStoreButton(props: {
  wide: boolean
  t: (key: string) => string
  locale: LocaleLike
}) {
  // 首页侧边栏（设置按钮上方、平级对齐）「DSH 商店」→ 打开唯一商店浮窗。
  // 渲染由 StoreSingleton 统一承担（单例、keep-mounted）。
  return (
    <button
      type="button"
      className={'pcm-sidebar-btn' + (props.wide ? '' : ' pcm-sidebar-rail')}
      title={props.t('nav')}
      onClick={() => openStoreFrom('sidebar')}
    >
      <img className="pcm-sidebar-icon" src={ICON_DATA} alt="" width={16} height={16} />
      <span className="pcm-sidebar-label">{props.t('nav')}</span>
    </button>
  )
}

/** 设置浮窗里的「DSH商店-设置」section：设置内容 + 顶部大按钮打开商店浮窗。 */
export function SettingsSection(props: {
  t: (key: string) => string
  locale: LocaleLike
}) {
  const openStore = useCallback(() => {
    const st = getStoreState()
    if (st.mounted && st.source === 'sidebar') {
      // 首页路径：商店浮窗就在设置浮窗下面——关掉设置浮窗露出它。
      closeSettingsWindow()
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
 *  也监听 window 事件 'dsh-store-open-results'（智能搜索直接带 payload 弹窗）。 */
export function StoreResultsLauncher(props: { t: (key: string) => string; locale: LocaleLike }) {
  const [token, setToken] = useState<string | null>(null)
  const [direct, setDirect] = useState<ResultsPayload | null>(null)
  const onClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement | null
    const anchor = target?.closest?.('a[href]') as HTMLAnchorElement | null
    if (anchor === null) return
    const href = anchor.getAttribute('href') ?? ''
    if (!href.includes('/dsh-store/open-results')) return
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
    window.addEventListener('dsh-store-open-results', onOpen)
    return () => window.removeEventListener('dsh-store-open-results', onOpen)
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
 *  卡片内容/交互/功能与主商店浮窗完全一致（安装/卸载/更新/收藏/详情/任务）。 */
function ResultsWindow(props: {
  t: (key: string) => string
  locale: LocaleLike
  token: string | null
  initialPayload: ResultsPayload | null
  onClose: () => void
}) {
  const [payload, setPayload] = useState<ResultsPayload | null>(props.initialPayload)
  const [failed, setFailed] = useState(false)
  const token = props.token
  useEffect(() => {
    if (token === null || props.initialPayload !== null) return
    let alive = true
    fetch('/dsh-store/query-result?id=' + encodeURIComponent(token), { cache: 'no-store' })
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
    <div className="pcm-store-overlay">
      <div className="pcm-store-mask" onClick={props.onClose} />
      <div className="pcm-store-window pcm-results-window" role="dialog" aria-modal="true" aria-label={t('resultsTitle')}>
        <div className="pcm-store-head">
          <img className="pcm-sidebar-icon" src={ICON_DATA} alt="" width={16} height={16} />
          <span className="pcm-store-head-title">{t('resultsTitle')}{payload !== null ? ' · ' + payload.query : ''}</span>
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
              seed={{
                plugins: [...payload.recommended, ...payload.related],
                categories: payload.categories ?? {},
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
  onClose: () => void
}) {
  useEffect(() => {
    if (!props.open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') props.onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [props.open, props])
  // v1.7.5：#3 头行设置按钮——来源为设置页时直接关浮窗（露出设置浮窗）；
  // 首页来源时隐藏浮窗并打开官方设置浮窗定位到「DSH商店-设置」。
  const onHeadSettings = useCallback(() => {
    const st = getStoreState()
    if (st.source === 'settings') {
      setStoreOpen(false)
    } else {
      setStoreOpen(false)
      openSettingsAtStoreSection()
    }
  }, [])
  return createPortal(
    <div className="pcm-store-overlay" style={props.open ? undefined : { display: 'none' }}>
      <div className="pcm-store-mask" onClick={props.onClose} />
      <div className="pcm-store-window" role="dialog" aria-label={props.t('nav')} aria-modal="true">
        <div className="pcm-store-head">
          <img className="pcm-sidebar-icon" src={ICON_DATA} alt="" width={16} height={16} />
          <span className="pcm-store-head-title">{props.t('nav')}</span>
          <div className="pcm-store-head-actions" />
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
          <MarketSection t={props.t} locale={props.locale} floating />
        </div>
      </div>
    </div>,
    document.body,
  )
}
