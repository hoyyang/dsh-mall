# DSH 商店（dsh-store）

DeepSeek Harness 里的 GitHub 全量插件市场：收录所有带 #dsh-plugin 标签的公开仓库（8000+ 且持续增长），支持浏览、搜索、排序、筛选、一键安装/卸载，并可一键给自己的仓库打标签上架。

## 安装

    dsh plugin --profile web add github:YOUR/dsh-store
    # 或本地构建包：
    dsh plugin --profile web add /path/to/dsh-store

重启 dsh web，打开 设置 → DSH 商店。

需要 dsh web ≥ 0.1.0-rc.6（缺组件时市场会自我禁用并在浏览器控制台说明原因）。

## 功能

- 全量目录：GitHub 上所有 dsh-plugin topic 公开仓库（约 7.1k）。数据来自你自己的索引仓库 hoyyang/dsh-market-index：GitHub Actions 用 stars 分段 + 对半二分突破单 query 1000 条上限全量收敛，每 2 小时增量、每天全量刷新，经 jsDelivr CDN 分发（插件端零 API 限流）；host 端 30 分钟 TTL 缓存 + 内置快照兜底。
- 卡片字段：项目名、简介、star 数、分类徽标、发布时间、发布时长、最近更新、今日 star 增长（本地每日基线差值，无基线显示 —）、精选/非插件/已安装徽标。
- 分类：沿用 awesome-dsh-plugin 12 类 + 其他；精选映射表优先，其次名称/描述/topics 规则，兜底其他。
- 是否插件判定：三层（免费启发式 → 按需抓 package.json 深度校验并缓存结论 → 待判定徽标）；有 token 时后台全量批处理。
- 筛选：分类 × 是否插件（全部/仅插件/非插件）× 仅精选 × 已安装 × 最近活跃时间窗，全部与实时搜索、4 种排序（star 升/降、今日增长升/降）组合生效，纯前端零网络请求。「已安装」按当前 profile 的依赖与 bundles 清单判定，与其他筛选及分类计数实时联动。
- 安装/卸载：风险分级确认（精选绿 / 社区黄 / 疑似非插件红）+ 进度轮询 + 已安装徽标；经 dsh CLI 写入 profile 依赖与 bundles，卸载同步清理。
- 上传我的插件：为自己的仓库一键添加 dsh-plugin 标签（需 GitHub token，repo 权限）——GitHub 索引后几分钟即可在市场搜到；无 token 可复制 gh 命令或手动在 About 添加标签。
- GitHub token：设置 → 插件 → 插件配置 的卡片（dsh ≥ rc.7）或 POST /dsh-store/token、DSHM_GITHUB_TOKEN 环境变量；提升限额（search 10→30/分钟、core 60→5000/小时）并启用判定批处理。token 仅存内存。

## 数据刷新时机

- 进入市场分区（mount）：拉取 registry，命中 TTL 缓存秒开，过期则后台重抓并展示旧数据 + 刷新中状态。
- 切换分类/筛选：纯前端即时过滤 + 触发一次静默刷新（TTL 内不重复请求）。
- 手动刷新按钮：绕过 TTL 强制重抓，显示分片进度与完成时间。
- GitHub 限流时自动降级内置快照并提示恢复倒计时。

## 安全

- 安装/卸载/上传/token 路由仅接受同源 POST。
- token 不落盘、不进日志、不出现在任何响应中。
- 构建脚本保持 pnpm ≥10 默认禁止。

## 已知取舍

- 今日 star 增长需要本地每日基线：当天首次成功抓取落盘，此后与基线求差；新装用户当天显示 —。
- 无 token 时 isPlugin 深度校验按 GitHub 限额排队，仅处理当前页附近条目；token 可全量批处理。
- v1 安装后需刷新页面激活（未做热挂载）；卸载同样即时生效但 UI 状态在下次 status 轮询后更新。

## 开发

    npm install        # 依赖
    npm run build      # tsc（host）+ tsdown（client bundle）+ normalize
    npm run snapshot   # 重建内置快照（data/）
    npm run typecheck

MIT License
