/**
 * The market's card on the plugin configuration page (dsh >= rc.7). The
 * host-side settings namespace also registers githubToken for hosts whose
 * settings page renders namespace forms; this card is our own chrome for
 * every host: current token status + a memory-only token input.
 */

import { useEffect, useState } from 'react'
import { Button, DisclosureRow, Input, IconSettingsOutline16 } from '@deepseek-ai/dsh-client-ui-primitives'

interface CardStatus {
  tokenConfigured: boolean
  version: string | null
  registryUrl: string
}

export function SettingsCard(props: { t: (key: string) => string }) {
  const t = props.t
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<CardStatus | null>(null)
  const [token, setToken] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [registryUrl, setRegistryUrl] = useState('')
  const [sourceSaving, setSourceSaving] = useState(false)
  const [sourceSaved, setSourceSaved] = useState(false)

  useEffect(() => {
    if (!open) return
    fetch('/dsh-store/status', { cache: 'no-store' })
      .then(res => res.json())
      .then((body: { tokenConfigured?: boolean; version?: string; registryUrl?: string }) => {
        setStatus({ tokenConfigured: body.tokenConfigured === true, version: body.version ?? null, registryUrl: body.registryUrl ?? '' })
      })
      .catch(() => {})
  }, [open, saved])

  const saveSource = () => {
    setSourceSaving(true)
    setSourceSaved(false)
    fetch('/dsh-store/source', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ url: registryUrl.trim() }),
    })
      .then(res => res.json())
      .then((body: { ok?: boolean; registryUrl?: string }) => {
        if (body.ok === true) {
          setStatus(s => s === null ? null : { ...s, registryUrl: body.registryUrl ?? '' })
          setSourceSaved(true)
        }
      })
      .catch(() => {})
      .finally(() => setSourceSaving(false))
  }

  const save = () => {
    if (token.trim() === '') return
    setSaving(true)
    setSaved(false)
    fetch('/dsh-store/token', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token: token.trim() }),
    })
      .then(res => res.json())
      .then((body: { ok?: boolean }) => {
        if (body.ok === true) {
          setSaved(true)
          setToken('')
        }
      })
      .catch(() => {})
      .finally(() => setSaving(false))
  }

  return (
    <DisclosureRow
      icon={<IconSettingsOutline16 size={14} />}
      title={t('title') + (status?.tokenConfigured === true ? ' · ' + t('tokenConfigured') : '')}
      open={open}
      expandable
      onToggle={() => setOpen(o => !o)}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '4px 0 8px' }}>
        <Input
          type="password"
          autoComplete="off"
          value={token}
          placeholder={t('tokenPlaceholder')}
          onChange={e => setToken(e.target.value)}
        />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Button variant="primary" size="sm" disabled={saving || token.trim() === ''} onClick={save}>
            {t('tokenSave')}
          </Button>
          {saved && <span style={{ fontSize: 12, color: '#22c55e' }}>{t('tokenSaved')}</span>}
        </div>
        <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.5 }}>{t('tokenHint')}</div>
        <div style={{ borderTop: '1px solid rgba(128,128,128,.2)', margin: '2px 0' }} />
        <Input
          autoComplete="off"
          value={registryUrl}
          placeholder={t('sourcePlaceholder')}
          onChange={e => setRegistryUrl(e.target.value)}
        />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Button variant="primary" size="sm" disabled={sourceSaving} onClick={saveSource}>
            {t('sourceSave')}
          </Button>
          {sourceSaved && <span style={{ fontSize: 12, color: '#22c55e' }}>{t('sourceSaved')}</span>}
        </div>
        {status !== null && status.registryUrl !== '' && (
          <div style={{ fontSize: 12, opacity: 0.75, wordBreak: 'break-all' }}>{t('sourceCurrent') + ': ' + status.registryUrl}</div>
        )}
        <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.5 }}>{t('sourceHint')}</div>
      </div>
    </DisclosureRow>
  )
}
