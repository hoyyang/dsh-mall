/**
 * Plugin detail panel: README (rendered by the official sandboxed MarkdownText
 * — raw HTML disabled, protocol allowlist) plus an info sidebar with versions,
 * metadata, topics, safety badges and actions. README fetches go straight to
 * raw.githubusercontent.com (CORS-enabled) and are cached per repo+lang.
 */

import { useEffect, useMemo, useState } from 'react'
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
import { formatStars, relativeFromNow, type MarketEntry } from './market-data.ts'

const readmeCache = new Map<string, { status: 'ok' | 'error'; text: string }>()

/** 探测仓库实际提供的 README 语言（Range 请求只要 64 字节，零 API 额度）。 */
const LANG_PROBE = ['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ru'] as const
const langProbeCache = new Map<string, string[]>()

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

async function probeReadmeLangs(entry: MarketEntry): Promise<string[]> {
  const key = entry.owner + '/' + entry.name
  const hit = langProbeCache.get(key)
  if (hit !== undefined) return hit
  const branch = entry.defaultBranch ?? 'main'
  const checks = await Promise.all(LANG_PROBE.map(async lang => {
    for (const file of readmeCandidates(lang)) {
      try {
        const res = await fetch('https://raw.githubusercontent.com/' + entry.owner + '/' + entry.name + '/' + branch + '/' + file, {
          headers: { range: 'bytes=0-63' },
          signal: AbortSignal.timeout(8_000),
        })
        if (res.status === 200 || res.status === 206) return lang as string
      } catch {
        /* 尝试下一个候选 */
      }
    }
    return null
  }))
  const langs: string[] = []
  for (const l of checks) if (l !== null) langs.push(l)
  langProbeCache.set(key, langs)
  return langs
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
    // 徽章常被链接包裹（HTML <a><img badge></a> 或 md [![badge](badge-url)](site-url)）——
    // 必须在 <a> 转换之前整块删除，否则会残留「](url)」与孤立括号。
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

async function fetchReadme(entry: MarketEntry, lang: string): Promise<{ status: 'ok' | 'error'; text: string }> {
  const branch = entry.defaultBranch ?? 'main'
  const candidates = [...readmeCandidates(lang), 'README.md']
  let lastError = ''
  for (const file of candidates) {
    const url = 'https://raw.githubusercontent.com/' + entry.owner + '/' + entry.name + '/' + branch + '/' + file
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(12_000), headers: { accept: 'text/plain' } })
      if (res.ok) {
        const text = await res.text()
        return { status: 'ok', text: preprocessReadme(text.slice(0, 200_000), entry) }
      }
      lastError = 'HTTP ' + res.status
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err)
    }
  }
  return { status: 'error', text: lastError }
}

function useReadme(entry: MarketEntry, lang: string): { status: 'loading' | 'ok' | 'error'; text: string } {
  const [state, setState] = useState<{ status: 'loading' | 'ok' | 'error'; text: string }>(() => {
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
  }, [entry, lang])
  return state
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

export function DetailPanel(props: {
  t: (key: string) => string
  entry: MarketEntry
  langChoice: string
  isFav: boolean
  isInstalled: boolean
  installedSpec: string | null
  installing: boolean
  update: { name: string; from: string; to: string } | null
  updating: boolean
  onToggleFav: () => void
  onInstall: () => void
  onUninstall: () => void
  onUpdate: () => void
  onClose: () => void
}) {
  const { t, entry, langChoice } = props
  const [readmeLangs, setReadmeLangs] = useState<string[]>([])
  const [readmeLang, setReadmeLang] = useState<string>(langChoice)
  useEffect(() => {
    let alive = true
    void probeReadmeLangs(entry).then(langs => {
      if (!alive) return
      setReadmeLangs(langs)
      if (langs.length > 0 && !langs.includes(readmeLang)) setReadmeLang(langs.includes(langChoice) ? langChoice : 'en')
    })
    return () => { alive = false }
  }, [entry, langChoice, readmeLang])
  const readme = useReadme(entry, readmeLang)
  const desc = readmeLang !== 'en' && entry.descriptions?.[readmeLang] ? entry.descriptions[readmeLang] : entry.description
  const disclosure = entry.disclosure
  const discLines = useMemo(() => (disclosure == null ? [] : disclosureSummary(disclosure, t)), [disclosure, t])
  const [copied, setCopied] = useState(false)
  const LANG_LABELS: Record<string, string> = { en: 'English', zh: '中文', ja: '日本語', ko: '한국어', es: 'Español', fr: 'Français', de: 'Deutsch', pt: 'Português', ru: 'Русский' }
  const copyCmd = () => {
    const cmd = entry.npm !== null ? 'dsh plugin add ' + entry.npm : 'dsh plugin add github:' + entry.owner + '/' + entry.name
    void navigator.clipboard?.writeText(cmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  const meta: Array<[string, string | null]> = [
    [t('detailStars'), formatStars(entry.stars)],
    [t('todayGain'), entry.todayStars === null ? '—' : (entry.todayStars >= 0 ? '+' : '') + String(entry.todayStars)],
    [t('detailCreated'), entry.created === null ? null : relativeFromNow(entry.created, t)],
    [t('updatedShort'), entry.pushed === null ? null : relativeFromNow(entry.pushed, t)],
    [t('detailLanguage'), entry.language],
    [t('detailLicense'), entry.license],
  ]
  const targets: Array<[string, string | null]> = meta.filter(([, v]) => v !== null && v !== '') as Array<[string, string | null]>

  return (
    <Modal
      open
      onClose={props.onClose}
      title={entry.name}
      closeLabel={t('close')}
      headless
      className="pcm-detail-modal"
    >
      <div className="pcm-detail-scroll">
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
            {readmeLangs.length > 1 && (
              <label className="pcm-lang-select-wrap" title={t('langToggle')}>
                <span className="pcm-lang-flag">🌐</span>
                <select
                  className="pcm-lang-select"
                  value={readmeLang}
                  onChange={e => setReadmeLang(e.target.value)}
                >
                  {readmeLangs.map(l => (
                    <option key={l} value={l}>{LANG_LABELS[l] ?? l}</option>
                  ))}
                </select>
              </label>
            )}
            <div className="pcm-detail-actions">
              {props.isInstalled ? (
                <>
                  {props.update != null && (
                    <Button variant="primary" size="sm" className="pcm-update-btn" disabled={props.updating} onClick={props.onUpdate}>
                      {props.updating ? <span className="pcm-spin"><IconLoadingOutline16 size={14} /></span> : t('updateBtn')}
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="pcm-uninstall-btn" onClick={props.onUninstall}>{t('uninstall')}</Button>
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
          {entry.excluded != null && (
            <div className="pcm-risk pcm-risk-nonplugin" title={entry.excluded.reason}>
              {props.t('excludedHint').replace('{0}', entry.excluded.reason)}
            </div>
          )}
          {(entry.bundled !== undefined && entry.bundled !== null) && (
            <div className={entry.bundled ? 'pcm-risk pcm-risk-curated' : 'pcm-risk pcm-risk-nonplugin'}>
              {entry.bundled ? props.t('scannedBadgeHint') + (entry.bundledAt !== undefined && entry.bundledAt !== null ? ' · ' + entry.bundledAt : '') : props.t('scanFailHint')}
            </div>
          )}
          {entry.dormant === true && (
            <div className="pcm-risk pcm-risk-community">{props.t('dormantHint')}</div>
          )}
          {entry.npmLinked === false && (
            <div className="pcm-risk pcm-risk-community">{props.t('npmUnlinkedHint')}</div>
          )}

          {(entry.verified != null || disclosure != null || entry.installable != null) && (
            <div className="pcm-detail-safety">
              {entry.verified != null && (
                <span className="pcm-safety pcm-safety-verified" title={t('verifiedHintTitle').replace('{0}', entry.verified.by + (entry.verified.at !== '' ? ' · ' + entry.verified.at.slice(0, 10) : ''))}>
                  ✓ {t('verifiedBadge')}
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

          <div className="pcm-detail-readme">
            {readme.status === 'loading' && (
              <div className="pcm-detail-readme-note"><span className="pcm-spin"><IconLoadingOutline16 size={14} /></span> {t('readmeLoading')}</div>
            )}
            {readme.status === 'error' && (
              <div className="pcm-detail-readme-note">
                {t('readmeFailed')} <a className="pcm-detail-link" href={entry.url} target="_blank" rel="noopener noreferrer">{t('openRepo')} ↗</a>
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
                    <span className="pcm-detail-cellv">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(entry.topics ?? []).length > 0 && (
            <div className="pcm-detail-sec">
              <div className="pcm-detail-sec-title">{t('detailTopics')}</div>
              <div className="pcm-detail-topics">
                {(entry.topics ?? []).map(tp => <span key={tp} className="pcm-detail-topic">{tp}</span>)}
              </div>
            </div>
          )}

          <div className="pcm-detail-sec">
            <div className="pcm-detail-sec-title">{t('detailInstall')}</div>
            <div className="pcm-detail-cmdrow">
              <div className="pcm-cmd">{entry.npm !== null ? 'dsh plugin add ' + entry.npm : 'dsh plugin add github:' + entry.owner + '/' + entry.name}</div>
              <Tooltip label={copied ? t('publishCopied') : t('detailCopy')}>
                <Button variant="ghost" size="sm" icon={<IconCopyOutline16 size={14} />} onClick={copyCmd} />
              </Tooltip>
            </div>
            <div className="pcm-detail-linkrow">
              <a className="pcm-detail-link" href={entry.url} target="_blank" rel="noopener noreferrer">{t('openRepo')} ↗</a>
              {entry.verified != null && entry.verified.reportUrl != null && entry.verified.reportUrl !== '' && (
                <a className="pcm-detail-link" href={entry.verified.reportUrl} target="_blank" rel="noopener noreferrer">{t('verifiedReport')} ↗</a>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </Modal>
  )
}
