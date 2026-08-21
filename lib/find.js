/**
 * dsh-store find tool + result staging:
 * - find_dsh_store_plugin tool (any agent can call it): searches the local
 *   store catalog (CDN index already in memory), returns recommended +
 *   related plugin lists, and renders a button-link that opens the store
 *   results window.
 * - query-result staging: the tool payload is staged in memory under a
 *   random token; the client fetches it when the user clicks the button.
 */
import { defineTool } from '@deepseek-ai/dsh-tools';
import { CATEGORIES, loadRegistry } from "./catalog.js";
export const FIND_TOOL_NAME = 'find_dsh_store_plugin';
/** Staged results: token -> payload (memory only, TTL 30 min). */
const staged = new Map();
export function stageResults(payload) {
    const token = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    staged.set(token, { at: Date.now(), payload });
    for (const [key, value] of staged) {
        if (Date.now() - value.at > 30 * 60_000)
            staged.delete(key);
    }
    return token;
}
export function takeResults(token) {
    const hit = staged.get(token);
    if (hit === undefined)
        return null;
    if (Date.now() - hit.at > 30 * 60_000) {
        staged.delete(token);
        return null;
    }
    return hit.payload;
}
/** 中文查询串按 2-4 字滑动窗口拆 token（"应用市场"能命中中文简介/分类名）。 */
function tokensOf(needle) {
    const out = [];
    for (const w of needle.split(/\s+/)) {
        if (w === '')
            continue;
        if (/[\u4e00-\u9fff]/.test(w)) {
            for (let len = 4; len >= 2; len--) {
                for (let i = 0; i + len <= w.length; i++)
                    out.push({ t: w.slice(i, i + len), w: len === 4 ? 6 : len === 3 ? 3 : 1 });
            }
        }
        else {
            const lw = w.toLowerCase();
            out.push({ t: lw, w: 6 });
            // 英文长词加词干子串（marketplace → market）：dsh-market 这类命名也能命中。
            if (lw.length >= 5) {
                for (let len = lw.length - 1; len >= 4; len--) {
                    for (let i = 0; i + len <= lw.length; i++)
                        out.push({ t: lw.slice(i, i + len), w: 2 });
                }
            }
        }
    }
    return out;
}
function scoreEntry(e, needle) {
    const zh = e.descriptions?.zh ?? '';
    const catNames = CATEGORIES[e.category] !== undefined ? (CATEGORIES[e.category]?.en ?? '') + ' ' + (CATEGORIES[e.category]?.zh ?? '') : '';
    const hay = (e.name + ' ' + e.owner + ' ' + e.description + ' ' + zh + ' ' + e.category + ' ' + catNames).toLowerCase();
    const name = e.name.toLowerCase();
    const desc = (e.description + ' ' + zh).toLowerCase();
    const owner = e.owner.toLowerCase();
    let kw = 0;
    for (const token of tokensOf(needle)) {
        if (name.includes(token.t))
            kw += token.w + 3;
        else if (desc.includes(token.t))
            kw += token.w;
        else if (owner.includes(token.t))
            kw += 1;
    }
    if (needle.trim() !== '' && kw === 0)
        return Number.NEGATIVE_INFINITY;
    // 关键词分设上限：name+desc 多处命中不无限叠加，防止"marketplace"字样
    // 淹没 dsh-market 这类命名。
    kw = Math.min(kw, 12);
    // 关键词弱命中（<3）的仓库不进推荐：大 star 蹭词仓库（8 万星项目
    // 恰好带"市场"字样）不该挤掉真正的插件。
    if (needle.trim() !== '' && kw < 3)
        return Number.NEGATIVE_INFINITY;
    // star 取对数（1k≈3 分、10k≈4 分）：口碑信号，但不霸榜。
    let score = kw + Math.log10(1 + (e.stars ?? 0));
    if (e.curated)
        score += 2;
    if (e.verified != null)
        score += 3;
    if (e.isPlugin !== true)
        score -= 2;
    // 查询"应用市场/插件市场"类需求时，市场分类本身就是强命中。
    if (e.category === 'market')
        score += 4;
    return score;
}
/** Search the in-memory catalog for a natural-language requirement. */
export async function findPlugins(profile, token, query, limit) {
    const needle = String(query ?? '').trim().toLowerCase();
    const { registry } = await loadRegistry(profile, token, {});
    const ranked = registry.plugins
        .filter(p => p.local !== true)
        .map(p => ({ p, score: scoreEntry(p, needle) }))
        .sort((a, b) => b.score - a.score);
    const recommended = ranked.filter(r => r.score > 0).slice(0, Math.min(limit, 5)).map(r => r.p);
    const related = ranked
        .filter(r => r.score > 0 && !recommended.includes(r.p))
        .slice(0, Math.min(Math.max(limit, 8), 10))
        .map(r => r.p);
    return { query: String(query ?? '').trim(), recommended, related };
}
export function installFindTool(ctx, profile, githubToken, webOrigin) {
    ctx.tools.register(defineTool({
        name: FIND_TOOL_NAME,
        description: 'Search the local DSH Store plugin catalog (a full index of every GitHub repo tagged ' +
            'dsh-plugin, refreshed daily) for plugins matching the user\'s requirement. Returns a ' +
            'recommended list plus other related plugins with stars, descriptions and install commands. ' +
            'Use whenever the user asks for a plugin, capability, or tool they might install. ' +
            'Always end your reply with the button link returned in the tool output so the user can ' +
            'open the visual store window.',
        parameters: {
            query: {
                type: 'string',
                required: true,
                description: "The user's requirement in their own words, e.g. '通知插件' or 'wechat notifications', '代码审查', 'TUI'",
            },
            limit: {
                type: 'number',
                description: 'How many recommended plugins to return (default 3, max 5)',
            },
            lang: {
                type: 'string',
                description: "Preferred description language for the reply, e.g. 'zh' or 'en'",
            },
        },
        output: {
            schema: { type: 'object', additionalProperties: true },
            render: (_args, value) => renderFindResult(value, webOrigin()),
        },
        execute: async (args) => {
            const limit = Math.max(1, Math.min(args.limit ?? 3, 5));
            const payload = await findPlugins(profile, githubToken(), String(args.query ?? ''), limit);
            const buttonUrl = stageResults(payload);
            const result = { ...payload, lang: String(args.lang ?? 'en'), buttonUrl };
            return JSON.parse(JSON.stringify(result));
        },
        timeoutMs: 30_000,
    }));
}
function renderFindResult(value, origin) {
    const lang = value.lang;
    const desc = (e) => {
        if (lang === 'zh' && e.descriptions?.zh)
            return e.descriptions.zh;
        return e.description;
    };
    const lines = [];
    if (value.recommended.length > 0) {
        lines.push('**推荐**');
        value.recommended.forEach((p, i) => {
            const install = p.npm !== null ? 'dsh plugin add ' + p.npm : 'dsh plugin add github:' + p.owner + '/' + p.name;
            lines.push((i + 1) + '. ' + p.name + ' ★' + (p.stars ?? '—') + (p.verified != null ? ' ✓已验证' : '') + (p.curated ? ' ⚑精选' : ''));
            lines.push('   ' + (desc(p) || '—').slice(0, 200));
            lines.push('   ' + install);
        });
    }
    if (value.related.length > 0) {
        lines.push('');
        lines.push('**其他相关**');
        value.related.forEach((p, i) => {
            lines.push((i + 1) + '. ' + p.name + ' ★' + (p.stars ?? '—') + ' — ' + (desc(p) || '—').slice(0, 120));
        });
    }
    if (value.recommended.length === 0 && value.related.length === 0) {
        lines.push('No plugins in the store matched that requirement. Try broader keywords.');
    }
    if (value.buttonUrl !== undefined) {
        lines.push('');
        lines.push('[打开 DSH 商店查看插件详情](' + origin + '/dsh-store/open-results?id=' + value.buttonUrl + ')');
    }
    return [{ type: 'text', text: lines.join('\n') }];
}
