# Changelog

## 1.0.0 — 2026-08-20

首个正式版本（包名 dsh-store · DSH 商店）：
- GitHub #dsh-plugin 全量目录（自有 CI 索引，每 2h 增量 + 每日全量，raw/jsDelivr 双通道 + 内置快照兜底）
- 官方 20 类分类 + 是否插件三态筛选 + 仅精选 + 实时搜索 + 4 种排序（star 升降、今日增长升降）+ 类别计数
- 一键安装 / 卸载（风险分级确认、进度轮询、已安装徽标）
- 上传我的插件（一键打 dsh-plugin 标签，无 token 提供 gh 命令引导）
- GitHub token 双路径（设置卡 + /token 路由 + 环境变量，仅存内存）
- 今日 star 增长（本地每日基线）；进入即刷新 + 每 30 分钟自动刷新
- DeepSeek 品牌深色主题头卡；中英双语，跟随宿主界面语言

## 版本规则

- 版本号格式 A.B.C：大版本（A，最多两位）发生不兼容/重大改动时 +1；新增功能时 B+1；缺陷修复时 C+1。
- 发版流程：npm version <patch|minor|major> → 更新本文件 → npm run build && npm pack。
