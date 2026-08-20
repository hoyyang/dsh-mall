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
  IconLinkOutline16,
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
import { DetailPanel } from './DetailPanel.tsx'
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
  updates?: Array<{ name: string; from: string; to: string; repo: string; npm: string }>
  pluginStates?: Record<string, 'live' | 'disabled' | 'restart'>
  rollbacks?: Record<string, { name: string; from: string; to: string; spec: string; at: string }>
  skipUpdates?: string[]
  patchDisables?: string[]
  selfUpdate?: { from: string; to: string | null }
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
  const [verifiedOnly, setVerifiedOnly] = useState(false)
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
  const [rollbacking, setRollbacking] = useState<string | null>(null)
  const [removing, setRemoving] = useState<MarketEntry | null>(null)
  const [removingLocal, setRemovingLocal] = useState<MarketEntry | null>(null)
  const [publishOpen, setPublishOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [verifyBusy, setVerifyBusy] = useState(false)
  const [detail, setDetail] = useState<MarketEntry | null>(null)
  const [updateBusy, setUpdateBusy] = useState(false)
  const [updatingNames, setUpdatingNames] = useState<Set<string>>(new Set())
  const [selfUpdateBusy, setSelfUpdateBusy] = useState(false)
  const [selfUpdateDone, setSelfUpdateDone] = useState(false)
  const [toggling, setToggling] = useState<Set<string>>(new Set())
  const scrollRef = useRef<HTMLDivElement | null>(null)

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
    // status/q/kind/curatedOnly/installedOnly/favOnly/favorites 入依赖：
    // 点「已安装/仅精选/已收藏」等筛选后 pill 内的计数文本变化、pill 宽度
    // 随之变化，必须重算强制换行与裁剪高度，否则分类区行归属/裁剪错乱
    // （v1.6 修复「已安装」点击后分类区排布变化）。
  }, [catsClamped, data, status, q, kind, curatedOnly, installedOnly, favOnly, favorites])

  // Quiet refresh on every filter change (cheap: host TTL cache answers it).
  useEffect(() => {
    const timer = setTimeout(() => { fetchRegistry(false); fetchStatus() }, 150)
    return () => clearTimeout(timer)
  }, [cat, kind, curatedOnly, verifiedOnly, sort, fetchRegistry, fetchStatus])

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
      npmVersion: null,
      version: null,
      defaultBranch: null,
      license: null,
      verified: null,
      disclosure: null,
      installable: null,
      topics: [],
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

  /** 条目对应的已装依赖 spec（详情面板展示已装版本）。 */
  const installedSpecOf = useCallback((e: MarketEntry): string | null => {
    const deps = status?.installed ?? {}
    for (const [n, s] of Object.entries(deps)) {
      if (e.npm !== null && n.toLowerCase() === e.npm.toLowerCase()) return String(s)
      if (n.toLowerCase() === e.name.toLowerCase()) return String(s)
    }
    return null
  }, [status])

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
      if (verifiedOnly && p.verified == null) continue
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
  }, [plugins, kind, curatedOnly, verifiedOnly, q, installedOnly, isInstalled, favOnly, isFav])

  const list = useMemo(
    () => visiblePlugins(plugins, { category: cat, kind, curatedOnly, verifiedOnly, installedOnly, favOnly, query: q, sort, sinceDays: 0, lang }, isInstalled, isFav),
    [plugins, cat, kind, curatedOnly, verifiedOnly, installedOnly, favOnly, q, sort, lang, isInstalled, isFav],
  )
  const totalPages = Math.max(1, Math.ceil(list.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageList = list.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // 翻页焦点管理（ARIA APG pagination 模式）：列表滚回顶部，
  // 焦点留在当前页码按钮上（aria-current 标记 + 读屏播报）。
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [currentPage])

  useEffect(() => {
    verifyPage(pageList)
  }, [pageList, verifyPage])

  // 多语言简介按需富化：语言切换/翻页后，当前页缺少 description_<lang>
  // 的条目交给 host 抓 README.<lang>.md 首段，返回后即时替换卡片简介。
  const descRequested = useRef<Set<string>>(new Set())
  useEffect(() => {
    if (langChoice === 'en' || data === null) return
    const todo: MarketEntry[] = []
    for (const e of pageList) {
      if (e.local === true || e.owner === '') continue
      const key = e.owner + '/' + e.name
      if (descRequested.current.has(langChoice + ':' + key)) continue
      if (e.descriptions?.[langChoice] != null && e.descriptions[langChoice] !== '') continue
      todo.push(e)
    }
    if (todo.length === 0) return
    for (const e of todo) descRequested.current.add(langChoice + ':' + e.owner + '/' + e.name)
    fetch('/dsh-store/descriptions', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ lang: langChoice, repos: todo.map(e => e.owner + '/' + e.name) }),
    })
      .then(res => res.json())
      .then((body: { ok?: boolean; descriptions?: Record<string, string> }) => {
        const descs = body.descriptions ?? {}
        setData((prev: Registry | null) => {
          if (prev === null) return prev
          return {
            ...prev,
            plugins: prev.plugins.map((e: MarketEntry) => {
              const hit = descs[(e.owner + '/' + e.name).toLowerCase()]
              if (hit === undefined) return e
              return { ...e, descriptions: { ...(e.descriptions ?? {}), [langChoice]: hit } }
            }),
          }
        })
      })
      .catch(() => {})
  }, [langChoice, pageList, data])

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

  // ---- 更新检测：status.updates（host 侧比对已装 spec × 索引 npm_version）----
  const updates = status?.updates ?? []
  const updateFor = useCallback((e: MarketEntry): { name: string; from: string; to: string } | null => {
    const keys = new Set<string>()
    if (e.npm !== null) keys.add(e.npm.toLowerCase())
    keys.add(e.name.toLowerCase())
    for (const u of updates) {
      if (keys.has(u.name.toLowerCase()) || (e.owner !== '' && u.repo.toLowerCase() === (e.owner + '/' + e.name).toLowerCase())) return u
    }
    return null
  }, [updates])

  const runUpdateRequest = useCallback((names: string[], toastDone: string) => {
    fetch('/dsh-store/update', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ names }),
    })
      .then(res => res.json())
      .then((body: { ok?: boolean; message?: string; error?: string }) => {
        setToast(body.ok === true ? toastDone + ' — ' + (body.message ?? '') : t('updateFailed') + ': ' + (body.message ?? body.error ?? ''))
        fetchStatus()
        fetchRegistry(false)
      })
      .catch(() => setToast(t('updateFailed')))
      .finally(() => {
        setUpdateBusy(false)
        setUpdatingNames(new Set())
      })
  }, [t, fetchStatus, fetchRegistry])

  const doUpdateAll = useCallback(() => {
    if (updateBusy || updates.length === 0) return
    setUpdateBusy(true)
    setUpdatingNames(new Set(updates.map(u => u.name.toLowerCase())))
    runUpdateRequest(updates.map(u => u.name), t('updateDone'))
  }, [updateBusy, updates, runUpdateRequest, t])

  const doUpdateOne = useCallback((u: { name: string; from: string; to: string }) => {
    if (updateBusy) return
    setUpdateBusy(true)
    setUpdatingNames(new Set([u.name.toLowerCase()]))
    runUpdateRequest([u.name], t('updateDone'))
  }, [updateBusy, runUpdateRequest, t])

  // ---- 启用/停用、回退、不参与一键更新、商店自身更新 ----
  const skipSet = useMemo(() => new Set((status?.skipUpdates ?? []).map(n => n.toLowerCase())), [status])
  const rollbacks = status?.rollbacks ?? {}
  const stateOf = useCallback((e: MarketEntry): 'live' | 'disabled' | 'restart' | null => {
    const deps = status?.installed ?? {}
    let depName: string | null = null
    for (const n of Object.keys(deps)) {
      if (e.npm !== null && n.toLowerCase() === e.npm.toLowerCase()) { depName = n; break }
      if (n.toLowerCase() === e.name.toLowerCase()) { depName = n; break }
    }
    if (depName === null) return null
    return status?.pluginStates?.[depName] ?? null
  }, [status])

  const doToggle = useCallback((e: MarketEntry) => {
    const deps = status?.installed ?? {}
    let depName: string | null = null
    for (const n of Object.keys(deps)) {
      if (e.npm !== null && n.toLowerCase() === e.npm.toLowerCase()) { depName = n; break }
      if (n.toLowerCase() === e.name.toLowerCase()) { depName = n; break }
    }
    if (depName === null || toggling.has(depName)) return
    const next = stateOf(e) === 'disabled'
    setToggling(prev => new Set(prev).add(depName))
    fetch('/dsh-store/toggle', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: depName, enabled: next }),
    })
      .then(res => res.json())
      .then((body: { ok?: boolean; message?: string; error?: string }) => {
        setToast(body.ok === true ? t('toggleDone') : t('toggleFailed') + ': ' + (body.message ?? body.error ?? ''))
        fetchStatus()
      })
      .catch(() => setToast(t('toggleFailed')))
      .finally(() => setToggling(prev => { const s = new Set(prev); s.delete(depName); return s }))
  }, [status, stateOf, toggling, fetchStatus, t])

  const doRollback = useCallback((e: MarketEntry) => {
    const deps = status?.installed ?? {}
    let depName: string | null = null
    for (const n of Object.keys(deps)) {
      if (e.npm !== null && n.toLowerCase() === e.npm.toLowerCase()) { depName = n; break }
      if (n.toLowerCase() === e.name.toLowerCase()) { depName = n; break }
    }
    if (depName === null || rollbacks[depName] === undefined) return
    setRollbacking(e.name)
    fetch('/dsh-store/rollback', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: depName }),
    })
      .then(res => res.json())
      .then((body: { ok?: boolean; message?: string; error?: string }) => {
        setToast(body.ok === true ? t('rollbackDone') + ' ' + (body.message ?? '') : t('rollbackFailed') + ': ' + (body.message ?? body.error ?? ''))
        fetchStatus()
      })
      .catch(() => setToast(t('rollbackFailed')))
      .finally(() => setRollbacking(null))
  }, [status, rollbacks, fetchStatus, t])

  const doToggleSkip = useCallback((e: MarketEntry) => {
    const deps = status?.installed ?? {}
    let depName: string | null = null
    for (const n of Object.keys(deps)) {
      if (e.npm !== null && n.toLowerCase() === e.npm.toLowerCase()) { depName = n; break }
      if (n.toLowerCase() === e.name.toLowerCase()) { depName = n; break }
    }
    if (depName === null) return
    const next = !skipSet.has(depName.toLowerCase())
    fetch('/dsh-store/skip', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: depName, skip: next }),
    })
      .then(() => fetchStatus())
      .catch(() => setToast(t('toggleFailed')))
  }, [status, skipSet, fetchStatus, t])

  const doSelfUpdate = useCallback(() => {
    if (selfUpdateBusy || status?.selfUpdate?.to == null) return
    setSelfUpdateBusy(true)
    fetch('/dsh-store/self-update', { method: 'POST' })
      .then(res => res.json())
      .then((body: { ok?: boolean; needRestart?: boolean; message?: string; error?: string }) => {
        if (body.ok === true) {
          setSelfUpdateDone(true)
          setToast(t('selfUpdateDone') + (body.needRestart === true ? ' ' + t('restartNeeded') : ''))
        } else {
          setToast(t('selfUpdateFailed') + ': ' + (body.message ?? body.error ?? ''))
        }
        fetchStatus()
      })
      .catch(() => setToast(t('selfUpdateFailed')))
      .finally(() => setSelfUpdateBusy(false))
  }, [selfUpdateBusy, status, fetchStatus, t])

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
        {updates.length > 0 && (
          <button className="pcm-update-all-btn" onClick={doUpdateAll} disabled={updateBusy}>
            {updateBusy ? t('updatingAll') : t('updateAllBtn').replace('{0}', String(updates.length))}
          </button>
        )}
        {status?.selfUpdate?.to != null && !selfUpdateDone && (
          <button className="pcm-self-update-btn" onClick={doSelfUpdate} disabled={selfUpdateBusy}>
            {selfUpdateBusy ? t('updatingAll') : t('selfUpdateBtn').replace('{0}', status.selfUpdate.from).replace('{1}', status.selfUpdate.to)}
          </button>
        )}
        {selfUpdateDone && <span className="pcm-self-update-warn">{t('restartNeeded')}</span>}
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
          className={verifiedOnly ? 'pcm-pill-verified pcm-pill-verified-on' : 'pcm-pill-verified'}
          active={verifiedOnly}
          onClick={() => { setVerifiedOnly(v => !v); setPage(1) }}
        >{t('verifiedOnly')}</Pill>
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
        <div className="pcm-lang-wrap">
          <Menu
            open={langOpen}
            onClose={() => setLangOpen(false)}
            onSelect={id => { setLangChoice(id); setPage(1) }}
            align="end"
            anchor={(
              <button type="button" className={'pcm-lang-btn' + (langOpen ? ' pcm-lang-btn-open' : '')} onClick={() => setLangOpen(o => !o)}>
                <span className="pcm-lang-flag">🌐</span>
                <span className="pcm-lang-label">{LANG_SHORT[langChoice] ?? langChoice.toUpperCase()}</span>
                <span className="pcm-lang-caret" aria-hidden="true" />
              </button>
            )}
            items={langItems}
            selectedId={langChoice}
          />
        </div>
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

      <div className="pcm-scroll" ref={scrollRef}>
      {list.length === 0 ? (
        <div className="pcm-empty">{data === null ? t('loading') : t('empty')}</div>
      ) : (
        <>
          <div className="pcm-grid">
            {pageList.map((entry: MarketEntry) => {
              const installed = isInstalled(entry)
              const today = entry.todayStars
              const upd = updateFor(entry)
              const disclosure = entry.disclosure
              return (
                <div
                  key={(entry.local === true ? 'local:' : '') + entry.owner + '/' + entry.name}
                  className={entry.local === true ? 'pcm-card pcm-card-local' : 'pcm-card'}
                  onClick={() => { if (entry.local !== true) setDetail(entry) }}
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
                      {installed && (
                        <span className={'pcm-state-chip pcm-state-' + (stateOf(entry) ?? 'restart')} title={t('toggleHint')}>
                          {stateOf(entry) === 'disabled' ? t('stateDisabled') : stateOf(entry) === 'restart' ? t('stateRestart') : t('stateLive')}
                        </span>
                      )}
                    </div>
                    <div className="pcm-actions" onClick={e => e.stopPropagation()}>
                      {installed && upd !== null && (
                        <>
                          <span className="pcm-update-versions" title={t('updateHint')}>
                            {upd.from} <span className="pcm-update-arrow">→</span> <span className="pcm-update-new">{upd.to}</span>
                          </span>
                          <Button variant="primary" size="sm" className="pcm-update-btn" disabled={updateBusy} onClick={() => doUpdateOne(upd)}>
                            {updatingNames.has(upd.name.toLowerCase()) ? <span className="pcm-spin"><IconLoadingOutline16 size={14} /></span> : t('updateBtn')}
                          </Button>
                        </>
                      )}
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
                      {entry.local !== true && (
                        <Button variant="outline" size="sm" icon={<IconLinkOutline16 size={14} />} className="pcm-source-btn" onClick={() => window.open(entry.url, '_blank', 'noopener')}>
                          {t('sourceBtn')}
                        </Button>
                      )}
                    </div>
                  </div>
                  {(entry.curated || entry.verified != null || disclosure != null || installed) && (
                    <div className="pcm-safety-row">
                      {entry.curated && <span className="pcm-safety pcm-safety-curated" title={t('curatedBadgeTitle')}>★ {t('curatedBadge')}</span>}
                      {entry.verified != null && <span className="pcm-safety pcm-safety-verified" title={t('verifiedBadgeHint') + ' · ' + entry.verified.by}>✓ {t('verifiedBadge')}</span>}
                      {disclosure != null && <span className="pcm-safety pcm-safety-disclosure" title={t('disclosureBadge')}>🛡 {t('disclosureBadge')}</span>}
                      {installed && (
                        <div className="pcm-safety-controls" onClick={e => e.stopPropagation()}>
                          {entry.local !== true && rollbacks[entry.npm ?? entry.name] !== undefined && (
                            <Button variant="ghost" size="sm" className="pcm-rollback-btn" disabled={rollbacking === entry.name} onClick={() => doRollback(entry)}>
                              {rollbacking === entry.name ? <span className="pcm-spin"><IconLoadingOutline16 size={14} /></span> : t('rollbackBtn')}
                            </Button>
                          )}
                          {entry.local !== true && (
                            <label className="pcm-skip-row" title={t('skipHint')}>
                              <input type="checkbox" checked={skipSet.has((entry.npm ?? entry.name).toLowerCase())} onChange={() => doToggleSkip(entry)} />
                              <span>{t('skipUpdate')}</span>
                            </label>
                          )}
                          {!(entry.npm ?? entry.name).startsWith('@deepseek-ai/') && (entry.npm ?? entry.name) !== 'dsh-store' && (
                            <label className="pcm-switch" title={t('toggleHint')}>
                              <input
                                type="checkbox"
                                checked={stateOf(entry) !== 'disabled'}
                                disabled={toggling.has(entry.npm ?? entry.name)}
                                onChange={() => doToggle(entry)}
                              />
                              <span className="pcm-switch-track" />
                            </label>
                          )}
                        </div>
                      )}
                    </div>
                  )}
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
                      {entry.local === true && <span className="pcm-badge pcm-badge-local">{t('localBadge')}</span>}
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
          <button key={item} className={'pcm-page' + (item === currentPage ? ' on' : '')} aria-current={item === currentPage ? 'page' : undefined} onClick={() => setPage(item)}>{item}</button>
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

      {detail !== null && (
        <DetailPanel
          t={t}
          entry={detail}
          langChoice={langChoice}
          isFav={isFav(detail)}
          isInstalled={isInstalled(detail)}
          installedSpec={installedSpecOf(detail)}
          installing={installing}
          update={updateFor(detail)}
          updating={(() => {
            const u = updateFor(detail)
            return u !== null && updatingNames.has(u.name.toLowerCase())
          })()}
          onToggleFav={() => toggleFav(detail)}
          onInstall={() => setConfirming(detail)}
          onUninstall={() => { if (detail.local === true) setRemovingLocal(detail); else setRemoving(detail) }}
          onUpdate={() => { const u = updateFor(detail); if (u !== null) doUpdateOne(u) }}
          onClose={() => setDetail(null)}
        />
      )}

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
