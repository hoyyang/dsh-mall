window.__ModuleLoader__.load({ id: "dsh-store", factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
let react = require("react");
let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
_deepseek_ai_dsh_client_ui_primitives = __toESM(_deepseek_ai_dsh_client_ui_primitives, 1);
let react_jsx_runtime = require("react/jsx-runtime");
//#region src/client/locales.ts
const en = {
	nav: "DSH Store",
	versionHint: "dsh-store v{0}",
	title: "DSH Store",
	subtitle: "Every GitHub repo tagged #dsh-plugin — browse, search, install.",
	refresh: "Refresh",
	autoRefresh: "auto-refresh every 30 min",
	refreshing: "Refreshing…",
	shardProgress: "Fetched {0} repos ({1}/{2} slices)",
	sourceCdn: "updated",
	sourceLive: "updated",
	sourceCache: "updated",
	sourceSnapshot: "snapshot · {0}",
	updatedAt: "{0} ago",
	syncedAt: "synced {0}",
	indexAge: "index built {0} (CI rebuilds every 2h)",
	all: "All",
	expandCats: "Expand {0} categories",
	collapseCats: "Collapse",
	searchPlaceholder: "Search name / owner / description…",
	sort: "Sort",
	sortStarsAsc: "Stars ↑",
	sortStarsDesc: "Stars ↓",
	sortTodayAsc: "Today +stars ↑",
	sortTodayDesc: "Today +stars ↓",
	kind: "Kind",
	kindAll: "All repos",
	kindPlugin: "Plugins only",
	kindNonplugin: "Non-plugins",
	curatedOnly: "Awesome only",
	installedOnly: "Installed",
	since: "Active",
	sinceAll: "Any time",
	sinceDay: "24 hours",
	sinceWeek: "7 days",
	sinceMonth: "30 days",
	sinceYear: "1 year",
	pageSize: "Per page",
	prevPage: "Prev",
	nextPage: "Next",
	stars: "stars",
	today: "today",
	todayGain: "today",
	todayGainHint: "Today star gain vs the local daily baseline (needs one day of history).",
	publishAge: "publish age",
	publishAgeHint: "Time since the repo was created (null when the index has no date).",
	published: "published",
	updatedShort: "updated",
	install: "Install",
	uninstall: "Uninstall",
	installed: "Installed",
	curatedBadge: "awesome",
	pluginBadge: "plugin",
	nonpluginBadge: "non-plugin",
	pendingBadge: "unverified",
	installTitle: "Install {0}?",
	installFrom: "Source: {0}",
	installVia: "Install target: {0}",
	riskCurated: "Curated in awesome-dsh-plugin — verified listing, one click to install.",
	riskCommunity: "Community repo. Plugins are third-party code: install only sources you trust.",
	riskNonplugin: "This repo may NOT be a dsh plugin — installation may fail or do nothing.",
	confirm: "Install",
	cancel: "Cancel",
	installing: "Installing {0}…",
	installDone: "Installed. Refresh the page to activate.",
	installFailed: "Install failed",
	uninstallTitle: "Uninstall {0}?",
	uninstallDesc: "Removes the package and its bundle row from this profile.",
	uninstalling: "Uninstalling {0}…",
	uninstallDone: "Uninstalled.",
	empty: "No matching repos.",
	loading: "Loading catalog…",
	loadError: "Could not load the catalog. Showing the bundled snapshot.",
	rateLimitNote: "GitHub rate limit hit — resets in {0}s. Data may be stale.",
	tokenConfigured: "GitHub token active",
	publish: "Publish my plugin",
	publishTitle: "Publish a plugin to the market",
	publishDesc: "The market indexes every GitHub repo tagged dsh-plugin. Adding the tag is all it takes — your repo appears after GitHub reindexes (usually minutes).",
	publishRepo: "owner/repo",
	publishMyRepos: "My repos (token)",
	publishCheck: "Check topic",
	publishHasTopic: "This repo already has the dsh-plugin topic — it will show up in the market.",
	publishAdd: "Add dsh-plugin topic",
	publishAdded: "Topic added! It will appear in the market within minutes.",
	publishNeedToken: "A GitHub token (repo scope) is required to write topics. Options:",
	publishManual: "On the repo page click the gear next to \"About\" and add the topic \"dsh-plugin\".",
	publishCopyGh: "Copy gh command",
	publishCopied: "Copied",
	verifyHint: "Unverified repos: we check their package.json on demand.",
	close: "Close",
	openRepo: "Open on GitHub",
	justNow: "just now",
	minsAgo: "{0} min ago",
	hoursAgo: "{0} h ago",
	daysAgo: "{0} d ago",
	monthsAgo: "{0} mo ago",
	yearsAgo: "{0} y ago",
	tokenField: "GitHub token (optional)",
	tokenHint: "Boosts GitHub API limits (search 10→30/min, core 60→5000/h) and enables the plugin-verification batch. Memory only — never written to disk or logs, cleared on restart.",
	tokenPlaceholder: "ghp_… (repo scope is enough)",
	tokenSave: "Save",
	tokenSaved: "Token saved for this session.",
	tokenMissingSettings: "Set the token in Settings → Plugins → plugin configuration (dsh ≥ rc.7), or via cordis.yml / DSHM_GITHUB_TOKEN."
};
const zh = {
	nav: "DSH 商店",
	versionHint: "dsh-store v{0}",
	title: "DSH 商店",
	subtitle: "GitHub 上所有带 #dsh-plugin 标签的项目 — 浏览、搜索、安装。",
	refresh: "刷新",
	autoRefresh: "每 30 分钟刷新一次",
	refreshing: "刷新中…",
	shardProgress: "已抓取 {0} 个仓库（{1}/{2} 分片）",
	sourceCdn: "更新于",
	sourceLive: "更新于",
	sourceCache: "更新于",
	sourceSnapshot: "快照 · {0}",
	updatedAt: "{0}",
	syncedAt: "同步于 {0}",
	indexAge: "索引生成于 {0}（CI 每 2 小时重建）",
	all: "全部",
	expandCats: "展开 {0} 个类别",
	collapseCats: "收起",
	searchPlaceholder: "搜索 项目名 / 作者 / 简介…",
	sort: "排序",
	sortStarsAsc: "star 数升序",
	sortStarsDesc: "star 数降序",
	sortTodayAsc: "今日 star 增长升序",
	sortTodayDesc: "今日 star 增长降序",
	kind: "类型",
	kindAll: "全部项目",
	kindPlugin: "仅插件",
	kindNonplugin: "非插件",
	curatedOnly: "仅精选",
	installedOnly: "已安装",
	since: "最近活跃",
	sinceAll: "不限",
	sinceDay: "24 小时",
	sinceWeek: "7 天",
	sinceMonth: "30 天",
	sinceYear: "1 年",
	pageSize: "每页",
	prevPage: "上一页",
	nextPage: "下一页",
	stars: "star",
	today: "今日",
	todayGain: "今日",
	todayGainHint: "今日 star 增长（与本地每日基线对比，需要一天历史数据）。",
	publishAge: "发布时长",
	publishAgeHint: "距仓库创建的时间（索引无日期时为空）。",
	published: "发布",
	updatedShort: "更新",
	install: "安装",
	uninstall: "卸载",
	installed: "已安装",
	curatedBadge: "精选",
	pluginBadge: "插件",
	nonpluginBadge: "非插件",
	pendingBadge: "待判定",
	installTitle: "安装 {0}？",
	installFrom: "来源：{0}",
	installVia: "安装目标：{0}",
	riskCurated: "awesome 精选条目 — 已人工收录，一键安装。",
	riskCommunity: "社区项目。插件属于第三方代码：请只安装你信任的来源。",
	riskNonplugin: "该仓库可能不是 dsh 插件 — 安装可能失败或无效果。",
	confirm: "安装",
	cancel: "取消",
	installing: "正在安装 {0}…",
	installDone: "安装完成。刷新页面即可生效。",
	installFailed: "安装失败",
	uninstallTitle: "卸载 {0}？",
	uninstallDesc: "将从该 profile 移除依赖与 bundle 条目。",
	uninstalling: "正在卸载 {0}…",
	uninstallDone: "已卸载。",
	empty: "没有匹配的项目。",
	loading: "正在加载目录…",
	loadError: "目录加载失败，已回退内置快照。",
	rateLimitNote: "GitHub 限流 — {0} 秒后恢复。数据可能不是最新。",
	tokenConfigured: "GitHub token 已启用",
	publish: "上传我的插件",
	publishTitle: "把插件上传到市场",
	publishDesc: "市场收录所有带 dsh-plugin 标签的 GitHub 仓库。打上标签即可上架 — GitHub 重新索引后（通常几分钟）就能在市场搜到。",
	publishRepo: "owner/repo",
	publishMyRepos: "我的仓库（需 token）",
	publishCheck: "检查标签",
	publishHasTopic: "该仓库已有 dsh-plugin 标签 — 即将出现在市场中。",
	publishAdd: "添加 dsh-plugin 标签",
	publishAdded: "标签已添加！几分钟内即可在市场搜到。",
	publishNeedToken: "写标签需要 GitHub token（repo 权限）。两种方式：",
	publishManual: "打开仓库页，点 About 旁的齿轮，添加标签「dsh-plugin」。",
	publishCopyGh: "复制 gh 命令",
	publishCopied: "已复制",
	verifyHint: "待判定项目：我们会按需抓取其 package.json 校验。",
	close: "关闭",
	openRepo: "打开 GitHub",
	justNow: "刚刚",
	minsAgo: "{0} 分钟前",
	hoursAgo: "{0} 小时前",
	daysAgo: "{0} 天前",
	monthsAgo: "{0} 个月前",
	yearsAgo: "{0} 年前",
	tokenField: "GitHub token（可选）",
	tokenHint: "提升 GitHub API 限额（search 10→30/分钟、core 60→5000/小时）并启用插件判定批处理。仅存内存 — 不落盘、不进日志，重启即清空。",
	tokenPlaceholder: "ghp_…（repo 权限即可）",
	tokenSave: "保存",
	tokenSaved: "Token 已保存（仅本次会话）。",
	tokenMissingSettings: "在 设置 → 插件 → 插件配置 里填写 token（dsh ≥ rc.7），或通过 cordis.yml / DSHM_GITHUB_TOKEN 环境变量配置。"
};
//#endregion
//#region src/client/market-data.ts
function visiblePlugins(plugins, options, isInstalled) {
	const needle = options.query.trim().toLowerCase();
	const now = Date.now();
	const list = plugins.filter((p) => {
		if (options.category !== "all" && p.category !== options.category) return false;
		if (options.kind === "plugin" && p.isPlugin !== true) return false;
		if (options.kind === "nonplugin" && p.isPlugin === true) return false;
		if (options.curatedOnly && !p.curated) return false;
		if (options.installedOnly && !(isInstalled?.(p) ?? false)) return false;
		if (options.sinceDays > 0) {
			if (p.pushed === null) return false;
			const pushed = Date.parse(p.pushed);
			if (Number.isNaN(pushed) || now - pushed > options.sinceDays * 864e5) return false;
		}
		if (needle !== "") {
			if (!(p.name + " " + p.owner + " " + p.description).toLowerCase().includes(needle)) return false;
		}
		return true;
	});
	const todayRank = (v) => v === null ? Number.NEGATIVE_INFINITY : v;
	const starRank = (v) => v === null ? Number.NEGATIVE_INFINITY : v;
	const sorted = [...list];
	if (options.sort === "stars-desc") sorted.sort((a, b) => starRank(b.stars) - starRank(a.stars));
	else if (options.sort === "stars-asc") sorted.sort((a, b) => starRank(a.stars) - starRank(b.stars));
	else if (options.sort === "today-desc") sorted.sort((a, b) => todayRank(b.todayStars) - todayRank(a.todayStars));
	else if (options.sort === "today-asc") sorted.sort((a, b) => todayRank(a.todayStars) - todayRank(b.todayStars));
	return sorted;
}
function formatStars(n) {
	if (n === null) return "—";
	if (n >= 1e3) {
		const k = n / 1e3;
		return (k >= 10 ? Math.round(k) : Math.round(k * 10) / 10) + "k";
	}
	return String(n);
}
/** Relative time like "3 days ago" / "2 years ago". */
function relativeFromNow(iso, t) {
	if (iso === null) return "—";
	const time = Date.parse(iso);
	if (Number.isNaN(time)) return "—";
	const diff = Date.now() - time;
	if (diff < 0) return t("justNow");
	const minutes = Math.floor(diff / 6e4);
	if (minutes < 1) return t("justNow");
	if (minutes < 60) return t("minsAgo").replace("{0}", String(minutes));
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return t("hoursAgo").replace("{0}", String(hours));
	const days = Math.floor(hours / 24);
	if (days < 30) return t("daysAgo").replace("{0}", String(days));
	const months = Math.floor(days / 30);
	if (months < 12) return t("monthsAgo").replace("{0}", String(months));
	const years = Math.floor(months / 12);
	return t("yearsAgo").replace("{0}", String(years));
}
/** Duration between two ISO dates, like "2y 3mo" / "3mo 4d" / "12d". */
function durationBetween(fromIso, toIso) {
	if (fromIso === null) return "—";
	const from = Date.parse(fromIso);
	const to = Date.parse(toIso);
	if (Number.isNaN(from) || Number.isNaN(to) || to < from) return "—";
	let days = Math.floor((to - from) / 864e5);
	const years = Math.floor(days / 365);
	days -= years * 365;
	const months = Math.floor(days / 30);
	days -= months * 30;
	if (years > 0) return years + "y " + months + "mo";
	if (months > 0) return months + "mo " + days + "d";
	return days + "d";
}
function pageItems(current, total) {
	if (total <= 7) {
		const all = [];
		for (let i = 1; i <= total; i++) all.push(i);
		return all;
	}
	const items = [1];
	let start = Math.max(2, current - 1);
	let end = Math.min(total - 1, current + 1);
	if (current <= 4) end = 5;
	if (current >= total - 3) start = total - 4;
	if (start > 2) items.push("…");
	for (let i = start; i <= end; i++) items.push(i);
	if (end < total - 1) items.push("…");
	items.push(total);
	return items;
}
/** Category chip order: stable registry order — chips never move around. */
function orderedCategories(categories, _active, _open) {
	return categories;
}
function avatarColor(name) {
	let hash = 0;
	for (let i = 0; i < name.length; i++) hash = hash * 31 + name.charCodeAt(i) | 0;
	return "hsl(" + (hash % 360 + 360) % 360 + " 55% 52%)";
}
//#endregion
//#region src/client/icon.ts
/** dsh-store brand icon (64px, base64-inlined so the client bundle stays self-contained). */
const ICON_DATA = "data:image/png;base64,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";
//#endregion
//#region src/client/MarketSection.tsx
/**
* The market settings section: category chips, search, sort, filters, the
* repo grid with install/uninstall, and the publish dialog. All filtering
* and sorting run on the in-memory list; the network is only touched on
* mount, explicit refresh, and the quiet refresh after filter changes.
*/
const PAGE_SIZES = [
	24,
	48,
	96
];
function MarketSection(props) {
	const t = props.t;
	const localeSnap = (0, react.useSyncExternalStore)((cb) => props.locale.subscribe(cb), () => props.locale.getSnapshot());
	const lang = String(localeSnap.active).toLowerCase().startsWith("zh") ? "zh" : "en";
	const [data, setData] = (0, react.useState)(null);
	const [fetchAt, setFetchAt] = (0, react.useState)(null);
	const rootRef = (0, react.useRef)(null);
	const chipsRef = (0, react.useRef)(null);
	const [catsClamped, setCatsClamped] = (0, react.useState)(true);
	const [hiddenCatCount, setHiddenCatCount] = (0, react.useState)(0);
	const categoriesRef = (0, react.useRef)([]);
	const [loadError, setLoadError] = (0, react.useState)(false);
	const [status, setStatus] = (0, react.useState)(null);
	const [q, setQ] = (0, react.useState)("");
	const [cat, setCat] = (0, react.useState)("all");
	const [kind, setKind] = (0, react.useState)("all");
	const [curatedOnly, setCuratedOnly] = (0, react.useState)(false);
	const [installedOnly, setInstalledOnly] = (0, react.useState)(false);
	const [sort, setSort] = (0, react.useState)("stars-desc");
	const [page, setPage] = (0, react.useState)(1);
	const [pageSize, setPageSize] = (0, react.useState)(24);
	const [sortOpen, setSortOpen] = (0, react.useState)(false);
	const [sizeOpen, setSizeOpen] = (0, react.useState)(false);
	const [confirming, setConfirming] = (0, react.useState)(null);
	const [removing, setRemoving] = (0, react.useState)(null);
	const [publishOpen, setPublishOpen] = (0, react.useState)(false);
	const [toast, setToast] = (0, react.useState)(null);
	const [verifyBusy, setVerifyBusy] = (0, react.useState)(false);
	const refreshing = status?.refreshing === true;
	const installing = status?.install?.active === true;
	const fetchRegistry = (0, react.useCallback)((force) => {
		fetch("/dsh-store/registry" + (force ? "?force=1" : ""), { cache: "no-store" }).then((res) => {
			if (!res.ok) throw new Error("HTTP " + res.status);
			return res.json();
		}).then((body) => {
			if (body.registry !== void 0) setData(body.registry);
			if (body.fetchAt !== void 0) setFetchAt(body.fetchAt);
			setLoadError(false);
		}).catch(() => setLoadError(true));
	}, []);
	const fetchStatus = (0, react.useCallback)(() => {
		fetch("/dsh-store/status", { cache: "no-store" }).then((res) => res.json()).then((body) => setStatus(body)).catch(() => {});
	}, []);
	(0, react.useEffect)(() => {
		fetchRegistry(true);
		fetchStatus();
		const timer = setInterval(() => {
			fetchRegistry(true);
			fetchStatus();
		}, 1800 * 1e3);
		return () => clearInterval(timer);
	}, [fetchRegistry, fetchStatus]);
	(0, react.useLayoutEffect)(() => {
		const root = rootRef.current;
		if (root === null) return;
		const update = () => {
			let el = root.parentElement;
			while (el !== null && el.getBoundingClientRect().height < 100) el = el.parentElement;
			if (el === null) return;
			root.style.height = el.getBoundingClientRect().height + "px";
		};
		update();
		const ro = new ResizeObserver(update);
		if (root.parentElement !== null) ro.observe(root.parentElement);
		window.addEventListener("resize", update);
		return () => {
			ro.disconnect();
			window.removeEventListener("resize", update);
		};
	}, []);
	const CATS_CLAMPED_ROWS = 3;
	(0, react.useLayoutEffect)(() => {
		const wrap = chipsRef.current;
		if (wrap === null) return;
		const measure = () => {
			const pills = Array.from(wrap.querySelectorAll("button"));
			if (pills.length === 0) return;
			const wrapRect = wrap.getBoundingClientRect();
			let visible = 0;
			for (const pill of pills) {
				const top = pill.getBoundingClientRect().top - wrapRect.top;
				if (Math.round(top / (pill.offsetHeight + 6)) < CATS_CLAMPED_ROWS) visible += 1;
			}
			if (catsClamped) {
				wrap.style.maxHeight = "none";
				const probe = pills[Math.max(0, visible - 1)];
				const maxH = probe !== void 0 ? probe.getBoundingClientRect().bottom - wrapRect.top + 1 : 96;
				wrap.style.maxHeight = maxH + "px";
			} else wrap.style.maxHeight = "none";
			const totalCats = categoriesRef.current.length;
			setHiddenCatCount(Math.max(0, totalCats - (visible - 1)));
		};
		const ro = new ResizeObserver(measure);
		ro.observe(wrap);
		measure();
		document.fonts?.ready.then(measure).catch(() => {});
		const timer = setTimeout(measure, 600);
		return () => {
			ro.disconnect();
			clearTimeout(timer);
		};
	}, [catsClamped, data]);
	(0, react.useEffect)(() => {
		const timer = setTimeout(() => {
			fetchRegistry(false);
			fetchStatus();
		}, 150);
		return () => clearTimeout(timer);
	}, [
		cat,
		kind,
		curatedOnly,
		sort,
		fetchRegistry,
		fetchStatus
	]);
	(0, react.useEffect)(() => {
		if (!refreshing && !installing) return;
		const timer = setInterval(() => {
			fetchRegistry(false);
			fetchStatus();
		}, refreshing ? 5e3 : 800);
		return () => clearInterval(timer);
	}, [
		refreshing,
		installing,
		fetchRegistry,
		fetchStatus
	]);
	const verifyPage = (0, react.useCallback)((entries) => {
		const unknown = entries.filter((e) => e.isPlugin === null).map((e) => e.owner + "/" + e.name).slice(0, 12);
		if (unknown.length === 0 || verifyBusy) return;
		setVerifyBusy(true);
		fetch("/dsh-store/verify", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ repos: unknown })
		}).then((res) => res.json()).then((body) => {
			const verdicts = body.verdicts ?? {};
			setData((prev) => {
				if (prev === null) return prev;
				return {
					...prev,
					plugins: prev.plugins.map((e) => {
						const v = verdicts[(e.owner + "/" + e.name).toLowerCase()];
						if (v === void 0) return e;
						return {
							...e,
							isPlugin: v
						};
					})
				};
			});
		}).catch(() => {}).finally(() => setVerifyBusy(false));
	}, [verifyBusy]);
	const plugins = data?.plugins ?? [];
	const categories = data === null ? [] : Object.keys(data.categories);
	categoriesRef.current = categories;
	const catLabel = (0, react.useCallback)((id) => {
		if (data === null) return id;
		const c = data.categories[id];
		return c === void 0 ? id : c[lang] ?? c.en;
	}, [data, lang]);
	/** Which repos are installed in the current profile (from /status). */
	const installedSet = (0, react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		const deps = status?.installed ?? {};
		for (const [name, spec] of Object.entries(deps)) {
			set.add(name.toLowerCase());
			set.add(spec.toLowerCase());
		}
		return set;
	}, [status]);
	const isInstalled = (0, react.useCallback)((e) => {
		const key = (e.owner + "/" + e.name).toLowerCase();
		if (installedSet.has(key)) return true;
		for (const id of installedSet) {
			if (id !== "" && key.includes(id)) return true;
			if (id.includes(key) && id.length > key.length && id.includes("github:")) return true;
		}
		return false;
	}, [installedSet]);
	/** Per-category counts under the CURRENT filter conditions (kind/curatedOnly/installedOnly/search), excluding the category filter itself. */
	const categoryCounts = (0, react.useMemo)(() => {
		const per = /* @__PURE__ */ new Map();
		let all = 0;
		const needle = q.trim().toLowerCase();
		for (const p of plugins) {
			if (kind === "plugin" && p.isPlugin !== true) continue;
			if (kind === "nonplugin" && p.isPlugin === true) continue;
			if (curatedOnly && !p.curated) continue;
			if (installedOnly && !isInstalled(p)) continue;
			if (needle !== "") {
				if (!(p.name + " " + p.owner + " " + p.description).toLowerCase().includes(needle)) continue;
			}
			all += 1;
			per.set(p.category, (per.get(p.category) ?? 0) + 1);
		}
		return {
			all,
			per
		};
	}, [
		plugins,
		kind,
		curatedOnly,
		q,
		installedOnly,
		isInstalled
	]);
	const list = (0, react.useMemo)(() => visiblePlugins(plugins, {
		category: cat,
		kind,
		curatedOnly,
		installedOnly,
		query: q,
		sort,
		sinceDays: 0,
		lang
	}, isInstalled), [
		plugins,
		cat,
		kind,
		curatedOnly,
		installedOnly,
		q,
		sort,
		lang,
		isInstalled
	]);
	const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
	const currentPage = Math.min(page, totalPages);
	const pageList = list.slice((currentPage - 1) * pageSize, currentPage * pageSize);
	(0, react.useEffect)(() => {
		verifyPage(pageList);
	}, [pageList, verifyPage]);
	const doInstall = (0, react.useCallback)((entry) => {
		setConfirming(null);
		fetch("/dsh-store/install", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				repo: entry.owner + "/" + entry.name,
				npm: entry.npm
			})
		}).then((res) => res.json()).then((body) => {
			setToast(body.ok === true ? t("installDone") : t("installFailed") + ": " + (body.message ?? body.error ?? ""));
			fetchStatus();
		}).catch(() => setToast(t("installFailed")));
	}, [t, fetchStatus]);
	const doUninstall = (0, react.useCallback)((entry) => {
		setRemoving(null);
		fetch("/dsh-store/uninstall", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ repo: entry.owner + "/" + entry.name })
		}).then((res) => res.json()).then((body) => {
			setToast(body.ok === true ? t("uninstallDone") : t("installFailed") + ": " + (body.message ?? body.error ?? ""));
			fetchStatus();
		}).catch(() => setToast(t("installFailed")));
	}, [t, fetchStatus]);
	(0, react.useEffect)(() => {
		if (toast === null) return;
		const timer = setTimeout(() => setToast(null), 6e3);
		return () => clearTimeout(timer);
	}, [toast]);
	const sortItems = (0, react.useMemo)(() => [
		{
			id: "stars-desc",
			label: t("sortStarsDesc")
		},
		{
			id: "stars-asc",
			label: t("sortStarsAsc")
		},
		{
			id: "today-desc",
			label: t("sortTodayDesc")
		},
		{
			id: "today-asc",
			label: t("sortTodayAsc")
		}
	], [t]);
	const sizeItems = (0, react.useMemo)(() => PAGE_SIZES.map((n) => ({
		id: String(n),
		label: String(n)
	})), []);
	const sourceLabel = (() => {
		if (data === null) return "";
		if (data.source === "snapshot") return t("sourceSnapshot").replace("{0}", relativeFromNow(data.updated, t));
		const synced = fetchAt !== null ? relativeFromNow(fetchAt, t) : relativeFromNow(data.updated, t);
		return t("syncedAt").replace("{0}", synced);
	})();
	/** The index itself is rebuilt by CI every 2h; warn when it is stale. */
	const indexAgeNote = (() => {
		if (data === null || data.source === "snapshot") return null;
		const age = Date.now() - Date.parse(data.updated);
		if (!Number.isFinite(age) || age < 3 * 36e5) return null;
		return t("indexAge").replace("{0}", relativeFromNow(data.updated, t));
	})();
	const progressLabel = (() => {
		const p = status?.progress;
		if (p === void 0 || p.shards === void 0 || p.shards === 0) return "";
		return t("shardProgress").replace("{0}", String(p.repos ?? 0)).replace("{1}", String(p.shard ?? 0)).replace("{2}", String(p.shards));
	})();
	const rateNote = (() => {
		const r = status?.rateLimit;
		if (r === null || r === void 0 || r.remaining === void 0 || r.remaining > 0) return null;
		const reset = r.reset ?? 0;
		return t("rateLimitNote").replace("{0}", String(Math.max(0, Math.round(reset - Date.now() / 1e3))));
	})();
	const chipCats = orderedCategories(categories, cat, false);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "pcm-root",
		ref: rootRef,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "pcm-sticky-top",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pcm-brand-card",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "pcm-header",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									flexDirection: "column",
									gap: 3,
									flex: "1 1 auto",
									minWidth: 200
								},
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: 8
									},
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
											className: "pcm-icon",
											src: ICON_DATA,
											alt: "",
											width: 22,
											height: 22
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											style: {
												display: "inline-flex",
												alignItems: "center",
												gap: 5
											},
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
												className: "pcm-title",
												children: t("title")
											}), status?.version !== void 0 && status.version !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
												className: "pcm-version",
												title: t("versionHint").replace("{0}", status.version),
												children: ["v", status.version]
											})]
										}),
										status?.tokenConfigured === true && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "pcm-token-badge",
											children: t("tokenConfigured")
										})
									]
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "pcm-subtitle",
									children: t("subtitle")
								})]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "outline",
								size: "sm",
								icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSendOutline16, { size: 14 }),
								onClick: () => setPublishOpen(true),
								className: "pcm-publish-btn",
								style: { marginLeft: "auto" },
								children: t("publish")
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "pcm-header-row2",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "pcm-subtitle",
									children: t("autoRefresh")
								}),
								data !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "pcm-source",
									children: sourceLabel
								}),
								progressLabel !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "pcm-progress",
									children: progressLabel
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: "pcm-divider" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "outline",
									size: "sm",
									icon: refreshing ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "pcm-spin",
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, { size: 14 })
									}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconRefreshOutline14, { size: 14 }),
									onClick: () => {
										fetchRegistry(true);
										fetchStatus();
									},
									disabled: refreshing,
									className: "pcm-brand-btn",
									children: refreshing ? t("refreshing") : t("refresh")
								})
							]
						})]
					}),
					rateNote !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pcm-rate",
						children: rateNote
					}),
					indexAgeNote !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pcm-rate",
						children: indexAgeNote
					}),
					loadError && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pcm-rate",
						children: t("loadError")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: catsClamped ? "pcm-chips pcm-chips-clamped" : "pcm-chips",
						ref: chipsRef,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Pill, {
							active: cat === "all",
							onClick: () => {
								setCat("all");
								setPage(1);
							},
							children: [t("all"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "pcm-count",
								children: categoryCounts.all
							})]
						}), chipCats.map((id) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Pill, {
							active: cat === id,
							onClick: () => {
								setCat(id);
								setPage(1);
							},
							children: [catLabel(id), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "pcm-count",
								children: categoryCounts.per.get(id) ?? 0
							})]
						}, id))]
					}),
					hiddenCatCount > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pcm-chip-more",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => setCatsClamped((v) => !v),
							children: catsClamped ? t("expandCats").replace("{0}", String(hiddenCatCount)) : t("collapseCats")
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pcm-toolbar",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "pcm-seg",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										className: kind === "all" ? "on" : "",
										onClick: () => {
											setKind("all");
											setPage(1);
										},
										children: t("kindAll")
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										className: kind === "plugin" ? "on" : "",
										onClick: () => {
											setKind("plugin");
											setPage(1);
										},
										children: t("kindPlugin")
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										className: kind === "nonplugin" ? "on" : "",
										onClick: () => {
											setKind("nonplugin");
											setPage(1);
										},
										children: t("kindNonplugin")
									})
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Pill, {
								active: curatedOnly,
								onClick: () => {
									setCuratedOnly((v) => !v);
									setPage(1);
								},
								children: t("curatedOnly")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Pill, {
								active: installedOnly,
								onClick: () => {
									setInstalledOnly((v) => !v);
									setPage(1);
								},
								children: t("installedOnly")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
								className: "pcm-search",
								icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSearchOutline16, { size: 14 }),
								value: q,
								placeholder: t("searchPlaceholder"),
								onChange: (e) => {
									setQ(e.target.value);
									setPage(1);
								}
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Menu, {
								open: sortOpen,
								onClose: () => setSortOpen(false),
								onSelect: (id) => {
									setSort(id);
									setPage(1);
								},
								align: "end",
								anchor: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "outline",
									size: "sm",
									onClick: () => setSortOpen((o) => !o),
									children: t("sort")
								}),
								items: sortItems,
								selectedId: sort
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "pcm-scroll",
				children: list.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "pcm-empty",
					children: data === null ? t("loading") : t("empty")
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(react_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "pcm-grid",
					children: pageList.map((entry) => {
						const installed = isInstalled(entry);
						const today = entry.todayStars;
						return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "pcm-card",
							onClick: () => window.open(entry.url, "_blank", "noopener"),
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pcm-card-top",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: "pcm-av",
										style: { background: avatarColor(entry.name) },
										children: (entry.name.replace(/^dsh[-_]/i, "").charAt(0) || "P").toUpperCase()
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										style: { overflow: "hidden" },
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
											className: "pcm-name",
											children: entry.name
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
											className: "pcm-owner",
											children: entry.owner
										})]
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "pcm-desc",
									children: entry.description === "" ? "—" : entry.description
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pcm-badges",
									children: [
										entry.isPlugin === true && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "pcm-badge pcm-badge-plugin",
											children: t("pluginBadge")
										}),
										entry.isPlugin === false && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "pcm-badge pcm-badge-nonplugin",
											children: t("nonpluginBadge")
										}),
										entry.isPlugin === null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "pcm-badge pcm-badge-pending",
											children: t("pendingBadge")
										}),
										entry.curated && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "pcm-badge pcm-badge-curated",
											children: t("curatedBadge")
										}),
										installed && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "pcm-badge pcm-badge-installed",
											children: t("installed")
										})
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pcm-stats",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											className: "pcm-stars",
											children: ["★ ", formatStars(entry.stars)]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											title: t("todayGainHint"),
											children: [
												t("todayGain"),
												" ",
												today === null ? "—" : (today >= 0 ? "+" : "") + today
											]
										}),
										entry.created !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											title: t("publishAgeHint"),
											children: t("publishAge") + " " + durationBetween(entry.created, (/* @__PURE__ */ new Date()).toISOString())
										})
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pcm-meta",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: catLabel(entry.category) }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											title: entry.pushed ?? void 0,
											children: t("updatedShort") + " " + relativeFromNow(entry.pushed, t)
										}),
										entry.language !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: entry.language })
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pcm-actions",
									onClick: (e) => e.stopPropagation(),
									children: [installed ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										variant: "outline",
										size: "sm",
										disabled: true,
										children: t("installed")
									}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										variant: "primary",
										size: "sm",
										onClick: () => setConfirming(entry),
										children: t("install")
									}), installed && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										variant: "ghost",
										size: "sm",
										onClick: () => setRemoving(entry),
										children: t("uninstall")
									})]
								})
							]
						}, entry.owner + "/" + entry.name);
					})
				}) })
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "pcm-pager",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "outline",
						size: "sm",
						disabled: currentPage <= 1,
						onClick: () => setPage((prev) => Math.max(1, prev - 1)),
						children: t("prevPage")
					}),
					pageItems(currentPage, totalPages).map((item, i) => item === "…" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						style: { opacity: .5 },
						children: "…"
					}, "e" + i) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						className: "pcm-page" + (item === currentPage ? " on" : ""),
						onClick: () => setPage(item),
						children: item
					}, item)),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "outline",
						size: "sm",
						disabled: currentPage >= totalPages,
						onClick: () => setPage((prev) => Math.min(totalPages, prev + 1)),
						children: t("nextPage")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Menu, {
						open: sizeOpen,
						onClose: () => setSizeOpen(false),
						onSelect: (id) => {
							setPageSize(Number(id));
							setPage(1);
						},
						align: "end",
						anchor: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setSizeOpen((o) => !o),
							children: t("pageSize") + " " + pageSize
						}),
						items: sizeItems,
						selectedId: String(pageSize)
					})
				]
			}),
			confirming !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(InstallModal, {
				t,
				entry: confirming,
				installing,
				statusLine: status?.install?.line ?? null,
				onClose: () => setConfirming(null),
				onConfirm: () => doInstall(confirming)
			}),
			removing !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
				open: true,
				onClose: () => setRemoving(null),
				title: t("uninstallTitle").replace("{0}", removing.name),
				description: t("uninstallDesc"),
				footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
					variant: "ghost",
					onClick: () => setRemoving(null),
					children: t("cancel")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
					variant: "primary",
					onClick: () => doUninstall(removing),
					children: t("uninstall")
				})] }),
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "pcm-modal-body",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pcm-cmd",
						children: removing.owner + "/" + removing.name
					})
				})
			}),
			publishOpen && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PublishModal, {
				t,
				onClose: () => setPublishOpen(false)
			}),
			toast !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: {
					position: "fixed",
					bottom: 20,
					right: 20,
					zIndex: 1e3,
					background: "var(--dsw-alias-bg-overlay, #1f2328)",
					color: "var(--dsw-alias-label-primary, #fff)",
					borderRadius: 10,
					padding: "10px 14px",
					fontSize: 13,
					boxShadow: "0 6px 24px rgba(0,0,0,.3)",
					maxWidth: 420
				},
				children: toast
			})
		]
	});
}
function InstallModal(props) {
	const { t, entry, installing, statusLine } = props;
	const target = entry.npm ?? "github:" + entry.owner + "/" + entry.name;
	const riskClass = entry.curated ? "pcm-risk pcm-risk-curated" : entry.isPlugin === true ? "pcm-risk pcm-risk-community" : "pcm-risk pcm-risk-nonplugin";
	const riskText = entry.curated ? t("riskCurated") : entry.isPlugin === true ? t("riskCommunity") : t("riskNonplugin");
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
		open: true,
		onClose: props.onClose,
		title: t("installTitle").replace("{0}", entry.owner + "/" + entry.name),
		description: entry.description,
		footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
			variant: "ghost",
			onClick: props.onClose,
			children: t("cancel")
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
			variant: "primary",
			onClick: props.onConfirm,
			disabled: installing,
			children: installing ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: "pcm-spin",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, { size: 14 })
			}) : t("confirm")
		})] }),
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: "pcm-modal-body",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { children: t("installFrom").replace("{0}", entry.url) }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: riskClass,
					children: riskText
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "pcm-cmd",
					children: t("installVia").replace("{0}", target)
				}),
				installing && statusLine !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "pcm-cmd",
					children: statusLine
				})
			]
		})
	});
}
function PublishModal(props) {
	const t = props.t;
	const [repo, setRepo] = (0, react.useState)("");
	const [myRepos, setMyRepos] = (0, react.useState)([]);
	const [checked, setChecked] = (0, react.useState)(null);
	const [result, setResult] = (0, react.useState)(null);
	const [error, setError] = (0, react.useState)(null);
	const [copied, setCopied] = (0, react.useState)(false);
	const [busy, setBusy] = (0, react.useState)(false);
	const loadMyRepos = () => {
		fetch("/dsh-store/publish/repos", { cache: "no-store" }).then((res) => res.json()).then((body) => setMyRepos(body.repos ?? [])).catch(() => {});
	};
	(0, react.useEffect)(loadMyRepos, []);
	const checkTopic = (target) => {
		setBusy(true);
		setResult(null);
		setError(null);
		fetch("/dsh-store/publish", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				repo: target,
				checkOnly: true
			})
		}).then((res) => res.json()).then((body) => {
			setChecked({
				repo: target,
				hasTopic: (body.topics ?? []).includes("dsh-plugin")
			});
		}).catch(() => setError("check failed")).finally(() => setBusy(false));
	};
	const addTopic = (target) => {
		setBusy(true);
		setResult(null);
		setError(null);
		fetch("/dsh-store/publish", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ repo: target })
		}).then((res) => res.json()).then((body) => {
			if (body.ok === true) setResult(t("publishAdded") + " " + (body.note ?? ""));
			else if (body.needToken === true) setResult(t("publishNeedToken") + " " + (body.hint ?? ""));
			else setError(body.error ?? "failed");
		}).catch(() => setError("failed")).finally(() => setBusy(false));
	};
	const copyGh = (target) => {
		const cmd = "gh api -X PUT repos/" + target + "/topics -f \"names[]=dsh-plugin\"";
		navigator.clipboard?.writeText(cmd);
		setCopied(true);
		setTimeout(() => setCopied(false), 2e3);
	};
	const ghCommand = repo.includes("/") ? "gh api -X PUT repos/" + repo + "/topics -f \"names[]=dsh-plugin\"" : "";
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
		open: true,
		onClose: props.onClose,
		title: t("publishTitle"),
		description: t("publishDesc"),
		footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
			variant: "ghost",
			onClick: props.onClose,
			children: t("close")
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
			variant: "primary",
			disabled: busy || !repo.includes("/"),
			onClick: () => addTopic(repo),
			children: t("publishAdd")
		})] }),
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: "pcm-modal-body",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
					value: repo,
					placeholder: t("publishRepo"),
					onChange: (e) => setRepo(e.target.value)
				}),
				myRepos.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					style: {
						fontSize: 12,
						opacity: .75
					},
					children: t("publishMyRepos")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "pcm-publish-repos",
					children: myRepos.map((r) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pcm-publish-repo",
						onClick: () => setRepo(r.full_name),
						children: r.full_name
					}, r.full_name))
				})] }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						gap: 8,
						alignItems: "center"
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "outline",
						size: "sm",
						disabled: busy || !repo.includes("/"),
						onClick: () => checkTopic(repo),
						children: t("publishCheck")
					}), ghCommand !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
						label: copied ? t("publishCopied") : t("publishCopyGh"),
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "ghost",
							size: "sm",
							icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCopyOutline16, { size: 14 }),
							onClick: () => copyGh(repo)
						})
					})]
				}),
				checked !== null && checked.repo === repo && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: checked.hasTopic ? "pcm-risk pcm-risk-curated" : "pcm-risk pcm-risk-community",
					children: checked.hasTopic ? t("publishHasTopic") : t("publishManual")
				}),
				result !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "pcm-risk pcm-risk-community",
					children: result
				}),
				error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "pcm-risk pcm-risk-nonplugin",
					children: error
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					style: {
						fontSize: 12,
						opacity: .7
					},
					children: t("publishManual")
				})
			]
		})
	});
}
//#endregion
//#region src/client/SettingsCard.tsx
/**
* The market's card on the plugin configuration page (dsh >= rc.7). The
* host-side settings namespace also registers githubToken for hosts whose
* settings page renders namespace forms; this card is our own chrome for
* every host: current token status + a memory-only token input.
*/
function SettingsCard(props) {
	const t = props.t;
	const [open, setOpen] = (0, react.useState)(false);
	const [status, setStatus] = (0, react.useState)(null);
	const [token, setToken] = (0, react.useState)("");
	const [saving, setSaving] = (0, react.useState)(false);
	const [saved, setSaved] = (0, react.useState)(false);
	(0, react.useEffect)(() => {
		if (!open) return;
		fetch("/dsh-plugin-market/status", { cache: "no-store" }).then((res) => res.json()).then((body) => {
			setStatus({
				tokenConfigured: body.tokenConfigured === true,
				version: body.version ?? null
			});
		}).catch(() => {});
	}, [open, saved]);
	const save = () => {
		if (token.trim() === "") return;
		setSaving(true);
		setSaved(false);
		fetch("/dsh-plugin-market/token", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ token: token.trim() })
		}).then((res) => res.json()).then((body) => {
			if (body.ok === true) {
				setSaved(true);
				setToken("");
			}
		}).catch(() => {}).finally(() => setSaving(false));
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.DisclosureRow, {
		icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSettingsOutline16, { size: 14 }),
		title: t("title") + (status?.tokenConfigured === true ? " · " + t("tokenConfigured") : ""),
		open,
		expandable: true,
		onToggle: () => setOpen((o) => !o),
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			style: {
				display: "flex",
				flexDirection: "column",
				gap: 8,
				padding: "4px 0 8px"
			},
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
					type: "password",
					autoComplete: "off",
					value: token,
					placeholder: t("tokenPlaceholder"),
					onChange: (e) => setToken(e.target.value)
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						gap: 8,
						alignItems: "center"
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "primary",
						size: "sm",
						disabled: saving || token.trim() === "",
						onClick: save,
						children: t("tokenSave")
					}), saved && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						style: {
							fontSize: 12,
							color: "#22c55e"
						},
						children: t("tokenSaved")
					})]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					style: {
						fontSize: 12,
						opacity: .75,
						lineHeight: 1.5
					},
					children: t("tokenHint")
				})
			]
		})
	});
}
//#endregion
//#region src/client/styles.ts
/** Inline stylesheet: injected once with a data-plugin tag; hot reloads replace its content in place. */
const CSS = ".pcm-root{display:flex;flex-direction:column;gap:12px;padding:4px 0 0}.pcm-sticky-top{position:sticky;top:0;z-index:5;background:var(--dsw-alias-bg-base,#fff);padding:4px 2px 8px;display:flex;flex-direction:column;gap:10px;border-bottom:1px solid rgba(128,128,128,.18)}.pcm-brand-card{background:#040506;border-radius:16px;padding:14px 18px 12px;display:flex;flex-direction:column;gap:10px;}.pcm-brand-card .pcm-title{color:#f5f7ff;font-size:16px}.pcm-brand-card .pcm-subtitle{color:rgba(245,247,255,.85);font-size:12.5px;font-weight:500}.pcm-brand-card .pcm-source{color:rgba(245,247,255,.92);border-color:rgba(245,247,255,.45);opacity:1;font-weight:500}.pcm-brand-card .pcm-progress{color:rgba(245,247,255,.88);font-weight:500}.pcm-brand-card .pcm-divider{background:rgba(245,247,255,.35)}.pcm-brand-card .pcm-brand-btn{border-color:rgba(245,247,255,.55);color:#ffffff;background:rgba(245,247,255,.1);font-weight:500}.pcm-brand-card .pcm-brand-btn:hover{border-color:#4d6bfe;color:#fff}.pcm-publish-btn{border-color:#6d87ff;color:#eef2ff;background:rgba(77,107,254,.25);font-weight:600}.pcm-publish-btn:hover{background:rgba(77,107,254,.32);color:#fff}.pcm-version{font-size:11px;color:#8ea2d6;background:rgba(77,107,254,.18);border:1px solid rgba(77,107,254,.45);border-radius:999px;padding:1px 8px;line-height:16px;font-weight:500;letter-spacing:.2px}.pcm-token-badge{font-size:10.5px;color:#6ee7a0;background:rgba(52,211,153,.14);border:1px solid rgba(52,211,153,.4);border-radius:999px;padding:1px 8px;line-height:16px}.pcm-header{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.pcm-header-row2{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pcm-divider{width:1px;height:16px;background:rgba(128,128,128,.35);flex:none}.pcm-title{font-size:15px;font-weight:600;margin:0;flex:1 1 auto}.pcm-subtitle{font-size:12px;opacity:.7}.pcm-source{font-size:11px;padding:1px 7px;border-radius:999px;border:1px solid currentColor;opacity:.75;white-space:nowrap}.pcm-progress{font-size:12px;opacity:.75}.pcm-rate{font-size:12px;color:#d97706}.pcm-chips{display:flex;flex-wrap:wrap;gap:6px;position:relative}.pcm-chips-clamped{overflow:hidden}.pcm-chip-more{display:flex;justify-content:flex-start}.pcm-count{font-size:10px;opacity:.68;margin-left:5px;background:rgba(128,128,128,.16);border-radius:999px;padding:0 6px;line-height:15px;display:inline-block}.pcm-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.pcm-search{flex:1 1 220px;min-width:180px}.pcm-seg{display:inline-flex;border-radius:8px;overflow:hidden;border:1px solid rgba(128,128,128,.3)}.pcm-seg button{border:none;background:transparent;padding:4px 10px;font-size:12px;cursor:pointer;color:inherit}.pcm-seg button.on{background:#4f6ef7;color:#fff}.pcm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:10px}.pcm-card{border:1px solid rgba(128,128,128,.25);border-radius:10px;padding:10px 12px;display:flex;flex-direction:column;gap:8px;cursor:pointer}.pcm-card:hover{border-color:#4f6ef7}.pcm-card-top{display:flex;align-items:center;gap:8px}.pcm-av{width:26px;height:26px;border-radius:6px;flex:none;display:flex;align-items:center;justify-content:center;font-size:12px;color:#fff;font-weight:600}.pcm-name{font-weight:600;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pcm-owner{font-size:11px;opacity:.65}.pcm-desc{font-size:12px;opacity:.85;line-height:1.45;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:2.9em}.pcm-badges{display:flex;gap:4px;flex-wrap:wrap}.pcm-badge{font-size:10.5px;padding:0 6px;border-radius:999px;line-height:18px;white-space:nowrap}.pcm-badge-curated{background:rgba(34,197,94,.14);color:#22c55e}.pcm-badge-nonplugin{background:rgba(148,163,184,.16);opacity:.8}.pcm-badge-pending{background:rgba(217,119,6,.14);color:#d97706}.pcm-badge-installed{background:rgba(79,110,247,.16);color:#4f6ef7}.pcm-badge-plugin{background:rgba(79,110,247,.16);color:#4f6ef7}.pcm-stats{display:flex;gap:12px;font-size:12px;align-items:baseline;flex-wrap:wrap}.pcm-stars{font-weight:600}.pcm-today-up{color:#22c55e}.pcm-today-down{color:#ef4444}.pcm-meta{display:flex;gap:12px;font-size:11px;opacity:.7;flex-wrap:wrap}.pcm-actions{display:flex;gap:6px}.pcm-scroll{flex:1 1 auto;min-height:120px;overflow-y:auto;display:flex;flex-direction:column;gap:10px;padding-right:2px}.pcm-pager{flex:none;display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:8px 2px 6px;border-top:1px solid rgba(128,128,128,.18)}.pcm-page{min-width:26px;padding:3px 8px;border-radius:6px;font-size:12px;cursor:pointer;border:1px solid transparent;background:transparent;color:inherit}.pcm-page.on{border-color:#4f6ef7;color:#4f6ef7}.pcm-empty{text-align:center;padding:32px 0;opacity:.65}.pcm-modal-body{display:flex;flex-direction:column;gap:10px;font-size:13px}.pcm-risk{border-radius:8px;padding:8px 10px;font-size:12px;line-height:1.5}.pcm-risk-curated{background:rgba(34,197,94,.1);color:#16a34a}.pcm-risk-community{background:rgba(217,119,6,.1);color:#b45309}.pcm-risk-nonplugin{background:rgba(239,68,68,.1);color:#dc2626}.pcm-cmd{font-family:ui-monospace,monospace;font-size:12px;background:rgba(128,128,128,.12);border-radius:6px;padding:6px 8px;word-break:break-all}.pcm-publish-repos{max-height:200px;overflow:auto;display:flex;flex-direction:column;gap:4px;border:1px solid rgba(128,128,128,.25);border-radius:8px;padding:6px}.pcm-publish-repo{font-size:12px;padding:4px 8px;border-radius:6px;cursor:pointer}.pcm-publish-repo:hover{background:rgba(128,128,128,.12)}.pcm-spin{animation:pcm-spin 1s linear infinite;display:inline-flex}@keyframes pcm-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}\\\\\\\\\\\\\\\"\\\\\\\\n\\\\\\\\nexport function injectStyles(): void {\\\\\\\\n  const existing = document.querySelector('style[data-plugin-css=\\\\\\\\\\\\\\\"dsh-store.pcm-icon{border-radius:6px;flex:none;box-shadow:0 0 0 1px rgba(245,247,255,.25)}\\\\\\\"\\\\n\\\\nexport function injectStyles(): void {\\\\n  const existing = document.querySelector('style[data-plugin-css=\\\\\\\"dsh-store\\\"\\n\\nexport function injectStyles(): void {\\n  const stale = document.querySelectorAll('style[data-plugin-css=\\\"dsh-store\"\n\nexport function injectStyles(): void {\n  const stale = document.querySelectorAll('style[data-plugin-css=\"dsh-store";
function injectStyles() {
	const stale = document.querySelectorAll("style[data-plugin-css=\"dsh-store\"]");
	stale.forEach((tag, index) => {
		if (index > 0) tag.remove();
	});
	const existing = stale[0] ?? null;
	if (existing !== null) {
		existing.textContent = CSS;
		return;
	}
	const tag = document.createElement("style");
	tag.dataset.plugin = "dsh-store";
	tag.dataset.pluginCss = "dsh-store";
	tag.textContent = CSS;
	document.head.appendChild(tag);
}
//#endregion
//#region src/client/index.ts
/**
* dsh-store client: registers the "DSH Plugin Market" settings
* section plus the plugin-configuration card (GitHub token, dsh >= rc.7).
* Built by tsdown into lib/client.js; react and the primitives module are
* resolved through the loader module table at runtime.
*/
const NS = "dsh-store";
const REQUIRED_PRIMITIVES = [
	"Menu",
	"Modal",
	"Tooltip",
	"Toast",
	"Pill",
	"Button",
	"Input"
];
function missingPrimitives(mod, required = REQUIRED_PRIMITIVES) {
	return required.filter((name) => mod[name] === void 0);
}
const name = NS;
const inject = ["slots", "locale"];
function apply(ctx) {
	const gaps = missingPrimitives(_deepseek_ai_dsh_client_ui_primitives);
	if (gaps.length > 0) {
		console.warn("[dsh-store] host ui-primitives missing " + gaps.join(", ") + " — market section disabled (dsh web >= 0.1.0-rc.6 required)");
		return;
	}
	ctx.effect(() => ctx.locale.register(NS, {
		zh,
		en
	}), "dsh-store: dictionaries");
	const t = ctx.locale.bind(NS);
	injectStyles();
	ctx.slots.inject("settings.section", () => ctx.slots.register({
		name: "settings.section",
		id: "plugin-market",
		order: 45,
		label: () => t("nav"),
		locale: NS,
		inject: () => ({ t })
	}, () => (0, react.createElement)(MarketSection, {
		t,
		locale: ctx.locale
	})));
	ctx.inject(["settingsScope"], (scoped) => {
		scoped.slots.inject("settings.plugin.item", () => scoped.slots.register({
			name: "settings.plugin.item",
			key: NS,
			locale: NS,
			inject: () => ({ t })
		}, () => (0, react.createElement)(SettingsCard, { t })));
	});
}
//#endregion
exports.REQUIRED_PRIMITIVES = REQUIRED_PRIMITIVES;
exports.apply = apply;
exports.inject = inject;
exports.missingPrimitives = missingPrimitives;
exports.name = name;
		return module.exports;
	}
});
