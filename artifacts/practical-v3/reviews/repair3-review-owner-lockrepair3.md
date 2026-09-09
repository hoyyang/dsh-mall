# Repair Round 3 — full-lock 评审（owner / lock-repair-3）

日期：2026-09-09。评审员：独立 full-lock owner 评审（正式验收门）。输入：repair-round-2.md + 修复轮 3 五项清单（repair-round-3.md 未落盘，按任务清单执行）。

## 结论

**VERDICT：0 Critical / 0 Important / 2 Minor → lock-repair-3 通过，可进入 freeze 决定。**

## 第 1 步：哈希核对 — PASS

- dsh-market-index：readme-signals.mjs `de69cecc…`、readme-signals.test.mjs `f79a0504…` — 与参考锁逐一一致。
- dsh-mall 13 文件（score.ts 141550ae / lib/score.js 77a1a9f9 / ownership 188559c0 / aggregator ff6fe614 / oracle-validator 341696d7 / review-batch cba91fda / evaluator-test 752abb1c / evaluator f6fe1b78 / metrics 8a74562d / consecutive be1c2a99 / arbitration efdbab28 / perturbations d5a6f8a8 / rubric 2d124059）— 与 repair2-review-owner-lockrepair2.md 记录的 repair-round-1 锁全部一致。
- 本轮变更仅限 parser + tests 两文件；**评分器零改动成立，11 个传播文件零改动成立**。

## 第 3 步：机械重放 — PASS

- dsh-market-index：node --test → **160/160**（tests 160 / pass 160 / fail 0）= 155 既有 + 5 个 repair3 钉死。
- dsh-mall：npm run test:practical → **23/23**（fail 0）；validate-practical-v3-perturbations → 各分项与汇总 **pass:true**。

## 第 4 步：五项修复逐项核对（语义正确性 + 传播完整性）

| # | 修复 | 核对结果 |
|---|---|---|
| ① | semanticContentEligible 改用 fallbackPlannedContent | ✅ readme-signals.mjs:327：`&& !fallbackPlannedContent(line)`；PLANNED_MEDIA_RE 裸子串已从内容资格主路径移除，仅保留两处**有意限定作用域**：:1138 媒体 alt/src 徽章过滤、:1579 planned-media **节标题**过滤（roadmap/截图节整体排除为既有设计）。正向钉死测试（Planned report scheduler / Future-proof config 恢复计分）验证误杀解除。 |
| ② | fallbackPlannedContent 补 planning to / plans to | ✅ :337 词族含 `planning to|plans to`；钉死测试 repair3 planning-to SSO → capability 0。 |
| ③ | migrated 三路径 + preambleBullets 补门 | ✅ migratedReliabilityLines :1402、migratedOutputLines :1417、migratedUsecaseLines :1433 均加 `!fallbackPlannedContent(line)`；preambleBullets :1549 加门，preambleParagraphs :1556 经 semanticContentEligible 间接覆盖（无遗漏路径）；钉死测试 repair3 preamble roadmap bullets → capability 仅 1。 |
| ④ | concreteCjkPersona 领域限定纯身份零分 | ✅ :170-182：非通用限定词 + 整行无 CJK_CONCRETE_TASK_CUE_RE → return false → personaIdentityContent 排除 → 零贡献；注释标注修复轮 3 出处；钉死测试 金融投资/广告营销人士 → usecase 0。 |
| ⑤ | CJK_CONCRETE_TASK_CUE_RE 扩展 | ✅ :168 尾部补 `维护|搜索|展示|整理|筛选`；既有 155 测试零回归。 |

钉死回归块（test.mjs:2781-2810）共 6 测试：5 个 repair3 向量钉死 + parser revision 3 断言（revision 断言为轮 2 已有，计数 155+5=160 自洽）。五项修复均精确否决上轮向量（TODO/planning-to/preamble/CJK 领域身份/裸 planned 误杀），未发现新引入的洞。

## Minor 发现（不阻塞）

- **M-1**：fallbackPlannedContent 的 `\bwill\s+(?:be\s+)?[a-z]+/`（:336）为轮 2 既定设计，对现在时 "will" 措辞（如 "Searching will show matching sessions"）有残余过杀面；影响有界（仅命中 will+动词行），本轮未引入，不作为阻塞项，建议 freeze 后纳入观察清单。
- **M-2**：:1579 节标题 PLANNED_MEDIA_RE 裸子串过滤为节级排除（含 "planned/future" 的标题整节不计），属 roadmap/截图节排除的既有设计；真实特性节撞名的概率低，保持现状即可。

## 流程建议

进入 freeze 决定 → Round 7 A/B → GUI/文档/STATE。落盘 repair-round-3.md 时应记录本轮锁：parser de69cecc8063… / tests f79a0504355f…（其余 13 文件同 lock-repair-2）。
