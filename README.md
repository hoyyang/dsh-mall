# DSH 商场

![banner](assets/banner.png)

GitHub 上所有 `#dsh-plugin` 插件都在这：逛、搜、比分数，看中一键装。拿不准的，先让 AI 帮你把代码审一遍。

[**English**](README.en.md) · [Releases](https://github.com/hoyyang/dsh-mall/releases) · [更新日志](CHANGELOG.md)

<p align="center">
  <img alt="dsh compatibility" src="https://img.shields.io/badge/dsh-0.1.0--rc.8%2B-blue">
  <img alt="npm" src="https://img.shields.io/npm/v/dsh-mall?kill_cache=1">
  <img alt="downloads" src="https://img.shields.io/npm/dw/dsh-mall">
  <img alt="release" src="https://img.shields.io/github/v/release/hoyyang/dsh-mall">
  <img alt="license" src="https://img.shields.io/github/license/hoyyang/dsh-mall">
  <img alt="stars" src="https://img.shields.io/github/stars/hoyyang/dsh-mall?style=flat">
</p>

## 安装

```sh
dsh plugin add dsh-mall
```

装完重启 `dsh web`，侧边栏就有 **DSH 商场** 了。需要 dsh web 0.1.0-rc.8 或更新版本（0.1.0-rc.8 实测过）。

## 功能一览

- **全目录**——GitHub 上打 `#dsh-plugin` 标签的仓库全收，每 2 小时自动更新，不怕限流。
- **AI 装前审查**——装之前 AI 把仓库代码读一遍，给「装 / 谨慎 / 别装」的结论，别装就直接拦下。
- **在会话里找插件**——插件自带 skill，在 Agent 会话里执行 `/dsh-mall` 说一句需求，它直接从全目录挑好，结果带一个按钮点开就是商场卡片页。
- **五维评分**——维护、实用、热度、便捷、信号，五个数加综合分，每张卡带雷达图。分数怎么算的，鼠标放雷达图上就解释给你听。
- **中文标签**——每个插件带中文功能标签和九语言一句话简介。
- **编辑精选 + 为你推荐**——每周更新的精选；按你装了啥、选了啥来推，不知道装什么有 30 秒问卷。
- **信任徽章**——已扫描、精选、已验证、含 skill、休眠警告，一眼看清底细。
- **九语言界面**——中英日韩西法德葡俄，一键切。
- **装完管到底**——一键更新、每天自动更新、回退、启用开关、任务面板（能取消）。
- **安全渲染**——README 里的徽章碎片清干净再显示，安装命令抠出来给你复制。

## 用法介绍

### 1. 入口在哪

dsh 首页左侧栏，「设置」按钮正上方就是 **DSH 商场**，点一下打开。

![侧边栏入口](assets/shot-entry-zh.png)

### 2. 打开长这样

一个浮窗就是整个商场：顶部搜索和筛选，中间编辑精选和为你推荐，下面是插件卡片列表。所有操作都在这个浮窗里完成，不用跳来跳去。

![DSH 商场主界面](assets/screenshot-main-zh.png)

### 3. 先试智能搜索

搜索框旁边有个「✦ 智能搜索」。输入一句人话——"帮我找个能删除会话的插件"——它先用你的模型把需求翻译成检索词，再从全目录里挑出推荐和备选，弹出一个结果浮窗：推荐排前面，卡片和主商场完全一样，安装、详情、收藏都能直接用。

![智能搜索结果浮窗](assets/shot-results-zh.png)

普通搜索、分类筛选、排序、每页数量，也都在工具栏上，随手就能用。

### 4. 安装前让 AI 审一遍

点「安装」时选「智能安装」：AI 把你的模型当审查员，仓库代码作为不可信数据喂进去（不执行），给「装 / 谨慎 / 别装」三档结论。判「别装」就直接停。AI 抽风或超时，自动退回普通安装，不耽误事。

![安装确认弹窗](assets/shot-install-zh.png)

### 5. 看分数再决定

每张卡右上角一张五边形雷达图，中间是综合分。综合分是加权几何平均——哪一维接近 0 都会把总分拽下去，所以 0 星新仓库分数低是诚实表现，攒了 star 自然涨。鼠标悬停雷达图：发光放大，跟着鼠标弹出一张卡，把每个分数怎么算的用人话讲清楚。详情页里有完整的评分卡和"为什么推荐"。

![详情页评分卡](assets/shot-detail-zh.png)

### 6. 不知道装什么？看这两栏

首页中段：左「编辑精选」每周一更新，是人工策展里综合分最高的几位；右「为你推荐」看你 30 天装了啥、答过啥问卷，推荐理由写在卡上。还没想法？点问卷，30 秒出结果。

![编辑精选与为你推荐](assets/shot-picks-zh.png)

### 7. 任务在哪发起，都能看到

装、更、卸都有进度，任务面板里能看能取消，而且面板是全局的——从主商场发起的、从搜索结果浮窗发起的，两边都能看到。需要重启才生效的改动，卡片上会亮提示并解释为什么。

![任务面板](assets/shot-tasks-zh.png)

### 8. 在会话里直接找插件

插件自带一个 skill，叫 `dsh-mall`。在 Agent 会话里执行 `/dsh-mall 找个能删除会话的插件`，它就替你把全目录翻一遍，给出推荐和备选。结果最后一行有个「打开 DSH 商场查看插件详情」按钮，点一下直接进商场看卡片。

![skill 结果里的按钮](assets/shot-skill-zh.png)

### 9. 设置就一个入口

设置浮窗里有「DSH 商场-设置」：打开商场入口、自动一键更新开关（每天 03:30 检查）、风险提示和当前版本，一眼看完。

![商场设置](assets/shot-settings-zh.png)

## 许可证

[MIT](LICENSE) © hoyyang。数据来自 GitHub 与 [awesome-dsh-plugin](https://awesome-dsh-plugin.com)（MIT），各自条款为准。
