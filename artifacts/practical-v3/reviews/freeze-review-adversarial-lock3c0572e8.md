# Practical V3 full-lock adversarial freeze review — lock 3c0572e8

- Reviewer role: adversarial (full-lock, freeze gate)
- Date: 2026-09-03 (session local)
- Lock basis: 14-file expectation supplied with the review task; checkpoint `20-checkpoint.md` and `90-evidence.md` read in full before any probing.
- Blindness: Round 5 (`blind/round-05.ndjson`, `round-07.ndjson`, `.round-05-review-batches/`) README bodies were NOT read. No locked file was modified; probes and test runs wrote only to /tmp. No git commit/push/publish/deletion.

## 1. Hash verification (sha256, two independent tools)

13/14 exact match. One mismatch:

| # | File | Result |
|---|---|---|
| 1 | dsh-market-index/scripts/readme-signals.mjs | MATCH |
| 2 | dsh-market-index/scripts/readme-signals.test.mjs | MATCH |
| 3 | dsh-mall/src/score.ts | MATCH |
| 4 | dsh-mall/lib/score.js | MATCH |
| 5 | scripts/practical-v3-semantic-ownership.mjs | MATCH |
| 6 | scripts/aggregate-practical-v3-oracle.mjs | MATCH |
| 7 | scripts/validate-practical-v3-oracle.mjs | MATCH |
| 8 | scripts/validate-practical-v3-review-batch.mjs | MATCH |
| 9 | scripts/practical-v3-evaluator.test.mjs | MATCH |
| 10 | scripts/evaluate-practical-v3-round.mjs | MATCH |
| 11 | scripts/practical-v3-metrics.mjs | **MISMATCH** — see F-1 |
| 12 | scripts/validate-practical-v3-consecutive.mjs | MATCH |
| 13 | scripts/build-practical-v3-arbitration-batches.mjs | MATCH |
| 14 | artifacts/practical-v3/practical-v3-evidence-oracle-rubric.md | MATCH |

### F-1 (Critical, per protocol "any mismatch = Critical"): metrics.mjs lock expectation differs from file and from every on-disk record by one hex digit

- File actual (recomputed with Node crypto and `shasum -a 256`): `8a74562d942d45cb28f8702a657221eaf48686593b48a864bd08d3e864b4e3a6`
- Task-supplied expectation: `8a74562d942d45cb28f8702a657221eaf48886593b48a864bd08d3e864b4e3a6` (differs at position 35: `6` vs `8`)
- On-disk records: `20-checkpoint.md` line 35 (historical pre-repair chain) AND line 73 (current acceptance fingerprints) both contain `…af48686593…` — exactly the file's actual value (exact `grep -c`: variant A = 2, variant B = 0). No on-disk document contains the task-supplied variant.
- Assessment: the on-disk chain (file + both checkpoint records) is self-consistent; the task-supplied expectation appears to be a transcription error, not file drift. However this cannot be resolved from inside the review, and the consecutive validator recomputes live hashes (it would not catch a mistyped expectation). Fail-closed: the freeze lock list must be re-verified against the file before freezing; if the expectation source is confirmed correct, this becomes a file-drift Critical instead.
- No other referenced file (evaluator/oracle validator/aggregator/ownership/rubric/scorer) showed inconsistency.

## 2. Mechanical checks (running tests does not modify the lock)

- Parser: `node --test scripts/readme-signals.test.mjs` (dsh-market-index) → **142/142 pass**, ~0.6s.
- Mall: `node --test` over the four practical files (`practical-score`, `practical-score-integration`, `practical-v3-evaluator`, `snapshot`) → **23/23 pass** (the standalone evaluator file alone reports 11 top-level tests; 23/23 reconciles with `test:practical`).
- Typecheck: equivalent command passes — `tsc -p tsconfig.json --noEmit` exit 0 and `tsc -p tsconfig.client.json` exit 0. (`npm run typecheck` itself failed in this review sandbox with `env: node: No such file or directory` — a PATH quirk of the review shell, not a repo defect; both underlying tsc invocations were run directly and pass.)
- Parser determinism: `practicalEvidence` twice over a 20k-char real README → byte-identical JSON.
- Scorer: cap evidence scores exactly 100 (25/25/20/15/15); 3000-case differential test `src/score.ts` (node strip-types) vs `lib/score.js` → 0 divergences in totals and dimensions; fail-closed confirmed (`version:2` → null, `parserRevision:1` → null, null evidence → null, `currentPracticalEvidence({version:3})` → false).

## 3. Static review conclusions (no findings)

- `src/score.ts` / `lib/score.js`: evidence v3 / parserRevision 2 / scorerRevision 4 / exponent 0.9 (lines 78–81); anchors 12/10/10/8/4/10/8/10 + media 6 with dimension caps 25/25/20/15/15 sum to 100; rubric-cap evidence reaches exactly 100; confidence never enters the score; practical path takes no star/distribution/identity input; old evidence fails closed via `currentPracticalEvidence`.
- `evaluate-practical-v3-round.mjs`: recomputes every oracle total from `rating.oracleEvidence` via the production scorer (lines 137–149); stored reviewer totals are never trusted; enforces v3/revision-2 oracleEvidence, per-field caps, cohort uniqueness ≥100, replay of the ratings report from current owners, and full protocol fingerprints.
- `aggregate-practical-v3-oracle.mjs`: verbatim citation check `source.includes(excerpt)` ≤220 chars (line 77), media weights 0.5/1 capped at 6, ownership owner called per review (line 103), exact ordered disagreement-only C coverage, pair-report replay, and fingerprints on cohort/scorer/rubric/pair-validator/owner. Aggregation = two-reviewer count mean / three-reviewer count median → production scorer only.
- `validate-practical-v3-oracle.mjs` / `validate-practical-v3-review-batch.mjs`: order, caps, verbatim quotes, media uniqueness, ownership issues; exit 1 on any issue.
- `validate-practical-v3-consecutive.mjs`: live recomputation of all current fingerprints, exact reproduction of both evaluation reports, cohort hash/repo non-overlap, unchanged algorithm/protocol between the two rounds.
- `practical-v3-metrics.mjs`: tie-safe fixed-budget fractional top-k (tied scores cannot inflate the budget); gates fail closed on null; symmetric type consensus; fairness strata need n≥10.
- `practical-v3-semantic-ownership.mjs`: probes confirmed rejection of same-field and cross-family duplicates under case/whitespace collapse, NFKC, Markdown bold/code wrap, link unwrapping, list/blockquote prefixes, table pipes, and word-boundary-safe prefix collisions (`add user` ⊂ `add user account settings` flagged). Residual: a zero-width-space insertion or a one-character CJK insertion can evade containment — but exploiting it requires a non-verbatim excerpt, which the verbatim gate already rejects; residual risk negligible (informational only).
- Parser zero-contribution surfaces, all verified zero-delta against a legal baseline: install commands/steps, fenced and prose config (incl. Markdown-wrapped `**OPENAI_API_KEY**=…`), marketing prose/bullets, roadmap/planned content (EN+CJK), badges/Star History/decorative media, external catalog links and catalog tables, identity-only lines, audience-only identity. Channel distribution-only metadata ("experimental builds for early access", CJK equivalents, table cells) stays zero; channel rows with concrete capability verbs credit capability exactly as the recorded 90-case design intends.
- Structural guards verified: `Input:`/`Output:` in different sections produce io_pairs=0; same section within the 3-line window produces 1; duplicate claims across sections are single-owned by the global claim set (moving a bullet to a Why section shifts 1.0→0.5, no double count); fence farms in excluded sections score zero; usage fence farms are bounded by the usage_actions/code_examples caps with operation-fence dedup; explicit bilingual copies take per-dimension max.

## 4. Findings

### F-2 (Critical): main-path prose under Reliability / Use-Cases / Output headings credits arbitrary neutral filler to the family cap — no concrete-semantics gate on 3 of 5 families

- File: `dsh-market-index/scripts/readme-signals.mjs`
  - reliability: `sectionProse('reliability')` consumed at line 1367 via `claimAll([...sectionItems('reliability'), ...sectionProse('reliability')])`; `sectionProse` (lines 1283–1287) filters only `semanticContentEligible` — no reliability semantic test.
  - usecases: same pattern at line 1370 (`sectionProse('usecase')`).
  - outputs: hard-output prose path lines 1352–1363 credits section prose at weight 1.
- Contrast: capability and usage prose are gated by `capabilityParagraphs` (line 712, requires a capability fact) and `usageParagraphs` (line 720, requires action verbs). The pinned invariant `main-path prose requires concrete semantics and rejects length or marketing farming` (readme-signals.test.mjs line 2119) is only asserted for `## Features`/`## Usage` filler; reliability/usecase/output were left unpinned.
- Reproduction (all probes verbatim, /tmp only):
  - `# Demo\n## Reliability\n` + 12 neutral paragraphs ("The project documentation describes design note N about the overall structure.") → `reliability_items = 10` (score impact: reliability 15/15).
  - `## Use cases` and `## 使用场景` with the same filler → `usecase_items = 10` (20/20).
  - `## Output` with the same filler → `output_items = 8` (demo 15/15).
  - The same filler under a non-semantic brand heading (`## Design Notes`) correctly yields only the 0.5 fallback unit, proving the gate gap is heading-scoped, not content-driven.
  - Combined farming of the three headings yields +50/100 score from prose containing no capability, usage, use-case, output, or reliability semantics. Control probe on the legal baseline (+12 filler paragraphs under `## Reliability`) moved reliability 4→5 with the baseline text — same root cause.
- Why Critical: this is successful evidence farming in the exact semantic-attribution surface the freeze protects; human oracle reviewers would count zero evidence for such sections, so Round 5 machine scores would inflate (severe-FP pressure) for any README with these headings and neutral prose. It is bounded by the family caps but needs no prohibited wording to trigger.

### F-3 (Important): CJK generic preference personas score as use cases — asymmetric with the fixed English path

- File: `dsh-market-index/scripts/readme-signals.mjs` lines 145–152, consumed at line 216.
  - `CJK_GENERIC_PERSONA_QUALIFIER_RE` (line 146) whitelists only fixed qualifiers (安全/工程/开发/产品/研究/维护/审查/响应/技术/业务/企业级/个人/专业); `concreteCjkPersona` (line 151) treats ANY other qualifier as "concrete" (`!RE.test(qualifier)` → true).
- Reproduction (each isolated, use-case heading):
  - `适合喜欢快速的工具的用户` → `usecase_items = 1` (users who like fast tools — a preference, not a task/context).
  - `适合追求简单体验的用户` → `usecase_items = 1`.
  - English control `Built for developers who want speed` → 0 (the post-H repair works), `面向专业人士` → 0, `Target audience is developers and teams` → 0.
  - Positive control `面向需要审计智能合约的安全工程师` → 1 (legal concrete-task persona, by design).
- Each distinct CJK preference sentence is a new claim, so this is farmable to the usecase cap (10 → 20 points).
- This contradicts the recorded repair claim that abstract persona benefits are rejected "in English and CJK" (checkpoint post-13a95ccd entry), and the 100-combination CJK identity test matrix does not cover preference qualifiers (grep for 喜欢/追求/preference in readme-signals.test.mjs: no hits).

### Informational (no severity)

- Ownership-owner containment can be evaded by zero-width-space or single-CJK-character insertions, but only with a non-verbatim excerpt, which the validators' verbatim gate already rejects; no exploit path with verbatim citations was found.
- `npm run typecheck` fails in this review shell only because of the sandbox PATH (`env: node` not found); the exact underlying tsc commands pass. Worth a one-line note in the run log, not a finding.
- Mall standalone evaluator test file is 11 top-level tests; the recorded 23/23 corresponds to the full 4-file practical suite. Reconciled, no issue.

## 6. 已执行探针清单与结果（全部写入 /tmp，未触碰锁定文件与 Round 5/7 语料）

| # | 探针 | 输入要点 | 结果 | 判定 |
|---|---|---|---|---|
| P1 | 合法基线 | 12 能力要点 + usage 命令/要点 + IO 对 + usecases + outputs + reliability + 截图 | c9/ui4/ua6/io1/ce1/uc2/o5/m1/r4 | 基准确立 |
| P2 | install/config 变体 | fenced export/npm install、**KEY**= 包裹、"Set OPENAI_API_KEY to…"、CJK 配置句、install 要点 | 全字段与基线零差 | 通过 |
| P3 | 营销+路线图+徽章 | 营销段落、"Will add export to PDF"、计划：后续支持、Star History shields 徽章 | 全字段零差 | 通过 |
| P4 | 身份泛化（EN+CJK） | "Built for developers who want speed"、"Target audience is developers and teams"、"面向专业人士" 等 | EN 泛化全 0 | 通过（CJK 偏好句除外 → F-3） |
| P5 | CJK 偏好人设定界 | 适合喜欢快速的工具的用户 / 适合追求简单体验的用户（单句隔离） | 各 usecase_items=1 | **F-3 成立** |
| P6 | 具体任务人设（正控） | 面向需要审计智能合约的安全工程师；EN task-qualified | usecase 正分（设计内） | 通过 |
| P7 | channel 元数据伪装 | 表格/冒号/句子形态的 distribution-only detail（EN+CJK） | 全 0 | 通过 |
| P8 | channel 能力动词正控 | 表格 detail 含具体能力动词 | capability +2（90 例设计内） | 通过 |
| P9 | 围栏农场 | Usage 下 15 个命令围栏 / Installation 下 15 个围栏 | 前者 ua→10、ce→4（结构性上限内）；后者全 0 | 通过 |
| P10 | 长度扰动 | 基线 + 5700 字符中性填充 | 仅 reliability +1 → 溯源至 F-2 根因 | **引出 F-2** |
| P11 | IO 跨节 | Input:/Output: 分处两节 | io_pairs=0 | 通过 |
| P12 | IO 同节窗口 | 同节 3 行窗口内 Input:/Output: | io_pairs=1 | 通过 |
| P13 | 跨族重复声明 | 同一声明从 Features 移至 Why | 单次归属（1.0→0.5，无重复计数） | 通过 |
| P14 | 目录链接 | "- [Project](github.com/…) — 描述" 目录条目 | 全 0 | 通过 |
| P15 | 中性散文灌水定界 | 12 段中性散文分别置于 Reliability / Use cases / 使用场景 / Output / Design Notes | 前四者 r=10 / uc=10 / uc=10 / o=8；Design Notes 仅 0.5 fallback | **F-2 成立（3 族 + Output）** |
| P16 | 评分器 ts/js 差分 | 满锚证据 + 3000 例随机证据双实现对比 | cap=100（25/25/20/15/15）；DIFFS=0 | 通过 |
| P17 | 评分器 fail-closed | version:2 / parserRevision:1 / null | 全部 null | 通过 |
| P18 | ownership owner | case/空白/NFKC/粗体/代码/链接/表格线/列表前缀/引用前缀/前缀碰撞/CJK 包含 | 全部正确拒绝 | 通过 |
| P19 | ownership 残留 | 零宽空格插入、单字 CJK 插入 | 逃逸包含检测，但需非逐字引用（已被逐字门排除） | informational |
| P20 | 解析器确定性 | 20k 字符真实 README 两次解析 | 字节一致 | 通过 |
| P21 | 测试覆盖核查 | grep 喜欢/追求/preference/neutral/filler 于两测试文件 | F-2/F-3 均无既有测试钉住 | 支撑 F-2/F-3 |

## 7. 未覆盖攻击面清单（如实未跑，不构成通过结论）

- HTML 表格归一化的深度变形（嵌套 table、td 内单 br、属性内转义 <、table 跨节断裂）——仅静态审阅 + 测试套件既有用例，未自建探针。
- 围栏开闭记号边界（`~~~` 与 ```` 混用、≥3 反引号嵌套、行内三反引号、缩进 4 空格与列表嵌套交错的 indentedCodeLineSet 状态机）——未自建探针。
- reference-style 链接（[a]: url 定义式）与多行链接文本对 EXTERNAL_REPO_LINK_RE / unwrapMarkdownLinks 的绕过——未自建探针。
- 双语副本路径（explicitLanguageCopies/maxCopyEvidence）与 fallback 的交互（副本内 brand 标题回退是否重复计权）——未自建探针。
- media 权重边界（同图 markdown+HTML 双写、URL 归一化键碰撞、外部图床 0.5 权重的批量刷 media 至 cap 6）——未自建探针。
- 超长 README（200k 截断边界）与 collapseExactDocumentCopies 的偶数长度对称拆分博弈——未自建探针。
- 大规模正则回溯/ReDoS 压测（仅采信 90-evidence.md 的 2.317 线性度记录，未复测）。
- NFKC 全角变体对解析器正则（非 owner）的绕过——owner 已测，解析器主路径未测。
- 评审批次验证器 validate-practical-v3-review-batch.mjs 与 build-practical-v3-arbitration-batches.mjs 的端到端构造性负例（仅静态审阅 + 既有协议测试 23/23 覆盖）。
- Round 5/7 真实语料上的任何验证（按盲态约束禁止）。

## 8. Verdict basis

Freeze requires zero Critical and zero Important from both full-lock reviewers. F-1 blocks on protocol grounds pending a 5-minute re-verification of the expectation source (the on-disk evidence strongly suggests a transcription error in the lock list, not file drift — the file, checkpoint line 35, and checkpoint line 73 agree exactly). F-2 and F-3 are parser correctness gaps with working reproductions and require a bounded repair + pinned regression tests + a refreshed parser hash before freeze; neither invalidates the scorer, protocol chain, validators, or the mechanical gate results above.
