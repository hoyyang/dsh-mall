/**
 * Install/uninstall through the dsh CLI. The CLI forwards to pnpm in the
 * profile directory and reconciles the profile's dsh.profile.bundles roster
 * at install time, so the next boot loads the plugin through the normal
 * bundle layer. Most plugins work after a page refresh; no hot-mount here.
 */
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const INSTALL_TIMEOUT_MS = 10 * 60 * 1000;
export function runDsh(profile, args, signal) {
    return new Promise((resolve) => {
        let cancelled = false;
        let settled = false;
        const settle = (value) => { if (settled)
            return; settled = true; resolve(value); };
        const child = spawn('dsh', ['plugin', '--profile', profile, ...args], {
            env: { ...process.env },
            stdio: ['ignore', 'pipe', 'pipe'],
        });
        let stdout = '';
        let stderr = '';
        let timedOut = false;
        const timer = setTimeout(() => {
            timedOut = true;
            child.kill('SIGKILL');
        }, INSTALL_TIMEOUT_MS);
        const onAbort = () => {
            cancelled = true;
            try {
                child.kill('SIGKILL');
            }
            catch { /* 忽略 */ }
            clearTimeout(timer);
            settle({ exitCode: -1, stdout, stderr, timedOut: false, cancelled: true });
        };
        if (signal !== undefined) {
            if (signal.aborted) {
                onAbort();
                return;
            }
            signal.addEventListener('abort', onAbort, { once: true });
        }
        child.stdout.on('data', (chunk) => {
            stdout += chunk.toString();
            const tail = stdout.slice(-200).trim();
            if (installState.active)
                installState.line = tail;
        });
        child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
        child.on('close', (code) => {
            clearTimeout(timer);
            if (signal !== undefined)
                signal.removeEventListener('abort', onAbort);
            settle({ exitCode: code ?? -1, stdout, stderr, timedOut, cancelled: cancelled });
        });
        child.on('error', () => {
            clearTimeout(timer);
            settle({ exitCode: -1, stdout, stderr: 'failed to spawn dsh CLI (is it on PATH?)', timedOut, cancelled: cancelled });
        });
    });
}
export const installState = {
    active: false,
    kind: null,
    phase: null,
    target: null,
    line: null,
    startedAt: null,
    lastResult: null,
};
export function profileDir(profile) {
    const home = process.env.DSH_HOME ?? join(process.env.HOME ?? '', '.dsh');
    return join(home, 'profiles', profile);
}
export function readManifest(profile) {
    try {
        const manifest = JSON.parse(readFileSync(join(profileDir(profile), 'package.json'), 'utf8'));
        return { dependencies: manifest.dependencies ?? {}, bundles: manifest.dsh?.profile?.bundles ?? [] };
    }
    catch {
        return { dependencies: {}, bundles: [] };
    }
}
function ensureBundles(profile, depName) {
    try {
        const file = join(profileDir(profile), 'package.json');
        const manifest = JSON.parse(readFileSync(file, 'utf8'));
        const bundles = manifest.dsh?.profile?.bundles ?? [];
        if (!bundles.includes(depName)) {
            manifest.dsh ??= {};
            manifest.dsh.profile ??= {};
            manifest.dsh.profile.bundles = [...bundles, depName];
            writeFileSync(file, JSON.stringify(manifest, null, 2) + '\n');
            return true;
        }
        return false;
    }
    catch {
        return false;
    }
}
/** The installed dependency whose name/spec matches this repo, if any. */
export function installedDepFor(repo) {
    const { dependencies } = readManifest(process.env.DSH_MARKET_PROFILE ?? 'web');
    return null;
}
export function installedDepForProfile(profile, repo) {
    const { dependencies } = readManifest(profile);
    const lower = repo.toLowerCase();
    const basename = lower.split('/').pop() ?? '';
    for (const [name, spec] of Object.entries(dependencies)) {
        const depName = name.toLowerCase();
        if (depName === lower || depName === basename)
            return { name, spec };
        if (spec.toLowerCase().includes(lower) || spec.toLowerCase().includes(basename))
            return { name, spec };
    }
    return null;
}
function resultMessage(result) {
    if (result.cancelled)
        return 'Cancelled by user';
    const tail = (result.stderr || result.stdout || '').trim().split('\n').slice(-8).join('\n');
    return (tail || 'no output').slice(-800);
}
/** Serialize mutating operations: one install/uninstall at a time. */
let mutationChain = Promise.resolve();
let mutationBusy = false;
export async function withMutationLock(fn) {
    if (mutationBusy)
        return { busy: true };
    mutationBusy = true;
    try {
        const run = mutationChain.then(async () => fn());
        mutationChain = run.catch(() => undefined);
        const value = await run;
        return { busy: false, value };
    }
    finally {
        mutationBusy = false;
    }
}
export async function runInstall(config, repo, npmName, signal) {
    installState.active = true;
    installState.kind = 'install';
    installState.target = repo;
    installState.phase = 'installing';
    installState.line = null;
    installState.startedAt = Date.now();
    try {
        const target = npmName !== null && npmName !== '' ? npmName : 'github:' + repo;
        installState.line = 'dsh plugin add ' + target;
        const result = await runDsh(config.profile, ['add', target], signal);
        if (signal?.aborted === true)
            return { ok: false, message: 'Cancelled by user' };
        installState.phase = result.exitCode === 0 && !result.timedOut ? 'finalizing' : 'failed';
        if (result.exitCode === 0 && !result.timedOut) {
            // The CLI reconciles bundles; double-check and add if it was missed.
            const dep = installedDepForProfile(config.profile, repo);
            if (dep !== null)
                ensureBundles(config.profile, dep.name);
            const message = 'Installed ' + target + '. Refresh the page to activate.';
            installState.lastResult = { ok: true, message };
            return { ok: true, message };
        }
        const message = result.timedOut ? 'Install timed out (10 min)' : resultMessage(result);
        installState.lastResult = { ok: false, message };
        return { ok: false, message };
    }
    finally {
        installState.active = false;
        installState.kind = null;
        installState.phase = null;
        installState.line = null;
    }
}
/** 批量更新：对每个 npm 包名跑 dsh plugin add <name>（不带版本 = 装 latest），
 *  串行执行、逐个汇报结果；全部成功才算 ok。installState.kind = 'update'。 */
/** 商店自身更新：dsh plugin add dsh-store@latest。host 代码更新后需要重启
 *  dsh 才生效（bundle 层的 JS 已经加载），返回值固定带 needRestart。 */
export async function runSelfUpdate(config, signal) {
    installState.active = true;
    installState.kind = 'update';
    installState.target = 'dsh-store';
    installState.phase = 'updating';
    installState.line = 'dsh plugin add dsh-store@latest';
    installState.startedAt = Date.now();
    try {
        const result = await runDsh(config.profile, ['add', 'dsh-store@latest'], signal);
        if (signal?.aborted === true)
            return { ok: false, message: 'Cancelled by user', needRestart: false };
        const ok = result.exitCode === 0 && !result.timedOut;
        const message = ok ? 'Updated dsh-store.' : (result.timedOut ? 'Update timed out (10 min)' : resultMessage(result));
        installState.lastResult = { ok, message };
        return { ok, message, needRestart: true };
    }
    finally {
        installState.active = false;
        installState.kind = null;
        installState.phase = null;
        installState.target = null;
        installState.line = null;
    }
}
export async function runUpdate(config, targets, signal) {
    installState.active = true;
    installState.kind = 'update';
    installState.phase = 'updating';
    installState.line = null;
    installState.startedAt = Date.now();
    const results = [];
    try {
        for (const target of targets) {
            installState.target = target.name;
            // pnpm 11：裸名 add 对已存在依赖保持现有 spec 不动（实测 ^0.19.0 不升级），
            // 必须显式 @latest 才真正升到 registry latest。
            installState.line = 'dsh plugin add ' + target.name + '@latest';
            const result = await runDsh(config.profile, ['add', target.name + '@latest'], signal);
            if (signal?.aborted === true) {
                results.push({ name: target.name, ok: false, message: 'Cancelled by user' });
                break;
            }
            const ok = result.exitCode === 0 && !result.timedOut;
            results.push({
                name: target.name,
                ok,
                message: ok ? 'Updated ' + target.name + ' → ' + target.to : (result.timedOut ? 'Update timed out (10 min)' : resultMessage(result)),
            });
        }
        const failed = results.filter(r => !r.ok).length;
        const message = failed === 0
            ? 'Updated ' + results.length + ' plugin' + (results.length === 1 ? '' : 's') + '.'
            : 'Updated ' + (results.length - failed) + '/' + results.length + ' plugins.';
        installState.lastResult = { ok: failed === 0, message };
        return { ok: failed === 0, message, results };
    }
    finally {
        installState.active = false;
        installState.kind = null;
        installState.phase = null;
        installState.target = null;
        installState.line = null;
    }
}
// ---------------------------------------------------------- enable/disable
// 借鉴 dshmarket（其机制移植自 Noob-stupid/dsh-plugin-hub）：
// 在 profile 的用户 patch 层（cordis.patch.yml）写顶层条目
// "- id: <loaderId>" + "disabled: true|false" —— DSH 官方机制，HMR watcher
// 会在 ~1s 内重合成、重启后持久，无需重启。
// 写安全：只认顶层（无缩进）"- id:" 行；宿主基础设施条目拒绝切换。
const PROTECTED_MODULE_RE = [
    /^@deepseek-ai\//,
    /^cordis:/,
    /^dsh-store$/,
];
export function patchFilePath(profile) {
    return join(profileDir(profile), 'cordis.patch.yml');
}
/** 从包的 cordis.patch.yml 解析它的 loader entry id（dshmarket 的 entry id 是
 *  'dsh-market' 而非包名 'dshmarket'——开关若写错 id 会静默失效）。
 *  解析失败回退包名。 */
export function loaderIdOf(profile, depName) {
    try {
        const text = readFileSync(join(profileDir(profile), 'node_modules', depName, 'cordis.patch.yml'), 'utf8');
        const lines = text.split(/\r?\n/);
        let inInsert = false;
        for (const line of lines) {
            if (/^- insert:/.test(line)) {
                inInsert = true;
                continue;
            }
            if (inInsert && /^\s+- id:\s*\S/.test(line)) {
                const m = /^\s+- id:\s*(.+)$/.exec(line);
                if (m !== null)
                    return String(m[1]).trim();
            }
        }
    }
    catch { /* 无 patch 文件：回退包名 */ }
    return depName;
}
/** 用户 patch 层当前停用的 loader id 列表。 */
export function patchDisables(profile) {
    try {
        const lines = readFileSync(patchFilePath(profile), 'utf8').split(/\r?\n/);
        const out = [];
        for (let i = 0; i < lines.length - 1; i++) {
            const m = /^- id:\s*(.+)$/.exec(lines[i] ?? '');
            if (m !== null && /^\s*disabled:\s*true\s*$/.test(lines[i + 1] ?? ''))
                out.push(String(m[1]).trim());
        }
        return out;
    }
    catch {
        return [];
    }
}
/** 清理旧版误写的顶层条目（id=包名但真实 loader id 不同，如 dshmarket）。 */
export function removeLegacyPatchEntry(profile, legacyId) {
    try {
        const file = patchFilePath(profile);
        const lines = readFileSync(file, 'utf8').split(/\r?\n/);
        let row = -1;
        for (let i = 0; i < lines.length; i++) {
            const m = /^- id:\s*(.+)$/.exec(lines[i] ?? '');
            if (m !== null && String(m[1]).trim() === legacyId) {
                row = i;
                break;
            }
        }
        if (row < 0)
            return;
        lines.splice(row, 1);
        if (/^\s*disabled:/.test(lines[row] ?? ''))
            lines.splice(row, 1);
        writeFileSync(file, lines.join('\n').replace(/\n+$/, '\n'));
    }
    catch { /* 忽略 */ }
}
/** 停用（enabled=false）或重新启用（enabled=true）一个 loader 条目。 */
export function setPluginEnabled(profile, loaderId, enabled) {
    if (PROTECTED_MODULE_RE.some(re => re.test(loaderId))) {
        return { ok: false, message: 'protected host entry — refusing to toggle' };
    }
    const file = patchFilePath(profile);
    let lines;
    try {
        lines = readFileSync(file, 'utf8').split(/\r?\n/);
    }
    catch {
        lines = [];
    }
    let row = -1;
    for (let i = 0; i < lines.length; i++) {
        const m = /^- id:\s*(.+)$/.exec(lines[i] ?? '');
        if (m !== null && String(m[1]).trim() === loaderId) {
            row = i;
            break;
        }
    }
    if (row >= 0) {
        if (enabled) {
            // 顶层条目：删掉 id 行与其后的 disabled 行（若有）
            lines.splice(row, 1);
            if (/^\s*disabled:/.test(lines[row] ?? ''))
                lines.splice(row, 1);
        }
        else {
            if (/^\s*disabled:\s*true\s*$/.test(lines[row + 1] ?? ''))
                return { ok: true, message: 'already disabled' };
            lines.splice(row + 1, 0, '  disabled: true');
        }
    }
    else if (!enabled) {
        if (lines.length > 0 && lines[lines.length - 1] !== '')
            lines.push('');
        lines.push('- id: ' + loaderId, '  disabled: true');
    }
    else {
        return { ok: true, message: 'not disabled' };
    }
    try {
        writeFileSync(file, lines.join('\n').replace(/\n+$/, '\n'));
    }
    catch (err) {
        return { ok: false, message: 'failed to write patch: ' + (err instanceof Error ? err.message : String(err)) };
    }
    return { ok: true, message: enabled ? 'enabled' : 'disabled' };
}
/** 已装依赖的激活状态（借鉴 dshmarket 的状态模型，精简为三态）：
 *  live=启用中（bundle 层已装配且未被停用；官方组件经 patch insert 挂载恒为 live）；
 *  disabled=patch 层停用（cordis.patch.yml 的 disabled: true）；
 *  restart=bundle 未声明（如刚安装还没被装配/刷新）。 */
export function pluginStatesOf(profile, manifest) {
    const disables = new Set(patchDisables(profile));
    const bundleSet = new Set(manifest.bundles);
    const out = {};
    for (const name of Object.keys(manifest.dependencies)) {
        // v1.7.10：只按真实 loader id 判定停用（dshmarket→dsh-market）。
        // 旧版误写的「- id: dshmarket」条目不匹配任何 loader，忽略之（无效条目）。
        const loaderId = loaderIdOf(profile, name);
        if (disables.has(loaderId)) {
            out[name] = 'disabled';
        }
        else if (bundleSet.has(name) || name.startsWith('@deepseek-ai/')) {
            out[name] = 'live';
        }
        else {
            out[name] = 'restart';
        }
    }
    return out;
}
// -------------------------------------------------------- rollback snapshots
// 更新前记录旧 spec；回退时直接把旧 spec 写回 package.json 再 pnpm install
// （dshmarket 的 restoreManifestDeps 同款思路：#65/#69 证明直接改 manifest
// 是唯一可靠回退——pnpm 失败时可能已写过 package.json 留下幽灵依赖）。
export function snapshotDep(profile, name, spec, to, state) {
    const from = (spec.match(/(\d+\.\d+\.\d+)/) ?? [])[1] ?? spec;
    const rollbacks = { ...(state.rollbacks ?? {}) };
    rollbacks[name] = { name, from, to, spec, at: new Date().toISOString() };
    state.rollbacks = rollbacks;
    return rollbacks;
}
export function rollbackDep(profile, name, state) {
    const entry = state.rollbacks?.[name];
    if (entry === undefined)
        return null;
    try {
        const file = join(profileDir(profile), 'package.json');
        const manifest = JSON.parse(readFileSync(file, 'utf8'));
        const deps = manifest.dependencies ?? {};
        // caret/波浪范围会再次解析到最新版（^0.19.0 仍匹配 0.19.2），
        // 回退必须写精确版本号；无版本 spec（github: 等）原样恢复。
        const exact = /^[\^~]/.test(entry.spec) && /^\d+\.\d+\.\d+$/.test(entry.from) ? entry.from : entry.spec;
        deps[name] = exact;
        manifest.dependencies = deps;
        writeFileSync(file, JSON.stringify(manifest, null, 2) + '\n');
        delete state.rollbacks[name];
    }
    catch (err) {
        return { ok: false, message: 'failed to restore manifest: ' + (err instanceof Error ? err.message : String(err)) };
    }
    return { ok: true, message: 'restored ' + name + ' spec to ' + entry.spec };
}
export async function runUninstall(config, repo, name, signal) {
    installState.active = true;
    installState.kind = 'uninstall';
    installState.target = name ?? repo;
    installState.phase = 'uninstalling';
    installState.line = null;
    installState.startedAt = Date.now();
    try {
        // 本地已装条目按包名精确卸载（repo 形如 @scope/name，不是 owner/repo）
        let dep = null;
        if (name !== undefined && name !== '') {
            const deps = readManifest(config.profile).dependencies;
            const hit = Object.entries(deps).find(([n]) => n.toLowerCase() === name.toLowerCase());
            if (hit !== undefined)
                dep = { name: hit[0], spec: hit[1] };
        }
        else {
            dep = installedDepForProfile(config.profile, repo);
        }
        if (dep === null) {
            const message = 'Not installed (no matching dependency in the profile).';
            installState.lastResult = { ok: false, message };
            return { ok: false, message };
        }
        const result = await runDsh(config.profile, ['remove', dep.name], signal);
        if (signal?.aborted === true)
            return { ok: false, message: 'Cancelled by user' };
        if (result.exitCode === 0 && !result.timedOut) {
            const message = 'Uninstalled ' + dep.name + '.';
            installState.lastResult = { ok: true, message };
            return { ok: true, message };
        }
        const message = result.timedOut ? 'Uninstall timed out (10 min)' : resultMessage(result);
        installState.lastResult = { ok: false, message };
        return { ok: false, message };
    }
    finally {
        installState.active = false;
        installState.kind = null;
        installState.phase = null;
        installState.line = null;
    }
}
