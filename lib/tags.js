/**
 * 中文打标数据保持最新（v1.7.52）：dsh-market-index 的 tags.json（手动/半自动
 * LLM 打标产物，独立于 registry.json，见 scripts/tag-zh.mjs）——
 * 进程启动 + 每 24h 拉取一次，写入 profiles/<p>/dsh-store/tags-cache.json，
 * 经 setTagsOverride 挂到 catalog 的条目上（tagsZh 字段）。
 * 拉取失败永远保留上次缓存/空值，浏览不中断；打标结果无需商店升版本即可分发。
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { setTagsOverride } from "./catalog.js";
const TAGS_URLS = [
    'https://raw.githubusercontent.com/hoyyang/dsh-market-index/main/tags.json',
    'https://cdn.jsdelivr.net/gh/hoyyang/dsh-market-index@main/tags.json',
];
const REFRESH_MS = 24 * 60 * 60 * 1000;
const FETCH_TIMEOUT_MS = 30_000;
let timer = null;
let tagsOverride = null;
function cachePath(profile) {
    const home = process.env.DSH_HOME ?? join(process.env.HOME ?? '', '.dsh');
    return join(home, 'profiles', profile, 'dsh-store', 'tags-cache.json');
}
/** 拉取一次并写缓存；失败抛错（由调用方决定重试节奏）。 */
export async function refreshTags(profile) {
    let lastError = null;
    for (const url of TAGS_URLS) {
        try {
            const res = await fetch(url, {
                headers: { accept: 'application/json', 'user-agent': 'dsh-store' },
                signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
            });
            if (!res.ok)
                throw new Error('tags HTTP ' + res.status);
            const body = (await res.json());
            if (body.entries === undefined || typeof body.entries !== 'object')
                throw new Error('tags.json 结构不对');
            const entries = {};
            for (const [key, value] of Object.entries(body.entries)) {
                if (value === null || typeof value !== 'object')
                    continue;
                const tagsZh = Array.isArray(value.tagsZh) ? value.tagsZh.filter((t) => typeof t === 'string' && t !== '').slice(0, 6) : [];
                const descriptionZh = typeof value.descriptionZh === 'string' ? value.descriptionZh.slice(0, 200) : '';
                if (tagsZh.length === 0 && descriptionZh === '')
                    continue;
                entries[key.toLowerCase()] = { descriptionZh, tagsZh };
            }
            const count = Object.keys(entries).length;
            if (count < 10)
                throw new Error('tags.json 可疑地小（' + count + '）');
            writeFileSync(cachePath(profile), JSON.stringify({ at: new Date().toISOString(), count, entries }));
            tagsOverride = entries;
            setTagsOverride(entries);
            return { count };
        }
        catch (err) {
            lastError = err instanceof Error ? err : new Error(String(err));
        }
    }
    throw lastError ?? new Error('tags fetch failed');
}
/** 进程启动：先读本地缓存（立即生效），再后台拉最新。 */
export function startTagsRefresh(profile) {
    try {
        const cached = JSON.parse(readFileSync(cachePath(profile), 'utf8'));
        if (cached.entries !== undefined && Object.keys(cached.entries).length > 0) {
            tagsOverride = cached.entries;
            setTagsOverride(cached.entries);
        }
    }
    catch { /* 无缓存：目录无标签 */ }
    const run = () => {
        refreshTags(profile).catch(() => { });
    };
    run();
    timer = setInterval(run, REFRESH_MS);
    timer.unref?.();
}
export function stopTagsRefresh() {
    if (timer !== null) {
        clearInterval(timer);
        timer = null;
    }
}
