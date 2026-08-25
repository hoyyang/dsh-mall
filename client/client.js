window.__ModuleLoader__.load({ id: "dsh-mall", factory: (require) => {
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
	nav: "DSH Mall",
	versionHint: "dsh-mall v{0}",
	title: "DSH Mall",
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
	sortDownloads: "npm Downloads (30d)",
	sortScore: "Practical score",
	downloadsHint: "npm downloads in the last 30 days",
	totalDownloadsHint: "Total npm downloads since 2019",
	downloads30Label: "30d downloads",
	totalDownloadsLabel: "total downloads",
	sortCreated: "Publish date",
	sortAsc: "Ascending ↑",
	sortDesc: "Descending ↓",
	favOnly: "Favorites",
	picksTitle: "Editor picks",
	recommendTitle: "For You",
	scannedChip: "Scanned",
	scannedHint: "Machine-verified installable (dsh.bundle found in the repo tree)",
	scannedBadge: "Scanned",
	scannedBadgeHint: "Machine scan passed: dsh.bundle found in the repo tree.",
	scanFailBadge: "Scan failed",
	scanFailHint: "Machine scan found no dsh.bundle in the repo tree — may not be installable as a plugin.",
	skillChip: "Skill",
	skillChipHint: "Repos containing SKILL.md (skill-type plugins)",
	skillBadge: "Skill",
	skillBadgeHint: "Contains SKILL.md — a skill-type repo.",
	scoreTitle: "Composite score",
	scoreTotalLabel: "Composite",
	scoreConfidence: "Confidence",
	scoreDimMaintain: "Maintain",
	scoreDimPractical: "Practical",
	scoreDimPopularity: "Popularity",
	scoreDimEase: "Ease",
	scoreDimSignal: "Signal",
	scoreWhyTitle: "Why recommended",
	scorePending: "n/a",
	scoreCardHint: "Five-dimension composite score (maintain/practical/popularity/ease/signal), weighted geometric mean × field confidence",
	readmeCmdsTitle: "README install commands",
	readmeCmdsFromSection: "from the README install section",
	readmeCmdsFromReadme: "from README",
	readmeCmdsNone: "No install command found in the README — use the one-click install above.",
	cardRadarHint: "Five-dimension practical score",
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
	emptyFiltered: "No results match the current filters or search.",
	clearFilters: "Clear filters",
	loading: "Loading catalog…",
	loadError: "Could not load the catalog. Showing the bundled snapshot.",
	indexDegraded: "Index update failed — showing cached data",
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
	detailCategory: "Category",
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
	resultsTitle: "DSH Mall results",
	resultsRecommended: "Recommended",
	resultsRelated: "Other related",
	resultsExpired: "Results expired — run /dsh-mall again.",
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
	selfUpdateBtn: "Update \"DSH Mall\" {0} → {1}",
	selfUpdateDone: "DSH Mall updated.",
	selfUpdateFailed: "DSH Mall update failed",
	restartNeeded: "Restart dsh to apply.",
	upToDate: "Up to date",
	whyNotEffective: "Why not effective yet?",
	whyNotEffectiveBody: "This plugin’s patch contains config or expressions — hot-mounting only supports plain inserts, so changes take effect after restarting dsh.",
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
	settingsNav: "DSH Mall - Settings",
	settingsTitle: "DSH Mall Settings",
	openStoreBtn: "Open DSH Mall",
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
	backTop: "Back to top",
	quizBadge: "PERSONAL PICKS",
	quizTitle: "Pick features, find your plugins",
	quizSub: "30 seconds — choose what you care about and the store picks plugins for you.",
	quizPicked: "Selected",
	quizSkip: "Skip",
	quizGo: "Show picks",
	recQuizCtaTitle: "Not sure what to install?",
	recQuizCtaSub: "Pick the features you care about — personalized picks in 30 seconds.",
	recQuizCtaBtn: "Pick features",
	recProfileChip: "Personalized from your {0}-day usage",
	recDaily: "Updated daily",
	picksWeekly: "Updated weekly",
	recRetakeQuiz: "Retake quiz",
	smartSearchEmpty: "Type your need in the search box first."
};
const zh = {
	nav: "DSH 商场",
	versionHint: "dsh-mall v{0}",
	title: "DSH 商场",
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
	sortDownloads: "近 30 天 npm 下载量",
	sortScore: "维度评分",
	downloadsHint: "近 30 天 npm 下载量",
	totalDownloadsHint: "npm 总下载量（2019 年至今累计）",
	downloads30Label: "近 30 天下载",
	totalDownloadsLabel: "总下载",
	sortCreated: "发布时间",
	sortAsc: "升序 ↑",
	sortDesc: "降序 ↓",
	favOnly: "已收藏",
	picksTitle: "编辑精选",
	recommendTitle: "为你推荐",
	scannedChip: "已扫描",
	scannedHint: "机器校验可安装（仓库树里找到 dsh.bundle）",
	scannedBadge: "已扫描",
	scannedBadgeHint: "机器扫描通过：仓库树里存在 dsh.bundle。",
	scanFailBadge: "未通过扫描",
	scanFailHint: "机器扫描未在仓库树里找到 dsh.bundle——可能无法作为插件安装。",
	skillChip: "含 skill",
	skillChipHint: "仓库含 SKILL.md 的技能型插件",
	skillBadge: "含 skill",
	skillBadgeHint: "仓库含 SKILL.md，技能型仓库。",
	scoreTitle: "综合评分",
	scoreTotalLabel: "综合分",
	scoreConfidence: "置信度",
	scoreDimMaintain: "维护",
	scoreDimPractical: "实用",
	scoreDimPopularity: "热度",
	scoreDimEase: "便捷",
	scoreDimSignal: "信号",
	scoreWhyTitle: "为什么推荐",
	scorePending: "待定",
	scoreCardHint: "综合五维评分（维护/实用/热度/便捷/信号），加权几何平均 × 字段置信度",
	readmeCmdsTitle: "README 安装命令",
	readmeCmdsFromSection: "来自 README 安装章节",
	readmeCmdsFromReadme: "来自 README 全文",
	readmeCmdsNone: "README 里没有解析到安装命令——请使用上方一键安装。",
	cardRadarHint: "五维实用评分",
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
	emptyFiltered: "没有符合当前筛选/搜索条件的结果。",
	clearFilters: "清除筛选",
	loading: "正在加载目录…",
	loadError: "目录加载失败，已回退内置快照。",
	indexDegraded: "索引更新失败——当前显示缓存数据",
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
	detailCategory: "分类",
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
	resultsTitle: "DSH 商场查询结果",
	resultsRecommended: "推荐的",
	resultsRelated: "其他相关的",
	resultsExpired: "结果已过期——请重新执行 /dsh-mall。",
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
	selfUpdateBtn: "更新「DSH 商场」 {0} → {1}",
	selfUpdateDone: "DSH 商场已更新。",
	selfUpdateFailed: "DSH 商场更新失败",
	restartNeeded: "需重启 dsh 生效。",
	upToDate: "已是最新",
	whyNotEffective: "为什么未生效？",
	whyNotEffectiveBody: "这个插件的 patch 里带了配置或表达式，热挂载只支持纯 insert——所以改动要重启 DSH 才会生效。",
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
	settingsNav: "DSH 商场-设置",
	settingsTitle: "DSH 商场设置",
	openStoreBtn: "打开 DSH 商场",
	openStoreHint: "浏览、搜索、安装与更新插件全量目录",
	autoUpdateTitle: "自动一键更新插件",
	autoUpdateDesc: "开启后，每天商场自动刷新到最新插件数据时，会自动一键更新全部可更新的插件。",
	autoUpdateWarn: "⚠ 很多插件的新版本可能不稳定，自动更新有风险，请谨慎开启。",
	autoUpdateNever: "还没有自动更新过",
	autoUpdateLastRun: "上次自动更新：{0} · {1}",
	autoUpdateOn: "已开启",
	autoUpdateOff: "已关闭",
	settingsSource: "数据源",
	settingsToken: "GitHub Token",
	settingsSelfUpdate: "商场自身更新",
	smartSearch: "智能搜索",
	smartSearchHint: "用你的主模型理解需求，从商场目录里挑出推荐插件。",
	smartSearching: "搜索中…",
	backTop: "回到顶部",
	quizBadge: "个性化推荐",
	quizTitle: "选功能，找到你的插件",
	quizSub: "30 秒选好你关心的功能，商场为你挑插件。",
	quizPicked: "已选",
	quizSkip: "跳过",
	quizGo: "看推荐",
	recQuizCtaTitle: "不知道装什么？",
	recQuizCtaSub: "30 秒选功能，给你个性化推荐。",
	recQuizCtaBtn: "选功能",
	recProfileChip: "根据你 {0} 天的使用习惯推荐",
	recDaily: "每日更新",
	picksWeekly: "每周更新",
	recRetakeQuiz: "重做问卷",
	smartSearchEmpty: "请先在搜索框里输入你的需求。"
};
const ja = {
	"nav": "DSH Mall",
	"versionHint": "dsh-mall v{0}",
	"title": "DSH Mall",
	"subtitle": "最も包括的なDeepSeek Harnessプラグインカタログ — スマート検索、スマートインストール/アップデート/アンインストール、組み込みのSkillsツール。",
	"refresh": "更新",
	"autoRefresh": "データベースを30分ごとに自動更新",
	"refreshing": "更新中…",
	"shardProgress": "{0} リポジトリを取得しました ({1}/{2} スライス)",
	"sourceCdn": "更新済み",
	"sourceLive": "更新済み",
	"sourceCache": "更新済み",
	"sourceSnapshot": "スナップショット · {0}",
	"updatedAt": "{0}前",
	"syncedAt": "同期: {0}",
	"all": "すべて",
	"expandCats": "{0}カテゴリを展開",
	"collapseCats": "折りたたむ",
	"searchPlaceholder": "名前 / オーナー / 説明を検索…",
	"searchClear": "検索をクリア",
	"sort": "並び替え",
	"sortDim": "基準",
	"sortDir": "方向",
	"sortStars": "スター数",
	"sortToday": "今日の+スター",
	"sortDownloads": "npmダウンロード数 (30日)",
	"sortScore": "実用スコア",
	"downloadsHint": "過去30日間のnpmダウンロード数",
	"totalDownloadsHint": "2019年からのnpm累計ダウンロード数",
	"downloads30Label": "30日間ダウンロード数",
	"totalDownloadsLabel": "累計ダウンロード数",
	"sortCreated": "公開日",
	"sortAsc": "昇順 ↑",
	"sortDesc": "降順 ↓",
	"favOnly": "お気に入り",
	"picksTitle": "編集部のおすすめ",
	"recommendTitle": "あなたへのおすすめ",
	"scannedChip": "スキャン済み",
	"scannedHint": "機械検証済みのインストール可能（リポジトリツリーにdsh.bundleを確認）",
	"scannedBadge": "スキャン済み",
	"scannedBadgeHint": "機械スキャン合格: リポジトリツリーにdsh.bundleが見つかりました。",
	"scanFailBadge": "スキャン失敗",
	"scanFailHint": "機械スキャンでリポジトリツリーにdsh.bundleが見つかりませんでした — プラグインとしてインストールできない可能性があります。",
	"skillChip": "スキル",
	"skillChipHint": "SKILL.mdを含むリポジトリ（スキル型プラグイン）",
	"skillBadge": "スキル",
	"skillBadgeHint": "SKILL.mdを含むスキル型リポジトリです。",
	"scoreTitle": "総合スコア",
	"scoreTotalLabel": "総合",
	"scoreConfidence": "信頼度",
	"scoreDimMaintain": "メンテナンス",
	"scoreDimPractical": "実用性",
	"scoreDimPopularity": "人気",
	"scoreDimEase": "簡単さ",
	"scoreDimSignal": "シグナル",
	"scoreWhyTitle": "おすすめ理由",
	"scorePending": "n/a",
	"scoreCardHint": "5次元総合スコア（メンテナンス/実用性/人気/簡単さ/シグナル）を加重幾何平均し、フィールド信頼度を乗じた値",
	"readmeCmdsTitle": "READMEのインストールコマンド",
	"readmeCmdsFromSection": "READMEのインストールセクションより",
	"readmeCmdsFromReadme": "READMEより",
	"readmeCmdsNone": "READMEにインストールコマンドが見つかりません — 上記のワンクリックインストールを使用してください。",
	"cardRadarHint": "5次元の実用スコア",
	"dormantBadge": "放置中",
	"dormantHint": "6か月以上プッシュがありません — 開発が放棄されている可能性があります。",
	"npmUnlinkedHint": "npmパッケージがこのリポジトリにリンクされていません — インストールすると別のパッケージに解決される可能性があります。",
	"favAdd": "お気に入りに追加",
	"langToggle": "言語",
	"kind": "種類",
	"kindAll": "すべてのリポジトリ",
	"kindPlugin": "プラグインのみ",
	"kindNonplugin": "プラグイン以外",
	"curatedOnly": "厳選のみ",
	"installedOnly": "インストール済み",
	"localBadge": "ローカル",
	"localOwner": "ローカルインストール",
	"catInstalled": "インストール済み（ローカル）",
	"since": "アクティブ",
	"sinceAll": "すべての期間",
	"sinceDay": "24時間",
	"sinceWeek": "7日間",
	"sinceMonth": "30日間",
	"sinceYear": "1年",
	"pageSize": "表示件数",
	"prevPage": "前へ",
	"nextPage": "次へ",
	"stars": "スター",
	"today": "今日",
	"todayGain": "今日",
	"todayGainHint": "ローカルの日次ベースラインに対する今日のスター増加数（1日分の履歴が必要）。",
	"publishAge": "公開からの経過",
	"publishAgeHint": "リポジトリ作成からの経過時間（インデックスに日付がない場合はnull）。",
	"published": "公開日",
	"updatedShort": "更新",
	"install": "インストール",
	"uninstall": "アンインストール",
	"installed": "インストール済み",
	"curatedBadge": "厳選",
	"pluginBadge": "プラグイン",
	"nonpluginBadge": "プラグイン以外",
	"pendingBadge": "未検証",
	"installTitle": "{0} をインストールしますか？",
	"installFrom": "ソース: {0}",
	"installVia": "インストール先: {0}",
	"riskCurated": "awesome-dsh-plugin でキュレーション済み — 検証済みリストで、ワンクリックインストールできます。",
	"riskCommunity": "コミュニティリポジトリです。プラグインはサードパーティコードのため、信頼できるソースだけをインストールしてください。",
	"riskNonplugin": "このリポジトリはdshプラグインではない可能性があります — インストールに失敗するか、何も実行されない可能性があります。",
	"confirm": "インストール",
	"cancel": "キャンセル",
	"installing": "{0} をインストール中…",
	"installDone": "インストールしました。有効にするにはページを更新してください。",
	"smartInstall": "スマートインストール",
	"smartInstallHint": "AIがリポジトリを審査してインストールし、結果を診断します。",
	"updateTitle": "{0} を更新しますか？",
	"updateFrom": "ソース: {0}",
	"updateVia": "更新先: {0}",
	"updateRange": "バージョン: {0} → {1}",
	"smartUpdate": "スマートアップデート",
	"smartUpdateHint": "AIがリポジトリを審査してプラグインを更新し、結果を診断します。",
	"smartRefused": "AIレビューがこのインストールを拒否しました",
	"installFailed": "インストールに失敗しました",
	"uninstallTitle": "{0} をアンインストールしますか？",
	"localUninstallTitle": "ローカルパッケージ {0} をアンインストールしますか？",
	"localUninstallDesc": "このパッケージはマーケットインデックスにありません — DSHホストまたは環境コンポーネントの可能性があります。",
	"localUninstallWarn": "ホストコンポーネントを削除するとDSHの機能が壊れる可能性があり、マーケットから復元できません。",
	"localUninstallCheck": "リスクを理解し、アンインストールします。",
	"uninstallDesc": "このプロファイルからパッケージとそのバンドル行を削除します。",
	"uninstalling": "{0} をアンインストール中…",
	"uninstallDone": "アンインストールしました。",
	"empty": "一致するリポジトリがありません。",
	"emptyFiltered": "現在のフィルターまたは検索に一致する結果がありません。",
	"clearFilters": "フィルターをクリア",
	"loading": "カタログを読み込み中…",
	"loadError": "カタログを読み込めませんでした。同梱のスナップショットを表示しています。",
	"indexDegraded": "インデックス更新に失敗 — キャッシュデータを表示中",
	"tokenConfigured": "GitHubトークン有効",
	"publish": "プラグインを公開",
	"publishHint": "GitHubリポジトリに dsh-plugin トピックを付けると、ストアがインデックスします — コードはアップロードされません。",
	"publishTitle": "プラグインをマーケットに公開",
	"publishDesc": "マーケットは dsh-plugin トピックが付いたすべてのGitHubリポジトリをインデックスします。タグを追加するだけで、GitHubの再インデックス後にリポジトリが表示されます（通常数分）。",
	"publishRepo": "owner/repo",
	"publishMyRepos": "自分のリポジトリ（トークン）",
	"publishCheck": "トピックを確認",
	"publishHasTopic": "このリポジトリには既に dsh-plugin トピックがあります — マーケットに表示されます。",
	"publishAdd": "dsh-plugin トピックを追加",
	"publishAdded": "トピックを追加しました！数分以内にマーケットに表示されます。",
	"publishNeedToken": "トピックを書き込むにはGitHubトークン（repoスコープ）が必要です。方法:",
	"publishManual": "リポジトリページの「About」の横にある歯車をクリックし、トピック「dsh-plugin」を追加してください。",
	"publishCopyGh": "ghコマンドをコピー",
	"publishCopied": "コピーしました",
	"verifyHint": "未検証リポジトリ: 必要に応じて package.json をチェックします。",
	"close": "閉じる",
	"openRepo": "GitHubで開く",
	"justNow": "たった今",
	"minsAgo": "{0}分前",
	"hoursAgo": "{0}時間前",
	"hoursMinsAgo": "{0}時間{1}分前",
	"daysAgo": "{0}日前",
	"monthsAgo": "{0}か月前",
	"yearsAgo": "{0}年前",
	"tokenField": "GitHubトークン（任意）",
	"tokenHint": "GitHub APIの制限を引き上げ（検索 10→30/分、コア 60→5000/時）、プラグイン検証バッチを有効にします。メモリ内のみに保持され、ディスクやログには書き込まれず、再起動で消去されます。",
	"tokenPlaceholder": "ghp_…（repoスコープで十分）",
	"sourcePlaceholder": "レジストリソースURL（任意、例: https://…/registry.json）",
	"sourceSave": "ソースを保存",
	"sourceSaved": "保存しました",
	"sourceCurrent": "現在のソース",
	"sourceHint": "registry.json 形式のカスタムマーケットデータソース。空にするとデフォルトのインデックス（hoyyang/dsh-market-index）を使用します。DSH_STORE_REGISTRY_URL 環境変数で維持されます。",
	"tokenSave": "保存",
	"tokenSaved": "このセッションの間トークンを保存しました。",
	"tokenMissingSettings": "設定 → プラグイン → プラグイン設定（dsh ≥ rc.7）、または cordis.yml / DSHM_GITHUB_TOKEN でトークンを設定してください。",
	"updateAllBtn": "プラグインを更新 ({0})",
	"updatingAll": "更新中…",
	"updateBtn": "更新",
	"updateDone": "更新が完了しました",
	"updateFailed": "更新に失敗しました",
	"updateHint": "新しいバージョンが利用可能です",
	"sourceBtn": "ソース",
	"verifiedBadge": "検証済み",
	"verifiedHintTitle": "検証済みインストール: {0}",
	"disclosureBadge": "開示済み",
	"manualInstall": "手動インストール",
	"detailVersion": "バージョン",
	"detailRepoVer": "リポジトリの package.json",
	"repoVersionHint": "GitHub Releases の最新",
	"detailNpmVer": "npm の最新",
	"detailInstalledVer": "インストール済み",
	"detailMeta": "メタデータ",
	"detailStars": "スター数",
	"detailCreated": "公開日",
	"detailLanguage": "言語",
	"detailCategory": "カテゴリ",
	"detailLicense": "ライセンス",
	"detailTopics": "トピック",
	"detailInstall": "インストール",
	"detailRelated": "関連プラグイン",
	"detailAdded": "追加日: {0}",
	"channelNpm": "npm: プリビルドパッケージ — dsh plugin add <pkg>",
	"channelTarball": "tarball: GitHub Release のプリビルド tgz（公開されている場合）",
	"channelSource": "source: dsh plugin add github:owner/repo",
	"detailCopy": "コマンドをコピー",
	"readmeLoading": "READMEを読み込み中…",
	"readmeFailed": "READMEを利用できません。",
	"verifiedReport": "検証レポート",
	"discCloud": "クラウド",
	"discCloudNone": "クラウドサービスなし",
	"discNetwork": "ネットワーク",
	"discNetNone": "ネットワークアクセスなし",
	"discOffline": "オフライン対応",
	"discApiKeys": "APIキー",
	"discJurisdiction": "管轄",
	"discRetention": "データ保持",
	"stateLive": "· 有効",
	"stateDisabled": "· 無効",
	"stateRestart": "· 再起動して適用",
	"resultsTitle": "DSH Mall の結果",
	"resultsRecommended": "おすすめ",
	"resultsRelated": "その他の関連",
	"resultsExpired": "結果の有効期限が切れました — /dsh-mall を再度実行してください。",
	"verifiedOnly": "検証済みのみ",
	"curatedBadgeTitle": "awesome-dsh-plugin に掲載",
	"verifiedBadgeHint": "検証済みインストール（qing3a/dsh-plugin-verify）",
	"descLoading": "…",
	"toggleHint": "このプラグインを有効/無効にする",
	"toggleDone": "切り替えました。プロファイルウォッチャーを通じて変更が適用されます。",
	"toggleFailed": "切り替えに失敗しました",
	"rollbackBtn": "前のバージョンにロールバック",
	"rollbackDone": "ロールバックしました。",
	"rollbackFailed": "ロールバックに失敗しました",
	"skipUpdate": "一括更新でスキップ",
	"skipHint": "「プラグインを更新」と自動更新の対象から除外されます — カードの更新ボタンは引き続き機能します。",
	"selfUpdateBtn": "「DSH Mall」を更新 {0} → {1}",
	"selfUpdateDone": "DSH Mall を更新しました。",
	"selfUpdateFailed": "DSH Mall の更新に失敗しました",
	"restartNeeded": "適用するには dsh を再起動してください。",
	"tasksBtn": "実行中のタスク",
	"tasksPanelTitle": "実行中のタスク",
	"tasksEmpty": "実行中のタスクはありません。",
	"tasksEmptyHint": "インストール、更新、アンインストールの進捗がここに表示されます。",
	"tasksClear": "完了したタスクをクリア",
	"tasksDismiss": "閉じる",
	"taskKindInstall": "インストール",
	"taskKindUpdate": "更新",
	"taskKindUninstall": "アンインストール",
	"taskKindRollback": "ロールバック",
	"cancelBtn": "キャンセル",
	"taskCancelled": "キャンセル済み",
	"taskKindSmartInstall": "スマートインストール",
	"taskKindSmartUninstall": "スマートアンインストール",
	"taskKindSmartUpdate": "スマートアップデート",
	"smartUninstall": "スマートアンインストール",
	"smartUninstallHint": "AIがアンインストール前にリスクを審査し、残存ファイルを削除します。",
	"smartUninstallReview": "アンインストール前のAIレビュー",
	"smartUninstallRefused": "AIレビューがこのアンインストールを拒否しました",
	"uninstallAnyway": "それでもアンインストール",
	"enableSwitch": "プラグインを有効化",
	"taskRunning": "実行中…",
	"taskDone": "完了",
	"taskFailed": "失敗",
	"tasksAggregate": "{0}/{1} 完了",
	"updateAllShort": "全プラグイン ({0})",
	"settingsNav": "DSH Mall - 設定",
	"settingsTitle": "DSH Mall 設定",
	"openStoreBtn": "DSH Mall を開く",
	"openStoreHint": "全カタログでプラグインの閲覧、検索、インストール、更新ができます。",
	"autoUpdateTitle": "プラグインを自動更新",
	"autoUpdateDesc": "オンにすると、ストアはカタログを毎日更新し、更新可能なすべてのプラグインに対して「すべて更新」を自動実行します。",
	"autoUpdateWarn": "⚠ プラグインの新バージョンは不安定な場合があります — 自動更新にはリスクが伴います。慎重に有効化してください。",
	"autoUpdateNever": "まだ実行されていません。",
	"autoUpdateLastRun": "最終自動更新: {0} · {1}",
	"autoUpdateOn": "オン",
	"autoUpdateOff": "オフ",
	"settingsSource": "データソース",
	"settingsToken": "GitHubトークン",
	"settingsSelfUpdate": "ストアの更新",
	"smartSearch": "スマート検索",
	"smartSearchHint": "メインモデルがニーズを理解し、ストアカタログから選びます。",
	"smartSearching": "検索中…",
	"backTop": "先頭に戻る",
	"quizBadge": "パーソナルおすすめ",
	"quizTitle": "機能を選んで、あなたのプラグインを見つけよう",
	"quizSub": "30秒 — 気になる機能を選ぶと、ストアがあなたに合ったプラグインを選びます。",
	"quizPicked": "選択済み",
	"quizSkip": "スキップ",
	"quizGo": "おすすめを表示",
	"recQuizCtaTitle": "何をインストールすればいいか分からない？",
	"recQuizCtaSub": "気になる機能を選ぶだけで、30秒でパーソナライズされたおすすめを表示します。",
	"recQuizCtaBtn": "機能を選ぶ",
	"recProfileChip": "あなたの{0}日間の利用に基づいてパーソナライズ",
	"recRetakeQuiz": "クイズをもう一度受ける",
	"smartSearchEmpty": "先に検索ボックスにニーズを入力してください。",
	"recDaily": "毎日更新"
};
const ko = {
	"nav": "DSH Mall",
	"versionHint": "dsh-mall v{0}",
	"title": "DSH Mall",
	"subtitle": "가장 완벽한 DeepSeek Harness 플러그인 카탈로그 — 스마트 검색, 스마트 설치/업데이트/제거, 내장 Skills 도구.",
	"refresh": "새로고침",
	"autoRefresh": "데이터베이스를 30분마다 자동 새로고침",
	"refreshing": "새로고침 중…",
	"shardProgress": "{0}개 리포지토리를 가져옴 ({1}/{2} 조각)",
	"sourceCdn": "업데이트됨",
	"sourceLive": "업데이트됨",
	"sourceCache": "업데이트됨",
	"sourceSnapshot": "스냅샷 · {0}",
	"updatedAt": "{0} 전",
	"syncedAt": "{0}에 동기화됨",
	"all": "전체",
	"expandCats": "카테고리 {0}개 펼치기",
	"collapseCats": "접기",
	"searchPlaceholder": "이름 / 소유자 / 설명 검색…",
	"searchClear": "검색 지우기",
	"sort": "정렬",
	"sortDim": "기준",
	"sortDir": "방향",
	"sortStars": "스타",
	"sortToday": "오늘 추가된 스타",
	"sortDownloads": "npm 다운로드 (30일)",
	"sortScore": "실용 점수",
	"downloadsHint": "지난 30일간 npm 다운로드 수",
	"totalDownloadsHint": "2019년 이후 총 npm 다운로드 수",
	"downloads30Label": "30일 다운로드",
	"totalDownloadsLabel": "총 다운로드",
	"sortCreated": "게시 날짜",
	"sortAsc": "오름차순 ↑",
	"sortDesc": "내림차순 ↓",
	"favOnly": "즐겨찾기",
	"picksTitle": "에디터 추천",
	"recommendTitle": "맞춤 추천",
	"scannedChip": "검사됨",
	"scannedHint": "기계 검증으로 설치 가능 (리포지토리 트리에서 dsh.bundle 발견됨)",
	"scannedBadge": "검사됨",
	"scannedBadgeHint": "기계 검사 통과: 리포지토리 트리에서 dsh.bundle을 찾았습니다.",
	"scanFailBadge": "검사 실패",
	"scanFailHint": "기계 검사에서 리포지토리 트리에 dsh.bundle이 없음 — 플러그인으로 설치하지 못할 수 있습니다.",
	"skillChip": "스킬",
	"skillChipHint": "SKILL.md를 포함한 리포지토리 (스킬형 플러그인)",
	"skillBadge": "스킬",
	"skillBadgeHint": "SKILL.md 포함 — 스킬형 리포지토리입니다.",
	"scoreTitle": "종합 점수",
	"scoreTotalLabel": "종합",
	"scoreConfidence": "신뢰도",
	"scoreDimMaintain": "유지보수",
	"scoreDimPractical": "실용성",
	"scoreDimPopularity": "인기도",
	"scoreDimEase": "사용 용이성",
	"scoreDimSignal": "신호",
	"scoreWhyTitle": "추천 이유",
	"scorePending": "해당 없음",
	"scoreCardHint": "5차원 종합 점수 (유지보수/실용성/인기도/사용 용이성/신호), 가중 기하 평균 × 필드 신뢰도",
	"readmeCmdsTitle": "README 설치 명령어",
	"readmeCmdsFromSection": "README 설치 섹션에서",
	"readmeCmdsFromReadme": "README에서",
	"readmeCmdsNone": "README에서 설치 명령어를 찾을 수 없습니다 — 위의 원클릭 설치를 사용하세요.",
	"cardRadarHint": "5차원 실용 점수",
	"dormantBadge": "방치됨",
	"dormantHint": "6개월 이상 푸시가 없음 — 관리가 중단되었을 수 있습니다.",
	"npmUnlinkedHint": "npm 패키지가 이 리포지토리로 연결되어 있지 않습니다 — 설치 시 다른 패키지로 해석될 수 있습니다.",
	"favAdd": "즐겨찾기에 추가",
	"langToggle": "언어",
	"kind": "종류",
	"kindAll": "모든 리포지토리",
	"kindPlugin": "플러그인만",
	"kindNonplugin": "비플러그인",
	"curatedOnly": "Awesome 큐레이션",
	"installedOnly": "설치됨",
	"localBadge": "로컬",
	"localOwner": "로컬 설치",
	"catInstalled": "설치됨 (로컬)",
	"since": "활동",
	"sinceAll": "모든 기간",
	"sinceDay": "24시간",
	"sinceWeek": "7일",
	"sinceMonth": "30일",
	"sinceYear": "1년",
	"pageSize": "페이지당 표시",
	"prevPage": "이전",
	"nextPage": "다음",
	"stars": "스타",
	"today": "오늘",
	"todayGain": "오늘",
	"todayGainHint": "오늘의 스타 증가량 (로컬 일일 기준선 대비, 하루 이상의 기록 필요).",
	"publishAge": "게시 기간",
	"publishAgeHint": "리포지토리가 생성된 이후 시간 (인덱스에 날짜가 없으면 null).",
	"published": "게시됨",
	"updatedShort": "업데이트됨",
	"install": "설치",
	"uninstall": "제거",
	"installed": "설치됨",
	"curatedBadge": "Awesome 큐레이션",
	"pluginBadge": "플러그인",
	"nonpluginBadge": "비플러그인",
	"pendingBadge": "미검증",
	"installTitle": "{0} 설치할까요?",
	"installFrom": "소스: {0}",
	"installVia": "설치 대상: {0}",
	"riskCurated": "awesome-dsh-plugin에 큐레이션됨 — 검증된 목록으로 원클릭 설치가 가능합니다.",
	"riskCommunity": "커뮤니티 리포지토리입니다. 플러그인은 서드파티 코드이므로 신뢰하는 소스만 설치하세요.",
	"riskNonplugin": "이 리포지토리는 dsh 플러그인이 아닐 수 있습니다 — 설치가 실패하거나 아무 효과가 없을 수 있습니다.",
	"confirm": "설치",
	"cancel": "취소",
	"installing": "{0} 설치 중…",
	"installDone": "설치되었습니다. 페이지를 새로고침하면 활성화됩니다.",
	"smartInstall": "스마트 설치",
	"smartInstallHint": "AI가 리포지토리를 검토하고 설치한 뒤 결과를 진단합니다.",
	"updateTitle": "{0} 업데이트할까요?",
	"updateFrom": "소스: {0}",
	"updateVia": "업데이트 대상: {0}",
	"updateRange": "버전: {0} → {1}",
	"smartUpdate": "스마트 업데이트",
	"smartUpdateHint": "AI가 리포지토리를 검토하고 플러그인을 업데이트한 뒤 결과를 진단합니다.",
	"smartRefused": "AI 검토가 이 설치를 거부했습니다",
	"installFailed": "설치 실패",
	"uninstallTitle": "{0} 제거할까요?",
	"localUninstallTitle": "로컬 패키지 {0}을(를) 제거할까요?",
	"localUninstallDesc": "이 패키지는 마켓 인덱스에 없습니다 — DSH 호스트 또는 환경 구성 요소일 수 있습니다.",
	"localUninstallWarn": "호스트 구성 요소를 제거하면 DSH 기능이 손상될 수 있으며 마켓에서 복원할 수 없습니다.",
	"localUninstallCheck": "위험을 이해했으며 제거하겠습니다.",
	"uninstallDesc": "이 프로필에서 패키지와 해당 번들 항목을 제거합니다.",
	"uninstalling": "{0} 제거 중…",
	"uninstallDone": "제거되었습니다.",
	"empty": "일치하는 리포지토리가 없습니다.",
	"emptyFiltered": "현재 필터나 검색에 해당하는 결과가 없습니다.",
	"clearFilters": "필터 지우기",
	"loading": "카탈로그 로딩 중…",
	"loadError": "카탈로그를 불러올 수 없습니다. 내장 스냅샷을 표시합니다.",
	"indexDegraded": "인덱스 업데이트 실패 — 캐시된 데이터 표시 중",
	"tokenConfigured": "GitHub 토큰 활성화됨",
	"publish": "내 플러그인 게시",
	"publishHint": "GitHub 리포지토리에 dsh-plugin 토픽을 태그하면 스토어가 인덱싱합니다 — 코드는 업로드되지 않습니다.",
	"publishTitle": "마켓에 플러그인 게시",
	"publishDesc": "마켓은 dsh-plugin으로 태그된 모든 GitHub 리포지토리를 인덱싱합니다. 태그만 추가하면 됩니다 — GitHub가 재인덱싱한 후(보통 수 분) 리포지토리가 나타납니다.",
	"publishRepo": "owner/repo",
	"publishMyRepos": "내 리포지토리 (토큰)",
	"publishCheck": "토픽 확인",
	"publishHasTopic": "이 리포지토리에는 이미 dsh-plugin 토픽이 있습니다 — 마켓에 표시됩니다.",
	"publishAdd": "dsh-plugin 토픽 추가",
	"publishAdded": "토픽이 추가되었습니다! 몇 분 내로 마켓에 나타납니다.",
	"publishNeedToken": "토픽을 작성하려면 GitHub 토큰(repo 범위)이 필요합니다. 옵션:",
	"publishManual": "리포지토리 페이지에서 \"정보\" 옆의 톱니바퀴를 클릭하고 \"dsh-plugin\" 토픽을 추가하세요.",
	"publishCopyGh": "gh 명령어 복사",
	"publishCopied": "복사됨",
	"verifyHint": "미검증 리포지토리: 요청 시 package.json을 확인합니다.",
	"close": "닫기",
	"openRepo": "GitHub에서 열기",
	"justNow": "방금 전",
	"minsAgo": "{0}분 전",
	"hoursAgo": "{0}시간 전",
	"hoursMinsAgo": "{0}시간 {1}분 전",
	"daysAgo": "{0}일 전",
	"monthsAgo": "{0}개월 전",
	"yearsAgo": "{0}년 전",
	"tokenField": "GitHub 토큰 (선택 사항)",
	"tokenHint": "GitHub API 한도를 높이고(검색 10→30/분, core 60→5000/시간) 플러그인 검증 배치를 활성화합니다. 메모리에만 저장되며 디스크나 로그에 기록되지 않고 재시작 시 지워집니다.",
	"tokenPlaceholder": "ghp_… (repo 범위면 충분합니다)",
	"sourcePlaceholder": "레지스트리 소스 URL (선택 사항, 예: https://…/registry.json)",
	"sourceSave": "소스 저장",
	"sourceSaved": "저장됨",
	"sourceCurrent": "현재 소스",
	"sourceHint": "registry.json 형식의 사용자 정의 마켓 데이터 소스입니다. 비워두면 기본 인덱스(hoyyang/dsh-market-index)를 사용합니다. DSH_STORE_REGISTRY_URL 환경 변수로 유지됩니다.",
	"tokenSave": "저장",
	"tokenSaved": "이 세션 동안 토큰이 저장되었습니다.",
	"tokenMissingSettings": "설정 → 플러그인 → 플러그인 구성(dsh ≥ rc.7)에서 또는 cordis.yml / DSHM_GITHUB_TOKEN을 통해 토큰을 설정하세요.",
	"updateAllBtn": "플러그인 업데이트 ({0})",
	"updatingAll": "업데이트 중…",
	"updateBtn": "업데이트",
	"updateDone": "업데이트 완료",
	"updateFailed": "업데이트 실패",
	"updateHint": "새 버전이 있습니다",
	"sourceBtn": "소스",
	"verifiedBadge": "검증됨",
	"verifiedHintTitle": "검증된 설치: {0}",
	"disclosureBadge": "공개됨",
	"manualInstall": "수동 설치",
	"detailVersion": "버전",
	"detailRepoVer": "리포지토리 package.json",
	"repoVersionHint": "GitHub 릴리스 최신",
	"detailNpmVer": "npm 최신",
	"detailInstalledVer": "설치된 버전",
	"detailMeta": "메타데이터",
	"detailStars": "스타",
	"detailCreated": "게시일",
	"detailLanguage": "언어",
	"detailCategory": "카테고리",
	"detailLicense": "라이선스",
	"detailTopics": "토픽",
	"detailInstall": "설치",
	"detailRelated": "관련 플러그인",
	"detailAdded": "{0} 추가됨",
	"channelNpm": "npm: 사전 빌드 패키지 — dsh plugin add <pkg>",
	"channelTarball": "tarball: GitHub 릴리스 사전 빌드 tgz (게시된 경우)",
	"channelSource": "source: dsh plugin add github:owner/repo",
	"detailCopy": "명령어 복사",
	"readmeLoading": "README 로딩 중…",
	"readmeFailed": "README를 사용할 수 없습니다.",
	"verifiedReport": "검증 보고서",
	"discCloud": "클라우드",
	"discCloudNone": "클라우드 서비스 없음",
	"discNetwork": "네트워크",
	"discNetNone": "네트워크 접근 없음",
	"discOffline": "오프라인 지원",
	"discApiKeys": "API 키",
	"discJurisdiction": "관할권",
	"discRetention": "데이터 보존",
	"stateLive": "· 활성",
	"stateDisabled": "· 비활성",
	"stateRestart": "· 적용하려면 재시작",
	"resultsTitle": "DSH Mall 결과",
	"resultsRecommended": "추천",
	"resultsRelated": "기타 관련",
	"resultsExpired": "결과가 만료되었습니다 — /dsh-mall를 다시 실행하세요.",
	"verifiedOnly": "검증됨",
	"curatedBadgeTitle": "awesome-dsh-plugin에 등재됨",
	"verifiedBadgeHint": "검증된 설치 (qing3a/dsh-plugin-verify)",
	"descLoading": "…",
	"toggleHint": "이 플러그인 활성화/비활성화",
	"toggleDone": "전환되었습니다. 변경 사항은 프로필 워처를 통해 적용됩니다.",
	"toggleFailed": "전환 실패",
	"rollbackBtn": "이전 버전으로 롤백",
	"rollbackDone": "롤백되었습니다.",
	"rollbackFailed": "롤백 실패",
	"skipUpdate": "모두 업데이트에서 제외",
	"skipHint": "\"플러그인 업데이트\" 및 자동 업데이트에서만 제외됩니다 — 카드의 업데이트 버튼은 여전히 동작합니다.",
	"selfUpdateBtn": "\"DSH Mall\" 업데이트 {0} → {1}",
	"selfUpdateDone": "DSH Mall가 업데이트되었습니다.",
	"selfUpdateFailed": "DSH Mall 업데이트 실패",
	"restartNeeded": "적용하려면 dsh를 재시작하세요.",
	"tasksBtn": "실행 중인 작업",
	"tasksPanelTitle": "실행 중인 작업",
	"tasksEmpty": "실행 중인 작업이 없습니다.",
	"tasksEmptyHint": "설치, 업데이트, 제거 진행 상황이 여기에 표시됩니다.",
	"tasksClear": "완료된 작업 지우기",
	"tasksDismiss": "닫기",
	"taskKindInstall": "설치",
	"taskKindUpdate": "업데이트",
	"taskKindUninstall": "제거",
	"taskKindRollback": "롤백",
	"cancelBtn": "취소",
	"taskCancelled": "취소됨",
	"taskKindSmartInstall": "스마트 설치",
	"taskKindSmartUninstall": "스마트 제거",
	"taskKindSmartUpdate": "스마트 업데이트",
	"smartUninstall": "스마트 제거",
	"smartUninstallHint": "AI가 제거 전 위험을 검토하고 잔여 파일을 정리합니다.",
	"smartUninstallReview": "제거 전 AI 검토",
	"smartUninstallRefused": "AI 검토가 이 제거를 거부했습니다",
	"uninstallAnyway": "그래도 제거",
	"enableSwitch": "플러그인 활성화",
	"taskRunning": "실행 중…",
	"taskDone": "완료",
	"taskFailed": "실패",
	"tasksAggregate": "{0}/{1} 완료",
	"updateAllShort": "모든 플러그인 ({0})",
	"settingsNav": "DSH Mall - 설정",
	"settingsTitle": "DSH Mall 설정",
	"openStoreBtn": "DSH Mall 열기",
	"openStoreHint": "전체 카탈로그에서 플러그인을 탐색, 검색, 설치, 업데이트할 수 있습니다.",
	"autoUpdateTitle": "플러그인 자동 업데이트",
	"autoUpdateDesc": "켜면 스토어가 매일 카탈로그를 새로고침한 뒤 업데이트 가능한 모든 플러그인에 모두 업데이트를 자동으로 실행합니다.",
	"autoUpdateWarn": "⚠ 새 플러그인 버전은 불안정할 수 있습니다 — 자동 업데이트에는 위험이 따릅니다. 주의해서 사용하세요.",
	"autoUpdateNever": "아직 실행되지 않았습니다.",
	"autoUpdateLastRun": "마지막 자동 업데이트: {0} · {1}",
	"autoUpdateOn": "켜짐",
	"autoUpdateOff": "꺼짐",
	"settingsSource": "데이터 소스",
	"settingsToken": "GitHub 토큰",
	"settingsSelfUpdate": "스토어 업데이트",
	"smartSearch": "스마트 검색",
	"smartSearchHint": "메인 모델이 요구를 이해하고 스토어 카탈로그에서 골라냅니다.",
	"smartSearching": "검색 중…",
	"backTop": "맨 위로",
	"quizBadge": "개인 맞춤 추천",
	"quizTitle": "기능을 고르면 플러그인을 찾아드립니다",
	"quizSub": "30초 — 관심 있는 항목을 고르면 스토어가 플러그인을 추천합니다.",
	"quizPicked": "선택됨",
	"quizSkip": "건너뛰기",
	"quizGo": "추천 보기",
	"recQuizCtaTitle": "무엇을 설치할지 모르겠나요?",
	"recQuizCtaSub": "관심 있는 기능을 고르세요 — 30초 안에 개인 맞춤 추천을 제공합니다.",
	"recQuizCtaBtn": "기능 고르기",
	"recProfileChip": "{0}일 사용 기록 기반 맞춤 설정",
	"recRetakeQuiz": "퀴즈 다시 풀기",
	"smartSearchEmpty": "먼저 검색창에 필요한 내용을 입력하세요.",
	"recDaily": "매일 업데이트됨"
};
const es = {
	"nav": "DSH Mall",
	"versionHint": "dsh-mall v{0}",
	"title": "DSH Mall",
	"subtitle": "El catálogo de plugins de DeepSeek Harness más completo: búsqueda inteligente, instalación/actualización/desinstalación inteligente y herramienta Skills integrada.",
	"refresh": "Actualizar",
	"autoRefresh": "actualizar base de datos automáticamente cada 30 min",
	"refreshing": "Actualizando…",
	"shardProgress": "Obtenidos {0} repos ({1}/{2} fragmentos)",
	"sourceCdn": "actualizado",
	"sourceLive": "actualizado",
	"sourceCache": "actualizado",
	"sourceSnapshot": "instantánea · {0}",
	"updatedAt": "hace {0}",
	"syncedAt": "sincronizado {0}",
	"all": "Todos",
	"expandCats": "Expandir {0} categorías",
	"collapseCats": "Contraer",
	"searchPlaceholder": "Buscar por nombre / propietario / descripción…",
	"searchClear": "Borrar búsqueda",
	"sort": "Ordenar",
	"sortDim": "Dimensión",
	"sortDir": "Dirección",
	"sortStars": "Estrellas",
	"sortToday": "+ estrellas hoy",
	"sortDownloads": "Descargas npm (30 días)",
	"sortScore": "Puntuación práctica",
	"downloadsHint": "Descargas npm en los últimos 30 días",
	"totalDownloadsHint": "Descargas totales de npm desde 2019",
	"downloads30Label": "Descargas en 30 días",
	"totalDownloadsLabel": "descargas totales",
	"sortCreated": "Fecha de publicación",
	"sortAsc": "Ascendente ↑",
	"sortDesc": "Descendente ↓",
	"favOnly": "Favoritos",
	"picksTitle": "Selecciones del editor",
	"recommendTitle": "Para ti",
	"scannedChip": "Escaneado",
	"scannedHint": "Instalable verificado automáticamente (se encontró dsh.bundle en el árbol del repositorio)",
	"scannedBadge": "Escaneado",
	"scannedBadgeHint": "Escaneo automático superado: se encontró dsh.bundle en el árbol del repositorio.",
	"scanFailBadge": "Escaneo fallido",
	"scanFailHint": "El escaneo automático no encontró dsh.bundle en el árbol del repositorio: es posible que no se pueda instalar como plugin.",
	"skillChip": "Skill",
	"skillChipHint": "Repos que contienen SKILL.md (plugins tipo skill)",
	"skillBadge": "Skill",
	"skillBadgeHint": "Contiene SKILL.md: repo tipo skill.",
	"scoreTitle": "Puntuación compuesta",
	"scoreTotalLabel": "Compuesta",
	"scoreConfidence": "Confianza",
	"scoreDimMaintain": "Mantenimiento",
	"scoreDimPractical": "Practicidad",
	"scoreDimPopularity": "Popularidad",
	"scoreDimEase": "Facilidad",
	"scoreDimSignal": "Señal",
	"scoreWhyTitle": "Por qué se recomienda",
	"scorePending": "n/d",
	"scoreCardHint": "Puntuación compuesta de cinco dimensiones (mantenimiento/practicidad/popularidad/facilidad/señal), media geométrica ponderada × confianza del campo",
	"readmeCmdsTitle": "Comandos de instalación del README",
	"readmeCmdsFromSection": "de la sección de instalación del README",
	"readmeCmdsFromReadme": "del README",
	"readmeCmdsNone": "No se encontró ningún comando de instalación en el README; usa la instalación con un clic de arriba.",
	"cardRadarHint": "Puntuación práctica de cinco dimensiones",
	"dormantBadge": "Inactivo",
	"dormantHint": "Sin commits en 6 o más meses: posiblemente abandonado.",
	"npmUnlinkedHint": "El paquete npm no enlaza con este repositorio; la instalación puede resolverse a un paquete distinto.",
	"favAdd": "Añadir a favoritos",
	"langToggle": "Idioma",
	"kind": "Tipo",
	"kindAll": "Todos los repos",
	"kindPlugin": "Solo plugins",
	"kindNonplugin": "No plugins",
	"curatedOnly": "Awesome Curated",
	"installedOnly": "Instalados",
	"localBadge": "local",
	"localOwner": "instalación local",
	"catInstalled": "Instalados (local)",
	"since": "Actividad",
	"sinceAll": "Cualquier momento",
	"sinceDay": "24 horas",
	"sinceWeek": "7 días",
	"sinceMonth": "30 días",
	"sinceYear": "1 año",
	"pageSize": "Por página",
	"prevPage": "Anterior",
	"nextPage": "Siguiente",
	"stars": "estrellas",
	"today": "hoy",
	"todayGain": "hoy",
	"todayGainHint": "Ganancia de estrellas de hoy frente a la base diaria local (necesita un día de historial).",
	"publishAge": "antigüedad de publicación",
	"publishAgeHint": "Tiempo desde que se creó el repositorio (nulo cuando el índice no tiene fecha).",
	"published": "publicado",
	"updatedShort": "actualizado",
	"install": "Instalar",
	"uninstall": "Desinstalar",
	"installed": "Instalado",
	"curatedBadge": "Awesome Curated",
	"pluginBadge": "plugin",
	"nonpluginBadge": "no plugin",
	"pendingBadge": "sin verificar",
	"installTitle": "¿Instalar {0}?",
	"installFrom": "Fuente: {0}",
	"installVia": "Destino de instalación: {0}",
	"riskCurated": "Curado en awesome-dsh-plugin: listado verificado, instala con un clic.",
	"riskCommunity": "Repositorio comunitario. Los plugins son código de terceros: instala solo fuentes en las que confíes.",
	"riskNonplugin": "Este repositorio puede NO ser un plugin dsh: la instalación puede fallar o no hacer nada.",
	"confirm": "Instalar",
	"cancel": "Cancelar",
	"installing": "Instalando {0}…",
	"installDone": "Instalado. Actualiza la página para activarlo.",
	"smartInstall": "Instalación inteligente",
	"smartInstallHint": "La IA revisa el repositorio, lo instala y diagnostica el resultado.",
	"updateTitle": "¿Actualizar {0}?",
	"updateFrom": "Fuente: {0}",
	"updateVia": "Destino de actualización: {0}",
	"updateRange": "Versión: {0} → {1}",
	"smartUpdate": "Actualización inteligente",
	"smartUpdateHint": "La IA revisa el repositorio, actualiza el plugin y diagnostica el resultado.",
	"smartRefused": "La revisión de IA rechazó esta instalación",
	"installFailed": "La instalación falló",
	"uninstallTitle": "¿Desinstalar {0}?",
	"localUninstallTitle": "¿Desinstalar el paquete local {0}?",
	"localUninstallDesc": "Este paquete no está en el índice del mercado; puede ser un componente del host o del entorno de DSH.",
	"localUninstallWarn": "Eliminar componentes del host puede romper funciones de DSH y no se pueden restaurar desde el mercado.",
	"localUninstallCheck": "Entiendo el riesgo y quiero desinstalarlo.",
	"uninstallDesc": "Elimina el paquete y su fila de bundle de este perfil.",
	"uninstalling": "Desinstalando {0}…",
	"uninstallDone": "Desinstalado.",
	"empty": "No hay repositorios que coincidan.",
	"emptyFiltered": "Ningún resultado coincide con los filtros o la búsqueda actuales.",
	"clearFilters": "Limpiar filtros",
	"loading": "Cargando catálogo…",
	"loadError": "No se pudo cargar el catálogo. Se muestra la instantánea incluida.",
	"indexDegraded": "La actualización del índice falló; se muestran datos en caché",
	"tokenConfigured": "Token de GitHub activo",
	"publish": "Publicar mi plugin",
	"publishHint": "Etiqueta tu repositorio de GitHub con el tema dsh-plugin y la tienda lo indexará; no se sube código.",
	"publishTitle": "Publicar un plugin en el mercado",
	"publishDesc": "El mercado indexa todos los repositorios de GitHub etiquetados con dsh-plugin. Con añadir la etiqueta basta: tu repositorio aparecerá después de que GitHub lo reindexe (normalmente en minutos).",
	"publishRepo": "owner/repo",
	"publishMyRepos": "Mis repos (token)",
	"publishCheck": "Comprobar tema",
	"publishHasTopic": "Este repositorio ya tiene el tema dsh-plugin; aparecerá en el mercado.",
	"publishAdd": "Añadir tema dsh-plugin",
	"publishAdded": "¡Tema añadido! Aparecerá en el mercado en unos minutos.",
	"publishNeedToken": "Se necesita un token de GitHub (alcance repo) para escribir temas. Opciones:",
	"publishManual": "En la página del repositorio, haz clic en el engranaje junto a «About» y añade el tema «dsh-plugin».",
	"publishCopyGh": "Copiar comando gh",
	"publishCopied": "Copiado",
	"verifyHint": "Repos sin verificar: comprobamos su package.json bajo demanda.",
	"close": "Cerrar",
	"openRepo": "Abrir en GitHub",
	"justNow": "ahora mismo",
	"minsAgo": "hace {0} min",
	"hoursAgo": "hace {0} h",
	"hoursMinsAgo": "hace {0}h {1}m",
	"daysAgo": "hace {0} d",
	"monthsAgo": "hace {0} meses",
	"yearsAgo": "hace {0} años",
	"tokenField": "Token de GitHub (opcional)",
	"tokenHint": "Aumenta los límites de la API de GitHub (búsqueda 10→30/min, core 60→5000/h) y habilita el lote de verificación de plugins. Solo en memoria: nunca se escribe en disco ni en registros, se borra al reiniciar.",
	"tokenPlaceholder": "ghp_… (basta con alcance repo)",
	"sourcePlaceholder": "URL de origen del registro (opcional, p. ej. https://…/registry.json)",
	"sourceSave": "Guardar origen",
	"sourceSaved": "Guardado",
	"sourceCurrent": "Origen actual",
	"sourceHint": "Origen de datos personalizado del mercado en formato registry.json. Déjalo vacío para usar el índice predeterminado (hoyyang/dsh-market-index). Se conserva mediante la variable de entorno DSH_STORE_REGISTRY_URL.",
	"tokenSave": "Guardar",
	"tokenSaved": "Token guardado para esta sesión.",
	"tokenMissingSettings": "Configura el token en Ajustes → Plugins → configuración del plugin (dsh ≥ rc.7), o mediante cordis.yml / DSHM_GITHUB_TOKEN.",
	"updateAllBtn": "Actualizar plugins ({0})",
	"updatingAll": "Actualizando…",
	"updateBtn": "Actualizar",
	"updateDone": "Actualización completada",
	"updateFailed": "La actualización falló",
	"updateHint": "Hay una versión más reciente disponible",
	"sourceBtn": "Fuente",
	"verifiedBadge": "Verificado",
	"verifiedHintTitle": "Instalación verificada: {0}",
	"disclosureBadge": "Divulgado",
	"manualInstall": "Instalación manual",
	"detailVersion": "Versiones",
	"detailRepoVer": "package.json del repo",
	"repoVersionHint": "Última versión de GitHub Releases",
	"detailNpmVer": "última de npm",
	"detailInstalledVer": "Instalado",
	"detailMeta": "Metadatos",
	"detailStars": "Estrellas",
	"detailCreated": "Publicado",
	"detailLanguage": "Lenguaje",
	"detailCategory": "Categoría",
	"detailLicense": "Licencia",
	"detailTopics": "Temas",
	"detailInstall": "Instalar",
	"detailRelated": "Plugins relacionados",
	"detailAdded": "Añadido el {0}",
	"channelNpm": "npm: paquete precompilado — dsh plugin add <pkg>",
	"channelTarball": "tarball: tgz precompilado de GitHub Releases (si está publicado)",
	"channelSource": "fuente: dsh plugin add github:owner/repo",
	"detailCopy": "Copiar comando",
	"readmeLoading": "Cargando README…",
	"readmeFailed": "README no disponible.",
	"verifiedReport": "Informe de verificación",
	"discCloud": "Nube",
	"discCloudNone": "Sin servicios en la nube",
	"discNetwork": "Red",
	"discNetNone": "Sin acceso a la red",
	"discOffline": "Funciona sin conexión",
	"discApiKeys": "Claves API",
	"discJurisdiction": "Jurisdicción",
	"discRetention": "Retención de datos",
	"stateLive": "· Activo",
	"stateDisabled": "· Deshabilitado",
	"stateRestart": "· Reiniciar para aplicar",
	"resultsTitle": "Resultados de DSH Mall",
	"resultsRecommended": "Recomendados",
	"resultsRelated": "Otros relacionados",
	"resultsExpired": "Resultados caducados: ejecuta /dsh-mall de nuevo.",
	"verifiedOnly": "Verificado",
	"curatedBadgeTitle": "Listado en awesome-dsh-plugin",
	"verifiedBadgeHint": "Instalación verificada (qing3a/dsh-plugin-verify)",
	"descLoading": "…",
	"toggleHint": "Activar / desactivar este plugin",
	"toggleDone": "Estado cambiado. Los cambios se aplican mediante el observador de perfil.",
	"toggleFailed": "Error al cambiar el estado",
	"rollbackBtn": "Revertir a la anterior",
	"rollbackDone": "Revertido.",
	"rollbackFailed": "Error al revertir",
	"skipUpdate": "Omitir en Actualizar todo",
	"skipHint": "Solo se excluye de «Actualizar plugins» y de la autoactualización; el botón de actualizar de la tarjeta sigue funcionando.",
	"selfUpdateBtn": "Actualizar «DSH Mall» {0} → {1}",
	"selfUpdateDone": "DSH Mall actualizado.",
	"selfUpdateFailed": "Error al actualizar DSH Mall",
	"restartNeeded": "Reinicia dsh para aplicar los cambios.",
	"tasksBtn": "Tareas en curso",
	"tasksPanelTitle": "Tareas en curso",
	"tasksEmpty": "No hay tareas en curso.",
	"tasksEmptyHint": "El progreso de instalaciones, actualizaciones y desinstalaciones aparecerá aquí.",
	"tasksClear": "Limpiar finalizadas",
	"tasksDismiss": "Descartar",
	"taskKindInstall": "Instalación",
	"taskKindUpdate": "Actualización",
	"taskKindUninstall": "Desinstalación",
	"taskKindRollback": "Reversión",
	"cancelBtn": "Cancelar",
	"taskCancelled": "Cancelado",
	"taskKindSmartInstall": "Instalación inteligente",
	"taskKindSmartUninstall": "Desinstalación inteligente",
	"taskKindSmartUpdate": "Actualización inteligente",
	"smartUninstall": "Desinstalación inteligente",
	"smartUninstallHint": "La IA revisa los riesgos antes de desinstalar y elimina los restos.",
	"smartUninstallReview": "Revisión de IA antes de desinstalar",
	"smartUninstallRefused": "La revisión de IA rechaza esta desinstalación",
	"uninstallAnyway": "Desinstalar de todos modos",
	"enableSwitch": "Activar plugin",
	"taskRunning": "En curso…",
	"taskDone": "Completado",
	"taskFailed": "Falló",
	"tasksAggregate": "{0}/{1} completadas",
	"updateAllShort": "Todos los plugins ({0})",
	"settingsNav": "DSH Mall - Ajustes",
	"settingsTitle": "Ajustes de DSH Mall",
	"openStoreBtn": "Abrir DSH Mall",
	"openStoreHint": "Explora, busca, instala y actualiza plugins en el catálogo completo.",
	"autoUpdateTitle": "Autoactualización de plugins",
	"autoUpdateDesc": "Cuando está activado, la tienda actualiza su catálogo a diario y luego ejecuta automáticamente «Actualizar todo» en cada plugin actualizable.",
	"autoUpdateWarn": "⚠  Las versiones nuevas de los plugins pueden ser inestables: la autoactualización conlleva riesgo. Actívala con cuidado.",
	"autoUpdateNever": "Aún no se ha ejecutado.",
	"autoUpdateLastRun": "Última autoactualización: {0} · {1}",
	"autoUpdateOn": "Activado",
	"autoUpdateOff": "Desactivado",
	"settingsSource": "Fuente de datos",
	"settingsToken": "Token de GitHub",
	"settingsSelfUpdate": "Actualizaciones de la tienda",
	"smartSearch": "Búsqueda inteligente",
	"smartSearchHint": "Tu modelo principal entiende la necesidad y elige del catálogo de la tienda.",
	"smartSearching": "Buscando…",
	"backTop": "Volver arriba",
	"quizBadge": "SELECCIONES PERSONALES",
	"quizTitle": "Elige funciones, encuentra tus plugins",
	"quizSub": "30 segundos: elige lo que te importa y la tienda selecciona plugins para ti.",
	"quizPicked": "Seleccionado",
	"quizSkip": "Omitir",
	"quizGo": "Mostrar selecciones",
	"recQuizCtaTitle": "¿No sabes qué instalar?",
	"recQuizCtaSub": "Elige las funciones que te importan: selecciones personalizadas en 30 segundos.",
	"recQuizCtaBtn": "Elegir funciones",
	"recProfileChip": "Personalizado según tus {0} días de uso",
	"recRetakeQuiz": "Repetir cuestionario",
	"smartSearchEmpty": "Escribe primero tu necesidad en el cuadro de búsqueda.",
	"recDaily": "Actualizado a diario"
};
const fr = {
	"nav": "DSH Mall",
	"versionHint": "dsh-mall v{0}",
	"title": "DSH Mall",
	"subtitle": "Le catalogue de plugins DeepSeek Harness le plus complet — recherche intelligente, installation/mise à jour/désinstallation intelligentes, outil Skills intégré.",
	"refresh": "Actualiser",
	"autoRefresh": "Actualisation automatique de la base toutes les 30 min",
	"refreshing": "Actualisation…",
	"shardProgress": "{0} dépôts récupérés ({1}/{2} tranches)",
	"sourceCdn": "à jour",
	"sourceLive": "à jour",
	"sourceCache": "à jour",
	"sourceSnapshot": "instantané · {0}",
	"updatedAt": "il y a {0}",
	"syncedAt": "synchronisé {0}",
	"all": "Tous",
	"expandCats": "Déplier {0} catégories",
	"collapseCats": "Replier",
	"searchPlaceholder": "Rechercher par nom / propriétaire / description…",
	"searchClear": "Effacer la recherche",
	"sort": "Trier",
	"sortDim": "Dimension",
	"sortDir": "Direction",
	"sortStars": "Étoiles",
	"sortToday": "+ d’étoiles aujourd’hui",
	"sortDownloads": "Téléchargements npm (30 j)",
	"sortScore": "Score pratique",
	"downloadsHint": "Téléchargements npm au cours des 30 derniers jours",
	"totalDownloadsHint": "Total des téléchargements npm depuis 2019",
	"downloads30Label": "Téléchargements 30 j",
	"totalDownloadsLabel": "total des téléchargements",
	"sortCreated": "Date de publication",
	"sortAsc": "Croissant ↑",
	"sortDesc": "Décroissant ↓",
	"favOnly": "Favoris",
	"picksTitle": "Sélections de la rédaction",
	"recommendTitle": "Pour vous",
	"scannedChip": "Scanné",
	"scannedHint": "Installation vérifiée automatiquement (dsh.bundle trouvé dans l’arborescence du dépôt).",
	"scannedBadge": "Scanné",
	"scannedBadgeHint": "Analyse automatique réussie : dsh.bundle trouvé dans l’arborescence du dépôt.",
	"scanFailBadge": "Analyse échouée",
	"scanFailHint": "L’analyse automatique n’a trouvé aucun dsh.bundle dans l’arborescence du dépôt — il peut ne pas être installable comme plugin.",
	"skillChip": "Skill",
	"skillChipHint": "Dépôts contenant SKILL.md (plugins de type Skill)",
	"skillBadge": "Skill",
	"skillBadgeHint": "Contient SKILL.md — un dépôt de type Skill.",
	"scoreTitle": "Score composite",
	"scoreTotalLabel": "Composite",
	"scoreConfidence": "Confiance",
	"scoreDimMaintain": "Maintenance",
	"scoreDimPractical": "Pratique",
	"scoreDimPopularity": "Popularité",
	"scoreDimEase": "Facilité",
	"scoreDimSignal": "Signal",
	"scoreWhyTitle": "Pourquoi cette recommandation ?",
	"scorePending": "n/a",
	"scoreCardHint": "Score composite à cinq dimensions (maintenance/pratique/popularité/facilité/signal), moyenne géométrique pondérée × confiance du champ",
	"readmeCmdsTitle": "Commandes d’installation du README",
	"readmeCmdsFromSection": "de la section d’installation du README",
	"readmeCmdsFromReadme": "depuis le README",
	"readmeCmdsNone": "Aucune commande d’installation trouvée dans le README — utilisez l’installation en un clic ci-dessus.",
	"cardRadarHint": "Score pratique sur cinq dimensions",
	"dormantBadge": "Inactif",
	"dormantHint": "Aucun push depuis plus de 6 mois — probablement abandonné.",
	"npmUnlinkedHint": "Le package npm ne renvoie pas vers ce dépôt — l’installation peut résoudre vers un autre package.",
	"favAdd": "Ajouter aux favoris",
	"langToggle": "Langue",
	"kind": "Type",
	"kindAll": "Tous les dépôts",
	"kindPlugin": "Plugins uniquement",
	"kindNonplugin": "Non-plugins",
	"curatedOnly": "Awesome Curated",
	"installedOnly": "Installés",
	"localBadge": "local",
	"localOwner": "installation locale",
	"catInstalled": "Installé (local)",
	"since": "Activité",
	"sinceAll": "À tout moment",
	"sinceDay": "24 heures",
	"sinceWeek": "7 jours",
	"sinceMonth": "30 jours",
	"sinceYear": "1 an",
	"pageSize": "Par page",
	"prevPage": "Précédent",
	"nextPage": "Suivant",
	"stars": "étoiles",
	"today": "aujourd’hui",
	"todayGain": "aujourd’hui",
	"todayGainHint": "Gain d’étoiles du jour par rapport à la ligne de base quotidienne locale (nécessite un jour d’historique).",
	"publishAge": "âge de publication",
	"publishAgeHint": "Temps écoulé depuis la création du dépôt (null si l’index n’a pas de date).",
	"published": "publié",
	"updatedShort": "mis à jour",
	"install": "Installer",
	"uninstall": "Désinstaller",
	"installed": "Installé",
	"curatedBadge": "Awesome Curated",
	"pluginBadge": "plugin",
	"nonpluginBadge": "non-plugin",
	"pendingBadge": "non vérifié",
	"installTitle": "Installer {0} ?",
	"installFrom": "Source : {0}",
	"installVia": "Cible d’installation : {0}",
	"riskCurated": "Référencé dans awesome-dsh-plugin — liste vérifiée, installation en un clic.",
	"riskCommunity": "Dépôt communautaire. Les plugins sont du code tiers : installez uniquement des sources de confiance.",
	"riskNonplugin": "Ce dépôt n’est PEUT-ÊTRE PAS un plugin dsh — l’installation peut échouer ou ne rien faire.",
	"confirm": "Installer",
	"cancel": "Annuler",
	"installing": "Installation de {0}…",
	"installDone": "Installé. Actualisez la page pour l’activer.",
	"smartInstall": "Installation intelligente",
	"smartInstallHint": "L’IA examine le dépôt, l’installe, puis diagnostique le résultat.",
	"updateTitle": "Mettre à jour {0} ?",
	"updateFrom": "Source : {0}",
	"updateVia": "Cible de mise à jour : {0}",
	"updateRange": "Version : {0} → {1}",
	"smartUpdate": "Mise à jour intelligente",
	"smartUpdateHint": "L’IA examine le dépôt, met à jour le plugin, puis diagnostique le résultat.",
	"smartRefused": "L’analyse IA a refusé cette installation.",
	"installFailed": "Échec de l’installation",
	"uninstallTitle": "Désinstaller {0} ?",
	"localUninstallTitle": "Désinstaller le package local {0} ?",
	"localUninstallDesc": "Ce package n’est pas dans l’index du marché — il peut s’agir d’un composant de l’hôte DSH ou de l’environnement.",
	"localUninstallWarn": "Supprimer des composants hôte peut casser des fonctionnalités DSH et ils ne peuvent pas être restaurés depuis le marché.",
	"localUninstallCheck": "Je comprends le risque et je veux le désinstaller.",
	"uninstallDesc": "Supprime le package et sa ligne de bundle de ce profil.",
	"uninstalling": "Désinstallation de {0}…",
	"uninstallDone": "Désinstallé.",
	"empty": "Aucun dépôt correspondant.",
	"emptyFiltered": "Aucun résultat ne correspond aux filtres ou à la recherche actuels.",
	"clearFilters": "Effacer les filtres",
	"loading": "Chargement du catalogue…",
	"loadError": "Impossible de charger le catalogue. Affichage de l’instantané inclus.",
	"indexDegraded": "Échec de la mise à jour de l’index — affichage des données en cache.",
	"tokenConfigured": "Token GitHub actif",
	"publish": "Publier mon plugin",
	"publishHint": "Ajoutez le sujet dsh-plugin à votre dépôt GitHub et le store l’indexe — aucun code n’est envoyé.",
	"publishTitle": "Publier un plugin sur le marché",
	"publishDesc": "Le marché indexe chaque dépôt GitHub portant le sujet dsh-plugin. Il suffit d’ajouter le sujet — votre dépôt apparaît après la réindexation de GitHub (généralement en quelques minutes).",
	"publishRepo": "owner/repo",
	"publishMyRepos": "Mes dépôts (token)",
	"publishCheck": "Vérifier le sujet",
	"publishHasTopic": "Ce dépôt a déjà le sujet dsh-plugin — il apparaîtra dans le marché.",
	"publishAdd": "Ajouter le sujet dsh-plugin",
	"publishAdded": "Sujet ajouté ! Il apparaîtra dans le marché d’ici quelques minutes.",
	"publishNeedToken": "Un token GitHub (scope repo) est requis pour modifier les sujets. Options :",
	"publishManual": "Sur la page du dépôt, cliquez sur l’engrenage à côté de « À propos » et ajoutez le sujet « dsh-plugin ».",
	"publishCopyGh": "Copier la commande gh",
	"publishCopied": "Copié",
	"verifyHint": "Dépôts non vérifiés : nous vérifions leur package.json à la demande.",
	"close": "Fermer",
	"openRepo": "Ouvrir sur GitHub",
	"justNow": "à l’instant",
	"minsAgo": "il y a {0} min",
	"hoursAgo": "il y a {0} h",
	"hoursMinsAgo": "il y a {0} h {1} min",
	"daysAgo": "il y a {0} j",
	"monthsAgo": "il y a {0} mois",
	"yearsAgo": "il y a {0} an(s)",
	"tokenField": "Token GitHub (facultatif)",
	"tokenHint": "Augmente les limites de l’API GitHub (recherche 10→30/min, core 60→5000/h) et active le lot de vérification des plugins. Uniquement en mémoire — jamais écrit sur le disque ni dans les logs, effacé au redémarrage.",
	"tokenPlaceholder": "ghp_… (le scope repo suffit)",
	"sourcePlaceholder": "URL de la source du registre (facultatif, p. ex. https://…/registry.json)",
	"sourceSave": "Enregistrer la source",
	"sourceSaved": "Enregistré",
	"sourceCurrent": "Source actuelle",
	"sourceHint": "Source personnalisée de données du marché au format registry.json. Laissez vide pour utiliser l’index par défaut (hoyyang/dsh-market-index). La persistance se fait via la variable d’environnement DSH_STORE_REGISTRY_URL.",
	"tokenSave": "Enregistrer",
	"tokenSaved": "Token enregistré pour cette session.",
	"tokenMissingSettings": "Définissez le token dans Paramètres → Plugins → configuration du plugin (dsh ≥ rc.7), ou via cordis.yml / DSHM_GITHUB_TOKEN.",
	"updateAllBtn": "Mettre à jour les plugins ({0})",
	"updatingAll": "Mise à jour…",
	"updateBtn": "Mettre à jour",
	"updateDone": "Mise à jour terminée",
	"updateFailed": "Échec de la mise à jour",
	"updateHint": "Une version plus récente est disponible.",
	"sourceBtn": "Source",
	"verifiedBadge": "Vérifié",
	"verifiedHintTitle": "Installation vérifiée : {0}",
	"disclosureBadge": "Transparence",
	"manualInstall": "Installation manuelle",
	"detailVersion": "Versions",
	"detailRepoVer": "package.json du dépôt",
	"repoVersionHint": "Dernière version des releases GitHub",
	"detailNpmVer": "Dernière version npm",
	"detailInstalledVer": "Installé",
	"detailMeta": "Métadonnées",
	"detailStars": "Étoiles",
	"detailCreated": "Publié",
	"detailLanguage": "Langage",
	"detailCategory": "Catégorie",
	"detailLicense": "Licence",
	"detailTopics": "Sujets",
	"detailInstall": "Installer",
	"detailRelated": "Plugins associés",
	"detailAdded": "Ajouté {0}",
	"channelNpm": "npm : package préconstruit — dsh plugin add <pkg>",
	"channelTarball": "tarball : tgz préconstruit de la GitHub Release (si publiée)",
	"channelSource": "source : dsh plugin add github:owner/repo",
	"detailCopy": "Copier la commande",
	"readmeLoading": "Chargement du README…",
	"readmeFailed": "README indisponible.",
	"verifiedReport": "Rapport de vérification",
	"discCloud": "Cloud",
	"discCloudNone": "Aucun service cloud",
	"discNetwork": "Réseau",
	"discNetNone": "Aucun accès réseau",
	"discOffline": "Utilisable hors ligne",
	"discApiKeys": "Clés API",
	"discJurisdiction": "Juridiction",
	"discRetention": "Conservation des données",
	"stateLive": "· Actif",
	"stateDisabled": "· Désactivé",
	"stateRestart": "· Redémarrer pour appliquer",
	"resultsTitle": "Résultats du DSH Mall",
	"resultsRecommended": "Recommandés",
	"resultsRelated": "Autres résultats associés",
	"resultsExpired": "Résultats expirés — exécutez à nouveau /dsh-mall.",
	"verifiedOnly": "Vérifiés",
	"curatedBadgeTitle": "Listé dans awesome-dsh-plugin",
	"verifiedBadgeHint": "Installation vérifiée (qing3a/dsh-plugin-verify)",
	"descLoading": "…",
	"toggleHint": "Activer / désactiver ce plugin",
	"toggleDone": "État modifié. Les changements s’appliquent via le watcher de profil.",
	"toggleFailed": "Échec de la bascule",
	"rollbackBtn": "Restaurer la version précédente",
	"rollbackDone": "Version restaurée.",
	"rollbackFailed": "Échec de la restauration",
	"skipUpdate": "Ignorer dans « Tout mettre à jour »",
	"skipHint": "Exclu de « Mettre à jour les plugins » et de la mise à jour automatique — le bouton de mise à jour de la carte fonctionne toujours.",
	"selfUpdateBtn": "Mettre à jour « DSH Mall » {0} → {1}",
	"selfUpdateDone": "DSH Mall mis à jour.",
	"selfUpdateFailed": "Échec de la mise à jour de DSH Mall",
	"restartNeeded": "Redémarrez dsh pour appliquer.",
	"tasksBtn": "Tâches en cours",
	"tasksPanelTitle": "Tâches en cours",
	"tasksEmpty": "Aucune tâche en cours.",
	"tasksEmptyHint": "La progression des installations, mises à jour et désinstallations s’affichera ici.",
	"tasksClear": "Effacer les tâches terminées",
	"tasksDismiss": "Rejeter",
	"taskKindInstall": "Installation",
	"taskKindUpdate": "Mise à jour",
	"taskKindUninstall": "Désinstallation",
	"taskKindRollback": "Restauration",
	"cancelBtn": "Annuler",
	"taskCancelled": "Annulé",
	"taskKindSmartInstall": "Installation intelligente",
	"taskKindSmartUninstall": "Désinstallation intelligente",
	"taskKindSmartUpdate": "Mise à jour intelligente",
	"smartUninstall": "Désinstallation intelligente",
	"smartUninstallHint": "L’IA évalue les risques avant de désinstaller et supprime les fichiers résiduels.",
	"smartUninstallReview": "Analyse IA avant désinstallation",
	"smartUninstallRefused": "L’analyse IA refuse cette désinstallation.",
	"uninstallAnyway": "Désinstaller quand même",
	"enableSwitch": "Activer le plugin",
	"taskRunning": "En cours…",
	"taskDone": "Terminé",
	"taskFailed": "Échoué",
	"tasksAggregate": "{0}/{1} terminées",
	"updateAllShort": "Tous les plugins ({0})",
	"settingsNav": "DSH Mall - Paramètres",
	"settingsTitle": "Paramètres de DSH Mall",
	"openStoreBtn": "Ouvrir DSH Mall",
	"openStoreHint": "Parcourez, recherchez, installez et mettez à jour des plugins dans le catalogue complet.",
	"autoUpdateTitle": "Mise à jour automatique des plugins",
	"autoUpdateDesc": "Lorsque cette option est activée, le store actualise son catalogue chaque jour puis lance automatiquement « Tout mettre à jour » sur chaque plugin à mettre à jour.",
	"autoUpdateWarn": "⚠  Les nouvelles versions de plugins peuvent être instables — la mise à jour automatique comporte un risque. Activez avec précaution.",
	"autoUpdateNever": "Pas encore exécutée.",
	"autoUpdateLastRun": "Dernière mise à jour automatique : {0} · {1}",
	"autoUpdateOn": "Activé",
	"autoUpdateOff": "Désactivé",
	"settingsSource": "Source des données",
	"settingsToken": "Token GitHub",
	"settingsSelfUpdate": "Mises à jour du store",
	"smartSearch": "Recherche intelligente",
	"smartSearchHint": "Votre modèle principal comprend le besoin et sélectionne dans le catalogue du store.",
	"smartSearching": "Recherche…",
	"backTop": "Retour en haut",
	"quizBadge": "SÉLECTIONS PERSONNALISÉES",
	"quizTitle": "Choisissez des fonctionnalités, trouvez vos plugins",
	"quizSub": "30 secondes — choisissez ce qui compte pour vous et le store sélectionne des plugins pour vous.",
	"quizPicked": "Sélectionnés",
	"quizSkip": "Passer",
	"quizGo": "Afficher les sélections",
	"recQuizCtaTitle": "Vous ne savez pas quoi installer ?",
	"recQuizCtaSub": "Choisissez les fonctionnalités qui comptent pour vous — des sélections personnalisées en 30 secondes.",
	"recQuizCtaBtn": "Choisir des fonctionnalités",
	"recProfileChip": "Personnalisé selon vos {0} jours d'utilisation",
	"recRetakeQuiz": "Refaire le quiz",
	"smartSearchEmpty": "Saisissez d’abord votre besoin dans le champ de recherche.",
	"recDaily": "Mis à jour quotidiennement"
};
const de = {
	"nav": "DSH Mall",
	"versionHint": "dsh-mall v{0}",
	"title": "DSH Mall",
	"subtitle": "Der vollständigste DeepSeek-Harness-Plugin-Katalog – intelligente Suche, intelligentes Installieren/Aktualisieren/Deinstallieren, integriertes Skills-Tool.",
	"refresh": "Aktualisieren",
	"autoRefresh": "Datenbank alle 30 Minuten automatisch aktualisieren",
	"refreshing": "Wird aktualisiert…",
	"shardProgress": "{0} Repos abgerufen ({1}/{2} Segmente)",
	"sourceCdn": "aktualisiert",
	"sourceLive": "aktualisiert",
	"sourceCache": "aktualisiert",
	"sourceSnapshot": "Snapshot · {0}",
	"updatedAt": "vor {0}",
	"syncedAt": "Synchronisiert {0}",
	"all": "Alle",
	"expandCats": "{0} Kategorien erweitern",
	"collapseCats": "Einklappen",
	"searchPlaceholder": "Nach Name / Besitzer / Beschreibung suchen…",
	"searchClear": "Suche löschen",
	"sort": "Sortierung",
	"sortDim": "Dimension",
	"sortDir": "Richtung",
	"sortStars": "Sterne",
	"sortToday": "Sternezuwachs heute",
	"sortDownloads": "npm-Downloads (30 Tage)",
	"sortScore": "Praktischer Score",
	"downloadsHint": "npm-Downloads in den letzten 30 Tagen",
	"totalDownloadsHint": "Gesamte npm-Downloads seit 2019",
	"downloads30Label": "30-Tage-Downloads",
	"totalDownloadsLabel": "Gesamt-Downloads",
	"sortCreated": "Veröffentlichungsdatum",
	"sortAsc": "Aufsteigend ↑",
	"sortDesc": "Absteigend ↓",
	"favOnly": "Favoriten",
	"picksTitle": "Redaktionsempfehlungen",
	"recommendTitle": "Für dich",
	"scannedChip": "Geprüft",
	"scannedHint": "Maschinell als installierbar verifiziert (dsh.bundle im Repository-Baum gefunden)",
	"scannedBadge": "Geprüft",
	"scannedBadgeHint": "Maschinenprüfung bestanden: dsh.bundle im Repository-Baum gefunden.",
	"scanFailBadge": "Prüfung fehlgeschlagen",
	"scanFailHint": "Die Maschinenprüfung hat kein dsh.bundle im Repository-Baum gefunden – möglicherweise nicht als Plugin installierbar.",
	"skillChip": "Skill",
	"skillChipHint": "Repos mit SKILL.md (Plugins vom Typ Skill)",
	"skillBadge": "Skill",
	"skillBadgeHint": "Enthält SKILL.md – ein Repo vom Typ Skill.",
	"scoreTitle": "Gesamtscore",
	"scoreTotalLabel": "Gesamt",
	"scoreConfidence": "Konfidenz",
	"scoreDimMaintain": "Wartung",
	"scoreDimPractical": "Praktikabilität",
	"scoreDimPopularity": "Beliebtheit",
	"scoreDimEase": "Einfachheit",
	"scoreDimSignal": "Signal",
	"scoreWhyTitle": "Warum empfohlen",
	"scorePending": "n/a",
	"scoreCardHint": "Fünf-dimensionale Gesamtbewertung (Wartung/Praktikabilität/Beliebtheit/Einfachheit/Signal), gewichteter geometrischer Mittelwert × Feldkonfidenz",
	"readmeCmdsTitle": "README-Installationsbefehle",
	"readmeCmdsFromSection": "aus dem Installationsabschnitt der README",
	"readmeCmdsFromReadme": "aus der README",
	"readmeCmdsNone": "Kein Installationsbefehl in der README gefunden – verwenden Sie die Ein-Klick-Installation oben.",
	"cardRadarHint": "Fünf-dimensionale Praktikabilitätsbewertung",
	"dormantBadge": "Inaktiv",
	"dormantHint": "Seit über 6 Monaten keine Commits – möglicherweise verwaist.",
	"npmUnlinkedHint": "Das npm-Paket verweist nicht auf dieses Repository – die Installation könnte zu einem anderen Paket führen.",
	"favAdd": "Favorisieren",
	"langToggle": "Sprache",
	"kind": "Art",
	"kindAll": "Alle Repos",
	"kindPlugin": "Nur Plugins",
	"kindNonplugin": "Nicht-Plugins",
	"curatedOnly": "Kuratierte Auswahl",
	"installedOnly": "Installiert",
	"localBadge": "lokal",
	"localOwner": "lokale Installation",
	"catInstalled": "Installiert (lokal)",
	"since": "Zeitraum",
	"sinceAll": "Jederzeit",
	"sinceDay": "24 Stunden",
	"sinceWeek": "7 Tage",
	"sinceMonth": "30 Tage",
	"sinceYear": "1 Jahr",
	"pageSize": "Pro Seite",
	"prevPage": "Vorherige",
	"nextPage": "Weiter",
	"stars": "Sterne",
	"today": "heute",
	"todayGain": "heute",
	"todayGainHint": "Heutiger Sternezuwachs im Vergleich zur lokalen Tagesbasislinie (erfordert einen Tag Verlauf).",
	"publishAge": "Veröffentlichungsalter",
	"publishAgeHint": "Zeit seit Erstellung des Repos (null, wenn der Index kein Datum enthält).",
	"published": "veröffentlicht",
	"updatedShort": "aktualisiert",
	"install": "Installieren",
	"uninstall": "Deinstallieren",
	"installed": "Installiert",
	"curatedBadge": "Kuratierte Auswahl",
	"pluginBadge": "Plugin",
	"nonpluginBadge": "Nicht-Plugin",
	"pendingBadge": "ungeprüft",
	"installTitle": "{0} installieren?",
	"installFrom": "Quelle: {0}",
	"installVia": "Installationsziel: {0}",
	"riskCurated": "In awesome-dsh-plugin kuratiert – verifizierter Eintrag, Ein-Klick-Installation.",
	"riskCommunity": "Community-Repo. Plugins sind Drittanbieter-Code: Installieren Sie nur Quellen, denen Sie vertrauen.",
	"riskNonplugin": "Dieses Repo ist möglicherweise KEIN dsh-Plugin – die Installation könnte fehlschlagen oder nichts bewirken.",
	"confirm": "Installieren",
	"cancel": "Abbrechen",
	"installing": "{0} wird installiert…",
	"installDone": "Installiert. Aktualisieren Sie die Seite, um zu aktivieren.",
	"smartInstall": "Intelligente Installation",
	"smartInstallHint": "KI prüft das Repo, installiert es und analysiert anschließend das Ergebnis.",
	"updateTitle": "{0} aktualisieren?",
	"updateFrom": "Quelle: {0}",
	"updateVia": "Aktualisierungsziel: {0}",
	"updateRange": "Version: {0} → {1}",
	"smartUpdate": "Intelligentes Update",
	"smartUpdateHint": "KI prüft das Repo, aktualisiert das Plugin und analysiert anschließend das Ergebnis.",
	"smartRefused": "KI-Prüfung hat diese Installation abgelehnt",
	"installFailed": "Installation fehlgeschlagen",
	"uninstallTitle": "{0} deinstallieren?",
	"localUninstallTitle": "Lokales Paket {0} deinstallieren?",
	"localUninstallDesc": "Dieses Paket ist nicht im Marktindex – es könnte eine DSH-Host- oder Umgebungskomponente sein.",
	"localUninstallWarn": "Das Entfernen von Host-Komponenten kann DSH-Funktionen beeinträchtigen und kann nicht aus dem Markt wiederhergestellt werden.",
	"localUninstallCheck": "Ich verstehe das Risiko und möchte es deinstallieren.",
	"uninstallDesc": "Entfernt das Paket und seine Bundle-Zeile aus diesem Profil.",
	"uninstalling": "{0} wird deinstalliert…",
	"uninstallDone": "Deinstalliert.",
	"empty": "Keine passenden Repos.",
	"emptyFiltered": "Keine Ergebnisse entsprechen den aktuellen Filtern oder der Suche.",
	"clearFilters": "Filter zurücksetzen",
	"loading": "Katalog wird geladen…",
	"loadError": "Katalog konnte nicht geladen werden. Der gebündelte Snapshot wird angezeigt.",
	"indexDegraded": "Indexaktualisierung fehlgeschlagen – zwischengespeicherte Daten werden angezeigt",
	"tokenConfigured": "GitHub-Token aktiv",
	"publish": "Plugin veröffentlichen",
	"publishHint": "Versehen Sie Ihr GitHub-Repo mit dem Topic dsh-plugin und der Store indexiert es – es wird kein Code hochgeladen.",
	"publishTitle": "Plugin im Markt veröffentlichen",
	"publishDesc": "Der Markt indexiert jedes GitHub-Repo mit dem Tag dsh-plugin. Es genügt, das Tag hinzuzufügen – Ihr Repo erscheint nach der Neuindizierung durch GitHub (normalerweise in Minuten).",
	"publishRepo": "owner/repo",
	"publishMyRepos": "Meine Repos (Token)",
	"publishCheck": "Topic prüfen",
	"publishHasTopic": "Dieses Repo hat bereits das Topic dsh-plugin – es wird im Markt angezeigt.",
	"publishAdd": "Topic dsh-plugin hinzufügen",
	"publishAdded": "Topic hinzugefügt! Es wird in wenigen Minuten im Markt erscheinen.",
	"publishNeedToken": "Ein GitHub-Token (repo-Bereich) ist erforderlich, um Topics zu schreiben. Optionen:",
	"publishManual": "Klicken Sie auf der Repo-Seite auf das Zahnrad neben „About“ und fügen Sie das Topic „dsh-plugin“ hinzu.",
	"publishCopyGh": "gh-Befehl kopieren",
	"publishCopied": "Kopiert",
	"verifyHint": "Ungeprüfte Repos: Wir prüfen deren package.json bei Bedarf.",
	"close": "Schließen",
	"openRepo": "Auf GitHub öffnen",
	"justNow": "gerade eben",
	"minsAgo": "vor {0} Min.",
	"hoursAgo": "vor {0} Std.",
	"hoursMinsAgo": "vor {0} Std. {1} Min.",
	"daysAgo": "vor {0} Tagen",
	"monthsAgo": "vor {0} Monaten",
	"yearsAgo": "vor {0} Jahren",
	"tokenField": "GitHub-Token (optional)",
	"tokenHint": "Erhöht die GitHub-API-Limits (Suche 10→30/min, Kern 60→5000/h) und aktiviert die Stapelverifizierung von Plugins. Nur im Speicher – wird nie auf Datenträger oder in Protokolle geschrieben und beim Neustart gelöscht.",
	"tokenPlaceholder": "ghp_… (repo-Bereich reicht)",
	"sourcePlaceholder": "Registry-Quell-URL (optional, z. B. https://…/registry.json)",
	"sourceSave": "Quelle speichern",
	"sourceSaved": "Gespeichert",
	"sourceCurrent": "Aktuelle Quelle",
	"sourceHint": "Benutzerdefinierte Marktdatenquelle im registry.json-Format. Leer lassen, um den Standardindex (hoyyang/dsh-market-index) zu verwenden. Bleibt über die Umgebungsvariable DSH_STORE_REGISTRY_URL erhalten.",
	"tokenSave": "Speichern",
	"tokenSaved": "Token für diese Sitzung gespeichert.",
	"tokenMissingSettings": "Legen Sie das Token in Einstellungen → Plugins → Plugin-Konfiguration (dsh ≥ rc.7) oder über cordis.yml / DSHM_GITHUB_TOKEN fest.",
	"updateAllBtn": "Plugins aktualisieren ({0})",
	"updatingAll": "Aktualisiere…",
	"updateBtn": "Aktualisieren",
	"updateDone": "Update abgeschlossen",
	"updateFailed": "Update fehlgeschlagen",
	"updateHint": "Eine neuere Version ist verfügbar",
	"sourceBtn": "Quelle",
	"verifiedBadge": "Verifiziert",
	"verifiedHintTitle": "Verifizierte Installation: {0}",
	"disclosureBadge": "Offengelegt",
	"manualInstall": "Manuelle Installation",
	"detailVersion": "Versionen",
	"detailRepoVer": "package.json des Repos",
	"repoVersionHint": "Neuestes GitHub-Release",
	"detailNpmVer": "npm aktuell",
	"detailInstalledVer": "Installiert",
	"detailMeta": "Metadaten",
	"detailStars": "Sterne",
	"detailCreated": "Veröffentlicht",
	"detailLanguage": "Sprache",
	"detailCategory": "Kategorie",
	"detailLicense": "Lizenz",
	"detailTopics": "Topics",
	"detailInstall": "Installieren",
	"detailRelated": "Verwandte Plugins",
	"detailAdded": "Hinzugefügt: {0}",
	"channelNpm": "npm: vorgefertigtes Paket – dsh plugin add <pkg>",
	"channelTarball": "Tarball: vorgefertigter tgz aus GitHub Release (falls veröffentlicht)",
	"channelSource": "Quelle: dsh plugin add github:owner/repo",
	"detailCopy": "Befehl kopieren",
	"readmeLoading": "README wird geladen…",
	"readmeFailed": "README nicht verfügbar.",
	"verifiedReport": "Verifizierungsbericht",
	"discCloud": "Cloud",
	"discCloudNone": "Keine Cloud-Dienste",
	"discNetwork": "Netzwerk",
	"discNetNone": "Kein Netzwerkzugriff",
	"discOffline": "Offline-fähig",
	"discApiKeys": "API-Schlüssel",
	"discJurisdiction": "Rechtsraum",
	"discRetention": "Datenaufbewahrung",
	"stateLive": "· Aktiv",
	"stateDisabled": "· Deaktiviert",
	"stateRestart": "· Neustart zum Übernehmen",
	"resultsTitle": "DSH-Store-Ergebnisse",
	"resultsRecommended": "Empfohlen",
	"resultsRelated": "Weitere verwandte Plugins",
	"resultsExpired": "Ergebnisse abgelaufen – führen Sie /dsh-mall erneut aus.",
	"verifiedOnly": "Verifiziert",
	"curatedBadgeTitle": "Gelistet in awesome-dsh-plugin",
	"verifiedBadgeHint": "Verifizierte Installation (qing3a/dsh-plugin-verify)",
	"descLoading": "…",
	"toggleHint": "Dieses Plugin aktivieren / deaktivieren",
	"toggleDone": "Umgeschaltet. Änderungen werden über den Profil-Watcher übernommen.",
	"toggleFailed": "Umschalten fehlgeschlagen",
	"rollbackBtn": "Rollback auf vorherige Version",
	"rollbackDone": "Rollback durchgeführt.",
	"rollbackFailed": "Rollback fehlgeschlagen",
	"skipUpdate": "Bei „Alle aktualisieren“ überspringen",
	"skipHint": "Nur von „Plugins aktualisieren“ und automatischem Update ausgeschlossen – die Update-Schaltfläche auf der Karte funktioniert weiterhin.",
	"selfUpdateBtn": "„DSH Mall“ aktualisieren {0} → {1}",
	"selfUpdateDone": "DSH Mall aktualisiert.",
	"selfUpdateFailed": "DSH-Store-Update fehlgeschlagen",
	"restartNeeded": "Starten Sie dsh neu, um die Änderungen zu übernehmen.",
	"tasksBtn": "Laufende Aufgaben",
	"tasksPanelTitle": "Laufende Aufgaben",
	"tasksEmpty": "Keine laufenden Aufgaben.",
	"tasksEmptyHint": "Der Fortschritt von Installation, Update und Deinstallation wird hier angezeigt.",
	"tasksClear": "Abgeschlossene entfernen",
	"tasksDismiss": "Ausblenden",
	"taskKindInstall": "Installieren",
	"taskKindUpdate": "Update",
	"taskKindUninstall": "Deinstallieren",
	"taskKindRollback": "Rollback",
	"cancelBtn": "Abbrechen",
	"taskCancelled": "Abgebrochen",
	"taskKindSmartInstall": "Intelligente Installation",
	"taskKindSmartUninstall": "Intelligente Deinstallation",
	"taskKindSmartUpdate": "Intelligentes Update",
	"smartUninstall": "Intelligente Deinstallation",
	"smartUninstallHint": "KI prüft die Risiken vor der Deinstallation und entfernt Reste.",
	"smartUninstallReview": "KI-Prüfung vor der Deinstallation",
	"smartUninstallRefused": "KI-Prüfung lehnt diese Deinstallation ab",
	"uninstallAnyway": "Trotzdem deinstallieren",
	"enableSwitch": "Plugin aktivieren",
	"taskRunning": "Läuft…",
	"taskDone": "Fertig",
	"taskFailed": "Fehlgeschlagen",
	"tasksAggregate": "{0}/{1} erledigt",
	"updateAllShort": "Alle Plugins ({0})",
	"settingsNav": "DSH Mall – Einstellungen",
	"settingsTitle": "DSH-Store-Einstellungen",
	"openStoreBtn": "DSH Mall öffnen",
	"openStoreHint": "Plugins im vollständigen Katalog durchsuchen, suchen, installieren und aktualisieren.",
	"autoUpdateTitle": "Plugins automatisch aktualisieren",
	"autoUpdateDesc": "Wenn aktiviert, aktualisiert der Store seinen Katalog täglich und führt dann automatisch „Alle aktualisieren“ für jedes aktualisierbare Plugin aus.",
	"autoUpdateWarn": "⚠  Neue Plugin-Versionen können instabil sein – automatische Updates sind mit Risiken verbunden. Vorsichtig aktivieren.",
	"autoUpdateNever": "Noch nie ausgeführt.",
	"autoUpdateLastRun": "Letzte automatische Aktualisierung: {0} · {1}",
	"autoUpdateOn": "Ein",
	"autoUpdateOff": "Aus",
	"settingsSource": "Datenquelle",
	"settingsToken": "GitHub-Token",
	"settingsSelfUpdate": "Store-Updates",
	"smartSearch": "Intelligente Suche",
	"smartSearchHint": "Ihr Hauptmodell versteht das Anliegen und wählt aus dem Store-Katalog aus.",
	"smartSearching": "Suche läuft…",
	"backTop": "Nach oben",
	"quizBadge": "PERSÖNLICHE EMPFEHLUNGEN",
	"quizTitle": "Funktionen wählen, Plugins finden",
	"quizSub": "30 Sekunden – wählen Sie, was Ihnen wichtig ist, und der Store wählt Plugins für Sie aus.",
	"quizPicked": "Ausgewählt",
	"quizSkip": "Überspringen",
	"quizGo": "Empfehlungen anzeigen",
	"recQuizCtaTitle": "Nicht sicher, was Sie installieren sollen?",
	"recQuizCtaSub": "Wählen Sie die Funktionen, die Ihnen wichtig sind – persönliche Empfehlungen in 30 Sekunden.",
	"recQuizCtaBtn": "Funktionen wählen",
	"recProfileChip": "Personalisiert aus Ihrer {0}-tägigen Nutzung",
	"recRetakeQuiz": "Quiz wiederholen",
	"smartSearchEmpty": "Geben Sie zuerst Ihr Anliegen in das Suchfeld ein.",
	"recDaily": "Täglich aktualisiert"
};
const pt = {
	"nav": "DSH Mall",
	"versionHint": "dsh-mall v{0}",
	"title": "DSH Mall",
	"subtitle": "O catálogo de plugins mais completo do DeepSeek Harness — busca inteligente, instalação/atualização/desinstalação inteligentes, ferramenta de Skills integrada.",
	"refresh": "Atualizar",
	"autoRefresh": "atualização automática do banco de dados a cada 30 min",
	"refreshing": "Atualizando…",
	"shardProgress": "Buscados {0} repositórios ({1}/{2} partes)",
	"sourceCdn": "atualizado",
	"sourceLive": "atualizado",
	"sourceCache": "atualizado",
	"sourceSnapshot": "instantâneo · {0}",
	"updatedAt": "há {0}",
	"syncedAt": "sincronizado {0}",
	"all": "Todos",
	"expandCats": "Expandir {0} categorias",
	"collapseCats": "Recolher",
	"searchPlaceholder": "Pesquisar nome / proprietário / descrição…",
	"searchClear": "Limpar pesquisa",
	"sort": "Ordenar",
	"sortDim": "Dimensão",
	"sortDir": "Direção",
	"sortStars": "Estrelas",
	"sortToday": "Estrelas de hoje",
	"sortDownloads": "Downloads npm (30d)",
	"sortScore": "Pontuação de praticidade",
	"downloadsHint": "downloads npm nos últimos 30 dias",
	"totalDownloadsHint": "Total de downloads npm desde 2019",
	"downloads30Label": "downloads em 30d",
	"totalDownloadsLabel": "total de downloads",
	"sortCreated": "Data de publicação",
	"sortAsc": "Crescente ↑",
	"sortDesc": "Decrescente ↓",
	"favOnly": "Favoritos",
	"picksTitle": "Escolhas da curadoria",
	"recommendTitle": "Para você",
	"scannedChip": "Analisado",
	"scannedHint": "Instalável verificado por máquina (dsh.bundle encontrado na árvore do repositório)",
	"scannedBadge": "Analisado",
	"scannedBadgeHint": "Análise por máquina aprovada: dsh.bundle encontrado na árvore do repositório.",
	"scanFailBadge": "Falha na análise",
	"scanFailHint": "A análise por máquina não encontrou dsh.bundle na árvore do repositório — pode não ser instalável como plugin.",
	"skillChip": "Skill",
	"skillChipHint": "Repositórios que contêm SKILL.md (plugins do tipo skill)",
	"skillBadge": "Skill",
	"skillBadgeHint": "Contém SKILL.md — repositório do tipo skill.",
	"scoreTitle": "Pontuação composta",
	"scoreTotalLabel": "Composta",
	"scoreConfidence": "Confiança",
	"scoreDimMaintain": "Manutenção",
	"scoreDimPractical": "Praticidade",
	"scoreDimPopularity": "Popularidade",
	"scoreDimEase": "Facilidade",
	"scoreDimSignal": "Sinal",
	"scoreWhyTitle": "Por que é recomendado",
	"scorePending": "n/d",
	"scoreCardHint": "Pontuação composta de cinco dimensões (manutenção/praticidade/popularidade/facilidade/sinal), média geométrica ponderada × confiança do campo",
	"readmeCmdsTitle": "Comandos de instalação do README",
	"readmeCmdsFromSection": "da seção de instalação do README",
	"readmeCmdsFromReadme": "do README",
	"readmeCmdsNone": "Nenhum comando de instalação encontrado no README — use a instalação com um clique acima.",
	"cardRadarHint": "Pontuação de praticidade de cinco dimensões",
	"dormantBadge": "Inativo",
	"dormantHint": "Sem pushes há mais de 6 meses — possivelmente abandonado.",
	"npmUnlinkedHint": "O pacote npm não aponta de volta para este repositório — a instalação pode resolver para um pacote diferente.",
	"favAdd": "Favoritar",
	"langToggle": "Idioma",
	"kind": "Tipo",
	"kindAll": "Todos os repositórios",
	"kindPlugin": "Somente plugins",
	"kindNonplugin": "Não-plugins",
	"curatedOnly": "Curadoria Awesome",
	"installedOnly": "Instalados",
	"localBadge": "local",
	"localOwner": "instalação local",
	"catInstalled": "Instalados (local)",
	"since": "Atividade",
	"sinceAll": "Qualquer período",
	"sinceDay": "24 horas",
	"sinceWeek": "7 dias",
	"sinceMonth": "30 dias",
	"sinceYear": "1 ano",
	"pageSize": "Por página",
	"prevPage": "Anterior",
	"nextPage": "Próxima",
	"stars": "estrelas",
	"today": "hoje",
	"todayGain": "hoje",
	"todayGainHint": "Ganho de estrelas hoje em relação à base diária local (precisa de um dia de histórico).",
	"publishAge": "idade de publicação",
	"publishAgeHint": "Tempo desde a criação do repositório (nulo quando o índice não tem data).",
	"published": "publicado",
	"updatedShort": "atualizado",
	"install": "Instalar",
	"uninstall": "Desinstalar",
	"installed": "Instalado",
	"curatedBadge": "Curadoria Awesome",
	"pluginBadge": "plugin",
	"nonpluginBadge": "não-plugin",
	"pendingBadge": "não verificado",
	"installTitle": "Instalar {0}?",
	"installFrom": "Fonte: {0}",
	"installVia": "Destino da instalação: {0}",
	"riskCurated": "Na curadoria awesome-dsh-plugin — listagem verificada, instalação em um clique.",
	"riskCommunity": "Repositório da comunidade. Plugins são código de terceiros: instale somente fontes em que você confia.",
	"riskNonplugin": "Este repositório PODE NÃO ser um plugin dsh — a instalação pode falhar ou não fazer nada.",
	"confirm": "Instalar",
	"cancel": "Cancelar",
	"installing": "Instalando {0}…",
	"installDone": "Instalado. Atualize a página para ativar.",
	"smartInstall": "Instalação inteligente",
	"smartInstallHint": "A IA analisa o repositório, instala e diagnostica o resultado.",
	"updateTitle": "Atualizar {0}?",
	"updateFrom": "Fonte: {0}",
	"updateVia": "Destino da atualização: {0}",
	"updateRange": "Versão: {0} → {1}",
	"smartUpdate": "Atualização inteligente",
	"smartUpdateHint": "A IA analisa o repositório, atualiza o plugin e diagnostica o resultado.",
	"smartRefused": "A análise da IA recusou esta instalação",
	"installFailed": "Falha na instalação",
	"uninstallTitle": "Desinstalar {0}?",
	"localUninstallTitle": "Desinstalar pacote local {0}?",
	"localUninstallDesc": "Este pacote não está no índice do mercado — pode ser um componente do host DSH ou do ambiente.",
	"localUninstallWarn": "Remover componentes do host pode quebrar recursos do DSH e não pode ser restaurado pelo mercado.",
	"localUninstallCheck": "Entendo o risco e quero desinstalar.",
	"uninstallDesc": "Remove o pacote e sua linha de bundle deste perfil.",
	"uninstalling": "Desinstalando {0}…",
	"uninstallDone": "Desinstalado.",
	"empty": "Nenhum repositório correspondente.",
	"emptyFiltered": "Nenhum resultado corresponde aos filtros ou à pesquisa atuais.",
	"clearFilters": "Limpar filtros",
	"loading": "Carregando catálogo…",
	"loadError": "Não foi possível carregar o catálogo. Mostrando o instantâneo incluído.",
	"indexDegraded": "Falha na atualização do índice — mostrando dados em cache",
	"tokenConfigured": "Token do GitHub ativo",
	"publish": "Publicar meu plugin",
	"publishHint": "Marque seu repositório do GitHub com o tópico dsh-plugin e a loja o indexa — nenhum código é enviado.",
	"publishTitle": "Publicar um plugin no mercado",
	"publishDesc": "O mercado indexa todo repositório do GitHub marcado com dsh-plugin. Basta adicionar a tag — seu repositório aparece depois que o GitHub reindexar (geralmente em minutos).",
	"publishRepo": "owner/repo",
	"publishMyRepos": "Meus repositórios (token)",
	"publishCheck": "Verificar tópico",
	"publishHasTopic": "Este repositório já tem o tópico dsh-plugin — ele aparecerá no mercado.",
	"publishAdd": "Adicionar tópico dsh-plugin",
	"publishAdded": "Tópico adicionado! Ele aparecerá no mercado em poucos minutos.",
	"publishNeedToken": "É necessário um token do GitHub (escopo repo) para escrever tópicos. Opções:",
	"publishManual": "Na página do repositório, clique na engrenagem ao lado de \"Sobre\" e adicione o tópico \"dsh-plugin\".",
	"publishCopyGh": "Copiar comando gh",
	"publishCopied": "Copiado",
	"verifyHint": "Repositórios não verificados: verificamos o package.json deles sob demanda.",
	"close": "Fechar",
	"openRepo": "Abrir no GitHub",
	"justNow": "agora mesmo",
	"minsAgo": "há {0} min",
	"hoursAgo": "há {0} h",
	"hoursMinsAgo": "há {0}h {1}m",
	"daysAgo": "há {0} d",
	"monthsAgo": "há {0} mês(es)",
	"yearsAgo": "há {0} ano(s)",
	"tokenField": "Token do GitHub (opcional)",
	"tokenHint": "Aumenta os limites da API do GitHub (pesquisa 10→30/min, core 60→5000/h) e ativa o lote de verificação de plugins. Somente em memória — nunca é gravado em disco ou logs e é limpo ao reiniciar.",
	"tokenPlaceholder": "ghp_… (o escopo repo é suficiente)",
	"sourcePlaceholder": "URL da fonte do registro (opcional, ex.: https://…/registry.json)",
	"sourceSave": "Salvar fonte",
	"sourceSaved": "Salva",
	"sourceCurrent": "Fonte atual",
	"sourceHint": "Fonte de dados de mercado personalizada no formato registry.json. Deixe vazio para usar o índice padrão (hoyyang/dsh-market-index). Persiste por meio da variável de ambiente DSH_STORE_REGISTRY_URL.",
	"tokenSave": "Salvar",
	"tokenSaved": "Token salvo para esta sessão.",
	"tokenMissingSettings": "Defina o token em Configurações → Plugins → configuração do plugin (dsh ≥ rc.7), ou via cordis.yml / DSHM_GITHUB_TOKEN.",
	"updateAllBtn": "Atualizar plugins ({0})",
	"updatingAll": "Atualizando…",
	"updateBtn": "Atualizar",
	"updateDone": "Atualização concluída",
	"updateFailed": "Falha na atualização",
	"updateHint": "Uma versão mais recente está disponível",
	"sourceBtn": "Fonte",
	"verifiedBadge": "Verificado",
	"verifiedHintTitle": "Instalação verificada: {0}",
	"disclosureBadge": "Declarado",
	"manualInstall": "Instalação manual",
	"detailVersion": "Versões",
	"detailRepoVer": "package.json do repositório",
	"repoVersionHint": "Última versão do GitHub Releases",
	"detailNpmVer": "npm mais recente",
	"detailInstalledVer": "Instalado",
	"detailMeta": "Metadados",
	"detailStars": "Estrelas",
	"detailCreated": "Publicado",
	"detailLanguage": "Idioma",
	"detailCategory": "Categoria",
	"detailLicense": "Licença",
	"detailTopics": "Tópicos",
	"detailInstall": "Instalar",
	"detailRelated": "Plugins relacionados",
	"detailAdded": "Adicionado {0}",
	"channelNpm": "npm: pacote pré-compilado — dsh plugin add <pkg>",
	"channelTarball": "tarball: tgz pré-compilado do GitHub Release (se publicado)",
	"channelSource": "fonte: dsh plugin add github:owner/repo",
	"detailCopy": "Copiar comando",
	"readmeLoading": "Carregando README…",
	"readmeFailed": "README indisponível.",
	"verifiedReport": "Relatório de verificação",
	"discCloud": "Nuvem",
	"discCloudNone": "Sem serviços na nuvem",
	"discNetwork": "Rede",
	"discNetNone": "Sem acesso à rede",
	"discOffline": "Funciona offline",
	"discApiKeys": "Chaves de API",
	"discJurisdiction": "Jurisdição",
	"discRetention": "Retenção de dados",
	"stateLive": "· Ativo",
	"stateDisabled": "· Desativado",
	"stateRestart": "· Reinicie para aplicar",
	"resultsTitle": "Resultados da DSH Mall",
	"resultsRecommended": "Recomendados",
	"resultsRelated": "Outros relacionados",
	"resultsExpired": "Resultados expirados — execute /dsh-mall novamente.",
	"verifiedOnly": "Verificados",
	"curatedBadgeTitle": "Listado em awesome-dsh-plugin",
	"verifiedBadgeHint": "Instalação verificada (qing3a/dsh-plugin-verify)",
	"descLoading": "…",
	"toggleHint": "Ativar / desativar este plugin",
	"toggleDone": "Alternado. As alterações são aplicadas pelo observador de perfil.",
	"toggleFailed": "Falha ao alternar",
	"rollbackBtn": "Reverter para a versão anterior",
	"rollbackDone": "Reversão concluída.",
	"rollbackFailed": "Falha na reversão",
	"skipUpdate": "Ignorar em Atualizar Tudo",
	"skipHint": "Excluído apenas de \"Atualizar plugins\" e da atualização automática — o botão de atualização no card ainda funciona.",
	"selfUpdateBtn": "Atualizar \"DSH Mall\" {0} → {1}",
	"selfUpdateDone": "DSH Mall atualizada.",
	"selfUpdateFailed": "Falha na atualização da DSH Mall",
	"restartNeeded": "Reinicie o dsh para aplicar.",
	"tasksBtn": "Tarefas em execução",
	"tasksPanelTitle": "Tarefas em execução",
	"tasksEmpty": "Nenhuma tarefa em execução.",
	"tasksEmptyHint": "O progresso de instalação, atualização e desinstalação aparecerá aqui.",
	"tasksClear": "Limpar concluídas",
	"tasksDismiss": "Dispensar",
	"taskKindInstall": "Instalação",
	"taskKindUpdate": "Atualização",
	"taskKindUninstall": "Desinstalação",
	"taskKindRollback": "Reversão",
	"cancelBtn": "Cancelar",
	"taskCancelled": "Cancelada",
	"taskKindSmartInstall": "Instalação inteligente",
	"taskKindSmartUninstall": "Desinstalação inteligente",
	"taskKindSmartUpdate": "Atualização inteligente",
	"smartUninstall": "Desinstalação inteligente",
	"smartUninstallHint": "A IA analisa os riscos antes de desinstalar e remove resquícios.",
	"smartUninstallReview": "Análise da IA antes da desinstalação",
	"smartUninstallRefused": "A análise da IA recusa esta desinstalação",
	"uninstallAnyway": "Desinstalar mesmo assim",
	"enableSwitch": "Ativar plugin",
	"taskRunning": "Executando…",
	"taskDone": "Concluída",
	"taskFailed": "Falhou",
	"tasksAggregate": "{0}/{1} concluídas",
	"updateAllShort": "Todos os plugins ({0})",
	"settingsNav": "DSH Mall - Configurações",
	"settingsTitle": "Configurações da DSH Mall",
	"openStoreBtn": "Abrir a DSH Mall",
	"openStoreHint": "Navegue, pesquise, instale e atualize plugins no catálogo completo.",
	"autoUpdateTitle": "Atualizar plugins automaticamente",
	"autoUpdateDesc": "Quando ativada, a loja atualiza o catálogo diariamente e executa automaticamente Atualizar Tudo em todos os plugins atualizáveis.",
	"autoUpdateWarn": "⚠  Novas versões de plugins podem ser instáveis — a atualização automática envolve risco. Ative com cuidado.",
	"autoUpdateNever": "Nunca executada.",
	"autoUpdateLastRun": "Última atualização automática: {0} · {1}",
	"autoUpdateOn": "Ativada",
	"autoUpdateOff": "Desativada",
	"settingsSource": "Fonte de dados",
	"settingsToken": "Token do GitHub",
	"settingsSelfUpdate": "Atualizações da loja",
	"smartSearch": "Busca inteligente",
	"smartSearchHint": "Seu modelo principal entende a necessidade e escolhe no catálogo da loja.",
	"smartSearching": "Buscando…",
	"backTop": "Voltar ao topo",
	"quizBadge": "ESCOLHAS PERSONALIZADAS",
	"quizTitle": "Escolha recursos, encontre seus plugins",
	"quizSub": "30 segundos — escolha o que importa para você e a loja seleciona plugins para você.",
	"quizPicked": "Selecionado",
	"quizSkip": "Pular",
	"quizGo": "Mostrar escolhas",
	"recQuizCtaTitle": "Não sabe o que instalar?",
	"recQuizCtaSub": "Escolha os recursos que você prioriza — seleções personalizadas em 30 segundos.",
	"recQuizCtaBtn": "Escolher recursos",
	"recProfileChip": "Personalizado a partir do seu uso de {0} dias",
	"recRetakeQuiz": "Refazer teste",
	"smartSearchEmpty": "Digite sua necessidade na caixa de busca primeiro.",
	"recDaily": "Atualizado diariamente"
};
const ru = {
	"nav": "DSH Mall",
	"versionHint": "dsh-mall v{0}",
	"title": "DSH Mall",
	"subtitle": "Самый полный каталог плагинов DeepSeek Harness — умный поиск, умная установка/обновление/удаление, встроенный инструмент Skills.",
	"refresh": "Обновить",
	"autoRefresh": "автообновление базы каждые 30 мин",
	"refreshing": "Обновление…",
	"shardProgress": "Получено репозиториев: {0} ({1}/{2} частей)",
	"sourceCdn": "обновлено",
	"sourceLive": "обновлено",
	"sourceCache": "обновлено",
	"sourceSnapshot": "снимок · {0}",
	"updatedAt": "{0} назад",
	"syncedAt": "синхронизировано {0}",
	"all": "Все",
	"expandCats": "Развернуть {0} категорий",
	"collapseCats": "Свернуть",
	"searchPlaceholder": "Поиск по имени / владельцу / описанию…",
	"searchClear": "Очистить поиск",
	"sort": "Сортировка",
	"sortDim": "Параметр",
	"sortDir": "Направление",
	"sortStars": "Звёзды",
	"sortToday": "Звёзды за сегодня",
	"sortDownloads": "npm Загрузки (30 дн.)",
	"sortScore": "Практическая оценка",
	"downloadsHint": "Загрузки npm за последние 30 дней",
	"totalDownloadsHint": "Всего загрузок npm с 2019 года",
	"downloads30Label": "Загрузки за 30 дн.",
	"totalDownloadsLabel": "всего загрузок",
	"sortCreated": "Дата публикации",
	"sortAsc": "По возрастанию ↑",
	"sortDesc": "По убыванию ↓",
	"favOnly": "Избранное",
	"picksTitle": "Выбор редакции",
	"recommendTitle": "Для вас",
	"scannedChip": "Проверено",
	"scannedHint": "Проверено автоматически: можно установить (в дереве репозитория найден dsh.bundle)",
	"scannedBadge": "Проверено",
	"scannedBadgeHint": "Автоматическая проверка пройдена: в дереве репозитория найден dsh.bundle.",
	"scanFailBadge": "Проверка не пройдена",
	"scanFailHint": "Автоматическая проверка не нашла dsh.bundle в дереве репозитория — возможно, его нельзя установить как плагин.",
	"skillChip": "Навык",
	"skillChipHint": "Репозитории, содержащие SKILL.md (плагины-навыки)",
	"skillBadge": "Навык",
	"skillBadgeHint": "Содержит SKILL.md — репозиторий типа «навык».",
	"scoreTitle": "Комплексная оценка",
	"scoreTotalLabel": "Комплексная",
	"scoreConfidence": "Уверенность",
	"scoreDimMaintain": "Поддержка",
	"scoreDimPractical": "Практичность",
	"scoreDimPopularity": "Популярность",
	"scoreDimEase": "Простота",
	"scoreDimSignal": "Сигнал",
	"scoreWhyTitle": "Почему рекомендуется",
	"scorePending": "н/д",
	"scoreCardHint": "Комплексная оценка по пяти параметрам (поддержка/практичность/популярность/простота/сигнал), взвешенное среднее геометрическое × уверенность в данных",
	"readmeCmdsTitle": "Команды установки из README",
	"readmeCmdsFromSection": "из раздела установки README",
	"readmeCmdsFromReadme": "из README",
	"readmeCmdsNone": "В README нет команды установки — используйте установку в один клик выше.",
	"cardRadarHint": "Практическая оценка по пяти параметрам",
	"dormantBadge": "Неактивен",
	"dormantHint": "Нет коммитов более 6 месяцев — возможно, проект заброшен.",
	"npmUnlinkedHint": "npm-пакет не ссылается на этот репозиторий — при установке может быть получен другой пакет.",
	"favAdd": "В избранное",
	"langToggle": "Язык",
	"kind": "Тип",
	"kindAll": "Все репозитории",
	"kindPlugin": "Только плагины",
	"kindNonplugin": "Не плагины",
	"curatedOnly": "Awesome-подборка",
	"installedOnly": "Установленные",
	"localBadge": "локальный",
	"localOwner": "локальная установка",
	"catInstalled": "Установлено (локально)",
	"since": "Период",
	"sinceAll": "За всё время",
	"sinceDay": "24 часа",
	"sinceWeek": "7 дней",
	"sinceMonth": "30 дней",
	"sinceYear": "1 год",
	"pageSize": "На странице",
	"prevPage": "Назад",
	"nextPage": "Далее",
	"stars": "звёзд",
	"today": "сегодня",
	"todayGain": "за сегодня",
	"todayGainHint": "Прирост звёзд за сегодня относительно локального дневного базового уровня (нужна история за один день).",
	"publishAge": "возраст публикации",
	"publishAgeHint": "Время с момента создания репозитория (null, если в индексе нет даты).",
	"published": "опубликован",
	"updatedShort": "обновлён",
	"install": "Установить",
	"uninstall": "Удалить",
	"installed": "Установлено",
	"curatedBadge": "Awesome-подборка",
	"pluginBadge": "плагин",
	"nonpluginBadge": "не плагин",
	"pendingBadge": "не проверен",
	"installTitle": "Установить {0}?",
	"installFrom": "Источник: {0}",
	"installVia": "Цель установки: {0}",
	"riskCurated": "Входит в awesome-dsh-plugin — проверенная позиция, установка в один клик.",
	"riskCommunity": "Репозиторий сообщества. Плагины — сторонний код: устанавливайте только из источников, которым доверяете.",
	"riskNonplugin": "Этот репозиторий может НЕ быть плагином dsh — установка может не удаться или ничего не сделать.",
	"confirm": "Установить",
	"cancel": "Отмена",
	"installing": "Установка {0}…",
	"installDone": "Установлено. Обновите страницу для активации.",
	"smartInstall": "Умная установка",
	"smartInstallHint": "ИИ изучает репозиторий, устанавливает его и диагностирует результат.",
	"updateTitle": "Обновить {0}?",
	"updateFrom": "Источник: {0}",
	"updateVia": "Цель обновления: {0}",
	"updateRange": "Версия: {0} → {1}",
	"smartUpdate": "Умное обновление",
	"smartUpdateHint": "ИИ изучает репозиторий, обновляет плагин и диагностирует результат.",
	"smartRefused": "ИИ-проверка отклонила эту установку",
	"installFailed": "Ошибка установки",
	"uninstallTitle": "Удалить {0}?",
	"localUninstallTitle": "Удалить локальный пакет {0}?",
	"localUninstallDesc": "Этот пакет отсутствует в индексе маркета — возможно, это компонент DSH host или окружения.",
	"localUninstallWarn": "Удаление компонентов host может нарушить работу DSH, и их нельзя восстановить из маркета.",
	"localUninstallCheck": "Я понимаю риск и хочу удалить его.",
	"uninstallDesc": "Удаляет пакет и его строку bundle из этого профиля.",
	"uninstalling": "Удаление {0}…",
	"uninstallDone": "Удалено.",
	"empty": "Нет подходящих репозиториев.",
	"emptyFiltered": "Ничего не найдено по текущим фильтрам или поиску.",
	"clearFilters": "Сбросить фильтры",
	"loading": "Загрузка каталога…",
	"loadError": "Не удалось загрузить каталог. Показан встроенный снимок.",
	"indexDegraded": "Не удалось обновить индекс — показаны кэшированные данные",
	"tokenConfigured": "GitHub-токен активен",
	"publish": "Опубликовать мой плагин",
	"publishHint": "Добавьте тему dsh-plugin в репозиторий GitHub, и магазин проиндексирует его — код никуда не загружается.",
	"publishTitle": "Опубликовать плагин в маркете",
	"publishDesc": "Маркет индексирует каждый репозиторий GitHub с темой dsh-plugin. Достаточно добавить тему — репозиторий появится после переиндексации GitHub (обычно через несколько минут).",
	"publishRepo": "owner/repo",
	"publishMyRepos": "Мои репозитории (токен)",
	"publishCheck": "Проверить тему",
	"publishHasTopic": "У этого репозитория уже есть тема dsh-plugin — он появится в маркете.",
	"publishAdd": "Добавить тему dsh-plugin",
	"publishAdded": "Тема добавлена! Она появится в маркете в течение нескольких минут.",
	"publishNeedToken": "Для изменения тем нужен GitHub-токен (область repo). Варианты:",
	"publishManual": "На странице репозитория нажмите шестерёнку рядом с «About» и добавьте тему «dsh-plugin».",
	"publishCopyGh": "Скопировать команду gh",
	"publishCopied": "Скопировано",
	"verifyHint": "Непроверенные репозитории: мы проверяем их package.json по запросу.",
	"close": "Закрыть",
	"openRepo": "Открыть на GitHub",
	"justNow": "только что",
	"minsAgo": "{0} мин назад",
	"hoursAgo": "{0} ч назад",
	"hoursMinsAgo": "{0} ч {1} мин назад",
	"daysAgo": "{0} дн назад",
	"monthsAgo": "{0} мес назад",
	"yearsAgo": "{0} г назад",
	"tokenField": "GitHub-токен (необязательно)",
	"tokenHint": "Повышает лимиты GitHub API (поиск 10→30/мин, основные 60→5000/ч) и включает пакетную проверку плагинов. Хранится только в памяти — не записывается на диск или в логи, очищается при перезапуске.",
	"tokenPlaceholder": "ghp_… (достаточно области repo)",
	"sourcePlaceholder": "URL источника реестра (необязательно, например https://…/registry.json)",
	"sourceSave": "Сохранить источник",
	"sourceSaved": "Сохранено",
	"sourceCurrent": "Текущий источник",
	"sourceHint": "Пользовательский источник данных маркета в формате registry.json. Оставьте пустым, чтобы использовать индекс по умолчанию (hoyyang/dsh-market-index). Сохраняется через переменную окружения DSH_STORE_REGISTRY_URL.",
	"tokenSave": "Сохранить",
	"tokenSaved": "Токен сохранён для этой сессии.",
	"tokenMissingSettings": "Укажите токен в Настройки → Плагины → конфигурация плагина (dsh ≥ rc.7) или через cordis.yml / DSHM_GITHUB_TOKEN.",
	"updateAllBtn": "Обновить плагины ({0})",
	"updatingAll": "Обновление…",
	"updateBtn": "Обновить",
	"updateDone": "Обновление завершено",
	"updateFailed": "Ошибка обновления",
	"updateHint": "Доступна новая версия",
	"sourceBtn": "Источник",
	"verifiedBadge": "Проверен",
	"verifiedHintTitle": "Проверенная установка: {0}",
	"disclosureBadge": "Раскрыто",
	"manualInstall": "Ручная установка",
	"detailVersion": "Версии",
	"detailRepoVer": "package.json репозитория",
	"repoVersionHint": "Последний GitHub Release",
	"detailNpmVer": "npm: последняя",
	"detailInstalledVer": "Установлено",
	"detailMeta": "Метаданные",
	"detailStars": "Звёзды",
	"detailCreated": "Опубликовано",
	"detailLanguage": "Язык",
	"detailCategory": "Категория",
	"detailLicense": "Лицензия",
	"detailTopics": "Темы",
	"detailInstall": "Установить",
	"detailRelated": "Похожие плагины",
	"detailAdded": "Добавлено {0}",
	"channelNpm": "npm: готовый пакет — dsh plugin add <pkg>",
	"channelTarball": "tarball: готовый tgz из GitHub Release (если опубликован)",
	"channelSource": "исходный код: dsh plugin add github:owner/repo",
	"detailCopy": "Скопировать команду",
	"readmeLoading": "Загрузка README…",
	"readmeFailed": "README недоступен.",
	"verifiedReport": "Отчёт о проверке",
	"discCloud": "Облако",
	"discCloudNone": "Нет облачных сервисов",
	"discNetwork": "Сеть",
	"discNetNone": "Нет доступа к сети",
	"discOffline": "Работает без сети",
	"discApiKeys": "API-ключи",
	"discJurisdiction": "Юрисдикция",
	"discRetention": "Хранение данных",
	"stateLive": "· Активен",
	"stateDisabled": "· Отключён",
	"stateRestart": "· Требуется перезапуск",
	"resultsTitle": "Результаты DSH Mall",
	"resultsRecommended": "Рекомендуется",
	"resultsRelated": "Другие похожие",
	"resultsExpired": "Результаты устарели — выполните /dsh-mall заново.",
	"verifiedOnly": "Проверенные",
	"curatedBadgeTitle": "Указан в awesome-dsh-plugin",
	"verifiedBadgeHint": "Проверенная установка (qing3a/dsh-plugin-verify)",
	"descLoading": "…",
	"toggleHint": "Включить / отключить этот плагин",
	"toggleDone": "Переключено. Изменения применяются через watcher профиля.",
	"toggleFailed": "Не удалось переключить",
	"rollbackBtn": "Откатить к предыдущей версии",
	"rollbackDone": "Откат выполнен.",
	"rollbackFailed": "Не удалось выполнить откат",
	"skipUpdate": "Пропустить при обновлении всех",
	"skipHint": "Исключается только из «Обновить плагины» и автообновления — кнопка обновления на карточке по-прежнему работает.",
	"selfUpdateBtn": "Обновить «DSH Mall» {0} → {1}",
	"selfUpdateDone": "DSH Mall обновлён.",
	"selfUpdateFailed": "Не удалось обновить DSH Mall",
	"restartNeeded": "Перезапустите dsh для применения.",
	"tasksBtn": "Выполняющиеся задачи",
	"tasksPanelTitle": "Выполняющиеся задачи",
	"tasksEmpty": "Нет выполняющихся задач.",
	"tasksEmptyHint": "Здесь будет отображаться ход установки, обновления и удаления.",
	"tasksClear": "Очистить завершённые",
	"tasksDismiss": "Закрыть",
	"taskKindInstall": "Установка",
	"taskKindUpdate": "Обновление",
	"taskKindUninstall": "Удаление",
	"taskKindRollback": "Откат",
	"cancelBtn": "Отмена",
	"taskCancelled": "Отменено",
	"taskKindSmartInstall": "Умная установка",
	"taskKindSmartUninstall": "Умное удаление",
	"taskKindSmartUpdate": "Умное обновление",
	"smartUninstall": "Умное удаление",
	"smartUninstallHint": "ИИ оценивает риски перед удалением и убирает остатки.",
	"smartUninstallReview": "ИИ-проверка перед удалением",
	"smartUninstallRefused": "ИИ-проверка отклонила удаление",
	"uninstallAnyway": "Всё равно удалить",
	"enableSwitch": "Включить плагин",
	"taskRunning": "Выполняется…",
	"taskDone": "Готово",
	"taskFailed": "Ошибка",
	"tasksAggregate": "Готово: {0}/{1}",
	"updateAllShort": "Все плагины ({0})",
	"settingsNav": "DSH Mall — Настройки",
	"settingsTitle": "Настройки DSH Mall",
	"openStoreBtn": "Открыть DSH Mall",
	"openStoreHint": "Просматривайте, ищите, устанавливайте и обновляйте плагины в полном каталоге.",
	"autoUpdateTitle": "Автообновление плагинов",
	"autoUpdateDesc": "Когда включено, магазин ежедневно обновляет каталог и автоматически запускает обновление всех плагинов, для которых есть обновление.",
	"autoUpdateWarn": "⚠  Новые версии плагинов могут быть нестабильными — автообновление связано с риском. Включайте осторожно.",
	"autoUpdateNever": "Ещё не запускалось.",
	"autoUpdateLastRun": "Последнее автообновление: {0} · {1}",
	"autoUpdateOn": "Вкл",
	"autoUpdateOff": "Выкл",
	"settingsSource": "Источник данных",
	"settingsToken": "GitHub-токен",
	"settingsSelfUpdate": "Обновления магазина",
	"smartSearch": "Умный поиск",
	"smartSearchHint": "Ваша основная модель понимает потребность и выбирает из каталога магазина.",
	"smartSearching": "Поиск…",
	"backTop": "Наверх",
	"quizBadge": "ПЕРСОНАЛЬНЫЕ ПОДБОРКИ",
	"quizTitle": "Выберите функции и найдите свои плагины",
	"quizSub": "30 секунд — выберите, что для вас важно, и магазин подберёт плагины.",
	"quizPicked": "Выбрано",
	"quizSkip": "Пропустить",
	"quizGo": "Показать подборку",
	"recQuizCtaTitle": "Не знаете, что установить?",
	"recQuizCtaSub": "Выберите важные для вас функции — персональная подборка за 30 секунд.",
	"recQuizCtaBtn": "Выбрать функции",
	"recProfileChip": "Персонализировано на основе вашего использования за {0} дней",
	"recRetakeQuiz": "Пройти опрос заново",
	"smartSearchEmpty": "Сначала введите запрос в поле поиска.",
	"recDaily": "Обновляется ежедневно"
};
let uiLang = null;
const langListeners = /* @__PURE__ */ new Set();
const storeLang = {
	init(l) {
		if (uiLang !== null) return;
		try {
			const saved = localStorage.getItem("dsh-mall-uilang");
			uiLang = [
				"zh",
				"en",
				"ja",
				"ko",
				"es",
				"fr",
				"de",
				"pt",
				"ru"
			].includes(saved) ? saved : l;
		} catch {
			uiLang = l;
		}
	},
	get() {
		return uiLang ?? "zh";
	},
	set(l) {
		if (uiLang === l) return;
		uiLang = l;
		try {
			localStorage.setItem("dsh-mall-uilang", l);
		} catch {}
		for (const fn of langListeners) fn();
	},
	subscribe(fn) {
		langListeners.add(fn);
		return () => {
			langListeners.delete(fn);
		};
	}
};
/** 按当前商场 UI 语言取词条（缺 zh/en 兜底原 key）。 */
function storeT(key) {
	return (storeLang.get() === "zh" ? zh : storeLang.get() === "ja" ? ja : storeLang.get() === "ko" ? ko : storeLang.get() === "es" ? es : storeLang.get() === "fr" ? fr : storeLang.get() === "de" ? de : storeLang.get() === "pt" ? pt : storeLang.get() === "ru" ? ru : en)[key] ?? en[key] ?? key;
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
		if (options.scannedOnly && p.bundled !== true) return false;
		if (options.skillOnly && p.hasSkill !== true) return false;
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
	} else if (options.sort === "score-desc" || options.sort === "score-asc") {
		const sc = (v) => v.score?.total != null ? v.score.total : Number.NEGATIVE_INFINITY;
		const dir = options.sort === "score-desc" ? 1 : -1;
		sorted.sort((a, b) => {
			const da = sc(a);
			const db = sc(b);
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
//#region src/client/RadarChart.tsx
/**
* 五边形雷达图（v1.7.45 引入，借鉴 2BingLing/dsh-market RadarChart，MIT）：
* 卡片右侧版（140px）+ 详情页评分卡版（184px）。只渲染雷达，不渲染条状图。
* v1.7.51：标签（名称+分数）整体推到最外层网格线（1.0r）之外——
* 标签文字框离圆心最近点 ≥ r+2px（几何验算），任何字都不再压灰线/蓝边。
* v1.7.70：hover 动效（数据面发光+整体微放大）+ 跟随鼠标的五维规则说明框。
*/
const ORDER = [
	"maintain",
	"practical",
	"popularity",
	"ease",
	"signal"
];
/** 人话版五维规则（言简意赅，跟随鼠标的悬停说明框用）。 */
const RULES = {
	zh: {
		title: "五维分数怎么算的",
		dims: {
			maintain: "维护：最近是否还在更新代码、问题多不多",
			practical: "实用：README 有没有安装说明和代码示例",
			popularity: "热度：star / fork 多不多，社区认不认",
			ease: "便捷：能不能一条命令装好、要不要额外配置",
			signal: "信号：许可证 / 简介 / 主题标签全不全"
		},
		total: "综合分 = 五维加权几何平均（乘法融合）——任何一维很低都会强力拉低总分"
	},
	en: {
		title: "How the five dimensions score",
		dims: {
			maintain: "Maintain: recently updated, few open issues",
			practical: "Practical: README has install & usage docs",
			popularity: "Popularity: stars/forks — community trust",
			ease: "Ease: one-command install, no extra setup",
			signal: "Signal: license/description/topics completeness"
		},
		total: "Composite = weighted geometric mean — one weak dimension pulls it down hard"
	}
};
function RadarChart({ breakdown, total, size = 140, labels, totalLabel, tooltipLang = "zh" }) {
	const small = size < 150;
	const cx = size / 2;
	const cy = size / 2;
	const r = size * .26;
	const labelR = 1.56;
	const [tip, setTip] = (0, react.useState)(null);
	const rootRef = (0, react.useRef)(null);
	const pt = (v, i) => {
		const a = Math.PI * 2 * i / 5 - Math.PI / 2;
		return [cx + r * v * Math.cos(a), cy + r * v * Math.sin(a)];
	};
	const poly = (v) => ORDER.map((k, i) => pt(v, i).map((n) => n.toFixed(1)).join(",")).join(" ");
	const dataPoly = ORDER.map((k, i) => pt(Math.max(0, breakdown[k] ?? 0) / 100, i).map((n) => n.toFixed(1)).join(",")).join(" ");
	const font = small ? 8 : 10;
	const rules = RULES[tooltipLang];
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "pcm-radar" + (tip !== null ? " pcm-radar-hot" : ""),
		style: {
			width: size,
			height: size
		},
		ref: rootRef,
		onMouseEnter: (e) => setTip({
			x: e.clientX,
			y: e.clientY
		}),
		onMouseMove: (e) => setTip({
			x: e.clientX,
			y: e.clientY
		}),
		onMouseLeave: () => setTip(null),
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
			width: size,
			height: size,
			viewBox: "0 0 " + size + " " + size,
			"aria-label": totalLabel,
			children: [
				[
					.25,
					.5,
					.75,
					1
				].map((v) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("polygon", {
					points: poly(v),
					className: "pcm-radar-grid"
				}, v)),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("polygon", {
					points: dataPoly,
					className: "pcm-radar-data"
				}),
				ORDER.map((k, i) => {
					const v = Math.max(0, breakdown[k] ?? 0) / 100;
					const [x, y] = pt(v, i);
					return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
						cx: x.toFixed(1),
						cy: y.toFixed(1),
						r: small ? 1.8 : 2.2,
						className: "pcm-radar-dot"
					}, k);
				}),
				ORDER.map((k, i) => {
					const [x, y] = pt(labelR, i);
					return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("text", {
						x: x.toFixed(1),
						y: (y + (small ? 2.8 : 3.4)).toFixed(1),
						textAnchor: "middle",
						fontSize: font,
						className: "pcm-radar-label",
						children: [labels[k] + " ", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("tspan", {
							className: "pcm-radar-val",
							fontWeight: 700,
							fontSize: small ? 8 : 11,
							children: breakdown[k] ?? "—"
						})]
					}, k);
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("text", {
					x: cx,
					y: cy - (small ? 2.5 : 3),
					textAnchor: "middle",
					className: "pcm-radar-total",
					fontSize: small ? 15 : 19,
					children: total === null ? "—" : String(total)
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("text", {
					x: cx,
					y: cy + (small ? 11 : 14),
					textAnchor: "middle",
					className: "pcm-radar-total-label",
					fontSize: small ? 8 : 10,
					children: totalLabel
				})
			]
		}), tip !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: "pcm-radar-tip",
			style: {
				left: tip.x + 16,
				top: tip.y + 14
			},
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "pcm-radar-tip-title",
					children: rules.title
				}),
				ORDER.map((k) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "pcm-radar-tip-row",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "pcm-radar-tip-dim",
							children: labels[k]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "pcm-radar-tip-score",
							children: breakdown[k] ?? "—"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "pcm-radar-tip-rule",
							children: rules.dims[k]
						})
					]
				}, k)),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "pcm-radar-tip-total",
					children: rules.total
				})
			]
		})]
	});
}
//#endregion
//#region src/client/DetailPanel.tsx
/**
* Plugin detail panel: README (rendered by the official sandboxed MarkdownText
* — raw HTML disabled, protocol allowlist) plus an info sidebar with versions,
* metadata, topics, safety badges and actions. README fetches go straight to
* raw.githubusercontent.com (CORS-enabled) and are cached per repo+lang.
*
* v1.7.54 重设计（image-prompt ui-screenshot-system 出稿）：
* - 删除详情页语言按钮：readmeLang/desc/tags 一律跟随全店 storeLang（langChoice）
* - 安装区紫色高亮（pcm-install-sec）：渐变底 + 3px 紫左边线 + 圆角，内置主 CTA
* - 同类相关两行式迷你卡：第 1 行标题、第 2 行 ★star · 开发者
* - 回到顶部 FAB：.pcm-detail-scroll 滚动 >400px 浮现（业界标准 Material FAB 模式）
* - 元数据 star 单元格与首页卡片同款样式（pcm-meta-star）
* - 信息补齐：分类恒显（other 本地化）、近30天下载/总下载、含 skill 徽章；
*   详情打开时对缺失下载量的条目做一次性富化（/dsh-mall/downloads）
* - 排版重设计：信任徽章行上移与简介相邻；单滚动容器（无子滚动）保持不变
*/
const readmeCache = /* @__PURE__ */ new Map();
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
		const res = await fetch("/dsh-mall/readme?repo=" + encodeURIComponent(entry.owner + "/" + entry.name) + "&file=" + encodeURIComponent(file) + "&branch=" + encodeURIComponent(branch));
		if (res.ok) {
			const body = await res.json();
			if (body.ok === true && typeof body.text === "string") {
				const hit = {
					status: "ok",
					text: preprocessReadme(body.text.slice(0, 2e5), entry)
				};
				if (Array.isArray(body.installCmds) && body.installCmds.length > 0) {
					hit.installCmds = body.installCmds;
					hit.cmdSource = body.cmdSource ?? "readme";
				}
				return hit;
			}
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
/** 回到顶部 FAB：业界标准 Material FAB 模式——容器滚动 >400px 才浮现，
*  opacity + translateY 过渡，点击 smooth 回顶。 */
function BackToTop(props) {
	const [show, setShow] = (0, react.useState)(false);
	(0, react.useEffect)(() => {
		const el = props.target.current;
		if (!el) return;
		const update = () => setShow(el.scrollTop > 400);
		el.addEventListener("scroll", update, { passive: true });
		update();
		const timer = window.setInterval(update, 1200);
		return () => {
			el.removeEventListener("scroll", update);
			window.clearInterval(timer);
		};
	}, [props.target]);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
		type: "button",
		className: show ? "pcm-backtop pcm-backtop-show" : "pcm-backtop",
		title: props.label,
		"aria-label": props.label,
		onClick: () => {
			const el = props.target.current;
			if (el !== null && el !== void 0) {
				el.scrollTo({
					top: 0,
					behavior: "auto"
				});
				el.scrollTop = 0;
			}
		},
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
			width: "16",
			height: "16",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2.4",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			"aria-hidden": "true",
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 19V5M5 12l7-7 7 7" })
		})
	});
}
function DetailPanel(props) {
	const { t, entry, langChoice } = props;
	const readme = useReadme(entry, langChoice);
	const desc = entry.tagDescriptions?.[langChoice] && entry.tagDescriptions[langChoice] !== "" ? entry.tagDescriptions[langChoice] : langChoice !== "en" && entry.descriptions?.[langChoice] ? entry.descriptions[langChoice] : entry.description;
	const disclosure = entry.disclosure;
	const discLines = (0, react.useMemo)(() => disclosure == null ? [] : disclosureSummary(disclosure, t), [disclosure, t]);
	const [copied, setCopied] = (0, react.useState)(false);
	const [score, setScore] = (0, react.useState)(entry.score ?? null);
	(0, react.useEffect)(() => {
		if (entry.score != null && entry.score.complete) {
			setScore(entry.score);
			return;
		}
		let alive = true;
		fetch("/dsh-mall/scores", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ items: [{
				repo: entry.owner + "/" + entry.name,
				branch: entry.defaultBranch ?? "main"
			}] })
		}).then((res) => res.json()).then((body) => {
			const hit = body.scores?.[entry.owner + "/" + entry.name]?.score;
			if (alive && hit != null) setScore(hit);
		}).catch(() => {});
		return () => {
			alive = false;
		};
	}, [
		entry.owner,
		entry.name,
		entry.defaultBranch,
		entry.score
	]);
	const [downloadsHit, setDownloadsHit] = (0, react.useState)(null);
	(0, react.useEffect)(() => {
		if (entry.downloads !== null && entry.downloads !== void 0) return;
		if (entry.npm === null || entry.npmLinked === false) return;
		let alive = true;
		fetch("/dsh-mall/downloads", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ names: [entry.npm] })
		}).then((res) => res.json()).then((body) => {
			const got = body.downloads ?? {};
			const totals = body.totals ?? {};
			const d = got[entry.npm];
			const t = totals[entry.npm];
			if (alive && (d !== void 0 || t !== void 0)) setDownloadsHit({
				d: d ?? null,
				t: t ?? null
			});
		}).catch(() => {});
		return () => {
			alive = false;
		};
	}, [
		entry.owner,
		entry.name,
		entry.npm,
		entry.npmLinked,
		entry.downloads
	]);
	const scrollRef = (0, react.useRef)(null);
	const copyCmd = () => {
		const cmd = entry.npmLinked === false || entry.npm === null ? "dsh plugin add github:" + entry.owner + "/" + entry.name : "dsh plugin add " + entry.npm;
		navigator.clipboard?.writeText(cmd);
		setCopied(true);
		setTimeout(() => setCopied(false), 2e3);
	};
	const d30 = downloadsHit?.d ?? (typeof entry.downloads === "number" ? entry.downloads : null);
	const dTotal = downloadsHit?.t ?? (typeof entry.totalDownloads === "number" ? entry.totalDownloads : null);
	const targets = [
		[t("detailStars"), formatStars(entry.stars)],
		[t("todayGain"), entry.todayStars === null ? "—" : (entry.todayStars >= 0 ? "+" : "") + String(entry.todayStars)],
		[t("detailCategory"), entry.category === "" ? null : props.categoryLabel(entry.category)],
		[t("downloads30Label"), d30 !== null ? formatDownloads(d30) : entry.npm !== null && entry.npmLinked !== false ? "—" : null],
		[t("totalDownloadsLabel"), dTotal !== null ? formatDownloads(dTotal) : entry.npm !== null && entry.npmLinked !== false ? "—" : null],
		[t("detailCreated"), entry.created === null ? null : relativeFromNow(entry.created, t)],
		[t("updatedShort"), entry.pushed === null ? null : relativeFromNow(entry.pushed, t)],
		[t("detailLanguage"), entry.language],
		[t("detailLicense"), entry.license]
	].filter(([, v]) => v !== null && v !== "");
	const tags = langChoice === "zh" ? entry.tagsZh ?? [] : (entry.tagsEn ?? []).length > 0 ? entry.tagsEn ?? [] : entry.tagsZh ?? [];
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
		open: true,
		onClose: props.onClose,
		title: entry.name,
		closeLabel: t("close"),
		headless: true,
		className: "pcm-detail-modal",
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			className: "pcm-detail-scroll",
			ref: scrollRef,
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
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pcm-detail-actions",
									children: [
										props.isInstalled ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
												variant: "outline",
												size: "sm",
												disabled: true,
												className: "pcm-installed-tag",
												children: t("installed")
											}),
											props.update != null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
												variant: "primary",
												size: "sm",
												className: "pcm-update-btn",
												disabled: props.updating,
												onClick: props.onUpdate,
												children: props.updating ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
													className: "pcm-spin",
													children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, { size: 14 })
												}) : t("updateBtn")
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
												variant: "outline",
												size: "sm",
												className: "pcm-uninstall-btn",
												onClick: props.onUninstall,
												children: t("uninstall")
											})
										] }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
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
						(entry.curated || entry.verified != null || disclosure != null || entry.hasSkill === true || entry.bundled === true || entry.installable != null) && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "pcm-detail-safety",
							children: [
								entry.curated && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: "pcm-safety pcm-safety-curated",
									title: t("curatedBadgeTitle"),
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
										width: "11",
										height: "11",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "2.2",
										strokeLinecap: "round",
										strokeLinejoin: "round",
										"aria-hidden": "true",
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4L12 17.4l-5.8 3 1.1-6.4-4.7-4.6 6.5-.9z" })
									}), t("curatedBadge")]
								}),
								entry.hasSkill === true && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: "pcm-safety pcm-safety-skill",
									title: t("skillBadgeHint"),
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
										width: "11",
										height: "11",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "2.2",
										strokeLinecap: "round",
										strokeLinejoin: "round",
										"aria-hidden": "true",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 3.6 2.8 9.3l9.2 5.7 9.2-5.7z" }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M6.6 12.3v4.2c0 1.6 2.4 2.9 5.4 2.9s5.4-1.3 5.4-2.9v-4.2" }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M21.2 9.3v5.4" })
										]
									}), t("skillBadge")]
								}),
								entry.verified != null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: "pcm-safety pcm-safety-verified",
									title: t("verifiedBadgeHint") + " · " + entry.verified.by,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
										width: "12",
										height: "12",
										viewBox: "0 0 24 24",
										fill: "currentColor",
										"aria-hidden": "true",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
											cx: "12",
											cy: "7.6",
											r: "3.4"
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M5.6 20.2c1.1-3.4 3.6-5.1 6.4-5.1s5.3 1.7 6.4 5.1c.3.8-.3 1.6-1.1 1.6H6.7c-.8 0-1.4-.8-1.1-1.6z" })]
									}), t("verifiedBadge")]
								}),
								entry.bundled === true && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: "pcm-safety pcm-safety-scanned",
									title: t("scannedBadgeHint"),
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
										width: "11",
										height: "11",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "2.2",
										strokeLinecap: "round",
										strokeLinejoin: "round",
										"aria-hidden": "true",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 2.4l7.5 2.8v5.6c0 4.7-3.2 8.7-7.5 10.2-4.3-1.5-7.5-5.5-7.5-10.2V5.2l7.5-2.8z" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M9 11.6l2 2 4-4.2" })]
									}), t("scannedBadge")]
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
							className: "pcm-detail-sec pcm-install-sec",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "pcm-detail-sec-title pcm-install-sec-title",
									children: t("detailInstall")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "pcm-install-cmdrow",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
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
									})
								}),
								(readme.installCmds ?? []).length > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pcm-readme-cmds",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "pcm-readme-cmds-title",
										children: [t("readmeCmdsTitle"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "pcm-readme-cmds-src",
											children: readme.cmdSource === "readme-section" ? t("readmeCmdsFromSection") : t("readmeCmdsFromReadme")
										})]
									}), (readme.installCmds ?? []).map((cmd) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "pcm-cmdrow",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
											className: "pcm-cmd pcm-readme-cmd",
											children: cmd
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
											label: t("detailCopy"),
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
												variant: "ghost",
												size: "sm",
												icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCopyOutline16, { size: 14 }),
												onClick: () => {
													navigator.clipboard?.writeText(cmd);
												}
											})
										})]
									}, cmd))]
								}) : readme.status === "ok" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "pcm-readme-cmds-note",
									children: t("readmeCmdsNone")
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
						}),
						score != null && score.total !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "pcm-score-card",
							title: t("scoreCardHint"),
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "pcm-score-main",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "pcm-score-head",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "pcm-score-title",
											children: t("scoreTitle")
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											className: "pcm-score-conf",
											children: [
												t("scoreConfidence"),
												" ",
												Math.round(score.confidence * 100),
												"%"
											]
										})]
									}),
									(langChoice === "zh" ? score.explanation.zh : score.explanation.en) !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "pcm-score-why",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											className: "pcm-score-why-label",
											children: [t("scoreWhyTitle"), "："]
										}), langChoice === "zh" ? score.explanation.zh : score.explanation.en]
									}),
									score.breakdown.popularity !== null && score.breakdown.popularity <= 20 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: "pcm-score-note",
										children: langChoice === "zh" ? "热度维当前 " + score.breakdown.popularity + " 分——综合分是五维加权几何平均（乘法融合），任一维接近 0 都会强力拉低总分；仓库获得 star 后热度维回升，总分将显著上涨。" : "Popularity is " + score.breakdown.popularity + "/100 — the composite score is a weighted geometric mean, so one near-zero dimension pulls the total down hard; it rises quickly as the repo earns stars."
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: "pcm-score-bars",
										children: [
											[
												"maintain",
												t("scoreDimMaintain"),
												score.breakdown.maintain
											],
											[
												"practical",
												t("scoreDimPractical"),
												score.breakdown.practical
											],
											[
												"popularity",
												t("scoreDimPopularity"),
												score.breakdown.popularity
											],
											[
												"ease",
												t("scoreDimEase"),
												score.breakdown.ease
											],
											[
												"signal",
												t("scoreDimSignal"),
												score.breakdown.signal
											]
										].map(([key, label, v]) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "pcm-score-bar",
											children: [
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
													className: "pcm-score-dim",
													children: label
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
													className: "pcm-score-track",
													children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
														className: "pcm-score-fill",
														style: { width: (v === null ? 0 : v) + "%" }
													})
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", {
													className: "pcm-score-val",
													children: v === null ? t("scorePending") : v
												})
											]
										}, key))
									})
								]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "pcm-score-radar",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RadarChart, {
									breakdown: score.breakdown,
									total: score.total,
									tooltipLang: langChoice === "zh" ? "zh" : "en",
									size: 184,
									labels: {
										maintain: t("scoreDimMaintain"),
										practical: t("scoreDimPractical"),
										popularity: t("scoreDimPopularity"),
										ease: t("scoreDimEase"),
										signal: t("scoreDimSignal")
									},
									totalLabel: t("scoreTotalLabel")
								})
							})]
						}),
						entry.dormant === true && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "pcm-risk pcm-risk-community",
							children: props.t("dormantHint")
						}),
						entry.npmLinked === false && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "pcm-risk pcm-risk-community",
							children: props.t("npmUnlinkedHint")
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
										className: k === t("detailStars") ? "pcm-detail-cellv pcm-meta-star" : "pcm-detail-cellv",
										children: k === t("detailStars") ? "★ " + v : v
									})]
								}, k))
							})]
						}),
						((entry.topics ?? []).length > 0 || tags.length > 0) && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "pcm-detail-sec",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "pcm-detail-sec-title",
								children: t("detailTopics")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "pcm-detail-topics",
								children: [tags.map((tp) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "pcm-detail-topic pcm-detail-tag",
									children: tp
								}, "tag-" + tp)), (entry.topics ?? []).map((tp) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "pcm-detail-topic",
									children: tp
								}, tp))]
							})]
						}),
						props.related.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "pcm-detail-sec",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "pcm-detail-sec-title",
								children: t("detailRelated")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "pcm-related-list",
								children: props.related.map((r) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "pcm-detail-related",
									onClick: () => props.onOpenEntry(r),
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "pcm-related-title",
											children: r.name
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "pcm-related-desc",
											children: r.tagDescriptions?.[langChoice] && r.tagDescriptions[langChoice] !== "" ? r.tagDescriptions[langChoice] : langChoice !== "en" && r.descriptions?.[langChoice] && r.descriptions[langChoice] !== "" ? r.descriptions[langChoice] : r.description === "" ? "—" : r.description
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											className: "pcm-related-sub",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
												className: "pcm-related-stars",
												children: ["★ ", formatStars(r.stars)]
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "pcm-related-dev",
												children: r.owner
											})]
										})
									]
								}, r.owner + "/" + r.name))
							})]
						})
					]
				})]
			})
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(BackToTop, {
			target: scrollRef,
			label: t("backTop")
		})]
	});
}
//#endregion
//#region src/client/QuizView.tsx
/**
* v1.7.55 冷启动问卷（对标 dsh.market QuizView）：
* 没装什么插件时，用 30 秒功能选择建立偏好画像，驱动「为你推荐」。
* - 全店语言统一走 storeLang（zh/en）
* - 选中上限 5 个，至少 1 个才能看推荐
* - 提交 → onComplete(answers: string[]) → host 持久化 state.json + 重新计算推荐
*/
const QUIZ_FEATURES = [
	{
		id: "vision",
		emoji: "🔍",
		zh: "视觉识别",
		en: "Vision & OCR"
	},
	{
		id: "files",
		emoji: "📄",
		zh: "文件处理",
		en: "Files & Docs"
	},
	{
		id: "browser",
		emoji: "🌐",
		zh: "浏览器控制",
		en: "Browser Control"
	},
	{
		id: "notify",
		emoji: "🔔",
		zh: "通知推送",
		en: "Notifications"
	},
	{
		id: "search",
		emoji: "🔎",
		zh: "搜索增强",
		en: "Search"
	},
	{
		id: "memory",
		emoji: "🧠",
		zh: "会话记忆",
		en: "Memory"
	},
	{
		id: "devtools",
		emoji: "🛠️",
		zh: "开发工具",
		en: "DevTools"
	},
	{
		id: "data",
		emoji: "📊",
		zh: "数据看板",
		en: "Analytics"
	},
	{
		id: "fun",
		emoji: "🎮",
		zh: "游戏娱乐",
		en: "Fun & Games"
	},
	{
		id: "theme",
		emoji: "🎨",
		zh: "皮肤主题",
		en: "Themes"
	},
	{
		id: "voice",
		emoji: "🎙️",
		zh: "语音音频",
		en: "Voice & Audio"
	},
	{
		id: "imagegen",
		emoji: "🖼️",
		zh: "图像生成",
		en: "Image Gen"
	},
	{
		id: "agent",
		emoji: "🤖",
		zh: "智能体",
		en: "Agents"
	},
	{
		id: "security",
		emoji: "🛡️",
		zh: "安全审计",
		en: "Security"
	}
];
function QuizView(props) {
	const [picked, setPicked] = (0, react.useState)([]);
	const zh = props.lang === "zh";
	const MAX = 5;
	const toggle = (id) => {
		setPicked((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= MAX ? prev : [...prev, id]);
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
		open: props.open,
		onClose: props.onClose,
		title: "DSH Mall",
		headless: true,
		className: "pcm-quiz-modal",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: "pcm-quiz",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "pcm-quiz-head",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "pcm-quiz-badge",
							children: props.t("quizBadge")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "pcm-quiz-title",
							children: props.t("quizTitle")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "pcm-quiz-sub",
							children: props.t("quizSub")
						})
					]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "pcm-quiz-body",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pcm-quiz-count",
						children: [
							props.t("quizPicked"),
							" ",
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: picked.length }),
							"/",
							MAX
						]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pcm-quiz-grid",
						children: QUIZ_FEATURES.map((f) => {
							const on = picked.includes(f.id);
							return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								className: on ? "pcm-quiz-chip pcm-quiz-chip-on" : "pcm-quiz-chip",
								onClick: () => toggle(f.id),
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "pcm-quiz-emoji",
										children: f.emoji
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "pcm-quiz-label",
										children: zh ? f.zh : f.en
									}),
									on && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "pcm-quiz-check",
										"aria-hidden": "true",
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
											width: "11",
											height: "11",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: "3",
											strokeLinecap: "round",
											strokeLinejoin: "round",
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M20 6 9 17l-5-5" })
										})
									})
								]
							}, f.id);
						})
					})]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "pcm-quiz-foot",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "ghost",
						size: "sm",
						onClick: props.onClose,
						children: props.t("quizSkip")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "primary",
						size: "sm",
						className: "pcm-quiz-go",
						disabled: picked.length === 0,
						onClick: () => props.onComplete(picked),
						children: [
							props.t("quizGo"),
							" ",
							picked.length > 0 ? "(" + picked.length + ")" : ""
						]
					})]
				})
			]
		})
	});
}
//#endregion
//#region src/client/icon.ts
/** dsh-mall brand icon (64px, base64-inlined so the client bundle stays self-contained). */
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
//#region src/client/task-store.ts
let tasks = [];
let seq = 0;
const listeners = /* @__PURE__ */ new Set();
const taskStore = {
	get() {
		return tasks;
	},
	set(next) {
		tasks = next;
		for (const fn of listeners) fn();
	},
	subscribe(fn) {
		listeners.add(fn);
		return () => {
			listeners.delete(fn);
		};
	},
	nextId() {
		return "task-" + String(++seq) + "-" + String(Date.now() % 1e5);
	}
};
//#endregion
//#region src/client/MarketSection.tsx
/**
* The market settings section: category chips, search, sort, filters, the
* repo grid with install/uninstall, and the publish dialog. All filtering
* and sorting run on the in-memory list; the network is only touched on
* mount, explicit refresh, and the quiet refresh after filter changes.
*/
const PAGE_SIZES = [
	20,
	50,
	100
];
function MarketSection(props) {
	const t = props.t;
	const floating = props.floating === true;
	const lang = (0, react.useSyncExternalStore)((cb) => storeLang.subscribe(cb), () => storeLang.get());
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
	const [scannedOnly, setScannedOnly] = (0, react.useState)(false);
	const [skillOnly, setSkillOnly] = (0, react.useState)(false);
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
			const saved = localStorage.getItem("dsh-mall-lang");
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
			localStorage.setItem("dsh-mall-lang", l);
		} catch {}
	}, []);
	const [langOpen, setLangOpen] = (0, react.useState)(false);
	const [page, setPage] = (0, react.useState)(1);
	const [pageSize, setPageSize] = (0, react.useState)(20);
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
		fetch("/dsh-mall/smart-search", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ query })
		}).then((res) => res.json()).then((body) => {
			if (body.ok === true && body.payload !== void 0) window.dispatchEvent(new CustomEvent("dsh-mall-open-results", { detail: { payload: body.payload } }));
			else setToast(t("installFailed") + ": " + (body.error ?? ""));
		}).catch(() => setToast(t("installFailed"))).finally(() => setSmartSearchBusy(false));
	}, [
		smartSearchBusy,
		q,
		t
	]);
	const tasks = (0, react.useSyncExternalStore)((cb) => taskStore.subscribe(cb), () => taskStore.get());
	const [tasksOpen, setTasksOpen] = (0, react.useState)(false);
	const [whyEntry, setWhyEntry] = (0, react.useState)(null);
	const tasksAnchorRef = (0, react.useRef)(null);
	const nextTaskId = () => taskStore.nextId();
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
		taskStore.set(patchTask(taskStore.get(), id, body.ok === true ? {
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
		fetch("/dsh-mall/registry" + (force ? "?force=1" : ""), { cache: "no-store" }).then((res) => {
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
						if (old.bundled !== void 0 && old.bundled !== null) merged.bundled = old.bundled;
						if (old.bundledAt !== void 0) merged.bundledAt = old.bundledAt;
						if (old.hasSkill !== void 0 && old.hasSkill !== null) merged.hasSkill = old.hasSkill;
						if (old.score !== void 0 && merged.score === void 0) merged.score = old.score;
						if (old.installCmds !== void 0) merged.installCmds = old.installCmds;
						if (old.cmdSource !== void 0) merged.cmdSource = old.cmdSource;
						return merged;
					})
				};
			});
			if (body.fetchAt !== void 0) setFetchAt(body.fetchAt);
			setLoadError(false);
		}).catch(() => setLoadError(true));
	}, []);
	const fetchStatus = (0, react.useCallback)(() => {
		fetch("/dsh-mall/status", { cache: "no-store" }).then((res) => res.json()).then((body) => setStatus(body)).catch(() => {});
	}, []);
	(0, react.useEffect)(() => {
		fetch("/dsh-mall/favorites", { cache: "no-store" }).then((res) => res.json()).then((body) => setFavorites(new Set(body.favorites ?? []))).catch(() => {});
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
		fetch("/dsh-mall/verify", {
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
		return c === void 0 ? id : c[lang === "zh" ? "zh" : "en"] ?? c.en;
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
		for (const u of status?.installedRepos ?? []) if (typeof u.repo === "string" && u.repo.includes("/")) repos.add(u.repo.toLowerCase());
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
		const curatedNames = /* @__PURE__ */ new Map();
		const curatedNpms = /* @__PURE__ */ new Map();
		for (const p of plugins) {
			const n = p.name.toLowerCase();
			names.set(n, (names.get(n) ?? 0) + 1);
			if (p.curated) curatedNames.set(n, (curatedNames.get(n) ?? 0) + 1);
			if (p.npm !== null) {
				const pn = p.npm.toLowerCase();
				npms.set(pn, (npms.get(pn) ?? 0) + 1);
				if (p.curated) curatedNpms.set(pn, (curatedNpms.get(pn) ?? 0) + 1);
			}
		}
		return {
			names,
			npms,
			curatedNames,
			curatedNpms
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
		if (installedInfo.names.has(nm) && (identityCounts.names.get(nm) === 1 || e.curated && identityCounts.curatedNames.get(nm) === 1)) return true;
		if (e.npm !== null) {
			const pn = e.npm.toLowerCase();
			if (installedInfo.names.has(pn) && (identityCounts.npms.get(pn) === 1 || e.curated && identityCounts.curatedNpms.get(pn) === 1)) return true;
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
		fetch("/dsh-mall/favorites", {
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
			if (scannedOnly && p.bundled !== true) continue;
			if (skillOnly && p.hasSkill !== true) continue;
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
		scannedOnly,
		skillOnly
	]);
	const [recommend, setRecommend] = (0, react.useState)(null);
	const [profileStats, setProfileStats] = (0, react.useState)(null);
	const [quizOpen, setQuizOpen] = (0, react.useState)(false);
	const lastInstalledRef = (0, react.useRef)("");
	(0, react.useEffect)(() => {
		if (seedMode) return;
		const installedKey = JSON.stringify(status?.installed ?? {});
		fetch("/dsh-mall/recommend", { cache: "no-store" }).then((res) => res.json()).then((body) => {
			setRecommend(Array.isArray(body.items) ? body.items : []);
			setProfileStats(body.stats ?? null);
		}).catch(() => setRecommend([]));
		lastInstalledRef.current = installedKey;
	}, [status?.installed, seedMode]);
	const submitQuiz = (answers) => {
		setQuizOpen(false);
		fetch("/dsh-mall/recommend", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ quiz: answers })
		}).then((res) => res.json()).then((body) => {
			setRecommend(Array.isArray(body.items) ? body.items : []);
			setProfileStats(body.stats ?? null);
		}).catch(() => {});
	};
	const editorPicks = (() => {
		const [picks, setPicks] = (0, react.useState)([]);
		const weekKeyOf = (d) => {
			const day = (d.getDay() + 6) % 7;
			const mon = new Date(d.getFullYear(), d.getMonth(), d.getDate() - day);
			return mon.getFullYear() + "-" + String(mon.getMonth() + 1).padStart(2, "0") + "-" + String(mon.getDate()).padStart(2, "0");
		};
		const computePicks = (pluginsAll) => pluginsAll.filter((p) => p.curated === true && p.excluded == null && p.isPlugin !== false).sort((a, b) => (b.score?.total ?? 0) - (a.score?.total ?? 0)).slice(0, 6);
		(0, react.useEffect)(() => {
			if (data === null) return;
			const wk = weekKeyOf(/* @__PURE__ */ new Date());
			let storedWeek = "";
			let storedNames = [];
			try {
				const raw = localStorage.getItem("dsh-mall-picks-week");
				if (raw !== null) {
					const o = JSON.parse(raw);
					storedWeek = o.week ?? "";
					storedNames = Array.isArray(o.names) ? o.names : [];
				}
			} catch {}
			if (storedWeek === wk && storedNames.length > 0) {
				const byKey = new Map(data.plugins.map((p) => [(p.owner + "/" + p.name).toLowerCase(), p]));
				const restored = storedNames.map((n) => byKey.get(n.toLowerCase())).filter((p) => p !== void 0);
				if (restored.length === 6) {
					setPicks(restored);
					return;
				}
			}
			const fresh = computePicks(data.plugins);
			setPicks(fresh);
			try {
				localStorage.setItem("dsh-mall-picks-week", JSON.stringify({
					week: wk,
					names: fresh.map((p) => p.owner + "/" + p.name)
				}));
			} catch {}
		}, [data]);
		return picks;
	})();
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
		sinceDays: 0,
		lang,
		scannedOnly,
		skillOnly
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
		scannedOnly,
		skillOnly
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
		fetch("/dsh-mall/descriptions", {
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
		fetch("/dsh-mall/versions", {
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
		fetch("/dsh-mall/downloads", {
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
		const todo = pageList.filter((e) => e.local !== true && !scansRequested.current.has((e.owner + "/" + e.name).toLowerCase())).filter((e) => {
			if (e.bundled === null || e.bundled === void 0 || e.bundled === false) return true;
			if (e.bundledAt === null || e.bundledAt === void 0 || e.pushed === null) return false;
			return Date.parse(e.pushed) > Date.parse(e.bundledAt);
		}).slice(0, 24);
		if (todo.length === 0) return;
		for (const e of todo) scansRequested.current.add((e.owner + "/" + e.name).toLowerCase());
		fetch("/dsh-mall/scan", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ repos: todo.map((e) => e.owner + "/" + e.name) })
		}).then((res) => res.json()).then((body) => {
			const gotB = body.bundles ?? {};
			const gotS = body.skills ?? {};
			if (Object.keys(gotB).length === 0 && Object.keys(gotS).length === 0) return;
			setData((prev) => {
				if (prev === null) return prev;
				return {
					...prev,
					plugins: prev.plugins.map((e) => {
						const key = e.owner + "/" + e.name;
						const hitB = gotB[key];
						const hitS = gotS[key];
						if (hitB === void 0 && hitS === void 0) return e;
						const next = { ...e };
						if (hitB !== void 0) {
							next.bundled = hitB;
							next.bundledAt = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
						}
						if (hitS !== void 0) next.hasSkill = hitS;
						return next;
					})
				};
			});
		}).catch(() => {});
	}, [pageList, data]);
	const scoresRequested = (0, react.useRef)(/* @__PURE__ */ new Set());
	(0, react.useEffect)(() => {
		if (data === null || seedMode) return;
		const todo = pageList.filter((e) => e.local !== true && !scoresRequested.current.has((e.owner + "/" + e.name).toLowerCase())).filter((e) => e.score == null || e.score.complete !== true).slice(0, 24);
		if (todo.length === 0) return;
		for (const e of todo) scoresRequested.current.add((e.owner + "/" + e.name).toLowerCase());
		fetch("/dsh-mall/scores", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ items: todo.map((e) => ({
				repo: e.owner + "/" + e.name,
				branch: e.defaultBranch ?? "main"
			})) })
		}).then((res) => res.json()).then((body) => {
			const got = body.scores ?? {};
			if (Object.keys(got).length === 0) return;
			setData((prev) => {
				if (prev === null) return prev;
				return {
					...prev,
					plugins: prev.plugins.map((e) => {
						const hit = got[e.owner + "/" + e.name];
						if (hit === void 0 || hit.score == null) return e;
						const next = {
							...e,
							score: hit.score
						};
						if (hit.installCmds.length > 0) {
							next.installCmds = hit.installCmds;
							next.cmdSource = hit.cmdSource;
						}
						return next;
					})
				};
			});
		}).catch(() => {});
	}, [
		pageList,
		data,
		seedMode
	]);
	const doSmartInstall = (0, react.useCallback)((entry) => {
		setConfirming(null);
		const id = nextTaskId();
		taskStore.set(enqueueTask(taskStore.get(), {
			id,
			kind: "smart-install",
			name: entry.npm ?? entry.owner + "/" + entry.name,
			state: "running",
			detail: t("smartInstallHint"),
			reason: null,
			at: Date.now()
		}));
		setTasksOpen(true);
		fetch("/dsh-mall/smart-install", {
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
		taskStore.set(enqueueTask(taskStore.get(), {
			id,
			kind: "install",
			name: entry.npm ?? entry.owner + "/" + entry.name,
			state: "running",
			detail: entry.owner + "/" + entry.name,
			reason: null,
			at: Date.now()
		}));
		fetch("/dsh-mall/install", {
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
		taskStore.set(enqueueTask(taskStore.get(), {
			id,
			kind: "uninstall",
			name: entry.name,
			state: "running",
			detail: null,
			reason: null,
			at: Date.now()
		}));
		fetch("/dsh-mall/uninstall", {
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
		taskStore.set(enqueueTask(taskStore.get(), {
			id,
			kind: "uninstall",
			name: entry.npm ?? entry.owner + "/" + entry.name,
			state: "running",
			detail: entry.owner + "/" + entry.name,
			reason: null,
			at: Date.now()
		}));
		fetch("/dsh-mall/uninstall", {
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
		fetch("/dsh-mall/smart-uninstall", {
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
		taskStore.set(enqueueTask(taskStore.get(), {
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
		taskStore.set(patchTask(taskStore.get(), pending.taskId, {
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
		fetch("/dsh-mall/update", {
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
		taskStore.set(enqueueTask(taskStore.get(), {
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
		taskStore.set(enqueueTask(taskStore.get(), {
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
		taskStore.set(enqueueTask(taskStore.get(), {
			id,
			kind: "smart-update",
			name: u.name,
			state: "running",
			detail: u.from + " → " + u.to,
			reason: null,
			at: Date.now()
		}));
		setTasksOpen(true);
		fetch("/dsh-mall/smart-update", {
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
		fetch("/dsh-mall/toggle", {
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
		taskStore.set(enqueueTask(taskStore.get(), {
			id,
			kind: "rollback",
			name: depName,
			state: "running",
			detail: t("rollbackBtn"),
			reason: null,
			at: Date.now()
		}));
		setRollbacking(e.name);
		fetch("/dsh-mall/rollback", {
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
		fetch("/dsh-mall/skip", {
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
		taskStore.set(enqueueTask(taskStore.get(), {
			id,
			kind: "update",
			name: "dsh-mall",
			state: "running",
			detail: selfUpdate.from + " → " + selfUpdate.to,
			reason: null,
			at: Date.now()
		}));
		fetch("/dsh-mall/self-update", { method: "POST" }).then((res) => res.json()).then((body) => {
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
			id: "score",
			label: t("sortScore")
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
	], [t, lang]);
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
					!seedMode ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
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
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pcm-brand-card pcm-seed-tasks-bar",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "pcm-header",
							style: { gap: 8 },
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
									className: "pcm-icon",
									src: ICON_DATA,
									alt: "",
									width: 18,
									height: 18
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "pcm-seed-tasks-title",
									style: {
										flex: "1 1 auto",
										color: "#f5f7ff",
										fontSize: 13,
										fontWeight: 600
									},
									children: t("resultsTitle")
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
							data !== null && data.source === "cdn" && (status?.progress?.lastError ?? null) !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "pcm-degraded",
								title: status?.progress?.lastError ?? "",
								children: t("indexDegraded")
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
									storeLang.set([
										"zh",
										"en",
										"ja",
										"ko",
										"es",
										"fr",
										"de",
										"pt",
										"ru"
									].includes(id) ? id : "en");
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
					!seedMode && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pcm-search-row",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "pcm-search-wrap pcm-search-wrap-full",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
								className: "pcm-search pcm-search-big",
								icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSearchOutline16, { size: 16 }),
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
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "pcm-smart-search-btn pcm-smart-search-btn-big",
							title: t("smartSearchHint"),
							disabled: smartSearchBusy,
							onClick: doSmartSearch,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "pcm-smart-star",
								children: "✦"
							}), smartSearchBusy ? t("smartSearching") : t("smartSearch")]
						})]
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
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Pill, {
								className: scannedOnly ? "pcm-pill-scanned pcm-pill-scanned-on" : "pcm-pill-scanned",
								active: scannedOnly,
								onClick: () => {
									setScannedOnly((v) => !v);
									setPage(1);
								},
								title: t("scannedHint"),
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
										className: "pcm-pill-shield",
										width: "12",
										height: "12",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "2",
										strokeLinecap: "round",
										strokeLinejoin: "round",
										"aria-hidden": "true",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 2l8 3v6c0 5-3.4 9.3-8 11-4.6-1.7-8-6-8-11V5l8-3z" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M9 12l2 2 4-4" })]
									}),
									t("scannedChip"),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "pcm-count",
										children: scannedCount
									})
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Pill, {
								className: verifiedOnly ? "pcm-pill-verified pcm-pill-verified-on" : "pcm-pill-verified",
								active: verifiedOnly,
								onClick: () => {
									setVerifiedOnly((v) => !v);
									setPage(1);
								},
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
									className: "pcm-pill-person",
									width: "12",
									height: "12",
									viewBox: "0 0 24 24",
									fill: "currentColor",
									"aria-hidden": "true",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
										cx: "12",
										cy: "7.6",
										r: "3.4"
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M5.6 20.2c1.1-3.4 3.6-5.1 6.4-5.1s5.3 1.7 6.4 5.1c.3.8-.3 1.6-1.1 1.6H6.7c-.8 0-1.4-.8-1.1-1.6z" })]
								}), t("verifiedOnly")]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Pill, {
								className: skillOnly ? "pcm-pill-skill pcm-pill-skill-on" : "pcm-pill-skill",
								active: skillOnly,
								onClick: () => {
									setSkillOnly((v) => !v);
									setPage(1);
								},
								title: t("skillChipHint"),
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
									className: "pcm-pill-skill-icon",
									width: "12",
									height: "12",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "2",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									"aria-hidden": "true",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 3.6 2.8 9.3l9.2 5.7 9.2-5.7z" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M6.6 12.3v4.2c0 1.6 2.4 2.9 5.4 2.9s5.4-1.3 5.4-2.9v-4.2" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M21.2 9.3v5.4" })
									]
								}), t("skillChip")]
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
							!floating && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "pcm-lang-wrap",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Menu, {
									open: langOpen,
									onClose: () => setLangOpen(false),
									onSelect: (id) => {
										setLangPersist(id);
										storeLang.set([
											"zh",
											"en",
											"ja",
											"ko",
											"es",
											"fr",
											"de",
											"pt",
											"ru"
										].includes(id) ? id : "en");
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
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "pcm-sort-wrap",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Menu, {
									open: sortOpen,
									onClose: () => setSortOpen(false),
									onSelect: (id) => {
										if (id === "stars" || id === "today" || id === "created" || id === "downloads" || id === "score") setSortDim(id);
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
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "pcm-scroll",
				ref: scrollRef,
				children: [!seedMode && q.trim() === "" && ((recommend?.length ?? 0) > 0 || editorPicks.length > 0 || profileStats?.showQuiz === true) && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "pcm-featured",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pcm-picks pcm-editor-picks",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "pcm-picks-head",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
									className: "pcm-picks-flag",
									width: "16",
									height: "16",
									viewBox: "0 0 24 24",
									fill: "none",
									"aria-hidden": "true",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4L12 17.4l-5.8 3 1.1-6.4-4.7-4.6 6.5-.9z",
										stroke: "#d99a1f",
										strokeWidth: "1.8",
										strokeLinejoin: "round"
									})
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "pcm-picks-title",
									children: t("picksTitle")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "pcm-picks-weekly",
									children: t("picksWeekly")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "pcm-picks-sub",
									children: t("curatedBadgeTitle")
								})
							]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "pcm-picks-grid",
							children: editorPicks.map((r) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "pcm-pick",
								onClick: () => setDetail(r),
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "pcm-pick-name",
										children: r.name
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "pcm-pick-owner",
										children: r.owner
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
										className: "pcm-pick-meta",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											className: "pcm-pick-star",
											children: ["★ ", formatStars(r.stars)]
										}), r.score?.total != null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											className: "pcm-pick-score",
											children: [
												t("scoreTotalLabel"),
												" ",
												r.score.total
											]
										})]
									})
								]
							}, "pick-" + r.owner + "/" + r.name))
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pcm-picks pcm-recommend",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "pcm-picks-head",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
										className: "pcm-picks-flag",
										width: "16",
										height: "16",
										viewBox: "0 0 24 24",
										fill: "none",
										"aria-hidden": "true",
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
											d: "M12 2l3.4 6.9 7.6 1.1-5.5 5.4 1.3 7.6L12 19.6 5.2 23l1.3-7.6L1 10l7.6-1.1z",
											stroke: "#4d6bfe",
											strokeWidth: "1.8",
											strokeLinejoin: "round"
										})
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "pcm-picks-title",
										children: t("recommendTitle")
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "pcm-rec-daily",
										children: t("recDaily")
									}),
									profileStats != null && profileStats.days > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "pcm-rec-chip",
										title: t("recProfileChip").replace("{0}", String(profileStats.days)),
										children: t("recProfileChip").replace("{0}", String(profileStats.days))
									}),
									profileStats?.hasQuiz === true && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "pcm-rec-retake",
										onClick: () => setQuizOpen(true),
										children: t("recRetakeQuiz")
									})
								]
							}),
							profileStats?.showQuiz === true && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "pcm-rec-quiz",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "pcm-rec-quiz-emoji",
										children: "🧭"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "pcm-rec-quiz-body",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
											className: "pcm-rec-quiz-title",
											children: t("recQuizCtaTitle")
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
											className: "pcm-rec-quiz-sub",
											children: t("recQuizCtaSub")
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										variant: "primary",
										size: "sm",
										className: "pcm-rec-quiz-btn",
										onClick: () => setQuizOpen(true),
										children: t("recQuizCtaBtn")
									})
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "pcm-rec-list",
								children: (recommend ?? []).slice(0, 4).map((r) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "pcm-pick",
									title: r.reasons.join("；"),
									onClick: () => setDetail(r.entry),
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "pcm-pick-name",
											children: r.entry.name
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "pcm-pick-owner",
											children: r.entry.owner
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											className: "pcm-pick-meta",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
												className: "pcm-pick-star",
												children: ["★ ", formatStars(r.entry.stars)]
											}), r.entry.score?.total != null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
												className: "pcm-pick-score",
												children: [
													t("scoreTotalLabel"),
													" ",
													r.entry.score.total
												]
											})]
										})
									]
								}, r.entry.owner + "/" + r.entry.name))
							})
						]
					})]
				}), list.length === 0 ? data === null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "pcm-empty",
					children: t("loading")
				}) : q.trim() !== "" || scannedOnly || skillOnly || curatedOnly || verifiedOnly || installedOnly || favOnly || cat !== "all" || kind !== "all" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "pcm-empty",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { children: t("emptyFiltered") })
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "pcm-empty",
					children: t("empty")
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(react_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "pcm-grid",
					children: pageList.map((entry) => {
						const installed = isInstalled(entry);
						entry.todayStars;
						const upd = updateFor(entry);
						const disclosure = entry.disclosure;
						return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: entry.local === true ? "pcm-card pcm-card-local" : "pcm-card",
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
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "pcm-card-mid" + (entry.score != null && entry.score.complete ? " pcm-card-mid-radar" : ""),
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "pcm-card-left",
										children: [
											(entry.curated || entry.verified != null || disclosure != null || entry.hasSkill === true || entry.bundled === true) && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
												className: "pcm-safety-row",
												children: [
													entry.curated && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
														className: "pcm-safety pcm-safety-curated",
														title: t("curatedBadgeTitle"),
														children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
															width: "11",
															height: "11",
															viewBox: "0 0 24 24",
															fill: "none",
															stroke: "currentColor",
															strokeWidth: "2.2",
															strokeLinecap: "round",
															strokeLinejoin: "round",
															"aria-hidden": "true",
															children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4L12 17.4l-5.8 3 1.1-6.4-4.7-4.6 6.5-.9z" })
														}), t("curatedBadge")]
													}),
													entry.verified != null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
														className: "pcm-safety pcm-safety-verified",
														title: t("verifiedBadgeHint") + " · " + entry.verified.by,
														children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
															width: "12",
															height: "12",
															viewBox: "0 0 24 24",
															fill: "currentColor",
															"aria-hidden": "true",
															children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
																cx: "12",
																cy: "7.6",
																r: "3.4"
															}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M5.6 20.2c1.1-3.4 3.6-5.1 6.4-5.1s5.3 1.7 6.4 5.1c.3.8-.3 1.6-1.1 1.6H6.7c-.8 0-1.4-.8-1.1-1.6z" })]
														}), t("verifiedBadge")]
													}),
													entry.bundled === true && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
														className: "pcm-safety pcm-safety-scanned",
														title: t("scannedBadgeHint"),
														children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
															width: "11",
															height: "11",
															viewBox: "0 0 24 24",
															fill: "none",
															stroke: "currentColor",
															strokeWidth: "2.2",
															strokeLinecap: "round",
															strokeLinejoin: "round",
															"aria-hidden": "true",
															children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 2.4l7.5 2.8v5.6c0 4.7-3.2 8.7-7.5 10.2-4.3-1.5-7.5-5.5-7.5-10.2V5.2l7.5-2.8z" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M9 11.6l2 2 4-4.2" })]
														}), t("scannedBadge")]
													}),
													entry.hasSkill === true && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
														className: "pcm-safety pcm-safety-skill",
														title: t("skillBadgeHint"),
														children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
															width: "11",
															height: "11",
															viewBox: "0 0 24 24",
															fill: "none",
															stroke: "currentColor",
															strokeWidth: "2.2",
															strokeLinecap: "round",
															strokeLinejoin: "round",
															"aria-hidden": "true",
															children: [
																/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 3.6 2.8 9.3l9.2 5.7 9.2-5.7z" }),
																/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M6.6 12.3v4.2c0 1.6 2.4 2.9 5.4 2.9s5.4-1.3 5.4-2.9v-4.2" }),
																/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M21.2 9.3v5.4" })
															]
														}), t("skillBadge")]
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
													const tagged = entry.tagDescriptions?.[langChoice];
													if (tagged !== void 0 && tagged !== "") return tagged;
													const d = langChoice !== "en" && entry.descriptions?.[langChoice] ? entry.descriptions[langChoice] : entry.description;
													return d === "" ? "—" : d;
												})()
											}),
											(() => {
												const tags = langChoice === "zh" ? entry.tagsZh ?? [] : (entry.tagsEn ?? []).length > 0 ? entry.tagsEn : entry.tagsZh;
												return (tags ?? []).length > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
													className: "pcm-tags-mini",
													children: (tags ?? []).slice(0, 3).map((tag) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
														className: "pcm-tag-mini",
														children: tag
													}, tag))
												}) : null;
											})(),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
												className: "pcm-stats2",
												children: [
													typeof entry.todayStars === "number" && entry.todayStars > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
														className: "pcm-today pcm-today-up",
														title: t("todayGainHint"),
														children: [
															t("todayGain"),
															"+",
															entry.todayStars,
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
											})
										]
									}), entry.score != null && entry.score.complete && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: "pcm-radar-wrap",
										title: t("cardRadarHint"),
										onClick: (e) => e.stopPropagation(),
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RadarChart, {
											breakdown: entry.score.breakdown,
											total: entry.score.total,
											tooltipLang: lang === "zh" ? "zh" : "en",
											size: 140,
											labels: {
												maintain: t("scoreDimMaintain"),
												practical: t("scoreDimPractical"),
												popularity: t("scoreDimPopularity"),
												ease: t("scoreDimEase"),
												signal: t("scoreDimSignal")
											},
											totalLabel: t("scoreTotalLabel")
										})
									})]
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
									children: [
										(stateOf(entry) === "restart" || status?.restartNeeded?.[entry.npm ?? entry.name] === true && (status.installsAt?.[entry.npm ?? entry.name] ?? 0) > (status.startedAt ?? 0) || status?.restartNeeded?.[entry.name] === true && (status.installsAt?.[entry.name] ?? 0) > (status.startedAt ?? 0)) && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "pcm-restart-note",
											children: [
												/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
													className: "pcm-restart-chip",
													children: ["⏳ ", t("stateRestart")]
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
													type: "button",
													className: "pcm-restart-why" + (whyEntry === (entry.npm ?? entry.name) ? " pcm-restart-why-open" : ""),
													onClick: (e) => {
														e.stopPropagation();
														setWhyEntry((prev) => prev === (entry.npm ?? entry.name) ? null : entry.npm ?? entry.name);
													},
													children: [t("whyNotEffective"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
														className: "pcm-restart-why-caret",
														"aria-hidden": "true"
													})]
												}),
												whyEntry === (entry.npm ?? entry.name) && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
													className: "pcm-restart-why-body",
													children: t("whyNotEffectiveBody")
												})
											]
										}),
										upd !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
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
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
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
												!(entry.npm ?? entry.name).startsWith("@deepseek-ai/") && (entry.npm ?? entry.name) !== "dsh-mall" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: "pcm-vsep" }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
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
										})
									]
								})
							]
						}, (entry.local === true ? "local:" : "") + entry.owner + "/" + entry.name);
					})
				}) })]
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
				categoryLabel: (cat) => data?.categories?.[cat]?.[langChoice === "zh" ? "zh" : "en"] ?? cat,
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
			quizOpen && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(QuizView, {
				open: quizOpen,
				lang: langChoice,
				t,
				onClose: () => setQuizOpen(false),
				onComplete: submitQuiz
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
				onClearSettled: () => taskStore.set(clearSettledTasks(taskStore.get())),
				onDismiss: (id) => taskStore.set(dismissTask(taskStore.get(), id)),
				onCancelTask: (id) => {
					fetch("/dsh-mall/cancel", {
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
	const [readmeCmds, setReadmeCmds] = (0, react.useState)(() => entry.installCmds !== void 0 && entry.installCmds !== null ? {
		commands: entry.installCmds,
		source: entry.cmdSource ?? "readme"
	} : {
		commands: [],
		source: "template"
	});
	(0, react.useEffect)(() => {
		if (readmeCmds.commands.length > 0) return;
		let alive = true;
		fetch("/dsh-mall/readme?repo=" + encodeURIComponent(entry.owner + "/" + entry.name) + "&file=README.md&branch=" + encodeURIComponent(entry.defaultBranch ?? "main")).then((res) => res.json()).then((body) => {
			if (alive && body.ok === true && Array.isArray(body.installCmds) && body.installCmds.length > 0) setReadmeCmds({
				commands: body.installCmds,
				source: body.cmdSource ?? "readme"
			});
		}).catch(() => {});
		return () => {
			alive = false;
		};
	}, [
		entry.owner,
		entry.name,
		entry.defaultBranch
	]);
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
				readmeCmds.commands.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "pcm-readme-cmds",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "pcm-readme-cmds-title",
						children: [t("readmeCmdsTitle"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "pcm-readme-cmds-src",
							children: readmeCmds.source === "readme-section" ? t("readmeCmdsFromSection") : t("readmeCmdsFromReadme")
						})]
					}), readmeCmds.commands.map((cmd) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "pcm-cmd pcm-readme-cmd",
						children: cmd
					}, cmd))]
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
		fetch("/dsh-mall/publish/repos", { cache: "no-store" }).then((res) => res.json()).then((body) => setMyRepos(body.repos ?? [])).catch(() => {});
	};
	(0, react.useEffect)(loadMyRepos, []);
	const checkTopic = (target) => {
		setBusy(true);
		setResult(null);
		setError(null);
		fetch("/dsh-mall/publish", {
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
		fetch("/dsh-mall/publish", {
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
* DSH 商场设置页（v1.7.1）：作为官方「设置」浮窗里的一个 section 渲染
* （不再是独立浮窗）。内容：
* - 顶部大按钮「打开 DSH 商场」：打开独立商场浮窗；
* - 自动一键更新插件开关（说明 + 风险警告 + 上次运行结果）；
* - 数据源 URL / GitHub Token / 商场自身更新（设置功能载体）。
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
	const [selfBusy, setSelfBusy] = (0, react.useState)(false);
	const [selfDone, setSelfDone] = (0, react.useState)(false);
	(0, react.useEffect)(() => {
		fetch("/dsh-mall/status", { cache: "no-store" }).then((res) => res.json()).then((body) => {
			setStatus(body);
		}).catch(() => {});
		fetch("/dsh-mall/auto-update", { cache: "no-store" }).then((res) => res.json()).then((body) => {
			if (body.autoUpdate !== void 0) setAuto(body.autoUpdate);
		}).catch(() => {});
	}, []);
	const toggleAuto = () => {
		if (auto === null || autoBusy) return;
		const next = !auto.enabled;
		setAutoBusy(true);
		fetch("/dsh-mall/auto-update", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ enabled: next })
		}).then((res) => res.json()).then((body) => {
			if (body.autoUpdate !== void 0) setAuto(body.autoUpdate);
		}).catch(() => {}).finally(() => setAutoBusy(false));
	};
	const doSelfUpdate = () => {
		if (selfBusy || status?.selfUpdate?.to == null) return;
		setSelfBusy(true);
		fetch("/dsh-mall/self-update", { method: "POST" }).then((res) => res.json()).then((body) => {
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
* - SidebarStoreButton: sidebar 底部「DSH 商场」按钮 → 全尺寸商场浮窗。
* - StoreResultsLauncher: 全局点击拦截（/dsh-mall/open-results 链接，
*   由 find_dsh_mall_plugin 工具输出）→ 打开「推荐 + 其他相关」结果浮窗，
*   卡片样式与商场主页面一致（安装/源码/收藏星可用）。
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
/** 打开官方设置浮窗并自动定位到「DSH商场-设置」section（DOM 触发）。 */
function openSettingsAtStoreSection() {
	window.setTimeout(() => {
		Array.from(document.querySelectorAll("button")).find((b) => (b.textContent ?? "").trim() === "设置")?.click();
		let tries = 0;
		const timer = window.setInterval(() => {
			tries += 1;
			const nav = Array.from(document.querySelectorAll("button")).find((b) => (b.textContent ?? "").includes("DSH商场"));
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
/** 唯一商场浮窗宿主：订阅 store 状态，渲染同一个 StoreWindow 实例。 */
function StoreSingleton(props) {
	const state = (0, react.useSyncExternalStore)(subscribeStore, () => storeState);
	(0, react.useSyncExternalStore)((cb) => storeLang.subscribe(cb), () => storeLang.get());
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
	(0, react.useSyncExternalStore)((cb) => storeLang.subscribe(cb), () => storeLang.get());
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
		type: "button",
		className: "pcm-sidebar-btn" + (props.wide ? "" : " pcm-sidebar-rail"),
		title: props.t("nav"),
		onClick: () => openStoreFrom("sidebar"),
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
			className: "pcm-sidebar-icon",
			src: ICON_DATA,
			alt: "",
			width: 22,
			height: 22
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
			className: "pcm-sidebar-label",
			children: props.t("nav")
		})]
	});
}
/** 设置浮窗里的「DSH商场-设置」section：设置内容 + 顶部大按钮打开商场浮窗。 */
function SettingsSection(props) {
	(0, react.useSyncExternalStore)((cb) => storeLang.subscribe(cb), () => storeLang.get());
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
*  也监听 window 事件 'dsh-mall-open-results'（智能搜索直接带 payload 弹窗）。 */
function StoreResultsLauncher(props) {
	(0, react.useSyncExternalStore)((cb) => storeLang.subscribe(cb), () => storeLang.get());
	const [token, setToken] = (0, react.useState)(null);
	const [direct, setDirect] = (0, react.useState)(null);
	const onClick = (0, react.useCallback)((e) => {
		const anchor = e.target?.closest?.("a[href]");
		if (anchor === null) return;
		const href = anchor.getAttribute("href") ?? "";
		if (!href.includes("/dsh-mall/open-results")) return;
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
		window.addEventListener("dsh-mall-open-results", onOpen);
		return () => window.removeEventListener("dsh-mall-open-results", onOpen);
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
*  卡片内容/交互/功能与主商场浮窗完全一致（安装/卸载/更新/收藏/详情/任务）。 */
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
			const saved = localStorage.getItem("dsh-mall-lang");
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
			localStorage.setItem("dsh-mall-lang", l);
		} catch {}
	};
	const token = props.token;
	(0, react.useEffect)(() => {
		if (token === null || props.initialPayload !== null) return;
		let alive = true;
		fetch("/dsh-mall/query-result?id=" + encodeURIComponent(token), { cache: "no-store" }).then((res) => res.json()).then((body) => {
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
						width: 22,
						height: 22
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
						width: 22,
						height: 22
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
const CSS = ".pcm-root{display:flex;flex-direction:column;gap:12px;padding:4px 0 0;box-sizing:border-box}.pcm-sticky-top{position:sticky;top:0;z-index:5;background:var(--dsw-alias-bg-base,#fff);padding:4px 2px 8px;display:flex;flex-direction:column;gap:10px;border-bottom:1px solid rgba(128,128,128,.18)}.pcm-brand-card{background:#040506 url(data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHCAkIBgoJCAkMCwoMDxoRDw4ODx8WGBMaJSEnJiQhJCMpLjsyKSw4LCMkM0Y0OD0/QkNCKDFITUhATTtBQj//2wBDAQsMDA8NDx4RER4/KiQqPz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz//wAARCAQABgADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDxrNJRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUgCiiimAUUUUgCiiimAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFIAooopgFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUgCiiimAUUUUAFFFFABRRRQAUUUUAFFFFIAooopgFFFFIAooopgFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRQaACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAFFAooAKKKKACiiigAooooAKKKKACiiikAGig0UwCiiigAooooAKKKKACiiigAooooABRQKKACiiigAooopAFFFFMAooopAFFFFMAooopAFFFFMAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKQBRRRTAKKKKQBRRRTAKKKKQBRRRTAKKKKQBRRRTAKKKKQAaKDRTAKKKKACiiigAooooAKKKKACiiigAFFAooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooNFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRQKACiiikAUUUUwCiiigAooooAKKKKACiiigAooooAKKBRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUCiigAooopAFFFFMAooopAFFFFMAo70UUAFFFAoYBRRRQAUUUUAFFFFABRRRQAGiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKQAaKDRTAKKKKACiiigAooooAKKKBQAUUUUAAooooAKKKKACiiikAGiiimAUUUUgCiiimAUUUUgCiiimAUUUUgCiiimAUUUUAFFFFABRRRQAUUUUAFFFFABRRRSAKKKKYBRRRSAKKKKYBRRRSAKKKKYBRRRSAKBRRTAKKKKQAaKKKYBRRRSAKKKKYBRRRQAUUUUAFFFFAAKKKKACiiigAooooAKKKKACiiigAooooABRRRQAUUUUAFFFFIANFBopgFFFFABRRRQAUUUUAFFFFABRRRSAKKKKYBRRRQAUUUUAFFFFABRRRSAKKKKYBRRRSAKBRRTAKKKKQBRRRTAKKKKQBRRRTAKKKKACiiigAooooABRQKKQBRRRTAKKKKQAaKDRTAKKKKQBRRRTAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiihAFFFFABRRRTAKKKKQBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFAoooAKKKKACiiigAooooAKKKKQBRRRTAKKKKACijvRQAUUUUAFFFFABRRRSAKKKKYBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFIAooopgFFFFIAooopgFFFFIAo70UUwCiiigAoFFFABRRRSAKKKKYBRRRSAKKKKYBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFIANFBopgFFFFIAooopgFFFFIAoooFMAooopAFFFFMAooooAKKKKACiiigAooopAFFFFMAooopAFFFFMAooopAFFFFMAooopAFFFHemAUUUUAFFFFABRRRQACigUUgCiiimAUUUUgA0UGimAUUUUgCiiimAUUUUgCiiimAUUUUAFFFFABRRRQAUUUUAFFFFCAKKKKGAUUUUIAooooAKKKKYBRRS0gEooopgFFFFJAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQgCiiigAooooAKKKKACiiigAooopgFFFFIAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiikAUUUUwCiiikAUUUUwCiiigAooooAKKKKACiiihgFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFIAooopgFFFFABRRRQAUUUUAFFFFIAooopgFFFFIAoFFApgFFFFIAooopgFFFFABRRRSAKKKKYBRRRQAd6KO9FABRRRSAKKKKYBRRRQAUUUUAFFFFIAooopgFFFFABRRQKACiiigAFFFFABRRRQgCiiigANFFFCAKKKKQBRRRTAKKKKQBRRRTAKKKKACiiigAooooAKKKKACiiihAFFFFDAKKKKEAUUUUMGFFFFNAFFFFIAooopgFFFFIAooooAKKKKACiiigAooooAKKKKbAKKKKQBRRRTAKKKKQBRRRTAKKKKQBRRRTAKKKKQBRRS0wEoopaQCUUUUwCiiikAUUUUwCiiikAUUUUwCiiikAUUUUAFFFFABRRRTAKKKKQBRRRTAKKKKQBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQgCiiihgFFFFCAKKKKGAUUUUAFFFFDAKKKKACiiigAooooAKKKKACiiigAooooAKKKKQBRRRTAKKKKQBRRQKYBRRRSAKKKKYBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFIAooopgFFFFIAooopgFFFFABRRRSAKKKKYBRRRQAUUUUAFFFFIAooopgFFFFABRRRTAKKKKkAooopgFFFFIAoFFApgFFFFABRRRQwCiiihAFFFFABRRRQgDvRR3ooAKKKKACigUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFMAooopAFFFFMAooopAFFFFMAooooAKKKKACiiigAooooAKKKKACiiigApaSigApaSloAKSlpKACiiloASiiloASlpKWgBKKKKACiiigAooooAKKKKACiiloASiiigAooopAFFFFMAooopAFFFFMAooopAFFFFMAooopAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFDAKKKKACigUUAFFFFCAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiikAUUUUwCiiikAUUUUwCiiigAooooAKKKKACiiigAooooAKKKKQBRRRTAKKKKQBRRRTAKKKKACiiigAooxS4oASinbT6UFSKLANopaSgAooopAFFFFMAooooAKKKKACiiikAUUUUwCiiigAoFFAoAKKKKQBRRRTYBQaKKACiiigAooooAKKKKACiiigAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRTAKKKKQBRRRTAKKKKEAUUUUALRSUtABSUUtACUUtFACUUUtACUUtFACUUtJTAKKWigAooooAKKKKAEpaSloASloooQBRRRQAUUUUAFFFFABSUtJQAtFAooAKSlopAJRRS0wCkpaSkAUUUUAFFFFABRRRQAUUUUgCiiimAUUUUgCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKQBRRRTAKKKKACiiigAooooAKKKKAA0UUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUgCiiimAUUUUgCiiimAUUUUgCiiimAUUUUAFFFLQAlFGKXGaAEopwQ+lTQ2dzOcQQSSH0RS38qdmxXRXoroLTwb4jvADBo14VPQmIqP1xW5a/CrxRMAZLaG3B/wCes6jH4DNVyMLo4SivVrX4N3Zx9s1i1j9RGjOf6VtWnwd0eMg3WpXk/qI4wn+NLl7sLnh+KXYfSvoq0+GvhW266bLcH1nnP8hitu08MaHZ/wDHtothGfUxBj+Zp2j3DU+YYbK5uDiCCSQ+iKW/lWxaeC/El2AYdGvCp6ExFR+uK+m44hEm2IJGo7RoFFPKk9Xc/jSvHsLU+frX4UeKJwDJbQwA/wDPWdePyzWzbfBq9OPtmr2cQ7iNWcj+Vez+WndQfrzTwAOgA+lPmXYdjy60+DukIQbrVLqcdxFEE/U5ratfhl4VtzzYXFwf+m05/piu3pKfOwsjBtPCXh+0/wCPfQ7Ffd08w/rVfVvBfhzUoWS40iCIkf621Xy2X344P45rpsU0io5mFkfNfjjwhceFtSWNn860mBa3nAwHHcH0IrlTX0h8StMj1DwRfhly9pi5iOOmDhv0Jr50kTaSKuSuriT6EVFFFZFBRRRTAKKKKQBRRRTAKKKKQBRRRTAKKKKACiiihgFFFFABRRRQwCiiikAUUUUwCiiigAooooAKKKKQBRRRTAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooopgFFFFIAooopgFFFFABRRRTAKKKKQC0UUUwCiiigAooooAKKKKACiiigAooopoAooooAKKKKEAUUUUAFFFFABRRRQAUUUUMAooooAKKKKACkpaKACiiikwCiiigBKWkpaACiiigApKWkoAKKWikAlFFFABRRRQAUUUUAFFFFABRRRSAKKKKYBRRRSAKKKKYBRRRSAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooopAFFFFMAooooAKKKKACiiigAooopAFFFFMAooopAFFFFMAooooAKKKKACijFLigBKKdtPpU0NpcznEMLyH0RSf5U7NiuivRW/aeDvEd4AYNGvGU9zCVH5nFblr8K/FM4BktYrcH/nrOox+AzVcjC6OFor1W1+DV4cfbNXtIvU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zdaiqWXHYKSlNJUDDvRR3ooABRQKKQBRRRTAKKKKQAaKDRTAKKKKACiiigAFFAooAKDRQaACiiigAooooAKKKKACiiikAGiiimAUUUUgCiiimAUUUUAFFFFMAooooAKKKWgBKKKKACilooASilpKoBaKKKQBRRRTAKKKKBBRRRTGFFFLQIKKKKYCUtFFABRRRTAKKKKACiiloASilpKdgClpKWgBKKWigBKWiigApKWimAlFLSUIApaKKQhKKWinYYlFFFIAooooAKKKKQBRRRQAlLRRQAUlLSUgCiiloASiiikAUUUUDCiiikIKKKKACkpaKQwpKWigBKWikoAWiiikAlFLSUAFFFFABRRRSAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoopRTA9J+CCRt4vuXb/AFiWblPrlR/I17sv3Rjpivnn4QXIt/H9mjHCzpJEfxUkfqK+hY/9Wv0xVPZCjuOoooqGMKWkpaACiiikAUUUVQxaSiikIKWkooAKKKKACiiigAooooAKKKKACiiigAooooAKKKSgBaKSigBaKKKACkoopAFFFFMAooooAWkoooAKKWkoAKKKSgBaSlpKAFpKWkoAKKWigBprjfijb+f4IuWxzDOkn58f1rs6w/GUH2nwhrEQGSbYuP8AgJz/AErSDtJEVFeLPmOcfMagqzcjDn61WpzVmEHoFJS0lZMsKKKKAAUUCikAUUUUwCiiikAUUUUwCiiigAooooABRRRQAUGig0AFFFFABRRRQAUUUUAFFFFABRRRQAUUUUgCiiimAUUUUAFFFFMAooooAKKKKACilpKYBS0lLQAUlLRTAKKKKBBRRRTQwoopaBCUUtFNAFFFFOwBRRRQAUUtFOwCUUtFACUUtFMBKUUUUCCiilp2ASiilosAlFFLTsAUlLRRYBKWkpaLAJRS0UJAJS4oopNAJRRRRYAooopWAKSlxRRYBKKWiiwxKKWigBKKWkpAFFLSUAFFFFIAooooASilopAJRRRSAKKKKBhRRRSAKKKKQBRRRQAlLRRQAlLRRSASiiigAooooAKKKKACiiikAUUUUwCiiikAUUUUwCiiikAUUUUwCiiikAtFFJTYM6DwTdCz8Y6TOxwq3UeT7FsH+dfUA4LD0Y18j2chiuUkX7yMGH4c19Z2863MEdwn3Zo0kH4ira91ErcmopBS1kUFLSUtMYUUUUhBRRSVQxaKKKQgooooAKKKKACiiigAooooAKKKKACiiigAooooADSUtJQAtJS0UAJRRRQAUtJRSAKKKKYBRRRQAUUUUALSUUUAJRRRQAUUUUAFFFFABRRRQAVWvYhcWk8B6TQvH+YqxTc4kjP+1VbA9j5RvkKTMD1BxVE9a6DxVbfZfEF/BjHl3Dr/AOPGsBuDW1X4jKk/dEpKWkrnZqFFFFAAKKBRSAKKKKYBRRRSAKKKKYBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRTAKKKKYBRRS0AFFFFACUtFFMAooooEFFFFUAUUUtACUtFFMBaSiloASiilp2ASloopiCiilpgJRS0UWAKKKKdgCilop2EJRS0U7AJS0UYosAlFLRRYApKXFGKEgDFGKKKbQBikpaKEgCiilpNANNFLRRYBtLRiilYYUUtJRYBKKKKQBRRRSAKKKKADFFFFIAooooGFJS0lIAooopMApKWkpAFFFFDAKKKKQwooopCCiiikAUUUUxhRRRSAKSlpKACiilpAJRRRQAUUUUgCiiimAUUUUgCiiimMKKKKQgooopgFFFFIBaSlpKGBJEcOK+nfBV2bzwbo0xOSbQIT7r8v9K+X1ODX0J8Irr7R4GijLZNvdPHj0B+b+tarWBP2juxS0UViymFLRRTGFFFFIQUUUUxhRRRSEFFFFMAooooAKKKKACikpaACiiigAooooAKKKKAEpaKKAEpaSlpAJRRRTAKWkopAFFFFMAooopAFFJS0wCkpaSgAooooASilooAKSiigBaKKKQAajk4TPoQf1qSmuMow9qoGfPnxOtvs/jfUlxw7iQf8CUGuHk+9Xp/xkttnieG47T2qN+IJH9BXmMg+auieqT8jGno2hlJS0lc7NgooopAAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooFFABRRQaACiiigAooooAKKKWqASlpKWgBKWkpaYBRRRQIKKKKaGFFFLTEFJS0U0AUUUtACUUtFNAAooopiCiiimgClpKWiwBRRS1SQhKWiiiwBRRS1VgEpaKKLCCiilp2ASilpKEgCilopgFJS0UJAJRS0YoaASilxRihIBKKXFFDQCUlLiikAlFLRRYYUlLRSsA2ilopWASilpKVhiUtFFKwCUUtJSAKKKKTAKSlooGFFFFJgJSU6kpAFFFFIBKKWigBKKKKQBRRRSAKKKKBhRRRSAKKKKACiikpAFFFFABRRRQAUUUUAFFFFIAooopgFFLRSASiiimAUUUUgFpKKKbAUV7R8D7oHTtWtieUeKUD8wf5CvFxXpnwTuvL8T3VsTxcWjAD3Ug/yzVwejRL3R7pRTVOVB9RTqzZQtFJRQgFooooAKKKKACikpaACiiigAooooAKKKKAEpaSigBaKSigAoozRQAUUUUAGaKKKAFpKKKACiiigAoopKAFpKKKAFopKKACiiigAooooAKKKKACiikoAKKKKAFooopAFJS0hqgPLPjPbA2uk3IHOJIj+GCP6141KOTXvvxatxL4RjlxzBd/oyn/61eCTj5jXTvTRgtJsrmkpTSVzs3CiiipAKKKKACiiigAooooAKKKKACiiigAooopABooNFMAooopAFFFFMAo70Ud6ACiiihgFFFFAAKKBRQAUGig0AFFFFABRRRQAtFFBqgCiiimAUUUUwCiiigQUUUtNAFFFLTASilopoBKWiigQUUUVSAWiiigAoooqkgCloxS4oEJSikpaqwBRS0UIQlLRRVAFFLRQkITFLQKWnYBKTFOxRimkFxuKWlxTsU7CbG4pKfijFNRC4ylpcUYocQuJSYp+KTFFguJijFLigik0FxpFJinEUmKVhiYpKdSUrDEopaKVgEooooASilpKkYmKWiiiwCUUtJU2ASloopMYUlLSUgCiiikwCiiigApKWikxiUUUUgEopaSkAUUUUgCiiigYUUUUhBRRRQMKKKKQCUUUtACUUUUgCiiigAooopAFFFFMBaKSikAUUUUwCiiikAUUUUwFFdl8Lbr7L490xieJJDEf+BKR/hXG1reG7s2Wv2NyP+WM6P8Akwq6e5Etj6nT7gHpxTxTB99x/tZ/OnioZYtFFFIBKWiigAopKKACilpKAFopKKAFooooAKKKKACkpaSgAooooAKKKKACkpaKAEooooAWiiigApKWigBKKKKACilpKACiiigBaSlpKACiikoAWkpaSgBaSlooASilpKAFoopKQC0006mmqA5zx7ALjwTqqkZKIso/BhXzhcrhjX1HrUH2nRdQgIz5tpIoHvjivmK9XEhrphrTaMJaTM49aKVutJXPI3EoooqQCiiigAooooAKKKKACiiigAooooAKKKKQBRRRTAKKKKQBRRRTAKO9FHegAooooYBRRRQACigUUAFBooNABRRRQAUUUUALQaKDViCiiigAoooqgCloooAKKKKYBS0lLTAKKKKaEFLSUtABSUtFWkAUtAopCCiilrSwBS0UUkITFKKMUtUwDFFLSU0hBRRTsUMGJRiloq4oQAUuKAKdiiwmxuKXFOxSgVpGIrjcUAVIFpwSq5CXIj20bamCUuytI0yeYg20basbKNlV7JhzlfbRtqfZSFKl02HMVyKQipytNK1DgUpEOKTFSEU0ismirjMUmKfikIpNFXG0lOpMVFhiUUuKKLANopaKmwxKKKKTAKSlopWGNxRS0GpYCUUUUWGJRS0VLASiiigAooopAFJS0lIYUUUUgEooopAFFFFIYUUUUhBRQaKBhRRRSAKKKKAEpaSikAUUUUAFFFFCAKKKKGAUtJRSAKKKKYBRRRSAKKKKYBU9uSJAR1qCpYjhwfeqi7MmWx9X6Vcfa9LsrnOfPto5M/VavVzHw+uftPgfSHzkrE0R/wCAsR/SumokrNji7oWkNFFQMKKKKACiiigBaKSloASiiigAopaKAEpaSigAooooAKKKKACilpKACiiigApKWigAooooAKKSgUAFFLRQAUlLSUALRSUUALSUUUAFFFFABRRRQAUUUUAFJS0UAFFFFACUUtJTAbgF0B6HKn8RXzBrsBt9RuISMGORk/IkV9PsyowLMAqZdiewHevmTxHdLeatd3K/dlmdx9CSa6aPwy+RhP4kc+3Wkpz9abWMjZCUUUVmMKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKO9FHegAooooYBRRRQAUUCigAoNFBoAKKKKACiiigBaKKKsQUUtJTGFFFLTEFFFFMAooopgLRRRQIKBRRVIBaKKWgQlFLRVgFLRRQkIKUUYpRVgFFLSUREFLRSiqYmJRS0VUUAUuKKWkxCUClxSgVqloAYpwFAFSKtNK7IbGhaeEp6rU8ULMeBXXTpNmcpWIQlSJET2rc0nw/ealMI7S3eVu+B0+p7V21j4IsbFQ+tXyq3eGD5j+JrWUadP4nr26nPKr2PNY7N26Kau2+i3c5/dQSP/ALqk16gt14f00YsdMjdh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lcdh2aQmm5ozU3CwuaM03NJmhsdh2aM03NGam47ATRmkNGabYxc0lFJUXAKKSihsYpoopKkAopKKBi0UlLUgJRRRQAUUUUgCiiimAUUUUgCiiimAUUUUgCiiigAooooAKKKKAA0UGihAFFFFIAooopgFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRS0wEpaSimAtFFFABRRRTAKKKKAFopKKYhaKSigBaWkoqgFopKWgApaSimIWikopgLRRRQAtFJRTELRRRQAUUUUwFpKKKQC0UlFMBaKSihCHUlFJmi4C0UlFAxaKSigQtFJRQMWikopALSUUUwClpKKQBRRRQAUUUlAC0UlFIAoopKBi0UUUAJRRSUALRRRUsBKKKKBhRRRSAKKSigBaKSlqQEooooAKKKKQwooopgFFFFIAopKWgAooopAFFFFABRRRQAlLSUtABSUtJQAUtJS0AFJS0UAJRRRQAtFFFABRRRTABTgabSiqQiRTTwaipQa0TJaJg9LuqEGlzWimyOUl30bqjzS5o5hWH7qN1MzRmnzDsOzRmmZozSuFh26jNMzRmi47D80ZpmaM0rhYfmkzTc0ZouFh2aM03NGaVwsLmjNNozSuOwuaM0maTNFwsLmjNJSUrjsLmjNJRQAtGaSkpXGLmkoooAKKKSpAWkopKYxaKKSpAKKKKBhRRRUgFFFFACUtJRSAKKKKACiiikAUUUUwCiiikAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUgCiiimAUUUUgCiiimAUUUUgCiiimAUUUUgCiiimAUUUUAFFFFABRRRQAUUUUALRSUUwClpKKACloopgFFFFABRRRQAUUUUwCiiimIKKKKAFooopgLRSUtMAoopKaAWlpKKBBRRRTAWiikoELS02lpjFpKKKSEFLSUUwClpKKAFopKKAFopKKAFopKWgAopKKYC0UlFIBaKSigBaKKSgBaKSigApaSikMKKKKACkoopAFFFFABSUtFIYlLSUUAFFFFIAooopMApKKKAFoopKQBRRRQAUUUUgCiiimMKKKKQBRRRQAUUlFIBaKKSmwFoopKQC0UUUAFJS0lABS0lLQAUlLSUALRRRTAKKKKACiiigQUtJRTAcKWm0tUIXNLmm0tUmFh2aXNNop3FYdmim0U7iFzRSUlK47DqM0lJmncB2aKbS0gFpKKSgB1JSUUXAXNFJQaQC0lJRQMWkoopAFFFJQMWkoopAFFFFABRRRSASiiimAtJRRUgFFFFAwooopAFFFFABRRRSAKSlpKYBRS0VICUUUUwCiiikAUUUUwCiiikAUUUUAFFFFABRRRQAUUUUAFFFFABRR3ooAKKKKQBRRRTAKKKKQBRRRTAKKKKQBRRRTAKKKKACiiigAooooAKKKKACiiimAUUUtACUUUUwFopKWgAopKWmAUUUUCCiiimAUUUUALRRRTAKWkooAWikopgLRRRQIKKKKYC0UlLQAlFFFMBaSiigApaSloAKKKKACiiigAooopgFFFFIAzRSUUwFooopAFFFFMAooopAFJS0lAC0lFFIAooooAKKKKACiiikAUUUlAwooopAFFFFACUUtFIBKKKKAFooopAJRRRQAUUUUgCiiimMKKKKQBRRRQAUUUUAFJS0UAFFFFABSUtFABRRRQAUUUUAFFFFABRRRQAUUUUCCiiimAUUtFMAooopgFLSUtMQUtJS0AFFFJTAWikpaACiikoAWiiigAopKKAFpKKKQBRRRQAUUUUDCiikpAFFFFABRRRQAUUUUAFFFJSAKKKKBhRRRSEFFFFAwooopAFJRRQAtFFFABSUtFABRRRSASiilpgJS0lFIAoopaAEopaSgAoopaAEooopAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFIAooopgFFFFIAooopgFFFFABRRRQAUUUUAFFFFAC0UUVQCUUUtABRRRTAKKKKACiiigAooopiCiiigAopaKYBRRRTAKWiigBKKWimAUUtFIQlLRRVAFFFFIQUUUUxhRRRQAUUUUAFJS0lAC0UUUAFFFFABRRRQAlLRRTAKKKKQBRRRQAUUUlIBaSiigAooooAKKKKACiiikAUUUUAFFFFACUUtFIYlFLRQA2ilooASilooASilopAJRRS0WASloopAJRRRTAKKWkxSAKKKKACiiloASiiloASilooASiiloASiiigAooooAKKKKACloooASilop2AKKKWgBKDRRTAKKKWgAoopaYgopKWmAUUUUAFFFFABSUtJQAUUUUAFFFFABRRRSGFJS0UAFFFFABSUtFACUUUUgCiiigBKKWkpALSUUUAFFFFABRRRQAUUUUDCiiikIKKKKY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) center/cover no-repeat;border-radius:16px;padding:14px 18px 12px;display:flex;flex-direction:column;gap:10px;}.pcm-brand-card .pcm-title{color:#f5f7ff;font-size:16px}.pcm-brand-card .pcm-subtitle{color:rgba(245,247,255,.92);font-size:12.5px;font-weight:500;text-shadow:0 1px 3px rgba(4,5,6,.55)}.pcm-brand-card .pcm-source{color:rgba(245,247,255,.92);border-color:rgba(245,247,255,.45);opacity:1;font-weight:500}.pcm-brand-card .pcm-progress{color:rgba(245,247,255,.88);font-weight:500}.pcm-brand-card .pcm-divider{background:rgba(245,247,255,.35)}.pcm-brand-card .pcm-brand-btn{border-color:rgba(245,247,255,.55);color:#ffffff;background:rgba(245,247,255,.1);font-weight:500}.pcm-brand-card .pcm-brand-btn:hover{border-color:#4d6bfe;color:#fff}.pcm-publish-btn{border-color:#6d87ff;color:#eef2ff;background:rgba(77,107,254,.25);font-weight:600}.pcm-publish-btn:hover{background:rgba(77,107,254,.32);color:#fff}.pcm-version{font-size:11px;color:#8ea2d6;background:rgba(77,107,254,.18);border:1px solid rgba(77,107,254,.45);border-radius:999px;padding:1px 8px;line-height:16px;font-weight:500;letter-spacing:.2px}.pcm-token-badge{font-size:10.5px;color:#6ee7a0;background:rgba(52,211,153,.14);border:1px solid rgba(52,211,153,.4);border-radius:999px;padding:1px 8px;line-height:16px}.pcm-header{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.pcm-header-row2{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pcm-divider{width:1px;height:16px;background:rgba(128,128,128,.35);flex:none}.pcm-title{font-size:15px;font-weight:600;margin:0;flex:1 1 auto}.pcm-subtitle{font-size:12px;opacity:.7}.pcm-source{font-size:11px;padding:1px 7px;border-radius:999px;border:1px solid currentColor;opacity:.75;white-space:nowrap}.pcm-degraded{font-size:11px;color:#b45309;border:1px solid rgba(217,119,6,.5);border-radius:999px;padding:1px 7px;background:rgba(217,119,6,.08);white-space:nowrap}.pcm-progress{font-size:12px;opacity:.75}.pcm-rate{font-size:12px;color:#d97706}.pcm-chips{display:flex;flex-wrap:wrap;gap:6px;position:relative}.pcm-chips>button{flex:none}.pcm-chips-clamped{overflow:visible}.pcm-chip-more-btn{position:absolute;right:0;bottom:0;z-index:2;background:var(--dsw-alias-bg-base,#fff);min-width:112px;justify-content:center}.pcm-card-local{border:1.5px dashed rgba(77,107,254,.55);background:rgba(77,107,254,.05)}.pcm-badge-scanned{background:rgba(34,197,94,.12);color:#15803d;font-weight:600}.pcm-badge-scanfail{background:rgba(220,38,38,.1);color:#b91c1c}.pcm-badge-dormant{background:rgba(217,119,6,.12);color:#b45309}.pcm-pill-shield{flex:none;margin-right:2px}.pcm-toolbar .pcm-pill-scanned{border:1px solid rgba(21,128,61,.65) !important;color:#15803d !important;background:transparent !important;border-radius:8px !important;font-weight:600}.pcm-toolbar .pcm-pill-scanned:hover{border-color:#15803d !important;background:rgba(21,128,61,.08) !important}.pcm-toolbar .pcm-pill-scanned-on{border-color:#15803d !important;color:#fff !important;background:#15803d !important}.pcm-toolbar .pcm-pill-scanned-on:hover{background:#166534 !important;border-color:#166534 !important}.pcm-card-local:hover{border-color:#4d6bfe}.pcm-badge-local{border:1px dashed rgba(77,107,254,.8);color:#4d6bfe;background:transparent}.pcm-count{font-size:10px;opacity:.68;margin-left:5px;background:rgba(128,128,128,.16);border-radius:999px;padding:0 5px;line-height:15px;display:inline-block;min-width:34px;text-align:center;box-sizing:border-box}.pcm-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.pcm-toolbar-search{display:none}.pcm-search-row{display:flex;align-items:stretch;gap:10px;padding:2px 0}.pcm-search-wrap-full{margin-left:0;max-width:none;flex:1 1 auto}.pcm-search-row .pcm-search-wrap{max-width:none !important;margin-left:0 !important;flex:1 1 auto !important}.pcm-search-big{height:34px;font-size:14px}.pcm-search-row .pcm-search-big input{font-size:14px}.pcm-search-row .pcm-search-big{height:36px !important}.pcm-search-row .pcm-smart-search-btn{height:auto !important;flex:0 0 240px !important;padding:0 16px !important;font-size:14px !important;justify-content:center}.pcm-sort-wrap{margin-left:auto;display:inline-flex;align-items:center}.pcm-search-wrap{margin-left:auto;flex:1 1 160px;max-width:300px;display:flex;align-items:center;position:relative}.pcm-search-clear{position:absolute;right:5px;top:50%;transform:translateY(-50%);width:18px;height:18px;border-radius:50%;border:none;background:#040506;color:#fff;font-size:10px;line-height:1;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;z-index:2}.pcm-search-clear:hover{background:#1a1d22}.pcm-search-wrap .pcm-search input{padding-right:26px}.pcm-toolbar .pcm-search{width:100%;height:26px;box-sizing:border-box}.pcm-search input,.pcm-search > div,.pcm-search > span,.pcm-search [class]{border:none !important;box-shadow:none !important}.pcm-search{border:1px solid rgba(4,5,6,.7) !important;border-radius:8px !important;box-shadow:none !important;background:var(--dsw-alias-bg-base,#fff) !important}.pcm-search input{color:rgba(15,17,21,.92) !important;font-size:12px !important;font-weight:500;height:100%}.pcm-search input::placeholder{color:rgba(15,17,21,.5) !important}.pcm-search svg{color:#040506 !important;opacity:.85}.pcm-search{flex:1 1 auto;min-width:0}.pcm-sort-btn{border:1px solid rgba(128,128,128,.5);border-radius:8px;background:transparent;font-size:12px}.pcm-sort-btn{height:24px !important;padding:0 8px !important;line-height:24px}.pcm-sort-btn:hover{border-color:#4d6bfe;color:#4d6bfe}.pcm-sort-btn::after{content:'⇅';opacity:.45;margin-left:4px}.pcm-uninstall-btn{background:transparent !important;color:#dc2626 !important;border:1px solid rgba(220,38,38,.55) !important;border-radius:8px !important;height:22px;padding:0 8px;font-size:11px;line-height:1;display:inline-flex;align-items:center;justify-content:center}.pcm-uninstall-btn:hover{border-color:#dc2626 !important;background:rgba(220,38,38,.08) !important;color:#dc2626 !important}.pcm-toolbar .pcm-pill-curated{border:1px solid rgba(4,5,6,.7) !important;color:#040506 !important;background:transparent !important;border-radius:8px !important;font-weight:600}.pcm-toolbar .pcm-pill-curated::before{content:'⚑';margin-right:4px;font-size:12px;opacity:.9}.pcm-toolbar .pcm-pill-curated:hover{border-color:#040506 !important}.pcm-toolbar .pcm-pill-curated-on{border-color:#040506 !important;color:#fff !important;background:#040506 !important}.pcm-toolbar .pcm-pill-curated-on::before{color:#fff}.pcm-toolbar .pcm-pill-curated-on:hover{background:#1a1d22 !important;border-color:#1a1d22 !important}.pcm-toolbar .pcm-pill-verified{border:1px solid rgba(4,5,6,.7) !important;color:#040506 !important;background:transparent !important;border-radius:8px !important;font-weight:600}.pcm-toolbar .pcm-pill-verified::before{content:'✓';margin-right:4px;font-size:11px;font-weight:700}.pcm-toolbar .pcm-pill-verified:hover{border-color:#040506 !important}.pcm-toolbar .pcm-pill-verified-on{border-color:#040506 !important;color:#fff !important;background:#040506 !important}.pcm-toolbar .pcm-pill-verified-on::before{color:#fff}.pcm-toolbar .pcm-pill-verified-on:hover{background:#1a1d22 !important;border-color:#1a1d22 !important}.pcm-toolbar .pcm-pill-installed{border:1px solid rgba(4,5,6,.7) !important;color:#040506 !important;background:transparent !important;border-radius:8px !important;font-weight:600}.pcm-toolbar .pcm-pill-installed::before{content:'';width:11px;height:11px;margin-right:4px;background:currentColor;-webkit-mask:url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3E%3Cpath fill=%27none%27 stroke=%27%23000%27 stroke-width=%271.8%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 d=%27M8 2v7M5 6l3 3 3-3M3 12.5h10%27/%3E%3C/svg%3E') center/contain no-repeat;mask:url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3E%3Cpath fill=%27none%27 stroke=%27%23000%27 stroke-width=%271.8%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 d=%27M8 2v7M5 6l3 3 3-3M3 12.5h10%27/%3E%3C/svg%3E') center/contain no-repeat}.pcm-toolbar .pcm-pill-installed:hover{border-color:#040506 !important}.pcm-toolbar .pcm-pill-installed-on{border-color:#040506 !important;color:#fff !important;background:#040506 !important}.pcm-toolbar .pcm-pill-installed-on::before{color:#fff}.pcm-toolbar .pcm-pill-installed-on:hover{background:#1a1d22 !important;border-color:#1a1d22 !important}.pcm-toolbar .pcm-pill-fav{border:1px solid rgba(4,5,6,.7) !important;color:#040506 !important;background:transparent !important;border-radius:8px !important;font-weight:600}.pcm-toolbar .pcm-pill-fav::before{content:'★';margin-right:4px;font-size:11px}.pcm-toolbar .pcm-pill-fav:hover{border-color:#040506 !important}.pcm-toolbar .pcm-pill-fav-on{border-color:#040506 !important;color:#fff !important;background:#040506 !important}.pcm-toolbar .pcm-pill-fav-on::before{color:#fff}.pcm-toolbar .pcm-pill-fav-on:hover{background:#1a1d22 !important;border-color:#1a1d22 !important}.pcm-fav-star{border:none;background:transparent;padding:2px;margin:0;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;line-height:0;flex:none;border-radius:4px}.pcm-fav-star:hover{opacity:.8}.pcm-fav-on{opacity:1}.pcm-sort-slot{position:absolute;top:0;right:0;z-index:2;background:var(--dsw-alias-bg-base,#fff);padding-left:8px;margin-right:8px;display:flex;align-items:center;gap:6px}.pcm-lang-wrap{margin-left:8px;margin-right:8px;display:inline-flex;align-items:center}.pcm-toolbar .pcm-lang-btn{margin-left:auto;margin-right:8px}.pcm-lang-select-wrap{display:inline-flex;align-items:center;gap:4px;border:1px solid rgba(4,5,6,.7);color:#040506;background:transparent;border-radius:0;font-weight:600;padding:3px 7px;font-size:12px;line-height:1}.pcm-lang-select{border:none;background:transparent;color:inherit;font-weight:600;font-size:12px;outline:none;cursor:pointer;appearance:none;-webkit-appearance:none;padding-right:10px;background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);background-position:calc(100% - 8px) 50%,calc(100% - 5px) 50%;background-size:3px 3px,3px 3px;background-repeat:no-repeat}.pcm-lang-btn{border:1px solid rgba(4,5,6,.7) !important;color:#040506 !important;background:transparent !important;border-radius:0 !important;font-weight:600;display:inline-flex;align-items:center;gap:5px;height:26px;padding:0 9px;font-size:12px;cursor:pointer;line-height:1}.pcm-lang-btn:hover{border-color:#040506 !important;background:#040506 !important;color:#fff !important}.pcm-lang-flag{font-size:12px;line-height:1}.pcm-lang-label{font-size:12px;line-height:1}.pcm-lang-caret{width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent;border-top:5px solid currentColor;margin-top:1px;flex:none}.pcm-lang-btn-open .pcm-lang-caret{border-top:none;border-bottom:5px solid currentColor;margin-top:-1px}.pcm-seg{display:inline-flex;border-radius:8px;overflow:hidden;border:1px solid rgba(128,128,128,.3)}.pcm-seg button{border:none;background:transparent;padding:4px 10px;font-size:12px;cursor:pointer;color:inherit}.pcm-seg button.on{background:#4f6ef7;color:#fff}.pcm-picks{border:none;background:transparent;padding:0;margin:0 0 10px;display:flex;flex-direction:column;gap:10px}.pcm-picks-head{display:flex;align-items:center;gap:6px}.pcm-picks-flag{flex:none}.pcm-picks-title{font-size:13.5px;font-weight:700;color:var(--dsw-alias-label-primary,#292d36)}.pcm-picks-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px}.pcm-pick{position:relative;display:flex;flex-direction:column;gap:4px;align-items:flex-start;border:1px solid rgba(128,128,128,.22);background:var(--dsw-alias-bg-base,#fff);border-radius:12px;padding:10px 12px;cursor:pointer;text-align:left;transition:border-color .12s,box-shadow .12s}.pcm-pick:hover{border-color:rgba(77,107,254,.65);box-shadow:0 2px 8px rgba(77,107,254,.14)}.pcm-pick-ribbon{position:absolute;top:8px;right:8px;color:rgba(180,83,9,.5)}.pcm-pick-name{font-weight:600;font-size:12.5px;color:var(--dsw-alias-label-primary,#292d36);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:calc(100% - 18px)}.pcm-pick-owner{font-size:10.5px;opacity:.55;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}.pcm-pick-meta{display:flex;align-items:center;gap:6px;margin-top:2px}.pcm-pick-star{color:#b45309;font-weight:700;font-size:11px;background:rgba(245,158,11,.12);border-radius:999px;padding:0 7px;line-height:17px}.pcm-pick-cat{opacity:.68;font-size:10.5px;border:1px solid rgba(128,128,128,.3);border-radius:999px;padding:0 6px;line-height:15px}.pcm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(440px,1fr));gap:10px}.pcm-card{border:1px solid rgba(128,128,128,.25);border-radius:10px;padding:8px 10px;display:flex;flex-direction:column;gap:6px;cursor:pointer;transition:border-color .12s,box-shadow .12s}.pcm-card:hover{border-color:rgba(77,107,254,.65);box-shadow:0 2px 8px rgba(77,107,254,.14)}.pcm-card-top{display:flex;align-items:center;gap:8px}.pcm-card-title{display:flex;align-items:baseline;gap:6px;overflow:hidden;flex:1 1 auto;min-width:0}.pcm-av{width:22px;height:22px;border-radius:6px;flex:none;display:flex;align-items:center;justify-content:center;font-size:11px;color:#fff;font-weight:600;position:relative;overflow:hidden}.pcm-av-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit}.pcm-name{font-weight:600;font-size:12.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:none;max-width:60%}.pcm-owner{font-size:10.5px;opacity:.55;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}.pcm-desc{font-size:11.5px;opacity:.8;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:2.8em}.pcm-badges{display:flex;gap:4px;flex-wrap:wrap}.pcm-badge{font-size:10px;padding:0 6px;border-radius:999px;line-height:16px;white-space:nowrap}.pcm-badge-curated{background:rgba(34,197,94,.14);color:#22c55e}.pcm-badge-nonplugin{background:rgba(148,163,184,.16);opacity:.8}.pcm-badge-pending{background:rgba(217,119,6,.14);color:#d97706}.pcm-badge-installed{background:rgba(79,110,247,.16);color:#4f6ef7}.pcm-badge-plugin{background:rgba(79,110,247,.16);color:#4f6ef7}.pcm-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}.pcm-stats{display:flex;gap:8px;font-size:11px;align-items:center;flex-wrap:wrap;white-space:nowrap}.pcm-stars{display:inline-flex;align-items:center;gap:3px;background:rgba(245,158,11,.14);color:#b45309;border-radius:999px;padding:1px 8px;font-weight:700;font-size:12px;line-height:17px}.pcm-cat{border:1px solid rgba(15,17,21,.45);color:rgba(15,17,21,.85);background:transparent;border-radius:999px;padding:1px 7px;font-size:10px;line-height:15px;white-space:nowrap}.pcm-today{font-size:11px}.pcm-updated{font-size:10.5px;opacity:.7}.pcm-today-up{color:#15803d}.pcm-today-down{color:#b91c1c}.pcm-actions{display:flex;gap:6px;flex:none;align-items:center}.pcm-scroll{flex:1 1 auto;min-height:120px;overflow-y:auto;display:flex;flex-direction:column;gap:10px;padding-right:2px}.pcm-pager{flex:none;display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:8px 2px 6px;border-top:1px solid rgba(128,128,128,.18)}.pcm-page{min-width:26px;padding:3px 8px;border-radius:6px;font-size:12px;cursor:pointer;border:1px solid transparent;background:transparent;color:inherit}.pcm-page.on{border-color:#4f6ef7;color:#4f6ef7}.pcm-empty{text-align:center;padding:32px 0;opacity:.65}.pcm-modal-body{display:flex;flex-direction:column;gap:10px;font-size:13px}.pcm-risk{border-radius:8px;padding:8px 10px;font-size:12px;line-height:1.5}.pcm-risk-curated{background:rgba(34,197,94,.1);color:#16a34a}.pcm-risk-community{background:rgba(217,119,6,.1);color:#b45309}.pcm-risk-nonplugin{background:rgba(239,68,68,.1);color:#dc2626}.pcm-cmd{font-family:ui-monospace,monospace;font-size:12px;background:rgba(128,128,128,.12);border-radius:6px;padding:6px 8px;word-break:break-all}.pcm-publish-repos{max-height:200px;overflow:auto;display:flex;flex-direction:column;gap:4px;border:1px solid rgba(128,128,128,.25);border-radius:8px;padding:6px}.pcm-publish-repo{font-size:12px;padding:4px 8px;border-radius:6px;cursor:pointer}.pcm-publish-repo:hover{background:rgba(128,128,128,.12)}.pcm-spin{animation:pcm-spin 1s linear infinite;display:inline-flex}@keyframes pcm-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}.pcm-update-btn{background:#040506 !important;color:#fff !important;border-color:#040506 !important;border-radius:8px !important}.pcm-update-btn:hover{background:#1a1d22 !important;border-color:#1a1d22 !important;color:#fff !important}.pcm-update-btn:disabled{opacity:.75}.pcm-update-versions{font-size:10.5px;white-space:nowrap;display:inline-flex;align-items:center;gap:2px;color:#040506;font-weight:500}.pcm-update-arrow{color:#15803d;font-weight:700}.pcm-update-new{color:#15803d;font-weight:700}.pcm-source-btn{font-weight:500}.pcm-update-all-row{display:flex;justify-content:flex-end;margin-top:-2px}.pcm-update-all-btn{background:#fff;color:#040506;border:none;border-radius:8px;padding:5px 12px;font-size:12.5px;font-weight:600;cursor:pointer;line-height:16px}.pcm-update-all-btn:hover{background:#eef1ff}.pcm-update-all-btn:disabled{cursor:default;opacity:.85}.pcm-state-row{display:flex;align-items:center;gap:8px}.pcm-state-chip{font-size:10.5px;font-weight:600;padding:1px 8px;border-radius:4px;line-height:16px;white-space:nowrap}.pcm-state-live{color:#166534;background:#d9f99d}.pcm-state-disabled{color:#6b7280;background:rgba(128,128,128,.16)}.pcm-state-restart{color:#a16207;background:rgba(250,204,21,.3)}.pcm-switch{display:inline-flex;position:relative;cursor:pointer}.pcm-switch input{position:absolute;opacity:0;width:0;height:0}.pcm-switch-track{width:26px;height:15px;border-radius:999px;background:rgba(128,128,128,.3);transition:background .15s;position:relative;flex:none}.pcm-switch-track::after{content:'';position:absolute;top:2px;left:2px;width:11px;height:11px;border-radius:50%;background:#fff;transition:left .15s;box-shadow:0 1px 2px rgba(0,0,0,.3)}.pcm-switch input:checked + .pcm-switch-track{background:#040506}.pcm-switch input:checked + .pcm-switch-track::after{left:13px}.pcm-switch input:disabled + .pcm-switch-track{opacity:.5}.pcm-rollback-btn{color:#b45309 !important;border:1px solid rgba(217,119,6,.5) !important;border-radius:6px !important;font-size:11px;height:20px;padding:0 8px}.pcm-rollback-btn:hover{border-color:#d97706 !important;background:rgba(217,119,6,.08) !important}.pcm-skip-row{display:inline-flex;align-items:center;gap:4px;font-size:10.5px;opacity:.75;cursor:pointer;user-select:none}.pcm-skip-row input{accent-color:#040506;margin:0;cursor:pointer}.pcm-skip-row:hover{opacity:1}.pcm-self-update-btn{background:#fff;color:#040506;border:none;border-radius:8px;padding:5px 12px;font-size:12.5px;font-weight:600;cursor:pointer;line-height:16px;white-space:nowrap}.pcm-self-update-btn:hover{border-color:#4d6bfe;color:#fff}.pcm-self-update-btn:disabled{opacity:.75;cursor:default}.pcm-self-update-warn{color:#f87171;font-size:11.5px;font-weight:600}.pcm-safety-row{display:flex;gap:4px;flex-wrap:wrap;align-items:center}.pcm-safety-controls{display:inline-flex;align-items:center;gap:8px;margin-left:auto}.pcm-safety{display:inline-flex;align-items:center;gap:4px;font-size:10.5px;padding:1px 8px;border-radius:999px;line-height:16px;white-space:nowrap;font-weight:500}.pcm-safety-verified{color:#7c3aed;background:rgba(124,58,237,.08);border:1px solid rgba(124,58,237,.55)}.pcm-safety-disclosure{color:#1d4ed8;background:linear-gradient(180deg,rgba(37,99,235,.14),rgba(37,99,235,.05));border:1px solid rgba(37,99,235,.45);box-shadow:inset 0 1px 0 rgba(255,255,255,.55),0 1px 2px rgba(37,99,235,.12)}.pcm-safety-curated{color:#8f6a17;background:rgba(163,126,32,.06);border:1px solid rgba(163,126,32,.45)}.pcm-safety-manual{background:rgba(217,119,6,.1);color:#b45309;border:1px solid rgba(217,119,6,.35)}.pcm-safety-nonplugin{background:rgba(148,163,184,.14);color:#64748b;border:1px solid rgba(148,163,184,.4)}.pcm-safety-scanned{color:#15803d;background:rgba(22,163,74,.08);border:1px solid rgba(22,163,74,.55)}.pcm-pill-person{flex:none;margin-right:2px}.pcm-toolbar .pcm-pill-verified::before{content:none !important}.pcm-detail-modal{width:min(980px,94vw) !important;max-width:94vw}.pcm-detail-scroll{max-height:78vh;overflow-y:auto}.pcm-detail{display:flex;align-items:flex-start;padding:16px 18px 18px}.pcm-detail-main{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:10px}.pcm-detail-side{flex:none;width:240px;margin-left:16px;display:flex;flex-direction:column;gap:10px}.pcm-detail-head{display:flex;align-items:center;gap:8px}.pcm-detail-titles{display:flex;flex-direction:column;min-width:0;flex:1 1 auto}.pcm-detail-name{font-weight:700;font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pcm-detail-owner{font-size:11px;opacity:.6}.pcm-detail-actions{display:flex;gap:6px;flex:none;margin-left:auto;align-items:center}.pcm-detail-desc{font-size:12.5px;opacity:.85;line-height:1.5}.pcm-detail-safety{display:flex;gap:4px;flex-wrap:wrap}.pcm-detail-readme{border:1px solid rgba(128,128,128,.22);border-radius:10px;padding:12px 14px;max-height:none;overflow:visible}.pcm-detail-readme code{word-break:break-all}.pcm-detail-readme pre{overflow-x:auto;max-width:100%}.pcm-detail-readme-note{font-size:12px;opacity:.7;display:flex;align-items:center;gap:6px}.pcm-detail-md{font-size:12.5px;line-height:1.55;overflow-wrap:break-word}.pcm-detail-sec{border:1px solid rgba(128,128,128,.2);border-radius:10px;padding:10px 12px;display:flex;flex-direction:column;gap:6px}.pcm-detail-sec-title{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;opacity:.55}.pcm-detail-verline{display:flex;justify-content:space-between;gap:8px;font-size:11.5px}.pcm-detail-verlabel{opacity:.6}.pcm-detail-ver{font-family:ui-monospace,monospace;font-size:11px}.pcm-detail-ver-new{color:#15803d;font-weight:600}.pcm-detail-update-note{font-size:11.5px;font-weight:600}.pcm-detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px 10px}.pcm-detail-cell{display:flex;flex-direction:column;min-width:0}.pcm-detail-cellk{font-size:10px;opacity:.55}.pcm-detail-cellv{font-size:11.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pcm-detail-topics{display:flex;flex-wrap:wrap;gap:4px}.pcm-detail-topic{font-size:10px;background:rgba(128,128,128,.12);border-radius:999px;padding:1px 7px}.pcm-detail-cmdrow{display:flex;gap:6px;align-items:center}.pcm-detail-cmdrow .pcm-cmd{flex:1 1 auto;min-width:0}.pcm-detail-linkrow{display:flex;flex-direction:column;gap:2px}.pcm-detail-channels{display:flex;flex-direction:column;gap:3px;font-size:11px;opacity:.75;margin-top:6px}.pcm-detail-added{font-size:11px;opacity:.65;margin-top:6px}.pcm-detail-related{display:flex;align-items:center;gap:8px;width:100%;border:1px solid rgba(128,128,128,.25);border-radius:8px;background:transparent;padding:5px 8px;margin-bottom:6px;cursor:pointer;text-align:left}.pcm-detail-related:hover{border-color:#4d6bfe}.pcm-detail-link{font-size:11.5px;color:#4d6bfe}.pcm-detail-close{margin-left:2px}.pcm-store-overlay{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center}.pcm-store-mask{position:absolute;inset:0;background:rgba(15,17,21,.45);backdrop-filter:blur(6px)}.pcm-store-window{position:relative;width:min(1100px,96vw);height:min(860px,94vh);background:var(--dsw-alias-bg-base,#fff);border:1px solid rgba(128,128,128,.25);border-radius:16px;box-shadow:0 18px 60px rgba(0,0,0,.35);display:flex;flex-direction:column;overflow:hidden}.pcm-store-window .pcm-root{flex:1 1 auto;height:auto !important;max-height:none;overflow:hidden;display:flex}.pcm-store-window .pcm-sticky-top{position:relative}a[href*='/dsh-mall/open-results']{display:inline-flex;align-items:center;gap:6px;background:#040506;color:#fff !important;border-radius:14px;padding:8px 18px;font-size:13px;font-weight:600;text-decoration:none !important;box-shadow:0 2px 10px rgba(4,5,6,.25);transition:background .15s ease,transform .15s ease}a[href*='/dsh-mall/open-results']:hover{background:#1a1d22;transform:translateY(-1px)}.pcm-store-head{flex:none;display:flex;align-items:center;gap:8px;padding:10px 16px 0}.pcm-store-head-title{font-size:13.5px;font-weight:700;flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pcm-store-close{flex:none}.pcm-store-body{flex:1 1 auto;min-height:0;padding:0 16px 14px;display:flex;flex-direction:column}.pcm-store-body .pcm-root{height:100% !important;flex:1 1 auto;min-height:0}.pcm-results-body{padding-top:8px}.pcm-results-scroll{flex:1 1 auto;min-height:0;overflow-y:auto;display:flex;flex-direction:column;gap:10px}.pcm-results-sec-title{font-size:13px;font-weight:700;color:#040506;padding:2px 2px 0}.pcm-toast{position:absolute;top:8px;right:8px;background:rgba(15,17,21,.92);color:#fff;border-radius:8px;padding:6px 10px;font-size:11.5px;z-index:5;max-width:70%}.pcm-sidebar-btn{box-sizing:border-box;display:inline-flex;align-items:center;gap:8px;border:none;background:transparent;border-radius:8px;padding:0 10px 0 8px;cursor:pointer;font-size:14px;font-weight:400;color:var(--dsw-alias-label-primary);width:calc(100% + 14px);margin-left:-2px;height:42px;justify-content:flex-start}.pcm-sidebar-btn:hover{background:var(--dsw-alias-interactive-bg-hover)}.pcm-sidebar-icon{width:22px;height:22px;flex:none}.pcm-sidebar-rail{border-radius:50%;justify-content:center;gap:0;width:36px;height:36px;margin:8px 0 10px;padding:0}.pcm-sidebar-rail .pcm-sidebar-label{display:none}@media (max-width:760px){.pcm-detail{flex-direction:column}.pcm-detail-side{width:100%;margin-left:0;margin-top:10px}.pcm-detail-readme{max-height:none}}a[href*='/dsh-mall/open-results']{display:inline-flex !important;align-items:center;justify-content:center;gap:6px;background:linear-gradient(135deg,#4d6bfe,#3a51c4) !important;color:#fff !important;font-size:15px !important;font-weight:700 !important;text-decoration:none !important;padding:11px 26px !important;border-radius:12px !important;box-shadow:0 4px 16px rgba(77,107,254,.4) !important;margin:10px 0 6px !important;line-height:1.25 !important;border:none !important;width:fit-content !important}a[href*='/dsh-mall/open-results']::after{content:'›';font-size:18px;line-height:1;margin-left:4px}a[href*='/dsh-mall/open-results']:hover{background:linear-gradient(135deg,#5c79ff,#4d6bfe) !important;box-shadow:0 6px 20px rgba(77,107,254,.55) !important}.pcm-tasks-btn{display:inline-flex;align-items:center;gap:6px;background:#fff;color:#040506;border:none;border-radius:8px;padding:5px 12px;font-size:12.5px;font-weight:600;cursor:pointer;line-height:16px}.pcm-tasks-btn:hover{background:#eef1ff}.pcm-tasks-count{background:#4d6bfe;color:#fff;border-radius:999px;font-size:10.5px;padding:0 6px;line-height:15px;font-weight:700}.pcm-tasks-pop{position:fixed;z-index:650;width:380px;max-width:92vw;background:var(--dsw-alias-bg-base,#fff);border:1px solid rgba(128,128,128,.3);border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.28);display:flex;flex-direction:column;overflow:hidden}.pcm-tasks-head{display:flex;align-items:center;gap:6px;padding:9px 12px;border-bottom:1px solid rgba(128,128,128,.18)}.pcm-tasks-head-title{font-size:13px;font-weight:700;flex:1 1 auto}.pcm-tasks-body{max-height:320px;overflow-y:auto;padding:8px 10px;display:flex;flex-direction:column;gap:6px}.pcm-tasks-empty{padding:14px 6px;text-align:center;font-size:12.5px;opacity:.85}.pcm-tasks-empty-hint{font-size:11.5px;opacity:.6;margin-top:4px}.pcm-task-row{display:flex;align-items:flex-start;gap:8px;padding:7px 6px;border-radius:8px;background:rgba(128,128,128,.06)}.pcm-task-icon{flex:none;width:16px;height:16px;display:flex;align-items:center;justify-content:center;margin-top:1px}.pcm-task-ok{color:#16a34a}.pcm-task-bad{color:#dc2626}.pcm-task-main{flex:1 1 auto;min-width:0}.pcm-task-top{display:flex;gap:6px;align-items:baseline;min-width:0}.pcm-task-verb{font-size:11px;font-weight:700;color:#4d6bfe;flex:none}.pcm-task-name{font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pcm-task-status{font-size:11.5px;opacity:.75;margin-top:2px;word-break:break-all}.pcm-task-x{flex:none;border:none;background:transparent;cursor:pointer;color:inherit;opacity:.45;font-size:13px;padding:2px;border-radius:4px}.pcm-task-cancel{flex:none;border:1px solid rgba(220,38,38,.55);background:transparent;color:#dc2626;cursor:pointer;font-size:11px;padding:1px 8px;border-radius:6px;line-height:16px}.pcm-task-cancel:hover{background:rgba(220,38,38,.08);border-color:#dc2626}.pcm-task-x:hover{opacity:1;background:rgba(128,128,128,.15)}.pcm-tasks-bar{height:5px;border-radius:999px;background:rgba(128,128,128,.2);overflow:hidden;margin:2px 0 4px}.pcm-tasks-bar-fill{height:100%;background:#4d6bfe;border-radius:999px;transition:width .3s}.pcm-tasks-agg{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:600;padding:4px 6px 0}.pcm-settings-window{width:min(560px,94vw);height:min(640px,92vh)}.pcm-settings-body{display:flex;flex-direction:column;gap:14px;padding:6px 2px 14px}.pcm-settings-open-store{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;width:100%;background:linear-gradient(135deg,#4d6bfe,#3a51c4);color:#fff;border:none;border-radius:14px;padding:16px 20px;font-size:16px;font-weight:700;cursor:pointer;box-shadow:0 6px 20px rgba(77,107,254,.4)}.pcm-settings-open-store:hover{background:linear-gradient(135deg,#5c79ff,#4d6bfe)}.pcm-settings-body input::placeholder{color:rgba(15,17,21,.55) !important}.pcm-settings-open-store-hint{font-size:12px;font-weight:500;opacity:.85}.pcm-settings-sec{display:flex;flex-direction:column;gap:8px}.pcm-settings-sec-title{font-size:13px;font-weight:700}.pcm-settings-sec-desc{font-size:12px;opacity:.78;line-height:1.55}.pcm-settings-warn{font-size:12px;line-height:1.55;color:#9a3412;background:rgba(249,115,22,.12);border:1px solid rgba(249,115,22,.4);border-radius:8px;padding:8px 10px}.pcm-settings-note{font-size:11.5px;opacity:.65;line-height:1.5}.pcm-auto-row{display:flex;align-items:center;gap:10px}.pcm-auto-label{flex:1 1 auto;font-size:13.5px;font-weight:700}.pcm-auto-switch{position:relative;flex:none;width:36px;height:20px}.pcm-auto-switch input{position:absolute;inset:0;opacity:0;cursor:pointer;margin:0}.pcm-auto-switch .pcm-auto-track{position:relative;display:block;width:36px;height:20px;border-radius:999px;background:rgba(128,128,128,.35);transition:background .2s}.pcm-auto-switch .pcm-auto-track::after{content:'';position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.3);transition:left .2s}.pcm-auto-switch input:checked + .pcm-auto-track{background:#4d6bfe}.pcm-auto-switch input:checked + .pcm-auto-track::after{left:18px}.pcm-smart-install-btn{position:relative;overflow:hidden;display:inline-flex;align-items:center;justify-content:center;gap:5px;background:#040506;color:#fff;border:none;border-radius:14px;padding:0 14px;height:28px;font-size:12.5px;font-weight:600;cursor:pointer;line-height:1}.pcm-smart-install-btn:hover{background:#1a1d22}.pcm-smart-install-btn:disabled{opacity:.75;cursor:default}.pcm-smart-install-btn::after{content:'';position:absolute;top:0;left:-40%;width:30%;height:100%;background:linear-gradient(105deg,transparent,rgba(255,255,255,.55),transparent);animation:pcm-shine 3.5s ease-in-out infinite}.pcm-smart-uninstall-btn{background:#dc2626}.pcm-smart-uninstall-btn:hover{background:#b91c1c}.pcm-uninstall-plain-btn{color:#dc2626 !important;border-color:#dc2626 !important}.pcm-uninstall-plain-btn:hover{background:rgba(220,38,38,.08)}.pcm-install-plain-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;background:#fff;color:#040506;border:1px solid #040506;border-radius:14px;padding:0 14px;height:28px;font-size:12.5px;font-weight:600;cursor:pointer;line-height:1}.pcm-install-plain-btn:hover{background:#f2f3f5}.pcm-install-plain-btn:disabled{opacity:.7;cursor:default}.pcm-store-head-settings{border-radius:50%;flex:none}.pcm-store-head-settings svg{color:#040506}.pcm-lang-flag{display:inline-flex;align-items:center;color:inherit}.pcm-lang-flag svg{color:currentColor}.pcm-results-window{width:min(920px,92vw);height:min(660px,88vh)}div[role='presentation']:has([class*='pcm-']){z-index:1300 !important}div[role='menu']{z-index:1300 !important}div:has([role='menu']){z-index:1300 !important}.pcm-switch-inline .pcm-state-chip{margin-left:4px;flex:none}.pcm-card{border:1px solid #040506}.pcm-card:hover{border-color:#4f6ef7}.pcm-brand-card .pcm-version{color:#fff;border:1px solid #fff;background:rgba(255,255,255,.08)}.pcm-store-overlay{z-index:1000}.pcm-tasks-pop{z-index:1100}.pcm-smart-search-btn{position:relative;overflow:hidden;display:inline-flex;align-items:center;gap:5px;background:#040506;color:#fff;border:none;border-radius:8px;padding:0 12px;height:26px;font-size:12px;font-weight:600;cursor:pointer;line-height:1;flex:none}.pcm-smart-search-btn:hover{background:#1a1d22}.pcm-smart-search-btn:disabled{opacity:.75;cursor:default}.pcm-smart-star{color:#fff;font-size:12px;line-height:1}.pcm-smart-search-btn::after{content:'';position:absolute;top:0;left:-40%;width:30%;height:100%;background:linear-gradient(105deg,transparent,rgba(255,255,255,.55),transparent);animation:pcm-shine 3.5s ease-in-out infinite}@keyframes pcm-shine{0%{left:-40%}12%{left:110%}100%{left:110%}}.pcm-stats2{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:11px;color:rgba(15,17,21,.72);font-weight:500;margin:1px 0}.pcm-stats2 .pcm-dl-30{color:#1d4ed8}.pcm-stats2 .pcm-dl-total{color:#1d4ed8}.pcm-seg{border:1px solid #040506;border-radius:8px;overflow:hidden}.pcm-seg button{border-right:1px solid rgba(4,5,6,.22)}.pcm-seg button:last-child{border-right:none}.pcm-seg button.on{background:#040506;color:#fff}.pcm-store-head-actions .pcm-lang-btn{border:1px solid rgba(4,5,6,.7) !important;border-radius:14px !important;background:transparent !important;color:#040506 !important;height:28px;font-size:12px;box-sizing:border-box}.pcm-store-head-actions .pcm-lang-btn:hover{background:rgba(4,5,6,.06) !important;color:#040506 !important}.pcm-sort-wrap{display:inline-flex;align-items:center}.pcm-sort-wrap .pcm-sort-btn{border:1px solid rgba(4,5,6,.7);border-radius:8px;color:#040506;background:transparent;font-weight:600}.pcm-pager{position:relative;z-index:3}.pcm-header-actions{display:flex;align-items:center;justify-content:flex-end;gap:6px;margin-left:auto;flex-wrap:wrap}.pcm-header-actions .pcm-tasks-btn{background:#040506;border:1px solid #fff;color:#fff;box-sizing:border-box}.pcm-header-actions .pcm-tasks-btn:hover{background:#1a1d22;border-color:#fff}.pcm-header-actions .pcm-tasks-count{background:#4d6bfe}.pcm-header-actions .pcm-self-update-warn{color:#fbbf24}.pcm-store-head-actions{flex:0 0 auto;display:flex;align-items:center;justify-content:flex-end;gap:8px;min-width:0}.pcm-lang-btn-head{flex:0 0 auto;white-space:nowrap;max-width:none !important}.pcm-store-head-actions .pcm-header-row2{gap:8px;flex-wrap:nowrap}.pcm-store-head-actions .pcm-subtitle{color:inherit;opacity:.75;font-size:11.5px;white-space:nowrap}.pcm-store-head-actions .pcm-source{color:#040506;border-color:rgba(4,5,6,.45);opacity:.8;font-size:10.5px;white-space:nowrap}.pcm-store-head-actions .pcm-brand-btn{border-color:rgba(4,5,6,.7);color:#040506;background:transparent;font-size:12px}.pcm-store-head-actions .pcm-brand-btn:hover{border-color:#4d6bfe;color:#4d6bfe}.pcm-downloads{color:#1d4ed8;background:rgba(77,107,254,.1);border-radius:999px;padding:0 6px;font-size:10.5px;font-weight:700;line-height:16px;white-space:nowrap}.pcm-installed-panel{background:rgba(4,5,6,.045);border:none;border-radius:10px;padding:8px 10px;margin-top:auto;display:flex;flex-direction:column;gap:7px}.pcm-restart-note{display:flex;flex-wrap:wrap;align-items:center;gap:6px;font-size:11px}.pcm-restart-chip{display:inline-flex;align-items:center;color:#b45309;background:rgba(217,119,6,.1);border:1px solid rgba(217,119,6,.4);border-radius:999px;padding:1px 8px;line-height:16px;font-weight:600}.pcm-restart-why{display:inline-flex;align-items:center;gap:4px;background:transparent;border:none;color:rgba(4,5,6,.72);font-size:11px;cursor:pointer;padding:1px 2px;text-decoration:underline;text-underline-offset:2px}.pcm-restart-why:hover{color:#4d6bfe}.pcm-restart-why-caret{width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent;border-top:5px solid currentColor;transition:transform .18s ease}.pcm-restart-why-open .pcm-restart-why-caret{transform:rotate(180deg)}.pcm-restart-why-body{flex-basis:100%;font-size:11px;line-height:1.55;color:rgba(15,17,21,.8);background:rgba(77,107,254,.06);border:1px solid rgba(77,107,254,.25);border-radius:8px;padding:6px 9px;animation:pcm-fade-in .18s ease}@keyframes pcm-fade-in{from{opacity:0;transform:translateY(-3px)}to{opacity:1;transform:translateY(0)}}.pcm-installed-tag{color:rgba(4,5,6,.62) !important;border-color:rgba(4,5,6,.32) !important;opacity:1 !important;font-weight:500}.pcm-switch input:checked + .pcm-switch-track{background:#16a34a}.pcm-dl-none{color:rgba(15,17,21,.4)}.pcm-card button{font-size:13px}.pcm-source-btn{border-color:#040506 !important;color:#040506 !important}.pcm-installed-switches{display:flex;flex-direction:column;gap:6px}.pcm-installed-actions .pcm-uninstall-btn{background:#dc2626 !important;border-color:#dc2626 !important;color:#fff !important;height:28px !important;border-radius:14px !important;padding:0 14px !important;display:inline-flex;align-items:center;justify-content:center}.pcm-installed-actions .pcm-uninstall-btn:hover{background:#b91c1c !important;border-color:#b91c1c !important;color:#fff !important}.pcm-installed-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.pcm-vsep{width:1px;height:16px;background:rgba(4,5,6,.18);flex:none}.pcm-installed-actions .pcm-skip-row,.pcm-installed-actions .pcm-switch-inline{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;color:rgba(15,17,21,.85);cursor:pointer;height:28px}.pcm-installed-actions .pcm-skip-row input,.pcm-installed-actions .pcm-switch-inline input{margin:0}.pcm-switch-label{font-size:11.5px;font-weight:600;color:rgba(15,17,21,.85)}.pcm-switch-state{font-size:11px;opacity:.75;min-width:56px}.pcm-card-version{font-size:10.5px;color:rgba(15,17,21,.62);background:rgba(4,5,6,.06);border-radius:999px;padding:0 6px;line-height:15px;font-weight:500;white-space:nowrap}.pcm-installed-update{display:flex;align-items:center;justify-content:space-between;gap:8px}.pcm-installed-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pcm-av{border:1px solid #040506;box-sizing:border-box}.pcm-downloads-total{color:#0f766e;background:rgba(20,184,166,.12)}.pcm-card-mid{display:flex;gap:8px;align-items:stretch}.pcm-card-left{display:flex;flex-direction:column;gap:6px;flex:1 1 auto;min-width:0}.pcm-radar-wrap{flex:none;align-self:center;display:flex;align-items:center;justify-content:center}.pcm-radar{position:relative}.pcm-radar svg{transition:transform .18s ease}.pcm-radar:hover svg{transform:scale(1.06)}.pcm-radar-data{transition:fill .18s ease,filter .18s ease}.pcm-radar:hover .pcm-radar-data{fill:rgba(77,107,254,.42);filter:drop-shadow(0 0 6px rgba(77,107,254,.55))}.pcm-radar-dot{fill:#4d6bfe;transition:r .15s ease}.pcm-radar:hover .pcm-radar-dot{r:3.2}.pcm-radar-total{transition:fill .18s ease}.pcm-radar:hover .pcm-radar-total{fill:#4d6bfe}.pcm-radar-tip{position:fixed;z-index:1301;max-width:300px;background:rgba(4,5,6,.94);color:#f5f7ff;border:1px solid rgba(77,107,254,.6);border-radius:10px;padding:9px 11px;font-size:11px;line-height:1.5;pointer-events:none;box-shadow:0 6px 20px rgba(4,5,6,.35)}.pcm-radar-tip-title{font-weight:700;font-size:11.5px;margin-bottom:4px;color:#fff}.pcm-radar-tip-row{display:flex;gap:6px;align-items:baseline;margin:2px 0}.pcm-radar-tip-dim{font-weight:600;color:#a5b4fc;flex:0 0 auto;min-width:34px}.pcm-radar-tip-score{font-weight:700;color:#fbbf24;flex:0 0 auto;min-width:22px}.pcm-radar-tip-rule{color:rgba(245,247,255,.85)}.pcm-radar-tip-total{margin-top:5px;padding-top:5px;border-top:1px solid rgba(245,247,255,.18);color:#dbeafe;font-weight:600}.pcm-radar-grid{fill:none;stroke:#dbe4f0;stroke-width:.8}.pcm-radar-data{fill:rgba(77,107,254,.22);stroke:#4d6bfe;stroke-width:1.3;stroke-linejoin:round}.pcm-radar-dot{fill:#4d6bfe}.pcm-radar-label{font-size:8.5px;font-weight:500;fill:#6b7785}.pcm-radar-total{font-size:18px;font-weight:700;fill:#1d4ed8}.pcm-radar-total-label{font-size:8.5px;fill:#6b7785}.pcm-safety-skill{color:#040506;background:transparent;border:1px solid rgba(4,5,6,.6)}.pcm-toolbar .pcm-pill-skill{border:1px solid rgba(4,5,6,.7) !important;color:#040506 !important;background:transparent !important;border-radius:8px !important;font-weight:600}.pcm-toolbar .pcm-pill-skill:hover{border-color:#040506 !important}.pcm-toolbar .pcm-pill-skill-on{border-color:#040506 !important;color:#fff !important;background:#040506 !important}.pcm-toolbar .pcm-pill-skill-on:hover{background:#1a1d22 !important;border-color:#1a1d22 !important}.pcm-pill-skill-icon{flex:none;margin-right:2px}.pcm-score-card{display:flex;gap:14px;border:1px solid rgba(128,128,128,.22);border-radius:12px;padding:10px 12px;background:rgba(77,107,254,.03);align-items:center}.pcm-score-main{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:6px}.pcm-score-head{display:flex;align-items:center;gap:8px}.pcm-score-title{font-weight:700;font-size:13px}.pcm-score-conf{font-size:10.5px;opacity:.6;border:1px solid rgba(128,128,128,.35);border-radius:999px;padding:0 7px;line-height:16px}.pcm-score-why{font-size:11.5px;line-height:1.45;color:rgba(15,17,21,.78)}.pcm-score-note{font-size:11px;line-height:1.5;color:#b45309;background:rgba(217,119,6,.08);border:1px solid rgba(217,119,6,.35);border-radius:8px;padding:5px 8px;margin-top:4px}.pcm-score-why-label{font-weight:700}.pcm-score-bars{display:flex;flex-direction:column;gap:3px}.pcm-score-bar{display:flex;align-items:center;gap:8px}.pcm-score-dim{width:34px;font-size:10.5px;opacity:.65;flex:none}.pcm-score-track{flex:1 1 auto;height:5px;border-radius:3px;background:rgba(128,128,128,.16);overflow:hidden}.pcm-score-fill{height:100%;border-radius:3px;background:#4d6bfe}.pcm-score-val{width:26px;text-align:right;font-size:10.5px;color:#1d4ed8;font-weight:700;flex:none}.pcm-score-radar{flex:none}.pcm-readme-cmds{display:flex;flex-direction:column;gap:5px;border:1px dashed rgba(4,5,6,.25);border-radius:8px;padding:7px 8px}.pcm-readme-cmds-title{font-size:10.5px;font-weight:700;opacity:.7;display:flex;align-items:center;gap:6px}.pcm-readme-cmds-src{font-weight:400;opacity:.75}.pcm-readme-cmd{background:rgba(4,5,6,.05);font-size:11px}.pcm-readme-cmds-note{font-size:10.5px;opacity:.55}.pcm-radar-val{fill:#1d4ed8;font-weight:700}.pcm-tags-mini{display:flex;gap:4px;flex-wrap:wrap}.pcm-tag-mini{font-size:9.5px;color:#4d6bfe;background:rgba(77,107,254,.09);border:1px solid rgba(77,107,254,.35);border-radius:999px;padding:0 7px;line-height:15px;white-space:nowrap}.pcm-detail-tag{color:#4d6bfe;border-color:rgba(77,107,254,.4)}.pcm-pick-score{font-size:10px;color:#1d4ed8;font-weight:700;border:1px solid rgba(77,107,254,.4);border-radius:999px;padding:0 7px;line-height:16px}.pcm-pick-reason{font-size:10px;color:rgba(15,17,21,.72);line-height:1.35;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}/* ===== v1.7.54 详情页重设计（image-prompt ui-screenshot-system 出稿）===== *//* 安装区紫色高亮：渐变底 + 3px 紫左边线 + 圆角，整块重点行动区 */.pcm-detail-sec.pcm-install-sec { background: linear-gradient(135deg, rgba(124,92,255,.10) 0%, rgba(77,107,254,.07) 55%, rgba(124,92,255,.05) 100%); border: 2px solid #7c5cff; border-radius: 12px; padding: 14px 16px 12px; margin: 14px 0 18px; }.pcm-install-sec-title { color: #5b3df0; font-weight: 700; letter-spacing: .2px; }.pcm-install-cmdrow { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }.pcm-install-cmdrow .pcm-detail-cmdrow { flex: 1 1 auto; min-width: 240px; margin: 0; }.pcm-install-cta { white-space: nowrap; }/* 同类相关：两行式迷你卡（第 1 行标题、第 2 行 ★star · 开发者） */.pcm-related-list { display: flex; flex-direction: column; gap: 8px; }.pcm-detail-related { display: flex; flex-direction: column; gap: 3px; width: 100%; text-align: left; border: 1px solid rgba(4,5,6,.08); border-radius: 10px; padding: 8px 10px; background: #fff; cursor: pointer; transition: border-color .15s ease, box-shadow .15s ease, transform .15s ease; }.pcm-detail-related:hover { border-color: #4d6bfe; box-shadow: 0 2px 8px rgba(77,107,254,.10); transform: translateY(-1px); }.pcm-related-title { font-weight: 600; font-size: 13px; color: #040506; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }.pcm-related-sub { display: flex; align-items: center; gap: 8px; font-size: 12px; color: rgba(4,5,6,.55); }.pcm-related-stars { color: #d99a1f; font-weight: 600; }.pcm-related-dev { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }/* 元数据 star 单元格与首页卡片同款（颜色/字重对齐卡片 ★ 样式） */.pcm-meta-star { color: #b45309; font-weight: 700; }/* 回到顶部 FAB（Material FAB 模式：滚过 400px 浮现） */.pcm-backtop { position: absolute; right: 16px; bottom: 16px; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; background: #040506; border: 1px solid rgba(255,255,255,.14); box-shadow: 0 6px 20px rgba(4,5,6,.28); cursor: pointer; opacity: 0; pointer-events: none; z-index: 30; }.pcm-backtop:hover { background: #4d6bfe; }.pcm-backtop-show { opacity: 1; pointer-events: auto; }.pcm-backtop-show { opacity: 1; transform: translateY(0); pointer-events: auto; }/* ===== v1.7.55 冷启动问卷（QuizView）===== */.pcm-quiz { width: min(560px, 92vw); max-height: min(680px, 88vh); display: flex; flex-direction: column; border-radius: 16px; overflow: hidden; background: #fff; }.pcm-quiz-head { background: linear-gradient(135deg, #040506 0%, #1a2350 60%, #3d2c8f 100%); color: #fff; padding: 22px 24px 18px; }.pcm-quiz-badge { display: inline-block; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #c7b9ff; background: rgba(124,92,255,.18); border: 1px solid rgba(124,92,255,.4); border-radius: 999px; padding: 3px 10px; margin-bottom: 10px; }.pcm-quiz-title { font-size: 19px; font-weight: 700; }.pcm-quiz-sub { margin-top: 6px; font-size: 13px; color: rgba(255,255,255,.72); }.pcm-quiz-body { padding: 18px 24px; overflow-y: auto; flex: 1 1 auto; }.pcm-quiz-count { font-size: 12px; color: rgba(4,5,6,.55); margin-bottom: 12px; }.pcm-quiz-count b { color: #4d6bfe; }.pcm-quiz-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(148px, 1fr)); gap: 10px; }.pcm-quiz-chip { position: relative; display: flex; align-items: center; gap: 8px; padding: 11px 12px; border-radius: 12px; border: 1.5px solid rgba(4,5,6,.10); background: #fff; cursor: pointer; text-align: left; transition: border-color .15s ease, background .15s ease, transform .1s ease; }.pcm-quiz-chip:hover { border-color: #4d6bfe; }.pcm-quiz-chip:active { transform: scale(.98); }.pcm-quiz-chip-on { border-color: #4d6bfe; background: rgba(77,107,254,.08); }.pcm-quiz-emoji { font-size: 16px; }.pcm-quiz-label { font-size: 13px; font-weight: 500; color: #040506; }.pcm-quiz-check { position: absolute; top: -7px; right: -7px; width: 18px; height: 18px; border-radius: 50%; background: #4d6bfe; color: #fff; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 4px rgba(4,5,6,.25); }.pcm-quiz-foot { display: flex; justify-content: space-between; align-items: center; padding: 14px 24px; border-top: 1px solid rgba(4,5,6,.06); background: #fafafa; }.pcm-quiz-go { min-width: 120px; }/* v1.7.54 视觉复核微调 */.pcm-related-dev::before { content: '·'; margin-right: 8px; color: rgba(4,5,6,.35); }.pcm-score-card { padding: 14px 16px; }.pcm-score-head { margin-bottom: 8px; }.pcm-detail-channels { line-height: 1.8; opacity: .85; }.pcm-detail-head { padding-bottom: 6px; }/* v1.7.55 详情页按钮与首页卡片完全同款（13px） */.pcm-detail-actions button { font-size: 13px; }/* v1.7.55 编辑精选/为你推荐左右分栏 */.pcm-featured { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 14px; align-items: start; margin-bottom: 12px; }.pcm-editor-picks { background: linear-gradient(180deg, rgba(217, 154, 31, .12) 0%, rgba(217, 154, 31, .04) 100%); border: 1px solid rgba(217, 154, 31, .30); border-radius: 14px; padding: 12px 14px; margin: 0; }.pcm-editor-picks .pcm-picks-title { color: #92530a; }.pcm-editor-picks .pcm-picks-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }.pcm-picks-sub { font-size: 10.5px; color: rgba(4, 5, 6, .5); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }.pcm-recommend { background: linear-gradient(180deg, rgba(77, 107, 254, .07) 0%, rgba(77, 107, 254, .02) 100%); border: 1px solid rgba(77, 107, 254, .28); border-radius: 14px; padding: 12px 14px; margin: 0; }.pcm-rec-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; align-items: stretch; }.pcm-rec-daily { font-size: 10.5px; color: #4d6bfe; background: rgba(77, 107, 254, .10); border: 1px solid rgba(77, 107, 254, .35); border-radius: 999px; padding: 1px 7px; line-height: 16px; font-weight: 600; }.pcm-pick-rec { width: 100%; }@media (max-width: 900px) { .pcm-featured { grid-template-columns: 1fr; } .pcm-editor-picks .pcm-picks-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }/* v1.7.57 「为你推荐」画像说明样式=「精选收录」副标题同款（小灰字、无药丸底） */.pcm-rec-chip { font-size: 10.5px; color: rgba(4, 5, 6, .5); background: none; border: none; padding: 0; font-weight: 400; line-height: 1.2; }/* v1.7.57 更新按钮与安装按钮同款（深底 14px 圆角、无描边差异） */.pcm-update-btn { background: rgb(15, 17, 21) !important; color: #fff !important; border-radius: 14px !important; border: 1px solid transparent !important; }.pcm-update-btn:hover { background: rgb(26, 29, 34) !important; color: #fff !important; }/* v1.7.57 同类相关：简介行左对齐两行截断 */.pcm-related-desc { font-size: 11px; color: rgba(4, 5, 6, .62); text-align: left; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; align-self: stretch; }.pcm-detail-related { align-items: flex-start; }/* v1.7.58 卸载按钮全局统一为卡片同款（红底白字 28px/14px 圆角/13px，详情页不再是小号描边版） */.pcm-uninstall-btn { background: #dc2626 !important; border-color: #dc2626 !important; color: #fff !important; height: 28px !important; border-radius: 14px !important; padding: 0 14px !important; font-size: 13px !important; }.pcm-uninstall-btn:hover { background: #b91c1c !important; border-color: #b91c1c !important; color: #fff !important; }/* v1.7.58 编辑精选「每周更新」徽标（与每日更新同款、琥珀色） */.pcm-picks-weekly { font-size: 10.5px; color: #b45309; background: rgba(217, 154, 31, .12); border: 1px solid rgba(217, 154, 31, .4); border-radius: 999px; padding: 1px 7px; line-height: 16px; font-weight: 600; }";
function injectStyles() {
	const stale = document.querySelectorAll("style[data-plugin-css=\"dsh-mall\"]");
	stale.forEach((tag, index) => {
		if (index > 0) tag.remove();
	});
	const existing = stale[0] ?? null;
	if (existing !== null) {
		existing.textContent = CSS;
		return;
	}
	const tag = document.createElement("style");
	tag.dataset.plugin = "dsh-mall";
	tag.dataset.pluginCss = "dsh-mall";
	tag.textContent = CSS;
	document.head.appendChild(tag);
}
//#endregion
//#region src/client/index.ts
/**
* dsh-mall client: registers the "DSH Plugin Market" settings
* section plus the plugin-configuration card (GitHub token, dsh >= rc.7).
* Built by tsdown into lib/client.js; react and the primitives module are
* resolved through the loader module table at runtime.
*/
const NS = "dsh-mall";
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
		console.error("[dsh-mall] component crashed (isolated):", error);
	}
	render() {
		return this.state.failed ? null : this.props.children;
	}
};
function apply(ctx) {
	const gaps = missingPrimitives(_deepseek_ai_dsh_client_ui_primitives);
	if (gaps.length > 0) {
		console.warn("[dsh-mall] host ui-primitives missing " + gaps.join(", ") + " — market section disabled (dsh web >= 0.1.0-rc.6 required)");
		return;
	}
	ctx.effect(() => ctx.locale.register(NS, {
		zh,
		en
	}), "dsh-mall: dictionaries");
	const hostActive = String(ctx.locale.getSnapshot().active ?? "zh").toLowerCase();
	storeLang.init(hostActive.startsWith("zh") ? "zh" : "en");
	const t = storeT;
	injectStyles();
	ctx.effect(() => {
		const mount = document.createElement("div");
		mount.id = "dsh-mall-launcher";
		document.body.appendChild(mount);
		const resultsRoot = (0, import_client.createRoot)(mount);
		resultsRoot.render((0, react.createElement)(Guard, null, (0, react.createElement)(StoreResultsLauncher, {
			t,
			locale: ctx.locale
		})));
		const storeMount = document.createElement("div");
		storeMount.id = "dsh-mall-singleton";
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
	}, "dsh-mall: results launcher + store singleton");
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
		id: "dsh-mall",
		order: 10,
		locale: NS
	}, ((props) => (0, react.createElement)(SidebarStoreButton, {
		wide: props?.wide === true,
		t,
		locale: ctx.locale
	}))));
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
