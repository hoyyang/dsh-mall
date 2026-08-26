/**
 * Plugin detail panel: README (rendered by the official sandboxed MarkdownText
 * — raw HTML disabled, protocol allowlist) plus an info sidebar with versions,
 * metadata, topics, safety badges and actions. README fetches go straight to
 * raw.githubusercontent.com (CORS-enabled) and are cached per repo+lang.
 *
 * v1.7.54 重设计（image-prompt ui-screenshot-system 出稿）：
 * - 删除详情页语言按钮：readmeLang/desc/tags 一律跟随全店 storeLang（langChoice）
 * - 安装区紫色高亮（pcm-install-sec）：渐变底 + 3px 紫左边线 + 圆角，内置主 CTA
 * - 同类相关两行式迷你卡：第 1 行标题、第 2 行 ★star · 开发者
 * - 回到顶部 FAB：.pcm-detail-scroll 滚动 >400px 浮现（业界标准 Material FAB 模式）
 * - 元数据 star 单元格与首页卡片同款样式（pcm-meta-star）
 * - 信息补齐：分类恒显（other 本地化）、近30天下载/总下载、含 skill 徽章；
 *   详情打开时对缺失下载量的条目做一次性富化（/dsh-mall/downloads）
 * - 排版重设计：信任徽章行上移与简介相邻；单滚动容器（无子滚动）保持不变
 */

import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import {
  Button,
  IconCloseOutline16,
  IconCopyOutline16,
  IconLinkOutline16,
  IconLoadingOutline16,
  MarkdownText,
  Modal,
  Tooltip,
} from '@deepseek-ai/dsh-client-ui-primitives'
import { formatDownloads, formatStars, relativeFromNow, type MarketEntry } from './market-data.ts'
import RadarChart from './RadarChart.tsx'

interface ReadmeHit {
  status: 'ok' | 'error' | 'loading'
  text: string
  /** v1.7.45：host 顺带解析的 README 安装命令（展示-only）。 */
  installCmds?: string[]
  cmdSource?: string
}

const readmeCache = new Map<string, ReadmeHit>()

/** 某语言 README 的候选文件名（与 host 富化同表：zh 优先 zh-CN 变体；
 *  常见子目录约定 docs/ 一并探测）。 */
function readmeCandidates(lang: string): string[] {
  const base: string[] = []
  if (lang === 'en') base.push('README.md')
  else if (lang === 'zh') base.push('README.zh-CN.md', 'README.zh.md', 'README.zh_CN.md', 'README.cn.md')
  else base.push('README.' + lang + '.md')
  const out: string[] = []
  for (const f of base) {
    out.push(f)
    out.push('docs/' + f)
  }
  return out
}

/** 把 README 里常见的原始 HTML 结构转为等价 Markdown，并把相对路径
 *  图片/链接改写为 raw.githubusercontent 绝对地址（MarkdownText 的
 *  untrusted 策略只渲染 absolute http(s) 图片——相对路径会整张消失）。 */
function preprocessReadme(md: string, entry: MarketEntry): string {
  const branch = entry.defaultBranch ?? 'main'
  const base = 'https://raw.githubusercontent.com/' + entry.owner + '/' + entry.name + '/' + branch + '/'
  const absolutize = (url: string): string => {
    if (/^(https?:|data:|#)/i.test(url)) return url
    if (url.startsWith('/')) return base + url.replace(/^\//, '')
    return base + url
  }
  return md
    // 先剥掉 HTML 布局容器标签（align=center 等）遗留的行首缩进——
    // 否则整段会被 Markdown 判成缩进代码块（图片/粗体全部变成原文）。
    .replace(/^[ \t]{1,6}(?=\S)/gm, '')
    .replace(/<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/gi, (_m: string, tag: string, inner: string) => '#'.repeat(Number(tag[1])) + ' ' + inner.replace(/\s+/g, ' ').trim())
    .replace(/<p\b[^>]*>/gi, '\n\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<hr\s*\/?>/gi, '\n\n---\n\n')
    .replace(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*\/?>/gi, (_m: string, src: string) => '![image](' + absolutize(src) + ')')
    // 徽章类图片（MarkdownText 不渲染）直接移除，避免显示丑陋原文——
    // 必须在 img 转换之后执行；URL 可能含空格（shields.io 徽章常见）。
    .replace(/<a\b[^>]*>\s*(!\[[^\]]*\]\([^)]*\))\s*<\/a>/gi, (_m: string, inner: string) => {
      const url = (inner.match(/\(([^)]*)\)/) ?? ['', ''])[1] ?? ''
      if (/\.svg(?:\?|#|$)|shields\.io|trendshift|badge/i.test(url)) return ''
      return _m
    })
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m: string, _alt: string, url: string) => {
      if (/\.svg(?:\?|#|$)|shields\.io|trendshift|badge/i.test(url)) return ''
      return _m
    })
    // <a> 转换：非 http(s)（#锚点/mailto）保留文字避免孤立括号。
    .replace(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_m: string, href: string, label: string) => {
      if (!/^https?:/i.test(href)) return label
      return '[' + label + '](' + absolutize(href) + ')'
    })
    // 最后清理遗留空链接与残留图片语法。
    .replace(/\[\s*\]\([^)]+\)/g, '')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, (_m: string) => (/shields\.io|trendshift|badge|\.svg/i.test(_m) ? '' : _m))
    .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_m: string, alt: string, src: string) => '![' + alt + '](' + absolutize(src) + ')')
    .replace(/<(?:strong|b)\b[^>]*>([\s\S]*?)<\/(?:strong|b)>/gi, '**$1**')
    .replace(/<(?:em|i)\b[^>]*>([\s\S]*?)<\/(?:em|i)>/gi, '*$1*')
    .replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, '\`$1\`')
    .replace(/<td\b[^>]*>([\s\S]*?)<\/td>/gi, ' $1 |')
    .replace(/<th\b[^>]*>([\s\S]*?)<\/th>/gi, ' **$1** |')
    .replace(/<tr\b[^>]*>/gi, '\n|')
    .replace(/<(?:table|thead|tbody)\b[^>]*>/gi, '')
    .replace(/<\/(?:tr|table|thead|tbody)>/gi, '\n')
    .replace(/<picture\b[^>]*>/gi, '')
    .replace(/<\/picture>/gi, '')
    .replace(/<source\b[^>]*>/gi, '')
    .replace(/<details\b[^>]*>/gi, '\n\n')
    .replace(/<\/details>/gi, '\n')
    .replace(/<summary\b[^>]*>([\s\S]*?)<\/summary>/gi, '**$1**')
    .replace(/<kbd\b[^>]*>([\s\S]*?)<\/kbd>/gi, '\`$1\`')
    .replace(/<a\b(?=[^>]*\bid=["'])[^>]*>([\s\S]*?)<\/a>/gi, '$1')
    .replace(/<\/(?:div|span|center|font|sub|sup|small|del|ins|u|s)>/gi, '')
    .replace(/<(?:div|span|center|font|sub|sup|small|del|ins|u|s)\b[^>]*>/gi, '')
}

async function fetchReadme(entry: MarketEntry, lang: string): Promise<ReadmeHit> {
  const branch = entry.defaultBranch ?? 'main'
  // v1.7.89：一次请求由 host 并行探测该语言候选 README（不再客户端串行逐文件试）；
  // 12s 硬超时，超时/失败可重试，不再无限「正在加载 README…」。
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 12_000)
  let lastError = ''
  try {
    const res = await fetch('/dsh-mall/readme?repo=' + encodeURIComponent(entry.owner + '/' + entry.name) + '&lang=' + encodeURIComponent(lang) + '&branch=' + encodeURIComponent(branch), { signal: ctrl.signal })
    if (res.ok) {
      const body = await res.json() as { ok?: boolean; text?: string; installCmds?: string[]; cmdSource?: string }
      if (body.ok === true && typeof body.text === 'string') {
        const hit: ReadmeHit = { status: 'ok', text: preprocessReadme(body.text.slice(0, 200_000), entry) }
        if (Array.isArray(body.installCmds) && body.installCmds.length > 0) {
          hit.installCmds = body.installCmds
          hit.cmdSource = body.cmdSource ?? 'readme'
        }
        return hit
      }
      lastError = body.text ?? 'readme unavailable'
    } else {
      lastError = 'HTTP ' + res.status
    }
  } catch (err) {
    lastError = ctrl.signal.aborted ? 'timeout' : (err instanceof Error ? err.message : String(err))
  } finally {
    clearTimeout(timer)
  }
  return { status: 'error', text: lastError }
}

function useReadme(entry: MarketEntry, lang: string): { hit: ReadmeHit; retry: () => void } {
  const [tick, setTick] = useState(0)
  const [state, setState] = useState<ReadmeHit>(() => {
    const hit = readmeCache.get(entry.owner + '/' + entry.name + '#' + lang)
    return hit ?? { status: 'loading', text: '' }
  })
  useEffect(() => {
    const key = entry.owner + '/' + entry.name + '#' + lang
    const hit = readmeCache.get(key)
    if (hit !== undefined) {
      setState(hit)
      return
    }
    let alive = true
    setState({ status: 'loading', text: '' })
    void fetchReadme(entry, lang).then(result => {
      readmeCache.set(key, result)
      if (alive) setState(result)
    })
    return () => { alive = false }
  }, [entry, lang, tick])
  const retry = useCallback(() => {
    const key = entry.owner + '/' + entry.name + '#' + lang
    readmeCache.delete(key)
    setTick(t => t + 1)
  }, [entry, lang])
  return { hit: state, retry }
}

/** Disclosure summary lines, e.g. "cloud", "network", "offline only". */
function disclosureSummary(d: NonNullable<MarketEntry['disclosure']>, t: (key: string) => string): string[] {
  const out: string[] = []
  if (d.cloud === 'none') out.push(t('discCloudNone'))
  else if (d.cloud !== null && d.cloud !== undefined && d.cloud !== '') out.push(t('discCloud') + ': ' + d.cloud)
  if (d.network === 'none') out.push(t('discNetNone'))
  else if (d.network !== null && d.network !== undefined && d.network !== '') out.push(t('discNetwork') + ': ' + d.network)
  if (d.offlineMode === true) out.push(t('discOffline'))
  if (Array.isArray(d.apiKeys) && d.apiKeys.length > 0) out.push(t('discApiKeys') + ': ' + d.apiKeys.join(', '))
  if (d.jurisdiction !== null && d.jurisdiction !== undefined && d.jurisdiction !== '') out.push(t('discJurisdiction') + ': ' + d.jurisdiction)
  if (d.retention !== null && d.retention !== undefined && d.retention !== '') out.push(t('discRetention') + ': ' + d.retention)
  return out
}

/** 回到顶部 FAB：业界标准 Material FAB 模式——容器滚动 >400px 才浮现，
 *  opacity + translateY 过渡，点击 smooth 回顶。 */
function BackToTop(props: { target: RefObject<HTMLDivElement | null>; label: string }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const el = props.target.current
    if (!el) return
    // v1.7.55：滚动事件+定时兜底双通道——后台标签里滚动事件与 rAF 都会被浏览器
    // 冻结（按钮永不浮现）；setInterval 在后台仍以 ≥1s 节拍触发，保证任何场景可用。
    const update = () => setShow(el.scrollTop > 400)
    el.addEventListener('scroll', update, { passive: true })
    update()
    const timer = window.setInterval(update, 1200)
    return () => {
      el.removeEventListener('scroll', update)
      window.clearInterval(timer)
    }
  }, [props.target])
  return (
    <button
      type="button"
      className={show ? 'pcm-backtop pcm-backtop-show' : 'pcm-backtop'}
      title={props.label}
      aria-label={props.label}
      onClick={() => { const el = props.target.current; if (el !== null && el !== undefined) { el.scrollTo({ top: 0, behavior: 'auto' }); el.scrollTop = 0 } }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  )
}

export function DetailPanel(props: {
  t: (key: string) => string
  entry: MarketEntry
  langChoice: string
  /** v1.7.54：分类显示名（registry.categories 本地化；首页卡片同款）。 */
  categoryLabel: (cat: string) => string
  isFav: boolean
  isInstalled: boolean
  installedSpec: string | null
  installing: boolean
  update: { name: string; from: string; to: string } | null
  updating: boolean
  related: MarketEntry[]
  onOpenEntry: (e: MarketEntry) => void
  onToggleFav: () => void
  onInstall: () => void
  onUninstall: () => void
  onUpdate: () => void
  onClose: () => void
}) {
  const { t, entry, langChoice } = props
  // v1.7.54：删除详情页语言按钮——readmeLang 一律跟随全店语言 langChoice
  const { hit: readme, retry: retryReadme } = useReadme(entry, langChoice)
  // v1.7.53：打标简介优先（LLM 多语言一句话），其次索引 README.<lang> 首段，最后英文兜底
  const desc = (entry.tagDescriptions?.[langChoice] && entry.tagDescriptions[langChoice] !== '')
    ? entry.tagDescriptions[langChoice]
    : (langChoice !== 'en' && entry.descriptions?.[langChoice] ? entry.descriptions[langChoice] : entry.description)
  const disclosure = entry.disclosure
  const discLines = useMemo(() => (disclosure == null ? [] : disclosureSummary(disclosure, t)), [disclosure, t])
  const [copied, setCopied] = useState(false)
  // v1.7.45：五维评分——目录基础分即时可用；README 富化经 /dsh-mall/scores 补全。
  const [score, setScore] = useState<MarketEntry['score'] | null>(entry.score ?? null)
  useEffect(() => {
    if (entry.score != null && entry.score.complete) {
      setScore(entry.score)
      return
    }
    let alive = true
    fetch('/dsh-mall/scores', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ items: [{ repo: entry.owner + '/' + entry.name, branch: entry.defaultBranch ?? 'main' }] }),
    })
      .then(res => res.json())
      .then((body: { scores?: Record<string, { score: MarketEntry['score'] | null }> }) => {
        const hit = body.scores?.[entry.owner + '/' + entry.name]?.score
        if (alive && hit != null) setScore(hit)
      })
      .catch(() => {})
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry.owner, entry.name, entry.defaultBranch, entry.score])

  // v1.7.54：详情打开时对缺失下载量的条目做一次性富化（home 富化按页，
  // 详情入口独立补拉，保证「信息补齐 ≥ 卡片」）。
  const [downloadsHit, setDownloadsHit] = useState<{ d: number | null; t: number | null } | null>(null)
  useEffect(() => {
    if (entry.downloads !== null && entry.downloads !== undefined) return
    if (entry.npm === null || entry.npmLinked === false) return
    let alive = true
    fetch('/dsh-mall/downloads', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ names: [entry.npm] }),
    })
      .then(res => res.json())
      .then((body: { downloads?: Record<string, number | null>; totals?: Record<string, number | null> }) => {
        const got = body.downloads ?? {}
        const totals = body.totals ?? {}
        const d = got[entry.npm as string]
        const t = totals[entry.npm as string]
        if (alive && (d !== undefined || t !== undefined)) setDownloadsHit({ d: d ?? null, t: t ?? null })
      })
      .catch(() => {})
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry.owner, entry.name, entry.npm, entry.npmLinked, entry.downloads])

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const copyCmd = () => {
    const cmd = entry.npmLinked === false || entry.npm === null ? 'dsh plugin add github:' + entry.owner + '/' + entry.name : 'dsh plugin add ' + entry.npm
    void navigator.clipboard?.writeText(cmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  const d30 = downloadsHit?.d ?? (typeof entry.downloads === 'number' ? entry.downloads : null)
  const dTotal = downloadsHit?.t ?? (typeof entry.totalDownloads === 'number' ? entry.totalDownloads : null)
  // v1.7.54：元数据——分类恒显（other 本地化）；下载量缺失时显示占位
  const meta: Array<[string, string | null]> = [
    [t('detailStars'), formatStars(entry.stars)],
    [t('todayGain'), entry.todayStars === null ? '—' : (entry.todayStars >= 0 ? '+' : '') + String(entry.todayStars)],
    [t('detailCategory'), entry.category === '' ? null : props.categoryLabel(entry.category)],
    [t('downloads30Label'), d30 !== null ? formatDownloads(d30) : (entry.npm !== null && entry.npmLinked !== false ? '—' : null)],
    [t('totalDownloadsLabel'), dTotal !== null ? formatDownloads(dTotal) : (entry.npm !== null && entry.npmLinked !== false ? '—' : null)],
    [t('detailCreated'), entry.created === null ? null : relativeFromNow(entry.created, t)],
    [t('updatedShort'), entry.pushed === null ? null : relativeFromNow(entry.pushed, t)],
    [t('detailLanguage'), entry.language],
    [t('detailLicense'), entry.license],
  ]
  const targets: Array<[string, string | null]> = meta.filter(([, v]) => v !== null && v !== '') as Array<[string, string | null]>
  const tags = langChoice === 'zh' ? (entry.tagsZh ?? []) : ((entry.tagsEn ?? []).length > 0 ? (entry.tagsEn ?? []) : (entry.tagsZh ?? []))

  return (
    <Modal
      open
      onClose={props.onClose}
      title={entry.name}
      closeLabel={t('close')}
      headless
      className="pcm-detail-modal"
    >
      <div className="pcm-detail-scroll" ref={scrollRef}>
      <div className="pcm-detail">
        <div className="pcm-detail-main">
          <div className="pcm-detail-head">
            <div className="pcm-av" style={{ background: '#4d6bfe' }}>
              {(entry.name.replace(/^dsh[-_]/i, '').charAt(0) || 'P').toUpperCase()}
              {entry.avatar !== '' && (
                <img className="pcm-av-img" src={entry.avatar} alt="" loading="lazy" onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
              )}
            </div>
            <div className="pcm-detail-titles">
              <span className="pcm-detail-name">{entry.name}</span>
              <span className="pcm-detail-owner">{entry.owner}/{entry.name}</span>
            </div>
            <button
              className={props.isFav ? 'pcm-fav-star pcm-fav-on' : 'pcm-fav-star'}
              title={t('favAdd')}
              onClick={props.onToggleFav}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                  fill={props.isFav ? '#f59e0b' : 'transparent'}
                  stroke="#d99a1f"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="pcm-detail-actions">
              {props.isInstalled ? (
                <>
                  <Button variant="outline" size="sm" disabled className="pcm-installed-tag">{t('installed')}</Button>
                  {props.update != null && (
                    <Button variant="primary" size="sm" className="pcm-update-btn" disabled={props.updating} onClick={props.onUpdate}>
                      {props.updating ? <span className="pcm-spin"><IconLoadingOutline16 size={14} /></span> : t('updateBtn')}
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="pcm-uninstall-btn" onClick={props.onUninstall}>{t('uninstall')}</Button>
                </>
              ) : (
                <Button variant="primary" size="sm" disabled={props.installing} onClick={props.onInstall}>
                  {props.installing ? <span className="pcm-spin"><IconLoadingOutline16 size={14} /></span> : t('install')}
                </Button>
              )}
              <Button variant="outline" size="sm" className="pcm-source-btn" icon={<IconLinkOutline16 size={14} />} onClick={() => window.open(entry.url, '_blank', 'noopener')}>
                {t('sourceBtn')}
              </Button>
              <Button variant="ghost" size="sm" icon={<IconCloseOutline16 size={14} />} onClick={props.onClose} className="pcm-detail-close" title={t('close')} />
            </div>
          </div>

          <div className="pcm-detail-desc">{desc === '' ? '—' : desc}</div>

          {/* v1.7.57：信任徽章行——与首页卡片徽章内容/图标/样式完全一致（curated/verified/scanned/skill/disclosure），manual/non-plugin 为详情页补充徽章 */}
          {(entry.curated || entry.verified != null || disclosure != null || entry.hasSkill === true || entry.bundled === true || entry.installable != null) && (
            <div className="pcm-detail-safety">
              {entry.curated && (
                <span className="pcm-safety pcm-safety-curated" title={t('curatedBadgeTitle')}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4L12 17.4l-5.8 3 1.1-6.4-4.7-4.6 6.5-.9z" /></svg>
                  {t('curatedBadge')}
                </span>
              )}
              {entry.hasSkill === true && (
                <span className="pcm-safety pcm-safety-skill" title={t('skillBadgeHint')}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3.6 2.8 9.3l9.2 5.7 9.2-5.7z" /><path d="M6.6 12.3v4.2c0 1.6 2.4 2.9 5.4 2.9s5.4-1.3 5.4-2.9v-4.2" /><path d="M21.2 9.3v5.4" /></svg>
                  {t('skillBadge')}
                </span>
              )}
              {entry.verified != null && (
                <span className="pcm-safety pcm-safety-verified" title={t('verifiedBadgeHint') + ' · ' + entry.verified.by}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="7.6" r="3.4" /><path d="M5.6 20.2c1.1-3.4 3.6-5.1 6.4-5.1s5.3 1.7 6.4 5.1c.3.8-.3 1.6-1.1 1.6H6.7c-.8 0-1.4-.8-1.1-1.6z" /></svg>
                  {t('verifiedBadge')}
                </span>
              )}
              {entry.bundled === true && (
                <span className="pcm-safety pcm-safety-scanned" title={t('scannedBadgeHint')}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2.4l7.5 2.8v5.6c0 4.7-3.2 8.7-7.5 10.2-4.3-1.5-7.5-5.5-7.5-10.2V5.2l7.5-2.8z" /><path d="M9 11.6l2 2 4-4.2" /></svg>
                  {t('scannedBadge')}
                </span>
              )}
              {disclosure != null && (
                <span className="pcm-safety pcm-safety-disclosure" title={discLines.length > 0 ? discLines.join('\n') : t('disclosureBadge')}>
                  🛡 {t('disclosureBadge')}
                </span>
              )}
              {entry.installable === 'manual' && <span className="pcm-safety pcm-safety-manual">⚙ {t('manualInstall')}</span>}
              {entry.installable === 'non-plugin' && <span className="pcm-safety pcm-safety-nonplugin">⊘ {t('nonpluginBadge')}</span>}
            </div>
          )}

          {/* v1.7.54：安装区紫色高亮——整块重点行动区 */}
          <div className="pcm-detail-sec pcm-install-sec">
            <div className="pcm-detail-sec-title pcm-install-sec-title">{t('detailInstall')}</div>
            <div className="pcm-install-cmdrow">
              <div className="pcm-detail-cmdrow">
                <div className="pcm-cmd">{entry.npm !== null ? 'dsh plugin add ' + entry.npm : 'dsh plugin add github:' + entry.owner + '/' + entry.name}</div>
                <Tooltip label={copied ? t('publishCopied') : t('detailCopy')}>
                  <Button variant="ghost" size="sm" icon={<IconCopyOutline16 size={14} />} onClick={copyCmd} />
                </Tooltip>
              </div>
            </div>
            {/* v1.7.45：README 安装命令（host 解析，展示-only，可复制） */}
            {(readme.installCmds ?? []).length > 0 ? (
              <div className="pcm-readme-cmds">
                <div className="pcm-readme-cmds-title">
                  {t('readmeCmdsTitle')}
                  <span className="pcm-readme-cmds-src">{readme.cmdSource === 'readme-section' ? t('readmeCmdsFromSection') : t('readmeCmdsFromReadme')}</span>
                </div>
                {(readme.installCmds ?? []).map(cmd => (
                  <div key={cmd} className="pcm-cmdrow">
                    <div className="pcm-cmd pcm-readme-cmd">{cmd}</div>
                    <Tooltip label={t('detailCopy')}>
                      <Button variant="ghost" size="sm" icon={<IconCopyOutline16 size={14} />} onClick={() => { void navigator.clipboard?.writeText(cmd) }} />
                    </Tooltip>
                  </div>
                ))}
              </div>
            ) : readme.status === 'ok' && (
              <div className="pcm-readme-cmds-note">{t('readmeCmdsNone')}</div>
            )}
            {/* v1.7.29：安装三通道注释 + 收录日 */}
            <div className="pcm-detail-channels">
              <div>{t('channelNpm')}</div>
              <div>{t('channelTarball')}</div>
              <div>{t('channelSource')}</div>
            </div>
            {entry.created !== null && (
              <div className="pcm-detail-added">{t('detailAdded').replace('{0}', entry.created.slice(0, 10))}</div>
            )}
            <div className="pcm-detail-linkrow">
              <a className="pcm-detail-link" href={entry.url} target="_blank" rel="noopener noreferrer">{t('openRepo')} ↗</a>
              {entry.verified != null && entry.verified.reportUrl != null && entry.verified.reportUrl !== '' && (
                <a className="pcm-detail-link" href={entry.verified.reportUrl} target="_blank" rel="noopener noreferrer">{t('verifiedReport')} ↗</a>
              )}
            </div>
          </div>

          {/* v1.7.45：实用评分卡片——总分+置信度+五维条+为什么推荐+雷达图 */}
          {score != null && score.total !== null && (
            <div className="pcm-score-card" title={t('scoreCardHint')}>
              <div className="pcm-score-main">
                <div className="pcm-score-head">
                  <span className="pcm-score-title">{t('scoreTitle')}</span>
                  <span className="pcm-score-conf">{t('scoreConfidence')} {Math.round(score.confidence * 100)}%</span>
                </div>
                {(langChoice === 'zh' ? score.explanation.zh : score.explanation.en) !== '' && (
                  <div className="pcm-score-why">
                    <span className="pcm-score-why-label">{t('scoreWhyTitle')}：</span>
                    {langChoice === 'zh' ? score.explanation.zh : score.explanation.en}
                  </div>
                )}
                {/* v1.7.69：热度维过低时明示几何平均的惩罚效应（新仓库高分四维但总分
                    很低的原因——乘法融合下 0 热度维把总分强力拉低，随 star 增长回升）。 */}
                {score.breakdown.popularity !== null && score.breakdown.popularity <= 20 && (
                  <div className="pcm-score-note">
                    {langChoice === 'zh'
                      ? '热度维当前 ' + score.breakdown.popularity + ' 分——综合分是五维加权几何平均（乘法融合），任一维接近 0 都会强力拉低总分；仓库获得 star 后热度维回升，总分将显著上涨。'
                      : 'Popularity is ' + score.breakdown.popularity + '/100 — the composite score is a weighted geometric mean, so one near-zero dimension pulls the total down hard; it rises quickly as the repo earns stars.'}
                  </div>
                )}
                <div className="pcm-score-bars">
                  {([
                    ['maintain', t('scoreDimMaintain'), score.breakdown.maintain],
                    ['practical', t('scoreDimPractical'), score.breakdown.practical],
                    ['popularity', t('scoreDimPopularity'), score.breakdown.popularity],
                    ['ease', t('scoreDimEase'), score.breakdown.ease],
                    ['signal', t('scoreDimSignal'), score.breakdown.signal],
                  ] as const).map(([key, label, v]) => (
                    <div className="pcm-score-bar" key={key}>
                      <span className="pcm-score-dim">{label}</span>
                      <div className="pcm-score-track">
                        <div className="pcm-score-fill" style={{ width: (v === null ? 0 : v) + '%' }} />
                      </div>
                      <b className="pcm-score-val">{v === null ? t('scorePending') : v}</b>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pcm-score-radar">
                <RadarChart
                  breakdown={score.breakdown}
                  total={score.total}
                  tooltipLang={langChoice === 'zh' ? 'zh' : 'en'}
                  size={184}
                  labels={{
                    maintain: t('scoreDimMaintain'),
                    practical: t('scoreDimPractical'),
                    popularity: t('scoreDimPopularity'),
                    ease: t('scoreDimEase'),
                    signal: t('scoreDimSignal'),
                  }}
                  totalLabel={t('scoreTotalLabel')}
                />
              </div>
            </div>
          )}

          {entry.dormant === true && (
            <div className="pcm-risk pcm-risk-community">{props.t('dormantHint')}</div>
          )}
          {entry.npmLinked === false && (
            <div className="pcm-risk pcm-risk-community">{props.t('npmUnlinkedHint')}</div>
          )}

          <div className="pcm-detail-readme">
            {readme.status === 'loading' && (
              <div className="pcm-detail-readme-note"><span className="pcm-spin"><IconLoadingOutline16 size={14} /></span> {t('readmeLoading')}</div>
            )}
            {readme.status === 'error' && (
              <div className="pcm-detail-readme-note">
                {t('readmeFailed')} <button type="button" className="pcm-detail-link" onClick={retryReadme}>{t('readmeRetry')}</button> · <a className="pcm-detail-link" href={entry.url} target="_blank" rel="noopener noreferrer">{t('openRepo')} ↗</a>
              </div>
            )}
            {readme.status === 'ok' && (
              <div className="pcm-detail-md"><MarkdownText text={readme.text} /></div>
            )}
          </div>
        </div>

        <div className="pcm-detail-side">
          <div className="pcm-detail-sec">
            <div className="pcm-detail-sec-title">{t('detailVersion')}</div>
            {entry.version != null && (
              <div className="pcm-detail-verline">
                <span className="pcm-detail-verlabel">{t('detailRepoVer')}</span>
                <span className="pcm-detail-ver">{entry.version}</span>
              </div>
            )}
            {entry.npmVersion != null && (
              <div className="pcm-detail-verline">
                <span className="pcm-detail-verlabel">{t('detailNpmVer')}</span>
                <span className="pcm-detail-ver pcm-detail-ver-new">{entry.npmVersion}</span>
              </div>
            )}
            {props.installedSpec != null && (
              <div className="pcm-detail-verline">
                <span className="pcm-detail-verlabel">{t('detailInstalledVer')}</span>
                <span className="pcm-detail-ver">{props.installedSpec}</span>
              </div>
            )}
            {props.update != null && (
              <div className="pcm-detail-update-note">
                {props.update.from} <span className="pcm-update-arrow">→</span> <span className="pcm-update-new">{props.update.to}</span>
              </div>
            )}
          </div>

          {targets.length > 0 && (
            <div className="pcm-detail-sec">
              <div className="pcm-detail-sec-title">{t('detailMeta')}</div>
              <div className="pcm-detail-grid">
                {targets.map(([k, v]) => (
                  <div className="pcm-detail-cell" key={k}>
                    <span className="pcm-detail-cellk">{k}</span>
                    {/* v1.7.54：star 单元格与首页卡片同款样式 */}
                    <span className={k === t('detailStars') ? 'pcm-detail-cellv pcm-meta-star' : 'pcm-detail-cellv'}>{k === t('detailStars') ? '★ ' + v : v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {((entry.topics ?? []).length > 0 || tags.length > 0) && (
            <div className="pcm-detail-sec">
              <div className="pcm-detail-sec-title">{t('detailTopics')}</div>
              <div className="pcm-detail-topics">
                {tags.map(tp => <span key={'tag-' + tp} className="pcm-detail-topic pcm-detail-tag">{tp}</span>)}
                {(entry.topics ?? []).map(tp => <span key={tp} className="pcm-detail-topic">{tp}</span>)}
              </div>
            </div>
          )}

          {props.related.length > 0 && (
            <div className="pcm-detail-sec">
              <div className="pcm-detail-sec-title">{t('detailRelated')}</div>
              <div className="pcm-related-list">
                {props.related.map(r => (
                  <button key={r.owner + '/' + r.name} type="button" className="pcm-detail-related" onClick={() => props.onOpenEntry(r)}>
                    <span className="pcm-related-title">{r.name}</span>
                    {/* v1.7.57：中间一行简介（打标多语言优先，左对齐） */}
                    <span className="pcm-related-desc">{(r.tagDescriptions?.[langChoice] && r.tagDescriptions[langChoice] !== '') ? r.tagDescriptions[langChoice] : ((langChoice !== 'en' && r.descriptions?.[langChoice] && r.descriptions[langChoice] !== '') ? r.descriptions[langChoice] : (r.description === '' ? '—' : r.description))}</span>
                    <span className="pcm-related-sub">
                      <span className="pcm-related-stars">★ {formatStars(r.stars)}</span>
                      <span className="pcm-related-dev">{r.owner}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
      </div>
      <BackToTop target={scrollRef} label={t('backTop')} />
    </Modal>
  )
}