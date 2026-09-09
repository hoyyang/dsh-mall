# Practical V3 — BARS Blind Review Rubric

This rubric is frozen before the Round 2 BARS review. Reviewers see the full README only. They must not inspect stars, rank, identity metadata, parser/scorer output, prior ratings, or evaluation artifacts.

## Global rules

- Score only README-visible, presently shipped behavior.
- Popularity, stars, downloads, project identity/category, README length, marketing, roadmap, sponsorship, changelog, duplicated claims, installation, and configuration contribute zero.
- A code fence is only evidence of an operation/output it concretely demonstrates; fence quantity itself contributes zero.
- Do not infer use cases from features. Do not infer reliability from implementation quality or reputation.
- Catalogs earn credit only for their own browse/search/curation/verification workflow, never the capabilities of linked projects.
- Choose only the anchored values below. No arbitrary intermediate integer is allowed.
- 90–100 should be exceptional: it requires near-top evidence in every dimension, not merely a long or polished README.

## Capability — choose 0, 5, 10, 15, 20, or 25

- **0**: no concrete shipped ability is stated.
- **5**: one narrow shipped function.
- **10**: a small coherent tool with roughly 2–3 distinct functions.
- **15**: several distinct functions forming a useful workflow.
- **20**: broad end-to-end capability across multiple workflow stages.
- **25**: unusually comprehensive shipped system with many distinct, concrete abilities and clear boundaries. A long feature list alone is insufficient.

## Actionable usage — choose 0, 5, 10, 15, 20, or 25

Installation/configuration alone is always 0.

- **0**: no non-install operational instruction, command, or interaction.
- **5**: one partial operation or command, insufficient for a complete happy path.
- **10**: one complete basic happy path can be followed.
- **15**: multiple common operations or one end-to-end workflow with meaningful choices.
- **20**: broad operational guidance covering alternatives, inputs/outputs, or several workflows.
- **25**: comprehensive operational reference plus advanced/recovery workflows. Command count alone is insufficient.

## Explicit use cases — choose 0, 5, 10, 15, or 20

A feature is not a use case. The README must explicitly state a scenario, case study, task, persona, or when-to-use condition.

- **0**: none; only features or generic benefits.
- **5**: one explicit but brief scenario.
- **10**: 2–3 explicit distinct scenarios or one worked case.
- **15**: several explicit scenarios with concrete task context or a detailed case study.
- **20**: multiple detailed case studies/scenarios with stated goals and outcomes. Generic “best for” lists cannot reach 20.

## Outputs and demonstrations — choose 0, 3, 6, 9, 12, or 15

Badges, logos, decorative images, roadmap previews, and duplicate captions do not count.

- **0**: no visible or concrete output/result.
- **3**: one textual output claim or weak external-only demonstration.
- **6**: one concrete output example or one meaningful screenshot/GIF.
- **9**: multiple concrete outputs or demonstrations showing distinct states.
- **12**: rich real outputs/artifacts/results across multiple workflows.
- **15**: unusually complete, verifiable demonstrations including representative inputs, outputs, and outcomes. Screenshot quantity alone is insufficient.

## Reliability evidence — choose 0, 3, 6, 9, 12, or 15

Do not infer reliability from professional prose, architecture, popularity, or open-source status.

- **0**: no compatibility, limitation, test, troubleshooting, security, validation, or failure-behavior evidence.
- **3**: one isolated constraint, compatibility note, or test claim.
- **6**: multiple concrete limits/compatibility/test facts.
- **9**: useful coverage across at least two reliability families (for example limits + tests, or compatibility + troubleshooting).
- **12**: broad evidence across at least three families, with concrete validation or failure behavior.
- **15**: exceptional coverage including validation/tests, limitations/compatibility, and troubleshooting/recovery/security/failure handling. A FAQ alone cannot reach 15.

## Required review output

For every project: repository, inferred type, five anchored subscores, exact total, confidence, concise positive evidence, and concise concern. The total must equal the five subscores.