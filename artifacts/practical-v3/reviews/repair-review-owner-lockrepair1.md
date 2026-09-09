# Repair Review — owner 视角（lock-repair-1，2026-09-09）

评审员：独立 full-lock owner 评审（repair 轮正式验收门）。
评审对象 = 修复轮当前字节；禁读 blind/round-05、round-07、.round-*-review-batches 正文（未读）。

## VERDICT: CRITICAL=0 IMPORTANT=2 MINOR=1

## 1. 哈希表（SHA-256，评审时实测）

| 文件 | SHA-256 |
|---|---|
| dsh-market-index/scripts/readme-signals.mjs | ea59758aaa6138d6b8343f7613ba3ecd801e9eb88b0ae8d1651cb5b31ce60d3d |
| dsh-market-index/scripts/readme-signals.test.mjs | 7eecb1752840e8f924296c8ae1844fdebb2a128a67e384860baab5dcdbf1ad87 |
| dsh-mall/src/score.ts | 141550aefdb7d620cfc0113ed979cf0f2872c40df9706b8173da691a5f8499f5 |
| dsh-mall/lib/score.js | 77a1a9f910b5c1adaf4e93e88ba4cea0a4201770b4086c372ed0f63ea76154bf |
| dsh-mall/scripts/practical-v3-semantic-ownership.mjs | 188559c0d971ec647b7940ae7bce4fb9060d635e05d4c4efe06b0d57f31037ee |
| dsh-mall/scripts/aggregate-practical-v3-oracle.mjs | ff6fe61467db92b10b55223a925c26a5e2677ca0993af958f79e3872884fed9f |
| dsh-mall/scripts/validate-practical-v3-oracle.mjs | 341696d7ef619293ecc23da5990927f740f34a98f493d3568203ef4ed678f106 |
| dsh-mall/scripts/validate-practical-v3-review-batch.mjs | cba91fda95efd341d43c6b22ae34d23cc7ae9d10e0b16af8fcc203c0d45d66a8 |
| dsh-mall/scripts/practical-v3-evaluator.test.mjs | 752abb1c17c473be2b858adceef8c887ba594ec43c95b7478114423f9402323b |
| dsh-mall/scripts/evaluate-practical-v3-round.mjs | f6fe1b78437694a24ab1de94480e8172dd55dedd4c3e61650f8ba19416933fd8 |
| dsh-mall/scripts/practical-v3-metrics.mjs | 8a74562d942d45cb28f8702a657221eaf48686593b48a864bd08d3e864b4e3a6 |
| dsh-mall/scripts/validate-practical-v3-consecutive.mjs | be1c2a994a9ffb4b8791ecbf28eb5680706bbf14e3e13ff7e6d626254b2046be |
| dsh-mall/scripts/build-practical-v3-arbitration-batches.mjs | efdbab285a1a78d0f842d10b1956802942fb340a6b18d17453d3636292209e7c |
| dsh-mall/scripts/validate-practical-v3-perturbations.mjs | d5a6f8a82a9c79cb62407e97b4dfc4fa3f488f62eca084376d0e4f6ee21f23a5 |
| dsh-mall/artifacts/practical-v3/practical-v3-evidence-oracle-rubric.md | 2d1240592b77ae1de9f3208167583fb7a30db329197bd902e26a4343e71e3f99 |

全部 15 项与 repair-round-1.md「新锁 lock-repair-1 哈希」记录一致，无漂移。

## 2. 机械检查（实测）

- 解析器测试：**150 tests / 150 pass / 0 fail**（node --test scripts/readme-signals.test.mjs）
- mall practical 套件：**23 tests / 23 pass / 0 fail**（npm run test:practical）
- 500 项目扰动重放：**pass: true**（validate-practical-v3-perturbations.mjs，exit 0）
- 三项与 repair-round-1.md 声明一致。

## 3. 逐修复判定

| # | 修复 | 判定 | 依据 |
|---|---|---|---|
| ① | roadmap 主路径排除（owner F-2） | **正确**，有残口（I-1） | readme-signals.mjs:1311-1313 sectionItems 主路径补 `!fallbackPlannedContent(line)`，全家族生效；hardOutput 结构化行同补（:1456）。钉死回归 :2706-2710（Will add/Will ship → capability_items=1，仅真实能力计入）。探针复现：roadmap 未来式 bullet 零贡献。但 TODO 前缀 bullet 漏网（见 I-1） |
| ② | 三族标题散文实质门（adversarial F-2） | **正确**，有弱缝（I-2） | :1337-1349 reliability/usecase/output 散段过 substantiveStatement；:1419-1451 门为全解析器具体语义信号并集；:1456/:1460/:1463 output 段落同门。钉死回归 :2712-2716 / :2718-2724 / :2726-2730（中性填充三族均 0，真实场景保留 ≥1）。弱缝：门内 includes/contains 备选项（:1445）放过弱填充散文（见 I-2） |
| ③ | Why/Motivation 半分路径身份门（adversarial-fresh2 F1） | **正确** | :1493-1503 四重门（FALLBACK_MARKETING_PROSE_RE + personaIdentityContent + semanticMetaContent + fallbackPlannedContent）+ substantiveStatement；钉死回归 :2732-2736（纯身份 bullet → usecase_items=0）。探针：真实问题陈述 bullet 半分 0.5 保留（不过度误杀） |
| ④ | CJK persona 标点/偏好（adversarial-fresh2 F2 / adversarial F-3） | **正确** | concreteCjkPersona :170-179：qualifier 标点归一（:173）、通用限定词白名单（:175）、偏好型无任务线索零分（:176）、纯身份后缀无任务线索零分（:177）；任务线索正则 :168 保留正例。钉死回归 :2738-2743（「适合：专业人士」「适合喜欢快速的工具的用户」→0；「适合需要批量重命名一万份文件的用户」→≥1）。探针附加变体「适合专业人士使用」→0 |
| ⑤ | 裸 channel/版本号表格行（owner-fresh2 F1） | **正确** | releaseChannelLabelRowOnly :223-228（全标签行或全版本号行）在 semanticMetaContent :234 首位短路，经 semanticContentEligible 传播到全部证据路径。钉死回归 :2745-2748。探针：Channel|Notes 表 + 真实能力行仍计 1（不过度误杀） |
| ⑥ | parserRevision 2→3 传播 | **完整** | README_PRACTICAL_PARSER_REVISION=3（readme-signals.mjs:439）；score.ts:79 / lib/score.js:47 =3，指纹 [version, parserRevision, scorerRevision]=3:3:4:（score.ts:87-109 与 lib/score.js:53-75 逐项一致）；types.ts:34、market-data.ts:102、snapshot.mjs:19、evaluate-practical-v3-round.mjs:30-31/106、validate-practical-v3-oracle.mjs:57、perturbations:18-19、aggregator:117、全部测试 fixture 均 3。grep 无残留 revision-2 消费点；snapshot.test.mjs 显式断言 parserRevision:2 条目不计入。旧证据 fail-closed：practical-score.test.mjs:51（parserRevision=1 → scorePractical=null） |

## 4. 评分器零改动验证

- score.ts / lib/score.js 双侧：caps（capability 12/25、usage 10·10·8·4·5 min25、usecase 10/20、output 8/6+media 6/9 min15、reliability 10/15）、PRACTICAL_CURVE_EXPONENT=0.9、confidence 仅描述不改分、scorePractical 无 star/身份/长度输入、缺证据/版本不符 → null。src 与 lib 对应逻辑逐行等价（:125-146 vs :82-103）。
- 附带修复核实：migratedReliabilityLines :1380-1386 语法损伤已修（括号归位 + 模块级 measuredOutputFact :1387-1393）；RELIABILITY_PROSE_FACT_RE/:122 与 USECASE_TASK_CONTEXT_RE/:263 为合法新增且仅在声明路径消费。失败安全：semanticClaimKey 空键/短键零贡献（:1372-1373），globalSeen 全局去重。

## 5. 发现清单

### Important
- **I-1 TODO 前缀 roadmap bullet 在 Features 主路径计 capability**（readme-signals.mjs:323-326）。探针实测：`- TODO: oauth integration` → capability_items=1。fallbackPlannedContent 不含 TODO 词形，而同文件 CAPABILITY_MIGRATION_GUARD_RE:434 已把 todo 与 roadmap 并列判为计划语言（该守卫仅覆盖 documentationCapabilityEscape/migrated/preamble 路径，不覆盖主路径）——同一语义两条路径判定不一致，违背 rubric 全局规则 6「roadmap 零贡献」。未测：多条不同 TODO bullet 是否可刷至族上限（12/+25）。
- **I-2 弱动词填充散文可过 substantiveStatement 散文门**（readme-signals.mjs:1445 includes/contains 备选）。探针实测：10 段近重复填充「Paragraph number N includes background context for readers number N」→ reliability_items=1（去重后 +1 单元 ≈ +2 分）；同构填充在 Use cases 下 → usecase_items=1。修复目标是灌水散文零贡献，而单含一个弱动词即可复活计数；攻击者用不同措辞模板理论上可刷向族上限（未实测，本轮去重恰好合并了同模板键）。

### Minor
- 无新增 Minor。原四评审 Minor（0.5 小数舍入口径、media 弱归一化）修复轮声明不处理，本轮未复核，不阻塞。

## 6. 未覆盖清单（如实）
- I-1/I-2 的规模化刷分（不同措辞模板 → 族上限）未实测，仅方向性探针。
- 确定性双跑未独立执行（每探针单次运行；修复报告声称双跑一致未复核）。
- src/score.ts 与 lib/score.js 为逻辑级比对，非全文件字节差分。
- 扰动重放仅取最终 pass:true，未逐项检查 per-metric 明细。
- blind/round-05、round-07、review-batch 正文按硬边界未读。
- CJK persona 标点变体空间（④）仅测 3 例，非穷举。

## 7. 结论
六处修复全部精确否决四评审原灌水向量（钉死回归 + 独立探针双证），正例与格式等价保留（探针 P1 bullet/段落/表格同语义同分、P2 Why 半分、P3/P4 真实能力计入），评分器零改动，传播完整，机械门全绿。存在两处 Important 残口（I-1 TODO 路径不一致、I-2 弱动词散文缝），均为修复面相邻的新残向量而非原向量复活；按协议 0C/0I 冻结门未完全满足，建议：要么补最窄修（fallbackPlannedContent 纳入 TODO 词形 / 重审 :1445 备选项）后再走双 fresh 评审，要么由用户裁定是否降级为已知限制。
