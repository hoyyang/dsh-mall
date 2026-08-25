/**
 * DSH 商店设置页（v1.7.1）：作为官方「设置」浮窗里的一个 section 渲染
 * （不再是独立浮窗）。内容：
 * - 顶部大按钮「打开 DSH 商店」：打开独立商店浮窗；
 * - 自动一键更新插件开关（说明 + 风险警告 + 上次运行结果）；
 * - 数据源 URL / GitHub Token / 商店自身更新（设置功能载体）。
 */

import { useEffect, useState } from 'react'
import { Button, IconLoadingOutline16 } from '@deepseek-ai/dsh-client-ui-primitives'

interface AutoUpdateBody {
  enabled: boolean
  lastRunAt: string | null
  lastUpdated: number
  lastMessage: string | null
}

interface StatusBody {
  version?: string | null
  tokenConfigured?: boolean
  registryUrl?: string
  selfUpdate?: { from: string; to: string | null }
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString()
}

export function SettingsContent(props: {
  t: (key: string) => string
  onOpenStore: () => void
}) {
  const t = props.t
  const [auto, setAuto] = useState<AutoUpdateBody | null>(null)
  const [autoBusy, setAutoBusy] = useState(false)
  const [status, setStatus] = useState<StatusBody | null>(null)
  const [selfBusy, setSelfBusy] = useState(false)
  const [selfDone, setSelfDone] = useState(false)

  useEffect(() => {
    fetch('/dsh-store/status', { cache: 'no-store' })
      .then(res => res.json())
      .then((body: StatusBody) => {
        setStatus(body)
      })
      .catch(() => {})
    fetch('/dsh-store/auto-update', { cache: 'no-store' })
      .then(res => res.json())
      .then((body: { autoUpdate?: AutoUpdateBody }) => {
        if (body.autoUpdate !== undefined) setAuto(body.autoUpdate)
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleAuto = () => {
    if (auto === null || autoBusy) return
    const next = !auto.enabled
    setAutoBusy(true)
    fetch('/dsh-store/auto-update', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ enabled: next }),
    })
      .then(res => res.json())
      .then((body: { ok?: boolean; autoUpdate?: AutoUpdateBody }) => {
        if (body.autoUpdate !== undefined) setAuto(body.autoUpdate)
      })
      .catch(() => {})
      .finally(() => setAutoBusy(false))
  }

  const doSelfUpdate = () => {
    if (selfBusy || status?.selfUpdate?.to == null) return
    setSelfBusy(true)
    fetch('/dsh-store/self-update', { method: 'POST' })
      .then(res => res.json())
      .then((body: { ok?: boolean }) => { if (body.ok === true) setSelfDone(true) })
      .catch(() => {})
      .finally(() => setSelfBusy(false))
  }

  const lastRun = auto === null
    ? ''
    : auto.lastRunAt === null
      ? t('autoUpdateNever')
      : t('autoUpdateLastRun').replace('{0}', formatTime(auto.lastRunAt)).replace('{1}', auto.lastMessage ?? '')

  return (
    <div className="pcm-settings-body">
      <button type="button" className="pcm-settings-open-store" onClick={props.onOpenStore}>
        {t('openStoreBtn')}
        <span className="pcm-settings-open-store-hint">{t('openStoreHint')}</span>
      </button>

      <div className="pcm-settings-sec">
        <div className="pcm-auto-row">
          <span className="pcm-auto-label">{t('autoUpdateTitle')}</span>
          <label className="pcm-auto-switch" title={t('autoUpdateTitle')}>
            <input
              type="checkbox"
              checked={auto?.enabled === true}
              disabled={auto === null || autoBusy}
              onChange={toggleAuto}
            />
            <span className="pcm-auto-track" />
          </label>
        </div>
        <div className="pcm-settings-sec-desc">{t('autoUpdateDesc')}</div>
        <div className="pcm-settings-warn">{t('autoUpdateWarn')}</div>
        <div className="pcm-settings-note">
          {auto?.enabled === true ? t('autoUpdateOn') + ' · ' + lastRun : t('autoUpdateOff')}
        </div>
      </div>

      <div className="pcm-settings-sec">
        <div className="pcm-settings-sec-title">{t('settingsSelfUpdate')}</div>
        <div className="pcm-settings-note">{t('versionHint').replace('{0}', status?.version ?? '')}</div>
        {status?.selfUpdate?.to != null && !selfDone && (
          <Button variant="outline" size="sm" disabled={selfBusy} onClick={doSelfUpdate}>
            {selfBusy ? <span className="pcm-spin"><IconLoadingOutline16 size={14} /></span> : t('selfUpdateBtn').replace('{0}', status.selfUpdate.from).replace('{1}', status.selfUpdate.to)}
          </Button>
        )}
        {selfDone && <div className="pcm-settings-note">{t('selfUpdateDone') + ' ' + t('restartNeeded')}</div>}
      </div>
    </div>
  )
}
