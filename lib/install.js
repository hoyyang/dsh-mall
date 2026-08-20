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
function runDsh(profile, args) {
    return new Promise((resolve) => {
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
        child.stdout.on('data', (chunk) => {
            stdout += chunk.toString();
            const tail = stdout.slice(-200).trim();
            if (installState.active)
                installState.line = tail;
        });
        child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
        child.on('close', (code) => {
            clearTimeout(timer);
            resolve({ exitCode: code ?? -1, stdout, stderr, timedOut });
        });
        child.on('error', () => {
            clearTimeout(timer);
            resolve({ exitCode: -1, stdout, stderr: 'failed to spawn dsh CLI (is it on PATH?)', timedOut });
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
export async function runInstall(config, repo, npmName) {
    installState.active = true;
    installState.kind = 'install';
    installState.target = repo;
    installState.phase = 'installing';
    installState.line = null;
    installState.startedAt = Date.now();
    try {
        const target = npmName !== null && npmName !== '' ? npmName : 'github:' + repo;
        installState.line = 'dsh plugin add ' + target;
        const result = await runDsh(config.profile, ['add', target]);
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
export async function runUninstall(config, repo) {
    installState.active = true;
    installState.kind = 'uninstall';
    installState.target = repo;
    installState.phase = 'uninstalling';
    installState.line = null;
    installState.startedAt = Date.now();
    try {
        const dep = installedDepForProfile(config.profile, repo);
        if (dep === null) {
            const message = 'Not installed (no matching dependency in the profile).';
            installState.lastResult = { ok: false, message };
            return { ok: false, message };
        }
        const result = await runDsh(config.profile, ['remove', dep.name]);
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
