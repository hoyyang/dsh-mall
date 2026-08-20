# DSH Store · DSH 商店

The complete GitHub #dsh-plugin catalog inside DeepSeek Harness: browse
every repo tagged dsh-plugin, search, sort, filter (plugin / non-plugin /
awesome-curated), one-click install & uninstall, and publish your own plugin
by adding the topic.

装在 DeepSeek Harness 里的 GitHub 全量插件目录：浏览所有带 #dsh-plugin
标签的仓库，搜索、排序、筛选（是否插件 / awesome 精选），一键安装卸载，
并可一键为自己的仓库打上标签上架。

## Install

    dsh plugin --profile web add github:YOUR/dsh-store
    # or from a local checkout:
    dsh plugin --profile web add /path/to/dsh-store

Restart dsh web, then open Settings → DSH Store.

需要 dsh web ≥ 0.1.0-rc.6（缺组件时市场会自我禁用并在控制台说明原因）。

## Features

- Full catalog: every public GitHub repo with the dsh-plugin topic (7k+ and
  growing), fetched in date shards with a 30-min host cache and a bundled
  snapshot fallback.
- Rich cards: name, description, stars, category badge, publish age, last
  update, and today's star delta (computed from a local daily baseline —
  the field shows — until the baseline exists).
- Classification: awesome-dsh-plugin curated map first, then
  name/description/topic rules, then other. A three-tier isPlugin verdict
  (heuristic → package.json check → unknown badge).
- Filters: category × kind (all / plugins / non-plugins) × awesome-only,
  plus recency window; everything combines with realtime search and 4 sort
  modes (stars ↑↓, today's +stars ↑↓).
- Install / uninstall with risk-graded confirmation (curated green,
  community yellow, likely-not-a-plugin red), progress via status polling,
  installed badge matching profile deps.
- Publish your plugin: add the dsh-plugin topic to your own repo with one
  click (GitHub token, repo scope) — or copy the gh command / do it manually.
- GitHub token (Settings → Plugins → plugin configuration, or the
  DSHM_GITHUB_TOKEN env var): raises search limits 10→30/min and core
  60→5000/h and enables the verification batch. Memory only.

## Security

- Install/uninstall/token/publish routes accept same-origin POSTs only.
- The GitHub token never touches disk, logs, or responses.
- Build scripts stay blocked (pnpm ≥10 default).

## Data

- Primary: your own static index (GitHub Actions, star-segment binary
  split past the 1000/query cap, rebuilt every 2h, daily full refresh) via
  jsDelivr CDN — zero API quota on the user side. ~7.1k repos.
  See https://github.com/hoyyang/dsh-market-index (pipeline based on
  https://github.com/bradeGithub/DSH-Plugins-Marketplace, MIT)
- Fallback: bundled snapshot (data/registry-snapshot.json, 7.1k repos,
  rebuild with npm run snapshot); optional direct Search API union with a
  token. Anonymous qualifier queries (created:/stars:) return 0 on shared
  egress IPs and HTML topic pages cap at 50 pages, so the CDN channel is
  the primary source by design.
- Today's star delta needs a daily baseline: recorded locally on the first
  successful fetch of each day.
- Bundled snapshots: data/registry-snapshot.json, data/awesome-known.json
  (rebuild with npm run snapshot).

## License

MIT

## Versioning

A.B.C — major (A, max two digits) bumps on breaking/major changes; minor (B) adds features; patch (C) fixes bugs. Release: npm version <patch|minor|major>, update CHANGELOG, npm run build && npm pack.
