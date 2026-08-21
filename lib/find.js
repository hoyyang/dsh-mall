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
import { loadRegistry } from "./catalog.js";
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
function scoreEntry(e, needle) {
    const hay = (e.name + ' ' + e.owner + ' ' + e.description + ' ' + e.category).toLowerCase();
    let score = 0;
    if (needle !== '') {
        const words = needle.split(/\s+/).filter(w => w.length > 0);
        for (const w of words) {
            if (e.name.toLowerCase().includes(w))
                score += 6;
            else if (e.description.toLowerCase().includes(w))
                score += 3;
            else if (e.owner.toLowerCase().includes(w))
                score += 1;
        }
    }
    score += (e.stars ?? 0) / 1000;
    if (e.curated)
        score += 2;
    if (e.verified != null)
        score += 3;
    if (e.isPlugin !== true)
        score -= 2;
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
