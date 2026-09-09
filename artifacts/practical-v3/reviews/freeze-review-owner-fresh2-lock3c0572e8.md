# Practical V3 冻结候选 — Full-Lock 独立评审（所有者视角，lock3c0572e8）

评审日期：本会话。评审视角：所有者评审——对照冻结 rubric 逐条核对解析器归属语义与评分器公式正确性（审计要点 a-d）。硬边界遵守：未读 blind/round-05、round-07、.round-*-review-batches 正文；除本报告外未改任何文件；未联网。

## 1. 哈希核对（14/14 匹配，0 Critical）

| 文件 | 期望前8位 | 实测前8位 | 结果 |
|---|---|---|---|
| ../dsh-market-index/scripts/readme-signals.mjs | 38d93b81 | 38d93b81 | ✅ |
| ../dsh-market-index/scripts/readme-signals.test.mjs | 68234343 | 68234343 | ✅ |
| src/score.ts | 26b2b1af | 26b2b1af | ✅ |
| lib/score.js | e16f5629 | e16f5629 | ✅ |
| scripts/practical-v3-semantic-ownership.mjs | 188559c0 | 188559c0 | ✅ |
| scripts/aggregate-practical-v3-oracle.mjs | 8ffa8c42 | 8ffa8c42 | ✅ |
| scripts/validate-practical-v3-oracle.mjs | 8a726d14 | 8a726d14 | ✅ |
| scripts/validate-practical-v3-review-batch.mjs | cba91fda | cba91fda | ✅ |
| scripts/practical-v3-evaluator.test.mjs | 60fe2b94 | 60fe2b94 | ✅ |
| scripts/evaluate-practical-v3-round.mjs | 8cec44af | 8cec44af | ✅ |
| scripts/practical-v3-metrics.mjs | 8a74562d | 8a74562d | ✅ |
| scripts/validate-practical-v3-consecutive.mjs | be1c2a99 | be1c2a99 | ✅ |
| scripts/build-practical-v3-arbitration-batches.mjs | efdbab28 | efdbab28 | ✅ |
| artifacts/practical-v3/practical-v3-evidence-oracle-rubric.md | 2d124059 | 2d124059 | ✅ |

## 2. 机械检查

- `dsh-mall` `npm run test:practical`：**23/23 pass**，0 fail，exit 0。✅
- `dsh-market-index` `node --test scripts/readme-signals.test.mjs`：**142/142 pass**，0 fail，exit 0。✅

## 3. 核心文件审计（owner 视角）

### a) 五语义族原子归属与互斥 — 通过

- 互斥机制：`readme-signals.mjs:1308-1316` 全局 `globalSeen` claim 集，`semanticClaimKey`（normalizeEvidence + number/edition 数字掩码）同一归一化主张在五族间只计一次。claim 顺序 reliability(:1367) → output(:1368-1369) → usecase(:1370-1371) → usage(:1372) → capability(:1373-1377, 1381, 1389, 1416, 1424, 1432)，由最具体族先取；migration 线（migratedReliability/Output/Usecase/CapabilityLines）全部来自同一 `semanticFactLines` 全行值集，行级双重归属被精确键去重阻断。fallback(:1419-1425) 亦走同一 claim 集，与主族不重复计。
- 零贡献核验：install/config —— `semanticContentEligible(:271-282)` 过滤 INSTALL_COMMAND/INSTALL_STEP/configurationContent，`fencedBlocks(:1028-1037)` 逐行剔除 install/config 行；营销 —— `marketingContent(:260-269)` + FALLBACK_MARKETING_PROSE_RE（标题/正文/候补三处门控）；路线图 —— fallbackPlannedContent(:284-287) + CAPABILITY_MIGRATION_GUARD_RE(:381-397) roadmap/will-add 模式 + PLANNED_MEDIA_RE；changelog/badge —— META_HEADING_RE(:10) 排除 changelog 标题，媒体走 BADGE_URL_RE/BADGE_ALT_RE(:317-318)；身份 —— IDENTITY_ONLY_RE(:370) + personaIdentityContent(:221-225) + AUDIENCE_ONLY_IDENTITY_RE/GENERIC_PERSONA_ONLY_RE(:141-144, :208-214)；长度/围栏数量 —— README 长度仅入 `readme_len`（服务 ease），不入 practical 证据；`code_examples` 仅限 usage 族操作性围栏（:1457-1464），要求 STRONG_RUNNABLE_LINE 或带 prompt 引用门，非围栏计数。

### b) ioPairs / 表格 / 通道归属 — 基本通过，1 条 Important（见发现 F1）

- ioPairs 同例子同块：`labeledIoPairs(:940-965)` 限同一 section 内 input→output 距离 ≤3 行，成对合并为单串；表格对 `semanticTablePairs(:866-893)` 要求同一表内 input+output 双表头，且 ambiguous 场景列要求 user-shaped 过半；`endpointTablePairs/splitEndpointTablePairs` 要求 API 标题 + 显式 output 列或结果单元格。两侧缺失不推断。✅
- 纯分发行不放行：所有表格扫描（tableRows:731-732、semanticTableRows:755/763、commandTableActions:788/791、measuredResultTableRows:972/976 等）均以 `/^\s*\|?\s*:?-{3,}/` 跳过分隔行。✅
- meta/截屏说明行：`shortScreenshotCaptionRow(:745-749)` 阻止媒体表短说明行计入语义行。✅
- 通道归属：releaseChannel* 系列(:164-203) 对句子/内联/表格单元三种形态拆解 channel details，distribution-only 零贡献、capability 事实放行。**但纯 channel-label 表格行（所有单元均为 Stable/Beta/nightly 等裸标签）时 `releaseChannelDetails` 返回空数组 → channelMetadata=false → 不被语义内容门拦截，若落在 capability 分类标题下可作 capability 条目计数**（F1）。
- fallback 语义资格门：`fallbackItemFor(:1183-1219)` 要求非噪声/非营销标题、双 token 或 CJK、实质内容门（fallbackReplacementSubstantive）+ fallbackSemanticContentEligible，权重 0.5 并计入 fallback_share。✅

### c) 身份/persona — 通过

- 纯职业/团队身份零分：GENERIC_PERSONA_ONLY_RE(:141-144) 整行阻断 "designed/built for developers/teams" 式声明；AUDIENCE_ONLY_IDENTITY_RE(:73) 阻断 "X for teams/users"；两者在 personaUsecaseFact(:208-214) 先于归属判断被拒，且 personaIdentityContent(:221-225) 使其不进入任何语义族。
- 任务限定式：TASK_QUALIFIED_PERSONA_RE(:138) 命中 "for developers auditing..." 等任务限定人设 → personaUscaseFact 即使无显式 persona 标记也放行(:214-215) → migratedUsecaseLines(:1345-1351) 记 **usecase**，不落 reliability/capability。✅
- CJK：CJK_PERSONA_PREFIX_RE(:145) 前缀判定 + CJK_GENERIC_PERSONA_QUALIFIER_RE(:146) 拒纯限定词 + CJK_SPECIFIC_PERSONA_RE(:147) 收具体任务人设（独立开发者/小型团队等）→ concreteCjkPersona(:149-152) → usecase。✅
- 兼容负向守卫：PERSONA_COMPAT_NEGATIVE_RE(:135) 防止 "works on Linux" 类平台声明被当 persona 证据（平台边界走 reliability 的 RELIABILITY_DOMAIN/CONSEQUENCE 路径）。✅

### d) 评分器公式 — 通过

- Rubric-cap 可达 100：scorePracticalDimensions（score.ts:125-140）anchors/points 为 capability 12→25；usageItems 10→8 + usageActions 10→8 + ioPairs 8→4 + codeExamples 4→5（usage 维 min25 封顶，恰好 25）；usecases 10→20；outputs 8→6 + media 6→9（demo 维 min15 封顶，恰好 15）；reliability 10→15。总 25+25+20+15+15=**100**。满 anchor 时 (x/anchor)^0.9 = 1，严格等于上限；曲线指数 0.9 为注释声明的中位数实证值，cap 内每条证据均有边际价值。✅
- 确定性：纯函数，无随机源；evidence fingerprint(:87-109) 含 scorer revision，四舍五入稳定。✅
- 无 star/分布/身份输入：practical 维仅由九项证据计数决定；stars/p99/dl/starDelta 只进 popularity，readme_len 只进 ease，身份推断类型不进分。✅
- fail-closed：currentPracticalEvidence(:83-85) 版本/parserRevision 双门，证据缺失或版本不符 → **null**，无旧 80 分回退路径；attachScores(:536-542) 仅当 practicalEvidenceAt 指纹完全一致时继承，指纹含 scorer revision，索引升级强制重算。✅
- lib/score.js 与 src/score.ts 哈希均在期望清单内（e16f5629 / 26b2b1af），构建产物一致性由哈希核对背书。

### e) 归一化绕过快扫 — 通过，1 条 Minor

- practical-v3-semantic-ownership.mjs semanticExcerptSignature(:51-63)：NFKC + lower + 链接解包（配对括号深度追踪）+ 最多 4 轮行内 `**_~~` 包裹剥离 + 前导标题/list/引用剥离 + 尾标点/空白归一；containsSemanticSignature(:71-86) 带词边界防跨词误报，substantiveContainmentSignature(:65-69) 要求 ≥4 CJK 字符或 ≥2 词才做包含判定。身份相等恒判（不受词数门限制），短摘要在跨族重复仍被 `signature === prior.signature` 捕获。未构造出可行绕过。
- validate-practical-v3-oracle.mjs:121/136 的 verbatim 校验用 `source.includes(excerpt)`（逐字要求，无归一化放宽），:146 调用 evidenceOwnershipIssues 做全量归一化互斥检查。唯 media 组内去重(:140-142) 用弱归一化（lowercase+whitespace），且 media 不在 evidenceOwnershipIssues 覆盖的字符串字段内（F2）。

## 4. 发现清单

| # | 位置 | 级别 | 依据 |
|---|---|---|---|
| F1 | dsh-market-index/scripts/readme-signals.mjs:174-203（releaseChannelDetails）× :1255-1266（sectionItems capability 仅 semanticContentEligible 门控） | **Important** | 纯 channel-label 表格行（如 `\| Stable \| Beta \| Nightly \|`，所有单元格均匹配 RELEASE_CHANNEL_LABEL_RE）使 releaseChannelDetails 返回空数组、channelMetadata=false，不触发语义内容排除；若位于 capability 分类标题（如 Features）下，该行经 sectionItems('capability') 直接计 1 条 capability 证据，违背 rubric 全局规则 6（频道/流行度元信息零贡献）。利用面窄：需 capability 标题 + 全 label 单元表格，但属历史已修复类别（channel/meta 归属）内的残余缺口，非评分器问题。修复建议：releaseChannelDetails 所有单元均为 label 时视作 distribution-only 元信息行，或在 semanticContentEligible 中对该形态拒绝。 |
| F2 | dsh-mall/scripts/validate-practical-v3-oracle.mjs:50-52,140-142 | Minor | media 组内去重仅用 lowercase+whitespace 归一化（无 NFKC / Markdown 包裹剥离），且 media 数组不在 evidenceOwnershipIssues 的 PRACTICAL_V3_STRING_FIELDS 内；`![a](x.png)` 与带包裹变体的重复媒体可躲过 mediaSeen 去重。影响上限受 media cap 6 约束，分数影响 ≤ 数分；rubric 规则 4 的原子归一化措辞主要约束五语义族，media 属结构证据，故降为 Minor。 |
| F3 | dsh-market-index/scripts/readme-signals.mjs:378-380（semanticClaimKey） | Minor | 数字掩码仅覆盖 "number/edition + 数字" 两词；同主张换版本号表述（"v1.2.3" vs "v2.0.1"）归一化后不同键，可各计一次。与 rubric 规则 3（repeated claims count once）存在理论偏差；实际 README 中同族跨版本重复行少见，且行级归属唯一性（每行单族）未被破坏，仅同主张多次出现的计数上限受 cap 约束。 |

无 Critical。无评分器（score.ts/lib/score.js）发现。

## 5. 未覆盖清单（如实）

1. 两个测试套件仅执行并通过（23/23、142/142），未逐条审读测试用例内容，未验证 F1/F3 形态是否已被现有用例覆盖。
2. 仅静态审计，未对真实 README 语料运行解析器做 F1 形态的实证复现（只读三核心文件 + 两脚本的 bounded 约束下的推断）。
3. 未读 aggregate-practical-v3-oracle.mjs、validate-practical-v3-consecutive.mjs、build-practical-v3-arbitration-batches.mjs、validate-practical-v3-review-batch.mjs、practical-v3-evaluator.test.mjs、evaluate-practical-v3-round.mjs、practical-v3-metrics.mjs 正文（仅哈希核对）；审计要点 e 的归一化检查覆盖 semantic-ownership.mjs 与 validate-oracle.mjs 两个文件。
4. lib/score.js 与 src/score.ts 的构建一致性由期望哈希清单背书，未重编译 diff。
5. rubric 规则 7（catalog 只记自身发现/检索/维护行为）依赖 CATALOG_ENTRY_RE/CATALOG_TABLE_ROW_RE/EXTERNAL_REPO_LINK_RE 三正则核读确认存在，未逐语义族追踪 catalog 消融效果。
6. 五族 claim 顺序（reliability→output→usecase→usage→capability）的"最具体族优先"合理性按冻结设计接受，未重新发明排序论证。
