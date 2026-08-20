/**
 * 独立浮窗入口：sidebar 底部「DSH 商店」按钮 → 与设置浮窗同款
 * （居中圆角卡片 + 毛玻璃遮罩）的全尺寸商店浮窗，MarketSection 占满整个
 * 浮窗内容区。Escape / 遮罩点击 / 关闭按钮均可关闭。
 */

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button, IconCheckOutline16 } from '@deepseek-ai/dsh-client-ui-primitives'
import { MarketSection } from './MarketSection.tsx'
import { ICON_DATA } from './icon.ts'

export function SidebarStoreButton(props: {
  wide: boolean
  t: (key: string) => string
  locale: { subscribe(callback: () => void): () => void; getSnapshot(): { active: string } }
}) {
  const [open, setOpen] = useState(false)
  const button = (
    <button
      type="button"
      className={'pcm-sidebar-btn' + (props.wide ? '' : ' pcm-sidebar-rail')}
      title={props.t('nav')}
      onClick={() => setOpen(true)}
    >
      <img className="pcm-sidebar-icon" src={ICON_DATA} alt="" width={18} height={18} />
      <span className="pcm-sidebar-label">{props.t('nav')}</span>
    </button>
  )
  return (
    <>
      {button}
      {open && (
        <StoreWindow t={props.t} locale={props.locale} onClose={() => setOpen(false)} />
      )}
    </>
  )
}

function StoreWindow(props: {
  t: (key: string) => string
  locale: { subscribe(callback: () => void): () => void; getSnapshot(): { active: string } }
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
          <img className="pcm-sidebar-icon" src={ICON_DATA} alt="" width={18} height={18} />
          <span className="pcm-store-head-title">{props.t('nav')}</span>
          <Button variant="ghost" size="sm" icon={<IconCheckOutline16 size={14} />} onClick={props.onClose} className="pcm-store-close" title={props.t('close')} />
        </div>
        <div className="pcm-store-body">
          <MarketSection t={props.t} locale={props.locale} />
        </div>
      </div>
    </div>,
    document.body,
  )
}
