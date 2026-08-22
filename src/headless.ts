/**
 * headless AI 调用助手（v1.7.17）：智能搜索 / 智能安装 / 智能更新 / 智能卸载
 * 共用的 dsh --profile headless 通道。
 *
 * 问题背景：全局 settings.yaml 的 agent-default-model.provider 可能是只在
 * web 运行时注册的 provider（如 vision-router 的 deepseek-vision），headless
 * profile 里没有对应适配器 → dsh 报 NO_ADAPTER（且退出码仍为 0），此前被
 * 误报为「模型调用失败/超时」，智能更新实测踩坑。
 *
 * 修复：首选按用户原配置跑；输出含 NO_ADAPTER 时自动降级——复制 settings.yaml
 * 到临时文件并把 agent-default-model 指向 headless 可用的 deepseek-official
 * （llm-deepseek 注册的 provider，取 models 里的 pro/末位模型），经
 * --patch 覆盖 settings 路径重试一次。用完即删。
 */

import { spawn } from 'node:child_process'
import { join } from 'node:path'
import { rmSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'

function settingsPath(): string {
  const home = process.env.DSH_HOME ?? join(process.env.HOME ?? '', '.dsh')
  return join(home, 'settings.yaml')
}

/** 从 settings.yaml 的 llm-deepseek.models 里挑兜底模型：优先 pro，否则最后一个。 */
function pickFallbackModel(): string | null {
  try {
    const text = readFileSync(settingsPath(), 'utf8')
    const rest = text.split(/^llm-deepseek:/m)[1] ?? ''
    const block = rest.split(/^[a-zA-Z][a-zA-Z0-9-]*:/m)[0] ?? rest
    const ids = [...block.matchAll(/^\s+-\s+id:\s*(\S+)/gm)].map(m => m[1])
    if (ids.length === 0) return null
    return ids.find(id => id.includes('pro')) ?? ids[ids.length - 1]
  } catch {
    return null
  }
}

function spawnDsh(args: string[], timeoutMs: number): Promise<{ ok: boolean; output: string }> {
  return new Promise(resolve => {
    let stdout = ''
    let stderr = ''
    let timedOut = false
    const child = spawn('dsh', args, { env: { ...process.env }, stdio: ['ignore', 'pipe', 'pipe'] })
    const timer = setTimeout(() => { timedOut = true; child.kill('SIGKILL') }, timeoutMs)
    child.stdout.on('data', (c: Buffer) => { stdout += c.toString() })
    child.stderr.on('data', (c: Buffer) => { stderr += c.toString() })
    child.on('close', code => {
      clearTimeout(timer)
      resolve({ ok: !timedOut && code === 0, output: (stdout + stderr).trim() })
    })
    child.on('error', () => { clearTimeout(timer); resolve({ ok: false, output: stderr || 'failed to spawn dsh CLI' }) })
  })
}

export async function runHeadlessTask(task: string, timeoutMs: number): Promise<{ ok: boolean; output: string }> {
  const first = await spawnDsh(['--profile', 'headless', task], timeoutMs)
  if (!/NO_ADAPTER|no adapter registered/i.test(first.output)) return first

  // NO_ADAPTER：headless 里没有 agent-default-model 指向的 provider。
  // 用临时 settings（只改 agent-default-model）+ --patch 重试一次。
  const model = pickFallbackModel()
  if (model === null) return first
  const stamp = process.pid + '-' + Date.now().toString(36)
  const tmpSettings = join(tmpdir(), 'dsh-store-headless-settings-' + stamp + '.yaml')
  const tmpPatch = join(tmpdir(), 'dsh-store-headless-patch-' + stamp + '.yml')
  try {
    let settings = readFileSync(settingsPath(), 'utf8')
    // 仅替换 agent-default-model 段内的 provider/model（该段下没有其他行级缩进配置）。
    settings = settings
      .replace(/^(  provider: ).*(\n)/gm, '$1deepseek-official$2')
      .replace(/^(  model: ).*(\n)/gm, '$1' + model + '$2')
    if (!/^agent-default-model:/m.test(settings)) {
      settings += '\nagent-default-model:\n  provider: deepseek-official\n  model: ' + model + '\n'
    }
    writeFileSync(tmpSettings, settings, 'utf8')
    writeFileSync(tmpPatch, '- id: settings\n  config:\n    path: ' + tmpSettings + '\n', 'utf8')
    const retry = await spawnDsh(['--profile', 'headless', '--patch', tmpPatch, task], timeoutMs)
    return retry.ok || !/NO_ADAPTER|no adapter registered/i.test(retry.output) ? retry : first
  } catch {
    return first
  } finally {
    try { rmSync(tmpSettings, { force: true }) } catch { /* 忽略 */ }
    try { rmSync(tmpPatch, { force: true }) } catch { /* 忽略 */ }
  }
}
