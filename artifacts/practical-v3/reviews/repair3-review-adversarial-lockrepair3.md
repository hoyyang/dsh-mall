# Repair Round 3 — Adversarial Lock Review (lock-repair-3)

- 评审员：adversarial（full-lock 正式验收门，第三轮）
- 日期：2026-09-09
- 锁：parser de69cecc80630365 / tests f79a0504355f843e / score.ts 141550ae / lib/score.js 77a1a9f9
- 输入：repair-round-3.md（已读）；blind/round-05、round-07、.round-*-review-batches 正文未读（硬边界遵守）
- 探针：仅写入 /tmp/repair3-adv/（5 个合成 README），经 practicalEvidence() 直跑解析器

## 结论

VERDICT: ACCEPT-WITH-FINDINGS — CRITICAL=0 IMPORTANT=1 MINOR=1
五项修复全部精确否决上轮向量且未见新洞；机械门全绿；评分器零改动（哈希与 lock 一致）。I-1 为本轮 fix ③ 编辑引入的括号错位（方向保守、不膨胀分数），不阻断 freeze，但应在 Round 7 前修复。

## 1. 哈希核对（全部匹配）

| 文件 | SHA-256 头 | 判定 |
|---|---|---|
| dsh-market-index/scripts/readme-signals.mjs | de69cecc8063… | ✓ 与参考一致 |
| dsh-market-index/scripts/readme-signals.test.mjs | f79a0504355f… | ✓ 与参考一致 |
| dsh-mall/src/score.ts | 141550aefdb7… | ✓ 与 repair-round-3.md lock 一致（零改动） |
| dsh-mall/lib/score.js | 77a1a9f910b5… | ✓ 同上 |
| mall 侧 9 个 practical-v3 脚本 + oracle rubric | 已取证指纹 | 均与上轮 lock 面一致，无异常 |

## 2. 机械门

- parser：**tests 160 / pass 160 / fail 0**（142 既有 + 13 轮1/2 钉死 + 5 轮3 钉死）
- mall practical：**tests 23 / pass 23 / fail 0**
- 扰动重放 validate-practical-v3-perturbations：**pass:true**（6/6 项）

## 3. 五项修复逐项验证（代码 + 探针）

1. **planned 词族改用 fallbackPlannedContent（fix ①）**：semanticContentEligible:327 已挂 fallbackPlannedContent 门。探针 probe4：Planned report scheduler that generates weekly PDF summaries / Future-proof config format validated on load / Proposed schema validator… / Planned grep viewer… 四条裸 planned 特性名全部计入（capability 3 + reliability 1，零误杀）✓
2. **fallbackPlannedContent 补 planning to / plans to（fix ②）**：readme-signals.mjs:337 词族含 planned to|planning to|plans to|proposed to|planned for。probe1：We are planning to add SSO / plans to ship CSV / Planned for Q3: multi-tenant 全部零贡献，仅真实能力句计入 ✓
3. **migrated 三路径 + preambleBullets 补门（fix ③）**：migratedReliabilityLines:1402、migratedOutputLines:1417、migratedUsecaseLines:1433、preambleBullets:1549 均有 !fallbackPlannedContent 门。probe2（无标题前言 roadmap bullet：TODO: / planning to / Planned: / Planned to）四条全零，仅正例 bullet 计入 ✓（但见 I-1）
4. **concreteCjkPersona 领域限定纯身份零分（fix ④）**：readme-signals.mjs:170-182——qualifier 空/白名单 → false；偏好词族需 cue；整行需 CJK_CONCRETE_TASK_CUE_RE。probe3：适合金融投资人士 / 面向广告营销人士 / 适用于法律行业从业者 / 定位为医疗行业用户 四条全零；正例「适合键盘流与极客用户，在终端中快速连接并展开分析」计入 usecase ✓（tail 回退已移除，正例未被破坏）
5. **CJK_CONCRETE_TASK_CUE_RE 扩展（fix ⑤）**：cue 词含 维护|搜索|展示|整理|筛选:168。probe5：维护多个项目 / 筛选日志 / 展示实时数据 / 整理重复文件 / 搜索本地文档库 五条全部计入 ✓

## 4. 审计发现

### I-1（Important）RELIABILITY_PROSE_FACT_RE 子句悬置于 filter 之外，成为死代码

readme-signals.mjs:1401-1408：

```
const migratedReliabilityLines = semanticFactLines.filter((line) =>
  !fallbackPlannedContent(line)
  && !personaUsecaseFact(line)
  && (RELIABILITY_FACT_RE.test(line)
  || RELIABILITY_CLAIM_RE.test(line)
  || RELIABILITY_VERIFICATION_BOUNDARY_RE.test(line)
  || (RELIABILITY_DOMAIN_RE.test(line) && RELIABILITY_CONSEQUENCE_RE.test(line))))
  || RELIABILITY_PROSE_FACT_RE.test(line)
```

filter 调用在 1407 行末已闭合（)))) 恰好闭合 4 层括号），1408 的 || RELIABILITY_PROSE_FACT_RE.test(line) 位于顶层——「数组 || 布尔」恒短路为数组（已用 node 实证 typeof=object），整条子句为死代码；RELIABILITY_PROSE_FACT_RE（定义于 :122）全文件仅此一处引用，即散文式 reliability 证据路径被静默禁用。成因与 fix ③ 在该 filter 头部插入 !fallbackPlannedContent 门的编辑高度吻合（原意图应为该子句在回调内参与析取）。方向保守（漏计不虚计），不构成刷分洞，故不阻断验收；但它改变了 migratedReliability 路径的既定行为且无测试钉住。**建议**：改为 && (… || RELIABILITY_PROSE_FACT_RE.test(line)) 或在回调内并入析取，并补一条散文 reliability 钉死测试。

### M-1（Minor）CJK 领域身份 + 任一 cue 词即计分的口径偏宽

concreteCjkPersona:180 对整行 value 查 cue：「适合金融投资人士，需要实时数据」这类「领域身份 + 泛 cue 词」会计 usecase。cue 词族本身具操作语义，当前口径可辩护（有线索即计），仅记录为后续收紧候选，不要求本轮处理。

## 5. 边界遵守声明

- 未读 blind/round-05、round-07、.round-*-review-batches 正文；未执行 git/publish/网络；除本报告外零文件改动；探针仅存于 /tmp/repair3-adv/。
- 前两轮已修复向量（will+动词、coming soon、裸 ^planned: 前缀、roadmap 标题、TODO 前缀等）未重复攻击，聚焦本轮五项修复的新旧边缘。

## 6. 判定

CRITICAL=0，IMPORTANT=1（I-1，保守方向、附修复建议），MINOR=1（M-1）。五项修复 + 勘误 + 双机械门 + 哈希锁全部通过 → **建议放行至 freeze 决定**；I-1 建议在 Round 7 A/B 前以最小 diff 修复并补钉死测试。
