/**
 * headless AI 调用助手（v1.7.17+）：智能搜索 / 智能安装 / 智能更新 / 智能卸载
 * 共用的 dsh --profile headless 通道。
 *
 * 兼容性（v1.7.17 问题背景）：全局 settings.yaml 的 agent-default-model.provider
 * 可能是只在 web 运行时注册的 provider（如 vision-router 的 deepseek-vision），
 * headless profile 里没有对应适配器 → dsh 报 NO_ADAPTER（且退出码仍为 0）。
 * 此外其他用户的机器可能没有 dsh CLI、或配置了别的 provider。
 *
 * 策略：
 * 1) 解析 dsh 可执行文件（PATH + 常见安装目录），找不到直接降级（调用方走常规路径）；
 * 2) 首选按用户原配置跑；
 * 3) 输出含 NO_ADAPTER 时按候选 provider 依次降级重试：deepseek-official
 *    （llm-deepseek 注册）+ llm-pi-ai providers 里的第一个 provider，各取
 *    models 里的 pro/末位模型；全部失败则返回原始结果，调用方降级常规路径。
 * 4) 支持 AbortSignal（任务面板「取消」）。临时 settings/patch 用完即删。
 */

import { spawn } from 'node:child_process'
import { join } from 'node:path'
import { existsSync, rmSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'

function settingsPath(): string {
  const home = process.env.DSH_HOME ?? join(process.env.HOME ?? '', '.dsh')
  return join(home, 'settings.yaml')
}

let resolvedDsh: string | null | undefined

/** 解析 dsh CLI 绝对路径（缓存）；找不到返回 null。 */
function resolveDsh(): string | null {
  if (resolvedDsh !== undefined) return resolvedDsh
  const dirs = [
    ...(process.env.PATH ?? '').split(':').filter(d => d !== ''),
    '/usr/local/bin', '/opt/homebrew/bin', '/usr/bin', '/bin',
    join(process.env.HOME ?? '', '.npm-global', 'bin'),
    join(process.env.HOME ?? '', '.local', 'bin'),
  ]
  for (const dir of dirs) {
    const p = join(dir, 'dsh')
    try { if (existsSync(p)) { resolvedDsh = p; return p } } catch { /* 忽略 */ }
  }
  resolvedDsh = null
  return resolvedDsh
}

/** 解析 settings.yaml 里某命名空间 models 下的模型 id 列表。 */
function modelIdsOf(namespace: string): string[] {
  try {
    const text = readFileSync(settingsPath(), 'utf8')
    const rest = text.split(new RegExp('^' + namespace + ':', 'm'))[1] ?? ''
    const block = rest.split(/^[a-zA-Z][a-zA-Z0-9-]*:/m)[0] ?? rest
    return [...block.matchAll(/^\s+-\s+id:\s*(\S+)/gm)].map(m => m[1])
  } catch {
    return []
  }
}

/** 兜底候选：deepseek-official（llm-deepseek 模型）+ pi-ai 配置里的第一个 provider。 */
function fallbackCandidates(): Array<{ provider: string; model: string }> {
  const out: Array<{ provider: string; model: string }> = []
  const deepseekIds = modelIdsOf('llm-deepseek')
  if (deepseekIds.length > 0) {
    out.push({ provider: 'deepseek-official', model: deepseekIds.find(id => id.includes('pro')) ?? deepseekIds[deepseekIds.length - 1] })
  }
  try {
    const text = readFileSync(settingsPath(), 'utf8')
    const rest = text.split(/^llm-pi-ai:/m)[1] ?? ''
    const block = rest.split(/^[a-zA-Z][a-zA-Z0-9-]*:/m)[0] ?? rest
    const provMatch = block.match(/^\s+providers:\s*\n\s+(\S+):/m)
    const provider = provMatch?.[1] ?? null
    if (provider !== null) {
      const providerBlock = block.split(new RegExp('^\\s+' + provider + ':', 'm'))[1] ?? ''
      const ids = [...providerBlock.matchAll(/^\s+-\s+id:\s*(\S+)/gm)].map(m => m[1])
      if (ids.length > 0) out.push({ provider, model: ids[ids.length - 1] })
    }
  } catch { /* 忽略 */ }
  return out
}

function spawnDsh(args: string[], timeoutMs: number, signal?: AbortSignal): Promise<{ ok: boolean; output: string }> {
  return new Promise(resolve => {
    const bin = resolveDsh()
    if (bin === null) { resolve({ ok: false, output: 'dsh CLI not found — smart features degrade to the regular path' }); return }
    let stdout = ''
    let stderr = ''
    let timedOut = false
    let settled = false
    const settle = (value: { ok: boolean; output: string }) => { if (settled) return; settled = true; resolve(value) }
    const child = spawn(bin, args, { env: { ...process.env }, stdio: ['ignore', 'pipe', 'pipe'] })
    const timer = setTimeout(() => { timedOut = true; try { child.kill('SIGKILL') } catch { /* 忽略 */ } }, timeoutMs)
    const onAbort = () => { clearTimeout(timer); try { child.kill('SIGKILL') } catch { /* 忽略 */ } settle({ ok: false, output: stdout + stderr + '\nCANCELLED' }) }
    if (signal !== undefined) {
      if (signal.aborted) { onAbort(); return }
      signal.addEventListener('abort', onAbort, { once: true })
    }
    child.stdout.on('data', (c: Buffer) => { stdout += c.toString() })
    child.stderr.on('data', (c: Buffer) => { stderr += c.toString() })
    child.on('close', code => {
      clearTimeout(timer)
      if (signal !== undefined) signal.removeEventListener('abort', onAbort)
      settle({ ok: !timedOut && code === 0, output: (stdout + stderr).trim() })
    })
    child.on('error', () => { clearTimeout(timer); settle({ ok: false, output: stderr || 'failed to spawn dsh CLI' }) })
  })
}

const NO_ADAPTER_RE = /NO_ADAPTER|no adapter registered/i

export async function runHeadlessTask(task: string, timeoutMs: number, signal?: AbortSignal): Promise<{ ok: boolean; output: string }> {
  const first = await spawnDsh(['--profile', 'headless', task], timeoutMs, signal)
  if (signal?.aborted === true) return { ok: false, output: 'CANCELLED' }
  if (!NO_ADAPTER_RE.test(first.output)) return first

  // NO_ADAPTER：headless 里没有 agent-default-model 指向的 provider。
  // 依次用候选 provider + 临时 settings（--patch 覆盖 settings 路径）重试。
  const stamp = process.pid + '-' + Date.now().toString(36)
  const tmpSettings = join(tmpdir(), 'dsh-mall-headless-settings-' + stamp + '.yaml')
  const tmpPatch = join(tmpdir(), 'dsh-mall-headless-patch-' + stamp + '.yml')
  let last = first
  try {
    const base = readFileSync(settingsPath(), 'utf8')
    for (const cand of fallbackCandidates()) {
      if (signal !== undefined && signal.aborted) return { ok: false, output: 'CANCELLED' }
      let settings = base
      if (/^agent-default-model:/m.test(settings)) {
        settings = settings
          .replace(/^(  provider: ).*(\n)/gm, '$1' + cand.provider + '$2')
          .replace(/^(  model: ).*(\n)/gm, '$1' + cand.model + '$2')
      } else {
        settings += '\nagent-default-model:\n  provider: ' + cand.provider + '\n  model: ' + cand.model + '\n'
      }
      writeFileSync(tmpSettings, settings, 'utf8')
      writeFileSync(tmpPatch, '- id: settings\n  config:\n    path: ' + tmpSettings + '\n', 'utf8')
      const retry = await spawnDsh(['--profile', 'headless', '--patch', tmpPatch, task], timeoutMs, signal)
      last = retry
      if (signal !== undefined && signal.aborted) return { ok: false, output: 'CANCELLED' }
      if (!NO_ADAPTER_RE.test(retry.output)) return retry
    }
    return last
  } catch {
    return last
  } finally {
    try { rmSync(tmpSettings, { force: true }) } catch { /* 忽略 */ }
    try { rmSync(tmpPatch, { force: true }) } catch { /* 忽略 */ }
  }
}
