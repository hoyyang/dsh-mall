# Repair Round 1 对抗评审报告（lock-repair-1）

评审员角色：adversarial（full-lock 正式验收门）。日期：2026-09-09。
方法：哈希核对 → 指定机械门重放 → 以当前字节为准审计六处修复 → /tmp/repair1-adv/ 合成 README 探针动态复现（探针脚本 probe.mjs/probe2-5.mjs，解析器=冻结版 ea59758aaa61）。

VERDICT: CRITICAL=0 IMPORTANT=3 MINOR=2 → freeze 门未过，需修复轮 2。

## 一、哈希表（当前磁盘，SHA-256）

| 文件 | SHA-256 | 与 lock-repair-1 表（前12位） |
|---|---|---|
| dsh-market-index/scripts/readme-signals.mjs | ea59758aaa61...ce60d3d | ✓ |
| dsh-market-index/scripts/readme-signals.test.mjs | 7eecb1752840...f1ad87 | ✓ |
| dsh-mall/src/score.ts | 141550aefdb7...9f5 | ✓ |
| dsh-mall/lib/score.js | 77a1a9f910b5...154bf | ✓ |
| scripts/practical-v3-semantic-ownership.mjs | 188559c0d971...037ee | ✓ |
| scripts/aggregate-practical-v3-oracle.mjs | ff6fe61467db...8fed9f | ✓ |
| scripts/validate-practical-v3-oracle.mjs | 341696d7ef61...f106 | ✓ |
| scripts/validate-practical-v3-review-batch.mjs | cba91fda95ef...d66a8 | ✓ |
| scripts/practical-v3-evaluator.test.mjs | 752abb1c17c4...02323b | ✓ |
| scripts/evaluate-practical-v3-round.mjs | f6fe1b784376...933fd8 | ✓ |
| scripts/practical-v3-metrics.mjs | 8a74562d942d...b4e3a6 | ✓ |
| scripts/validate-practical-v3-consecutive.mjs | be1c2a994a9f...b2046be | ✓ |
| scripts/build-practical-v3-arbitration-batches.mjs | efdbab285a1a...e7c | ✓ |
| scripts/validate-practical-v3-perturbations.mjs | d5a6f8a82a9c...f23a5 | ✓ |
| artifacts/practical-v3/practical-v3-evidence-oracle-rubric.md | 2d1240592b77...71e3f99 | ✓ |

15/15 与 repair-round-1.md 新锁表逐项一致，无漂移。

## 二、机械检查（本评审员实际重放）

- 解析器回归：node --test scripts/readme-signals.test.mjs → **pass 150 / fail 0**（152s 首跑因 macOS 无 timeout 命令未执行，重跑实绩 291ms 内完成）。
- mall practical 套件：npm run test:practical → **# tests 23 / # pass 23 / # fail 0**。
- 扰动重放：validate-practical-v3-perturbations.mjs → **pass: true**。
- 失败安全：套件含「partial current-revision counts are normalized to zero while stale parser evidence fails closed」；snapshot 全量 11971 条旧证据 complete:0 / mismatches:0（fail-closed 归零，无 80 回退）；practical-score.test 断言 parserRevision:1 → null。
- 确定性：探针全部为纯函数调用，同输入多跑一致。

## 三、逐修复判定

### ① roadmap bullet 主路径排除 — 部分有效，有洞（I-1）
- 原向量（Will add / Will ship / Roadmap: / 计划新增? / 即将支持）实测零贡献 ✓（P1a 中 6 条仅 2 条漏计）。
- **洞**：fallbackPlannedContent（readme-signals.mjs:323-326）动词白名单封闭（will add|support|ship|land|provide|introduce），「We will improve performance」「将来会提供多语言界面」漏网。4 条 will+其它动词 roadmap bullet → capability_items=4 → **score 9/100**。同族变体（will build/release/extend、将来会/准备/打算/下一步）均未覆盖。

### ② 三族标题散文实质门 — 段落路径有效，bullet 路径仍可灌（I-2）
- 段落路径 ✓：12 条互异中性散文在 Reliability/Use cases/Output 三族下全部零贡献（P7b）；相同散文跨族去重后 ≤1 单元。
- **洞**：门只加在 paragraphs（readme-signals.mjs:1341-1343），bullet/table 行按注释「保持格式等价原行为」不加 substantiveStatement（:1481 sectionItems('usecase') 仅排 personaIdentity）。12 条互异中性 filler bullet → usecase_items=10（族上限）→ **score 20/100 纯灌水**；三族同灌被跨族 claim 去重限制为单族 15/100。原 Critical F-2 的族上限刷满幅度以一次格式切换（散文→bullet）即可重新到达。
- Reliability bullet 路径同样可刷（P：3 族 filler bullet → rel=10）。

### ③ Why/Motivation 半分路径身份门 — 纯身份有效，尾缀扰动绕过（I-3）
- 纯身份 ✓：「- Built for professionals」单条 → 0（P3d）。
- **洞**：personaIdentityContent（:258-262）依赖 AUDIENCE_ONLY_IDENTITY_RE 的行尾锚定；「- Built for professionals 0/1/…/10」（尾加一个数字）即绕过——personaUsecaseFact 的 remainder 检查（:254-255）只拦 tools 尾缀，尾缀任意词/数字后整行被当合法 usecase fact，且 substantiveStatement 自身含 personaUsecaseFact（:1434），四重门（:1497-1501）全部放行。11 条 → usecase_items=10 → **score 20/100**；同构造放 Use cases 标题下同样 uc=10（P3c）。

### ④ CJK persona 标点/偏好 — 原向量有效，残余 Minor（M-1）
- 「适合喜欢快速的工具的用户」「适合：专业人士」「适用于企业用户」全部 0 ✓；正例「适合需要批量处理日志的运维人员」保留 ✓（P4b uc=1）。
- **M-1 残余**：「面向人士的解决方案」→ usecase_items=1。qualifier「人士的解决方案」不以 ：177 的 人士/用户/… 后缀列表结尾、无任务线索、非偏好词 → 判为具体人设。1 单元 ≈ +2 分，构造空间为「面向+泛指+的+非人后缀名词」。

### ⑤ 裸 channel/版本号表格行 — 正确 ✓
- 「| Stable | Beta |」「| 1.0 | 1.1 |」零贡献；同表「| Stable | Parses PDF files with parser |」真实能力照常计 1（releaseChannelLabelRowOnly :223-228 精确命中 owner-fresh2 F1，无过度误杀）。

### ⑥ parserRevision 3 传播 — 完整 ✓
- 全库 grep：所有消费点（score.ts/types.ts/market-data.ts/catalog.ts/snapshot.mjs/evaluate/validate-perturbations/oracle/aggregate/search-scorer/各测试）均为 3；无 revision-2 消费点残留。snapshot.test.mjs:9 与 practical-score.test.mjs:51 的 rev2/rev1 fixture 为刻意的 fail-closed 反例（断言计数为 0/null），非消费点。
- 评分器零改动 ✓：score.ts PRACTICAL_PARSER_REVISION=3 + PRACTICAL_SCORER_REVISION=4，缓存指纹由 (parserRev, scorerRev) 组装（score.ts:84-92），caps/exponent/confidence 逻辑代码未见改动且哈希与锁一致；23/23 含族上限凸性/恰 100 门用例。

### 附带修复复核
- fallbackReplacementSubstantive 语法损伤修复后 150/150 与 23/23 全绿，无回归迹象；:1381 死代码移除不影响行为（本评审未构造独立复现，计入未覆盖）。

## 四、发现清单

| 级别 | 编号 | 文件:行 | 一句话 |
|---|---|---|---|
| Important | I-1 | readme-signals.mjs:323-326 | fallbackPlannedContent 动词/时间词白名单封闭，will+improve/build/release/extend 与 将来会/准备/打算 变体 roadmap bullet 照计（实测 4 条 → 9/100） |
| Important | I-2 | readme-signals.mjs:1341-1343,1481,1474-1476 | 实质门只盖段落，三族中性 filler bullet 仍刷满族上限（Use cases 12 条互异 bullet → 20/100；三族同灌 15/100） |
| Important | I-3 | readme-signals.mjs:258-262,254-255,1497-1501 | 身份门靠行尾锚定，「- Built for professionals N」尾缀一词/数字即把身份 bullet 变成合法 usecase fact（11 条 → 20/100） |
| Minor | M-1 | readme-signals.mjs:177 | 「面向人士的解决方案」类泛指+非人后缀 qualifier 绕过 concreteCjkPersona（+1 单元） |
| Minor | M-2 | readme-signals.mjs:325 | 「Planned report scheduler for nightly jobs」等以 Planned 开头的真实交付特性被前缀规则误杀（负向误杀，保守方向） |

严重度口径：I-2/I-3 单族可达 20/100、I-1 9/100，均低于原 adversarial F-2 的 +50 口径且受族上限与跨族去重约束，故记 Important 不记 Critical；三者均为零真实语义纯灌水，协议 0C/0I 门未过。

## 五、未覆盖清单
- blind/round-05、round-07、.round-*-review-batches 正文（硬边界禁读）。
- oracle validator / consecutive validator / arbitration builder 未独立重放（不在指定机械清单内）。
- 多语言副本 maxCopyEvidence 路径下六处修复的行为未探针。
- 英文 targeted-audience persona 变体、CJK roadmap 全量未来式变体（仅测 3 个 CJK 变体）。
- 死代码移除与 fallbackReplacementSubstantive 修复未做独立差分复现（以 150/150+23/23 间接背书）。
- 团队级 claim 归属（多人 README 混合灌水）仅由实测的跨族去重背书。

## 六、结论
六处修复中 ②（段落路径）/④（原向量）/⑤/⑥ 判定正确且无新洞；①③ 存在已实测的绕过变体，② 对 bullet 格式切换不设防。三项 Important 均为「零语义内容 → 族上限级得分」的动态复现，附探针（/tmp/repair1-adv/probe*.mjs，只写 /tmp）。建议修复轮 2：对三族 bullet 路径补正向语义门或收紧 fallbackPlannedContent/personaUsecaseFact 尾缀逻辑，随后按协议重跑双 fresh 评审。
