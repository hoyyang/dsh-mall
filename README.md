# DSH 商场

把 GitHub 上所有带 `#dsh-plugin` 标签的插件收进一个商场里：浏览、搜索、比分数、一键装。装之前还能让 AI 先帮你把代码审一遍，觉得不对就拦下来。

[**English**](README.en.md) · [Releases](https://github.com/hoyyang/dsh-mall/releases) · [更新日志](CHANGELOG.md)

<p align="center">
  <img alt="dsh compatibility" src="https://img.shields.io/badge/dsh-0.1.0--rc.8%2B-blue">
  <img alt="npm" src="https://img.shields.io/npm/v/dsh-mall?kill_cache=1">
  <img alt="release" src="https://img.shields.io/github/v/release/hoyyang/dsh-mall">
  <img alt="license" src="https://img.shields.io/github/license/hoyyang/dsh-mall">
  <img alt="stars" src="https://img.shields.io/github/stars/hoyyang/dsh-mall?style=flat">
</p>

![DSH 商场](assets/screenshot-main-zh.png)

## 安装

```sh
dsh plugin add dsh-mall
```

装完重启 `dsh web`，侧边栏「设置」上面就会出现 **DSH 商场**。需要 dsh web 0.1.0-rc.8 或更新版本（0.1.0-rc.8 实测过）。

## 能干什么

- **全量目录**——GitHub 上打 `#dsh-plugin` 标签的仓库全都收，自己的 CI 每 2 小时更新一次，不怕 GitHub 限流。
- **智能安装 / 更新 / 卸载**——装之前 AI 用你配的模型把仓库代码读一遍，给出「装 / 谨慎 / 别装」的结论；卸载前扫一遍本地有没有别的插件在用它。AI 用不了就退回普通流程。
- **Agent 友好**——自带 `find_dsh_mall_plugin` 工具和 skill，聊天里喊一句"帮我找个能删除会话的插件"，它直接给你挑好。
- **五维评分**——维护、实用、热度、便捷、信号五个数加一个综合分，还带一句"为什么推荐"。分数怎么算的，鼠标放雷达图上就告诉你。
- **中文标签 + 九语言简介**——插件带中文功能标签，简介有九种语言，全走索引管道分发，你不用付一分钱 LLM 费用。
- **编辑精选 + 为你推荐**——每周更新的精选；根据你装了啥、选了啥给你推（冷启动有 30 秒问卷）。
- **信任徽章**——已扫描（机器验过仓库里有 dsh.bundle）、精选、已验证、含 skill、休眠警告，一眼分清。
- **九语言界面**——中文、English、日本語、한국어、Español、Français、Deutsch、Português、Русский，一键切。
- **装完管到底**——一键更新、每天 03:30 自动更新、回退、启用开关、带进度和取消的任务面板。
- **README 安全渲染**——把 README 里的徽章碎片清干净再显示，顺手把安装命令抠出来给你复制。
- **关键信号**——今日新增 star、npm 近 30 天/总下载量、版本号胶囊。

## 用法介绍

按实用性打分，从最亮眼的讲起。

### 🧠 智能安装 —— 实用性 95

点安装时选「智能安装」：AI 把你的模型当审查员，仓库代码作为不可信数据喂进去（有分隔符隔离、不执行），给出装 / 谨慎 / 别装三档结论。判「别装」就直接停；AI 抽风或超时就退回普通安装，不影响你用。

![安装确认弹窗](assets/shot-zh-install.png)

### 📊 五维评分 —— 实用性 90

每张卡右上角一张五边形雷达图：维护、实用、热度、便捷、信号五个数，中间是综合分。综合分是**加权几何平均**——乘法融合，哪一维接近 0 都会把总分拽下去，所以新仓库（0 星）分数低是诚实的，攒了 star 自然涨。鼠标悬停雷达图：放大发光 + 跟着你鼠标弹出一张说明卡，每个分数怎么算的说人话。

![详情页评分卡](assets/shot-zh-detail.png)

### 🔌 Agent 友好 —— 实用性 90

给 Agent 用，比给人用更顺手。聊天里直接说需求，`find_dsh_mall_plugin` 工具从全目录里挑出推荐的加相关的，一条按钮链回商场浮窗看卡片。智能搜索还会先用你的模型把需求翻译成检索词，再按关键词+口碑+质量打分排序。

![智能搜索结果浮窗](assets/shot-results.png)

### ⭐ 编辑精选 + 为你推荐 —— 实用性 85

首页中段两栏：左「编辑精选」（每周一更新，awesome 人工策展里综合分最高的几位），右「为你推荐」（看你 30 天用了啥、答过啥问卷，推荐理由写在卡上）。不知道装什么？点问卷 30 秒选几个关心的功能，马上出结果。

![编辑精选与为你推荐](assets/shot-picks.png)

### 🧰 任务面板 + 重启提示 —— 实用性 80

装、更、卸都有进度，面板里能看能取消。patch 里带配置或表达式的插件热挂载只支持纯 insert——改了不生效时，卡片上会亮「重启后生效」提示，旁边「为什么未生效？」点开一句人话解释。任务面板是全局的：不管从主商场还是搜索结果浮窗发起的任务，两边都能看到。

![任务面板](assets/shot-tasks.png)

### ⚙️ 设置 —— 实用性 75

设置浮窗里有「DSH 商场-设置」：自动更新开关（每日 03:30 全量检查）、数据源、GitHub 额度配置（可选，仅存内存）。GitHub 不可用时限流了也不怕，商场回落到打包快照照常能用。

![商场设置](assets/shot-zh-settings.png)

## 数据从哪来

目录由配套仓库 [**hoyyang/dsh-market-index**](https://github.com/hoyyang/dsh-market-index) 的 CI 构建：GitHub 搜索 + 人工策展目录 [awesome-dsh-plugin](https://awesome-dsh-plugin.com)，按策展分类归档，富化 bundle 扫描、npm 回指、休眠检测、README 结构与 LLM 标签。商场走 raw/jsDelivr CDN 通道读取，每 30 分钟刷新一次。

## 安全说明

- 所有写操作接口（安装/卸载/更新/开关）只接同源请求。
- 安装前必看来源；智能安装把仓库内容当不可信数据处理。
- 凭证从不落盘；用户级数据源/凭证设置路由已删，只认部署配置。
- 第三方插件是第三方代码，装前自己掂量。「已扫描」说的是结构可安装，不是安全审计。

## 许可证

[MIT](LICENSE) © hoyyang。数据来自 GitHub 与 [awesome-dsh-plugin](https://awesome-dsh-plugin.com)（MIT），各自条款为准。

思路参考了 [dshmarket](https://www.npmjs.com/package/dshmarket) 和 [dsh-market](https://github.com/2BingLing/dsh-market)。
