# dsh-store 数据治理方案（P0+P1+P2 全量）与「已扫描 / 黑名单」筛选

> 日期：2026-08-22 · 依据：awesome-dsh-plugin 双仓库调研报告（/Users/hoy/Desktop/DSH/awesome-dsh-plugin-gap-analysis.md，13 条借鉴清单，已抽查验证）
> 决策人：等用户审阅本方案后给执行指令；每轮执行照例递增版本号 + 补 CHANGELOG + 本地提交不 push。

## 0. 两个问题的直接回答

1. **「已扫描」「黑名单」筛选按钮——可以加，而且应该加。** 语义定义：
   - 「已扫描」= 机器 bundle 校验通过（dsh.bundle 全树扫描确认可安装）。与现有「已验证」（qing3a 人工装机证据）互补：一个是机器门、一个是人工门。
   - 「黑名单」= 被剔除条目（不是插件/蹭 topic 等）默认从目录隐藏；按钮为「显示黑名单」开关，打开后以红色系卡片展示并带公开理由。这样既不让噪声污染主目录，又满足「剔除理由公开可查」的可信度要求。
2. **扫描时机 = 数据更新时（dsh-market-index Action 跑完构建时）为主，运行时按需为补充。** 两层：
   - CI 层（权威批量）：每日全量 + 每 30 分钟增量构建时，对新进/变更仓库跑 bundle 校验、npm 回指校验、dormant 标记；结果写进 registry.json / exclusions.json，随索引一起发布。10k 规模用 GraphQL 批取（50 仓/请求=1 个 point），GITHUB_TOKEN 额度 5000/h 完全够（约 200 points/轮）。
   - 运行时段（新鲜度补充）：CI 一天一次，插件当天撤销 bundle 要等一天才被发现。dsh-store 在刷新后对「CI 扫描之后又有 push 的条目」做页级抽查（每页 ≤24 仓、raw+API 混合、24h TTL 缓存、匿名额度耗尽自动跳过），保证「刚作废的插件当天就在商店里被标记」。
   - 为什么不做纯运行时全量扫：10k × 每次刷新 = 打爆 API 额度且拖慢刷新；为什么不做纯 CI：新鲜度最多差一天。

## 1. 方案总览与数据流

```
dsh-market-index（CI，数据更新时）                    dsh-store（运行时）
  抓取(Search/REST,10k+)  ──┐                       CDN registry.json（含新字段）
  合并/继承(v1.13)  ←──────┤                       exclusions.json（黑名单+理由）
  bundle 全树扫描(新)  ←───┤                       按需 top-up 扫描(新) ── 页级抽查
  npm 回指校验(新)  ←──────┤                       筛选：「已扫描」「黑名单」chip
  dormant 标记(新)  ←──────┼──►  registry.json     卡片/详情：徽章+理由展示
  exclusions.json(新) ←────┤                      安装目标降级：npm 未回指→github:
  质量门(覆盖率/继承)  ←───┘                       （全部默认隐藏黑名单，开关展示）
```

## 2. 数据契约（新增字段，全部向后兼容：缺字段=null=未扫描）

registry.json 每仓新增：
- bundled: true | false | null —— dsh.bundle 全树扫描结论（null=未知/树被截断）
- bundled_at: ISO 日期 —— 扫描批次时间
- npm_linked: true | false | null —— registry 包 repository 字段是否回指同一仓库（防抢注）
- dormant: true | false —— pushed_at 距今 > 180 天（腐烂信号，索引已有 pushed_at，纯计算）

新增 exclusions.json（独立小文件，索引仓库维护，商店并行拉取）：
```
{ "version": 1, "generated_at": "...",
  "entries": { "owner/repo": { "kind": "excluded|leaderboard|market", "reason": "Not a DSH plugin — it is ...", "since": "2026-08-22" } } }
```
- 种子数据：bruc3van/awesome-dsh-plugin data/curated.json（MIT 许可，已确认）：excluded_repos 414 条带理由 + leaderboard_exclusions 2 + market_exclusions 592。构建时拉 raw 合并本地 data/exclusions.local.json 覆盖（本地可加可改，优先级高于远程种子）。

dsh-store MarketEntry 新增：bundled / bundledAt / npmLinked / dormant / excluded:{kind,reason}。buildEntry 从索引映射；excluded 条目默认从「全部」计数与列表剔除，黑名单开关打开后可见。

## 3. 任务拆解（每轮一个版本号 + CHANGELOG，建议执行顺序）

### 阶段一：黑名单数据（快，先出效果）
**R1 · dsh-market-index v1.14（小）**
- 新增 scripts/build-exclusions.mjs：拉 bruc3van curated.json（raw 直连，MIT 附出处注释）→ 合并本地 data/exclusions.local.json（同 key 覆盖）→ 产出 exclusions.json；CI Commit 步骤把该文件一并提交（白名单里加 exclusions.json）。
- 验证：本地 node 跑一遍，jq 校验 schema/计数（414+2+592 量级）、原因非空、重复 key 报错。
**R2 · dsh-store v1.7.20（小）**
- catalog.ts：fetchCdnRegistry 并行拉 exclusions.json（失败=空+lastError，不阻塞目录）；buildEntry 给命中条目加 excluded。
- 客户端：toolbar 新增「黑名单」chip（默认关）；开=显示被剔除条目（红色虚线卡片+徽章+理由，安装按钮禁用并提示理由）；全部/分类计数在开与关两种状态各算各的；详情面板展示理由与 kind。
- locales：en/zh 词条。验证：CDP 开关黑名单、核对 414 条量级出现在开关后、卡片理由可见。

### 阶段二：CI 批量扫描（数据更新时，核心）
**R3 · dsh-market-index v1.15（中）**
- scripts/scan-bundles.mjs：仿 awesome scan-decay 的 GraphQL 批取（50 仓/请求、并发 4、BOM 剥离、truncated tree=unknown、dsh.bundle 全树匹配、MAX_TREE_PKGS=40）；仅对「无 npm_version 或 installable 未定」的子集先扫（约 6k），继承策略同 latest_tag（旧值保留、缺口逐轮收敛）；覆盖率 <60% 时本轮结果不落盘并告警（防劣化）。
- enrichNpmVersions 增加 npm 回指校验（registry latest manifest 的 repository 字段必须包含 owner/repo，否则 npm_linked=false，逻辑同 awesome probe-npm.mjs:64-76）。
- 构建尾部计算 dormant（pushed_at > 180d），写 registry.json 新字段；CI Commit 白名单不变（registry.json 已在列）。
- 验证：本地 INCREMENTAL 跑 + jq 统计 bundled 覆盖率与抽样（colleague-skill 应 bundled=true）；push 后触发全量 run，观察日志「bundle 扫描完成 x/y」。
**R4 · dsh-store v1.7.21（小）**
- 客户端：「已扫描」chip（bundled===true，计数联动）；卡片徽章区分三态：已扫描✓（绿边）/未扫描？（灰）/失效×（红）；dormant/archived 徽章「疑似废弃」「已归档」+详情行；筛选与搜索/排序/分类/已安装全部联动（沿用现有 filter 管道）。
- 验证：CDP 点「已扫描」筛出子集、计数与 /registry 数据一致、徽章文案正确。

### 阶段三：运行时补充与安全落地（新鲜度 + 防抢注生效）
**R5 · dsh-store v1.7.22（中）**
- 新增 POST /dsh-store/scan：页级 top-up——对 bundled 未知 或 pushed_at > bundled_at 的条目（每页 ≤24、匿名额度用完自动停）；策略：raw 读根 package.json 命中 dsh.bundle→true；未命中→GitHub API tree 抽查（有 token 用 token）→ 仍不确认=unknown；结果缓存 state.json 24h。客户端在翻页/刷新后按需调用（同 versions 模式）。
- 发现 bundled=false 且此前为 true 的条目（插件作废）→ 卡片即时「失效」徽章 + 详情警告；不自动删除条目（数据修正走索引 CI）。
**R6 · dsh-store v1.7.23（中）**
- npmLinked===false 的条目：安装目标从 npm 名降级为 github:owner/repo，安装弹窗加警示「npm 包与仓库无回指关系，已改用源码安装」；「一键更新」跳过这类条目（防装错包）。
- 详情面板安装命令同降级。验证：构造/找一条 npm_linked=false 实测弹窗与命令。

### 阶段四：P1/P2 补强（策展深度与安全渲染，数据治理稳定后再做）
**R7 · v1.7.24（中）README 安全渲染**：新增 GET /dsh-store/readme 端点，host 清洗（丢原始 HTML、图片域名白名单 raw/camo/user-images.githubusercontent.com、heading 降级、相对链接改绝对）后下发；DetailPanel 改走端点（P1-6）。
**R8 · v1.7.25（小）榜单豁免/减权**：find.ts 对 leaderboard_exclusions（星数与 DSH 无关）条目 star 权重置 0；market 类 +4 改为「仅当查询语义为市场/商店类关键词时加分」（P1-8）。
**R9 · v1.7.26（小）收录日补全**：cdnEntry.created 回退索引 created_at；MarketSection sinceDays 接线（现在是硬编码 0，market-data.ts:66 与 MarketSection.tsx:555），让「新收录」筛选可用（P1-9）。
**R10 · v1.7.27（中）详情页信息密度**：安装三通道注释（npm 预构建/tgz/源码构建）、同类别相关 6 条、added 收录日行（P1-7）。
**R11 · v1.7.28（小）编辑精选位**：品牌卡下「编辑精选」行（awesome known + 内置精选 JSON，P2-10）。
**R12+（P2 可选）**：截图（P2-11）、分类映射扩充（P2-12，把 bruc3van category_overrides 14 条并入 known）、降级提示（P2-13：索引条目数较上次快照骤降<60% 时前端提示「索引可能不完整」）。

## 4. 兼容性与风险

- 向后兼容：所有新字段缺省 null；旧索引/旧版本插件照常工作；筛选 chip 在数据未就绪时显示计数 0 与「扫描进行中」提示，不误报。
- 额度：CI GraphQL ~200 points/轮（5000/h 额度内）；运行时扫描 raw 为主不占 API；匿名 60/h 耗尽自动停。
- 数据劣化防护：bundle 覆盖率 <60% 不写新值（继承旧值）；exclusions.json 拉取失败 fail-open（空表）不阻塞目录。
- 语义风险：「已扫描」与「已验证」易混 → 文案与 tooltip 明确「机器校验 vs 人工实测」，徽章样式区分。
- bruc3van 种子数据会漂移 → 本地 exclusions.local.json 覆盖 + 每次构建重拉种子（其仓库 MIT，引用附出处）。
- 黑名单默认隐藏可能让用户误以为条目丢失 → 开启开关时顶部提示「已显示 N 条被剔除条目（附理由）」。

## 5. 验证与交付纪律

- 每轮：typecheck + npm run build + dev_reload_package + CDP 实测（筛选联动/计数/徽章/降级命令）+ 截图（CDP 截图 MCP 恢复后补视觉验证）。
- 每轮：package.json 版本递增（A.B.C、A≤两位）+ CHANGELOG 条目 + 本地提交（不 push，等用户明示并先脱敏扫描）。
- 索引仓库改动按既有惯例 push（数据管道仓库）；dsh-store 代码一律不 push。
- STATE.md 每轮落盘（当前 next_action 已指到本方案）。

## 6. 工作量与排期总览

| 轮次 | 内容 | 仓库 | 工作量 | 版本 |
| --- | --- | --- | --- | --- |
| R1 | exclusions.json 管道（种子+覆盖+提交白名单） | index | 小 | v1.14 |
| R2 | 黑名单消费+「黑名单」chip+理由展示 | store | 小 | 1.7.20 |
| R3 | CI bundle 扫描+npm 回指+dormant+质量门 | index | 中 | v1.15 |
| R4 | 「已扫描」chip+三态徽章+废弃徽章 | store | 小 | 1.7.21 |
| R5 | 运行时 top-up 扫描（/dsh-store/scan） | store | 中 | 1.7.22 |
| R6 | 安装目标降级（npm 未回指→github:） | store | 中 | 1.7.23 |
| R7-R12 | README 安全渲染/榜单减权/收录日/详情密度/精选位/截图等 | store+index | 中/小 | 1.7.24+ |

建议从 R1+R2 开始（先让「黑名单」按钮活起来，R1/R2 每轮都小、见效最快），然后 R3+R4 上「已扫描」，再接 R5/R6。


---

## 修订记录（2026-08-22 晚间）
- v1.7.32-34：按用户反馈删除「黑名单」「近30天」两个筛选按钮；剔除数据降级为内部「非插件」标注（isPlugin=false），不做黑名单维度。
- v1.7.35：头部排版调整（搜索+智能搜索独占一行、排序移到筛选行最右）。
- 索引 v1.16/v1.17：扫描 token 环境变量修复 + bundle 扫描重写为 raw 根 manifest 判定（GraphQL 别名批取方案废弃）。
