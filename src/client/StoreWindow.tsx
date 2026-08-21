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
import { SettingsWindow } from './SettingsWindow.tsx'
import { avatarColor, formatStars, relativeFromNow, type MarketEntry } from './market-data.ts'
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
  // v1.7：侧边栏按钮改为「DSH 商店设置」→ 设置页浮窗；设置页顶部
  // 「打开 DSH 商店」按钮 → 商店浮窗（与原入口效果一致）。
  const [open, setOpen] = useState<'settings' | 'store' | null>(null)
  const button = (
    <button
      type="button"
      className={'pcm-sidebar-btn' + (props.wide ? '' : ' pcm-sidebar-rail')}
      title={props.t('settingsNav')}
      onClick={() => setOpen('settings')}
    >
      <img className="pcm-sidebar-icon" src={ICON_DATA} alt="" width={16} height={16} />
      <span className="pcm-sidebar-label">{props.t('settingsNav')}</span>
    </button>
  )
  return (
    <>
      {button}
      {open === 'settings' && (
        <SettingsWindow
          t={props.t}
          onClose={() => setOpen(null)}
          onOpenStore={() => setOpen('store')}
        />
      )}
      {open === 'store' && (
        <StoreWindow t={props.t} locale={props.locale} onClose={() => setOpen(null)} />
      )}
    </>
  )
}

/** 全局点击拦截器：find 工具输出的按钮链接 → 结果浮窗。 */
export function StoreResultsLauncher(props: { t: (key: string) => string; locale: LocaleLike }) {
  const [token, setToken] = useState<string | null>(null)
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
  return token !== null ? <ResultsWindow t={props.t} token={token} onClose={() => setToken(null)} /> : null
}

function ResultsWindow(props: { t: (key: string) => string; token: string; onClose: () => void }) {
  const [payload, setPayload] = useState<{ query: string; recommended: MarketEntry[]; related: MarketEntry[] } | null>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    let alive = true
    fetch('/dsh-store/query-result?id=' + encodeURIComponent(props.token), { cache: 'no-store' })
      .then(res => res.json())
      .then((body: { ok?: boolean; payload?: { query: string; recommended: MarketEntry[]; related: MarketEntry[] } }) => {
        if (alive) {
          if (body.payload !== undefined) setPayload(body.payload)
          else setFailed(true)
        }
      })
      .catch(() => { if (alive) setFailed(true) })
    return () => { alive = false }
  }, [props.token])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') props.onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [props])
  const t = props.t
  return createPortal(
    <div className="pcm-store-overlay">
      <div className="pcm-store-mask" onClick={props.onClose} />
      <div className="pcm-store-window pcm-results-window" role="dialog" aria-modal="true" aria-label={t('nav')}>
        <div className="pcm-store-head">
          <img className="pcm-sidebar-icon" src={ICON_DATA} alt="" width={16} height={16} />
          <span className="pcm-store-head-title">{t('resultsTitle')}{payload !== null ? ' · ' + payload.query : ''}</span>
          <Button variant="ghost" size="sm" icon={<IconCloseOutline16 size={14} />} onClick={props.onClose} className="pcm-store-close" title={t('close')} />
        </div>
        <div className="pcm-store-body pcm-results-body">
          {failed && <div className="pcm-empty">{t('resultsExpired')}</div>}
          {payload === null && !failed && (
            <div className="pcm-empty"><span className="pcm-spin"><IconLoadingOutline16 size={14} /></span> {t('loading')}</div>
          )}
          {payload !== null && (
            <div className="pcm-results-scroll">
              <div className="pcm-results-sec-title">{t('resultsRecommended')}</div>
              <div className="pcm-grid">
                {payload.recommended.map((entry, i) => <ResultCard key={'rec' + i} t={t} entry={entry} />)}
              </div>
              {payload.related.length > 0 && (
                <>
                  <div className="pcm-results-sec-title">{t('resultsRelated')}</div>
                  <div className="pcm-grid">
                    {payload.related.map((entry, i) => <ResultCard key={'rel' + i} t={t} entry={entry} />)}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}

/** 与主页面卡片同款的结果卡片（安装/源码可用）。 */
function ResultCard(props: { t: (key: string) => string; entry: MarketEntry }) {
  const t = props.t
  const entry = props.entry
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  useEffect(() => {
    if (toast === null) return
    const timer = setTimeout(() => setToast(null), 5000)
    return () => clearTimeout(timer)
  }, [toast])
  const install = () => {
    if (busy) return
    setBusy(true)
    fetch('/dsh-store/install', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ repo: entry.owner + '/' + entry.name, npm: entry.npm }),
    })
      .then(res => res.json())
      .then((body: { ok?: boolean; message?: string; error?: string }) => {
        setToast(body.ok === true ? t('installDone') : t('installFailed') + ': ' + (body.message ?? body.error ?? ''))
      })
      .catch(() => setToast(t('installFailed')))
      .finally(() => setBusy(false))
  }
  return (
    <div className="pcm-card">
      <div className="pcm-card-top">
        <div className="pcm-av" style={{ background: avatarColor(entry.name) }}>
          {(entry.name.replace(/^dsh[-_]/i, '').charAt(0) || 'P').toUpperCase()}
          {entry.avatar !== '' && (
            <img className="pcm-av-img" src={entry.avatar} alt="" loading="lazy" onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
          )}
        </div>
        <div className="pcm-card-title">
          <span className="pcm-name">{entry.name}</span>
          <span className="pcm-owner">{entry.owner}</span>
        </div>
        <div className="pcm-actions" onClick={e => e.stopPropagation()}>
          <Button variant="primary" size="sm" disabled={busy} onClick={install}>
            {busy ? <span className="pcm-spin"><IconLoadingOutline16 size={14} /></span> : t('install')}
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.open(entry.url, '_blank', 'noopener')}>
            {t('sourceBtn')}
          </Button>
        </div>
      </div>
      {(entry.curated || entry.verified != null) && (
        <div className="pcm-safety-row">
          {entry.curated && <span className="pcm-safety pcm-safety-curated" title={t('curatedBadgeTitle')}>⚑ {t('curatedBadge')}</span>}
          {entry.verified != null && <span className="pcm-safety pcm-safety-verified" title={t('verifiedBadgeHint') + ' · ' + entry.verified.by}>✓ {t('verifiedBadge')}</span>}
        </div>
      )}
      <div className="pcm-desc">{entry.description === '' ? '—' : entry.description}</div>
      <div className="pcm-foot">
        <div className="pcm-stats">
          <span className="pcm-stars">★ {formatStars(entry.stars)}</span>
          <span className="pcm-cat">{entry.category}</span>
          <span className="pcm-updated">{t('updatedShort') + ' ' + relativeFromNow(entry.pushed, t)}</span>
        </div>
      </div>
      {toast !== null && (
        <div className="pcm-toast">{toast}</div>
      )}
    </div>
  )
}

function StoreWindow(props: {
  t: (key: string) => string
  locale: LocaleLike
  onClose: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') props.onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [props])
  return createPortal(
    <div className="pcm-store-overlay">
      <div className="pcm-store-mask" onClick={props.onClose} />
      <div className="pcm-store-window" role="dialog" aria-label={props.t('nav')} aria-modal="true">
        <div className="pcm-store-head">
          <img className="pcm-sidebar-icon" src={ICON_DATA} alt="" width={16} height={16} />
          <span className="pcm-store-head-title">{props.t('nav')}</span>
          <Button variant="ghost" size="sm" icon={<IconCloseOutline16 size={14} />} onClick={props.onClose} className="pcm-store-close" title={props.t('close')} />
        </div>
        <div className="pcm-store-body">
          <MarketSection t={props.t} locale={props.locale} />
        </div>
      </div>
    </div>,
    document.body,
  )
}
