# Repair Round 2 — adversarial full-lock 评审（lock-repair-2）

评审角色：adversarial。日期：2026-09-09。输入锁：lock-repair-2（repair-round-2.md 记录）。
方法：哈希核对 → 机械重放 → 34 例合成探针（/tmp/repair2-adv/probe{,2,3,4}.mjs，三批）攻击五项修复 + 正例对照。评分器零改动经哈希独立确认。

## 1. 哈希核对 — 全部匹配 ✅

- parser 24138f149ea4… / tests 99b6c7b5a13a… / scorer-src 141550aefdb7… / runtime 77a1a9f910b5… — 与 repair-round-2.md 记录一致。
- 其余 11 个传播文件（ownership 188559c0 / aggregator ff6fe614 / oracle-validator 341696d7 / review-batch cba91fda / evaluator-test 752abb1c / evaluator f6fe1b78 / metrics 8a74562d / consecutive be1c2a99 / arbitration efdbab28 / perturbations d5a6f8a8 / rubric 2d124059）与 lock-repair-1 记录逐一致，无未申报变更。

## 2. 机械重放 ✅

- 解析器：**155/155 pass**（fail 0）。
- mall practical：**23/23 pass**；扰动重放 **pass:true**（5 项围栏全 true）。

## 3. 探针攻击结果

### 修复 ① fallbackPlannedContent — 部分生效，两处绕过（I-1/I-2），主路径误杀未消除（I-4）

| 探针 | 结果 |
|---|---|
| will+verb / coming soon / TODO: / 计划： / 即将新增 / Roadmap for Q3 | 零贡献 ✅ |
| **"We are planning to add SSO support next quarter."** | **capability_items 0→1，得分**（I-2） |
| **"待办：批量导出失败重试。" / "计划：新增失败重试与告警日志。"（置于 Capability 标题下）** | **reliability_items 0→1，得分**（I-1） |
| 正例 "Planned report scheduler that queues weekly exports." | 零贡献 ❌ **与修复声明矛盾**（I-4，见下） |

- **I-1（Important）**：`migratedReliabilityLines` 由全局 `semanticFactLines`（原始 list/table/paragraph 行）派生，**无 fallbackPlannedContent 门**（仅 sectionItems/hardOutput/Why 路径有，:1325/:1472/:1516）。命中 CJK 可靠性词族的未来交付 bullet 经此路径得分。英文 "TODO: add retry logic and alert logs for failed exports." 未命中 reliability 词族故未复现——泄漏面为 CJK 词族 × 全局迁移路径。
- **I-2（Important）**：词表覆盖 "planned to/proposed to/planned for" 但不含 "planning to / plans to"；"We are planning to add SSO support next quarter." 亦不命中 PLANNED_MEDIA_RE（planning≠planned），capability 得分。属修复 ① 自定义「未来交付承诺」语义的直接反例。
- **I-4（Important）**：repair-round-2.md 声称「『Planned report scheduler』等真实特性名不再误杀」，但 A/B 重放：同一 bullet 去/留 "Planned" 前缀 → 无前缀者 capability_items 1、有前缀者 0。原因：semanticContentEligible 仍含 `PLANNED_MEDIA_RE`（:324，正则含裸 planned|proposed|future|roadmap，:421），主路径继续误杀；本次重设计仅在 fallback/Why 等不经 PLANNED_MEDIA_RE 的路径生效。**修复声明与重放事实不符**（"Future-proof config format…" 同样被杀）。

### 修复 ② 主观赞美 bullet 三族零贡献 — 生效，无误杀 ✅

- "Smooth and elegant…"（Reliability）/ "Beautiful, modern…"（Use cases）/ "Clean output…amazing…"（Output）全部零贡献。
- 正例保留：功能性 bullet（"Verifies every signature…"）与赞美+事实（"Exports clean PDF reports…"）均正常计分。
- M-3（Minor）：Capability 标题下纯赞美 bullet 仍计分——系修复 ② 申报的三族范围所致（既有行为非本轮引入），freeze 裁定时应知悉该残留面。

### 修复 ③ 身份 bullet 尾缀数字归一 — 生效 ✅

- "Built for professionals 7" / "…12.5" / "面向专业人士 3。" 全部零贡献；任务限定正例（"Built for professionals who manage thousands of certificates."）正常计分。

### 修复 ④ CJK 解决方案后缀 — 生效但结构不可达面大（I-3/M-1/M-2）

- 解决方案/平台/工具 后缀变体零贡献；任务线索正例（批量处理日志 / 离线部署报告）正常计分 ✅。
- **I-3（Important）**：**"适合金融投资人士。" "面向广告营销人士。" 纯身份 bullet 得分（usecase_items 0→1）**。机制：`concreteCjkPersona` 尾缀门只检查正则捕获的限定词（match[1]）；人士/专业人士 作为被名词表消费的组尾时永不出现在限定词中，非通用行业限定词（金融投资/广告营销）不触发任何零分门 → return true。修复 ⑤ 的钉死意图（人士身份→零分）在该常见措辞族上**未达成**（钉死测试 153 本身通过，因测试措辞限定词为空/可命中门）。
- M-1（Minor）：尾缀门可被复合词内嵌任务线索词规避——"定位为企业级管理系统。"（管理 线索在产品类别词内）得分。
- M-2（Minor）：尾缀位置敏感——"面向运维人士，简化日常巡检之外的额外事务。"（尾部落非表内名词 事务）得分。

### 修复 ⑤ 人士入身份名词表 — 钉死面通过，泛化面未闭合（见 I-3）

### 正例回归（无误杀）

- 格式等价（中英场景 bullet 计 2 条）、Roadmap 标题整节排除、"Run the audit once per release." 正常计分 ✅。

## 4. 结论

**CRITICAL=0，IMPORTANT=4，MINOR=3。**

哈希全一致、155/155、23/23、扰动 pass:true、评分器（src+lib）冻结哈希未动。五项修复中 ②③ 达成且无误杀；①④⑤ 存在可重放绕过（I-1/I-2/I-3）及与修复文档声明不符的主路径误杀残留（I-4）。根因集中于两点：(a) 全局迁移路径（migratedReliabilityLines/migratedUsecaseLines 源自 semanticFactLines）未纳入本轮排除门；(b) concreteCjkPersona 尾缀门作用域为正则限定词而非全尾缀。属窄修可收敛范围，建议：semanticFactLines 派生路径补 fallbackPlannedContent + personaIdentityContent 门；词表补 planning to/plans to；concreteCjkPersona 改为对名词后全尾缀判定；PLANNED_MEDIA_RE 与修复 ① 的裸 planned 语义冲突需裁定（收窄为媒体上下文限定）。

## 5. 未覆盖攻击面（如实申报）

- 探针仅覆盖五项修复的 bullet 层；表格行、fenced code 能力段、preface/preamble、fallback 0.5 权重节、QA/admonition 通道未构探针。
- "will be available/即将推出" 等更多 will 变体、subjective 词表 35 词全集、personaShortProse（<24 字符短句）路径未逐一枚举。
- 评分器仅以哈希冻结性验证，未做行为级差分重放。
- 探针结论基于 evidence 计数器（usecase_items/reliability_items 等）与源码路径静态确认，未逐条断言内部命中正则。
