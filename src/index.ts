/**
 * dsh-mall host entry: mounts the market's HTTP routes once the
 * profile composes the webServer service, registers the settings
 * namespace for the GitHub token (rc.7+ hosts), installs the
 * find_dsh_mall_plugin tool, and provisions the /dsh-mall skill.
 */

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import type { Context } from '@deepseek-ai/cordis'
import { mountMarketRoutes, type MarketHost } from './routes.ts'
import { installFindTool } from './find.ts'
import { installMarketSettings } from './settings.ts'
import { startAutoUpdate, stopAutoUpdate } from './auto-update.ts'
import { startAwesomeRefresh, stopAwesomeRefresh } from './awesome.ts'
import { startTagsRefresh, stopTagsRefresh } from './tags.ts'
import type { MarketConfig } from './types.ts'

export const name = 'dsh-mall'
/** Host process start time (ms): installs after this need a restart to take effect. */
export const STARTED_AT = Date.now()

/** Optional cordis.yml configuration; the profile defaults to `web`. */
export type Config = Partial<Pick<MarketConfig, 'profile' | 'githubToken' | 'registryUrl'>>

function argvProfile(): string | undefined {
  const argv = process.argv
  const flag = argv.indexOf('--profile')
  if (flag !== -1 && flag + 1 < argv.length && !argv[flag + 1]!.startsWith('-')) return argv[flag + 1]
  return undefined
}

/** /dsh-mall skill: 落盘到 <dshHome>/skills/dsh-mall.md（官方 filesystem
 *  provider 的 USER_DSH_RANK 根，watcher 自动发现）；卸载时删除。 */
const SKILL_MARKDOWN = [
  '---',
  'name: dsh-mall',
  'description: 在本地 DSH 商场（dsh-mall 插件，全量收录 GitHub #dsh-plugin 生态）中按用户需求查找插件与相关工具（插件和非插件都会返回并标注类别）并给出推荐。当用户想找插件、问有没有某种功能的插件、想装什么东西时使用。',
  '---',
  '',
  '# DSH 商场查找',
  '',
  '用户想在 DeepSeek Harness 里找插件或相关工具时，调用 find_dsh_mall_plugin 工具（参数 query 用用户原话）。',
  '',
  '本 skill 只允许调用 find_dsh_mall_plugin 这一个工具，不要调用其他工具。',
  '',
  '回复要求：',
  '1. 列出工具返回的推荐条目（名称、star、一句话说明、插件/非插件标注、安装命令）。',
  '2. 给出你自己的推荐意见（为什么推荐第一个）。',
  '3. 回答的最后一行必须是工具返回的按钮链接（markdown 链接，文字跟随用户消息的语言：中文会话用「打开 DSH 商场查看插件详情」，英文会话用「Open DSH Mall to view plugin details」），链接网址原样保留、不要修改。',
].join('\n')

function ensureSkill(profile: string): () => void {
  const home = process.env.DSH_HOME ?? join(process.env.HOME ?? '', '.dsh')
  const file = join(home, 'skills', 'dsh-mall.md')
  let wrote = false
  try {
    let existing = ''
    try { existing = readFileSync(file, 'utf8') } catch { /* 不存在 */ }
    if (existing !== SKILL_MARKDOWN) {
      mkdirSync(dirname(file), { recursive: true })
      writeFileSync(file, SKILL_MARKDOWN)
      wrote = true
    }
  } catch { /* 技能落盘失败不影响商场主体 */ }
  return () => {
    try {
      if (existsSync(file)) rmSync(file)
    } catch { /* 忽略 */ }
  }
}

export function apply(ctx: Context, config?: Config): void {
  ctx.inject(['webServer', 'tools'], (hostCtx: Context) => {
    const host = hostCtx as unknown as MarketHost
    const toolsCtx = hostCtx as unknown as { tools: { register(tool: unknown): void } }
    const web = hostCtx as unknown as { webServer: { port?: number } }
    const resolved: MarketConfig = {
      profile: config?.profile ?? argvProfile() ?? 'web',
      githubToken: config?.githubToken ?? process.env.DSHM_GITHUB_TOKEN ?? '',
      registryUrl: config?.registryUrl ?? process.env.DSH_STORE_REGISTRY_URL ?? '',
    }
    installMarketSettings(ctx, resolved)
    // find 工具：任意 agent 都可用（button 链接指向本进程 web 端口）。
    const webOrigin = () => 'http://127.0.0.1:' + String(web.webServer?.port ?? 3080)
    installFindTool(toolsCtx, resolved.profile, () => resolved.githubToken, webOrigin)
    host.effect?.(() => {
      const removeSkill = ensureSkill(resolved.profile)
      const disposeRoutes = mountMarketRoutes(host, resolved)
      // 自动一键更新：开关为开时进程启动即重排每日定时器。
      startAutoUpdate(resolved)
      // awesome 人工目录自动保持最新（启动拉取 + 24h 周期）。
      startAwesomeRefresh(resolved.profile)
      // 中文打标（tags.json 手动 LLM 产物）保持最新（启动拉取 + 24h 周期）。
      startTagsRefresh(resolved.profile)
      return () => {
        disposeRoutes()
        removeSkill()
        stopAutoUpdate()
        stopAwesomeRefresh()
        stopTagsRefresh()
      }
    }, 'dsh-mall: http routes + skill + auto-update timer')
  })
}