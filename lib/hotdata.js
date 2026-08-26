/**
 * 热度数据保持最新（v1.8.0）：dsh-market-index 的 downloads.json（npm 下载统计，
 * CI 每日采集）+ star-history.json（星数 30 天滚动快照，星动量数据源）——
 * 进程启动 + 每 24h 拉取一次，写入 profiles/<p>/dsh-mall/hotdata-cache.json，
 * 经 setHotScores/setDownloadBaselines 注入 score.ts 热度 v2，并 reapplyHotScores
 * 强制重算当前目录（拉取前热度走 star 无偏换算路径，两者同权、身份零加成）。
 * 拉取失败永远保留上次缓存，浏览不中断；数据无需商场升版本即可分发。
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { reapplyHotScores } from "./catalog.js";
import { setDownloadBaselines, setHotScores } from "./score.js";
const BASE = 'https://raw.githubusercontent.com/hoyyang/dsh-market-index/main/';
const BASE_CDN = 'https://cdn.jsdelivr.net/gh/hoyyang/dsh-market-index@main/';
const FILES = ['downloads.json', 'star-history.json'];
const REFRESH_MS = 24 * 60 * 60 * 1000;
const FETCH_TIMEOUT_MS = 30_000;
let timer = null;
function cachePath(profile) {
    const home = process.env.DSH_HOME ?? join(process.env.HOME ?? '', '.dsh');
    return join(home, 'profiles', profile, 'dsh-mall', 'hotdata-cache.json');
}
function fetchJson(urls) {
    let lastError = null;
    const attempt = async (url) => {
        const res = await fetch(url, {
            headers: { accept: 'application/json', 'user-agent': 'dsh-mall' },
            signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        });
        if (!res.ok)
            throw new Error('HTTP ' + res.status);
        return await res.json();
    };
    return (async () => {
        for (const url of urls) {
            try {
                return await attempt(url);
            }
            catch (err) {
                lastError = err instanceof Error ? err : new Error(String(err));
            }
        }
        throw lastError ?? new Error('fetch failed');
    })();
}
/** p99（与 computeP99Stars 同口径：sorted[floor(0.99·n)]）。 */
function p99Of(nums) {
    const sorted = nums.filter(n => Number.isFinite(n) && n > 0).sort((a, b) => a - b);
    if (sorted.length === 0)
        return 1;
    return Math.max(sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.99))], 1);
}
function buildPayload(dlBody, histBody) {
    const dl = {};
    const rawDl = dlBody?.entries ?? {};
    for (const [key, value] of Object.entries(rawDl)) {
        if (value === null || typeof value !== 'object')
            continue;
        if (typeof value.dl30 !== 'number' || value.dl30 < 0)
            continue;
        dl[key.toLowerCase()] = {
            dl7: typeof value.dl7 === 'number' ? value.dl7 : 0,
            dl7prev: typeof value.dl7prev === 'number' ? value.dl7prev : 0,
            dl30: value.dl30,
            dlYTD: typeof value.dlYTD === 'number' ? value.dlYTD : value.dl30,
        };
    }
    const starDelta = {};
    const rawHist = histBody?.entries ?? {};
    for (const [key, snaps] of Object.entries(rawHist)) {
        if (!Array.isArray(snaps))
            continue;
        const pts = snaps
            .filter(s => s !== null && typeof s === 'object' && typeof s.d === 'string' && typeof s.s === 'number')
            .sort((a, b) => (a.d < b.d ? -1 : a.d > b.d ? 1 : 0));
        if (pts.length < 2) {
            starDelta[key.toLowerCase()] = null;
            continue;
        }
        const oldest = pts[0];
        const newest = pts[pts.length - 1];
        const spanDays = (Date.parse(newest.d) - Date.parse(oldest.d)) / 86_400_000;
        if (!Number.isFinite(spanDays) || spanDays < 7) {
            starDelta[key.toLowerCase()] = null;
            continue;
        }
        starDelta[key.toLowerCase()] = newest.s - oldest.s;
    }
    const dl30s = Object.values(dl).map(v => v.dl30);
    const dlYTDs = Object.values(dl).map(v => v.dlYTD);
    return { dl, starDelta, p99dl30: p99Of(dl30s), p99dlYTD: p99Of(dlYTDs) };
}
function apply(payload) {
    setHotScores(payload.dl, payload.starDelta);
    setDownloadBaselines(payload.p99dl30, payload.p99dlYTD);
    reapplyHotScores();
}
/** 拉取两个数据文件并应用；失败抛错（调用方保持缓存）。 */
export async function refreshHotData(profile) {
    const [dlBody, histBody] = await Promise.all([
        fetchJson([BASE + FILES[0], BASE_CDN + FILES[0]]),
        fetchJson([BASE + FILES[1], BASE_CDN + FILES[1]]),
    ]);
    const payload = buildPayload(dlBody, histBody);
    if (Object.keys(payload.dl).length < 10)
        throw new Error('downloads.json 可疑地小（' + Object.keys(payload.dl).length + '）');
    const cache = { ...payload, at: new Date().toISOString() };
    writeFileSync(cachePath(profile), JSON.stringify(cache));
    apply(payload);
    return { dl: Object.keys(payload.dl).length, hist: Object.keys(payload.starDelta).length };
}
/** 进程启动：先读本地缓存（立即生效），再后台拉最新。 */
export function startHotData(profile) {
    try {
        const cached = JSON.parse(readFileSync(cachePath(profile), 'utf8'));
        if (cached.dl !== undefined && Object.keys(cached.dl).length > 0)
            apply(cached);
    }
    catch { /* 无缓存：热度走 star 换算路径 */ }
    const run = () => {
        refreshHotData(profile).catch(() => { });
    };
    run();
    timer = setInterval(run, REFRESH_MS);
    timer.unref?.();
}
export function stopHotData() {
    if (timer !== null) {
        clearInterval(timer);
        timer = null;
    }
}
