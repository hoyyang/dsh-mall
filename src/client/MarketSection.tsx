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
  const [favOnly, setFavOnly] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [sortDim, setSortDim] = useState<'stars' | 'today' | 'created'>('stars')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const sort = (sortDim + '-' + sortDir) as SortKey
  const LANGS = ['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ru'] as const
  const LANG_LABELS: Record<string, string> = { en: 'English', zh: '中文', ja: '日本語', ko: '한국어', es: 'Español', fr: 'Français', de: 'Deutsch', pt: 'Português', ru: 'Русский' }
  const LANG_SHORT: Record<string, string> = { en: 'EN', zh: '中文', ja: '日本語', ko: '한국어', es: 'ES', fr: 'FR', de: 'DE', pt: 'PT', ru: 'RU' }
  const langItems = useMemo<MenuEntry[]>(() => LANGS.map(l => ({ id: l, label: LANG_LABELS[l] ?? l })), [])
  const [langChoice, setLangChoice] = useState<string>('en')
  const [langOpen, setLangOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(24)
  const [sortOpen, setSortOpen] = useState(false)
  const [sizeOpen, setSizeOpen] = useState(false)
  const [confirming, setConfirming] = useState<MarketEntry | null>(null)
  const [removing, setRemoving] = useState<MarketEntry | null>(null)
  const [removingLocal, setRemovingLocal] = useState<MarketEntry | null>(null)
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

  useEffect(() => {
    fetch('/dsh-store/favorites', { cache: 'no-store' })
      .then(res => res.json())
      .then((body: { favorites?: string[] }) => setFavorites(new Set(body.favorites ?? [])))
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
  // v1.2.5: also capped to the viewport (innerHeight - root top - margin) so
  // the page never scrolls on any screen size — everything fits at once.
  useLayoutEffect(() => {
    const root = rootRef.current
    if (root === null) return
    const update = () => {
      let el: HTMLElement | null = root.parentElement
      while (el !== null && el.getBoundingClientRect().height < 100) el = el.parentElement
      if (el === null) return
      const parentH = el.getBoundingClientRect().height
      const top = root.getBoundingClientRect().top
      const viewportH = window.innerHeight - top - 16
      let h = Math.max(240, Math.min(parentH, viewportH))
      root.style.height = Math.round(h) + 'px'
      // 宿主的滚动容器除了我们还可能有内边距/边框，root 撑满后会出现几像素
      // 溢出，导致整个面板在宿主容器里上下滚动（用户看到的"页面级滚动"）。
      // 逐次把溢出量扣掉，直到宿主容器 scrollHeight == clientHeight。
      for (let i = 0; i < 4; i++) {
        const overflow = el.scrollHeight - el.clientHeight
        if (overflow <= 1) break
        h = Math.max(240, h - overflow - 1)
        root.style.height = Math.round(h) + 'px'
      }
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
      // 排序按钮也住在 chips 容器里，pill 计数必须排除它（否则高度公式按 28px 算）
      const pills = Array.from(wrap.querySelectorAll<HTMLElement>('button:not(.pcm-chip-more-btn):not(.pcm-sort-btn)'))
      if (pills.length === 0) return
      for (const p of pills) p.style.marginRight = ''
      const wrapRect = wrap.getBoundingClientRect()
      const rowOf = (pill: HTMLElement): number => {
        const top = pill.getBoundingClientRect().top - wrapRect.top
        return Math.round(top / (pill.offsetHeight + 6))
      }
      // 排序按钮占据第一行右端：伸进其区域的第 0 行 pill 强制换行（两态都处理）
      const sortSlot = wrap.querySelector<HTMLElement>('.pcm-sort-slot')
      if (sortSlot !== null) {
        const zoneStart = wrapRect.width - (sortSlot.offsetWidth + 8)
        let lastRow0 = -1
        for (let i = 0; i < pills.length; i++) {
          if (rowOf(pills[i]!) === 0) lastRow0 = i
        }
        while (lastRow0 >= 0) {
          const pr = pills[lastRow0]!.getBoundingClientRect()
          if (pr.right - wrapRect.left <= zoneStart) break
          pills[lastRow0]!.style.marginRight = wrapRect.width + 'px'
          lastRow0 -= 1
        }
      }
      let visible = 0
      for (const pill of pills) {
        if (rowOf(pill) < CATS_CLAMPED_ROWS) visible += 1
      }
      if (catsClamped) {
        wrap.style.maxHeight = 'none'
        // 展开按钮占据第三行右端：凡是伸进按钮区的可见 pill 一律强制换行到
        // 第 4 行（被裁掉），行尾给按钮留出位置，杜绝遮挡（v1.4.0 修复
        // 「文档与渲染」被「展开 N 个类别」压住的问题）。
        let lastVisible = visible - 1
        if (visible < pills.length) {
          const btnW = (wrap.querySelector<HTMLElement>('.pcm-chip-more-btn')?.offsetWidth ?? 104) + 8
          const zoneStart = wrapRect.width - btnW
          while (lastVisible >= 0) {
            const pr = pills[lastVisible]!.getBoundingClientRect()
            if (pr.right - wrapRect.left <= zoneStart) break
            pills[lastVisible]!.style.marginRight = wrapRect.width + 'px'
            lastVisible -= 1
          }
        }
        let visibleFinal = 0
        for (const pill of pills) {
          if (rowOf(pill) < CATS_CLAMPED_ROWS) visibleFinal += 1
        }
        // 裁剪高度用固定公式（3 行 pill + 2 个 gap），不依赖任何 pill 的位置，
        // 避免测量往返（RO 高度变化）之间 maxHeight 在 85/115 之间震荡。
        const ph = pills[0]!.offsetHeight
        wrap.style.maxHeight = (ph * CATS_CLAMPED_ROWS + 6 * (CATS_CLAMPED_ROWS - 1) + 1) + 'px'
        visible = visibleFinal
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

  // 已安装但市场索引里没有的包：合成「本地已装」条目（特殊卡片样式），
  // 与 GitHub 条目同列展示，并计入总数与类别计数。
  const catalogPlugins = data?.plugins ?? []
  const represented = useMemo(() => {
    const set = new Set<string>()
    for (const p of catalogPlugins) {
      set.add(p.name.toLowerCase())
      if (p.npm !== null) set.add(p.npm.toLowerCase())
    }
    return set
  }, [data])
  const localEntries = useMemo<MarketEntry[]>(() => Object.entries(status?.installed ?? {})
    .filter(([name, spec]) => {
      const s = String(spec).trim()
      // 本地 link/file 安装没有市场身份，任何目录条目都无法对应 → 必合成本地卡
      if (s.startsWith('link:') || s.startsWith('file:')) return true
      return !represented.has(name.toLowerCase())
    })
    .map(([name, spec]) => ({
      name,
      owner: lang === 'zh' ? '本地安装' : 'local install',
      url: '',
      category: 'installed',
      description: String(spec),
      stars: null,
      todayStars: null,
      created: null,
      pushed: null,
      isPlugin: true,
      curated: false,
      npm: name,
      avatar: '',
      language: null,
      local: true,
    })), [status, represented, lang])

  const plugins = useMemo(() => (data === null ? [] : [...data.plugins, ...localEntries]), [data, localEntries])
  const categories = useMemo(() => {
    const base = data === null ? [] : Object.keys(data.categories)
    if (localEntries.length > 0 && !base.includes('installed')) return [...base, 'installed']
    return base
  }, [data, localEntries.length])
  categoriesRef.current = categories
  const catLabel = useCallback((id: string) => {
    if (id === 'installed') return lang === 'zh' ? '本地已装' : 'Installed (local)'
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
      const s = String(spec).trim()
      // 本地 link:/file: 安装没有市场身份（无 owner/repo 可对应），跳过，
      // 否则同名仓库会被误标已安装（如别人的 dsh-store 撞名本地包）。
      if (s.startsWith('link:') || s.startsWith('file:')) continue
      const n = name.toLowerCase()
      names.add(n)
      const m = /^github:([\w.-]+\/[\w.-]+)/i.exec(s)
      if (m !== null) repos.add(m[1].toLowerCase())
    }
    return { names, repos }
  }, [status])

  /** Name collisions across the catalog:同名/同 npm 仓库不止一个时，
   *  只有精选（人工核实）条目才允许按名字判已安装，其余视为撞名不放行。 */
  const identityCounts = useMemo(() => {
    const names = new Map<string, number>()
    const npms = new Map<string, number>()
    for (const p of plugins) {
      const n = p.name.toLowerCase()
      names.set(n, (names.get(n) ?? 0) + 1)
      if (p.npm !== null) {
        const pn = p.npm.toLowerCase()
        npms.set(pn, (npms.get(pn) ?? 0) + 1)
      }
    }
    return { names, npms }
  }, [plugins])

  /** 全部已装包名（含本地 link 安装），只用于本地合成卡片的已装判定。 */
  const installedAll = useMemo(() => {
    const set = new Set<string>()
    for (const k of Object.keys(status?.installed ?? {})) set.add(k.toLowerCase())
    return set
  }, [status])

  const isInstalled = useCallback((e: MarketEntry): boolean => {
    if (e.local === true) return installedAll.has(e.name.toLowerCase())
    if (installedInfo.repos.has((e.owner + '/' + e.name).toLowerCase())) return true
    const nm = e.name.toLowerCase()
    if (installedInfo.names.has(nm) && (identityCounts.names.get(nm) === 1 || e.curated)) return true
    if (e.npm !== null) {
      const pn = e.npm.toLowerCase()
      if (installedInfo.names.has(pn) && (identityCounts.npms.get(pn) === 1 || e.curated)) return true
    }
    return false
  }, [installedInfo, identityCounts, installedAll])

  const favKey = (e: MarketEntry): string => (e.local === true ? 'local:' + e.name : e.owner + '/' + e.name).toLowerCase()
  const isFav = useCallback((e: MarketEntry): boolean => favorites.has(favKey(e)), [favorites])
  const toggleFav = useCallback((e: MarketEntry) => {
    const key = favKey(e)
    const next = new Set(favorites)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    setFavorites(next)
    fetch('/dsh-store/favorites', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ key }),
    }).catch(() => {})
  }, [favorites])

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
      if (favOnly && !isFav(p)) continue
      if (needle !== '') {
        const hay = (p.name + ' ' + p.owner + ' ' + p.description).toLowerCase()
        if (!hay.includes(needle)) continue
      }
      all += 1
      per.set(p.category, (per.get(p.category) ?? 0) + 1)
    }
    return { all, per }
  }, [plugins, kind, curatedOnly, q, installedOnly, isInstalled, favOnly, isFav])

  const list = useMemo(
    () => visiblePlugins(plugins, { category: cat, kind, curatedOnly, installedOnly, favOnly, query: q, sort, sinceDays: 0, lang }, isInstalled, isFav),
    [plugins, cat, kind, curatedOnly, installedOnly, favOnly, q, sort, lang, isInstalled, isFav],
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

  const doUninstallLocal = useCallback((entry: MarketEntry) => {
    setRemovingLocal(null)
    fetch('/dsh-store/uninstall', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: entry.name }),
    })
      .then(res => res.json())
      .then((body: { ok?: boolean; message?: string; error?: string }) => {
        setToast(body.ok === true ? t('uninstallDone') : t('installFailed') + ': ' + (body.message ?? body.error ?? ''))
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
    { type: 'label', id: 'dim-label', text: t('sortDim') },
    { id: 'stars', label: t('sortStars') },
    { id: 'today', label: t('sortToday') },
    { id: 'created', label: t('sortCreated') },
    { type: 'separator', id: 'dim-sep' },
    { type: 'label', id: 'dir-label', text: t('sortDir') },
    { id: 'desc', label: t('sortDesc') },
    { id: 'asc', label: t('sortAsc') },
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
        <Pill
          className={curatedOnly ? 'pcm-pill-curated pcm-pill-curated-on' : 'pcm-pill-curated'}
          active={curatedOnly}
          onClick={() => { setCuratedOnly(v => !v); setPage(1) }}
        >{t('curatedOnly')}</Pill>
        <Pill
          className={installedOnly ? 'pcm-pill-installed pcm-pill-installed-on' : 'pcm-pill-installed'}
          active={installedOnly}
          onClick={() => { setInstalledOnly(v => !v); setPage(1) }}
        >{t('installedOnly')}</Pill>
        <Pill
          className={favOnly ? 'pcm-pill-fav pcm-pill-fav-on' : 'pcm-pill-fav'}
          active={favOnly}
          onClick={() => { setFavOnly(v => !v); setPage(1) }}
        >{t('favOnly')}</Pill>
        <Menu
          open={langOpen}
          onClose={() => setLangOpen(false)}
          onSelect={id => { setLangChoice(id); setPage(1) }}
          align="end"
          anchor={(
            <Button
              variant="outline"
              size="sm"
              className="pcm-lang-btn"
              onClick={() => setLangOpen(o => !o)}
            >
              {'🌐 ' + (LANG_SHORT[langChoice] ?? langChoice.toUpperCase())}
            </Button>
          )}
          items={langItems}
          selectedId={langChoice}
        />
      </div>
      <div className={catsClamped ? 'pcm-chips pcm-chips-clamped' : 'pcm-chips'} ref={chipsRef}>
        <div className="pcm-sort-slot">
          <Menu
            open={sortOpen}
            onClose={() => setSortOpen(false)}
            onSelect={id => {
              if (id === 'stars' || id === 'today' || id === 'created') setSortDim(id)
              else if (id === 'asc' || id === 'desc') setSortDir(id)
              setPage(1)
            }}
            align="end"
            portal
            anchor={(
              <Button variant="outline" size="sm" className="pcm-sort-btn" onClick={() => setSortOpen(o => !o)}>{t('sort') + ' ' + (sortDir === 'desc' ? '↓' : '↑')}</Button>
            )}
            items={sortItems}
            selectedIds={[sortDim, sortDir]}
          />
        </div>
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
                  key={(entry.local === true ? 'local:' : '') + entry.owner + '/' + entry.name}
                  className={entry.local === true ? 'pcm-card pcm-card-local' : 'pcm-card'}
                  onClick={() => { if (entry.local !== true && entry.url !== '') window.open(entry.url, '_blank', 'noopener') }}
                >
                  <div className="pcm-card-top">
                    <div className="pcm-av" style={{ background: avatarColor(entry.name) }}>
                      {(entry.name.replace(/^dsh[-_]/i, '').charAt(0) || 'P').toUpperCase()}
                      {entry.avatar !== '' && (
                        <img
                          className="pcm-av-img"
                          src={entry.avatar}
                          alt=""
                          loading="lazy"
                          onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                        />
                      )}
                    </div>
                    <div className="pcm-card-title">
                      <span className="pcm-name">{entry.name}</span>
                      <span className="pcm-owner">{entry.owner}</span>
                      <button
                        className={isFav(entry) ? 'pcm-fav-star pcm-fav-on' : 'pcm-fav-star'}
                        title={t('favAdd')}
                        onClick={e => { e.stopPropagation(); toggleFav(entry) }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                            fill={isFav(entry) ? '#f59e0b' : 'transparent'}
                            stroke="#d99a1f"
                            strokeWidth="1.6"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="pcm-actions" onClick={e => e.stopPropagation()}>
                      {installed ? (
                        <Button variant="outline" size="sm" disabled>{t('installed')}</Button>
                      ) : (
                        <Button variant="primary" size="sm" onClick={() => setConfirming(entry)}>{t('install')}</Button>
                      )}
                      {installed && entry.local === true && (
                        <Button variant="ghost" size="sm" className="pcm-uninstall-btn" onClick={() => setRemovingLocal(entry)}>{t('uninstall')}</Button>
                      )}
                      {installed && entry.local !== true && (
                        <Button variant="ghost" size="sm" className="pcm-uninstall-btn" onClick={() => setRemoving(entry)}>{t('uninstall')}</Button>
                      )}
                    </div>
                  </div>
                  <div className="pcm-desc">{(() => {
                    const d = langChoice !== 'en' && entry.descriptions?.[langChoice] ? entry.descriptions[langChoice] : entry.description
                    return d === '' ? '—' : d
                  })()}</div>
                  <div className="pcm-foot">
                    <div className="pcm-stats">
                      <span className="pcm-stars">★ {formatStars(entry.stars)}</span>
                      <span className={today === null ? 'pcm-today' : (today >= 0 ? 'pcm-today pcm-today-up' : 'pcm-today pcm-today-down')} title={t('todayGainHint')}>{t('todayGain')} {today === null ? '—' : (today >= 0 ? '+' : '') + today}</span>
                      <span className="pcm-cat">{catLabel(entry.category)}</span>
                      <span className="pcm-updated" title={entry.pushed ?? undefined}>{t('updatedShort') + ' ' + relativeFromNow(entry.pushed, t)}</span>
                    </div>
                    <div className="pcm-badges">
                      {entry.isPlugin === true && <span className="pcm-badge pcm-badge-plugin">{t('pluginBadge')}</span>}
                      {entry.isPlugin === false && <span className="pcm-badge pcm-badge-nonplugin">{t('nonpluginBadge')}</span>}
                      {entry.isPlugin === null && <span className="pcm-badge pcm-badge-pending">{t('pendingBadge')}</span>}
                      {entry.curated && <span className="pcm-badge pcm-badge-curated">{t('curatedBadge')}</span>}
                      {entry.local === true && <span className="pcm-badge pcm-badge-local">{t('localBadge')}</span>}
                      {installed && <span className="pcm-badge pcm-badge-installed">{t('installed')}</span>}
                    </div>
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

      {removingLocal !== null && (
        <LocalUninstallModal
          t={t}
          entry={removingLocal}
          onClose={() => setRemovingLocal(null)}
          onConfirm={() => doUninstallLocal(removingLocal)}
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

function LocalUninstallModal(props: {
  t: (key: string) => string
  entry: MarketEntry
  onClose: () => void
  onConfirm: () => void
}) {
  const { t, entry } = props
  const [checked, setChecked] = useState(false)
  return (
    <Modal
      open
      onClose={props.onClose}
      title={t('localUninstallTitle').replace('{0}', entry.name)}
      description={t('localUninstallDesc')}
      footer={(
        <>
          <Button variant="ghost" onClick={props.onClose}>{t('cancel')}</Button>
          <Button variant="primary" disabled={!checked} onClick={props.onConfirm}>{t('uninstall')}</Button>
        </>
      )}
    >
      <div className="pcm-modal-body">
        <div className="pcm-risk pcm-risk-nonplugin">{t('localUninstallWarn')}</div>
        <div className="pcm-cmd">{entry.name}</div>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, cursor: 'pointer' }}>
          <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} />
          {t('localUninstallCheck')}
        </label>
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
