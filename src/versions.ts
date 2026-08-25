/**
 * 仓库版本号按需富化（v1.7.12）：对 npm 未发布（npmVersion=null）且索引
 * 根 package.json 无 version 的条目（如 WeKnora monorepo），按需查 GitHub
 * Releases latest 的 tag_name 作为版本号展示。
 * - API：api.github.com/repos/<repo>/releases/latest（单仓 1 请求，带 token
 *   时额度充足；匿名 60/h，缓存后翻页成本可忽略）
 * - 缓存：profile dsh-mall/state.json（repoVersions），TTL 24h
 * - 上限：单次 24 仓（翻页一屏量）
 */

import { readState, writeState } from './catalog.ts'

const TTL_MS = 24 * 60 * 60 * 1000
const TTL_NULL_MS = 60 * 60 * 1000
const FETCH_TIMEOUT_MS = 12_000
const MAX_REPOS = 24

const REPO_RE = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/

export async function ensureRepoVersions(profile: string, token: string, rawRepos: string[]): Promise<Record<string, string | null>> {
  const repos = [...new Set(rawRepos.filter(r => REPO_RE.test(r)))].slice(0, MAX_REPOS)
  const out: Record<string, string | null> = {}
  if (repos.length === 0) return out
  const state = readState(profile)
  const cache = state.repoVersions ?? {}
  const now = Date.now()
  for (const repo of repos) {
    const key = repo.toLowerCase()
    const hit = cache[key]
    if (hit !== undefined && now - hit.at < (hit.value === null ? TTL_NULL_MS : TTL_MS)) {
      out[repo] = hit.value
      continue
    }
    try {
      // tags 端点（per_page=1 最新 tag）：覆盖 releases 与纯 tag 两类仓库
      // （colleague-skill 这类只打 tag 不发 release 的也能拿到版本号）。
      const res = await fetch('https://api.github.com/repos/' + repo + '/tags?per_page=1', {
        headers: {
          'user-agent': 'dsh-mall',
          accept: 'application/vnd.github+json',
          ...(token !== '' ? { authorization: 'Bearer ' + token } : {}),
        },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      })
      let value: string | null = null
      if (res.ok) {
        const body = (await res.json()) as Array<{ name?: string }>
        if (Array.isArray(body) && body.length > 0 && typeof body[0]?.name === 'string' && body[0].name !== '') value = body[0].name
      } else if (res.status === 404) {
        value = null // 无 tag
      } else {
        // 限流（403/429）或网络错误：缓存 null 1 小时，避免每次翻页重复打爆额度。
        cache[key] = { at: Date.now(), value: null }
        continue
      }
      cache[key] = { at: Date.now(), value }
      out[repo] = value
    } catch {
      /* 网络失败：下次再试 */
    }
  }
  state.repoVersions = cache
  writeState(profile, state)
  return out
}
