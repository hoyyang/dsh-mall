# awesome-dsh-plugin 双仓库 × dsh-mall 差距分析与借鉴清单

> 调研方式：纯本地代码级深读（未联网、未 clone）。所有结论附文件路径 + 字段名/行号证据。
> 范围：/tmp/awesome-main（官方主仓库）、/tmp/awesome-bruc3van（数据管道仓库）、/Users/hoy/Desktop/DSH/dsh-mall（本地源码）。
> 数据基线：awesome-main data/plugins 1837 条 YAML；bruc3van repositories.json 快照 10270 仓、approved.json 8837 条；dsh-mall 打包 awesome-known.json 1563 条 + CDN 全量索引（8.8k-10k）。

---

## 1. awesome 两仓库完整能力清单

### 1.1 awesome-dsh-plugin/awesome-dsh-plugin（官方主仓库，/tmp/awesome-main）

**数据模型（data/plugins/*.yml，一插件一文件）**
- 全部 1837 个条目的字段并集仅 5 个：url / name / category / description.{en,zh} / tarball（出现次数 1837/1837/1837/1837/61，实测统计）。
- 字段白名单由 ENTRY_KEYS 强制（scripts/lib/entries.mjs:134）：未知字段直接报错（历史教训 #1775——手写 npm: 键无人读取却看似权威）。
- 文件名必须等于 URL 的 slug（entries.mjs slugFor），monorepo 子包用 --packages-x 后缀。
- 21 个分类 CAT_IDS（entries.mjs:27）：ui/usage/theme/model/identity/session/memory/tools/browser/vision/voice/docs/skill/workflow/git/notify/dev/security/remote/market/fun。分类人工指定（每个 YAML 手写 category），由维护者改；分类体系允许拆分/改名/合并（contributing.md「How submissions are reviewed」第 2 条）。
- 双语简介人工维护：英文必填、中文可选（维护者补）；描述含冒号必须加引号（entries.mjs 有专门的 YAML 解析报错提示）。
- 可选 tarball 字段（61 条）：作者声明的 GitHub Release 预构建 tgz；仅允许 github.com/objects.githubusercontent.com/release-assets.githubusercontent.com 域名 + .tgz 结尾（entries.mjs tarballProblem）。

**探测层（scripts/probe-*.mjs，全部在 CI 跑）**
- probe-stars.mjs：每日增量刷新（RECHECK_DAYS=1）、夜间 PROBE_ALL 全量；结果提交进 data/stars.json（2026-08-18 #1673 空写事故后的纪律）；覆盖 <66% 拒绝写盘；失败条目保留旧值；monorepo 子目录继承父仓 star。
- probe-npm.mjs：读 raw.githubusercontent.com 的 package.json 拿 npm 名，再要求 registry 上该包的 repository 字段回指同一 GitHub 仓库（防抢注/防冒挂，probe-npm.mjs:64-76）；未发布判定 1 天过期重探；不耗 GitHub API 额度。
- probe-downloads.mjs：只探测 npm-map 确认已发布的子集；rolling last-month（故意不做 lifetime，头注释写明理由）；非 scoped 批 128、scoped 逐个；0.66 覆盖地板；文件提交进库。
- probe-readmes.mjs：为每个条目抓 README（截断 48KB）到 data/readmes.json，带 raw/blob base URL 供相对链接重写；zh/en 互查（ZH_NAMES 9 个候选文件名）；按 locale 键存储。
- probe-tarballs.mjs：对声明 tarball 的条目做 Range: bytes=0-0 探测（206=活、404/410=死、其余=未判定保留旧裁决）；死链字段从站点剔除并回退 git 安装命令（#1619）；识别「/releases/latest/download/ + 版本号文件名」的必然腐烂模式并告警。

**腐烂扫描（scripts/scan-decay.mjs，每周一 03:41 decay-scan.yml）**
- 4 个信号：gone（404）/ archived / dormant（6 个月无 push）/ unbundled（dsh.bundle 从全树消失）；DORMANT_MONTHS=6（scan-decay.mjs:25）。
- 只标记不删除：发现写入一个 tracking issue（按标题匹配更新），移除永远是人做决定；不确定（API 错误）跳过不标记——「报告只允许包含证据，不允许包含怀疑」。
- 预算工程：GraphQL 按 50 仓/请求批取元数据（一次 1 point）；manifest 走 raw.githubusercontent.com 不占额度；并发 4 防 secondary rate limit；BOM 剥离；truncated tree = inconclusive；inconclusive > 5% 拒绝发布报告。

**收录闸门（scripts/check-submission.mjs，fork-safe：pr-gate.yml 经 workflow_run 在 base 仓跑）**
- 校验链：dsh.bundle 全树扫描（MAX_TREE_PKGS=40，vendor DSH 官方包判伪）→ 仓库年龄 ≥1 天（MIN_AGE_DAYS=1）+ 提交数 ≥10（MIN_COMMITS=10）→ 非归档 → 排除 DSH 本体（FIRST_PARTY_REPOS / FIRST_PARTY_PACKAGES，check-submission.mjs:33-42）→ 单 PR ≤3 条（MAX_ENTRIES_PER_PR=3）。
- 「不可验证」与「通过」严格区分：quota 挤压时返回 unverified 而非假绿（check() 返回 {problems, unverified}）。
- 根 URL 指向 monorepo 但根无 bundle 时，报错直接给出应指向的子目录 + 正确 url/name（check-submission.mjs:257-288，源于 2026-08-18 审计 1302 条根条目发现 48 条不可安装）。
- 子路径 404 时给出「Did you mean」候选目录提示。
- 配套：pr-guard.yml（每小时）抓无 check 的 PR；regate.yml（每 6h）重跑失败 gate。

**防文本串（scripts/check-bleed.mjs）**
- 用 40 字符滑窗 run 检测两个条目描述互串（#1348 事故后补）；同 owner 跳过；只报告不强制。

**人工评审流程（contributing.md，权威文档）**
- 「CI 通过是前置条件，不是结论」：维护者读仓库源码，逐条核对描述中的数字与 API 名（「写 46 个工具就要真有 46 个」）；分类不合只改不驳回；重复条目先到先留（但 fork 更好可顶替）；可疑源码（混淆、凭据外传、安装期异常行为）做 sanity check 而非安全审计；PR 只许动自己的条目。
- 夸大描述是「让本来不错的插件被打回的主要原因」。
- 截图表 data/screenshots.json：每条目 1-8 张图、key 必须精确等于条目 URL、只允许 GitHub 四个域名（build-site.mjs:199-221，防第三方图床种跟踪像素）；不提交则由市场从 README 抽取。
- 提交指引含 peerDependencies 预发布分支陷阱的完整说明（contributing.md 的 semver 段）。

**网站（scripts/build-site.mjs 825 行 + site/template.html + detail-template.html + locales.mjs）**
- 每 locale 的 README 是唯一事实源；双语 parity 硬校验（漏条目/分类不一致/分隔符不一致都拒构建，防静默下架）。
- 发布防护：stars 覆盖率 <66% 拒绝发布（build-site.mjs:158-166，#1673 教训）。
- 收录日期：data/added-dates.json 冻结基线 + git 历史反推（首次把该行加入 README 的 commit 日期）。
- 每个条目生成：owner/repo 拆分、dsh plugin --profile web add 命令（npm 优先 / tarball / github:）、slug、JSON-LD（首页 ItemList、详情 SoftwareApplication+BreadcrumbList）、metaDesc 智能截断（句末/词界/CJK 无空格硬切）。
- 详情页：star/分类/收录日/npm 四规格行；安装三通道带注释；README 预渲染（Marked：丢弃原始 HTML、heading 降级、相对链接/图片改绝对、图片域名白名单同截图规则、丢弃后清空段）；同类相关推荐 6 条（同 category 按 star）；README 语言缺失回退并显式标记真实 lang。
- 输出物：docs/plugins.json（公开注册表 API，字段 name/owner/url/page/category/description{en,zh}/npm/tarball/stars/downloads/install/added/screenshots，CORS *）、docs/readmes.json（共享 README payload，省约 700 次 API 调用）、Atom feed（每 locale 最新 30 条）、sitemap.xml、count.json（shields 徽章端点）、孤儿详情页修剪。
- 前端（template.html 脚本段）：category chips + 搜索框；搜索 = li.textContent.toLowerCase().includes(query) 的纯子串匹配（无分词、无权重）；排序无——只在构建期按 stars desc 排版；URL state 同步（?cat=&q=）；「/」聚焦搜索；复制命令按钮；无障碍细节（skip link、prefers-reduced-motion、hreflang）。

**没有任何 skill / CLI / AI 能力**：仓库不含 agent skill、无 CLI 工具、无任何 AI 逻辑（dsh-find-plugin 是列表内独立仓库，消费 plugins.json）。

### 1.2 bruc3van/awesome-dsh-plugin（数据管道仓库，/tmp/awesome-bruc3van）

**抓取（scripts/update.mjs，每日 14:17 cron）**
- Search API topic:dsh-plugin；单查询 1000 上限 → 按 created 日期区间递归二分（created:A..B 区间限定词），2.1s 请求间隔防 30/min 限流。
- REST 对账补捞：approved/curated 引用 + 上一版快照中 ≥3★ 但被搜索漏掉的仓库逐个 REST 核验（跟随改名），改名仓库在日志/step summary 提示人工改 key。
- 产物 data/repositories.json：10270 仓 × 18 字段（id/full_name/html_url/description/homepage/language/stargazers_count/forks_count/open_issues_count/license/archived/disabled/created_at/updated_at/pushed_at/default_branch/size_kb/topics），无过滤无审核。

**人工核实流程（data/review/README.md 为约定文档）**
- approved.json：8837 条 "owner/name": "YYYY-MM-DD" —— 用户可见页面的唯一门控。
- curated.json：编辑部裁决四表，全部带理由：excluded_repos（414 条，理由只写「不是 DSH 插件 + 它是什么」）、leaderboard_exclusions（2 条，星数来自非 DSH 产品故只进目录不进榜单）、market_exclusions（592 条，「市场不能包含市场」）、category_overrides（14 条）。
- 待审队列 data/review/pending.{json,md}：新增到 topic、带简介、未核实的仓库，带 first_seen（跨日保持）；还有「已核准但从快照消失」missing 名单。
- merge.mjs 是唯一写用户可见页面的入口；每日自动化只刷快照和队列，绝不碰 CATALOG/TOP200。
- 决定规则 5 类（通过/剔除/只进目录/非插件形态进 market_exclusions/market 类进 market_exclusions）；含「AI 一句话审核」工作流约定（让 AI 按约定逐仓核实后改 approved/curated）。

**校验（scripts/validate-*.mjs）**
- validate-curated.mjs：owner/repo 格式、分类合法、approved×excluded 不重叠、author-showcase 四段解析（30 条 cap、首页预览 10 条、行格式正则、日期合法、zh/en 同序同集）、引用仓库经 live API 校验存在性（--from-snapshot 降级）。
- validate-market.mjs：对下游 spec §8 全项校验（envelope/slug/branch 白名单/分类键/分类内星序不变量/大小上限/文本清洗）。
- validate-pr.mjs：作者自荐 PR 门禁（标题 UTF-8 完整性；新增条目须 public + topic + >10 stars）。
- test-market.mjs 488 行单测覆盖 deal/breaker/裁剪路径。

**分类（scripts/categories.mjs）**
- 8 类 + fallback（ecosystem-resources/ui-experience/media-vision/web-browser/integrations-sharing/knowledge-research/developer-tools/agents-workflows/utilities），正则模式匹配 name+description+topics，支持 category_overrides 人工修正。

**下游市场 feed（scripts/market.mjs）**
- data/market.json：schema v1，纯投影（快照+curated），过滤（有描述/非归档/非 disabled/排除名单）→ 文本清洗（码点截断 + …）→ 按 id 去重 → 类目均衡发牌（每类按 star 排序、类间按最强条目排、round-robin 取前 600）→ ≤500KB 二进裁剪保前缀性质。
- 安全阀：空池拒发；池 <上次 60% 拒发（BREAKER_RATIO）；generated_at 单调不倒退；同输入同输出 bit 级不变（不产生空 commit）；分支名白名单 isSafeBranchName。
- MARKET.md 人类可读镜像（按 star 排）；自排除名单（自己/下游消费者不进 feed）。

**用户页面（scripts/render.mjs + merge.mjs）**
- CATALOG.md：8787 仓表格（Project | Description | Language | Stars | License | Updated），按分类分节、类内按 star 排。
- TOP200.md：榜单 = 目录 − leaderboard_exclusions，取前 200；BOARD_DESCRIPTION_MAX=72 截断保持行宽。
- README.md/README_EN.md 三个数据岛由脚本刷新（生态全景 mindmap、热度榜 Top 20、统计句）；「最近加入生态」表手工轮换（约 8 条精选）；其余手工维护。
- SHOWCASE.md：作者自荐 30 条 cap、FIFO、双语同步、不被编辑部背书。

**「适合谁」类策展字段的真相**：无结构化 per-plugin 字段。仓库 README 的 tagline 承诺「告诉你每个插件适合谁、从哪里开始」（README.md:4），但 CATALOG.md 表格无此列；兑现方式只有三处人工内容：首页精选推荐区、README.md:196 的「套装 | 适合 | 组合」表、以及作者自荐文案里的「适合…的用户」表述。SHOWCASE.md 条目描述（如「适合接入几十到上千个 MCP 工具的 DSH 用户」）是文案级而非字段级。

**无网站/搜索/详情页，无 skill/CLI/AI 运行时**：交付物即 GitHub 页面与 JSON 文件；唯一的「AI」是审核工作流约定（让 AI 助手按约定审 pending 队列）。

### 1.3 dsh-mall 现状基线（对照用，全部带证据）

- 数据通道：CDN registry.json（hoyyang/dsh-market-index 优先 + bradeGithub fallback，.gz 与明文并行竞速，CDN_MAX_AGE_MS=6h 过期判定，src/catalog.ts:20-28）→ live 兜底（HTML topic 4 视图 ×50 页 + Search API union，30min TTL 缓存 + 打包快照，catalog.ts:712-772）；CDN 不可用且已有缓存时不再直爬（v1.7.18）。
- curated 覆盖层：data/awesome-known.json 1563 条（name/category/npm/description.{en,zh}/added）；src/awesome.ts 每 24h 从 awesome-dsh-plugin.com/plugins.json 刷新，失败回退打包快照；mergeDescriptions 把 known 双语 + 索引 README.<lang> 首段富化合并（catalog.ts:85-101）；9 语言 UI（client/locales.ts）。
- 检索：src/find.ts —— STOP_TOKENS 21 词；tokensOf 中文 2-4 字滑窗（权重 3/4/6）+ 英文词干子串；scoreEntry = kw×0.8（上限 12）+ log10(1+stars)×2 + curated +2 + verified +3 + market 类 +4；kw<3 一律 −∞；name 命中 +3、desc 命中 +0、owner +1（find.ts:95-124）；smartSearch 经 headless AI 改写成英文关键词（find.ts:149-178）；结果 staging 上限 20 + 按钮链接（find.ts:36-56, 249-252）。
- 分类：CATEGORIES 21 键（20 类 + other，无 identity；catalog.ts:259-281）；CATEGORY_RULES 19 条正则（catalog.ts:559-579）；CDN_CATEGORY_MAP 12→21；knownEntry.category 优先。
- 状态/更新：computeTodayStars 今日涨星基线（state.json starsSnapshot，catalog.ts:646-677）；computeUpdates（已装 deps spec vs npmVersion/version，extractVersion+compareVersions，skip 名单，catalog.ts:526-555）；pluginStatesOf live/disabled/restart（install.ts:366）。
- 操作闭环：runInstall/runUpdate/runUninstall/runSelfUpdate + withMutationLock 串行锁 + snapshotDep/rollbackDep 回退 + setPluginEnabled 启停 + removeLegacyPatchEntry 清理（install.ts）；runSmartInstall 装前 AI 审查（install/caution/refuse）+ 装后 AI 诊断（smart.ts:85-162）；智能更新/智能卸载同构（smart.ts:181+）；auto-update.ts 每日 03:30 自动一键更新（skip 名单持久化）；TaskPanel 进行中任务 + AbortController 取消（routes.ts:119,207）。
- 富化：downloads.ts npm bulk（scoped 逐个）+ totalDownloads（2019 起累计）；versions.ts GitHub tags per_page=1 兜底版本号；verified（qing3a/dsh-plugin-verify 证据 by/at/reportUrl）+ disclosure 合规披露字段（types.ts:60-70）。
- UI：MarketSection 1955 行 —— 分类 chips、搜索（name+owner+description 子串）、kind（插件/非插件）三态、curatedOnly/verifiedOnly/installedOnly/favOnly 过滤、4 排序维（stars/today/created/downloads）×升降序、分页 24、语言选择持久化；DetailPanel 多语言 README（MarkdownText 直渲）+ verified/disclosure；StoreWindow 浮窗；publish 对话框（发布自己的插件）；/dsh-mall skill 落盘（index.ts:32-46）。
- 已知短板（为本报告铺垫）：ListQuery 定义了 sinceDays 但 UI 硬编码 0（market-data.ts:66,79-96 vs MarketSection.tsx:555）；无腐烂信号（仅 live pass 过滤 fork/archived，catalog.ts:762，grep 全库仅此一处）；无截图；README 直渲无清洗；无黑名单/剔除理由；无收录闸门。

---

## 2. 差距表

### 表 A：awesome 有、dsh-mall 没有

| 能力 | awesome 证据 | dsh-mall 现状 |
| --- | --- | --- |
| 收录闸门（dsh.bundle 全树扫描 + 仓库年龄/提交数 + 单 PR≤3） | check-submission.mjs:21-70（MIN_AGE_DAYS=1, MIN_COMMITS=10, MAX_ENTRIES_PER_PR=3） | 只有 heuristicIsPlugin 三态 + 社区索引 verdict（catalog.ts:590-596），无提交质量/年龄校验 |
| 腐烂扫描 4 信号 + 周度 tracking issue | scan-decay.mjs（gone/archived/dormant 6 月/unbundled；inconclusive>5% 拒发报告） | 仅 live pass 一行过滤 fork/archived（catalog.ts:762）；无 dormant/unbundled、无 issue 流程 |
| 发布防护（数据劣化拒发） | build-site.mjs:158-166（stars 覆盖率<66% 拒绝发布）；probe-stars/probe-downloads 写盘守卫 | 仅有 CDN age>6h 判旧（catalog.ts:239），无「覆盖率骤降→拒绝换缓存」语义 |
| 黑名单 + 剔除理由公开 | bruc3van curated.json excluded_repos 414 条带理由 | 无本地排除名单，无理由展示 |
| 待审队列（first_seen 持久） | bruc3van render.mjs computePending + pending.json | 无；新条目直接进目录 |
| 防描述互串 | check-bleed.mjs（40 字符滑窗） | 无（也不写描述，风险低） |
| per-entry 截图（1-8 张，GitHub 域名白名单） | data/screenshots.json + build-site.mjs:199-221 | 无截图字段（grep screenshot 仅命中分类规则 vision） |
| README 预渲染 + 安全清洗（丢 HTML、图片白名单、heading 降级、相对链接重写）+ 共享 readmes.json | build-site.mjs renderReadme:456-505、docs/readmes.json | DetailPanel 按需 raw 抓 + MarkdownText 直渲，无清洗无白名单（DetailPanel.tsx:21-165, 330-340） |
| 收录日期（git 历史反推 + 冻结基线） | build-site.mjs added-dates 机制 | knownEntry.added 透传为 created（catalog.ts:166），但非 awesome 条目的收录日缺失 |
| tarball 字段 + 死链探测 | entries.mjs tarballProblem + probe-tarballs.mjs | 无 tarball 概念（安装命令仅 npm/github:） |
| npm 防抢注（repository 字段回指校验） | probe-npm.mjs:64-76 | 仅 NPM_OVERRIDES 手工映射 1 条（catalog.ts:106-108） |
| Atom feed / sitemap / JSON-LD / hreflang / metaDesc 截断 | build-site.mjs 660-780、template.html head | 无（本地插件无站点，feed/sitemap 可不做） |
| 分类均衡发牌 + 下游 feed spec + 60% 安全阀 + 单测 | bruc3van market.mjs dealEntries/BREAKER_RATIO、validate-market.mjs、test-market.mjs | 无自产 feed（自身是消费方） |
| 编辑推荐位（精选/套装「适合」表/作者自荐 30 cap） | bruc3van README.md:196、SHOWCASE.md、validate-curated.mjs | 无推荐位；收藏是用户私有 |
| 榜单豁免（星数与 DSH 无关的仓库不进榜） | bruc3van leaderboard_exclusions 2 条带理由 | 无；log10(star) 直接参与评分，且给 market 类 +4 分（find.ts:122，与「市场不能包含市场」原则相反） |

### 表 B：两边都有、awesome 更强

| 能力 | awesome | dsh-mall | 差距 |
| --- | --- | --- | --- |
| 双语简介质量 | 1837×2 人工撰写（entries.mjs ENTRY_KEYS） | 1563 known + README.<lang> 首段按需抓取（firstParagraph 噪声多，catalog.ts:408-432） | awesome 全人工、质量高；dsh-mall 其余 7k+ 条目仅英文且靠启发式 |
| 分类准确性 | 每条目人工 category + 维护者改分类 | knownEntry.category 覆盖 1563，其余 19 条正则兜底 | awesome 21 类全覆盖且准；dsh-mall 正则误分类不可避免 |
| 详情页内容 | 预渲染 README（清洗）+ 安装三通道注释 + related 6 条 + 收录日 | raw README + 安装单通道 + verified/disclosure | awesome 详情页信息密度与安全性更高 |
| npm 下载量覆盖 | 每日全量探测已发布子集（0.66 地板） | 按需批量 TTL 24h（用户翻页才拉） | awesome 覆盖率高；但 dsh-mall 有 totalDownloads 累计（awesome 明确不做） |
| 可安装性验证 | check-submission 全树扫 dsh.bundle + 根 URL 可装性审计（48/1302 事故） | 社区索引 installable 字段（non-plugin/manual）+ 启发式 | awesome 收录即保证可装；dsh-mall 三态里有「待判定」 |
| 更新检测 | 无 | computeUpdates + auto-update 03:30 | dsh-mall 独有 |
| 验证徽章 | 无 verified 字段（收录即人工审） | verified（qing3a 证据链） | 各有语义，不能互替 |

### 表 C：dsh-mall 已更强（如实列出，附证据）

1. **目录规模**：CDN 全量 8.8k-10k（README 自述 + catalog.ts CDN_URLS）vs awesome 1837 精选；bruc3van 8787 approved 与 dsh-mall 同级，但 dsh-mall 无审核延迟（新仓当天进索引）。
2. **agent 工具 + skill + 按钮**：find_dsh_store_plugin（find.ts:180-218）+ /dsh-mall skill 落盘（index.ts:32-46）+ 结果 staging 与按钮链接（find.ts:36-56）——awesome 两仓库均无任何 agent 入口。
3. **评分检索**：关键词加权（中文滑窗/英文词干）+ log10 star + curated/verified/market 加权（find.ts:95-124）；awesome 网站搜索是纯子串 includes（template.html 脚本段），无分词无权重。
4. **AI 智能搜索**：smartSearch 经用户模型改写需求（find.ts:149-178）——awesome 无 AI 能力。
5. **一键装/卸/更新/回退/启停 + 取消 + 任务面板**：install.ts 全套 + TaskPanel.tsx + /cancel（routes.ts:207）——awesome 只有复制命令（build-site.mjs buildRows）。
6. **智能装前审查 + 装后诊断**：smart.ts:85-162（install/caution/refuse 三段裁决）——awesome 的人工审查发生在收录时点，与用户安装时点脱节。
7. **每日自动更新**：auto-update.ts 03:30 + skip 名单 + 回退快照——awesome/bruc3van 均无版本字段可言。
8. **今日涨星基线**：computeTodayStars（catalog.ts:646-677）——依赖用户本地 state，静态网站架构上做不到。
9. **npm 下载量含 lifetime**：downloads.ts fetchTotal（2019 起）——awesome probe-downloads 头注释明确拒绝 lifetime。
10. **插件三态 + 本机状态融合**：isPlugin 三态 + kind 过滤 + 已装合成卡（local）+ 收藏 + 已验证过滤（market-data.ts:65-100、MarketSection.tsx:105-108）——awesome 是单一 curated 列表无状态。
11. **9 语言 UI + 语言持久化 + 多窗口**：client/locales.ts（en/zh/ja/ko/es/fr/de/pt/ru）、MarketSection.tsx:118-125——awesome 网站仅 en/zh。

---

## 3. 可借鉴优化清单（借鉴点 + awesome 代码位置 + dsh-mall 落点 + 工作量 + 优先级）

### P0（数据可信度，直接影响「推荐即能装」承诺）

| # | 借鉴点 | awesome 代码位置 | dsh-mall 落点文件 | 工作量 | 优先级 |
| --- | --- | --- | --- | --- | --- |
| 1 | dsh.bundle 全树扫描式安装源校验：对目录条目做「根/子包 package.json 是否声明 dsh.bundle」判定，替换仅靠名字的启发式三态 | check-submission.mjs scanTree/hasBundle（97-236 行，含 MAX_TREE_PKGS=40、BOM、truncated=unknown、根指向错误时给正确子目录） | src/github.ts packageJsonVerdict 扩展为全树扫描；src/catalog.ts cdnEntry 接入 verdict 三态 | 大 | P0 |
| 2 | 数据劣化拒发：目录 star 覆盖率骤降 >1/3 时拒绝用新索引换缓存（沿用上一次可用数据） | build-site.mjs:158-166（STARS_MIN_COVERAGE=0.66）+ probe-stars.mjs 写盘守卫 | src/catalog.ts fetchCdnRegistry（现有 CDN age 检查旁加覆盖率/条目数地板） | 中 | P0 |
| 3 | npm 防抢注：收录 npm 名时校验 registry 包 repository 字段回指同一 GitHub 仓，否则降级 github: 安装 | probe-npm.mjs:64-76（linked 判定） | src/catalog.ts cdnEntry npm 赋值前加回指校验（有 token 时按需） | 中 | P0 |
| 4 | 腐烂信号展示（不只过滤）：archived/6 月无 push/unbundled 徽章 + 详情面板展示，替代静默丢弃 | scan-decay.mjs（DORMANT_MONTHS=6、四信号、inconclusive>5% 拒发） | src/catalog.ts cdnEntry 从索引 pushed_at/archived 派生 status 字段；src/client/DetailPanel.tsx + 卡片徽章 | 小 | P0 |

### P1（策展深度与安全渲染）

| # | 借鉴点 | awesome 代码位置 | dsh-mall 落点文件 | 工作量 | 优先级 |
| --- | --- | --- | --- | --- | --- |
| 5 | 黑名单 + 理由：本地排除清单（key→理由）持久化在 state.json，卡片/详情展示「目录站/非插件/蹭 topic」理由；对接 bruc3van curated.json 的 414 条现成理由 | bruc3van data/curated.json（excluded_repos 带理由）+ render.mjs catalogRepositories | src/catalog.ts readState/applyVerdicts 旁加 exclusions；src/client/MarketSection.tsx 过滤 + DetailPanel 展示 | 中 | P1 |
| 6 | README 安全渲染：host 端清洗（丢原始 HTML、图片域名白名单 raw/camo/user-images.githubusercontent.com、heading 降级、相对链接改绝对）后再下发，替代 MarkdownText 直渲 raw | build-site.mjs renderReadme:456-505 + SCREENSHOT_HOSTS:199 | src/routes.ts 新增 /dsh-mall/readme 端点（DetailPanel 抓取逻辑上移）或 client/DetailPanel.tsx 前置清洗 | 中 | P1 |
| 7 | 详情页信息密度：安装多通道注释（npm 预构建/tgz/源码构建提示）、related 同类别 6 条、added 收录日、downloads 展示 | build-site.mjs:525-547（specs/cmds/related） | src/client/DetailPanel.tsx | 中 | P1 |
| 8 | 榜单豁免/加权修正：星数与 DSH 无关的仓库（如 mirage 星来自通用产品）不进「最受欢迎」排序头部；market 类 +4 与「市场不能包含市场」原则冲突，改成分段呈现而非加分 | bruc3van leaderboard_exclusions 2 条带理由 + market_exclusions 592 条 | src/find.ts scoreEntry（豁免表或减权）；src/client/MarketSection.tsx 排序 | 小 | P1 |
| 9 | 收录日补全：非 awesome 条目用 GitHub created_at（索引已有）填充 created，让 created 排序维与「新收录」筛选真正可用 | build-site.mjs added-dates 机制 | src/catalog.ts cdnEntry created 回退 repo 索引 created_at；MarketSection sinceDays 接线（现硬编码 0，market-data.ts:66 vs MarketSection.tsx:555） | 小 | P1 |

### P2（体验加分）

| # | 借鉴点 | awesome 代码位置 | dsh-mall 落点文件 | 工作量 | 优先级 |
| --- | --- | --- | --- | --- | --- |
| 10 | 编辑精选位：「套装|适合|组合」表与精选推荐的人工策展形态 → 商场顶部「编辑精选」卡片组（awesome known + 预设 JSON） | bruc3van README.md:196、SHOWCASE.md | src/client/MarketSection.tsx 品牌卡下新增精选行 + data 包内精选清单 | 小 | P2 |
| 11 | 截图：详情面板 README 首图抽取或索引 screenshot 字段展示轮播（GitHub 域名白名单同 #6） | data/screenshots.json | src/client/DetailPanel.tsx + 索引消费 | 中 | P2 |
| 12 | 分类正则质量：未知条目定期用 bruc3van category_overrides 扩充映射 | bruc3van curated.json category_overrides（14 条）+ categories.mjs 8 类正则 | data/awesome-known.json 生成脚本或 src/catalog.ts 内嵌映射 | 小 | P2 |
| 13 | 发布防护语义化：CDN 索引条目数较上次快照骤降（<60%）时前端显示「索引可能不完整」提示而非静默展示 | bruc3van market.mjs BREAKER_RATIO=0.6 | src/catalog.ts LoadResult 增加 degradation 标志 + MarketSection 提示行 | 小 | P2 |

---

## 4. 「做得比 awesome 强」策略（8 条，基于 dsh-mall 独特资产）

**策略 1：全量长尾 × 评分检索——awesome 的结构性盲区。**
awesome 的定位决定了它只能收录 1837 条：单 PR ≤3（check-submission.mjs:70）、维护者逐仓读源码（contributing.md 评审第 1 条）、10 commits 门槛——长尾新插件要么等审核要么永远不可见。dsh-mall 的 CDN 索引当天收录 8.8k-10k，find.ts 的滑窗分词 + log10 star 让任意长尾词都能命中。为什么 awesome 做不到：人工策展的边际成本与目录规模线性相关，而 dsh-mall 的增量成本为零（索引方承担）。

**策略 2：安装时点的 AI 安全审查——awesome 的审查发生在错误的时间。**
awesome 的人工审查是收录时点的一次性 sanity check（contributing.md 明说「不是安全审计」）；用户安装时没人再看。dsh-mall 的 runSmartInstall 在用户点击安装的那一刻抓最新 README+package.json 交给用户自己的模型裁决 install/caution/refuse（smart.ts:85-127）。为什么 awesome 做不到：静态网站没有运行时、没有用户模型上下文，审查时点与风险窗口必然脱节。

**策略 3：装/卸/更新/回退/启停的一键闭环——静态列表的物理上限。**
awesome 能提供的最好东西是复制命令（build-site.mjs buildRows 的 cmd）。dsh-mall 有 install.ts 全套（runInstall/runUninstall/runUpdate/rollbackDep/setPluginEnabled）+ 串行锁 + 取消 + 任务面板 + 回退快照。为什么 awesome 做不到：它不运行在 DSH 进程内，没有 profile/manifest/patch 的读写权限；这是插件形态对「目录+文档」形态的碾压性差异，不是工程差距。

**策略 4：更新检测与每日自动更新——awesome 连版本号都没有。**
plugins.json 的字段清单里没有 version（build-site.mjs:694-730 registry 定义）；bruc3van 亦无。dsh-mall 用 npmVersion/tags 富化 + extractVersion/compareVersions 对比已装 deps（catalog.ts:508-555），每日 03:30 自动更新（auto-update.ts）+ skip 名单 + 回退。为什么 awesome 做不到：需要读取用户 profile 的 package.json 依赖 spec——目录站永远拿不到这份数据。

**策略 5：今日涨星基线——需要「用户本地状态」的指标。**
computeTodayStars 以用户首次成功拉取当天的 star 为基线计算增量（catalog.ts:646-677）。awesome 的 stars.json 是全局快照，无法回答「我上次看之后涨了多少」。为什么 awesome 做不到：每个访客的基线不同，静态托管没有 per-user 持久化；dsh-mall 把基线写进 profile state.json 天然实现。

**策略 6：npm 下载量按需 + 累计总量——比 awesome 多一个时间维度。**
awesome 明确只做 last-month 且给出理由（probe-downloads.mjs 头注释）；dsh-mall 在同样 last-month 之外还提供 2019 起的 totalDownloads（downloads.ts:20-28）作为第二个排序信号，且按需拉取 + TTL 缓存不占 CI。为什么 awesome 不做：它是批处理管道，全量 lifetime 探测没有收益；dsh-mall 的按需模型对用户翻页零浪费。

**策略 7：插件三态 + 本机状态融合——从「目录」到「你的目录」。**
isPlugin 三态判定（plugin/non-plugin/待判定，heuristicIsPlugin + verdicts，catalog.ts:590-596）、已验证徽章（qing3a 证据链）、curated 徽章、已装/可更新/已停用状态合成到同一张卡片（MarketSection.tsx:495-505 installedInfo 匹配逻辑）。awesome 的条目是静态事实，不含任何「对当前用户意味着什么」。为什么 awesome 做不到：它不知道你是谁、装了什么；dsh-mall 的 state.json + manifest 读取把目录变成个人仪表盘。

**策略 8：9 语言 UI + 按需多语言简介——策展双语不可扩展。**
awesome 的双语靠人工翻译 1837×2（contributing.md 明说「缺翻译是维护者的活」），永远只有 en/zh。dsh-mall 用 README.<lang>.md 首段按需富化（catalog.ts:405-487 fetchLocalizedDescriptions，6 并发 raw 直连不占 API 额度）+ 9 语言界面（locales.ts）。为什么 awesome 做不到：人工翻译 9 语言 ×1800 条目在经济上不可行；dsh-mall 的机器富化对 10k 全量免费扩展。

---

## 5. 结论

1. 三个仓库的分工事实：awesome-main = 高质量人工策展（1837）+ 防腐基础设施（收录闸门/腐烂扫描/发布防护/防文本串）；bruc3van = 全量抓取管道（10270）+ 人工核实门控（8837 approved）+ 带理由黑名单 + 规范化下游 feed；dsh-mall = 运行时商场 + AI 操作闭环 + 全量可搜索性。三者是「策展深度 × 覆盖面 × 运行时能力」三角，互不重叠的部分才是各自护城河。
2. dsh-mall 最大的真实差距不在功能而在数据治理：收录闸门（#1）、发布防护（#2）、npm 防抢注（#3）、腐烂信号（#4）四项 P0 补上后，「推荐即能装」的承诺才与 awesome 同级；否则 10k 目录的噪声会持续侵蚀 find 工具的可信度。
3. dsh-mall 已不可替代的能力：一键装更卸回退、安装时点 AI 审查、每日自动更新、今日涨星——这些全部依赖「在 DSH 进程内、有用户 profile 与模型」的资产，awesome 两仓库在架构上永远做不到。差异化方向应继续加注运行时闭环，同时把策展信号（黑名单/腐烂/防抢注）作为数据层接入。



