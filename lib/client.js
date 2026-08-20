window.__ModuleLoader__.load({
	id: "dsh-plugin-market",
	factory: (require) => {
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
			nav: "DSH Plugin Market",
			title: "DSH Plugin Market",
			subtitle: "Every GitHub repo tagged #dsh-plugin — browse, search, install.",
			refresh: "Refresh",
			refreshing: "Refreshing…",
			shardProgress: "Fetched {0} repos ({1}/{2} slices)",
			sourceLive: "live",
			sourceCache: "cached",
			sourceSnapshot: "snapshot {0}",
			updatedAt: "updated {0}",
			all: "All",
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
			since: "Active",
			sinceAll: "Any time",
			sinceDay: "24 hours",
			sinceWeek: "7 days",
			sinceMonth: "30 days",
			sinceYear: "1 year",
			pageSize: "Per page",
			stars: "stars",
			today: "today",
			published: "published",
			updatedShort: "updated",
			install: "Install",
			uninstall: "Uninstall",
			installed: "Installed",
			curatedBadge: "awesome",
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
			nav: "DSH 插件市场",
			title: "DSH 插件市场",
			subtitle: "GitHub 上所有带 #dsh-plugin 标签的项目 — 浏览、搜索、安装。",
			refresh: "刷新",
			refreshing: "刷新中…",
			shardProgress: "已抓取 {0} 个仓库（{1}/{2} 分片）",
			sourceLive: "实时",
			sourceCache: "缓存",
			sourceSnapshot: "快照 {0}",
			updatedAt: "更新于 {0}",
			all: "全部",
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
			since: "最近活跃",
			sinceAll: "不限",
			sinceDay: "24 小时",
			sinceWeek: "7 天",
			sinceMonth: "30 天",
			sinceYear: "1 年",
			pageSize: "每页",
			stars: "star",
			today: "今日",
			published: "发布",
			updatedShort: "更新",
			install: "安装",
			uninstall: "卸载",
			installed: "已安装",
			curatedBadge: "精选",
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
		function visiblePlugins(plugins, options) {
			const needle = options.query.trim().toLowerCase();
			const now = Date.now();
			const list = plugins.filter((p) => {
				if (options.category !== "all" && p.category !== options.category) return false;
				if (options.kind === "plugin" && p.isPlugin !== true) return false;
				if (options.kind === "nonplugin" && p.isPlugin === true) return false;
				if (options.curatedOnly && !p.curated) return false;
				if (options.sinceDays > 0) {
					const pushed = Date.parse(p.pushed);
					if (Number.isNaN(pushed) || now - pushed > options.sinceDays * 864e5) return false;
				}
				if (needle !== "") {
					if (!(p.name + " " + p.owner + " " + p.description).toLowerCase().includes(needle)) return false;
				}
				return true;
			});
			const todayRank = (v) => v === null ? Number.NEGATIVE_INFINITY : v;
			const sorted = [...list];
			if (options.sort === "stars-desc") sorted.sort((a, b) => b.stars - a.stars);
			else if (options.sort === "stars-asc") sorted.sort((a, b) => a.stars - b.stars);
			else if (options.sort === "today-desc") sorted.sort((a, b) => todayRank(b.todayStars) - todayRank(a.todayStars));
			else if (options.sort === "today-asc") sorted.sort((a, b) => todayRank(a.todayStars) - todayRank(b.todayStars));
			return sorted;
		}
		function formatStars(n) {
			if (n >= 1e3) {
				const k = n / 1e3;
				return (k >= 10 ? Math.round(k) : Math.round(k * 10) / 10) + "k";
			}
			return String(n);
		}
		/** Relative time like "3 days ago" / "2 years ago". */
		function relativeFromNow(iso, t) {
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
		/** Category chip order: collapsed with an active non-'all' chip, the active one moves first. */
		function orderedCategories(categories, active, open) {
			return open || active === "all" ? categories : [active, ...categories.filter((id) => id !== active)];
		}
		function avatarColor(name) {
			let hash = 0;
			for (let i = 0; i < name.length; i++) hash = hash * 31 + name.charCodeAt(i) | 0;
			return "hsl(" + (hash % 360 + 360) % 360 + " 55% 52%)";
		}
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
			const [loadError, setLoadError] = (0, react.useState)(false);
			const [status, setStatus] = (0, react.useState)(null);
			const [q, setQ] = (0, react.useState)("");
			const [cat, setCat] = (0, react.useState)("all");
			const [kind, setKind] = (0, react.useState)("all");
			const [curatedOnly, setCuratedOnly] = (0, react.useState)(false);
			const [sort, setSort] = (0, react.useState)("stars-desc");
			const [sinceDays, setSinceDays] = (0, react.useState)(0);
			const [page, setPage] = (0, react.useState)(1);
			const [pageSize, setPageSize] = (0, react.useState)(24);
			const [catsOpen, setCatsOpen] = (0, react.useState)(false);
			const [sortOpen, setSortOpen] = (0, react.useState)(false);
			const [sinceOpen, setSinceOpen] = (0, react.useState)(false);
			const [sizeOpen, setSizeOpen] = (0, react.useState)(false);
			const [confirming, setConfirming] = (0, react.useState)(null);
			const [removing, setRemoving] = (0, react.useState)(null);
			const [publishOpen, setPublishOpen] = (0, react.useState)(false);
			const [toast, setToast] = (0, react.useState)(null);
			const [verifyBusy, setVerifyBusy] = (0, react.useState)(false);
			const refreshing = status?.refreshing === true;
			const installing = status?.install?.active === true;
			const fetchRegistry = (0, react.useCallback)((force) => {
				fetch("/dsh-plugin-market/registry" + (force ? "?force=1" : ""), { cache: "no-store" }).then((res) => {
					if (!res.ok) throw new Error("HTTP " + res.status);
					return res.json();
				}).then((body) => {
					if (body.registry !== void 0) setData(body.registry);
					setLoadError(false);
				}).catch(() => setLoadError(true));
			}, []);
			const fetchStatus = (0, react.useCallback)(() => {
				fetch("/dsh-plugin-market/status", { cache: "no-store" }).then((res) => res.json()).then((body) => setStatus(body)).catch(() => {});
			}, []);
			(0, react.useEffect)(() => {
				fetchRegistry(false);
				fetchStatus();
			}, [fetchRegistry, fetchStatus]);
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
				sinceDays,
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
				fetch("/dsh-plugin-market/verify", {
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
			const catLabel = (0, react.useCallback)((id) => {
				if (data === null) return id;
				const c = data.categories[id];
				return c === void 0 ? id : c[lang] ?? c.en;
			}, [data, lang]);
			const list = (0, react.useMemo)(() => visiblePlugins(plugins, {
				category: cat,
				kind,
				curatedOnly,
				query: q,
				sort,
				sinceDays,
				lang
			}), [
				plugins,
				cat,
				kind,
				curatedOnly,
				q,
				sort,
				sinceDays,
				lang
			]);
			const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
			const currentPage = Math.min(page, totalPages);
			const pageList = list.slice((currentPage - 1) * pageSize, currentPage * pageSize);
			(0, react.useEffect)(() => {
				verifyPage(pageList);
			}, [pageList, verifyPage]);
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
			const doInstall = (0, react.useCallback)((entry) => {
				setConfirming(null);
				fetch("/dsh-plugin-market/install", {
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
				fetch("/dsh-plugin-market/uninstall", {
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
			const sinceItems = (0, react.useMemo)(() => [
				{
					id: "0",
					label: t("sinceAll")
				},
				{
					id: "1",
					label: t("sinceDay")
				},
				{
					id: "7",
					label: t("sinceWeek")
				},
				{
					id: "30",
					label: t("sinceMonth")
				},
				{
					id: "365",
					label: t("sinceYear")
				}
			], [t]);
			const sizeItems = (0, react.useMemo)(() => PAGE_SIZES.map((n) => ({
				id: String(n),
				label: String(n)
			})), []);
			const sourceLabel = (() => {
				if (data === null) return "";
				const updated = relativeFromNow(data.updated, t);
				if (data.source === "live") return t("sourceLive") + " · " + t("updatedAt").replace("{0}", updated);
				if (data.source === "cache") return t("sourceCache") + " · " + t("updatedAt").replace("{0}", updated);
				return t("sourceSnapshot").replace("{0}", updated);
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
			const chipCats = orderedCategories(categories, cat, catsOpen);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "pcm-root",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pcm-header",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									flexDirection: "column",
									gap: 2,
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
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
											className: "pcm-title",
											children: t("title")
										}),
										data !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "pcm-source",
											children: sourceLabel
										}),
										status?.tokenConfigured === true && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "pcm-source",
											children: t("tokenConfigured")
										})
									]
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "pcm-progress",
									children: t("subtitle")
								})]
							}),
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
								children: refreshing ? t("refreshing") : t("refresh")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "outline",
								size: "sm",
								icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSendOutline16, { size: 14 }),
								onClick: () => setPublishOpen(true),
								children: t("publish")
							})
						]
					}),
					progressLabel !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pcm-progress",
						children: progressLabel
					}),
					rateNote !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pcm-rate",
						children: rateNote
					}),
					loadError && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pcm-rate",
						children: t("loadError")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: catsOpen ? "pcm-chips open" : "pcm-chips",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Pill, {
							active: cat === "all",
							onClick: () => {
								setCat("all");
								setPage(1);
							},
							children: t("all")
						}), chipCats.map((id) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Pill, {
							active: cat === id,
							onClick: () => {
								setCat(id);
								setPage(1);
							},
							children: catLabel(id)
						}, id))]
					}),
					categories.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pcm-chip-more",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => setCatsOpen((o) => !o),
							children: [
								catsOpen ? "−" : "+",
								" ",
								categories.length + 1
							]
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
								align: "start",
								anchor: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "outline",
									size: "sm",
									onClick: () => setSortOpen((o) => !o),
									children: t("sort")
								}),
								items: sortItems,
								selectedId: sort
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Menu, {
								open: sinceOpen,
								onClose: () => setSinceOpen(false),
								onSelect: (id) => {
									setSinceDays(Number(id));
									setPage(1);
								},
								align: "start",
								anchor: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "outline",
									size: "sm",
									onClick: () => setSinceOpen((o) => !o),
									children: t("since")
								}),
								items: sinceItems,
								selectedId: String(sinceDays)
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Menu, {
								open: sizeOpen,
								onClose: () => setSizeOpen(false),
								onSelect: (id) => {
									setPageSize(Number(id));
									setPage(1);
								},
								align: "start",
								anchor: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "outline",
									size: "sm",
									onClick: () => setSizeOpen((o) => !o),
									children: pageSize
								}),
								items: sizeItems,
								selectedId: String(pageSize)
							})
						]
					}),
					list.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pcm-empty",
						children: data === null ? t("loading") : t("empty")
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
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
											entry.curated && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "pcm-badge pcm-badge-curated",
												children: t("curatedBadge")
											}),
											entry.isPlugin === false && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "pcm-badge pcm-badge-nonplugin",
												children: t("nonpluginBadge")
											}),
											entry.isPlugin === null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "pcm-badge pcm-badge-pending",
												children: t("pendingBadge")
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
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: today === null ? t("today") + ": —" : (today >= 0 ? "+" : "") + today + " " + t("today") }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("published") + " " + durationBetween(entry.created, (/* @__PURE__ */ new Date()).toISOString()) })
										]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "pcm-meta",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: catLabel(entry.category) }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("updatedShort") + " " + relativeFromNow(entry.pushed, t) }),
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
					}), totalPages > 1 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pcm-pager",
						children: pageItems(currentPage, totalPages).map((item, i) => item === "…" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							style: { opacity: .5 },
							children: "…"
						}, "e" + i) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							className: "pcm-page" + (item === currentPage ? " on" : ""),
							onClick: () => setPage(item),
							children: item
						}, item))
					})] }),
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
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { children: t("installFrom") + " " + entry.url }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: riskClass,
							children: riskText
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "pcm-cmd",
							children: t("installVia") + " " + target
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
				fetch("/dsh-plugin-market/publish/repos", { cache: "no-store" }).then((res) => res.json()).then((body) => setMyRepos(body.repos ?? [])).catch(() => {});
			};
			(0, react.useEffect)(loadMyRepos, []);
			const checkTopic = (target) => {
				setBusy(true);
				setResult(null);
				setError(null);
				fetch("/dsh-plugin-market/publish", {
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
				fetch("/dsh-plugin-market/publish", {
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
		/** Inline stylesheet: injected once with a data-plugin tag so the loader can clean up on unload. */
		const CSS = ".pcm-root{display:flex;flex-direction:column;gap:12px;padding:4px 0 16px}.pcm-header{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.pcm-title{font-size:15px;font-weight:600;margin:0;flex:1 1 auto}.pcm-source{font-size:11px;padding:1px 7px;border-radius:999px;border:1px solid currentColor;opacity:.75;white-space:nowrap}.pcm-progress{font-size:12px;opacity:.75}.pcm-rate{font-size:12px;color:#d97706}.pcm-chips{display:flex;flex-wrap:wrap;gap:6px;max-height:64px;overflow:hidden}.pcm-chips.open{max-height:none}.pcm-chip-more{align-self:flex-start}.pcm-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.pcm-search{flex:1 1 220px;min-width:180px}.pcm-seg{display:inline-flex;border-radius:8px;overflow:hidden;border:1px solid rgba(128,128,128,.3)}.pcm-seg button{border:none;background:transparent;padding:4px 10px;font-size:12px;cursor:pointer;color:inherit}.pcm-seg button.on{background:#4f6ef7;color:#fff}.pcm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:10px}.pcm-card{border:1px solid rgba(128,128,128,.25);border-radius:10px;padding:10px 12px;display:flex;flex-direction:column;gap:8px;cursor:pointer}.pcm-card:hover{border-color:#4f6ef7}.pcm-card-top{display:flex;align-items:center;gap:8px}.pcm-av{width:26px;height:26px;border-radius:6px;flex:none;display:flex;align-items:center;justify-content:center;font-size:12px;color:#fff;font-weight:600}.pcm-name{font-weight:600;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pcm-owner{font-size:11px;opacity:.65}.pcm-desc{font-size:12px;opacity:.85;line-height:1.45;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:2.9em}.pcm-badges{display:flex;gap:4px;flex-wrap:wrap}.pcm-badge{font-size:10.5px;padding:0 6px;border-radius:999px;line-height:18px;white-space:nowrap}.pcm-badge-curated{background:rgba(34,197,94,.14);color:#22c55e}.pcm-badge-nonplugin{background:rgba(148,163,184,.16);opacity:.8}.pcm-badge-pending{background:rgba(217,119,6,.14);color:#d97706}.pcm-badge-installed{background:rgba(79,110,247,.16);color:#4f6ef7}.pcm-stats{display:flex;gap:12px;font-size:12px;align-items:baseline;flex-wrap:wrap}.pcm-stars{font-weight:600}.pcm-today-up{color:#22c55e}.pcm-today-down{color:#ef4444}.pcm-meta{display:flex;gap:12px;font-size:11px;opacity:.7;flex-wrap:wrap}.pcm-actions{display:flex;gap:6px}.pcm-pager{display:flex;gap:4px;align-items:center;justify-content:center;flex-wrap:wrap}.pcm-page{min-width:26px;padding:3px 8px;border-radius:6px;font-size:12px;cursor:pointer;border:1px solid transparent;background:transparent;color:inherit}.pcm-page.on{border-color:#4f6ef7;color:#4f6ef7}.pcm-empty{text-align:center;padding:32px 0;opacity:.65}.pcm-modal-body{display:flex;flex-direction:column;gap:10px;font-size:13px}.pcm-risk{border-radius:8px;padding:8px 10px;font-size:12px;line-height:1.5}.pcm-risk-curated{background:rgba(34,197,94,.1);color:#16a34a}.pcm-risk-community{background:rgba(217,119,6,.1);color:#b45309}.pcm-risk-nonplugin{background:rgba(239,68,68,.1);color:#dc2626}.pcm-cmd{font-family:ui-monospace,monospace;font-size:12px;background:rgba(128,128,128,.12);border-radius:6px;padding:6px 8px;word-break:break-all}.pcm-publish-repos{max-height:200px;overflow:auto;display:flex;flex-direction:column;gap:4px;border:1px solid rgba(128,128,128,.25);border-radius:8px;padding:6px}.pcm-publish-repo{font-size:12px;padding:4px 8px;border-radius:6px;cursor:pointer}.pcm-publish-repo:hover{background:rgba(128,128,128,.12)}.pcm-spin{animation:pcm-spin 1s linear infinite;display:inline-flex}@keyframes pcm-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}";
		function injectStyles() {
			if (document.querySelector("style[data-plugin-css=\"dsh-plugin-market\"]") !== null) return;
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-plugin-market";
			tag.dataset.pluginCss = "dsh-plugin-market";
			tag.textContent = CSS;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region src/client/index.ts
		/**
		* dsh-plugin-market client: registers the "DSH Plugin Market" settings
		* section plus the plugin-configuration card (GitHub token, dsh >= rc.7).
		* Built by tsdown into lib/client.js; react and the primitives module are
		* resolved through the loader module table at runtime.
		*/
		const NS = "dsh-plugin-market";
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
				console.warn("[dsh-plugin-market] host ui-primitives missing " + gaps.join(", ") + " — market section disabled (dsh web >= 0.1.0-rc.6 required)");
				return;
			}
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "dsh-plugin-market: dictionaries");
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
	}
});
