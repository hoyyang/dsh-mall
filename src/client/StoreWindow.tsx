/**
 * 独立浮窗入口 + find 工具结果浮窗。
 * - SidebarStoreButton: sidebar 底部「DSH 商店」按钮 → 全尺寸商店浮窗。
 * - StoreResultsLauncher: 全局点击拦截（/dsh-store/open-results 链接，
 *   由 find_dsh_store_plugin 工具输出）→ 打开「推荐 + 其他相关」结果浮窗，
 *   卡片样式与商店主页面一致（安装/源码/收藏星可用）。
 */

import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button, IconCloseOutline16, IconLoadingOutline16 } from '@deepseek-ai/dsh-client-ui-primitives'
import { MarketSection } from './MarketSection.tsx'
import { SettingsContent } from './SettingsWindow.tsx'
import type { MarketEntry } from './market-data.ts'
import { ICON_DATA } from './icon.ts'

interface LocaleLike {
  subscribe(callback: () => void): () => void
  getSnapshot(): { active: string }
}

export function SidebarStoreButton(props: {
  wide: boolean
  t: (key: string) => string
  locale: LocaleLike
}) {
  // v1.7.1 布局纠正：首页侧边栏（设置按钮上方、平级对齐）就是
  // 「DSH 商店」入口 → 点击直接打开商店浮窗；「DSH 商店设置」入口
  // 在官方设置浮窗里（settings.section，见 client/index.ts）。
  // v1.7.2：窗口 keep-mounted——关闭只是隐藏，再打开恢复页面状态。
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const button = (
    <button
      type="button"
      className={'pcm-sidebar-btn' + (props.wide ? '' : ' pcm-sidebar-rail')}
      title={props.t('nav')}
      onClick={() => { setMounted(true); setOpen(true) }}
    >
      <img className="pcm-sidebar-icon" src={ICON_DATA} alt="" width={16} height={16} />
      <span className="pcm-sidebar-label">{props.t('nav')}</span>
    </button>
  )
  return (
    <>
      {button}
      {mounted && (
        <StoreWindow t={props.t} locale={props.locale} open={open} onClose={() => setOpen(false)} />
      )}
    </>
  )
}

/** 设置浮窗里的「DSH 商店设置」section：设置内容 + 顶部大按钮打开商店浮窗。 */
export function SettingsSection(props: {
  t: (key: string) => string
  locale: LocaleLike
}) {
  const [storeOpen, setStoreOpen] = useState(false)
  const [storeMounted, setStoreMounted] = useState(false)
  return (
    <>
      <SettingsContent t={props.t} onOpenStore={() => { setStoreMounted(true); setStoreOpen(true) }} />
      {storeMounted && (
        <StoreWindow t={props.t} locale={props.locale} open={storeOpen} onClose={() => setStoreOpen(false)} />
      )}
    </>
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
      <div className="pcm-store-window" role="dialog" aria-modal="true" aria-label={t('resultsTitle')}>
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
  return createPortal(
    <div className="pcm-store-overlay" style={props.open ? undefined : { display: 'none' }}>
      <div className="pcm-store-mask" onClick={props.onClose} />
      <div className="pcm-store-window" role="dialog" aria-label={props.t('nav')} aria-modal="true">
        <div className="pcm-store-head">
          <img className="pcm-sidebar-icon" src={ICON_DATA} alt="" width={16} height={16} />
          <span className="pcm-store-head-title">{props.t('nav')}</span>
          <div className="pcm-store-head-actions" />
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
