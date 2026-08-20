/**
 * The market settings section: category chips, search, sort, filters, the
 * repo grid with install/uninstall, and the publish dialog. All filtering
 * and sorting run on the in-memory list; the network is only touched on
 * mount, explicit refresh, and the quiet refresh after filter changes.
 */

import {
  useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore,
} from 'react'
import {
  Button,
  IconCheckOutline16,
  IconCopyOutline16,
  IconLoadingOutline16,
  IconRefreshOutline14,
  IconSearchOutline16,
  IconSendOutline16,
  Input,
  Menu,
  Modal,
  Pill,
  Tooltip,
  type MenuEntry,
} from '@deepseek-ai/dsh-client-ui-primitives'
import {
  avatarColor, durationBetween, formatStars, orderedCategories, pageItems,
  relativeFromNow, visiblePlugins,
  type MarketEntry, type PluginKind, type Registry, type SortKey,
} from './market-data.ts'
import { ICON_DATA } from './icon.ts'

const PAGE_SIZES = [24, 48, 96]

interface SectionProps {
  t: (key: string) => string
  locale: {
    subscribe(callback: () => void): () => void
    getSnapshot(): { active: string }
  }
}

interface StatusBody {
  version?: string | null
  refreshing?: boolean
  progress?: { shard?: number; shards?: number; repos?: number; lastError?: string | null }
  install?: { active?: boolean; kind?: string | null; target?: string | null; line?: string | null; lastResult?: { ok: boolean; message: string } | null }
  installed?: Record<string, string>
  bundles?: string[]
  tokenConfigured?: boolean
  rateLimit?: { remaining?: number; reset?: number } | null
}

export function MarketSection(props: SectionProps) {
  const t = props.t
  const localeSnap = useSyncExternalStore(
    cb => props.locale.subscribe(cb),
    () => props.locale.getSnapshot(),
  )
  const lang = String(localeSnap.active).toLowerCase().startsWith('zh') ? 'zh' : 'en'

  const [data, setData] = useState<Registry | null>(null)
  const [fetchAt, setFetchAt] = useState<string | null>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const chipsRef = useRef<HTMLDivElement | null>(null)
  const [catsClamped, setCatsClamped] = useState(true)
  const [hiddenCatCount, setHiddenCatCount] = useState(0)
  const categoriesRef = useRef<string[]>([])
  const [loadError, setLoadError] = useState(false)
  const [status, setStatus] = useState<StatusBody | null>(null)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const [kind, setKind] = useState<PluginKind>('all')
  const [curatedOnly, setCuratedOnly] = useState(false)
  const [installedOnly, setInstalledOnly] = useState(false)
  const [sort, setSort] = useState<SortKey>('stars-desc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(24)
  const [sortOpen, setSortOpen] = useState(false)
  const [sizeOpen, setSizeOpen] = useState(false)
  const [confirming, setConfirming] = useState<MarketEntry | null>(null)
  const [removing, setRemoving] = useState<MarketEntry | null>(null)
  const [publishOpen, setPublishOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [verifyBusy, setVerifyBusy] = useState(false)

  const refreshing = status?.refreshing === true
  const installing = status?.install?.active === true

  const fetchRegistry = useCallback((force: boolean) => {
    fetch('/dsh-store/registry' + (force ? '?force=1' : ''), { cache: 'no-store' })
      .then(res => { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json() })
      .then((body: { registry?: Registry; refreshing?: boolean; fetchAt?: string }) => {
        if (body.registry !== undefined) setData(body.registry)
        if (body.fetchAt !== undefined) setFetchAt(body.fetchAt)
        setLoadError(false)
      })
      .catch(() => setLoadError(true))
  }, [])

  const fetchStatus = useCallback(() => {
    fetch('/dsh-store/status', { cache: 'no-store' })
      .then(res => res.json())
      .then((body: StatusBody) => setStatus(body))
      .catch(() => {})
  }, [])

  // Mount: refresh immediately, then every 30 minutes while the section is open.
  useEffect(() => {
    fetchRegistry(true)
    fetchStatus()
    const timer = setInterval(() => { fetchRegistry(true); fetchStatus() }, 30 * 60 * 1000)
    return () => clearInterval(timer)
  }, [fetchRegistry, fetchStatus])

  // Panel-height lock: the root fills the settings panel's visible area so
  // the catalog list scrolls INSIDE the section (header and pager stay put,
  // and the scrollbar covers exactly the scrollable list region).
  useLayoutEffect(() => {
    const root = rootRef.current
    if (root === null) return
    const update = () => {
      let el: HTMLElement | null = root.parentElement
      while (el !== null && el.getBoundingClientRect().height < 100) el = el.parentElement
      if (el === null) return
      root.style.height = el.getBoundingClientRect().height + 'px'
    }
    update()
    const ro = new ResizeObserver(update)
    if (root.parentElement !== null) ro.observe(root.parentElement)
    window.addEventListener('resize', update)
    return () => { ro.disconnect(); window.removeEventListener('resize', update) }
  }, [])

  // Category collapse: measure how many chips fit the first 3 rows; the
  // "expand N categories" badge updates live with container width changes.
  const CATS_CLAMPED_ROWS = 3
  useLayoutEffect(() => {
    const wrap = chipsRef.current
    if (wrap === null) return
    const measure = () => {
      // 展开/收起按钮也在 chips 容器内，pill 计数必须排除它
      const pills = Array.from(wrap.querySelectorAll<HTMLElement>('button:not(.pcm-chip-more-btn)'))
      if (pills.length === 0) return
      const wrapRect = wrap.getBoundingClientRect()
      let visible = 0
      for (const pill of pills) {
        const top = pill.getBoundingClientRect().top - wrapRect.top
        const row = Math.round(top / (pill.offsetHeight + 6))
        if (row < CATS_CLAMPED_ROWS) visible += 1
      }
      if (catsClamped) {
        wrap.style.maxHeight = 'none'
        const probe = pills[Math.max(0, visible - 1)]
        const maxH = probe !== undefined
          ? probe.getBoundingClientRect().bottom - wrapRect.top + 1
          : 96
        wrap.style.maxHeight = maxH + 'px'
      } else {
        wrap.style.maxHeight = 'none'
      }
      const totalCats = categoriesRef.current.length
      setHiddenCatCount(Math.max(0, totalCats - (visible - 1)))
    }
    const ro = new ResizeObserver(measure)
    ro.observe(wrap)
    measure()
    // Pill widths change after the webfont swap, which a ResizeObserver on
    // the wrap cannot see (the wrap width is constant). Re-measure once the
    // fonts settle and once more shortly after, so the "expand N categories"
    // count and the clamp height always match what is actually rendered.
    const fonts = document.fonts
    void fonts?.ready.then(measure).catch(() => {})
    const timer = setTimeout(measure, 600)
    return () => { ro.disconnect(); clearTimeout(timer) }
  }, [catsClamped, data])

  // Quiet refresh on every filter change (cheap: host TTL cache answers it).
  useEffect(() => {
    const timer = setTimeout(() => { fetchRegistry(false); fetchStatus() }, 150)
    return () => clearTimeout(timer)
  }, [cat, kind, curatedOnly, sort, fetchRegistry, fetchStatus])

  // Poll while a refresh or an install runs.
  useEffect(() => {
    if (!refreshing && !installing) return
    const timer = setInterval(() => { fetchRegistry(false); fetchStatus() }, refreshing ? 5000 : 800)
    return () => clearInterval(timer)
  }, [refreshing, installing, fetchRegistry, fetchStatus])

  // On-demand verification of unknown entries on the current page.
  const verifyPage = useCallback((entries: MarketEntry[]) => {
    const unknown = entries.filter(e => e.isPlugin === null).map(e => e.owner + '/' + e.name).slice(0, 12)
    if (unknown.length === 0 || verifyBusy) return
    setVerifyBusy(true)
    fetch('/dsh-store/verify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ repos: unknown }),
    })
      .then(res => res.json())
      .then((body: { ok?: boolean; verdicts?: Record<string, boolean> }) => {
        const verdicts = body.verdicts ?? {}
        setData((prev: Registry | null) => {
          if (prev === null) return prev
          return {
            ...prev,
            plugins: prev.plugins.map((e: MarketEntry) => {
              const v = verdicts[(e.owner + '/' + e.name).toLowerCase()]
              if (v === undefined) return e
              return { ...e, isPlugin: v }
            }),
          }
        })
      })
      .catch(() => {})
      .finally(() => setVerifyBusy(false))
  }, [verifyBusy])

  const plugins = data?.plugins ?? []
  const categories = data === null ? [] : Object.keys(data.categories)
  categoriesRef.current = categories
  const catLabel = useCallback((id: string) => {
    if (data === null) return id
    const c = data.categories[id]
    return c === undefined ? id : c[lang] ?? c.en
  }, [data, lang])

  /** Which repos are installed in the current profile (from /status).
   *  Exact matching only — name / unscoped name / npm name / github: spec.
   *  (Substring matching used to mark dsh-context-doctor & co. as installed.) */
  const installedInfo = useMemo(() => {
    const names = new Set<string>()
    const repos = new Set<string>()
    const deps = status?.installed ?? {}
    for (const [name, spec] of Object.entries(deps)) {
      const n = name.toLowerCase()
      names.add(n)
      if (n.startsWith('@') && n.includes('/')) names.add(n.slice(n.indexOf('/') + 1))
      const m = /^github:([\w.-]+\/[\w.-]+)/i.exec(spec)
      if (m !== null) repos.add(m[1].toLowerCase())
    }
    return { names, repos }
  }, [status])

  const isInstalled = useCallback((e: MarketEntry): boolean => {
    if (installedInfo.repos.has((e.owner + '/' + e.name).toLowerCase())) return true
    if (installedInfo.names.has(e.name.toLowerCase())) return true
    if (e.npm !== null && installedInfo.names.has(e.npm.toLowerCase())) return true
    return false
  }, [installedInfo])

  /** Per-category counts under the CURRENT filter conditions (kind/curatedOnly/installedOnly/search), excluding the category filter itself. */
  const categoryCounts = useMemo(() => {
    const per = new Map<string, number>()
    let all = 0
    const needle = q.trim().toLowerCase()
    for (const p of plugins) {
      if (kind === 'plugin' && p.isPlugin !== true) continue
      if (kind === 'nonplugin' && p.isPlugin === true) continue
      if (curatedOnly && !p.curated) continue
      if (installedOnly && !isInstalled(p)) continue
      if (needle !== '') {
        const hay = (p.name + ' ' + p.owner + ' ' + p.description).toLowerCase()
        if (!hay.includes(needle)) continue
      }
      all += 1
      per.set(p.category, (per.get(p.category) ?? 0) + 1)
    }
    return { all, per }
  }, [plugins, kind, curatedOnly, q, installedOnly, isInstalled])

  const list = useMemo(
    () => visiblePlugins(plugins, { category: cat, kind, curatedOnly, installedOnly, query: q, sort, sinceDays: 0, lang }, isInstalled),
    [plugins, cat, kind, curatedOnly, installedOnly, q, sort, lang, isInstalled],
  )
  const totalPages = Math.max(1, Math.ceil(list.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageList = list.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  useEffect(() => {
    verifyPage(pageList)
  }, [pageList, verifyPage])

  const doInstall = useCallback((entry: MarketEntry) => {
    setConfirming(null)
    fetch('/dsh-store/install', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ repo: entry.owner + '/' + entry.name, npm: entry.npm }),
    })
      .then(res => res.json())
      .then((body: { ok?: boolean; message?: string; error?: string }) => {
        setToast(body.ok === true ? t('installDone') : t('installFailed') + ': ' + (body.message ?? body.error ?? ''))
        fetchStatus()
      })
      .catch(() => setToast(t('installFailed')))
  }, [t, fetchStatus])

  const doUninstall = useCallback((entry: MarketEntry) => {
    setRemoving(null)
    fetch('/dsh-store/uninstall', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ repo: entry.owner + '/' + entry.name }),
    })
      .then(res => res.json())
      .then((body: { ok?: boolean; message?: string; error?: string }) => {
        setToast(body.ok === true ? t('uninstallDone') : t('installFailed') + ': ' + (body.message ?? body.error ?? ''))
        fetchStatus()
      })
      .catch(() => setToast(t('installFailed')))
  }, [t, fetchStatus])

  useEffect(() => {
    if (toast === null) return
    const timer = setTimeout(() => setToast(null), 6000)
    return () => clearTimeout(timer)
  }, [toast])

  const sortItems = useMemo<MenuEntry[]>(() => [
    { id: 'stars-desc', label: t('sortStarsDesc') },
    { id: 'stars-asc', label: t('sortStarsAsc') },
    { id: 'today-desc', label: t('sortTodayDesc') },
    { id: 'today-asc', label: t('sortTodayAsc') },
  ], [t])

  const sizeItems = useMemo<MenuEntry[]>(() => PAGE_SIZES.map(n => ({ id: String(n), label: String(n) })), [])

  const sourceLabel = (() => {
    if (data === null) return ''
    if (data.source === 'snapshot') return t('sourceSnapshot').replace('{0}', relativeFromNow(data.updated, t))
    const synced = fetchAt !== null ? relativeFromNow(fetchAt, t) : relativeFromNow(data.updated, t)
    return t('syncedAt').replace('{0}', synced)
  })()

  const progressLabel = (() => {
    const p = status?.progress
    if (p === undefined || p.shards === undefined || p.shards === 0) return ''
    return t('shardProgress').replace('{0}', String(p.repos ?? 0)).replace('{1}', String(p.shard ?? 0)).replace('{2}', String(p.shards))
  })()

  const rateNote = (() => {
    const r = status?.rateLimit
    if (r === null || r === undefined || r.remaining === undefined || r.remaining > 0) return null
    const reset = r.reset ?? 0
    return t('rateLimitNote').replace('{0}', String(Math.max(0, Math.round(reset - Date.now() / 1000))))
  })()

  const chipCats = orderedCategories(categories, cat, false)

  return (
    <div className="pcm-root" ref={rootRef}>
      <div className="pcm-sticky-top">
      <div className="pcm-brand-card">
      <div className="pcm-header">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: '1 1 auto', minWidth: 200 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img className="pcm-icon" src={ICON_DATA} alt="" width={22} height={22} />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <h2 className="pcm-title">{t('title')}</h2>
              {status?.version !== undefined && status.version !== null && (
                <span className="pcm-version" title={t('versionHint').replace('{0}', status.version)}>v{status.version}</span>
              )}
            </span>
            {status?.tokenConfigured === true && <span className="pcm-token-badge">{t('tokenConfigured')}</span>}
          </div>
          <div className="pcm-subtitle">{t('subtitle')}</div>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={<IconSendOutline16 size={14} />}
          onClick={() => setPublishOpen(true)}
          className="pcm-publish-btn"
          style={{ marginLeft: 'auto' }}
        >
          {t('publish')}
        </Button>
      </div>
      <div className="pcm-header-row2">
        <span className="pcm-subtitle">{t('autoRefresh')}</span>
        {data !== null && <span className="pcm-source">{sourceLabel}</span>}
        {progressLabel !== '' && <span className="pcm-progress">{progressLabel}</span>}
        <span className="pcm-divider" />
        <Button
          variant="outline"
          size="sm"
          icon={refreshing ? <span className="pcm-spin"><IconLoadingOutline16 size={14} /></span> : <IconRefreshOutline14 size={14} />}
          onClick={() => { fetchRegistry(true); fetchStatus() }}
          disabled={refreshing}
          className="pcm-brand-btn"
        >
          {refreshing ? t('refreshing') : t('refresh')}
        </Button>
      </div>
      </div>

      {rateNote !== null && <div className="pcm-rate">{rateNote}</div>}
      {loadError && <div className="pcm-rate">{t('loadError')}</div>}

      <div className="pcm-toolbar pcm-toolbar-search">
        <Input
          className="pcm-search"
          icon={<IconSearchOutline16 size={14} />}
          value={q}
          placeholder={t('searchPlaceholder')}
          onChange={e => { setQ(e.target.value); setPage(1) }}
        />
      </div>
      <div className="pcm-toolbar">
        <div className="pcm-seg">
          <button className={kind === 'all' ? 'on' : ''} onClick={() => { setKind('all'); setPage(1) }}>{t('kindAll')}</button>
          <button className={kind === 'plugin' ? 'on' : ''} onClick={() => { setKind('plugin'); setPage(1) }}>{t('kindPlugin')}</button>
          <button className={kind === 'nonplugin' ? 'on' : ''} onClick={() => { setKind('nonplugin'); setPage(1) }}>{t('kindNonplugin')}</button>
        </div>
        <Pill active={curatedOnly} onClick={() => { setCuratedOnly(v => !v); setPage(1) }}>{t('curatedOnly')}</Pill>
        <Pill active={installedOnly} onClick={() => { setInstalledOnly(v => !v); setPage(1) }}>{t('installedOnly')}</Pill>
        <Menu
          open={sortOpen}
          onClose={() => setSortOpen(false)}
          onSelect={id => { setSort(id as SortKey); setPage(1) }}
          align="end"
          anchor={(
            <Button variant="outline" size="sm" className="pcm-sort-btn" onClick={() => setSortOpen(o => !o)}>{t('sort')}</Button>
          )}
          items={sortItems}
          selectedId={sort}
        />
      </div>
      <div className={catsClamped ? 'pcm-chips pcm-chips-clamped' : 'pcm-chips'} ref={chipsRef}>
        <Pill active={cat === 'all'} onClick={() => { setCat('all'); setPage(1) }}>{t('all')}<span className="pcm-count">{categoryCounts.all}</span></Pill>
        {chipCats.map((id: string) => (
          <Pill key={id} active={cat === id} onClick={() => { setCat(id); setPage(1) }}>{catLabel(id)}<span className="pcm-count">{categoryCounts.per.get(id) ?? 0}</span></Pill>
        ))}
        {hiddenCatCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="pcm-chip-more-btn"
            onClick={() => setCatsClamped(v => !v)}
          >
            {catsClamped ? t('expandCats').replace('{0}', String(hiddenCatCount)) : t('collapseCats')}
          </Button>
        )}
      </div>
      </div>

      <div className="pcm-scroll">
      {list.length === 0 ? (
        <div className="pcm-empty">{data === null ? t('loading') : t('empty')}</div>
      ) : (
        <>
          <div className="pcm-grid">
            {pageList.map((entry: MarketEntry) => {
              const installed = isInstalled(entry)
              const today = entry.todayStars
              return (
                <div
                  key={entry.owner + '/' + entry.name}
                  className="pcm-card"
                  onClick={() => window.open(entry.url, '_blank', 'noopener')}
                >
                  <div className="pcm-card-top">
                    <div className="pcm-av" style={{ background: avatarColor(entry.name) }}>{(entry.name.replace(/^dsh[-_]/i, '').charAt(0) || 'P').toUpperCase()}</div>
                    <div style={{ overflow: 'hidden' }}>
                      <div className="pcm-name">{entry.name}</div>
                      <div className="pcm-owner">{entry.owner}</div>
                    </div>
                  </div>
                  <div className="pcm-desc">{entry.description === '' ? '—' : entry.description}</div>
                  <div className="pcm-badges">
                    {entry.isPlugin === true && <span className="pcm-badge pcm-badge-plugin">{t('pluginBadge')}</span>}
                    {entry.isPlugin === false && <span className="pcm-badge pcm-badge-nonplugin">{t('nonpluginBadge')}</span>}
                    {entry.isPlugin === null && <span className="pcm-badge pcm-badge-pending">{t('pendingBadge')}</span>}
                    {entry.curated && <span className="pcm-badge pcm-badge-curated">{t('curatedBadge')}</span>}
                    {installed && <span className="pcm-badge pcm-badge-installed">{t('installed')}</span>}
                  </div>
                  <div className="pcm-stats">
                    <span className="pcm-stars">★ {formatStars(entry.stars)}</span>
                    <span title={t('todayGainHint')}>{t('todayGain')} {today === null ? '—' : (today >= 0 ? '+' : '') + today}</span>
                    {entry.created !== null && (
                      <span title={t('publishAgeHint')}>{t('publishAge') + ' ' + durationBetween(entry.created, new Date().toISOString())}</span>
                    )}
                  </div>
                  <div className="pcm-meta">
                    <span>{catLabel(entry.category)}</span>
                    <span title={entry.pushed ?? undefined}>{t('updatedShort') + ' ' + relativeFromNow(entry.pushed, t)}</span>
                    {entry.language !== null && <span>{entry.language}</span>}
                  </div>
                  <div className="pcm-actions" onClick={e => e.stopPropagation()}>
                    {installed ? (
                      <Button variant="outline" size="sm" disabled>{t('installed')}</Button>
                    ) : (
                      <Button variant="primary" size="sm" onClick={() => setConfirming(entry)}>{t('install')}</Button>
                    )}
                    {installed && (
                      <Button variant="ghost" size="sm" className="pcm-uninstall-btn" onClick={() => setRemoving(entry)}>{t('uninstall')}</Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
      </div>
      <div className="pcm-pager">
        <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setPage(prev => Math.max(1, prev - 1))}>
          {t('prevPage')}
        </Button>
        {pageItems(currentPage, totalPages).map((item: number | '…', i: number) => item === '…' ? (
          <span key={'e' + i} style={{ opacity: .5 }}>…</span>
        ) : (
          <button key={item} className={'pcm-page' + (item === currentPage ? ' on' : '')} onClick={() => setPage(item)}>{item}</button>
        ))}
        <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}>
          {t('nextPage')}
        </Button>
        <Menu
          open={sizeOpen}
          onClose={() => setSizeOpen(false)}
          onSelect={id => { setPageSize(Number(id)); setPage(1) }}
          align="end"
          anchor={(
            <Button variant="outline" size="sm" onClick={() => setSizeOpen(o => !o)}>{t('pageSize') + ' ' + pageSize}</Button>
          )}
          items={sizeItems}
          selectedId={String(pageSize)}
        />
      </div>

      {confirming !== null && (
        <InstallModal
          t={t}
          entry={confirming}
          installing={installing}
          statusLine={status?.install?.line ?? null}
          onClose={() => setConfirming(null)}
          onConfirm={() => doInstall(confirming)}
        />
      )}

      {removing !== null && (
        <Modal
          open
          onClose={() => setRemoving(null)}
          title={t('uninstallTitle').replace('{0}', removing.name)}
          description={t('uninstallDesc')}
          footer={(
            <>
              <Button variant="ghost" onClick={() => setRemoving(null)}>{t('cancel')}</Button>
              <Button variant="primary" onClick={() => doUninstall(removing)}>{t('uninstall')}</Button>
            </>
          )}
        >
          <div className="pcm-modal-body">
            <div className="pcm-cmd">{removing.owner + '/' + removing.name}</div>
          </div>
        </Modal>
      )}

      {publishOpen && (
        <PublishModal t={t} onClose={() => setPublishOpen(false)} />
      )}

      {toast !== null && (
        <div style={{
          position: 'fixed', bottom: 20, right: 20, zIndex: 1000,
          background: 'var(--dsw-alias-bg-overlay, #1f2328)', color: 'var(--dsw-alias-label-primary, #fff)',
          borderRadius: 10, padding: '10px 14px', fontSize: 13, boxShadow: '0 6px 24px rgba(0,0,0,.3)',
          maxWidth: 420,
        }}>
          {toast}
        </div>
      )}
    </div>
  )
}

function InstallModal(props: {
  t: (key: string) => string
  entry: MarketEntry
  installing: boolean
  statusLine: string | null
  onClose: () => void
  onConfirm: () => void
}) {
  const { t, entry, installing, statusLine } = props
  const target = entry.npm ?? 'github:' + entry.owner + '/' + entry.name
  const riskClass = entry.curated ? 'pcm-risk pcm-risk-curated' : entry.isPlugin === true ? 'pcm-risk pcm-risk-community' : 'pcm-risk pcm-risk-nonplugin'
  const riskText = entry.curated ? t('riskCurated') : entry.isPlugin === true ? t('riskCommunity') : t('riskNonplugin')
  return (
    <Modal
      open
      onClose={props.onClose}
      title={t('installTitle').replace('{0}', entry.owner + '/' + entry.name)}
      description={entry.description}
      footer={(
        <>
          <Button variant="ghost" onClick={props.onClose}>{t('cancel')}</Button>
          <Button variant="primary" onClick={props.onConfirm} disabled={installing}>
            {installing ? <span className="pcm-spin"><IconLoadingOutline16 size={14} /></span> : t('confirm')}
          </Button>
        </>
      )}
    >
      <div className="pcm-modal-body">
        <div>{t('installFrom').replace('{0}', entry.url)}</div>
        <div className={riskClass}>{riskText}</div>
        <div className="pcm-cmd">{t('installVia').replace('{0}', target)}</div>
        {installing && statusLine !== null && <div className="pcm-cmd">{statusLine}</div>}
      </div>
    </Modal>
  )
}

function PublishModal(props: { t: (key: string) => string; onClose: () => void }) {
  const t = props.t
  const [repo, setRepo] = useState('')
  const [myRepos, setMyRepos] = useState<{ full_name: string }[]>([])
  const [checked, setChecked] = useState<{ repo: string; hasTopic: boolean } | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [busy, setBusy] = useState(false)

  const loadMyRepos = () => {
    fetch('/dsh-store/publish/repos', { cache: 'no-store' })
      .then(res => res.json())
      .then((body: { ok?: boolean; repos?: { full_name: string }[] }) => setMyRepos(body.repos ?? []))
      .catch(() => {})
  }
  useEffect(loadMyRepos, [])

  const checkTopic = (target: string) => {
    setBusy(true)
    setResult(null)
    setError(null)
    fetch('/dsh-store/publish', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ repo: target, checkOnly: true }),
    })
      .then(res => res.json())
      .then((body: { topics?: string[] }) => {
        setChecked({ repo: target, hasTopic: (body.topics ?? []).includes('dsh-plugin') })
      })
      .catch(() => setError('check failed'))
      .finally(() => setBusy(false))
  }

  const addTopic = (target: string) => {
    setBusy(true)
    setResult(null)
    setError(null)
    fetch('/dsh-store/publish', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ repo: target }),
    })
      .then(res => res.json())
      .then((body: { ok?: boolean; needToken?: boolean; hint?: string; note?: string; error?: string; topics?: string[] }) => {
        if (body.ok === true) setResult(t('publishAdded') + ' ' + (body.note ?? ''))
        else if (body.needToken === true) setResult(t('publishNeedToken') + ' ' + (body.hint ?? ''))
        else setError(body.error ?? 'failed')
      })
      .catch(() => setError('failed'))
      .finally(() => setBusy(false))
  }

  const copyGh = (target: string) => {
    const cmd = 'gh api -X PUT repos/' + target + '/topics -f "names[]=dsh-plugin"'
    void navigator.clipboard?.writeText(cmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const ghCommand = repo.includes('/') ? 'gh api -X PUT repos/' + repo + '/topics -f "names[]=dsh-plugin"' : ''

  return (
    <Modal
      open
      onClose={props.onClose}
      title={t('publishTitle')}
      description={t('publishDesc')}
      footer={(
        <>
          <Button variant="ghost" onClick={props.onClose}>{t('close')}</Button>
          <Button variant="primary" disabled={busy || !repo.includes('/')} onClick={() => addTopic(repo)}>
            {t('publishAdd')}
          </Button>
        </>
      )}
    >
      <div className="pcm-modal-body">
        <Input value={repo} placeholder={t('publishRepo')} onChange={e => setRepo(e.target.value)} />
        {myRepos.length > 0 && (
          <>
            <div style={{ fontSize: 12, opacity: .75 }}>{t('publishMyRepos')}</div>
            <div className="pcm-publish-repos">
              {myRepos.map(r => (
                <div key={r.full_name} className="pcm-publish-repo" onClick={() => setRepo(r.full_name)}>{r.full_name}</div>
              ))}
            </div>
          </>
        )}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Button variant="outline" size="sm" disabled={busy || !repo.includes('/')} onClick={() => checkTopic(repo)}>
            {t('publishCheck')}
          </Button>
          {ghCommand !== '' && (
            <Tooltip label={copied ? t('publishCopied') : t('publishCopyGh')}>
              <Button variant="ghost" size="sm" icon={<IconCopyOutline16 size={14} />} onClick={() => copyGh(repo)} />
            </Tooltip>
          )}
        </div>
        {checked !== null && checked.repo === repo && (
          <div className={checked.hasTopic ? 'pcm-risk pcm-risk-curated' : 'pcm-risk pcm-risk-community'}>
            {checked.hasTopic ? t('publishHasTopic') : t('publishManual')}
          </div>
        )}
        {result !== null && <div className="pcm-risk pcm-risk-community">{result}</div>}
        {error !== null && <div className="pcm-risk pcm-risk-nonplugin">{error}</div>}
        <div style={{ fontSize: 12, opacity: .7 }}>{t('publishManual')}</div>
      </div>
    </Modal>
  )
}
