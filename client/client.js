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
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
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
let react_dom = require("react-dom");
let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
_deepseek_ai_dsh_client_ui_primitives = __toESM(_deepseek_ai_dsh_client_ui_primitives, 1);
let react_jsx_runtime = require("react/jsx-runtime");
//#endregion
//#region src/client/locales.ts
var import_client = (/* @__PURE__ */ __commonJSMin(((exports) => {
	var m = require("react-dom");
	exports.createRoot = m.createRoot;
	exports.hydrateRoot = m.hydrateRoot;
})))();
const en = {
	nav: "DSH Store",
	versionHint: "dsh-store v{0}",
	title: "DSH Store",
	subtitle: "The most complete DeepSeek Harness plugin catalog — smart search, smart install/update/uninstall, built-in Skills tool.",
	refresh: "Refresh",
	autoRefresh: "auto-refresh database every 30 min",
	refreshing: "Refreshing…",
	shardProgress: "Fetched {0} repos ({1}/{2} slices)",
	sourceCdn: "updated",
	sourceLive: "updated",
	sourceCache: "updated",
	sourceSnapshot: "snapshot · {0}",
	updatedAt: "{0} ago",
	syncedAt: "synced {0}",
	all: "All",
	expandCats: "Expand {0} categories",
	collapseCats: "Collapse",
	searchPlaceholder: "Search name / owner / description…",
	searchClear: "Clear search",
	sort: "Sort",
	sortDim: "Dimension",
	sortDir: "Direction",
	sortStars: "Stars",
	sortToday: "Today's +stars",
	sortDownloads: "Downloads (30d)",
	downloadsHint: "npm downloads in the last 30 days",
	totalDownloadsHint: "Total npm downloads since 2019",
	downloads30Label: "30d downloads",
	totalDownloadsLabel: "total downloads",
	sortCreated: "Publish date",
	sortAsc: "Ascending ↑",
	sortDesc: "Descending ↓",
	favOnly: "Favorites",
	blacklistChip: "Blacklist",
	blacklistHint: "Show excluded entries with their public reasons",
	excludedBadge: "Excluded",
	marketDirBadge: "Market dir",
	excludedHint: "Excluded: {0}",
	recent30: "New (30d)",
	recent30Hint: "Repos added or first indexed in the last 30 days",
	scannedChip: "Scanned",
	scannedHint: "Machine-verified installable (dsh.bundle found in the repo tree)",
	scannedBadge: "Scanned ✓",
	scannedBadgeHint: "Machine scan passed: dsh.bundle found in the repo tree.",
	scanFailBadge: "Scan failed",
	scanFailHint: "Machine scan found no dsh.bundle in the repo tree — may not be installable as a plugin.",
	dormantBadge: "Stale",
	dormantHint: "No pushes for 6+ months — possibly abandoned.",
	npmUnlinkedHint: "The npm package does not link back to this repository — install may resolve to a different package.",
	favAdd: "Favorite",
	langToggle: "Language",
	kind: "Kind",
	kindAll: "All repos",
	kindPlugin: "Plugins only",
	kindNonplugin: "Non-plugins",
	curatedOnly: "Awesome Curated",
	installedOnly: "Installed",
	localBadge: "local",
	localOwner: "local install",
	catInstalled: "Installed (local)",
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
	curatedBadge: "Awesome Curated",
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
	smartInstall: "Smart install",
	smartInstallHint: "AI reviews the repo, installs it, then diagnoses the result.",
	updateTitle: "Update {0}?",
	updateFrom: "Source: {0}",
	updateVia: "Update target: {0}",
	updateRange: "Version: {0} → {1}",
	smartUpdate: "Smart update",
	smartUpdateHint: "AI reviews the repo, updates the plugin, then diagnoses the result.",
	smartRefused: "AI review refused this install",
	installFailed: "Install failed",
	uninstallTitle: "Uninstall {0}?",
	localUninstallTitle: "Uninstall local package {0}?",
	localUninstallDesc: "This package is not in the market index — it may be a DSH host or environment component.",
	localUninstallWarn: "Removing host components can break DSH features and cannot be restored from the market.",
	localUninstallCheck: "I understand the risk and want to uninstall it.",
	uninstallDesc: "Removes the package and its bundle row from this profile.",
	uninstalling: "Uninstalling {0}…",
	uninstallDone: "Uninstalled.",
	empty: "No matching repos.",
	loading: "Loading catalog…",
	loadError: "Could not load the catalog. Showing the bundled snapshot.",
	tokenConfigured: "GitHub token active",
	publish: "Publish my plugin",
	publishHint: "Tag your GitHub repo with the dsh-plugin topic and the store indexes it — no code is uploaded.",
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
	hoursMinsAgo: "{0}h {1}m ago",
	daysAgo: "{0} d ago",
	monthsAgo: "{0} mo ago",
	yearsAgo: "{0} y ago",
	tokenField: "GitHub token (optional)",
	tokenHint: "Boosts GitHub API limits (search 10→30/min, core 60→5000/h) and enables the plugin-verification batch. Memory only — never written to disk or logs, cleared on restart.",
	tokenPlaceholder: "ghp_… (repo scope is enough)",
	sourcePlaceholder: "Registry source URL (optional, e.g. https://…/registry.json)",
	sourceSave: "Save source",
	sourceSaved: "Saved",
	sourceCurrent: "Current source",
	sourceHint: "Custom market data source in registry.json format. Leave empty to use the default index (hoyyang/dsh-market-index). Persists via the DSH_STORE_REGISTRY_URL environment variable.",
	tokenSave: "Save",
	tokenSaved: "Token saved for this session.",
	tokenMissingSettings: "Set the token in Settings → Plugins → plugin configuration (dsh ≥ rc.7), or via cordis.yml / DSHM_GITHUB_TOKEN.",
	updateAllBtn: "Update plugins ({0})",
	updatingAll: "Updating…",
	updateBtn: "Update",
	updateDone: "Update finished",
	updateFailed: "Update failed",
	updateHint: "A newer version is available",
	sourceBtn: "Source",
	verifiedBadge: "Verified",
	verifiedHintTitle: "Verified install: {0}",
	disclosureBadge: "Disclosed",
	manualInstall: "Manual install",
	detailVersion: "Versions",
	detailRepoVer: "Repo package.json",
	repoVersionHint: "GitHub Releases latest",
	detailNpmVer: "npm latest",
	detailInstalledVer: "Installed",
	detailMeta: "Metadata",
	detailStars: "Stars",
	detailCreated: "Published",
	detailLanguage: "Language",
	detailLicense: "License",
	detailTopics: "Topics",
	detailInstall: "Install",
	detailRelated: "Related plugins",
	detailAdded: "Added {0}",
	channelNpm: "npm: prebuilt package — dsh plugin add <pkg>",
	channelTarball: "tarball: GitHub Release prebuilt tgz (if published)",
	channelSource: "source: dsh plugin add github:owner/repo",
	detailCopy: "Copy command",
	readmeLoading: "Loading README…",
	readmeFailed: "README unavailable.",
	verifiedReport: "Verification report",
	discCloud: "Cloud",
	discCloudNone: "No cloud services",
	discNetwork: "Network",
	discNetNone: "No network access",
	discOffline: "Offline capable",
	discApiKeys: "API keys",
	discJurisdiction: "Jurisdiction",
	discRetention: "Data retention",
	stateLive: "· Active",
	stateDisabled: "· Disabled",
	stateRestart: "· Restart to apply",
	resultsTitle: "DSH Store results",
	resultsRecommended: "Recommended",
	resultsRelated: "Other related",
	resultsExpired: "Results expired — run /dsh-store again.",
	verifiedOnly: "Verified",
	curatedBadgeTitle: "Listed in awesome-dsh-plugin",
	verifiedBadgeHint: "Verified install (qing3a/dsh-plugin-verify)",
	descLoading: "…",
	toggleHint: "Enable / disable this plugin",
	toggleDone: "Toggled. Changes apply via the profile watcher.",
	toggleFailed: "Toggle failed",
	rollbackBtn: "Rollback to previous",
	rollbackDone: "Rolled back.",
	rollbackFailed: "Rollback failed",
	skipUpdate: "Skip in Update All",
	skipHint: "Excluded from \"Update plugins\" and auto-update only — the card update button still works.",
	selfUpdateBtn: "Update \"DSH Store\" {0} → {1}",
	selfUpdateDone: "DSH Store updated.",
	selfUpdateFailed: "DSH Store update failed",
	restartNeeded: "Restart dsh to apply.",
	tasksBtn: "Running tasks",
	tasksPanelTitle: "Running tasks",
	tasksEmpty: "No running tasks.",
	tasksEmptyHint: "Install, update and uninstall progress will show up here.",
	tasksClear: "Clear finished",
	tasksDismiss: "Dismiss",
	taskKindInstall: "Install",
	taskKindUpdate: "Update",
	taskKindUninstall: "Uninstall",
	taskKindRollback: "Rollback",
	cancelBtn: "Cancel",
	taskCancelled: "Cancelled",
	taskKindSmartInstall: "Smart install",
	taskKindSmartUninstall: "Smart uninstall",
	taskKindSmartUpdate: "Smart update",
	smartUninstall: "Smart uninstall",
	smartUninstallHint: "AI reviews the risks before uninstalling and removes leftovers.",
	smartUninstallReview: "AI review before uninstall",
	smartUninstallRefused: "AI review refuses this uninstall",
	uninstallAnyway: "Uninstall anyway",
	enableSwitch: "Enable plugin",
	taskRunning: "Running…",
	taskDone: "Done",
	taskFailed: "Failed",
	tasksAggregate: "{0}/{1} done",
	updateAllShort: "All plugins ({0})",
	settingsNav: "DSH Store - Settings",
	settingsTitle: "DSH Store Settings",
	openStoreBtn: "Open DSH Store",
	openStoreHint: "Browse, search, install and update plugins in the full catalog.",
	autoUpdateTitle: "Auto-update plugins",
	autoUpdateDesc: "When on, the store refreshes its catalog daily and then automatically runs Update All on every updatable plugin.",
	autoUpdateWarn: "⚠  New plugin versions can be unstable — auto-update carries risk. Enable with care.",
	autoUpdateNever: "Not run yet.",
	autoUpdateLastRun: "Last auto-update: {0} · {1}",
	autoUpdateOn: "On",
	autoUpdateOff: "Off",
	settingsSource: "Data source",
	settingsToken: "GitHub token",
	settingsSelfUpdate: "Store updates",
	smartSearch: "Smart search",
	smartSearchHint: "Your main model understands the need and picks from the store catalog.",
	smartSearching: "Searching…",
	smartSearchEmpty: "Type your need in the search box first."
};
const zh = {
	nav: "DSH 商店",
	versionHint: "dsh-store v{0}",
	title: "DSH 商店",
	subtitle: "全网最强-DeepSeek Harness 插件全量收录，支持智能搜索、智能安装/更新/卸载、自带 Skills 工具。",
	refresh: "刷新",
	autoRefresh: "每 30 分钟刷新一次数据库",
	refreshing: "刷新中…",
	shardProgress: "已抓取 {0} 个仓库（{1}/{2} 分片）",
	sourceCdn: "更新于",
	sourceLive: "更新于",
	sourceCache: "更新于",
	sourceSnapshot: "快照 · {0}",
	updatedAt: "{0}",
	syncedAt: "同步于 {0}",
	all: "全部",
	expandCats: "展开 {0} 个类别",
	collapseCats: "收起",
	searchPlaceholder: "搜索 项目名 / 作者 / 简介…",
	searchClear: "清空搜索",
	sort: "排序",
	sortDim: "排序维度",
	sortDir: "方向",
	sortStars: "Star 总数",
	sortToday: "今日 Star 增长",
	sortDownloads: "近 30 天下载量",
	downloadsHint: "近 30 天 npm 下载量",
	totalDownloadsHint: "npm 总下载量（2019 年至今累计）",
	downloads30Label: "近 30 天下载",
	totalDownloadsLabel: "总下载",
	sortCreated: "发布时间",
	sortAsc: "升序 ↑",
	sortDesc: "降序 ↓",
	favOnly: "已收藏",
	blacklistChip: "黑名单",
	blacklistHint: "显示被剔除条目（附公开理由）",
	excludedBadge: "已剔除",
	marketDirBadge: "市场目录",
	excludedHint: "剔除理由：{0}",
	recent30: "近30天",
	recent30Hint: "近 30 天收录/新入索引的仓库",
	scannedChip: "已扫描",
	scannedHint: "机器校验可安装（仓库树里找到 dsh.bundle）",
	scannedBadge: "已扫描 ✓",
	scannedBadgeHint: "机器扫描通过：仓库树里存在 dsh.bundle。",
	scanFailBadge: "未通过扫描",
	scanFailHint: "机器扫描未在仓库树里找到 dsh.bundle——可能无法作为插件安装。",
	dormantBadge: "疑似废弃",
	dormantHint: "6 个月以上没有 push，可能已废弃。",
	npmUnlinkedHint: "npm 包未回指本仓库——安装可能装到别的包。",
	favAdd: "收藏",
	langToggle: "语言",
	kind: "类型",
	kindAll: "全部项目",
	kindPlugin: "仅插件",
	kindNonplugin: "非插件",
	curatedOnly: "awesome官方精选",
	installedOnly: "已安装",
	localBadge: "本地",
	localOwner: "本地安装",
	catInstalled: "本地已装",
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
	curatedBadge: "awesome官方精选",
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
	smartInstall: "智能安装",
	smartInstallHint: "AI 先审查仓库，再安装，装后做检查诊断。",
	updateTitle: "更新 {0}？",
	updateFrom: "来源：{0}",
	updateVia: "更新目标：{0}",
	updateRange: "版本：{0} → {1}",
	smartUpdate: "智能更新",
	smartUpdateHint: "AI 先审查仓库，再更新插件，更新后做检查诊断。",
	smartRefused: "AI 审查判定拒绝安装",
	installFailed: "安装失败",
	uninstallTitle: "卸载 {0}？",
	localUninstallTitle: "卸载本地组件 {0}？",
	localUninstallDesc: "该包不在市场索引中，可能是 DSH 宿主或环境组件。",
	localUninstallWarn: "卸载宿主组件可能导致 DSH 功能异常，且无法从市场一键恢复。",
	localUninstallCheck: "我已了解风险，确认卸载",
	uninstallDesc: "将从该 profile 移除依赖与 bundle 条目。",
	uninstalling: "正在卸载 {0}…",
	uninstallDone: "已卸载。",
	empty: "没有匹配的项目。",
	loading: "正在加载目录…",
	loadError: "目录加载失败，已回退内置快照。",
	tokenConfigured: "GitHub token 已启用",
	publish: "上传我的插件",
	publishHint: "给你的 GitHub 仓库打上 dsh-plugin 标签即可上架——市场只收录索引，不会上传任何代码。",
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
	hoursMinsAgo: "{0} 小时 {1} 分前",
	daysAgo: "{0} 天前",
	monthsAgo: "{0} 个月前",
	yearsAgo: "{0} 年前",
	tokenField: "GitHub token（可选）",
	tokenHint: "提升 GitHub API 限额（search 10→30/分钟、core 60→5000/小时）并启用插件判定批处理。仅存内存 — 不落盘、不进日志，重启即清空。",
	tokenPlaceholder: "ghp_…（repo 权限即可）",
	sourcePlaceholder: "数据源 URL（可选，如 https://…/registry.json）",
	sourceSave: "保存数据源",
	sourceSaved: "已保存",
	sourceCurrent: "当前数据源",
	sourceHint: "自定义市场数据源（registry.json 格式）。留空使用默认索引（hoyyang/dsh-market-index）。重启后保留请用 DSH_STORE_REGISTRY_URL 环境变量。",
	tokenSave: "保存",
	tokenSaved: "Token 已保存（仅本次会话）。",
	tokenMissingSettings: "在 设置 → 插件 → 插件配置 里填写 token（dsh ≥ rc.7），或通过 cordis.yml / DSHM_GITHUB_TOKEN 环境变量配置。",
	updateAllBtn: "一键更新插件({0})",
	updatingAll: "更新中…",
	updateBtn: "更新",
	updateDone: "更新完成",
	updateFailed: "更新失败",
	updateHint: "有可用新版本",
	sourceBtn: "源码",
	verifiedBadge: "已验证",
	verifiedHintTitle: "实测可装：{0}",
	disclosureBadge: "已披露",
	manualInstall: "手动安装",
	detailVersion: "版本",
	detailRepoVer: "仓库 package.json",
	repoVersionHint: "GitHub Releases 最新版",
	detailNpmVer: "npm 最新版",
	detailInstalledVer: "已安装",
	detailMeta: "元数据",
	detailStars: "Star",
	detailCreated: "发布时间",
	detailLanguage: "语言",
	detailLicense: "许可证",
	detailTopics: "主题标签",
	detailInstall: "安装",
	detailRelated: "同类相关",
	detailAdded: "收录于 {0}",
	channelNpm: "npm：预构建包 — dsh plugin add <包名>",
	channelTarball: "tarball：GitHub Release 预构建 tgz（如作者发布）",
	channelSource: "源码：dsh plugin add github:owner/repo",
	detailCopy: "复制命令",
	readmeLoading: "正在加载 README…",
	readmeFailed: "README 加载失败。",
	verifiedReport: "验证报告",
	discCloud: "云服务",
	discCloudNone: "无云服务",
	discNetwork: "网络",
	discNetNone: "无网络请求",
	discOffline: "可离线运行",
	discApiKeys: "API Key",
	discJurisdiction: "法域",
	discRetention: "数据留存",
	stateLive: "· 启用中",
	stateDisabled: "· 未启用",
	stateRestart: "· 重启后生效",
	resultsTitle: "DSH 商店查询结果",
	resultsRecommended: "推荐的",
	resultsRelated: "其他相关的",
	resultsExpired: "结果已过期——请重新执行 /dsh-store。",
	verifiedOnly: "已验证",
	curatedBadgeTitle: "awesome-dsh-plugin 精选收录",
	verifiedBadgeHint: "实测可装（qing3a/dsh-plugin-verify 验证）",
	descLoading: "…",
	toggleHint: "启用 / 停用该插件",
	toggleDone: "已切换，profile 监听器会自动应用。",
	toggleFailed: "切换失败",
	rollbackBtn: "回退到上一版本",
	rollbackDone: "已回退。",
	rollbackFailed: "回退失败",
	skipUpdate: "不参与一键更新",
	skipHint: "只排除在一键更新/自动更新之外——卡片自己的「更新」按钮仍然可用。",
	selfUpdateBtn: "更新「DSH 商店」 {0} → {1}",
	selfUpdateDone: "DSH 商店已更新。",
	selfUpdateFailed: "DSH 商店更新失败",
	restartNeeded: "需重启 dsh 生效。",
	tasksBtn: "查看进行中任务",
	tasksPanelTitle: "进行中的任务",
	tasksEmpty: "暂无进行中的任务",
	tasksEmptyHint: "安装、更新与卸载的进度将显示在这里",
	tasksClear: "清空已完成",
	tasksDismiss: "移除",
	taskKindInstall: "安装",
	taskKindUpdate: "更新",
	taskKindUninstall: "卸载",
	taskKindRollback: "回退",
	cancelBtn: "取消",
	taskCancelled: "已取消",
	taskKindSmartInstall: "智能安装",
	taskKindSmartUninstall: "智能卸载",
	taskKindSmartUpdate: "智能更新",
	smartUninstall: "智能卸载",
	smartUninstallHint: "卸载前先由 AI 审查风险，卸载后自动检查残留。",
	smartUninstallReview: "卸载前 AI 审查",
	smartUninstallRefused: "AI 审查判定禁止卸载",
	uninstallAnyway: "仍然卸载",
	enableSwitch: "启用插件",
	taskRunning: "进行中…",
	taskDone: "已完成",
	taskFailed: "失败",
	tasksAggregate: "已完成 {0}/{1}",
	updateAllShort: "全部插件（{0}个）",
	settingsNav: "DSH商店-设置",
	settingsTitle: "DSH商店设置",
	openStoreBtn: "打开 DSH商店",
	openStoreHint: "浏览、搜索、安装与更新插件全量目录",
	autoUpdateTitle: "自动一键更新插件",
	autoUpdateDesc: "开启后，每天商店自动刷新到最新插件数据时，会自动一键更新全部可更新的插件。",
	autoUpdateWarn: "⚠ 很多插件的新版本可能不稳定，自动更新有风险，请谨慎开启。",
	autoUpdateNever: "还没有自动更新过",
	autoUpdateLastRun: "上次自动更新：{0} · {1}",
	autoUpdateOn: "已开启",
	autoUpdateOff: "已关闭",
	settingsSource: "数据源",
	settingsToken: "GitHub Token",
	settingsSelfUpdate: "商店自身更新",
	smartSearch: "智能搜索",
	smartSearchHint: "用你的主模型理解需求，从商店目录里挑出推荐插件。",
	smartSearching: "搜索中…",
	smartSearchEmpty: "请先在搜索框里输入你的需求。"
};
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
	const [registryUrl, setRegistryUrl] = (0, react.useState)("");
	const [sourceSaving, setSourceSaving] = (0, react.useState)(false);
	const [sourceSaved, setSourceSaved] = (0, react.useState)(false);
	(0, react.useEffect)(() => {
		if (!open) return;
		fetch("/dsh-store/status", { cache: "no-store" }).then((res) => res.json()).then((body) => {
			setStatus({
				tokenConfigured: body.tokenConfigured === true,
				version: body.version ?? null,
				registryUrl: body.registryUrl ?? ""
			});
		}).catch(() => {});
	}, [open, saved]);
	const saveSource = () => {
		setSourceSaving(true);
		setSourceSaved(false);
		fetch("/dsh-store/source", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ url: registryUrl.trim() })
		}).then((res) => res.json()).then((body) => {
			if (body.ok === true) {
				setStatus((s) => s === null ? null : {
					...s,
					registryUrl: body.registryUrl ?? ""
				});
				setSourceSaved(true);
			}
		}).catch(() => {}).finally(() => setSourceSaving(false));
	};
	const save = () => {
		if (token.trim() === "") return;
		setSaving(true);
		setSaved(false);
		fetch("/dsh-store/token", {
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
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { style: {
					borderTop: "1px solid rgba(128,128,128,.2)",
					margin: "2px 0"
				} }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
					autoComplete: "off",
					value: registryUrl,
					placeholder: t("sourcePlaceholder"),
					onChange: (e) => setRegistryUrl(e.target.value)
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
						disabled: sourceSaving,
						onClick: saveSource,
						children: t("sourceSave")
					}), sourceSaved && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						style: {
							fontSize: 12,
							color: "#22c55e"
						},
						children: t("sourceSaved")
					})]
				}),
				status !== null && status.registryUrl !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					style: {
						fontSize: 12,
						opacity: .75,
						wordBreak: "break-all"
					},
					children: t("sourceCurrent") + ": " + status.registryUrl
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					style: {
						fontSize: 12,
						opacity: .75,
						lineHeight: 1.5
					},
					children: t("sourceHint")
				})
			]
		})
	});
}
//#endregion
//#region src/client/market-data.ts
function visiblePlugins(plugins, options, isInstalled, isFav) {
	const needle = options.query.trim().toLowerCase();
	const now = Date.now();
	const list = plugins.filter((p) => {
		if (options.category !== "all" && p.category !== options.category) return false;
		if (options.kind === "plugin" && p.isPlugin !== true) return false;
		if (options.kind === "nonplugin" && p.isPlugin === true) return false;
		if (options.curatedOnly && !p.curated) return false;
		if (options.verifiedOnly && p.verified == null) return false;
		if (options.installedOnly && !(isInstalled?.(p) ?? false)) return false;
		if (options.favOnly && !(isFav?.(p) ?? false)) return false;
		if (options.excludedOnly && p.excluded == null) return false;
		if (!options.excludedOnly && p.excluded != null) return false;
		if (options.scannedOnly && p.bundled !== true) return false;
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
	const createdRank = (v) => v === null ? Number.NEGATIVE_INFINITY : Date.parse(v);
	const sorted = [...list];
	if (options.sort === "stars-desc") sorted.sort((a, b) => starRank(b.stars) - starRank(a.stars));
	else if (options.sort === "stars-asc") sorted.sort((a, b) => starRank(a.stars) - starRank(b.stars));
	else if (options.sort === "today-desc") sorted.sort((a, b) => todayRank(b.todayStars) - todayRank(a.todayStars));
	else if (options.sort === "today-asc") sorted.sort((a, b) => todayRank(a.todayStars) - todayRank(b.todayStars));
	else if (options.sort === "created-desc") sorted.sort((a, b) => createdRank(b.created) - createdRank(a.created));
	else if (options.sort === "created-asc") sorted.sort((a, b) => createdRank(a.created) - createdRank(b.created));
	else if (options.sort === "downloads-desc" || options.sort === "downloads-asc") {
		const dl = (v) => typeof v === "number" ? v : Number.NEGATIVE_INFINITY;
		const dir = options.sort === "downloads-desc" ? 1 : -1;
		sorted.sort((a, b) => {
			const da = dl(a.downloads);
			const db = dl(b.downloads);
			if (da !== db) return (db - da) * dir;
			return ((b.stars ?? -1) - (a.stars ?? -1)) * dir;
		});
	}
	return sorted;
}
function formatDownloads(n) {
	if (n >= 1e6) return Math.round(n / 1e5) / 10 + "M";
	if (n >= 1e3) return Math.round(n / 100) / 10 + "k";
	return String(n);
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
	if (hours < 24) return t("hoursMinsAgo").replace("{0}", String(hours)).replace("{1}", String(minutes % 60));
	const days = Math.floor(hours / 24);
	if (days < 30) return t("daysAgo").replace("{0}", String(days));
	const months = Math.floor(days / 30);
	if (months < 12) return t("monthsAgo").replace("{0}", String(months));
	const years = Math.floor(months / 12);
	return t("yearsAgo").replace("{0}", String(years));
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
//#region src/client/DetailPanel.tsx
/**
* Plugin detail panel: README (rendered by the official sandboxed MarkdownText
* — raw HTML disabled, protocol allowlist) plus an info sidebar with versions,
* metadata, topics, safety badges and actions. README fetches go straight to
* raw.githubusercontent.com (CORS-enabled) and are cached per repo+lang.
*/
const readmeCache = /* @__PURE__ */ new Map();
/** 探测仓库实际提供的 README 语言（Range 请求只要 64 字节，零 API 额度）。 */
const LANG_PROBE = [
	"en",
	"zh",
	"ja",
	"ko",
	"es",
	"fr",
	"de",
	"pt",
	"ru"
];
const langProbeCache = /* @__PURE__ */ new Map();
/** 某语言 README 的候选文件名（与 host 富化同表：zh 优先 zh-CN 变体；
*  常见子目录约定 docs/ 一并探测）。 */
function readmeCandidates(lang) {
	const base = [];
	if (lang === "en") base.push("README.md");
	else if (lang === "zh") base.push("README.zh-CN.md", "README.zh.md", "README.zh_CN.md", "README.cn.md");
	else base.push("README." + lang + ".md");
	const out = [];
	for (const f of base) {
		out.push(f);
		out.push("docs/" + f);
	}
	return out;
}
async function probeReadmeLangs(entry) {
	const key = entry.owner + "/" + entry.name;
	const hit = langProbeCache.get(key);
	if (hit !== void 0) return hit;
	const branch = entry.defaultBranch ?? "main";
	const checks = await Promise.all(LANG_PROBE.map(async (lang) => {
		for (const file of readmeCandidates(lang)) try {
			const res = await fetch("https://raw.githubusercontent.com/" + entry.owner + "/" + entry.name + "/" + branch + "/" + file, {
				headers: { range: "bytes=0-63" },
				signal: AbortSignal.timeout(8e3)
			});
			if (res.status === 200 || res.status === 206) return lang;
		} catch {}
		return null;
	}));
	const langs = [];
	for (const l of checks) if (l !== null) langs.push(l);
	langProbeCache.set(key, langs);
	return langs;
}
/** 把 README 里常见的原始 HTML 结构转为等价 Markdown，并把相对路径
*  图片/链接改写为 raw.githubusercontent 绝对地址（MarkdownText 的
*  untrusted 策略只渲染 absolute http(s) 图片——相对路径会整张消失）。 */
function preprocessReadme(md, entry) {
	const branch = entry.defaultBranch ?? "main";
	const base = "https://raw.githubusercontent.com/" + entry.owner + "/" + entry.name + "/" + branch + "/";
	const absolutize = (url) => {
		if (/^(https?:|data:|#)/i.test(url)) return url;
		if (url.startsWith("/")) return base + url.replace(/^\//, "");
		return base + url;
	};
	return md.replace(/^[ \t]{1,6}(?=\S)/gm, "").replace(/<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/gi, (_m, tag, inner) => "#".repeat(Number(tag[1])) + " " + inner.replace(/\s+/g, " ").trim()).replace(/<p\b[^>]*>/gi, "\n\n").replace(/<\/p>/gi, "\n").replace(/<br\s*\/?>/gi, "\n").replace(/<hr\s*\/?>/gi, "\n\n---\n\n").replace(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*\/?>/gi, (_m, src) => "![image](" + absolutize(src) + ")").replace(/<a\b[^>]*>\s*(!\[[^\]]*\]\([^)]*\))\s*<\/a>/gi, (_m, inner) => {
		const url = (inner.match(/\(([^)]*)\)/) ?? ["", ""])[1] ?? "";
		if (/\.svg(?:\?|#|$)|shields\.io|trendshift|badge/i.test(url)) return "";
		return _m;
	}).replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, _alt, url) => {
		if (/\.svg(?:\?|#|$)|shields\.io|trendshift|badge/i.test(url)) return "";
		return _m;
	}).replace(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_m, href, label) => {
		if (!/^https?:/i.test(href)) return label;
		return "[" + label + "](" + absolutize(href) + ")";
	}).replace(/\[\s*\]\([^)]+\)/g, "").replace(/!\[[^\]]*\]\([^)]+\)/g, (_m) => /shields\.io|trendshift|badge|\.svg/i.test(_m) ? "" : _m).replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_m, alt, src) => "![" + alt + "](" + absolutize(src) + ")").replace(/<(?:strong|b)\b[^>]*>([\s\S]*?)<\/(?:strong|b)>/gi, "**$1**").replace(/<(?:em|i)\b[^>]*>([\s\S]*?)<\/(?:em|i)>/gi, "*$1*").replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, "`$1`").replace(/<td\b[^>]*>([\s\S]*?)<\/td>/gi, " $1 |").replace(/<th\b[^>]*>([\s\S]*?)<\/th>/gi, " **$1** |").replace(/<tr\b[^>]*>/gi, "\n|").replace(/<(?:table|thead|tbody)\b[^>]*>/gi, "").replace(/<\/(?:tr|table|thead|tbody)>/gi, "\n").replace(/<picture\b[^>]*>/gi, "").replace(/<\/picture>/gi, "").replace(/<source\b[^>]*>/gi, "").replace(/<details\b[^>]*>/gi, "\n\n").replace(/<\/details>/gi, "\n").replace(/<summary\b[^>]*>([\s\S]*?)<\/summary>/gi, "**$1**").replace(/<kbd\b[^>]*>([\s\S]*?)<\/kbd>/gi, "`$1`").replace(/<a\b(?=[^>]*\bid=["'])[^>]*>([\s\S]*?)<\/a>/gi, "$1").replace(/<\/(?:div|span|center|font|sub|sup|small|del|ins|u|s)>/gi, "").replace(/<(?:div|span|center|font|sub|sup|small|del|ins|u|s)\b[^>]*>/gi, "");
}
async function fetchReadme(entry, lang) {
	const branch = entry.defaultBranch ?? "main";
	const candidates = [...readmeCandidates(lang), "README.md"];
	let lastError = "";
	for (const file of candidates) try {
		const res = await fetch("/dsh-store/readme?repo=" + encodeURIComponent(entry.owner + "/" + entry.name) + "&file=" + encodeURIComponent(file) + "&branch=" + encodeURIComponent(branch));
		if (res.ok) {
			const body = await res.json();
			if (body.ok === true && typeof body.text === "string") return {
				status: "ok",
				text: preprocessReadme(body.text.slice(0, 2e5), entry)
			};
			lastError = body.text ?? "readme unavailable";
		} else lastError = "HTTP " + res.status;
	} catch (err) {
		lastError = err instanceof Error ? err.message : String(err);
	}
	return {
		status: "error",
		text: lastError
	};
}
function useReadme(entry, lang) {
	const [state, setState] = (0, react.useState)(() => {
		return readmeCache.get(entry.owner + "/" + entry.name + "#" + lang) ?? {
			status: "loading",
			text: ""
		};
	});
	(0, react.useEffect)(() => {
		const key = entry.owner + "/" + entry.name + "#" + lang;
		const hit = readmeCache.get(key);
		if (hit !== void 0) {
			setState(hit);
			return;
		}
		let alive = true;
		setState({
			status: "loading",
			text: ""
		});
		fetchReadme(entry, lang).then((result) => {
			readmeCache.set(key, result);
			if (alive) setState(result);
		});
		return () => {
			alive = false;
		};
	}, [entry, lang]);
	return state;
}
/** Disclosure summary lines, e.g. "cloud", "network", "offline only". */
function disclosureSummary(d, t) {
	const out = [];
	if (d.cloud === "none") out.push(t("discCloudNone"));
	else if (d.cloud !== null && d.cloud !== void 0 && d.cloud !== "") out.push(t("discCloud") + ": " + d.cloud);
	if (d.network === "none") out.push(t("discNetNone"));
	else if (d.network !== null && d.network !== void 0 && d.network !== "") out.push(t("discNetwork") + ": " + d.network);
	if (d.offlineMode === true) out.push(t("discOffline"));
	if (Array.isArray(d.apiKeys) && d.apiKeys.length > 0) out.push(t("discApiKeys") + ": " + d.apiKeys.join(", "));
	if (d.jurisdiction !== null && d.jurisdiction !== void 0 && d.jurisdiction !== "") out.push(t("discJurisdiction") + ": " + d.jurisdiction);
	if (d.retention !== null && d.retention !== void 0 && d.retention !== "") out.push(t("discRetention") + ": " + d.retention);
	return out;
}
function DetailPanel(props) {
	const { t, entry, langChoice } = props;
	const [readmeLangs, setReadmeLangs] = (0, react.useState)([]);
	const [readmeLang, setReadmeLang] = (0, react.useState)(langChoice);
	(0, react.useEffect)(() => {
		let alive = true;
		probeReadmeLangs(entry).then((langs) => {
			if (!alive) return;
			setReadmeLangs(langs);
			if (langs.length > 0 && !langs.includes(readmeLang)) setReadmeLang(langs.includes(langChoice) ? langChoice : "en");
		});
		return () => {
			alive = false;
		};
	}, [
		entry,
		langChoice,
		readmeLang
	]);
	const readme = useReadme(entry, readmeLang);
	const desc = readmeLang !== "en" && entry.descriptions?.[readmeLang] ? entry.descriptions[readmeLang] : entry.description;
	const disclosure = entry.disclosure;
	const discLines = (0, react.useMemo)(() => disclosure == null ? [] : disclosureSummary(disclosure, t), [disclosure, t]);
	const [copied, setCopied] = (0, react.useState)(false);
	const LANG_LABELS = {
		en: "English",
		zh: "中文",
		ja: "日本語",
		ko: "한국어",
		es: "Español",
		fr: "Français",
		de: "Deutsch",
		pt: "Português",
		ru: "Русский"
	};
	const copyCmd = () => {
		const cmd = entry.npmLinked === false || entry.npm === null ? "dsh plugin add github:" + entry.owner + "/" + entry.name : "dsh plugin add " + entry.npm;
		navigator.clipboard?.writeText(cmd);
		setCopied(true);
		setTimeout(() => setCopied(false), 2e3);
	};
	const targets = [
		[t("detailStars"), formatStars(entry.stars)],
		[t("todayGain"), entry.todayStars === null ? "—" : (entry.todayStars >= 0 ? "+" : "") + String(entry.todayStars)],
		[t("detailCreated"), entry.created === null ? null : relativeFromNow(entry.created, t)],
		[t("updatedShort"), entry.pushed === null ? null : relativeFromNow(entry.pushed, t)],
		[t("detailLanguage"), entry.language],
		[t("detailLicense"), entry.license]
	].filter(([, v]) => v !== null && v !== "");
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
		open: true,
		onClose: props.onClose,
		title: entry.name,
		closeLabel: t("close"),
		headless: true,
		className: "pcm-detail-modal",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			className: "pcm-detail-scroll",
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "pcm-detail",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "pcm-detail-main",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "pcm-detail-head",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pcm-av",
									style: { background: "#4d6bfe" },
									children: [(entry.name.replace(/^dsh[-_]/i, "").charAt(0) || "P").toUpperCase(), entry.avatar !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
										className: "pcm-av-img",
										src: entry.avatar,
										alt: "",
										loading: "lazy",
										onError: (e) => {
											e.currentTarget.style.display = "none";
										}
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pcm-detail-titles",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "pcm-detail-name",
										children: entry.name
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
										className: "pcm-detail-owner",
										children: [
											entry.owner,
											"/",
											entry.name
										]
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									className: props.isFav ? "pcm-fav-star pcm-fav-on" : "pcm-fav-star",
									title: t("favAdd"),
									onClick: props.onToggleFav,
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
										width: "14",
										height: "14",
										viewBox: "0 0 24 24",
										"aria-hidden": "true",
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
											d: "M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
											fill: props.isFav ? "#f59e0b" : "transparent",
											stroke: "#d99a1f",
											strokeWidth: "1.6",
											strokeLinejoin: "round"
										})
									})
								}),
								readmeLangs.length > 1 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
									className: "pcm-lang-select-wrap",
									title: t("langToggle"),
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "pcm-lang-flag",
										children: "🌐"
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
										className: "pcm-lang-select",
										value: readmeLang,
										onChange: (e) => setReadmeLang(e.target.value),
										children: readmeLangs.map((l) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											value: l,
											children: LANG_LABELS[l] ?? l
										}, l))
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pcm-detail-actions",
									children: [
										props.isInstalled ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [props.update != null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											variant: "primary",
											size: "sm",
											className: "pcm-update-btn",
											disabled: props.updating,
											onClick: props.onUpdate,
											children: props.updating ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "pcm-spin",
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, { size: 14 })
											}) : t("updateBtn")
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											variant: "ghost",
											size: "sm",
											className: "pcm-uninstall-btn",
											onClick: props.onUninstall,
											children: t("uninstall")
										})] }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											variant: "primary",
											size: "sm",
											disabled: props.installing,
											onClick: props.onInstall,
											children: props.installing ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "pcm-spin",
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, { size: 14 })
											}) : t("install")
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											variant: "outline",
											size: "sm",
											className: "pcm-source-btn",
											icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLinkOutline16, { size: 14 }),
											onClick: () => window.open(entry.url, "_blank", "noopener"),
											children: t("sourceBtn")
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											variant: "ghost",
											size: "sm",
											icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutline16, { size: 14 }),
											onClick: props.onClose,
											className: "pcm-detail-close",
											title: t("close")
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "pcm-detail-desc",
							children: desc === "" ? "—" : desc
						}),
						entry.excluded != null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "pcm-risk pcm-risk-nonplugin",
							title: entry.excluded.reason,
							children: props.t("excludedHint").replace("{0}", entry.excluded.reason)
						}),
						entry.bundled !== void 0 && entry.bundled !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: entry.bundled ? "pcm-risk pcm-risk-curated" : "pcm-risk pcm-risk-nonplugin",
							children: entry.bundled ? props.t("scannedBadgeHint") + (entry.bundledAt !== void 0 && entry.bundledAt !== null ? " · " + entry.bundledAt : "") : props.t("scanFailHint")
						}),
						entry.dormant === true && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "pcm-risk pcm-risk-community",
							children: props.t("dormantHint")
						}),
						entry.npmLinked === false && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "pcm-risk pcm-risk-community",
							children: props.t("npmUnlinkedHint")
						}),
						(entry.verified != null || disclosure != null || entry.installable != null) && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "pcm-detail-safety",
							children: [
								entry.verified != null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: "pcm-safety pcm-safety-verified",
									title: t("verifiedHintTitle").replace("{0}", entry.verified.by + (entry.verified.at !== "" ? " · " + entry.verified.at.slice(0, 10) : "")),
									children: ["✓ ", t("verifiedBadge")]
								}),
								disclosure != null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: "pcm-safety pcm-safety-disclosure",
									title: discLines.length > 0 ? discLines.join("\n") : t("disclosureBadge"),
									children: ["🛡 ", t("disclosureBadge")]
								}),
								entry.installable === "manual" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: "pcm-safety pcm-safety-manual",
									children: ["⚙ ", t("manualInstall")]
								}),
								entry.installable === "non-plugin" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: "pcm-safety pcm-safety-nonplugin",
									children: ["⊘ ", t("nonpluginBadge")]
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "pcm-detail-readme",
							children: [
								readme.status === "loading" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pcm-detail-readme-note",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "pcm-spin",
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, { size: 14 })
										}),
										" ",
										t("readmeLoading")
									]
								}),
								readme.status === "error" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pcm-detail-readme-note",
									children: [
										t("readmeFailed"),
										" ",
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("a", {
											className: "pcm-detail-link",
											href: entry.url,
											target: "_blank",
											rel: "noopener noreferrer",
											children: [t("openRepo"), " ↗"]
										})
									]
								}),
								readme.status === "ok" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "pcm-detail-md",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.MarkdownText, { text: readme.text })
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "pcm-detail-side",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "pcm-detail-sec",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "pcm-detail-sec-title",
									children: t("detailVersion")
								}),
								entry.version != null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pcm-detail-verline",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "pcm-detail-verlabel",
										children: t("detailRepoVer")
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "pcm-detail-ver",
										children: entry.version
									})]
								}),
								entry.npmVersion != null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pcm-detail-verline",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "pcm-detail-verlabel",
										children: t("detailNpmVer")
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "pcm-detail-ver pcm-detail-ver-new",
										children: entry.npmVersion
									})]
								}),
								props.installedSpec != null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pcm-detail-verline",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "pcm-detail-verlabel",
										children: t("detailInstalledVer")
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "pcm-detail-ver",
										children: props.installedSpec
									})]
								}),
								props.update != null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pcm-detail-update-note",
									children: [
										props.update.from,
										" ",
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "pcm-update-arrow",
											children: "→"
										}),
										" ",
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "pcm-update-new",
											children: props.update.to
										})
									]
								})
							]
						}),
						targets.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "pcm-detail-sec",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "pcm-detail-sec-title",
								children: t("detailMeta")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "pcm-detail-grid",
								children: targets.map(([k, v]) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pcm-detail-cell",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "pcm-detail-cellk",
										children: k
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "pcm-detail-cellv",
										children: v
									})]
								}, k))
							})]
						}),
						(entry.topics ?? []).length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "pcm-detail-sec",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "pcm-detail-sec-title",
								children: t("detailTopics")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "pcm-detail-topics",
								children: (entry.topics ?? []).map((tp) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "pcm-detail-topic",
									children: tp
								}, tp))
							})]
						}),
						props.related.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "pcm-detail-sec",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "pcm-detail-sec-title",
								children: t("detailRelated")
							}), props.related.map((r) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "pcm-detail-related",
								onClick: () => props.onOpenEntry(r),
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "pcm-name",
										children: r.name
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "pcm-owner",
										children: r.owner
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
										className: "pcm-stars",
										children: ["★ ", formatStars(r.stars)]
									})
								]
							}, r.owner + "/" + r.name))]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "pcm-detail-sec",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "pcm-detail-sec-title",
									children: t("detailInstall")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pcm-detail-cmdrow",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: "pcm-cmd",
										children: entry.npm !== null ? "dsh plugin add " + entry.npm : "dsh plugin add github:" + entry.owner + "/" + entry.name
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
										label: copied ? t("publishCopied") : t("detailCopy"),
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											variant: "ghost",
											size: "sm",
											icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCopyOutline16, { size: 14 }),
											onClick: copyCmd
										})
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pcm-detail-channels",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { children: t("channelNpm") }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { children: t("channelTarball") }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { children: t("channelSource") })
									]
								}),
								entry.created !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "pcm-detail-added",
									children: t("detailAdded").replace("{0}", entry.created.slice(0, 10))
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pcm-detail-linkrow",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("a", {
										className: "pcm-detail-link",
										href: entry.url,
										target: "_blank",
										rel: "noopener noreferrer",
										children: [t("openRepo"), " ↗"]
									}), entry.verified != null && entry.verified.reportUrl != null && entry.verified.reportUrl !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("a", {
										className: "pcm-detail-link",
										href: entry.verified.reportUrl,
										target: "_blank",
										rel: "noopener noreferrer",
										children: [t("verifiedReport"), " ↗"]
									})]
								})
							]
						})
					]
				})]
			})
		})
	});
}
//#endregion
//#region src/client/icon.ts
/** dsh-store brand icon (64px, base64-inlined so the client bundle stays self-contained). */
const ICON_DATA = "data:image/png;base64,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";
//#endregion
//#region src/client/tasks.ts
function enqueueTask(list, record) {
	return [...list, record];
}
function patchTask(list, id, changes) {
	return list.map((record) => record.id === id ? {
		...record,
		...changes
	} : record);
}
function dismissTask(list, id) {
	return list.filter((record) => record.id !== id);
}
function clearSettledTasks(list) {
	return list.filter((record) => record.state === "running");
}
function taskSummary(list) {
	let running = 0;
	let settled = 0;
	for (const record of list) if (record.state === "running") running += 1;
	else settled += 1;
	return {
		running,
		settled,
		total: running + settled
	};
}
//#endregion
//#region src/client/TaskPanel.tsx
/**
* 进行中任务面板（参考 dshmarket OperationsPanel 的交互思路）：
* - 入口按钮「查看进行中任务」在品牌卡「刷新」右侧；
* - 面板锚定在按钮下方（fixed 定位），Esc / 点击外部关闭；
* - 运行中显示聚合进度条（已完成/总数）；失败自动打开面板；
* - 单条记录：动词 + 名称 + 状态行；完成的记录可单条移除或「清空已完成」。
*/
function TaskPanel(props) {
	const { t, records, open } = props;
	const [pos, setPos] = (0, react.useState)(null);
	const popRef = (0, react.useRef)(null);
	(0, react.useLayoutEffect)(() => {
		if (!open || props.anchor === null) return;
		const update = () => {
			const rect = props.anchor.getBoundingClientRect();
			const width = 380;
			const left = Math.max(8, Math.min(rect.right - width, window.innerWidth - width - 8));
			setPos({
				top: rect.bottom + 6,
				left
			});
		};
		update();
		window.addEventListener("resize", update);
		window.addEventListener("scroll", update, true);
		return () => {
			window.removeEventListener("resize", update);
			window.removeEventListener("scroll", update, true);
		};
	}, [open, props.anchor]);
	(0, react.useEffect)(() => {
		if (!open) return;
		const onKey = (e) => {
			if (e.key === "Escape") props.onClose();
		};
		const onPointer = (e) => {
			const pop = popRef.current;
			if (pop !== null && !pop.contains(e.target)) props.onClose();
		};
		document.addEventListener("keydown", onKey);
		document.addEventListener("mousedown", onPointer);
		return () => {
			document.removeEventListener("keydown", onKey);
			document.removeEventListener("mousedown", onPointer);
		};
	}, [open, props]);
	if (!open) return null;
	const summary = taskSummary(records);
	const busy = summary.running > 0;
	const sorted = [...records].sort((a, b) => {
		const ar = a.state === "running" ? 0 : 1;
		const br = b.state === "running" ? 0 : 1;
		if (ar !== br) return ar - br;
		return (b.at ?? 0) - (a.at ?? 0);
	});
	const verb = (record) => record.kind === "install" ? t("taskKindInstall") : record.kind === "update" ? t("taskKindUpdate") : record.kind === "uninstall" ? t("taskKindUninstall") : record.kind === "rollback" ? t("taskKindRollback") : record.kind === "smart-install" ? t("taskKindSmartInstall") : record.kind === "smart-uninstall" ? t("taskKindSmartUninstall") : t("taskKindSmartUpdate");
	return (0, react_dom.createPortal)(/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		ref: popRef,
		className: "pcm-tasks-pop",
		style: pos !== null ? {
			top: pos.top,
			left: pos.left
		} : {
			top: 80,
			left: "50%",
			transform: "translateX(-50%)"
		},
		role: "dialog",
		"aria-label": t("tasksPanelTitle"),
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: "pcm-tasks-head",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "pcm-tasks-head-title",
					children: t("tasksPanelTitle")
				}),
				summary.settled > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
					variant: "ghost",
					size: "sm",
					onClick: props.onClearSettled,
					children: t("tasksClear")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
					variant: "ghost",
					size: "sm",
					icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutline16, { size: 14 }),
					onClick: props.onClose,
					title: t("close")
				})
			]
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: "pcm-tasks-body",
			children: [
				busy && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "pcm-tasks-agg",
					children: t("tasksAggregate").replace("{0}", String(summary.settled)).replace("{1}", String(summary.total))
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "pcm-tasks-bar",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pcm-tasks-bar-fill",
						style: { width: Math.round(summary.settled / Math.max(1, summary.total) * 100) + "%" }
					})
				})] }),
				records.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "pcm-tasks-empty",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { children: t("tasksEmpty") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pcm-tasks-empty-hint",
						children: t("tasksEmptyHint")
					})]
				}),
				sorted.map((record) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "pcm-task-row",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "pcm-task-icon " + (record.state === "done" ? "pcm-task-ok" : record.state === "failed" ? "pcm-task-bad" : ""),
							children: record.state === "running" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "pcm-spin",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, { size: 14 })
							}) : record.state === "done" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCheckOutline16, { size: 14 }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconWarningOutline16, { size: 14 })
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "pcm-task-main",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "pcm-task-top",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "pcm-task-verb",
									children: verb(record)
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "pcm-task-name",
									title: record.name,
									children: record.name
								})]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "pcm-task-status",
								children: record.state === "running" ? record.detail ?? t("taskRunning") : record.state === "done" ? record.detail ?? t("taskDone") : record.reason ?? t("taskFailed")
							})]
						}),
						record.state === "running" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "pcm-task-cancel",
							title: t("cancelBtn"),
							onClick: () => props.onCancelTask(record.id),
							children: t("cancelBtn")
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "pcm-task-x",
							title: t("tasksDismiss"),
							onClick: () => props.onDismiss(record.id),
							children: "✕"
						})
					]
				}, record.id))
			]
		})]
	}), document.body);
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
	const floating = props.floating === true;
	const localeSnap = (0, react.useSyncExternalStore)((cb) => props.locale.subscribe(cb), () => props.locale.getSnapshot());
	const lang = String(localeSnap.active).toLowerCase().startsWith("zh") ? "zh" : "en";
	const seedMode = props.seed != null;
	const [data, setData] = (0, react.useState)((0, react.useMemo)(() => props.seed == null ? null : {
		updated: (/* @__PURE__ */ new Date()).toISOString(),
		count: props.seed.plugins.length,
		source: "cdn",
		categories: props.seed.categories,
		plugins: props.seed.plugins
	}, [props.seed]));
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
	const [verifiedOnly, setVerifiedOnly] = (0, react.useState)(false);
	const [installedOnly, setInstalledOnly] = (0, react.useState)(false);
	const [favOnly, setFavOnly] = (0, react.useState)(false);
	const [showBlacklist, setShowBlacklist] = (0, react.useState)(false);
	const [scannedOnly, setScannedOnly] = (0, react.useState)(false);
	const [recent30, setRecent30] = (0, react.useState)(false);
	const [favorites, setFavorites] = (0, react.useState)(/* @__PURE__ */ new Set());
	const [sortDim, setSortDim] = (0, react.useState)("stars");
	const [sortDir, setSortDir] = (0, react.useState)("desc");
	const sort = sortDim + "-" + sortDir;
	const LANGS = [
		"en",
		"zh",
		"ja",
		"ko",
		"es",
		"fr",
		"de",
		"pt",
		"ru"
	];
	const LANG_LABELS = {
		en: "English",
		zh: "中文",
		ja: "日本語",
		ko: "한국어",
		es: "Español",
		fr: "Français",
		de: "Deutsch",
		pt: "Português",
		ru: "Русский"
	};
	const LANG_SHORT = {
		en: "EN",
		zh: "中文",
		ja: "日本語",
		ko: "한국어",
		es: "ES",
		fr: "FR",
		de: "DE",
		pt: "PT",
		ru: "RU"
	};
	const langItems = (0, react.useMemo)(() => LANGS.map((l) => ({
		id: l,
		label: LANG_LABELS[l] ?? l
	})), []);
	const [langChoice, setLangChoice] = (0, react.useState)(() => {
		if (props.langOverride !== void 0) return props.langOverride;
		try {
			const saved = localStorage.getItem("dsh-store-lang");
			if (saved !== null && LANGS.includes(saved)) return saved;
		} catch {}
		return "en";
	});
	(0, react.useEffect)(() => {
		if (props.langOverride !== void 0 && props.langOverride !== langChoice) setLangChoice(props.langOverride);
	}, [props.langOverride]);
	const setLangPersist = (0, react.useCallback)((l) => {
		setLangChoice(l);
		try {
			localStorage.setItem("dsh-store-lang", l);
		} catch {}
	}, []);
	const [langOpen, setLangOpen] = (0, react.useState)(false);
	const [page, setPage] = (0, react.useState)(1);
	const [pageSize, setPageSize] = (0, react.useState)(24);
	const [sortOpen, setSortOpen] = (0, react.useState)(false);
	const [sizeOpen, setSizeOpen] = (0, react.useState)(false);
	const [confirming, setConfirming] = (0, react.useState)(null);
	const [updatingConfirm, setUpdatingConfirm] = (0, react.useState)(null);
	const [rollbacking, setRollbacking] = (0, react.useState)(null);
	const [removing, setRemoving] = (0, react.useState)(null);
	const [removingLocal, setRemovingLocal] = (0, react.useState)(null);
	const [publishOpen, setPublishOpen] = (0, react.useState)(false);
	const [toast, setToast] = (0, react.useState)(null);
	const [verifyBusy, setVerifyBusy] = (0, react.useState)(false);
	const [detail, setDetail] = (0, react.useState)(null);
	const [updateBusy, setUpdateBusy] = (0, react.useState)(false);
	const [updatingNames, setUpdatingNames] = (0, react.useState)(/* @__PURE__ */ new Set());
	const [selfUpdateBusy, setSelfUpdateBusy] = (0, react.useState)(false);
	const [selfUpdateDone, setSelfUpdateDone] = (0, react.useState)(false);
	const [toggling, setToggling] = (0, react.useState)(/* @__PURE__ */ new Set());
	const scrollRef = (0, react.useRef)(null);
	const [smartSearchBusy, setSmartSearchBusy] = (0, react.useState)(false);
	const doSmartSearch = (0, react.useCallback)(() => {
		if (smartSearchBusy) return;
		const query = q.trim();
		if (query === "") {
			setToast(t("smartSearchEmpty"));
			return;
		}
		setSmartSearchBusy(true);
		fetch("/dsh-store/smart-search", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ query })
		}).then((res) => res.json()).then((body) => {
			if (body.ok === true && body.payload !== void 0) window.dispatchEvent(new CustomEvent("dsh-store-open-results", { detail: { payload: body.payload } }));
			else setToast(t("installFailed") + ": " + (body.error ?? ""));
		}).catch(() => setToast(t("installFailed"))).finally(() => setSmartSearchBusy(false));
	}, [
		smartSearchBusy,
		q,
		t
	]);
	const [tasks, setTasks] = (0, react.useState)([]);
	const [tasksOpen, setTasksOpen] = (0, react.useState)(false);
	const tasksAnchorRef = (0, react.useRef)(null);
	const taskSeq = (0, react.useRef)(0);
	const nextTaskId = () => "task-" + String(++taskSeq.current) + "-" + String(Date.now() % 1e5);
	const tasksSummary = taskSummary(tasks);
	const [headHost, setHeadHost] = (0, react.useState)(null);
	(0, react.useLayoutEffect)(() => {
		if (!floating) return;
		const el = props.headRef?.current ?? rootRef.current?.closest(".pcm-store-window")?.querySelector(".pcm-store-head-actions") ?? null;
		setHeadHost(el);
	}, [
		floating,
		seedMode,
		props.headRef
	]);
	(0, react.useEffect)(() => {
		if (!floating) return;
		const el = document.querySelector(".pcm-store-head-actions");
		setHeadHost(el);
	}, [floating]);
	/** 任务收尾：ok→done（附 host 消息），否则→failed（附原因）并自动打开面板。 */
	const finishTask = (0, react.useCallback)((id, body, doneText) => {
		setTasks((list) => patchTask(list, id, body.ok === true ? {
			state: "done",
			detail: (body.message ?? "") !== "" ? body.message : doneText,
			reason: null
		} : {
			state: "failed",
			reason: body.message ?? body.error ?? t("taskFailed"),
			detail: null
		}));
		if (body.ok !== true) setTasksOpen(true);
	}, [t]);
	const refreshing = status?.refreshing === true;
	const installing = status?.install?.active === true;
	const fetchRegistry = (0, react.useCallback)((force) => {
		if (seedMode) return;
		fetch("/dsh-store/registry" + (force ? "?force=1" : ""), { cache: "no-store" }).then((res) => {
			if (!res.ok) throw new Error("HTTP " + res.status);
			return res.json();
		}).then((body) => {
			if (body.registry !== void 0) setData((prev) => {
				const next = body.registry;
				if (prev === null) return next;
				const byKey = /* @__PURE__ */ new Map();
				for (const e of prev.plugins) byKey.set(e.owner.toLowerCase() + "/" + e.name.toLowerCase(), e);
				return {
					...next,
					plugins: next.plugins.map((e) => {
						const old = byKey.get(e.owner.toLowerCase() + "/" + e.name.toLowerCase());
						if (old === void 0) return e;
						const merged = { ...e };
						if (old.downloads !== void 0) merged.downloads = old.downloads;
						if (old.totalDownloads !== void 0) merged.totalDownloads = old.totalDownloads;
						if (old.repoVersion !== void 0) merged.repoVersion = old.repoVersion;
						return merged;
					})
				};
			});
			if (body.fetchAt !== void 0) setFetchAt(body.fetchAt);
			setLoadError(false);
		}).catch(() => setLoadError(true));
	}, []);
	const fetchStatus = (0, react.useCallback)(() => {
		fetch("/dsh-store/status", { cache: "no-store" }).then((res) => res.json()).then((body) => setStatus(body)).catch(() => {});
	}, []);
	(0, react.useEffect)(() => {
		fetch("/dsh-store/favorites", { cache: "no-store" }).then((res) => res.json()).then((body) => setFavorites(new Set(body.favorites ?? []))).catch(() => {});
	}, []);
	(0, react.useEffect)(() => {
		if (!seedMode) fetchRegistry(true);
		fetchStatus();
		const timer = setInterval(() => {
			if (!seedMode) fetchRegistry(true);
			fetchStatus();
		}, 1800 * 1e3);
		return () => clearInterval(timer);
	}, [
		fetchRegistry,
		fetchStatus,
		seedMode
	]);
	(0, react.useLayoutEffect)(() => {
		const root = rootRef.current;
		if (root === null) return;
		const update = () => {
			let el = root.parentElement;
			while (el !== null && el.getBoundingClientRect().height < 100) el = el.parentElement;
			if (el === null) return;
			const parentH = el.getBoundingClientRect().height;
			const top = root.getBoundingClientRect().top;
			const viewportH = window.innerHeight - top - 16;
			let h = Math.max(240, Math.min(parentH, viewportH));
			root.style.height = Math.round(h) + "px";
			for (let i = 0; i < 4; i++) {
				const overflow = el.scrollHeight - el.clientHeight;
				if (overflow <= 1) break;
				h = Math.max(240, h - overflow - 1);
				root.style.height = Math.round(h) + "px";
			}
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
		const GAP = 6;
		const measure = () => {
			const pills = Array.from(wrap.querySelectorAll("button:not(.pcm-chip-more-btn):not(.pcm-sort-btn)"));
			if (pills.length === 0) return;
			for (const p of pills) {
				p.style.marginRight = "";
				p.style.display = "";
			}
			const wrapW = wrap.clientWidth;
			const sortSlot = wrap.querySelector(".pcm-sort-slot");
			const moreBtn = wrap.querySelector(".pcm-chip-more-btn");
			const sortZone = sortSlot !== null ? sortSlot.offsetWidth + 8 : 0;
			const moreZone = catsClamped && moreBtn !== null ? moreBtn.offsetWidth + 8 : 0;
			let row = 0;
			let rowW = 0;
			for (const pill of pills) {
				const avail = wrapW - (row === 0 ? sortZone : catsClamped && row >= CATS_CLAMPED_ROWS - 1 ? moreZone : 0);
				if (rowW > 0 && rowW + pill.offsetWidth > avail) {
					row += 1;
					rowW = 0;
				}
				if (catsClamped && row > CATS_CLAMPED_ROWS - 1) pill.style.display = "none";
				else pill.style.display = "";
				rowW += pill.offsetWidth + GAP;
			}
			const visiblePills = pills.filter((p) => p.style.display !== "none").length;
			const totalCats = categoriesRef.current.length;
			setHiddenCatCount(Math.max(0, totalCats - (visiblePills - 1)));
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
	}, [
		catsClamped,
		data,
		status,
		q,
		kind,
		curatedOnly,
		installedOnly,
		favOnly,
		favorites
	]);
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
		verifiedOnly,
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
	const catalogPlugins = data?.plugins ?? [];
	const represented = (0, react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		for (const p of catalogPlugins) {
			set.add(p.name.toLowerCase());
			if (p.npm !== null) set.add(p.npm.toLowerCase());
		}
		return set;
	}, [data]);
	const localEntries = (0, react.useMemo)(() => seedMode ? [] : Object.entries(status?.installed ?? {}).filter(([name, spec]) => {
		const s = String(spec).trim();
		if (s.startsWith("link:") || s.startsWith("file:")) return true;
		return !represented.has(name.toLowerCase());
	}).map(([name, spec]) => ({
		name,
		owner: lang === "zh" ? "本地安装" : "local install",
		url: "",
		category: "installed",
		description: String(spec),
		stars: null,
		todayStars: null,
		created: null,
		pushed: null,
		isPlugin: true,
		curated: false,
		npm: name,
		avatar: "",
		language: null,
		local: true,
		npmVersion: null,
		version: null,
		defaultBranch: null,
		license: null,
		verified: null,
		disclosure: null,
		installable: null,
		topics: []
	})), [
		status,
		represented,
		lang
	]);
	const plugins = (0, react.useMemo)(() => data === null ? [] : [...data.plugins, ...localEntries], [data, localEntries]);
	const categories = (0, react.useMemo)(() => {
		const base = data === null ? [] : Object.keys(data.categories);
		if (localEntries.length > 0 && !base.includes("installed")) return [...base, "installed"];
		return base;
	}, [data, localEntries.length]);
	categoriesRef.current = categories;
	const catLabel = (0, react.useCallback)((id) => {
		if (id === "installed") return lang === "zh" ? "本地已装" : "Installed (local)";
		if (data === null) return id;
		const c = data.categories[id];
		return c === void 0 ? id : c[lang] ?? c.en;
	}, [data, lang]);
	/** Which repos are installed in the current profile (from /status).
	*  Exact matching only — name / unscoped name / npm name / github: spec.
	*  (Substring matching used to mark dsh-context-doctor & co. as installed.) */
	const installedInfo = (0, react.useMemo)(() => {
		const names = /* @__PURE__ */ new Set();
		const repos = /* @__PURE__ */ new Set();
		const deps = status?.installed ?? {};
		for (const [name, spec] of Object.entries(deps)) {
			const s = String(spec).trim();
			if (s.startsWith("link:") || s.startsWith("file:")) continue;
			const n = name.toLowerCase();
			names.add(n);
			const m = /^github:([\w.-]+\/[\w.-]+)/i.exec(s);
			if (m !== null) repos.add(m[1].toLowerCase());
		}
		return {
			names,
			repos
		};
	}, [status]);
	/** Name collisions across the catalog:同名/同 npm 仓库不止一个时，
	*  只有精选（人工核实）条目才允许按名字判已安装，其余视为撞名不放行。 */
	const identityCounts = (0, react.useMemo)(() => {
		const names = /* @__PURE__ */ new Map();
		const npms = /* @__PURE__ */ new Map();
		for (const p of plugins) {
			const n = p.name.toLowerCase();
			names.set(n, (names.get(n) ?? 0) + 1);
			if (p.npm !== null) {
				const pn = p.npm.toLowerCase();
				npms.set(pn, (npms.get(pn) ?? 0) + 1);
			}
		}
		return {
			names,
			npms
		};
	}, [plugins]);
	/** 全部已装包名（含本地 link 安装），只用于本地合成卡片的已装判定。 */
	const installedAll = (0, react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		for (const k of Object.keys(status?.installed ?? {})) set.add(k.toLowerCase());
		return set;
	}, [status]);
	const isInstalled = (0, react.useCallback)((e) => {
		if (e.local === true) return installedAll.has(e.name.toLowerCase());
		if (installedInfo.repos.has((e.owner + "/" + e.name).toLowerCase())) return true;
		const nm = e.name.toLowerCase();
		if (installedInfo.names.has(nm) && (identityCounts.names.get(nm) === 1 || e.curated)) return true;
		if (e.npm !== null) {
			const pn = e.npm.toLowerCase();
			if (installedInfo.names.has(pn) && (identityCounts.npms.get(pn) === 1 || e.curated)) return true;
		}
		return false;
	}, [
		installedInfo,
		identityCounts,
		installedAll
	]);
	/** 条目对应的已装依赖 spec（详情面板展示已装版本）。 */
	const installedSpecOf = (0, react.useCallback)((e) => {
		const deps = status?.installed ?? {};
		for (const [n, s] of Object.entries(deps)) {
			if (e.npm !== null && n.toLowerCase() === e.npm.toLowerCase()) return String(s);
			if (n.toLowerCase() === e.name.toLowerCase()) return String(s);
		}
		return null;
	}, [status]);
	const favKey = (e) => (e.local === true ? "local:" + e.name : e.owner + "/" + e.name).toLowerCase();
	const isFav = (0, react.useCallback)((e) => favorites.has(favKey(e)), [favorites]);
	const toggleFav = (0, react.useCallback)((e) => {
		const key = favKey(e);
		const next = new Set(favorites);
		if (next.has(key)) next.delete(key);
		else next.add(key);
		setFavorites(next);
		fetch("/dsh-store/favorites", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ key })
		}).catch(() => {});
	}, [favorites]);
	/** Per-category counts under the CURRENT filter conditions (kind/curatedOnly/installedOnly/search), excluding the category filter itself. */
	const categoryCounts = (0, react.useMemo)(() => {
		const per = /* @__PURE__ */ new Map();
		let all = 0;
		const needle = q.trim().toLowerCase();
		for (const p of plugins) {
			if (!showBlacklist && p.excluded != null) continue;
			if (scannedOnly && p.bundled !== true) continue;
			if (recent30) {
				if (p.created === null) continue;
				const created = Date.parse(p.created);
				if (Number.isNaN(created) || Date.now() - created > 30 * 864e5) continue;
			}
			if (kind === "plugin" && p.isPlugin !== true) continue;
			if (kind === "nonplugin" && p.isPlugin === true) continue;
			if (curatedOnly && !p.curated) continue;
			if (verifiedOnly && p.verified == null) continue;
			if (installedOnly && !isInstalled(p)) continue;
			if (favOnly && !isFav(p)) continue;
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
		verifiedOnly,
		q,
		installedOnly,
		isInstalled,
		favOnly,
		isFav,
		showBlacklist,
		scannedOnly,
		recent30
	]);
	const excludedCount = (0, react.useMemo)(() => plugins.filter((p) => p.excluded != null).length, [plugins]);
	const scannedCount = (0, react.useMemo)(() => plugins.filter((p) => p.bundled === true).length, [plugins]);
	const list = (0, react.useMemo)(() => visiblePlugins(plugins, {
		category: cat,
		kind,
		curatedOnly,
		verifiedOnly,
		installedOnly,
		favOnly,
		query: q,
		sort,
		sinceDays: recent30 ? 30 : 0,
		lang,
		excludedOnly: showBlacklist,
		scannedOnly
	}, isInstalled, isFav), [
		plugins,
		cat,
		kind,
		curatedOnly,
		verifiedOnly,
		installedOnly,
		favOnly,
		q,
		sort,
		lang,
		isInstalled,
		isFav,
		showBlacklist,
		scannedOnly,
		recent30
	]);
	const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
	const currentPage = Math.min(page, totalPages);
	const pageList = list.slice((currentPage - 1) * pageSize, currentPage * pageSize);
	(0, react.useEffect)(() => {
		scrollRef.current?.scrollTo({ top: 0 });
	}, [currentPage]);
	(0, react.useEffect)(() => {
		verifyPage(pageList);
	}, [pageList, verifyPage]);
	const descRequested = (0, react.useRef)(/* @__PURE__ */ new Set());
	(0, react.useEffect)(() => {
		if (langChoice === "en" || data === null) return;
		const todo = [];
		for (const e of pageList) {
			if (e.local === true || e.owner === "") continue;
			const key = e.owner + "/" + e.name;
			if (descRequested.current.has(langChoice + ":" + key)) continue;
			if (e.descriptions?.[langChoice] != null && e.descriptions[langChoice] !== "") continue;
			todo.push(e);
		}
		if (todo.length === 0) return;
		for (const e of todo) descRequested.current.add(langChoice + ":" + e.owner + "/" + e.name);
		fetch("/dsh-store/descriptions", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				lang: langChoice,
				repos: todo.map((e) => e.owner + "/" + e.name)
			})
		}).then((res) => res.json()).then((body) => {
			const descs = body.descriptions ?? {};
			setData((prev) => {
				if (prev === null) return prev;
				return {
					...prev,
					plugins: prev.plugins.map((e) => {
						const hit = descs[(e.owner + "/" + e.name).toLowerCase()];
						if (hit === void 0) return e;
						return {
							...e,
							descriptions: {
								...e.descriptions ?? {},
								[langChoice]: hit
							}
						};
					})
				};
			});
		}).catch(() => {});
	}, [
		langChoice,
		pageList,
		data
	]);
	const versionsRequested = (0, react.useRef)(/* @__PURE__ */ new Set());
	(0, react.useEffect)(() => {
		if (data === null) return;
		const todo = pageList.filter((e) => e.local !== true && e.owner !== "" && e.npmVersion == null && e.version == null && e.repoVersion === void 0 && !versionsRequested.current.has(e.owner + "/" + e.name)).map((e) => e.owner + "/" + e.name).slice(0, 24);
		if (todo.length === 0) return;
		for (const r of todo) versionsRequested.current.add(r.toLowerCase());
		fetch("/dsh-store/versions", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ repos: todo })
		}).then((res) => res.json()).then((body) => {
			const got = body.versions ?? {};
			setData((prev) => {
				if (prev === null) return prev;
				return {
					...prev,
					plugins: prev.plugins.map((entry) => {
						const hit = got[entry.owner + "/" + entry.name] ?? got[(entry.owner + "/" + entry.name).toLowerCase()];
						if (hit === void 0) return entry;
						return {
							...entry,
							repoVersion: hit
						};
					})
				};
			});
		}).catch(() => {});
	}, [pageList, data]);
	const downloadsRequested = (0, react.useRef)(/* @__PURE__ */ new Set());
	const downloadsEnrich = (0, react.useCallback)((names) => {
		const todo = [...new Set(names.filter((n) => n !== "" && !downloadsRequested.current.has(n)))];
		if (todo.length === 0) return;
		for (const n of todo) downloadsRequested.current.add(n);
		fetch("/dsh-store/downloads", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ names: todo.slice(0, 1500) })
		}).then((res) => res.json()).then((body) => {
			const got = body.downloads ?? {};
			const totals = body.totals ?? {};
			setData((prev) => {
				if (prev === null) return prev;
				return {
					...prev,
					plugins: prev.plugins.map((e) => {
						const hit = e.npm !== null ? got[e.npm] : void 0;
						const tot = e.npm !== null ? totals[e.npm] : void 0;
						if (hit === void 0 && tot === void 0) return e;
						return {
							...e,
							downloads: hit === void 0 ? e.downloads : hit,
							totalDownloads: tot === void 0 ? e.totalDownloads : tot
						};
					})
				};
			});
		}).catch(() => {});
	}, []);
	(0, react.useEffect)(() => {
		if (data === null) return;
		downloadsEnrich(pageList.filter((e) => e.npm !== null && e.downloads === void 0).map((e) => e.npm).slice(0, 48));
	}, [
		pageList,
		data,
		downloadsEnrich
	]);
	const fullDownloadsFetched = (0, react.useRef)(false);
	(0, react.useEffect)(() => {
		if (sortDim !== "downloads" || data === null || fullDownloadsFetched.current) return;
		fullDownloadsFetched.current = true;
		const all = [...new Set(data.plugins.filter((e) => e.npm !== null && e.downloads === void 0).map((e) => e.npm))];
		const step = 1500;
		for (let i = 0; i < all.length; i += step) downloadsEnrich(all.slice(i, i + step));
	}, [
		sortDim,
		data,
		downloadsEnrich
	]);
	const scansRequested = (0, react.useRef)(/* @__PURE__ */ new Set());
	(0, react.useEffect)(() => {
		if (data === null) return;
		const todo = pageList.filter((e) => e.local !== true && e.excluded == null && !scansRequested.current.has((e.owner + "/" + e.name).toLowerCase())).filter((e) => {
			if (e.bundled === null || e.bundled === void 0) return true;
			if (e.bundledAt === null || e.bundledAt === void 0 || e.pushed === null) return false;
			return Date.parse(e.pushed) > Date.parse(e.bundledAt);
		}).slice(0, 24);
		if (todo.length === 0) return;
		for (const e of todo) scansRequested.current.add((e.owner + "/" + e.name).toLowerCase());
		fetch("/dsh-store/scan", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ repos: todo.map((e) => e.owner + "/" + e.name) })
		}).then((res) => res.json()).then((body) => {
			const got = body.bundles ?? {};
			if (Object.keys(got).length === 0) return;
			setData((prev) => {
				if (prev === null) return prev;
				return {
					...prev,
					plugins: prev.plugins.map((e) => {
						const hit = got[e.owner + "/" + e.name];
						if (hit === void 0) return e;
						return {
							...e,
							bundled: hit,
							bundledAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
						};
					})
				};
			});
		}).catch(() => {});
	}, [pageList, data]);
	const doSmartInstall = (0, react.useCallback)((entry) => {
		setConfirming(null);
		const id = nextTaskId();
		setTasks((list) => enqueueTask(list, {
			id,
			kind: "smart-install",
			name: entry.npm ?? entry.owner + "/" + entry.name,
			state: "running",
			detail: t("smartInstallHint"),
			reason: null,
			at: Date.now()
		}));
		setTasksOpen(true);
		fetch("/dsh-store/smart-install", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				repo: entry.owner + "/" + entry.name,
				npm: entry.npm,
				id
			})
		}).then((res) => res.json()).then((body) => {
			if (body.cancelled === true) {
				setToast(t("taskCancelled"));
				finishTask(id, {
					ok: false,
					error: t("taskCancelled")
				}, "");
				return;
			}
			if (body.verdict === "refuse") {
				setToast(t("smartRefused") + ": " + (body.report ?? ""));
				finishTask(id, {
					ok: false,
					error: t("smartRefused") + " · " + (body.report ?? "")
				}, "");
			} else if (body.ok === true) {
				const verdictNote = body.verdict === "caution" ? " ⚠ " + ((body.risks ?? []).slice(0, 3).join("；") || "AI 提示需注意") : body.verdict === "unavailable" ? " · AI 审查不可用，已按常规安装" : "";
				setToast(t("installDone") + verdictNote);
				finishTask(id, {
					ok: true,
					message: (body.installMessage ?? "") + " " + (body.report ?? "") + verdictNote
				}, t("installDone"));
				fetchStatus();
			} else {
				setToast(t("installFailed") + ": " + (body.installMessage ?? body.error ?? ""));
				finishTask(id, {
					ok: false,
					error: (body.installMessage ?? body.error ?? t("installFailed")) + (body.report !== void 0 && body.report !== "" ? " · " + body.report : "")
				}, "");
			}
		}).catch(() => {
			setToast(t("installFailed"));
			finishTask(id, {
				ok: false,
				error: t("installFailed")
			}, "");
		});
	}, [
		t,
		fetchStatus,
		finishTask
	]);
	const doInstall = (0, react.useCallback)((entry) => {
		setConfirming(null);
		const id = nextTaskId();
		setTasks((list) => enqueueTask(list, {
			id,
			kind: "install",
			name: entry.npm ?? entry.owner + "/" + entry.name,
			state: "running",
			detail: entry.owner + "/" + entry.name,
			reason: null,
			at: Date.now()
		}));
		fetch("/dsh-store/install", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				repo: entry.owner + "/" + entry.name,
				npm: entry.npm,
				id
			})
		}).then((res) => res.json()).then((body) => {
			if (body.cancelled === true) {
				setToast(t("taskCancelled"));
				finishTask(id, {
					ok: false,
					error: t("taskCancelled")
				}, "");
				return;
			}
			setToast(body.ok === true ? t("installDone") : t("installFailed") + ": " + (body.message ?? body.error ?? ""));
			finishTask(id, body, t("installDone"));
			fetchStatus();
		}).catch(() => {
			setToast(t("installFailed"));
			finishTask(id, {
				ok: false,
				error: t("installFailed")
			}, "");
		});
	}, [
		t,
		fetchStatus,
		finishTask
	]);
	const doUninstallLocal = (0, react.useCallback)((entry) => {
		setRemovingLocal(null);
		const id = nextTaskId();
		setTasks((list) => enqueueTask(list, {
			id,
			kind: "uninstall",
			name: entry.name,
			state: "running",
			detail: null,
			reason: null,
			at: Date.now()
		}));
		fetch("/dsh-store/uninstall", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				name: entry.name,
				id
			})
		}).then((res) => res.json()).then((body) => {
			if (body.cancelled === true) {
				setToast(t("taskCancelled"));
				finishTask(id, {
					ok: false,
					error: t("taskCancelled")
				}, "");
				return;
			}
			setToast(body.ok === true ? t("uninstallDone") : t("installFailed") + ": " + (body.message ?? body.error ?? ""));
			finishTask(id, body, t("uninstallDone"));
			fetchStatus();
		}).catch(() => {
			setToast(t("installFailed"));
			finishTask(id, {
				ok: false,
				error: t("installFailed")
			}, "");
		});
	}, [
		t,
		fetchStatus,
		finishTask
	]);
	const doUninstall = (0, react.useCallback)((entry) => {
		setRemoving(null);
		const id = nextTaskId();
		setTasks((list) => enqueueTask(list, {
			id,
			kind: "uninstall",
			name: entry.npm ?? entry.owner + "/" + entry.name,
			state: "running",
			detail: entry.owner + "/" + entry.name,
			reason: null,
			at: Date.now()
		}));
		fetch("/dsh-store/uninstall", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				repo: entry.owner + "/" + entry.name,
				id
			})
		}).then((res) => res.json()).then((body) => {
			if (body.cancelled === true) {
				setToast(t("taskCancelled"));
				finishTask(id, {
					ok: false,
					error: t("taskCancelled")
				}, "");
				return;
			}
			setToast(body.ok === true ? t("uninstallDone") : t("installFailed") + ": " + (body.message ?? body.error ?? ""));
			finishTask(id, body, t("uninstallDone"));
			fetchStatus();
		}).catch(() => {
			setToast(t("installFailed"));
			finishTask(id, {
				ok: false,
				error: t("installFailed")
			}, "");
		});
	}, [
		t,
		fetchStatus,
		finishTask
	]);
	const [smartUninstallBusy, setSmartUninstallBusy] = (0, react.useState)(false);
	const [smartUninstallRisk, setSmartUninstallRisk] = (0, react.useState)(null);
	const [smartUninstallPending, setSmartUninstallPending] = (0, react.useState)(null);
	const runSmartUninstallRequest = (0, react.useCallback)((name, taskId, confirm) => {
		fetch("/dsh-store/smart-uninstall", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				name,
				confirm,
				id: taskId
			})
		}).then((res) => res.json()).then((body) => {
			if (body.cancelled === true) {
				setToast(t("taskCancelled"));
				finishTask(taskId, {
					ok: false,
					error: t("taskCancelled")
				}, "");
				return;
			}
			if (body.stage === "review") {
				setSmartUninstallRisk({
					name,
					verdict: body.verdict ?? "caution",
					report: body.report ?? ""
				});
				setSmartUninstallPending({
					name,
					taskId
				});
				finishTask(taskId, {
					ok: true,
					message: t("smartUninstallReview") + " · " + (body.report ?? "")
				}, t("smartUninstallReview"));
			} else if (body.stage === "done") {
				if (body.verdict === "refuse") {
					setToast(t("smartUninstallRefused") + ": " + (body.report ?? ""));
					finishTask(taskId, {
						ok: false,
						error: t("smartUninstallRefused") + " · " + (body.report ?? "")
					}, "");
				} else if (body.ok === true) {
					setToast(t("uninstallDone") + " " + (body.report ?? ""));
					finishTask(taskId, {
						ok: true,
						message: body.report ?? ""
					}, t("uninstallDone"));
				} else {
					setToast(t("installFailed") + ": " + (body.report ?? body.error ?? ""));
					finishTask(taskId, {
						ok: false,
						error: body.report ?? body.error ?? t("installFailed")
					}, "");
				}
				fetchStatus();
			}
		}).catch(() => {
			setToast(t("installFailed"));
			finishTask(taskId, {
				ok: false,
				error: t("installFailed")
			}, "");
		}).finally(() => setSmartUninstallBusy(false));
	}, [
		t,
		fetchStatus,
		finishTask
	]);
	const doSmartUninstall = (0, react.useCallback)((entry) => {
		if (smartUninstallBusy) return;
		const name = entry.npm ?? entry.name;
		setRemoving(null);
		setSmartUninstallBusy(true);
		const id = nextTaskId();
		setTasks((list) => enqueueTask(list, {
			id,
			kind: "smart-uninstall",
			name,
			state: "running",
			detail: t("smartUninstallHint"),
			reason: null,
			at: Date.now()
		}));
		setTasksOpen(true);
		runSmartUninstallRequest(name, id, false);
	}, [
		smartUninstallBusy,
		t,
		runSmartUninstallRequest
	]);
	const confirmSmartUninstall = (0, react.useCallback)(() => {
		const pending = smartUninstallPending;
		setSmartUninstallRisk(null);
		setSmartUninstallPending(null);
		if (pending === null) return;
		setSmartUninstallBusy(true);
		setTasks((list) => patchTask(list, pending.taskId, {
			state: "running",
			detail: t("uninstalling").replace("{0}", pending.name)
		}));
		runSmartUninstallRequest(pending.name, pending.taskId, true);
	}, [
		smartUninstallPending,
		t,
		runSmartUninstallRequest
	]);
	(0, react.useEffect)(() => {
		if (toast === null) return;
		const timer = setTimeout(() => setToast(null), 6e3);
		return () => clearTimeout(timer);
	}, [toast]);
	const updates = status?.updates ?? [];
	const updatesAll = status?.updatesAll ?? [];
	const updateFor = (0, react.useCallback)((e) => {
		const keys = /* @__PURE__ */ new Set();
		if (e.npm !== null) keys.add(e.npm.toLowerCase());
		keys.add(e.name.toLowerCase());
		for (const u of updatesAll) if (keys.has(u.name.toLowerCase()) || e.owner !== "" && u.repo.toLowerCase() === (e.owner + "/" + e.name).toLowerCase()) return u;
		return null;
	}, [updatesAll]);
	const runUpdateRequest = (0, react.useCallback)((names, toastDone, taskId) => {
		fetch("/dsh-store/update", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				names,
				id: taskId ?? void 0
			})
		}).then((res) => res.json()).then((body) => {
			if (body.cancelled === true && taskId !== null) {
				setToast(t("taskCancelled"));
				finishTask(taskId, {
					ok: false,
					error: t("taskCancelled")
				}, "");
				return;
			}
			setToast(body.ok === true ? toastDone + " — " + (body.message ?? "") : t("updateFailed") + ": " + (body.message ?? body.error ?? ""));
			if (taskId !== null) finishTask(taskId, body, toastDone);
			fetchStatus();
			fetchRegistry(false);
		}).catch(() => {
			setToast(t("updateFailed"));
			if (taskId !== null) finishTask(taskId, {
				ok: false,
				error: t("updateFailed")
			}, "");
		}).finally(() => {
			setUpdateBusy(false);
			setUpdatingNames(/* @__PURE__ */ new Set());
		});
	}, [
		t,
		fetchStatus,
		fetchRegistry,
		finishTask
	]);
	const doUpdateAll = (0, react.useCallback)(() => {
		if (updateBusy || updates.length === 0) return;
		const id = nextTaskId();
		setTasks((list) => enqueueTask(list, {
			id,
			kind: "update",
			name: t("updateAllShort").replace("{0}", String(updates.length)),
			state: "running",
			detail: updates.map((u) => u.name).join("、"),
			reason: null,
			at: Date.now()
		}));
		setUpdateBusy(true);
		setUpdatingNames(new Set(updates.map((u) => u.name.toLowerCase())));
		runUpdateRequest(updates.map((u) => u.name), t("updateDone"), id);
	}, [
		updateBusy,
		updates,
		runUpdateRequest,
		t
	]);
	const doUpdateOne = (0, react.useCallback)((u) => {
		setUpdatingConfirm(null);
		if (updateBusy) return;
		const id = nextTaskId();
		setTasks((list) => enqueueTask(list, {
			id,
			kind: "update",
			name: u.name,
			state: "running",
			detail: u.from + " → " + u.to,
			reason: null,
			at: Date.now()
		}));
		setUpdateBusy(true);
		setUpdatingNames(/* @__PURE__ */ new Set([u.name.toLowerCase()]));
		runUpdateRequest([u.name], t("updateDone"), id);
	}, [
		updateBusy,
		runUpdateRequest,
		t
	]);
	const doSmartUpdate = (0, react.useCallback)((entry, u) => {
		setUpdatingConfirm(null);
		const id = nextTaskId();
		setTasks((list) => enqueueTask(list, {
			id,
			kind: "smart-update",
			name: u.name,
			state: "running",
			detail: u.from + " → " + u.to,
			reason: null,
			at: Date.now()
		}));
		setTasksOpen(true);
		fetch("/dsh-store/smart-update", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				name: u.name,
				from: u.from,
				to: u.to,
				repo: entry.owner + "/" + entry.name,
				npm: entry.npm,
				id
			})
		}).then((res) => res.json()).then((body) => {
			if (body.cancelled === true) {
				setToast(t("taskCancelled"));
				finishTask(id, {
					ok: false,
					error: t("taskCancelled")
				}, "");
				return;
			}
			if (body.verdict === "refuse") {
				setToast(t("smartRefused") + ": " + (body.report ?? ""));
				finishTask(id, {
					ok: false,
					error: t("smartRefused") + " · " + (body.report ?? "")
				}, "");
			} else if (body.ok === true) {
				const verdictNote = body.verdict === "caution" ? " ⚠ " + ((body.risks ?? []).slice(0, 3).join("；") || "AI 提示需注意") : body.verdict === "unavailable" ? " · AI 审查不可用，已按常规更新" : "";
				setToast(t("updateDone") + verdictNote);
				finishTask(id, {
					ok: true,
					message: (body.message ?? "") + " " + (body.report ?? "") + verdictNote
				}, t("updateDone"));
				fetchStatus();
				fetchRegistry(false);
			} else {
				setToast(t("updateFailed") + ": " + (body.message ?? body.error ?? ""));
				finishTask(id, {
					ok: false,
					error: (body.message ?? body.error ?? t("updateFailed")) + (body.report !== void 0 && body.report !== "" ? " · " + body.report : "")
				}, "");
			}
		}).catch(() => {
			setToast(t("updateFailed"));
			finishTask(id, {
				ok: false,
				error: t("updateFailed")
			}, "");
		});
	}, [
		t,
		fetchStatus,
		fetchRegistry,
		finishTask
	]);
	const skipSet = (0, react.useMemo)(() => new Set((status?.skipUpdates ?? []).map((n) => n.toLowerCase())), [status]);
	const rollbacks = status?.rollbacks ?? {};
	const stateOf = (0, react.useCallback)((e) => {
		const deps = status?.installed ?? {};
		let depName = null;
		for (const n of Object.keys(deps)) {
			if (e.npm !== null && n.toLowerCase() === e.npm.toLowerCase()) {
				depName = n;
				break;
			}
			if (n.toLowerCase() === e.name.toLowerCase()) {
				depName = n;
				break;
			}
		}
		if (depName === null) return null;
		return status?.pluginStates?.[depName] ?? null;
	}, [status]);
	const doToggle = (0, react.useCallback)((e) => {
		const deps = status?.installed ?? {};
		let depName = null;
		for (const n of Object.keys(deps)) {
			if (e.npm !== null && n.toLowerCase() === e.npm.toLowerCase()) {
				depName = n;
				break;
			}
			if (n.toLowerCase() === e.name.toLowerCase()) {
				depName = n;
				break;
			}
		}
		if (depName === null || toggling.has(depName)) return;
		const next = stateOf(e) === "disabled";
		setToggling((prev) => new Set(prev).add(depName));
		fetch("/dsh-store/toggle", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				name: depName,
				enabled: next
			})
		}).then((res) => res.json()).then((body) => {
			setToast(body.ok === true ? t("toggleDone") : t("toggleFailed") + ": " + (body.message ?? body.error ?? ""));
			fetchStatus();
		}).catch(() => setToast(t("toggleFailed"))).finally(() => setToggling((prev) => {
			const s = new Set(prev);
			s.delete(depName);
			return s;
		}));
	}, [
		status,
		stateOf,
		toggling,
		fetchStatus,
		t
	]);
	const doRollback = (0, react.useCallback)((e) => {
		const deps = status?.installed ?? {};
		let depName = null;
		for (const n of Object.keys(deps)) {
			if (e.npm !== null && n.toLowerCase() === e.npm.toLowerCase()) {
				depName = n;
				break;
			}
			if (n.toLowerCase() === e.name.toLowerCase()) {
				depName = n;
				break;
			}
		}
		if (depName === null || rollbacks[depName] === void 0) return;
		const id = nextTaskId();
		setTasks((list) => enqueueTask(list, {
			id,
			kind: "rollback",
			name: depName,
			state: "running",
			detail: t("rollbackBtn"),
			reason: null,
			at: Date.now()
		}));
		setRollbacking(e.name);
		fetch("/dsh-store/rollback", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				name: depName,
				id
			})
		}).then((res) => res.json()).then((body) => {
			if (body.cancelled === true) {
				setToast(t("taskCancelled"));
				finishTask(id, {
					ok: false,
					error: t("taskCancelled")
				}, "");
				return;
			}
			setToast(body.ok === true ? t("rollbackDone") + " " + (body.message ?? "") : t("rollbackFailed") + ": " + (body.message ?? body.error ?? ""));
			finishTask(id, body, t("rollbackDone"));
			fetchStatus();
		}).catch(() => {
			setToast(t("rollbackFailed"));
			finishTask(id, {
				ok: false,
				error: t("rollbackFailed")
			}, "");
		}).finally(() => setRollbacking(null));
	}, [
		status,
		rollbacks,
		fetchStatus,
		finishTask,
		t
	]);
	const doToggleSkip = (0, react.useCallback)((e) => {
		const deps = status?.installed ?? {};
		let depName = null;
		for (const n of Object.keys(deps)) {
			if (e.npm !== null && n.toLowerCase() === e.npm.toLowerCase()) {
				depName = n;
				break;
			}
			if (n.toLowerCase() === e.name.toLowerCase()) {
				depName = n;
				break;
			}
		}
		if (depName === null) return;
		const next = !skipSet.has(depName.toLowerCase());
		fetch("/dsh-store/skip", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				name: depName,
				skip: next
			})
		}).then(() => fetchStatus()).catch(() => setToast(t("toggleFailed")));
	}, [
		status,
		skipSet,
		fetchStatus,
		t
	]);
	const doSelfUpdate = (0, react.useCallback)(() => {
		const selfUpdate = status?.selfUpdate;
		if (selfUpdateBusy || selfUpdate?.to == null) return;
		setSelfUpdateBusy(true);
		const id = nextTaskId();
		setTasks((list) => enqueueTask(list, {
			id,
			kind: "update",
			name: "dsh-store",
			state: "running",
			detail: selfUpdate.from + " → " + selfUpdate.to,
			reason: null,
			at: Date.now()
		}));
		fetch("/dsh-store/self-update", { method: "POST" }).then((res) => res.json()).then((body) => {
			if (body.ok === true) {
				setSelfUpdateDone(true);
				setToast(t("selfUpdateDone") + (body.needRestart === true ? " " + t("restartNeeded") : ""));
			} else setToast(t("selfUpdateFailed") + ": " + (body.message ?? body.error ?? ""));
			finishTask(id, body, t("selfUpdateDone"));
			fetchStatus();
		}).catch(() => {
			setToast(t("selfUpdateFailed"));
			finishTask(id, {
				ok: false,
				error: t("selfUpdateFailed")
			}, "");
		}).finally(() => setSelfUpdateBusy(false));
	}, [
		selfUpdateBusy,
		status,
		fetchStatus,
		t,
		finishTask
	]);
	const sortItems = (0, react.useMemo)(() => [
		{
			type: "label",
			id: "dim-label",
			text: t("sortDim")
		},
		{
			id: "stars",
			label: t("sortStars")
		},
		{
			id: "today",
			label: t("sortToday")
		},
		{
			id: "downloads",
			label: t("sortDownloads")
		},
		{
			id: "created",
			label: t("sortCreated")
		},
		{
			type: "separator",
			id: "dim-sep"
		},
		{
			type: "label",
			id: "dir-label",
			text: t("sortDir")
		},
		{
			id: "desc",
			label: t("sortDesc")
		},
		{
			id: "asc",
			label: t("sortAsc")
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
	const chipCats = orderedCategories(categories, cat, false);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "pcm-root",
		ref: rootRef,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "pcm-sticky-top",
				children: [
					!seedMode && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pcm-brand-card",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
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
											src: "data:image/png;base64,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",
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
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "pcm-header-actions",
								children: [
									updates.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										className: "pcm-update-all-btn",
										onClick: doUpdateAll,
										disabled: updateBusy,
										children: updateBusy ? t("updatingAll") : t("updateAllBtn").replace("{0}", String(updates.length))
									}),
									status?.selfUpdate?.to != null && !selfUpdateDone && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										className: "pcm-self-update-btn",
										onClick: doSelfUpdate,
										disabled: selfUpdateBusy,
										children: selfUpdateBusy ? t("updatingAll") : t("selfUpdateBtn").replace("{0}", status.selfUpdate.from).replace("{1}", status.selfUpdate.to)
									}),
									selfUpdateDone && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "pcm-self-update-warn",
										children: t("restartNeeded")
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										ref: tasksAnchorRef,
										className: "pcm-tasks-btn",
										"aria-expanded": tasksOpen,
										onClick: () => setTasksOpen((o) => !o),
										children: [tasksSummary.running > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "pcm-spin",
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, { size: 13 })
										}), tasksSummary.running > 0 ? t("tasksBtn") + "（" + String(tasksSummary.running) + "）" : t("tasksBtn")]
									})
								]
							})]
						})
					}),
					floating && !seedMode ? headHost !== null && (0, react_dom.createPortal)(/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pcm-header-row2 pcm-head-actions-row",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "pcm-subtitle",
								children: t("autoRefresh")
							}),
							data !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "pcm-source",
								children: sourceLabel
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
								className: "pcm-brand-btn pcm-brand-btn-sm",
								children: refreshing ? t("refreshing") : t("refresh")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Menu, {
								open: langOpen,
								onClose: () => setLangOpen(false),
								onSelect: (id) => {
									setLangPersist(id);
									setLangOpen(false);
									setPage(1);
								},
								align: "end",
								anchor: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "pcm-lang-btn pcm-lang-btn-head" + (langOpen ? " pcm-lang-btn-open" : ""),
									onClick: () => setLangOpen((o) => !o),
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "pcm-lang-flag",
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconGlobeOutline14, { size: 12 })
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "pcm-lang-label",
											children: LANG_SHORT[langChoice] ?? langChoice.toUpperCase()
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "pcm-lang-caret",
											"aria-hidden": "true"
										})
									]
								}),
								items: langItems,
								selectedId: langChoice
							})
						]
					}), headHost) : !seedMode ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
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
					}) : null,
					!seedMode && loadError && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pcm-rate",
						children: t("loadError")
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
								className: curatedOnly ? "pcm-pill-curated pcm-pill-curated-on" : "pcm-pill-curated",
								active: curatedOnly,
								onClick: () => {
									setCuratedOnly((v) => !v);
									setPage(1);
								},
								children: t("curatedOnly")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Pill, {
								className: verifiedOnly ? "pcm-pill-verified pcm-pill-verified-on" : "pcm-pill-verified",
								active: verifiedOnly,
								onClick: () => {
									setVerifiedOnly((v) => !v);
									setPage(1);
								},
								children: t("verifiedOnly")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Pill, {
								className: installedOnly ? "pcm-pill-installed pcm-pill-installed-on" : "pcm-pill-installed",
								active: installedOnly,
								onClick: () => {
									setInstalledOnly((v) => !v);
									setPage(1);
								},
								children: t("installedOnly")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Pill, {
								className: favOnly ? "pcm-pill-fav pcm-pill-fav-on" : "pcm-pill-fav",
								active: favOnly,
								onClick: () => {
									setFavOnly((v) => !v);
									setPage(1);
								},
								children: t("favOnly")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Pill, {
								className: showBlacklist ? "pcm-pill-blacklist pcm-pill-blacklist-on" : "pcm-pill-blacklist",
								active: showBlacklist,
								onClick: () => {
									setShowBlacklist((v) => !v);
									setPage(1);
								},
								title: t("blacklistHint"),
								children: [t("blacklistChip"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "pcm-count",
									children: excludedCount
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Pill, {
								className: scannedOnly ? "pcm-pill-scanned pcm-pill-scanned-on" : "pcm-pill-scanned",
								active: scannedOnly,
								onClick: () => {
									setScannedOnly((v) => !v);
									setPage(1);
								},
								title: t("scannedHint"),
								children: [t("scannedChip"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "pcm-count",
									children: scannedCount
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Pill, {
								className: recent30 ? "pcm-pill-recent pcm-pill-recent-on" : "pcm-pill-recent",
								active: recent30,
								onClick: () => {
									setRecent30((v) => !v);
									setPage(1);
								},
								title: t("recent30Hint"),
								children: t("recent30")
							}),
							!seedMode && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "pcm-search-wrap",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
									className: "pcm-search",
									icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSearchOutline16, { size: 14 }),
									value: q,
									placeholder: t("searchPlaceholder"),
									onChange: (e) => {
										setQ(e.target.value);
										setPage(1);
									}
								}), q !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: "pcm-search-clear",
									title: t("searchClear"),
									onClick: () => {
										setQ("");
										setPage(1);
									},
									children: "✕"
								})]
							}),
							!seedMode && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "pcm-smart-search-btn",
								title: t("smartSearchHint"),
								disabled: smartSearchBusy,
								onClick: doSmartSearch,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "pcm-smart-star",
									children: "✦"
								}), smartSearchBusy ? t("smartSearching") : t("smartSearch")]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "pcm-sort-wrap",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Menu, {
									open: sortOpen,
									onClose: () => setSortOpen(false),
									onSelect: (id) => {
										if (id === "stars" || id === "today" || id === "created" || id === "downloads") setSortDim(id);
										else if (id === "asc" || id === "desc") setSortDir(id);
										setPage(1);
									},
									align: "end",
									portal: true,
									anchor: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										variant: "outline",
										size: "sm",
										className: "pcm-sort-btn",
										onClick: () => setSortOpen((o) => !o),
										children: t("sort") + " " + (sortDir === "desc" ? "↓" : "↑")
									}),
									items: sortItems,
									selectedIds: [sortDim, sortDir]
								})
							}),
							!floating && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "pcm-lang-wrap",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Menu, {
									open: langOpen,
									onClose: () => setLangOpen(false),
									onSelect: (id) => {
										setLangPersist(id);
										setLangOpen(false);
										setPage(1);
									},
									align: "end",
									anchor: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "pcm-lang-btn" + (langOpen ? " pcm-lang-btn-open" : ""),
										onClick: () => setLangOpen((o) => !o),
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "pcm-lang-flag",
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconGlobeOutline14, { size: 12 })
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "pcm-lang-label",
												children: LANG_SHORT[langChoice] ?? langChoice.toUpperCase()
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "pcm-lang-caret",
												"aria-hidden": "true"
											})
										]
									}),
									items: langItems,
									selectedId: langChoice
								})
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: catsClamped ? "pcm-chips pcm-chips-clamped" : "pcm-chips",
						ref: chipsRef,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Pill, {
								active: cat === "all",
								onClick: () => {
									setCat("all");
									setPage(1);
								},
								children: [t("all"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "pcm-count",
									children: categoryCounts.all
								})]
							}),
							chipCats.map((id) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Pill, {
								active: cat === id,
								onClick: () => {
									setCat(id);
									setPage(1);
								},
								children: [catLabel(id), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "pcm-count",
									children: categoryCounts.per.get(id) ?? 0
								})]
							}, id)),
							hiddenCatCount > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "ghost",
								size: "sm",
								className: "pcm-chip-more-btn",
								onClick: () => setCatsClamped((v) => !v),
								children: catsClamped ? t("expandCats").replace("{0}", String(hiddenCatCount)) : t("collapseCats")
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "pcm-scroll",
				ref: scrollRef,
				children: list.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "pcm-empty",
					children: data === null ? t("loading") : t("empty")
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(react_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "pcm-grid",
					children: pageList.map((entry) => {
						const installed = isInstalled(entry);
						const today = entry.todayStars;
						const upd = updateFor(entry);
						const disclosure = entry.disclosure;
						return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: entry.local === true ? "pcm-card pcm-card-local" : entry.excluded != null && entry.excluded.kind !== "leaderboard" ? "pcm-card pcm-card-excluded" : "pcm-card",
							onClick: () => {
								if (entry.local !== true) setDetail(entry);
							},
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pcm-card-top",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "pcm-av",
											style: { background: avatarColor(entry.name) },
											children: [(entry.name.replace(/^dsh[-_]/i, "").charAt(0) || "P").toUpperCase(), entry.avatar !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
												className: "pcm-av-img",
												src: entry.avatar,
												alt: "",
												loading: "lazy",
												onError: (e) => {
													e.currentTarget.style.display = "none";
												}
											})]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "pcm-card-title",
											children: [
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
													className: "pcm-name",
													children: entry.name
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
													className: "pcm-owner",
													children: entry.owner
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
													className: isFav(entry) ? "pcm-fav-star pcm-fav-on" : "pcm-fav-star",
													title: t("favAdd"),
													onClick: (e) => {
														e.stopPropagation();
														toggleFav(entry);
													},
													children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
														width: "13",
														height: "13",
														viewBox: "0 0 24 24",
														"aria-hidden": "true",
														children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
															d: "M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
															fill: isFav(entry) ? "#f59e0b" : "transparent",
															stroke: "#d99a1f",
															strokeWidth: "1.6",
															strokeLinejoin: "round"
														})
													})
												})
											]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
											className: "pcm-actions",
											onClick: (e) => e.stopPropagation(),
											children: installed ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
												variant: "outline",
												size: "sm",
												disabled: true,
												className: "pcm-installed-tag",
												children: t("installed")
											}), entry.local !== true && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
												variant: "outline",
												size: "sm",
												icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLinkOutline16, { size: 14 }),
												className: "pcm-source-btn",
												onClick: () => window.open(entry.url, "_blank", "noopener"),
												children: t("sourceBtn")
											})] }) : entry.excluded != null && entry.excluded.kind !== "leaderboard" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "pcm-excluded-note",
												title: entry.excluded.reason,
												children: entry.excluded.kind === "market" ? t("marketDirBadge") : t("excludedBadge")
											}), entry.local !== true && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
												variant: "outline",
												size: "sm",
												icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLinkOutline16, { size: 14 }),
												className: "pcm-source-btn",
												onClick: () => window.open(entry.url, "_blank", "noopener"),
												children: t("sourceBtn")
											})] }) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
												variant: "primary",
												size: "sm",
												onClick: () => setConfirming(entry),
												children: t("install")
											}), entry.local !== true && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
												variant: "outline",
												size: "sm",
												icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLinkOutline16, { size: 14 }),
												className: "pcm-source-btn",
												onClick: () => window.open(entry.url, "_blank", "noopener"),
												children: t("sourceBtn")
											})] })
										})
									]
								}),
								(entry.curated || entry.verified != null || disclosure != null) && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pcm-safety-row",
									children: [
										entry.curated && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											className: "pcm-safety pcm-safety-curated",
											title: t("curatedBadgeTitle"),
											children: ["⚑ ", t("curatedBadge")]
										}),
										entry.verified != null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											className: "pcm-safety pcm-safety-verified",
											title: t("verifiedBadgeHint") + " · " + entry.verified.by,
											children: ["✓ ", t("verifiedBadge")]
										}),
										disclosure != null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											className: "pcm-safety pcm-safety-disclosure",
											title: t("disclosureBadge"),
											children: ["🛡 ", t("disclosureBadge")]
										})
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "pcm-desc",
									children: (() => {
										const d = langChoice !== "en" && entry.descriptions?.[langChoice] ? entry.descriptions[langChoice] : entry.description;
										return d === "" ? "—" : d;
									})()
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pcm-stats2",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											className: today === null ? "pcm-today" : today >= 0 ? "pcm-today pcm-today-up" : "pcm-today pcm-today-down",
											title: t("todayGainHint"),
											children: [
												t("todayGain"),
												today === null ? "—" : (today >= 0 ? "+" : "") + today,
												" star"
											]
										}),
										typeof entry.downloads === "number" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											className: "pcm-dl-30",
											title: t("downloadsHint"),
											children: [
												t("downloads30Label"),
												" ",
												formatDownloads(entry.downloads)
											]
										}),
										typeof entry.totalDownloads === "number" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											className: "pcm-dl-total",
											title: t("totalDownloadsHint"),
											children: [
												t("totalDownloadsLabel"),
												" ",
												formatDownloads(entry.totalDownloads)
											]
										})
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pcm-foot",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "pcm-stats",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
												className: "pcm-stars",
												children: ["★ ", formatStars(entry.stars)]
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "pcm-cat",
												children: catLabel(entry.category)
											}),
											(entry.npmVersion ?? entry.version ?? entry.repoVersion) != null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "pcm-card-version",
												title: entry.npmVersion != null ? t("detailNpmVer") : entry.version != null ? t("detailRepoVer") : t("repoVersionHint"),
												children: ((value) => /^v/i.test(value) ? value : "v" + value)(entry.npmVersion ?? entry.version ?? entry.repoVersion)
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "pcm-updated",
												title: entry.pushed ?? void 0,
												children: t("updatedShort") + " " + relativeFromNow(entry.pushed, t)
											})
										]
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
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
											entry.local === true && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "pcm-badge pcm-badge-local",
												children: t("localBadge")
											}),
											entry.excluded != null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "pcm-badge pcm-badge-excluded",
												title: t("excludedHint").replace("{0}", entry.excluded.reason),
												children: entry.excluded.kind === "market" ? t("marketDirBadge") : t("excludedBadge")
											}),
											entry.bundled === true && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "pcm-badge pcm-badge-scanned",
												title: t("scannedBadgeHint"),
												children: t("scannedBadge")
											}),
											entry.bundled === false && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "pcm-badge pcm-badge-scanfail",
												title: t("scanFailHint"),
												children: t("scanFailBadge")
											}),
											entry.dormant === true && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "pcm-badge pcm-badge-dormant",
												title: t("dormantHint"),
												children: t("dormantBadge")
											})
										]
									})]
								}),
								installed && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pcm-installed-panel",
									onClick: (e) => e.stopPropagation(),
									children: [upd !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "pcm-installed-update",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											className: "pcm-update-versions",
											title: t("updateHint"),
											children: [
												upd.from,
												" ",
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
													className: "pcm-update-arrow",
													children: "→"
												}),
												" ",
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
													className: "pcm-update-new",
													children: upd.to
												})
											]
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											variant: "primary",
											size: "sm",
											className: "pcm-update-btn",
											disabled: updateBusy,
											onClick: () => setUpdatingConfirm({
												entry,
												upd
											}),
											children: updatingNames.has(upd.name.toLowerCase()) ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "pcm-spin",
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, { size: 14 })
											}) : t("updateBtn")
										})]
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "pcm-installed-actions",
										children: [
											entry.local === true ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
												variant: "outline",
												size: "sm",
												className: "pcm-uninstall-btn",
												onClick: () => setRemovingLocal(entry),
												children: t("uninstall")
											}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
												variant: "outline",
												size: "sm",
												className: "pcm-uninstall-btn",
												onClick: () => setRemoving(entry),
												children: t("uninstall")
											}),
											entry.local !== true && rollbacks[entry.npm ?? entry.name] !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: "pcm-vsep" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
												variant: "ghost",
												size: "sm",
												className: "pcm-rollback-btn",
												disabled: rollbacking === entry.name,
												onClick: () => doRollback(entry),
												children: rollbacking === entry.name ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
													className: "pcm-spin",
													children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, { size: 14 })
												}) : t("rollbackBtn")
											})] }),
											entry.local !== true && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: "pcm-vsep" }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
												className: "pcm-skip-row",
												title: t("skipHint"),
												children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
													type: "checkbox",
													checked: skipSet.has((entry.npm ?? entry.name).toLowerCase()),
													onChange: () => doToggleSkip(entry)
												}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("skipUpdate") })]
											})] }),
											!(entry.npm ?? entry.name).startsWith("@deepseek-ai/") && (entry.npm ?? entry.name) !== "dsh-store" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: "pcm-vsep" }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
												className: "pcm-switch pcm-switch-inline",
												title: t("toggleHint"),
												children: [
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
														className: "pcm-switch-label",
														children: t("enableSwitch")
													}),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
														type: "checkbox",
														checked: stateOf(entry) !== "disabled",
														disabled: toggling.has(entry.npm ?? entry.name),
														onChange: () => doToggle(entry)
													}),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: "pcm-switch-track" }),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
														className: "pcm-state-chip pcm-state-" + (stateOf(entry) ?? "restart"),
														title: t("toggleHint"),
														children: stateOf(entry) === "disabled" ? t("stateDisabled") : stateOf(entry) === "restart" ? t("stateRestart") : t("stateLive")
													})
												]
											})] }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "pcm-state-chip pcm-state-" + (stateOf(entry) ?? "restart"),
												title: t("toggleHint"),
												children: stateOf(entry) === "disabled" ? t("stateDisabled") : stateOf(entry) === "restart" ? t("stateRestart") : t("stateLive")
											})
										]
									})]
								})
							]
						}, (entry.local === true ? "local:" : "") + entry.owner + "/" + entry.name);
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
						"aria-current": item === currentPage ? "page" : void 0,
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
						side: "top",
						portal: true,
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
			detail !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(DetailPanel, {
				t,
				entry: detail,
				langChoice,
				isFav: isFav(detail),
				isInstalled: isInstalled(detail),
				installedSpec: installedSpecOf(detail),
				installing,
				update: updateFor(detail),
				updating: (() => {
					const u = updateFor(detail);
					return u !== null && updatingNames.has(u.name.toLowerCase());
				})(),
				related: (() => {
					const self = (detail.owner + "/" + detail.name).toLowerCase();
					return data === null ? [] : data.plugins.filter((p) => p.category === detail.category && p.excluded == null && (p.owner + "/" + p.name).toLowerCase() !== self).sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0)).slice(0, 6);
				})(),
				onOpenEntry: (e) => setDetail(e),
				onToggleFav: () => toggleFav(detail),
				onInstall: () => setConfirming(detail),
				onUninstall: () => {
					if (detail.local === true) setRemovingLocal(detail);
					else setRemoving(detail);
				},
				onUpdate: () => {
					const u = updateFor(detail);
					if (u !== null) doUpdateOne(u);
				},
				onClose: () => setDetail(null)
			}),
			confirming !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(InstallModal, {
				t,
				entry: confirming,
				installing,
				statusLine: status?.install?.line ?? null,
				onClose: () => setConfirming(null),
				onConfirm: () => doInstall(confirming),
				onSmartInstall: () => doSmartInstall(confirming)
			}),
			updatingConfirm !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(UpdateModal, {
				t,
				entry: updatingConfirm.entry,
				upd: updatingConfirm.upd,
				busy: updateBusy,
				statusLine: updateBusy ? status?.install?.line ?? null : null,
				onClose: () => setUpdatingConfirm(null),
				onConfirm: () => doUpdateOne(updatingConfirm.upd),
				onSmartUpdate: () => doSmartUpdate(updatingConfirm.entry, updatingConfirm.upd)
			}),
			removingLocal !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(LocalUninstallModal, {
				t,
				entry: removingLocal,
				onClose: () => setRemovingLocal(null),
				onConfirm: () => doUninstallLocal(removingLocal)
			}),
			removing !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
				open: true,
				onClose: () => setRemoving(null),
				title: t("uninstallTitle").replace("{0}", removing.name),
				description: t("uninstallDesc"),
				footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "ghost",
						onClick: () => setRemoving(null),
						children: t("cancel")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "pcm-smart-install-btn pcm-smart-uninstall-btn",
						onClick: () => doSmartUninstall(removing),
						title: t("smartUninstallHint"),
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "pcm-smart-star",
							children: "✦"
						}), smartUninstallBusy ? t("smartSearching") : t("smartUninstall")]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: "pcm-install-plain-btn pcm-uninstall-plain-btn",
						onClick: () => doUninstall(removing),
						children: t("uninstall")
					})
				] }),
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "pcm-modal-body",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pcm-cmd",
						children: removing.owner + "/" + removing.name
					})
				})
			}),
			smartUninstallRisk !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
				open: true,
				onClose: () => setSmartUninstallRisk(null),
				title: t("smartUninstallReview") + ": " + smartUninstallRisk.name,
				description: t("smartUninstallHint"),
				footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
					variant: "ghost",
					onClick: () => setSmartUninstallRisk(null),
					children: t("cancel")
				}), smartUninstallRisk.verdict !== "refuse" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					className: "pcm-install-plain-btn",
					onClick: () => confirmSmartUninstall(),
					children: t("uninstallAnyway")
				})] }),
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "pcm-modal-body",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pcm-risk pcm-risk-community",
						children: smartUninstallRisk.report
					})
				})
			}),
			publishOpen && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PublishModal, {
				t,
				onClose: () => setPublishOpen(false)
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(TaskPanel, {
				t,
				records: tasks,
				open: tasksOpen,
				anchor: tasksAnchorRef.current,
				onClose: () => setTasksOpen(false),
				onClearSettled: () => setTasks(clearSettledTasks),
				onDismiss: (id) => setTasks((list) => dismissTask(list, id)),
				onCancelTask: (id) => {
					fetch("/dsh-store/cancel", {
						method: "POST",
						headers: { "content-type": "application/json" },
						body: JSON.stringify({ id })
					}).then((res) => res.json()).then((body) => {
						if (body.ok === true) setToast(t("taskCancelled") + "…");
						else setToast(t("updateFailed") + ": " + (body.error ?? ""));
					}).catch(() => setToast(t("updateFailed")));
				}
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
	const target = entry.npmLinked === false ? "github:" + entry.owner + "/" + entry.name : entry.npm ?? "github:" + entry.owner + "/" + entry.name;
	const riskClass = entry.curated ? "pcm-risk pcm-risk-curated" : entry.isPlugin === true ? "pcm-risk pcm-risk-community" : "pcm-risk pcm-risk-nonplugin";
	const riskText = entry.curated ? t("riskCurated") : entry.isPlugin === true ? t("riskCommunity") : t("riskNonplugin");
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
		open: true,
		onClose: props.onClose,
		title: t("installTitle").replace("{0}", entry.owner + "/" + entry.name),
		description: entry.description,
		footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
				variant: "ghost",
				onClick: props.onClose,
				children: t("cancel")
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "pcm-smart-install-btn",
				onClick: props.onSmartInstall,
				disabled: installing,
				title: t("smartInstallHint"),
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "pcm-smart-star",
					children: "✦"
				}), installing ? t("smartSearching") : t("smartInstall")]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				className: "pcm-install-plain-btn",
				onClick: props.onConfirm,
				disabled: installing,
				children: installing ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "pcm-spin",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, { size: 14 })
				}) : t("confirm")
			})
		] }),
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
function UpdateModal(props) {
	const { t, entry, upd, busy, statusLine } = props;
	const target = entry.npmLinked === false ? "github:" + entry.owner + "/" + entry.name : entry.npm ?? "github:" + entry.owner + "/" + entry.name;
	const riskClass = entry.curated ? "pcm-risk pcm-risk-curated" : entry.isPlugin === true ? "pcm-risk pcm-risk-community" : "pcm-risk pcm-risk-nonplugin";
	const riskText = entry.curated ? t("riskCurated") : entry.isPlugin === true ? t("riskCommunity") : t("riskNonplugin");
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
		open: true,
		onClose: props.onClose,
		title: t("updateTitle").replace("{0}", entry.owner + "/" + entry.name),
		description: entry.description,
		footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
				variant: "ghost",
				onClick: props.onClose,
				children: t("cancel")
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "pcm-smart-install-btn",
				onClick: props.onSmartUpdate,
				disabled: busy,
				title: t("smartUpdateHint"),
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "pcm-smart-star",
					children: "✦"
				}), busy ? t("smartSearching") : t("smartUpdate")]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				className: "pcm-install-plain-btn",
				onClick: props.onConfirm,
				disabled: busy,
				children: busy ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "pcm-spin",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, { size: 14 })
				}) : t("updateBtn")
			})
		] }),
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: "pcm-modal-body",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { children: t("updateFrom").replace("{0}", entry.url) }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { children: t("updateRange").replace("{0}", upd.from).replace("{1}", upd.to) }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: riskClass,
					children: riskText
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "pcm-cmd",
					children: t("updateVia").replace("{0}", target + "@latest")
				}),
				busy && statusLine !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "pcm-cmd",
					children: statusLine
				})
			]
		})
	});
}
function LocalUninstallModal(props) {
	const { t, entry } = props;
	const [checked, setChecked] = (0, react.useState)(false);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
		open: true,
		onClose: props.onClose,
		title: t("localUninstallTitle").replace("{0}", entry.name),
		description: t("localUninstallDesc"),
		footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
			variant: "ghost",
			onClick: props.onClose,
			children: t("cancel")
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
			variant: "primary",
			disabled: !checked,
			onClick: props.onConfirm,
			children: t("uninstall")
		})] }),
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: "pcm-modal-body",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "pcm-risk pcm-risk-nonplugin",
					children: t("localUninstallWarn")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "pcm-cmd",
					children: entry.name
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
					style: {
						display: "flex",
						gap: 8,
						alignItems: "center",
						fontSize: 13,
						cursor: "pointer"
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked,
						onChange: (e) => setChecked(e.target.checked)
					}), t("localUninstallCheck")]
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
//#region src/client/SettingsWindow.tsx
/**
* DSH 商店设置页（v1.7.1）：作为官方「设置」浮窗里的一个 section 渲染
* （不再是独立浮窗）。内容：
* - 顶部大按钮「打开 DSH 商店」：打开独立商店浮窗；
* - 自动一键更新插件开关（说明 + 风险警告 + 上次运行结果）；
* - 数据源 URL / GitHub Token / 商店自身更新（设置功能载体）。
*/
function formatTime(iso) {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return iso;
	return d.toLocaleString();
}
function SettingsContent(props) {
	const t = props.t;
	const [auto, setAuto] = (0, react.useState)(null);
	const [autoBusy, setAutoBusy] = (0, react.useState)(false);
	const [status, setStatus] = (0, react.useState)(null);
	const [token, setToken] = (0, react.useState)("");
	const [tokenSaving, setTokenSaving] = (0, react.useState)(false);
	const [tokenSaved, setTokenSaved] = (0, react.useState)(false);
	const [source, setSource] = (0, react.useState)("");
	const [sourceSaving, setSourceSaving] = (0, react.useState)(false);
	const [sourceSaved, setSourceSaved] = (0, react.useState)(false);
	const [selfBusy, setSelfBusy] = (0, react.useState)(false);
	const [selfDone, setSelfDone] = (0, react.useState)(false);
	(0, react.useEffect)(() => {
		fetch("/dsh-store/status", { cache: "no-store" }).then((res) => res.json()).then((body) => {
			setStatus(body);
			setSource(body.registryUrl ?? "");
		}).catch(() => {});
		fetch("/dsh-store/auto-update", { cache: "no-store" }).then((res) => res.json()).then((body) => {
			if (body.autoUpdate !== void 0) setAuto(body.autoUpdate);
		}).catch(() => {});
	}, []);
	const toggleAuto = () => {
		if (auto === null || autoBusy) return;
		const next = !auto.enabled;
		setAutoBusy(true);
		fetch("/dsh-store/auto-update", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ enabled: next })
		}).then((res) => res.json()).then((body) => {
			if (body.autoUpdate !== void 0) setAuto(body.autoUpdate);
		}).catch(() => {}).finally(() => setAutoBusy(false));
	};
	const saveToken = () => {
		if (token.trim() === "" || tokenSaving) return;
		setTokenSaving(true);
		fetch("/dsh-store/token", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ token: token.trim() })
		}).then((res) => res.json()).then((body) => {
			if (body.ok === true) {
				setTokenSaved(true);
				setToken("");
			}
		}).catch(() => {}).finally(() => setTokenSaving(false));
	};
	const saveSource = () => {
		if (sourceSaving) return;
		setSourceSaving(true);
		fetch("/dsh-store/source", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ url: source.trim() })
		}).then((res) => res.json()).then((body) => {
			if (body.ok === true) {
				setStatus((s) => s === null ? null : {
					...s,
					registryUrl: body.registryUrl ?? ""
				});
				setSourceSaved(true);
			}
		}).catch(() => {}).finally(() => setSourceSaving(false));
	};
	const doSelfUpdate = () => {
		if (selfBusy || status?.selfUpdate?.to == null) return;
		setSelfBusy(true);
		fetch("/dsh-store/self-update", { method: "POST" }).then((res) => res.json()).then((body) => {
			if (body.ok === true) setSelfDone(true);
		}).catch(() => {}).finally(() => setSelfBusy(false));
	};
	const lastRun = auto === null ? "" : auto.lastRunAt === null ? t("autoUpdateNever") : t("autoUpdateLastRun").replace("{0}", formatTime(auto.lastRunAt)).replace("{1}", auto.lastMessage ?? "");
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "pcm-settings-body",
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "pcm-settings-open-store",
				onClick: props.onOpenStore,
				children: [t("openStoreBtn"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "pcm-settings-open-store-hint",
					children: t("openStoreHint")
				})]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "pcm-settings-sec",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pcm-auto-row",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "pcm-auto-label",
							children: t("autoUpdateTitle")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: "pcm-auto-switch",
							title: t("autoUpdateTitle"),
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: auto?.enabled === true,
								disabled: auto === null || autoBusy,
								onChange: toggleAuto
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: "pcm-auto-track" })]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pcm-settings-sec-desc",
						children: t("autoUpdateDesc")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pcm-settings-warn",
						children: t("autoUpdateWarn")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pcm-settings-note",
						children: auto?.enabled === true ? t("autoUpdateOn") + " · " + lastRun : t("autoUpdateOff")
					})
				]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "pcm-settings-sec",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pcm-settings-sec-title",
						children: t("settingsSource")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
						autoComplete: "off",
						value: source,
						placeholder: t("sourcePlaceholder"),
						onChange: (e) => setSource(e.target.value)
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
							disabled: sourceSaving,
							onClick: saveSource,
							children: t("sourceSave")
						}), sourceSaved && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							style: {
								fontSize: 12,
								color: "#22c55e"
							},
							children: t("sourceSaved")
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pcm-settings-note",
						children: t("sourceHint")
					})
				]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "pcm-settings-sec",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pcm-settings-sec-title",
						children: t("settingsToken")
					}),
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
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "primary",
								size: "sm",
								disabled: tokenSaving || token.trim() === "",
								onClick: saveToken,
								children: t("tokenSave")
							}),
							tokenSaved && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								style: {
									fontSize: 12,
									color: "#22c55e"
								},
								children: t("tokenSaved")
							}),
							status?.tokenConfigured === true && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "pcm-token-badge",
								children: t("tokenConfigured")
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pcm-settings-note",
						children: t("tokenHint")
					})
				]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "pcm-settings-sec",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pcm-settings-sec-title",
						children: t("settingsSelfUpdate")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pcm-settings-note",
						children: t("versionHint").replace("{0}", status?.version ?? "")
					}),
					status?.selfUpdate?.to != null && !selfDone && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "outline",
						size: "sm",
						disabled: selfBusy,
						onClick: doSelfUpdate,
						children: selfBusy ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "pcm-spin",
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, { size: 14 })
						}) : t("selfUpdateBtn").replace("{0}", status.selfUpdate.from).replace("{1}", status.selfUpdate.to)
					}),
					selfDone && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pcm-settings-note",
						children: t("selfUpdateDone") + " " + t("restartNeeded")
					})
				]
			})
		]
	});
}
//#endregion
//#region src/client/StoreWindow.tsx
/**
* 独立浮窗入口 + find 工具结果浮窗。
* - SidebarStoreButton: sidebar 底部「DSH 商店」按钮 → 全尺寸商店浮窗。
* - StoreResultsLauncher: 全局点击拦截（/dsh-store/open-results 链接，
*   由 find_dsh_store_plugin 工具输出）→ 打开「推荐 + 其他相关」结果浮窗，
*   卡片样式与商店主页面一致（安装/源码/收藏星可用）。
*/
let storeState = {
	mounted: false,
	open: false,
	source: null,
	settingsOnTop: false
};
const storeListeners = /* @__PURE__ */ new Set();
function emitStore() {
	for (const l of storeListeners) l();
}
function openStoreFrom(source) {
	storeState = {
		mounted: true,
		open: true,
		source,
		settingsOnTop: false
	};
	emitStore();
}
function setStoreOpen(open) {
	storeState = {
		...storeState,
		open
	};
	emitStore();
}
function setSettingsOnTop(onTop) {
	storeState = {
		...storeState,
		settingsOnTop: onTop
	};
	emitStore();
}
function getStoreState() {
	return storeState;
}
function subscribeStore(fn) {
	storeListeners.add(fn);
	return () => {
		storeListeners.delete(fn);
	};
}
/** 打开官方设置浮窗并自动定位到「DSH商店-设置」section（DOM 触发）。 */
function openSettingsAtStoreSection() {
	window.setTimeout(() => {
		Array.from(document.querySelectorAll("button")).find((b) => (b.textContent ?? "").trim() === "设置")?.click();
		let tries = 0;
		const timer = window.setInterval(() => {
			tries += 1;
			const nav = Array.from(document.querySelectorAll("button")).find((b) => (b.textContent ?? "").includes("DSH商店"));
			if (nav !== void 0) {
				nav.click();
				window.clearInterval(timer);
			} else if (tries > 25) window.clearInterval(timer);
		}, 200);
	}, 80);
}
/** 关闭官方设置浮窗（.VOzbGW_close）。 */
function closeSettingsWindow() {
	const close = document.querySelector(".VOzbGW_close");
	if (close !== null) close.click();
}
/** 唯一商店浮窗宿主：订阅 store 状态，渲染同一个 StoreWindow 实例。 */
function StoreSingleton(props) {
	const state = (0, react.useSyncExternalStore)(subscribeStore, () => storeState);
	if (!state.mounted) return null;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(StoreWindow, {
		t: props.t,
		locale: props.locale,
		open: state.open,
		settingsOnTop: state.settingsOnTop,
		onClose: () => setStoreOpen(false)
	});
}
function SidebarStoreButton(props) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
		type: "button",
		className: "pcm-sidebar-btn" + (props.wide ? "" : " pcm-sidebar-rail"),
		title: props.t("nav"),
		onClick: () => openStoreFrom("sidebar"),
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
			className: "pcm-sidebar-icon",
			src: ICON_DATA,
			alt: "",
			width: 16,
			height: 16
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
			className: "pcm-sidebar-label",
			children: props.t("nav")
		})]
	});
}
/** 设置浮窗里的「DSH商店-设置」section：设置内容 + 顶部大按钮打开商店浮窗。 */
function SettingsSection(props) {
	const openStore = (0, react.useCallback)(() => {
		const st = getStoreState();
		if (st.mounted && st.source === "sidebar") {
			closeSettingsWindow();
			setSettingsOnTop(false);
			setStoreOpen(true);
		} else openStoreFrom("settings");
	}, []);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SettingsContent, {
		t: props.t,
		onOpenStore: openStore
	});
}
/** 全局点击拦截器：find 工具输出的按钮链接 → 结果浮窗；
*  也监听 window 事件 'dsh-store-open-results'（智能搜索直接带 payload 弹窗）。 */
function StoreResultsLauncher(props) {
	const [token, setToken] = (0, react.useState)(null);
	const [direct, setDirect] = (0, react.useState)(null);
	const onClick = (0, react.useCallback)((e) => {
		const anchor = e.target?.closest?.("a[href]");
		if (anchor === null) return;
		const href = anchor.getAttribute("href") ?? "";
		if (!href.includes("/dsh-store/open-results")) return;
		e.preventDefault();
		e.stopPropagation();
		const id = new URL(href, window.location.origin).searchParams.get("id");
		if (id !== null && id !== "") setToken(id);
	}, []);
	(0, react.useEffect)(() => {
		document.addEventListener("click", onClick, true);
		return () => document.removeEventListener("click", onClick, true);
	}, [onClick]);
	(0, react.useEffect)(() => {
		const onOpen = (e) => {
			const detail = e.detail;
			if (detail?.payload !== void 0 && detail.payload !== null) {
				setToken(null);
				setDirect(detail.payload);
			}
		};
		window.addEventListener("dsh-store-open-results", onOpen);
		return () => window.removeEventListener("dsh-store-open-results", onOpen);
	}, []);
	if (!(token !== null || direct !== null)) return null;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ResultsWindow, {
		t: props.t,
		locale: props.locale,
		token,
		initialPayload: direct,
		onClose: () => {
			setToken(null);
			setDirect(null);
		}
	});
}
/** v1.7.4：#9 结果浮窗内嵌完整 MarketSection（seed=推荐+相关条目）——
*  卡片内容/交互/功能与主商店浮窗完全一致（安装/卸载/更新/收藏/详情/任务）。 */
function ResultsWindow(props) {
	const headActionsRef = (0, react.useRef)(null);
	const [payload, setPayload] = (0, react.useState)(props.initialPayload);
	const [failed, setFailed] = (0, react.useState)(false);
	(0, react.useEffect)(() => {
		if (props.initialPayload !== null) {
			setPayload(props.initialPayload);
			setFailed(false);
		}
	}, [props.initialPayload]);
	const LANGS = [
		"en",
		"zh",
		"ja",
		"ko",
		"es",
		"fr",
		"de",
		"pt",
		"ru"
	];
	const LANG_LABELS = {
		en: "English",
		zh: "中文",
		ja: "日本語",
		ko: "한국어",
		es: "Español",
		fr: "Français",
		de: "Deutsch",
		pt: "Português",
		ru: "Русский"
	};
	const LANG_SHORT = {
		en: "EN",
		zh: "中文",
		ja: "日本語",
		ko: "한국어",
		es: "ES",
		fr: "FR",
		de: "DE",
		pt: "PT",
		ru: "RU"
	};
	const [lang, setLang] = (0, react.useState)(() => {
		try {
			const saved = localStorage.getItem("dsh-store-lang");
			if (saved !== null && LANGS.includes(saved)) return saved;
		} catch {}
		return "en";
	});
	const [langOpen, setLangOpen] = (0, react.useState)(false);
	const langItems = (0, react.useMemo)(() => LANGS.map((l) => ({
		id: l,
		label: LANG_LABELS[l] ?? l
	})), []);
	const setLangPersist = (l) => {
		setLang(l);
		try {
			localStorage.setItem("dsh-store-lang", l);
		} catch {}
	};
	const token = props.token;
	(0, react.useEffect)(() => {
		if (token === null || props.initialPayload !== null) return;
		let alive = true;
		fetch("/dsh-store/query-result?id=" + encodeURIComponent(token), { cache: "no-store" }).then((res) => res.json()).then((body) => {
			if (alive) if (body.payload !== void 0) setPayload(body.payload);
			else setFailed(true);
		}).catch(() => {
			if (alive) setFailed(true);
		});
		return () => {
			alive = false;
		};
	}, [token, props.initialPayload]);
	(0, react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key === "Escape") props.onClose();
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [props]);
	const t = props.t;
	return (0, react_dom.createPortal)(/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "pcm-store-overlay",
		style: { zIndex: 1200 },
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			className: "pcm-store-mask",
			onClick: props.onClose
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: "pcm-store-window pcm-results-window",
			role: "dialog",
			"aria-modal": "true",
			"aria-label": t("resultsTitle"),
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "pcm-store-head",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
						className: "pcm-sidebar-icon",
						src: ICON_DATA,
						alt: "",
						width: 16,
						height: 16
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: "pcm-store-head-title",
						children: [t("resultsTitle"), payload !== null ? " · " + payload.query : ""]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pcm-store-head-actions",
						ref: headActionsRef,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Menu, {
							open: langOpen,
							onClose: () => setLangOpen(false),
							onSelect: (id) => {
								setLangPersist(id);
								setLangOpen(false);
							},
							align: "end",
							anchor: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "pcm-lang-btn pcm-lang-btn-head" + (langOpen ? " pcm-lang-btn-open" : ""),
								onClick: () => setLangOpen((o) => !o),
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "pcm-lang-flag",
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconGlobeOutline14, { size: 12 })
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "pcm-lang-label",
										children: LANG_SHORT[lang] ?? lang.toUpperCase()
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "pcm-lang-caret",
										"aria-hidden": "true"
									})
								]
							}),
							items: langItems,
							selectedId: lang
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "ghost",
						size: "sm",
						icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutline16, { size: 14 }),
						onClick: props.onClose,
						className: "pcm-store-close",
						title: t("close")
					})
				]
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "pcm-store-body",
				children: [
					failed && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pcm-empty",
						children: t("resultsExpired")
					}),
					payload === null && !failed && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pcm-empty",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "pcm-spin",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, { size: 14 })
							}),
							" ",
							t("loading")
						]
					}),
					payload !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MarketSection, {
						t,
						locale: props.locale,
						floating: true,
						headRef: headActionsRef,
						langOverride: lang,
						seed: {
							plugins: [...payload.recommended, ...payload.related],
							categories: payload.categories ?? {}
						}
					})
				]
			})]
		})]
	}), document.body);
}
function StoreWindow(props) {
	const headActionsRef = (0, react.useRef)(null);
	(0, react.useEffect)(() => {
		if (!props.open) return;
		const onKey = (e) => {
			if (e.key === "Escape") props.onClose();
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [props.open, props]);
	const onHeadSettings = (0, react.useCallback)(() => {
		if (getStoreState().source === "settings") setStoreOpen(false);
		else {
			setSettingsOnTop(true);
			openSettingsAtStoreSection();
		}
	}, []);
	return (0, react_dom.createPortal)(/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "pcm-store-overlay",
		style: props.open ? { zIndex: props.settingsOnTop ? 900 : 1e3 } : { display: "none" },
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			className: "pcm-store-mask",
			onClick: props.onClose
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: "pcm-store-window",
			role: "dialog",
			"aria-label": props.t("nav"),
			"aria-modal": "true",
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "pcm-store-head",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
						className: "pcm-sidebar-icon",
						src: ICON_DATA,
						alt: "",
						width: 16,
						height: 16
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "pcm-store-head-title",
						children: props.t("nav")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pcm-store-head-actions",
						ref: headActionsRef
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "ghost",
						size: "sm",
						icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSettingsOutline16, { size: 15 }),
						onClick: onHeadSettings,
						className: "pcm-store-head-settings",
						title: props.t("settingsNav")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "ghost",
						size: "sm",
						icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutline16, { size: 14 }),
						onClick: props.onClose,
						className: "pcm-store-close",
						title: props.t("close")
					})
				]
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "pcm-store-body",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MarketSection, {
					t: props.t,
					locale: props.locale,
					floating: true,
					headRef: headActionsRef
				})
			})]
		})]
	}), document.body);
}
//#endregion
//#region src/client/styles.ts
/** Inline stylesheet: injected once with a data-plugin tag; hot reloads replace its content in place. */
const CSS = ".pcm-root{display:flex;flex-direction:column;gap:12px;padding:4px 0 0;box-sizing:border-box}.pcm-sticky-top{position:sticky;top:0;z-index:5;background:var(--dsw-alias-bg-base,#fff);padding:4px 2px 8px;display:flex;flex-direction:column;gap:10px;border-bottom:1px solid rgba(128,128,128,.18)}.pcm-brand-card{background:#040506;border-radius:16px;padding:14px 18px 12px;display:flex;flex-direction:column;gap:10px;}.pcm-brand-card .pcm-title{color:#f5f7ff;font-size:16px}.pcm-brand-card .pcm-subtitle{color:rgba(245,247,255,.85);font-size:12.5px;font-weight:500}.pcm-brand-card .pcm-source{color:rgba(245,247,255,.92);border-color:rgba(245,247,255,.45);opacity:1;font-weight:500}.pcm-brand-card .pcm-progress{color:rgba(245,247,255,.88);font-weight:500}.pcm-brand-card .pcm-divider{background:rgba(245,247,255,.35)}.pcm-brand-card .pcm-brand-btn{border-color:rgba(245,247,255,.55);color:#ffffff;background:rgba(245,247,255,.1);font-weight:500}.pcm-brand-card .pcm-brand-btn:hover{border-color:#4d6bfe;color:#fff}.pcm-publish-btn{border-color:#6d87ff;color:#eef2ff;background:rgba(77,107,254,.25);font-weight:600}.pcm-publish-btn:hover{background:rgba(77,107,254,.32);color:#fff}.pcm-version{font-size:11px;color:#8ea2d6;background:rgba(77,107,254,.18);border:1px solid rgba(77,107,254,.45);border-radius:999px;padding:1px 8px;line-height:16px;font-weight:500;letter-spacing:.2px}.pcm-token-badge{font-size:10.5px;color:#6ee7a0;background:rgba(52,211,153,.14);border:1px solid rgba(52,211,153,.4);border-radius:999px;padding:1px 8px;line-height:16px}.pcm-header{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.pcm-header-row2{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pcm-divider{width:1px;height:16px;background:rgba(128,128,128,.35);flex:none}.pcm-title{font-size:15px;font-weight:600;margin:0;flex:1 1 auto}.pcm-subtitle{font-size:12px;opacity:.7}.pcm-source{font-size:11px;padding:1px 7px;border-radius:999px;border:1px solid currentColor;opacity:.75;white-space:nowrap}.pcm-progress{font-size:12px;opacity:.75}.pcm-rate{font-size:12px;color:#d97706}.pcm-chips{display:flex;flex-wrap:wrap;gap:6px;position:relative}.pcm-chips>button{flex:none}.pcm-chips-clamped{overflow:visible}.pcm-chip-more-btn{position:absolute;right:0;bottom:0;z-index:2;background:var(--dsw-alias-bg-base,#fff);min-width:112px;justify-content:center}.pcm-card-local{border:1.5px dashed rgba(77,107,254,.55);background:rgba(77,107,254,.05)}.pcm-card-excluded{border:1.5px dashed rgba(220,38,38,.6);background:rgba(220,38,38,.04)}.pcm-card-excluded:hover{border-color:#dc2626}.pcm-badge-excluded{background:rgba(220,38,38,.12);color:#dc2626;font-weight:600}.pcm-badge-scanned{background:rgba(34,197,94,.12);color:#15803d;font-weight:600}.pcm-badge-scanfail{background:rgba(220,38,38,.1);color:#b91c1c}.pcm-badge-dormant{background:rgba(217,119,6,.12);color:#b45309}.pcm-toolbar .pcm-pill-scanned{border:1px solid rgba(34,197,94,.6) !important;color:#15803d !important;background:transparent !important;border-radius:8px !important;font-weight:600}.pcm-toolbar .pcm-pill-scanned:hover{border-color:#16a34a !important}.pcm-toolbar .pcm-pill-scanned-on{border-color:#16a34a !important;color:#fff !important;background:#16a34a !important}.pcm-toolbar .pcm-pill-recent{border:1px solid rgba(77,107,254,.6) !important;color:#4d6bfe !important;background:transparent !important;border-radius:8px !important;font-weight:600}.pcm-toolbar .pcm-pill-recent:hover{border-color:#4d6bfe !important}.pcm-toolbar .pcm-pill-recent-on{border-color:#4d6bfe !important;color:#fff !important;background:#4d6bfe !important}.pcm-excluded-note{font-size:11px;color:#dc2626;font-weight:600;padding:2px 6px;border:1px solid rgba(220,38,38,.5);border-radius:6px;white-space:nowrap}.pcm-toolbar .pcm-pill-blacklist{border:1px solid rgba(220,38,38,.6) !important;color:#dc2626 !important;background:transparent !important;border-radius:8px !important;font-weight:600}.pcm-toolbar .pcm-pill-blacklist:hover{border-color:#dc2626 !important}.pcm-toolbar .pcm-pill-blacklist-on{border-color:#dc2626 !important;color:#fff !important;background:#dc2626 !important}.pcm-card-local:hover{border-color:#4d6bfe}.pcm-badge-local{border:1px dashed rgba(77,107,254,.8);color:#4d6bfe;background:transparent}.pcm-count{font-size:10px;opacity:.68;margin-left:5px;background:rgba(128,128,128,.16);border-radius:999px;padding:0 5px;line-height:15px;display:inline-block;min-width:34px;text-align:center;box-sizing:border-box}.pcm-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.pcm-toolbar-search{display:none}.pcm-search-wrap{margin-left:auto;flex:1 1 160px;max-width:300px;display:flex;align-items:center;position:relative}.pcm-search-clear{position:absolute;right:5px;top:50%;transform:translateY(-50%);width:18px;height:18px;border-radius:50%;border:none;background:#040506;color:#fff;font-size:10px;line-height:1;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;z-index:2}.pcm-search-clear:hover{background:#1a1d22}.pcm-search-wrap .pcm-search input{padding-right:26px}.pcm-toolbar .pcm-search{width:100%;height:26px;box-sizing:border-box}.pcm-search input,.pcm-search > div,.pcm-search > span,.pcm-search [class]{border:none !important;box-shadow:none !important}.pcm-search{border:1px solid rgba(4,5,6,.7) !important;border-radius:8px !important;box-shadow:none !important;background:var(--dsw-alias-bg-base,#fff) !important}.pcm-search input{color:rgba(15,17,21,.92) !important;font-size:12px !important;font-weight:500;height:100%}.pcm-search input::placeholder{color:rgba(15,17,21,.5) !important}.pcm-search svg{color:#040506 !important;opacity:.85}.pcm-search{flex:1 1 auto;min-width:0}.pcm-sort-btn{border:1px solid rgba(128,128,128,.5);border-radius:8px;background:transparent;font-size:12px}.pcm-sort-btn:hover{border-color:#4d6bfe;color:#4d6bfe}.pcm-sort-btn::after{content:'⇅';opacity:.45;margin-left:4px}.pcm-uninstall-btn{background:transparent !important;color:#dc2626 !important;border:1px solid rgba(220,38,38,.55) !important;border-radius:8px !important;height:22px;padding:0 8px;font-size:11px;line-height:1;display:inline-flex;align-items:center;justify-content:center}.pcm-uninstall-btn:hover{border-color:#dc2626 !important;background:rgba(220,38,38,.08) !important;color:#dc2626 !important}.pcm-toolbar .pcm-pill-curated{border:1px solid rgba(4,5,6,.7) !important;color:#040506 !important;background:transparent !important;border-radius:8px !important;font-weight:600}.pcm-toolbar .pcm-pill-curated::before{content:'⚑';margin-right:4px;font-size:12px;opacity:.9}.pcm-toolbar .pcm-pill-curated:hover{border-color:#040506 !important}.pcm-toolbar .pcm-pill-curated-on{border-color:#040506 !important;color:#fff !important;background:#040506 !important}.pcm-toolbar .pcm-pill-curated-on::before{color:#fff}.pcm-toolbar .pcm-pill-curated-on:hover{background:#1a1d22 !important;border-color:#1a1d22 !important}.pcm-toolbar .pcm-pill-verified{border:1px solid rgba(4,5,6,.7) !important;color:#040506 !important;background:transparent !important;border-radius:8px !important;font-weight:600}.pcm-toolbar .pcm-pill-verified::before{content:'✓';margin-right:4px;font-size:11px;font-weight:700}.pcm-toolbar .pcm-pill-verified:hover{border-color:#040506 !important}.pcm-toolbar .pcm-pill-verified-on{border-color:#040506 !important;color:#fff !important;background:#040506 !important}.pcm-toolbar .pcm-pill-verified-on::before{color:#fff}.pcm-toolbar .pcm-pill-verified-on:hover{background:#1a1d22 !important;border-color:#1a1d22 !important}.pcm-toolbar .pcm-pill-installed{border:1px solid rgba(4,5,6,.7) !important;color:#040506 !important;background:transparent !important;border-radius:8px !important;font-weight:600}.pcm-toolbar .pcm-pill-installed::before{content:'';width:11px;height:11px;margin-right:4px;background:currentColor;-webkit-mask:url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3E%3Cpath fill=%27none%27 stroke=%27%23000%27 stroke-width=%271.8%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 d=%27M8 2v7M5 6l3 3 3-3M3 12.5h10%27/%3E%3C/svg%3E') center/contain no-repeat;mask:url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3E%3Cpath fill=%27none%27 stroke=%27%23000%27 stroke-width=%271.8%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 d=%27M8 2v7M5 6l3 3 3-3M3 12.5h10%27/%3E%3C/svg%3E') center/contain no-repeat}.pcm-toolbar .pcm-pill-installed:hover{border-color:#040506 !important}.pcm-toolbar .pcm-pill-installed-on{border-color:#040506 !important;color:#fff !important;background:#040506 !important}.pcm-toolbar .pcm-pill-installed-on::before{color:#fff}.pcm-toolbar .pcm-pill-installed-on:hover{background:#1a1d22 !important;border-color:#1a1d22 !important}.pcm-toolbar .pcm-pill-fav{border:1px solid rgba(4,5,6,.7) !important;color:#040506 !important;background:transparent !important;border-radius:8px !important;font-weight:600}.pcm-toolbar .pcm-pill-fav::before{content:'★';margin-right:4px;font-size:11px}.pcm-toolbar .pcm-pill-fav:hover{border-color:#040506 !important}.pcm-toolbar .pcm-pill-fav-on{border-color:#040506 !important;color:#fff !important;background:#040506 !important}.pcm-toolbar .pcm-pill-fav-on::before{color:#fff}.pcm-toolbar .pcm-pill-fav-on:hover{background:#1a1d22 !important;border-color:#1a1d22 !important}.pcm-fav-star{border:none;background:transparent;padding:2px;margin:0;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;line-height:0;flex:none;border-radius:4px}.pcm-fav-star:hover{opacity:.8}.pcm-fav-on{opacity:1}.pcm-sort-slot{position:absolute;top:0;right:0;z-index:2;background:var(--dsw-alias-bg-base,#fff);padding-left:8px;margin-right:8px;display:flex;align-items:center;gap:6px}.pcm-lang-wrap{margin-left:8px;margin-right:8px;display:inline-flex;align-items:center}.pcm-toolbar .pcm-lang-btn{margin-left:auto;margin-right:8px}.pcm-lang-select-wrap{display:inline-flex;align-items:center;gap:4px;border:1px solid rgba(4,5,6,.7);color:#040506;background:transparent;border-radius:0;font-weight:600;padding:3px 7px;font-size:12px;line-height:1}.pcm-lang-select{border:none;background:transparent;color:inherit;font-weight:600;font-size:12px;outline:none;cursor:pointer;appearance:none;-webkit-appearance:none;padding-right:10px;background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);background-position:calc(100% - 8px) 50%,calc(100% - 5px) 50%;background-size:3px 3px,3px 3px;background-repeat:no-repeat}.pcm-lang-btn{border:1px solid rgba(4,5,6,.7) !important;color:#040506 !important;background:transparent !important;border-radius:0 !important;font-weight:600;display:inline-flex;align-items:center;gap:5px;height:26px;padding:0 9px;font-size:12px;cursor:pointer;line-height:1}.pcm-lang-btn:hover{border-color:#040506 !important;background:#040506 !important;color:#fff !important}.pcm-lang-flag{font-size:12px;line-height:1}.pcm-lang-label{font-size:12px;line-height:1}.pcm-lang-caret{width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent;border-top:5px solid currentColor;margin-top:1px;flex:none}.pcm-lang-btn-open .pcm-lang-caret{border-top:none;border-bottom:5px solid currentColor;margin-top:-1px}.pcm-seg{display:inline-flex;border-radius:8px;overflow:hidden;border:1px solid rgba(128,128,128,.3)}.pcm-seg button{border:none;background:transparent;padding:4px 10px;font-size:12px;cursor:pointer;color:inherit}.pcm-seg button.on{background:#4f6ef7;color:#fff}.pcm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(440px,1fr));gap:10px}.pcm-card{border:1px solid rgba(128,128,128,.25);border-radius:10px;padding:8px 10px;display:flex;flex-direction:column;gap:6px;cursor:pointer}.pcm-card:hover{border-color:#4f6ef7}.pcm-card-top{display:flex;align-items:center;gap:8px}.pcm-card-title{display:flex;align-items:baseline;gap:6px;overflow:hidden;flex:1 1 auto;min-width:0}.pcm-av{width:22px;height:22px;border-radius:6px;flex:none;display:flex;align-items:center;justify-content:center;font-size:11px;color:#fff;font-weight:600;position:relative;overflow:hidden}.pcm-av-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit}.pcm-name{font-weight:600;font-size:12.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:none;max-width:60%}.pcm-owner{font-size:10.5px;opacity:.55;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}.pcm-desc{font-size:11.5px;opacity:.8;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:2.8em}.pcm-badges{display:flex;gap:4px;flex-wrap:wrap}.pcm-badge{font-size:10px;padding:0 6px;border-radius:999px;line-height:16px;white-space:nowrap}.pcm-badge-curated{background:rgba(34,197,94,.14);color:#22c55e}.pcm-badge-nonplugin{background:rgba(148,163,184,.16);opacity:.8}.pcm-badge-pending{background:rgba(217,119,6,.14);color:#d97706}.pcm-badge-installed{background:rgba(79,110,247,.16);color:#4f6ef7}.pcm-badge-plugin{background:rgba(79,110,247,.16);color:#4f6ef7}.pcm-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}.pcm-stats{display:flex;gap:8px;font-size:11px;align-items:center;flex-wrap:wrap;white-space:nowrap}.pcm-stars{display:inline-flex;align-items:center;gap:3px;background:rgba(245,158,11,.14);color:#b45309;border-radius:999px;padding:1px 8px;font-weight:700;font-size:12px;line-height:17px}.pcm-cat{border:1px solid rgba(15,17,21,.45);color:rgba(15,17,21,.85);background:transparent;border-radius:999px;padding:1px 7px;font-size:10px;line-height:15px;white-space:nowrap}.pcm-today{font-size:11px}.pcm-updated{font-size:10.5px;opacity:.7}.pcm-today-up{color:#15803d}.pcm-today-down{color:#b91c1c}.pcm-actions{display:flex;gap:6px;flex:none;align-items:center}.pcm-scroll{flex:1 1 auto;min-height:120px;overflow-y:auto;display:flex;flex-direction:column;gap:10px;padding-right:2px}.pcm-pager{flex:none;display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:8px 2px 6px;border-top:1px solid rgba(128,128,128,.18)}.pcm-page{min-width:26px;padding:3px 8px;border-radius:6px;font-size:12px;cursor:pointer;border:1px solid transparent;background:transparent;color:inherit}.pcm-page.on{border-color:#4f6ef7;color:#4f6ef7}.pcm-empty{text-align:center;padding:32px 0;opacity:.65}.pcm-modal-body{display:flex;flex-direction:column;gap:10px;font-size:13px}.pcm-risk{border-radius:8px;padding:8px 10px;font-size:12px;line-height:1.5}.pcm-risk-curated{background:rgba(34,197,94,.1);color:#16a34a}.pcm-risk-community{background:rgba(217,119,6,.1);color:#b45309}.pcm-risk-nonplugin{background:rgba(239,68,68,.1);color:#dc2626}.pcm-cmd{font-family:ui-monospace,monospace;font-size:12px;background:rgba(128,128,128,.12);border-radius:6px;padding:6px 8px;word-break:break-all}.pcm-publish-repos{max-height:200px;overflow:auto;display:flex;flex-direction:column;gap:4px;border:1px solid rgba(128,128,128,.25);border-radius:8px;padding:6px}.pcm-publish-repo{font-size:12px;padding:4px 8px;border-radius:6px;cursor:pointer}.pcm-publish-repo:hover{background:rgba(128,128,128,.12)}.pcm-spin{animation:pcm-spin 1s linear infinite;display:inline-flex}@keyframes pcm-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}.pcm-update-btn{background:#040506 !important;color:#fff !important;border-color:#040506 !important;border-radius:8px !important}.pcm-update-btn:hover{background:#1a1d22 !important;border-color:#1a1d22 !important;color:#fff !important}.pcm-update-btn:disabled{opacity:.75}.pcm-update-versions{font-size:10.5px;white-space:nowrap;display:inline-flex;align-items:center;gap:2px;color:#040506;font-weight:500}.pcm-update-arrow{color:#15803d;font-weight:700}.pcm-update-new{color:#15803d;font-weight:700}.pcm-source-btn{font-weight:500}.pcm-update-all-row{display:flex;justify-content:flex-end;margin-top:-2px}.pcm-update-all-btn{background:#fff;color:#040506;border:none;border-radius:8px;padding:5px 12px;font-size:12.5px;font-weight:600;cursor:pointer;line-height:16px}.pcm-update-all-btn:hover{background:#eef1ff}.pcm-update-all-btn:disabled{cursor:default;opacity:.85}.pcm-state-row{display:flex;align-items:center;gap:8px}.pcm-state-chip{font-size:10.5px;font-weight:600;padding:1px 8px;border-radius:4px;line-height:16px;white-space:nowrap}.pcm-state-live{color:#166534;background:#d9f99d}.pcm-state-disabled{color:#6b7280;background:rgba(128,128,128,.16)}.pcm-state-restart{color:#a16207;background:rgba(250,204,21,.3)}.pcm-switch{display:inline-flex;position:relative;cursor:pointer}.pcm-switch input{position:absolute;opacity:0;width:0;height:0}.pcm-switch-track{width:26px;height:15px;border-radius:999px;background:rgba(128,128,128,.3);transition:background .15s;position:relative;flex:none}.pcm-switch-track::after{content:'';position:absolute;top:2px;left:2px;width:11px;height:11px;border-radius:50%;background:#fff;transition:left .15s;box-shadow:0 1px 2px rgba(0,0,0,.3)}.pcm-switch input:checked + .pcm-switch-track{background:#040506}.pcm-switch input:checked + .pcm-switch-track::after{left:13px}.pcm-switch input:disabled + .pcm-switch-track{opacity:.5}.pcm-rollback-btn{color:#b45309 !important;border:1px solid rgba(217,119,6,.5) !important;border-radius:6px !important;font-size:11px;height:20px;padding:0 8px}.pcm-rollback-btn:hover{border-color:#d97706 !important;background:rgba(217,119,6,.08) !important}.pcm-skip-row{display:inline-flex;align-items:center;gap:4px;font-size:10.5px;opacity:.75;cursor:pointer;user-select:none}.pcm-skip-row input{accent-color:#040506;margin:0;cursor:pointer}.pcm-skip-row:hover{opacity:1}.pcm-self-update-btn{border:1px solid rgba(245,247,255,.55);color:#fff;background:rgba(245,247,255,.1);border-radius:8px;padding:4px 10px;font-size:12px;font-weight:600;cursor:pointer;line-height:16px;white-space:nowrap}.pcm-self-update-btn:hover{border-color:#4d6bfe;color:#fff}.pcm-self-update-btn:disabled{opacity:.75;cursor:default}.pcm-self-update-warn{color:#f87171;font-size:11.5px;font-weight:600}.pcm-safety-row{display:flex;gap:4px;flex-wrap:wrap;align-items:center}.pcm-safety-controls{display:inline-flex;align-items:center;gap:8px;margin-left:auto}.pcm-safety{font-size:9.5px;padding:1px 7px;border-radius:4px;line-height:15px;white-space:nowrap;font-weight:600;letter-spacing:.2px}.pcm-safety-verified{color:#15803d;background:linear-gradient(180deg,rgba(34,197,94,.18),rgba(34,197,94,.07));border:1px solid rgba(34,197,94,.5);box-shadow:inset 0 1px 0 rgba(255,255,255,.55),0 1px 2px rgba(34,197,94,.12)}.pcm-safety-disclosure{color:#1d4ed8;background:linear-gradient(180deg,rgba(37,99,235,.14),rgba(37,99,235,.05));border:1px solid rgba(37,99,235,.45);box-shadow:inset 0 1px 0 rgba(255,255,255,.55),0 1px 2px rgba(37,99,235,.12)}.pcm-safety-curated{color:#a62b21;background:linear-gradient(180deg,rgba(200,58,47,.16),rgba(200,58,47,.06));border:1px solid rgba(200,58,47,.5);box-shadow:inset 0 1px 0 rgba(255,255,255,.55),0 1px 2px rgba(200,58,47,.12)}.pcm-safety-manual{background:rgba(217,119,6,.1);color:#b45309;border:1px solid rgba(217,119,6,.35)}.pcm-safety-nonplugin{background:rgba(148,163,184,.14);color:#64748b;border:1px solid rgba(148,163,184,.4)}.pcm-detail-modal{width:min(980px,94vw) !important;max-width:94vw}.pcm-detail-scroll{max-height:78vh;overflow-y:auto}.pcm-detail{display:flex;align-items:flex-start;padding:16px 18px 18px}.pcm-detail-main{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:10px}.pcm-detail-side{flex:none;width:240px;margin-left:16px;display:flex;flex-direction:column;gap:10px}.pcm-detail-head{display:flex;align-items:center;gap:8px}.pcm-detail-titles{display:flex;flex-direction:column;min-width:0;flex:1 1 auto}.pcm-detail-name{font-weight:700;font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pcm-detail-owner{font-size:11px;opacity:.6}.pcm-detail-actions{display:flex;gap:6px;flex:none;margin-left:auto;align-items:center}.pcm-detail-desc{font-size:12.5px;opacity:.85;line-height:1.5}.pcm-detail-safety{display:flex;gap:4px;flex-wrap:wrap}.pcm-detail-readme{border:1px solid rgba(128,128,128,.22);border-radius:10px;padding:12px 14px;max-height:52vh;overflow-y:scroll}.pcm-detail-readme code{word-break:break-all}.pcm-detail-readme pre{overflow-x:auto;max-width:100%}.pcm-detail-readme-note{font-size:12px;opacity:.7;display:flex;align-items:center;gap:6px}.pcm-detail-md{font-size:12.5px;line-height:1.55;overflow-wrap:break-word}.pcm-detail-sec{border:1px solid rgba(128,128,128,.2);border-radius:10px;padding:10px 12px;display:flex;flex-direction:column;gap:6px}.pcm-detail-sec-title{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;opacity:.55}.pcm-detail-verline{display:flex;justify-content:space-between;gap:8px;font-size:11.5px}.pcm-detail-verlabel{opacity:.6}.pcm-detail-ver{font-family:ui-monospace,monospace;font-size:11px}.pcm-detail-ver-new{color:#15803d;font-weight:600}.pcm-detail-update-note{font-size:11.5px;font-weight:600}.pcm-detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px 10px}.pcm-detail-cell{display:flex;flex-direction:column;min-width:0}.pcm-detail-cellk{font-size:10px;opacity:.55}.pcm-detail-cellv{font-size:11.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pcm-detail-topics{display:flex;flex-wrap:wrap;gap:4px}.pcm-detail-topic{font-size:10px;background:rgba(128,128,128,.12);border-radius:999px;padding:1px 7px}.pcm-detail-cmdrow{display:flex;gap:6px;align-items:center}.pcm-detail-cmdrow .pcm-cmd{flex:1 1 auto;min-width:0}.pcm-detail-linkrow{display:flex;flex-direction:column;gap:2px}.pcm-detail-channels{display:flex;flex-direction:column;gap:3px;font-size:11px;opacity:.75;margin-top:6px}.pcm-detail-added{font-size:11px;opacity:.65;margin-top:6px}.pcm-detail-related{display:flex;align-items:center;gap:8px;width:100%;border:1px solid rgba(128,128,128,.25);border-radius:8px;background:transparent;padding:5px 8px;margin-bottom:6px;cursor:pointer;text-align:left}.pcm-detail-related:hover{border-color:#4d6bfe}.pcm-detail-link{font-size:11.5px;color:#4d6bfe}.pcm-detail-close{margin-left:2px}.pcm-store-overlay{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center}.pcm-store-mask{position:absolute;inset:0;background:rgba(15,17,21,.45);backdrop-filter:blur(6px)}.pcm-store-window{position:relative;width:min(1100px,96vw);height:min(860px,94vh);background:var(--dsw-alias-bg-base,#fff);border:1px solid rgba(128,128,128,.25);border-radius:16px;box-shadow:0 18px 60px rgba(0,0,0,.35);display:flex;flex-direction:column;overflow:hidden}.pcm-store-window .pcm-root{flex:1 1 auto;height:auto !important;max-height:none;overflow:hidden;display:flex}.pcm-store-window .pcm-sticky-top{position:relative}.pcm-store-head{flex:none;display:flex;align-items:center;gap:8px;padding:10px 16px 0}.pcm-store-head-title{font-size:13.5px;font-weight:700;flex:1 1 auto}.pcm-store-close{flex:none}.pcm-store-body{flex:1 1 auto;min-height:0;padding:0 16px 14px;display:flex;flex-direction:column}.pcm-store-body .pcm-root{height:100% !important;flex:1 1 auto;min-height:0}.pcm-results-body{padding-top:8px}.pcm-results-scroll{flex:1 1 auto;min-height:0;overflow-y:auto;display:flex;flex-direction:column;gap:10px}.pcm-results-sec-title{font-size:13px;font-weight:700;color:#040506;padding:2px 2px 0}.pcm-toast{position:absolute;top:8px;right:8px;background:rgba(15,17,21,.92);color:#fff;border-radius:8px;padding:6px 10px;font-size:11.5px;z-index:5;max-width:70%}.pcm-sidebar-btn{box-sizing:border-box;display:inline-flex;align-items:center;gap:8px;border:none;background:transparent;border-radius:8px;padding:0 10px 0 8px;cursor:pointer;font-size:14px;font-weight:400;color:var(--dsw-alias-label-primary);width:calc(100% + 14px);margin-left:-2px;height:42px;justify-content:flex-start}.pcm-sidebar-btn:hover{background:var(--dsw-alias-interactive-bg-hover)}.pcm-sidebar-icon{width:16px;height:16px;flex:none}.pcm-sidebar-rail{border-radius:50%;justify-content:center;gap:0;width:36px;height:36px;margin:8px 0 10px;padding:0}.pcm-sidebar-rail .pcm-sidebar-label{display:none}@media (max-width:760px){.pcm-detail{flex-direction:column}.pcm-detail-side{width:100%;margin-left:0;margin-top:10px}.pcm-detail-readme{max-height:none}}a[href*='/dsh-store/open-results']{display:inline-flex !important;align-items:center;justify-content:center;gap:6px;background:linear-gradient(135deg,#4d6bfe,#3a51c4) !important;color:#fff !important;font-size:15px !important;font-weight:700 !important;text-decoration:none !important;padding:11px 26px !important;border-radius:12px !important;box-shadow:0 4px 16px rgba(77,107,254,.4) !important;margin:10px 0 6px !important;line-height:1.25 !important;border:none !important;width:fit-content !important}a[href*='/dsh-store/open-results']::after{content:'›';font-size:18px;line-height:1;margin-left:4px}a[href*='/dsh-store/open-results']:hover{background:linear-gradient(135deg,#5c79ff,#4d6bfe) !important;box-shadow:0 6px 20px rgba(77,107,254,.55) !important}.pcm-tasks-btn{display:inline-flex;align-items:center;gap:6px;background:#fff;color:#040506;border:none;border-radius:8px;padding:5px 12px;font-size:12.5px;font-weight:600;cursor:pointer;line-height:16px}.pcm-tasks-btn:hover{background:#eef1ff}.pcm-tasks-count{background:#4d6bfe;color:#fff;border-radius:999px;font-size:10.5px;padding:0 6px;line-height:15px;font-weight:700}.pcm-tasks-pop{position:fixed;z-index:650;width:380px;max-width:92vw;background:var(--dsw-alias-bg-base,#fff);border:1px solid rgba(128,128,128,.3);border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.28);display:flex;flex-direction:column;overflow:hidden}.pcm-tasks-head{display:flex;align-items:center;gap:6px;padding:9px 12px;border-bottom:1px solid rgba(128,128,128,.18)}.pcm-tasks-head-title{font-size:13px;font-weight:700;flex:1 1 auto}.pcm-tasks-body{max-height:320px;overflow-y:auto;padding:8px 10px;display:flex;flex-direction:column;gap:6px}.pcm-tasks-empty{padding:14px 6px;text-align:center;font-size:12.5px;opacity:.85}.pcm-tasks-empty-hint{font-size:11.5px;opacity:.6;margin-top:4px}.pcm-task-row{display:flex;align-items:flex-start;gap:8px;padding:7px 6px;border-radius:8px;background:rgba(128,128,128,.06)}.pcm-task-icon{flex:none;width:16px;height:16px;display:flex;align-items:center;justify-content:center;margin-top:1px}.pcm-task-ok{color:#16a34a}.pcm-task-bad{color:#dc2626}.pcm-task-main{flex:1 1 auto;min-width:0}.pcm-task-top{display:flex;gap:6px;align-items:baseline;min-width:0}.pcm-task-verb{font-size:11px;font-weight:700;color:#4d6bfe;flex:none}.pcm-task-name{font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pcm-task-status{font-size:11.5px;opacity:.75;margin-top:2px;word-break:break-all}.pcm-task-x{flex:none;border:none;background:transparent;cursor:pointer;color:inherit;opacity:.45;font-size:13px;padding:2px;border-radius:4px}.pcm-task-cancel{flex:none;border:1px solid rgba(220,38,38,.55);background:transparent;color:#dc2626;cursor:pointer;font-size:11px;padding:1px 8px;border-radius:6px;line-height:16px}.pcm-task-cancel:hover{background:rgba(220,38,38,.08);border-color:#dc2626}.pcm-task-x:hover{opacity:1;background:rgba(128,128,128,.15)}.pcm-tasks-bar{height:5px;border-radius:999px;background:rgba(128,128,128,.2);overflow:hidden;margin:2px 0 4px}.pcm-tasks-bar-fill{height:100%;background:#4d6bfe;border-radius:999px;transition:width .3s}.pcm-tasks-agg{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:600;padding:4px 6px 0}.pcm-settings-window{width:min(560px,94vw);height:min(640px,92vh)}.pcm-settings-body{display:flex;flex-direction:column;gap:14px;padding:6px 2px 14px}.pcm-settings-open-store{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;width:100%;background:linear-gradient(135deg,#4d6bfe,#3a51c4);color:#fff;border:none;border-radius:14px;padding:16px 20px;font-size:16px;font-weight:700;cursor:pointer;box-shadow:0 6px 20px rgba(77,107,254,.4)}.pcm-settings-open-store:hover{background:linear-gradient(135deg,#5c79ff,#4d6bfe)}.pcm-settings-body input::placeholder{color:rgba(15,17,21,.55) !important}.pcm-settings-open-store-hint{font-size:12px;font-weight:500;opacity:.85}.pcm-settings-sec{display:flex;flex-direction:column;gap:8px}.pcm-settings-sec-title{font-size:13px;font-weight:700}.pcm-settings-sec-desc{font-size:12px;opacity:.78;line-height:1.55}.pcm-settings-warn{font-size:12px;line-height:1.55;color:#9a3412;background:rgba(249,115,22,.12);border:1px solid rgba(249,115,22,.4);border-radius:8px;padding:8px 10px}.pcm-settings-note{font-size:11.5px;opacity:.65;line-height:1.5}.pcm-auto-row{display:flex;align-items:center;gap:10px}.pcm-auto-label{flex:1 1 auto;font-size:13.5px;font-weight:700}.pcm-auto-switch{position:relative;flex:none;width:36px;height:20px}.pcm-auto-switch input{position:absolute;inset:0;opacity:0;cursor:pointer;margin:0}.pcm-auto-switch .pcm-auto-track{position:relative;display:block;width:36px;height:20px;border-radius:999px;background:rgba(128,128,128,.35);transition:background .2s}.pcm-auto-switch .pcm-auto-track::after{content:'';position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.3);transition:left .2s}.pcm-auto-switch input:checked + .pcm-auto-track{background:#4d6bfe}.pcm-auto-switch input:checked + .pcm-auto-track::after{left:18px}.pcm-smart-install-btn{position:relative;overflow:hidden;display:inline-flex;align-items:center;justify-content:center;gap:5px;background:#040506;color:#fff;border:none;border-radius:14px;padding:0 14px;height:28px;font-size:12.5px;font-weight:600;cursor:pointer;line-height:1}.pcm-smart-install-btn:hover{background:#1a1d22}.pcm-smart-install-btn:disabled{opacity:.75;cursor:default}.pcm-smart-install-btn::after{content:'';position:absolute;top:0;left:-40%;width:30%;height:100%;background:linear-gradient(105deg,transparent,rgba(255,255,255,.55),transparent);animation:pcm-shine 3.5s ease-in-out infinite}.pcm-smart-uninstall-btn{background:#dc2626}.pcm-smart-uninstall-btn:hover{background:#b91c1c}.pcm-uninstall-plain-btn{color:#dc2626 !important;border-color:#dc2626 !important}.pcm-uninstall-plain-btn:hover{background:rgba(220,38,38,.08)}.pcm-install-plain-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;background:#fff;color:#040506;border:1px solid #040506;border-radius:14px;padding:0 14px;height:28px;font-size:12.5px;font-weight:600;cursor:pointer;line-height:1}.pcm-install-plain-btn:hover{background:#f2f3f5}.pcm-install-plain-btn:disabled{opacity:.7;cursor:default}.pcm-store-head-settings{border-radius:50%;flex:none}.pcm-store-head-settings svg{color:#040506}.pcm-lang-flag{display:inline-flex;align-items:center;color:inherit}.pcm-lang-flag svg{color:currentColor}.pcm-results-window{width:min(920px,92vw);height:min(660px,88vh)}div[role='presentation']:has([class*='pcm-']){z-index:1300 !important}.pcm-switch-inline .pcm-state-chip{margin-left:4px;flex:none}.pcm-card{border:1px solid #040506}.pcm-card:hover{border-color:#4f6ef7}.pcm-brand-card .pcm-version{color:#fff;border:1px solid #fff;background:rgba(255,255,255,.08)}.pcm-store-overlay{z-index:1000}.pcm-tasks-pop{z-index:1100}.pcm-smart-search-btn{position:relative;overflow:hidden;display:inline-flex;align-items:center;gap:5px;background:#040506;color:#fff;border:none;border-radius:8px;padding:0 12px;height:26px;font-size:12px;font-weight:600;cursor:pointer;line-height:1;flex:none}.pcm-smart-search-btn:hover{background:#1a1d22}.pcm-smart-search-btn:disabled{opacity:.75;cursor:default}.pcm-smart-star{color:#fff;font-size:12px;line-height:1}.pcm-smart-search-btn::after{content:'';position:absolute;top:0;left:-40%;width:30%;height:100%;background:linear-gradient(105deg,transparent,rgba(255,255,255,.55),transparent);animation:pcm-shine 3.5s ease-in-out infinite}@keyframes pcm-shine{0%{left:-40%}12%{left:110%}100%{left:110%}}.pcm-stats2{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:11px;color:rgba(15,17,21,.72);font-weight:500;margin:1px 0}.pcm-stats2 .pcm-dl-30{color:#1d4ed8}.pcm-stats2 .pcm-dl-total{color:#0f766e}.pcm-seg{border:1px solid #040506;border-radius:8px;overflow:hidden}.pcm-seg button{border-right:1px solid rgba(4,5,6,.22)}.pcm-seg button:last-child{border-right:none}.pcm-seg button.on{background:#040506;color:#fff}.pcm-store-head-actions .pcm-lang-btn{border:1px solid rgba(4,5,6,.7) !important;border-radius:14px !important;background:transparent !important;color:#040506 !important;height:28px;font-size:12px;box-sizing:border-box}.pcm-store-head-actions .pcm-lang-btn:hover{background:rgba(4,5,6,.06) !important;color:#040506 !important}.pcm-sort-wrap{display:inline-flex;align-items:center}.pcm-sort-wrap .pcm-sort-btn{border:1px solid rgba(4,5,6,.7);border-radius:8px;color:#040506;background:transparent;font-weight:600}.pcm-pager{position:relative;z-index:3}.pcm-header-actions{display:flex;align-items:center;justify-content:flex-end;gap:6px;margin-left:auto;flex-wrap:wrap}.pcm-header-actions .pcm-tasks-btn{background:#040506;border:1px solid #fff;color:#fff;box-sizing:border-box}.pcm-header-actions .pcm-tasks-btn:hover{background:#1a1d22;border-color:#fff}.pcm-header-actions .pcm-tasks-count{background:#4d6bfe}.pcm-header-actions .pcm-self-update-warn{color:#fbbf24}.pcm-store-head-actions{flex:1 1 auto;display:flex;align-items:center;justify-content:flex-end;gap:8px;min-width:0}.pcm-store-head-actions .pcm-header-row2{gap:8px;flex-wrap:nowrap}.pcm-store-head-actions .pcm-subtitle{color:inherit;opacity:.75;font-size:11.5px;white-space:nowrap}.pcm-store-head-actions .pcm-source{color:#040506;border-color:rgba(4,5,6,.45);opacity:.8;font-size:10.5px;white-space:nowrap}.pcm-store-head-actions .pcm-brand-btn{border-color:rgba(4,5,6,.7);color:#040506;background:transparent;font-size:12px}.pcm-store-head-actions .pcm-brand-btn:hover{border-color:#4d6bfe;color:#4d6bfe}.pcm-downloads{color:#1d4ed8;background:rgba(77,107,254,.1);border-radius:999px;padding:0 6px;font-size:10.5px;font-weight:700;line-height:16px;white-space:nowrap}.pcm-installed-panel{background:rgba(4,5,6,.045);border:none;border-radius:10px;padding:8px 10px;margin-top:auto;display:flex;flex-direction:column;gap:7px}.pcm-installed-tag{color:rgba(4,5,6,.62) !important;border-color:rgba(4,5,6,.32) !important;opacity:1 !important;font-weight:500}.pcm-switch input:checked + .pcm-switch-track{background:#16a34a}.pcm-dl-none{color:rgba(15,17,21,.4)}.pcm-card button{font-size:13px}.pcm-source-btn{border-color:#040506 !important;color:#040506 !important}.pcm-installed-switches{display:flex;flex-direction:column;gap:6px}.pcm-installed-actions .pcm-uninstall-btn{background:#dc2626 !important;border-color:#dc2626 !important;color:#fff !important;height:28px !important;border-radius:14px !important;padding:0 14px !important;display:inline-flex;align-items:center;justify-content:center}.pcm-installed-actions .pcm-uninstall-btn:hover{background:#b91c1c !important;border-color:#b91c1c !important;color:#fff !important}.pcm-installed-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.pcm-vsep{width:1px;height:16px;background:rgba(4,5,6,.18);flex:none}.pcm-installed-actions .pcm-skip-row,.pcm-installed-actions .pcm-switch-inline{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;color:rgba(15,17,21,.85);cursor:pointer;height:28px}.pcm-installed-actions .pcm-skip-row input,.pcm-installed-actions .pcm-switch-inline input{margin:0}.pcm-switch-label{font-size:11.5px;font-weight:600;color:rgba(15,17,21,.85)}.pcm-switch-state{font-size:11px;opacity:.75;min-width:56px}.pcm-card-version{font-size:10.5px;color:rgba(15,17,21,.62);background:rgba(4,5,6,.06);border-radius:999px;padding:0 6px;line-height:15px;font-weight:500;white-space:nowrap}.pcm-installed-update{display:flex;align-items:center;justify-content:space-between;gap:8px}.pcm-installed-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pcm-av{border:1px solid #040506;box-sizing:border-box}.pcm-downloads-total{color:#0f766e;background:rgba(20,184,166,.12)}\\\\\\\\\\\\\\\"\\\\\\\\n\\\\\\\\nexport function injectStyles(): void {\\\\\\\\n  const existing = document.querySelector('style[data-plugin-css=\\\\\\\\\\\\\\\"dsh-store.pcm-icon{border-radius:6px;flex:none;box-shadow:0 0 0 1px rgba(245,247,255,.25)}\\\\\\\"\\\\n\\\\nexport function injectStyles(): void {\\\\n  const existing = document.querySelector('style[data-plugin-css=\\\\\\\"dsh-store\\\"\\n\\nexport function injectStyles(): void {\\n  const stale = document.querySelectorAll('style[data-plugin-css=\\\"dsh-store\"\n\nexport function injectStyles(): void {\n  const stale = document.querySelectorAll('style[data-plugin-css=\"dsh-store";
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
/** 防御：任一浮窗子组件崩溃只影响自身子树，绝不整树卸载（否则「浮窗消失且再也打不开」）。 */
var Guard = class extends react.Component {
	state = { failed: false };
	static getDerivedStateFromError() {
		return { failed: true };
	}
	componentDidCatch(error) {
		console.error("[dsh-store] component crashed (isolated):", error);
	}
	render() {
		return this.state.failed ? null : this.props.children;
	}
};
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
	ctx.effect(() => {
		const mount = document.createElement("div");
		mount.id = "dsh-store-launcher";
		document.body.appendChild(mount);
		const resultsRoot = (0, import_client.createRoot)(mount);
		resultsRoot.render((0, react.createElement)(Guard, null, (0, react.createElement)(StoreResultsLauncher, {
			t,
			locale: ctx.locale
		})));
		const storeMount = document.createElement("div");
		storeMount.id = "dsh-store-singleton";
		document.body.appendChild(storeMount);
		const storeRoot = (0, import_client.createRoot)(storeMount);
		storeRoot.render((0, react.createElement)(Guard, null, (0, react.createElement)(StoreSingleton, {
			t,
			locale: ctx.locale
		})));
		return () => {
			resultsRoot.unmount();
			storeRoot.unmount();
			mount.remove();
			storeMount.remove();
		};
	}, "dsh-store: results launcher + store singleton");
	ctx.slots.inject("settings.section", () => ctx.slots.register({
		name: "settings.section",
		id: "plugin-market",
		order: 45,
		label: () => t("settingsNav"),
		locale: NS,
		inject: () => ({ t })
	}, () => (0, react.createElement)(SettingsSection, {
		t,
		locale: ctx.locale
	})));
	ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({
		name: "sidebar.footer.action",
		id: "dsh-store",
		order: 10,
		locale: NS
	}, ((props) => (0, react.createElement)(SidebarStoreButton, {
		wide: props?.wide === true,
		t,
		locale: ctx.locale
	}))));
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
