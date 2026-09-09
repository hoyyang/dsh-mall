# Practical V3 Freeze Review — adversarial-fresh2-lock3c0572e8（full-lock 独立验收门）

评审员视角：对抗评审。日期：本次冻结候选会话。工具预算：~13 次调用（≤35）。未读任何 blind/round-05/round-07/.round-*-review-batches 正文；除本报告外未改任何文件；无网络。

## 1. 哈希核对（第 1 步）— 14/14 匹配，无 Critical

| 文件 | 期望前 8 | 实测前 8 | 结果 |
| --- | --- | --- | --- |
| ../dsh-market-index/scripts/readme-signals.mjs | 38d93b81 | 38d93b81 | ✓ |
| ../dsh-market-index/scripts/readme-signals.test.mjs | 68234343 | 68234343 | ✓ |
| src/score.ts | 26b2b1af | 26b2b1af | ✓ |
| lib/score.js | e16f5629 | e16f5629 | ✓ |
| scripts/practical-v3-semantic-ownership.mjs | 188559c0 | 188559c0 | ✓ |
| scripts/aggregate-practical-v3-oracle.mjs | 8ffa8c42 | 8ffa8c42 | ✓ |
| scripts/validate-practical-v3-oracle.mjs | 8a726d14 | 8a726d14 | ✓ |
| scripts/validate-practical-v3-review-batch.mjs | cba91fda | cba91fda | ✓ |
| scripts/practical-v3-evaluator.test.mjs | 60fe2b94 | 60fe2b94 | ✓ |
| scripts/evaluate-practical-v3-round.mjs | 8cec44af | 8cec44af | ✓ |
| scripts/practical-v3-metrics.mjs | 8a74562d | 8a74562d | ✓ |
| scripts/validate-practical-v3-consecutive.mjs | be1c2a99 | be1c2a99 | ✓ |
| scripts/build-practical-v3-arbitration-batches.mjs | efdbab28 | efdbab28 | ✓ |
| artifacts/practical-v3/practical-v3-evidence-oracle-rubric.md | 2d124059 | 2d124059 | ✓ |

## 2. 机械检查（第 2 步）— 全部通过

- `npm run test:practical`：**23 pass / 0 fail**（期望 23/23 ✓，exit 0）。
- `node --test scripts/readme-signals.test.mjs`：**142 pass / 0 fail**（期望 142/142 ✓，exit 0）。

## 3. 核心文件审计（第 3 步）

### a) 五语义族原子归属与互斥
- 全局去重集合 `globalSeen`（readme-signals.mjs:1308-1315）+ 归一化键 `semanticClaimKey`（:378-380，normalizeEvidence 剥离链接/URL/包裹/标点/空白）覆盖 capability/usage/usecase/output/reliability 五族（:1367-1376 按 reliability→output→usecase→usage→capability 顺序认领，最具体族优先）；usageActions/ioPairs/codeExamples/media 为结构计数不进该集合（:1445-1464），符合 rubric 第 5 条。
- 探针 p6 验证：同一主张的裸/加粗/链接包裹三个变体只计 1 次（rel=2=重复主张 1 + 独立事实 1；cap=0），跨族包装绕过原子性失败 ✓。
- 门控链 `semanticContentEligible`（:271-282）覆盖 install/config/meta/persona 身份/catalog/外部链接/装饰 bullet/营销/需求/计划/身份句。营销零贡献（FALLBACK_MARKETING_PROSE_RE、MARKETING_BENEFIT×ABSTRACT 组合门，:260-268）；路线图/计划（PLANNED_MEDIA_RE、fallbackPlannedContent、CAPABILITY_MIGRATION_GUARD_RE 内 roadmap 词族）；badge/媒体（BADGE_URL/ALT、DECORATIVE_MEDIA_RE）；长度无任何计分路径；changelog/路线图标题走 META_HEADING_RE/EXCLUDED 排除。
- **例外见发现 F1（Why 半分路径缺身份门控）。**

### b) ioPairs 同例子同块 / 表格归属 / fallback 资格门
- labeledIoPairs（:942-965）要求 Input/Output 同线或窗口 ≤3 行内配对并拼接为单串 ✓；semanticTablePairs（:866-893）要求同表 Input+Output 头，含 ambiguous semantics（situation/behavior）用户形态多数门；endpoint 两路径要求 API 头 + 显式输出列或 API_RESULT_CELL ✓。表格行排除 catalog/外部链接/安装行；纯分发行被 divider 检测排除（各 table 函数 `/^\s*\|?\s*:?-{3,}/` 跳过）✓。短截图 caption 行不重复计数（shortScreenshotCaptionRow，:745-749）。
- fallback 候选（fallbackItemFor，:1183-1219）必须过 fallbackSemanticContentEligible（:304-313：config/setup/meta/身份/营销/需求/计划/身份句全拒）+ fallbackReplacementSubstantive（:1167-1179 语义资格门）+ 标题噪声/营销门 + 单 token 标题门，权重 0.5 ✓。探针 p3b（"## Audience"）零贡献证实 fallback 路径身份门生效。

### c) 身份/persona
- 纯职业/团队身份：GENERIC_PERSONA_ONLY/BENEFIT/PREFERENCE（:139-144）+ AUDIENCE_ONLY_IDENTITY_RE（:73）+ personaIdentityContent（:221-225）在 migrated/usecase 节/fallback 路径均归零（p3b/p3c 实证 0）。
- 任务限定式：TASK_QUALIFIED_PERSONA_RE（:138）计 usecase 1 次（p3c 实证）✓；CJK 具体人设（个人工作室）计 1 ✓。
- **例外见 F1/F2。**

### d) 评分器（src/score.ts，与 lib/score.js 哈希一致）
- rubric-cap 满证据可达 100：capability 12→25 + usage(8+8+4+5)=25 + usecases 10→20 + demo(6+9)=15 + reliability 10→15 = **100**（:125-140，anchor 严格等于 rubric cap；共享 0.9 次幂；confidence 只描述证据不改分，:119-123 注释与实现一致）。
- 确定性：纯函数，无随机/时间输入；无 star/分布/身份输入——scorePractical 仅接受 ReadmePracticalEvidence（:143-147）；popularity/maintain 与 practical 维度完全隔离。
- 缺证据 fail-closed：无 readmeSig 时 practical/ease = null（:384-386），confidence 降低 total（:392），无任何回退旧 80 分路径；版本门 currentPracticalEvidence（:83-85）+ practicalEvidenceAt 指纹防旧缓存继承（:87-109, :513-541）。

### e) 归一化快扫
- practical-v3-semantic-ownership.mjs:39-63：强归一化（unwrapMarkdownLinks + stripInlineWrappers 4 轮 + NFKC + lowercase + 标题/列表前缀/管道剥离 + 边界词包含检测 containsSemanticSignature）——无绕过。
- validate-practical-v3-oracle.mjs:50-51 弱 normalized（trim/空白/小写）**仅**用于 media 去重（:140-142）；五语义族走 evidenceOwnershipIssues（:146）即上述强归一化，无绕过。
- 探针 p6 的链接包裹变体在强归一化下合并成功，旁路失败 ✓。

## 4. 对抗探针结果（6+5 个合成 README，/tmp/fresh2-adv/）

| 探针 | 方向 | 结果 | 判定 |
| --- | --- | --- | --- |
| p1 install/config 伪装（能力句藏于 Installation/Configuration） | install/config | 全 8 项 = 0 | ✓ 拦截 |
| p2/p2a config 混入 Usage 行（GITHUB_TOKEN） | install/config | 该行 0 贡献；干净行为 1 | ✓ 拦截 |
| p3a Why 标题 + 6 条纯身份 bullet | 身份灌水 | usecase = **3**（6×0.5） | **✗ 灌水成功（F1）** |
| p3 Why 标题 + 11 条身份 bullet | 身份灌水 | usecase = **6**（≈12/20 维度分） | **✗ 灌水成功（F1）** |
| p3b "## Audience" 同类身份 | 身份灌水 | usecase = 0 | ✓ 拦截 |
| p3c "## Use cases" 身份 + 任务限定 | 身份灌水 | 通用身份 0；任务限定 1 | ✓ 拦截 |
| p4a "适合谁" + 适合：专业人士/企业级用户 | 身份灌水（CJK） | usecase = **2** | **✗ 灌水成功（F2）** |
| p5 channel 表格：distribution-only 行 + capability 行 | channel 旁路 | distribution-only 0；capability 1；无输出列不误记 io | ✓ 拦截 |
| p6 包装/链接变体跨族重复 | Markdown 包裹原子性 | 重复主张仅 1 次（rel=2/cap=0） | ✓ 拦截 |

## 5. 发现清单

### F1 · Critical · readme-signals.mjs:1381-1385（soft Why/Motivation 半分路径缺身份门控）
`kind==='other' && SOFT_USECASE_HEADING_RE` 的半分路径对 items 只过滤 `FALLBACK_MARKETING_PROSE_RE`，未应用 `semanticContentEligible` / `personaIdentityContent` / `semanticMetaContent`。纯职业/团队身份 bullet（"Designed for developers."、"Built for teams." 等）每条以 0.5 计入 usecase：6 条→3 units，11 条变体→6 units（usecases 维 ≈12/20，且推高 coverage/overall confidence）。同样内容在 "## Audience"（fallback 路径）与 "## Use cases"（semanticContentEligible 路径）均为 0（p3b/p3c），证明回归仅限此路径。直接违反冻结 rubric 第 6 条（identity contributes zero）与审计点 c（纯职业/团队身份零分）。修复建议：该路径 items 追加 `.filter((line) => !personaIdentityContent(line) && !semanticMetaContent(line))`。

### F2 · Important · readme-signals.mjs:146-152（CJK 通用人设标点限定词绕过 concreteCjkPersona）
`concreteCjkPersona` 的通用性判定依赖 `CJK_GENERIC_PERSONA_QUALIFIER_RE` 匹配限定词；当 PERSONA_USECASE_FACT_RE 捕获组仅含标点（"适合：专业人士" → qualifier="："）时，非限定词集 → `!generic` 为真 → 判为具体人设并计 usecase 1.0。p4a："适合：专业人士"/"适合：企业级用户" 两条纯职业身份 → usecase=2。违反 rubric 第 6 条/审计点 c（CJK 例外仅限具体任务人设或 CJK_SPECIFIC_PERSONA_RE 人设）。修复建议：qualifier 先剥标点/空白再判通用；或空泛 qualifier 一律归零。

### F3 · Minor · readme-signals.mjs:1370/1444-1465（usecase/capability 单位可为小数，冻结口径未明示）
0.5 权重（Why 半分、fallback、preview 半分）使 usecase_items/capability_items 出现小数单位（p3 实测 usecase=6，手算构成含 0.5 碎片）。score.ts `practicalCount` 接受非整数、credit 幂曲线照常作用，评分链确定但不产生离散性错误；仅建议冻结口径文档明示小数证据单位的舍入约定（当前为不取整直传）。非灌水，观察项。

### 通过项（无发现）
- install/config 伪装全链路拦截（标题排除 + 行级 INSTALL_STEP/CONFIG_KEY/CONFIG_ASSIGN/CONFIG_CONTENT 门 + 围栏行过滤 :1033）。
- channel 表格：distribution-only 行零贡献（RELEASE_CHANNEL_DISTRIBUTION_ONLY_RE/CJK 双路 :170-171），capability verb 单次计入，RELEASE_CHANNEL_METADATA_CUE 与 capability 互斥门（:199-201）。
- Markdown 包裹/链接变体跨族原子性成立（解析器 normalizeEvidence + ownership 强归一化双层）。
- 评分器 rubric-cap 100 可达、确定性、无 star/分布/身份输入、缺证据 fail-closed 无 80 分回退。
- badge/装饰媒体（BADGE_URL/BADGE_ALT/DECORATIVE/PLANNED）、目录链接（CATALOG_ENTRY/EXTERNAL_REPO_LINK/CATALOG_TABLE_ROW）、语言副本 maxCopy、精确文档复制折叠（collapseExactDocumentCopies）路径与 rubric 一致。

## 6. 未覆盖清单（如实）

1. 超长正则行全文未逐字符核验：read 工具对超长行存在截断显示（如 :250/:337/:338/:339），以哈希一致 + 142 用例 + 行为探针替代验证。
2. scripts/validate-practical-v3-review-batch.mjs、aggregate-practical-v3-oracle.mjs、practical-v3-metrics.mjs、validate-practical-v3-consecutive.mjs、build-practical-v3-arbitration-batches.mjs、evaluate-practical-v3-round.mjs 仅哈希核对，正文未读（题目仅要求快扫 oracle/ownership 两脚本）。
3. blind cohort / round-05 / round-07 / .round-*-review-batches 正文按边界禁读，oracle 批处理与连续性验证未实际运行。
4. lib/score.js 与 src/score.ts 的逐行构建等价性未复核（仅哈希与期望一致；tests 23/23 覆盖 scorePracticalDimensions 路径）。
5. dsh-market-index/scripts/readme-signals.test.mjs 用例正文未读（仅执行 142/142）。
6. 探针覆盖限四个指定方向； fencedReferenceActions/fencedOperationalActions/dedupeOperationFences/indentedCodeLineSet 等结构证据路径未做对抗探针（代码走读未见明显门控缺失）。

## 7. 结论

机械门全绿、哈希 14/14、六向对抗探针中四向拦截成功；但身份/persona 灌水在 Why/Motivation 半分路径（F1）与 CJK 标点限定词路径（F2）成功，F1 达 Critical（可稳定刷出 6 个 usecase 单位）。建议冻结门驳回本次候选，待 F1/F2 修复并重跑机械检查与本组探针后重新送审。
