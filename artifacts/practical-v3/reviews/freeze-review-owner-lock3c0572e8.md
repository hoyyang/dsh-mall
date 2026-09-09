# Practical V3 Full-Lock Freeze Review — Owner Review (lock 3c0572e8)

- Reviewer role: owner review (parser/scorer semantic-ownership audit)
- Review date: 2026-09 (fast-closeout freeze gate)
- Reviewed lock: fast-closeout lock `3c0572e8284b2e3c417c1fada0c9e6b8554933c30033b0a2c05762ba889ad63b`
- Blindness: Round 5 (`blind/round-05.ndjson`, `round-07.ndjson`, `.round-05-review-batches/`) was NOT read. No locked file was modified; all probes were synthetic and written only under `/tmp`.
- Method: SHA-256 lock verification → full source read of all 14 locked files → mandated mechanical checks → 40+ synthetic adversarial probes against the parser, scorer, and semantic-ownership owner.

## 1. Hash verification (freeze lock)

13/14 files match the task-provided expected SHA-256 exactly:

| # | File | Result |
|---|------|--------|
| 1 | dsh-market-index/scripts/readme-signals.mjs | MATCH `38d93b81…b9ff5a` |
| 2 | dsh-market-index/scripts/readme-signals.test.mjs | MATCH `68234343…dd6e` |
| 3 | dsh-mall/src/score.ts | MATCH `26b2b1af…1c8e` |
| 4 | dsh-mall/lib/score.js | MATCH `e16f5629…3222` |
| 5 | dsh-mall/scripts/practical-v3-semantic-ownership.mjs | MATCH `188559c0…37ee` |
| 6 | dsh-mall/scripts/aggregate-practical-v3-oracle.mjs | MATCH `8ffa8c42…2f5` |
| 7 | dsh-mall/scripts/validate-practical-v3-oracle.mjs | MATCH `8a726d14…aafd` |
| 8 | dsh-mall/scripts/validate-practical-v3-review-batch.mjs | MATCH `cba91fda…66a8` |
| 9 | dsh-mall/scripts/practical-v3-evaluator.test.mjs | MATCH `60fe2b94…32ec` |
| 10 | dsh-mall/scripts/evaluate-practical-v3-round.mjs | MATCH `8cec44af…d491` |
| 11 | dsh-mall/scripts/practical-v3-metrics.mjs | **MISMATCH vs task list — see F-1** |
| 12 | dsh-mall/scripts/validate-practical-v3-consecutive.mjs | MATCH `be1c2a99…46be` |
| 13 | dsh-mall/scripts/build-practical-v3-arbitration-batches.mjs | MATCH `efdbab28…9e7c` |
| 14 | artifacts/practical-v3/practical-v3-evidence-oracle-rubric.md | MATCH `2d124059…3f99` |

### F-1 (Critical — lock-list mismatch, adjudication required before freeze)

- **File:** `dsh-mall/scripts/practical-v3-metrics.mjs`
- **Actual SHA-256:** `8a74562d942d45cb28f8702a657221eaf48686593b48a864bd08d3e864b4e3a6`
- **Task-list expected:** `8a74562d942d45cb28f8702a657221eaf48886593b48a864bd08d3e864b4e3a6`
- **Diff:** single hex character at position 35 (actual `6`, expected `8`).
- **Adjudication evidence:** the actual file hash matches the fingerprint recorded **twice** in the frozen checkpoint `docs/aegis/work/2026-08-27-practical-v3/20-checkpoint.md` ("Acceptance protocol fingerprints: … metrics `8a74562d942d45cb28f8702a657221eaf4868659…`" and the earlier superseded-chain line with the same value). The full practical suite (23/23) and the evaluator/consecutive fingerprint chain pass with this exact file. The balance of evidence indicates a one-character transcription error in the review task's expected-hash list, not file tampering.
- **Classification:** per the review mandate ("任何不匹配 = 直接 Critical") this is reported as **Critical** and blocks freeze until the coordinator confirms the authoritative expected value. If the coordinator confirms the checkpoint-recorded `…4868659…` as authoritative, F-1 downgrades to a documentation/transcription error and does not reflect a locked-byte change.

## 2. Mechanical checks (all pass)

| Check | Command | Result |
|---|---|---|
| Parser tests | `node --test scripts/readme-signals.test.mjs` (dsh-market-index) | **142/142 pass**, ~232ms |
| Mall practical suite | `npm run test:practical` (practical-score + integration + evaluator + snapshot) | **23/23 pass**, ~8.5s |
| Locked evaluator tests alone | `node --test scripts/practical-v3-evaluator.test.mjs` | 11/11 top-level pass |
| Typecheck | `npm run typecheck` (dsh-mall) | pass, zero errors |
| Blind-safety of tests | grep for `round-05`/`round-07`/`blind` in both locked test files | no references — running tests does not breach Round 5 blindness and does not modify the lock |

## 3. Scorer audit (src/score.ts ↔ lib/score.js)

- **Consistency:** the practical region of `lib/score.js` is a faithful build of `src/score.ts` — identical constants (`PRACTICAL_EVIDENCE_VERSION=3`, `PRACTICAL_PARSER_REVISION=2`, `PRACTICAL_SCORER_REVISION=4`, `PRACTICAL_CURVE_EXPONENT=0.9`) and identical `scorePracticalDimensions` credit formula (score.ts:78-140 ↔ score.js:46-99).
- **Cap-reachability (verified by execution):** full rubric-cap evidence (12/10/10/8/4/10/8/6/10) scores **exactly 100** with dimension totals exactly **25/25/20/15/15**. Every anchor equals the frozen rubric/parser cap, so cap-valid evidence retains marginal value (verified: 12→11 capability gives 98 < 100), and rubric-cap evidence is reachable — no unreachable or early-saturating anchor.
- **Determinism:** pure function of evidence counts; repeated calls byte-identical. No stars/distribution/identity/cohort input anywhere in the practical path. `confidence` describes evidence only and never multiplies the practical dimension score.
- **Fail-closed:** `scorePractical(null/undefined)` → null; `version:2` or `parserRevision:1` evidence → null (old cache entries cannot score); negative and NaN counts collapse to 0 via `practicalCount` (probed: capability −5 / media NaN → those dimensions contribute 0, remaining dimensions score correctly).

## 4. Protocol chain audit (validators / aggregator / evaluator / consecutive)

- `validate-practical-v3-oracle.mjs`: exact order per cohort, literal `source.includes(excerpt)` verbatim citation check (≤220 chars), per-family caps, media weights 0.5/1 and ≤6, per-review `evidenceOwnershipIssues`, scores recomputed from review evidence — reviewer-stored totals never trusted.
- `aggregate-practical-v3-oracle.mjs`: replays the pair validator into a temp dir and requires `isDeepStrictEqual` (minus `generatedAt`), fingerprint mismatches throw, arbitration restricted to the exact disagreement set with exact order, aggregation = count mean/median recomputed through the production scorer.
- `evaluate-practical-v3-round.mjs`: re-runs the locked parser over the cohort README, rejects `oracleEvidence` missing v3/revision 2 or exceeding caps, replaces reviewer `total` with recomputed `oracleTotal` (stored total kept only as `ratingTotal` diagnostic), gates fail closed on null (`practical-v3-metrics.mjs` `gateResult`).
- `validate-practical-v3-consecutive.mjs`: re-executes the evaluator for both reports and requires exact reproduction; checks cohort-hash inequality, repo-level zero overlap, and unchanged algorithm/protocol/oracle fingerprints.
- `practical-v3-semantic-ownership.mjs` is the single shared owner called by the immediate-batch validator, pair validator, and C aggregation; its hash is propagated through pair reports, ratings, evaluation, arbitration builder, and consecutive validation. No bypass path found where a consumer skips it.

### Ownership bypass probes (all defended)

NFKC full-width vs half-width, case/whitespace, Markdown bold/code wrap, Markdown-link unwrap, nested-link unwrap, whole-line-plus-contained-fragment (≥2 words) across families, reverse containment, same-family reformatted duplicates — all correctly flagged. Identifier semantics preserved as documented (`foo_bar` ≠ `foobar`); structural fields (usageActions etc.) legally overlap semantic fields. Two residual rubric-literal gaps are reported as Minor (F-4, F-5).

## 5. Parser semantic-ownership audit vs rubric

### Verified zero-contribution paths (probes, all zero across all nine families)

install+config sections/commands; `export API_KEY=…` config; marketing prose ("most powerful… endless possibilities"); roadmap phrasings "Planned: …" and "Coming soon: …" (zero); identity-only ("A fast, simple CLI tool for developers"); audience identity ("dashboard for everyone"); generic persona preference ("developers who want a beautiful, simple experience"); requirement bullets (Requires/Needs/Dependencies); pure release-channel distribution table (stable/beta distribution metadata); catalog/external-project entries. README length perturbation over a neutral appendix: evidence byte-identical. Irrelevant fence: code_examples delta 0.

### Verified positive-ownership behavior

- **io_pair same-example constraint (historical drift stays repaired):** `Input:` and `Output:` in separate sections → io_pairs 0; same block → 1; gap > 3 lines → 0 (window enforced at `IO_PAIR_WINDOW=3`, readme-signals.mjs:940-965).
- **capability→reliability migration (historical drift stays repaired):** "Supports CSV export validated against production traffic" → reliability 1, capability 0.
- **Persona semantics:** "Built for developers auditing security logs in production" → usecase 1; "Built for developers who want speed" → 0.
- **Fallback gates:** setup/config fallback claims rejected; 0.5 fallback weight unchanged; a rejected first claim does not suppress a later legal claim.
- **Determinism:** parser output byte-identical across repeated parses of the same document.

### F-2 (Important) — Roadmap phrasing "Will add/Will ship …" scores as capability

- **File:line:** `dsh-market-index/scripts/readme-signals.mjs` — `semanticContentEligible` (271-282) applies `PLANNED_MEDIA_RE` but not `CAPABILITY_MIGRATION_GUARD_RE` (381-397) or `fallbackPlannedContent` (284-287); the unguarded list items are claimed at full weight 1.0 by the capability main path `capabilityMain = claimAll([...sectionItems('capability'), …])` (1373-1377). The guard regex itself already contains `will (add|support|ship|land)` (line 395) — the exclusion intent exists but is only applied to capability *paragraphs* (716), migration lines (1431), and the documentation-escape path (1263), not to the capability list-item main path.
- **Severity:** Important. Rubric global rule 6: "roadmap … contribute zero." Also contradicts the recorded gate "Combined marketing/roadmap/requirements/CJK/table/usecase/action attacks produce zero in all nine evidence families" (checkpoint line 69) for the will-add phrasing family.
- **Repro (executed):**
  - `# Tool\n## Features\n- Will add mobile support` → `capability_items=1` (score ≈ +2.7)
  - `# Tool\n## Features\n- Will ship a web dashboard next quarter` → `capability_items=1`
  - Controls, all correctly zero: `- Planned: export to PDF`, `- Coming soon: dark mode`, `## Roadmap\n- Mobile support`.
- **Not a previously rejected/known candidate:** rejected candidates were broad capability migration v1, count-gated migration, broad META relaxation, and the soft-Why gate — none cover this path. Per protocol this blocks the zero-Important freeze gate until repaired or explicitly waived.

### F-3 (Important) — Usecase-section content counts with no positive semantic predicate (heading-qualifies-content farming)

- **File:line:** `dsh-market-index/scripts/readme-signals.mjs` — `sectionProse` (1283-1287) feeds `sectionProse('usecase')` into `usecaseUnits` (1370) filtered only by `semanticContentEligible` (negative filters only, no positive predicate); `usecaseTableRows` requires only length ≥ 8 (986-1005); list items under a usecase-kind heading are claimed via `sectionItems('usecase')` (1370), likewise without a positive predicate.
- **Severity:** Important. Rubric: a heading "can qualify **when its content states the context**" (rubric line 42) and rule 9 forbids inference; a 10-bullet junk list under `## Use cases` yields `usecase_items=10` → +20 score points, exactly the severe-FP boundary (error ≥ 20). The same filler under a neutral heading (`## Notes`) correctly yields 0, so the heading alone is doing the qualifying.
- **Repro (executed):**
  - `## Use cases` + 10 bullets "- Filler scenario bullet N with ordinary content." → `usecase_items=10`
  - `## Use cases` + one filler prose paragraph → `usecase_items=1`
  - identical filler under `## Notes` → 0.
  - Corollary: appending filler prose at document end broke strict length-perturbation invariance in my probe purely because the appended text landed in the `## Use cases` section — the same surface.
- **Real-corpus impact is bounded** (top-star READMEs' use-case sections usually contain genuine scenarios, and the recorded 500-project perturbation gates passed), but the rubric drift is mechanically reachable and farming-shaped. Per protocol this blocks the zero-Important freeze gate until repaired or explicitly waived.

### F-4 (Minor) — Single-word cross-family fragment passes the ownership owner

- **File:line:** `dsh-mall/scripts/practical-v3-semantic-ownership.mjs:65-69` (`substantiveContainmentSignature` requires ≥4 CJK chars or ≥2 words).
- **Repro:** capability `"Parses markdown tables and generates detailed reports"` + usecases `"reports"` → no issue raised, although the rubric rule-4 literal says cross-family excerpts "may not … contain one another". Documented bounded design (evidence.md: "exact or substantive containment overlap"); a one-word fragment is not itself a substantive claim and the review-batch verbatim/cap checks still apply. No amplification beyond one unit. Accept as residual risk or tighten later; not a regression.

### F-5 (Minor) — Word-reordered paraphrase duplicates pass the ownership owner

- **Repro:** capability `"Parses tables quickly"` + usecases `"Quickly parses tables"` → no issue (neither identical nor substring). Rubric rule 3 says reformatted claims count once; a deterministic substring validator cannot catch reordering. Inherent limitation of the deterministic-owner design (semantic equivalence would require an LLM, out of scope for the deterministic freeze); the reviewers' atomic-smallest-excerpt instruction mitigates. No action required for freeze; record as residual risk.

### Non-finding note

A single instruction bullet under `## Use cases` (e.g. "- Audit logs for security teams") counts once as `usecases` and once as `usageActions`. This is legal per rubric rule 5 (usageActions is structural evidence and may overlap a semantic claim) — recorded only because it surfaced while isolating F-3.

## 6. Uncovered items (honestly scoped,限时收尾)

以下内容本轮**未覆盖**，裁决仅基于上述已完成部分；不推断其结论：

1. **Round 5 / Round 7 内容**：按硬边界从未读取 `blind/round-05.ndjson`、`round-07.ndjson`、`.round-05-review-batches/` 正文；其 A/B 执行状态与结果不在本轮评审范围。
2. **全量 500/600 项目语料重放**：未重跑 500-project perturbation 与五 cohort 全量解析；仅以定向合成探针验证零贡献路径与漂移修复点。
3. **F-2 / F-3 的全语料影响面量化**：未在 500 个开发 README 上统计这两类形态的真实命中率（探针只证明可达性，未证明现网频率）。
4. **锁定测试文件全文逐行审计**：`readme-signals.test.mjs`（142 用例）与 `practical-v3-evaluator.test.mjs` 仅执行通过并抽查语义，未逐行审计每个用例的断言强度。
5. **`npm run build` 产物一致性**：仅静态比对 `lib/score.js` 与 `src/score.ts` 的 practical 区域；未执行完整 build 复核其余 lib 产物与 src 的同步。
6. **16-file lock 中未列入本轮清单的其余 2 个文件**：checkpoint 提到 16-file lock，本轮只核对任务给定的 14 个文件；差集 2 项未识别。
7. **JS 崩溃/DoS 角度的 fuzz**（超长行、深层嵌套 fence、 pathological regex 回溯）未系统执行，仅复用记录中的 4000 行 stress 结果佐证。
8. **GUI/registry 侧验证**：非本评审职责，未触碰。

## 7. Verdict

- Mechanical checks: all pass. Scorer contract (v3 / parser-revision 2 / scorer-revision 4 / exponent 0.9; cap evidence = exactly 100; dims 25/25/20/15/15; fail-closed; deterministic; no popularity/identity/length input): **confirmed**. Zero-contribution paths and the two repaired historical drifts (io_pair locality, capability→reliability migration): **confirmed repaired**. Protocol chain replay/fingerprint/fail-closed design: **confirmed**.
- Findings: 1 Critical (F-1 lock-list single-character mismatch; evidence points to a task-list transcription error — coordinator adjudication required), 2 Important (F-2 roadmap "will add" capability credit; F-3 usecase-heading content farming), 2 Minor (F-4, F-5 ownership-residual gaps).

**VERDICT CRITICAL=1 IMPORTANT=2 MINOR=2**
