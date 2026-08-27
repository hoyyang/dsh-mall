import { mkdirSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

let tempId = 0

/** Match DSH's canonical home semantics without adding a host-internal runtime dependency. */
function resolveDshHome(): string {
  const fromEnv = process.env.DSH_HOME
  const configured = fromEnv !== undefined && fromEnv.trim().length > 0 ? fromEnv : join(homedir(), '.dsh')
  const expanded = configured === '~'
    ? homedir()
    : configured.startsWith('~/') || configured.startsWith('~\\')
      ? join(homedir(), configured.slice(2))
      : configured
  return resolve(expanded)
}

/** Derived-cache root shared by all dsh-mall refresh channels. */
export function cacheFile(profile: string, name: string): string {
  return join(resolveDshHome(), 'profiles', profile, 'dsh-mall', name)
}

/** Persist derived JSON atomically, creating a fresh profile's directory first. */
export function writeCacheJson(profile: string, name: string, value: unknown): void {
  const file = cacheFile(profile, name)
  const temp = file + '.tmp-' + process.pid + '-' + Date.now() + '-' + (++tempId)
  mkdirSync(dirname(file), { recursive: true })
  try {
    writeFileSync(temp, JSON.stringify(value))
    renameSync(temp, file)
  } catch (error) {
    try { rmSync(temp, { force: true }) } catch { /* preserve original write error */ }
    throw error
  }
}
