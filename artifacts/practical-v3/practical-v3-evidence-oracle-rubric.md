# Practical V3 — Evidence Oracle Rubric

This rubric was established before the Round 2 evidence-oracle review. Before final fresh acceptance, its existing one-claim/one-family rule was mechanically clarified to require atomic, non-containing cross-family excerpts after historical development reviews proved that whole-line plus fragment citations bypassed exact-string validation. It measures whether the deterministic parser recovers README-visible evidence; it does not ask reviewers to invent a 0–100 score.

Reviewers may read only:
- this rubric;
- the assigned repository names;
- the corresponding full README text in the frozen blind cohort.

Reviewers must not inspect stars, rank, project metadata, parser/scorer output, earlier ratings, evaluation reports, or another reviewer’s annotations.

## Global evidence rules

1. Record only presently shipped behavior explicitly visible in the README.
2. Every unit must contain a short, exact excerpt from the README (optionally prefixed by its exact heading). Paraphrases are invalid.
3. Units must be semantically distinct. Repeated, translated, reformatted, or caption-duplicated claims count once.
4. Across `capability`, `usageItems`, `usecases`, `outputs`, and `reliability`, one substantive claim belongs to the single most specific family. Do not duplicate it across these five arrays. Semantic excerpts must be atomic: after case/whitespace/Markdown-wrapper normalization, excerpts in different semantic families may not be identical or contain one another. If one README line states multiple claims, cite the smallest distinct exact substring for each owner rather than reusing the whole line plus a fragment.
5. `usageActions`, `ioPairs`, `codeExamples`, and `media` are structural evidence and may overlap a semantic claim, matching the production contract.
6. Installation, configuration, popularity, stars, downloads, identity/category, README length, marketing, roadmap, changelog, sponsorship, badges, and duplicated text contribute zero.
7. A catalog/list receives evidence only for its own discovery, search, filtering, curation, submission, validation, and maintenance behavior. Linked projects’ capabilities, commands, screenshots, and reliability never belong to the catalog.
8. A code fence is not practical evidence merely because it exists. Only a distinct non-install/non-config operational example under an operational context can enter `codeExamples`.
9. If evidence is ambiguous, omit it and state the ambiguity in `concerns`.

## Evidence families and caps

### `capability` — up to 12 units
A distinct, concrete, shipped ability of the current project. Exclude generic benefits, architecture facts without user-visible behavior, linked-project abilities, plans, install/config, and claims already assigned to a more specific semantic family.

### `usageItems` — up to 10 units
A distinct non-install, non-config instruction that lets a user operate the project: an operational step, command purpose, interaction, or workflow instruction. A feature description is not usage.

### `usageActions` — up to 10 units
An explicit action-shaped step or command under operational guidance: numbered imperative, direct user action, slash/CLI command, or command-reference row. Install/config actions are excluded. This structural array may overlap `usageItems`.

### `ioPairs` — up to 8 units
An explicit paired input/request and output/response in the same operational example. Record one exact string containing both sides, such as `Input: ... | Output: ...`. Do not infer missing sides.

### `codeExamples` — up to 4 units
A distinct runnable non-install/non-config command/code example used to operate the project. Record the fence’s first meaningful line plus its heading. Multiple fences showing the same operation count once.

### `usecases` — up to 10 units
A distinct scenario, persona, task context, case study, or explicit when-to-use statement. Do not infer a use case from a feature list or generic benefit. A heading such as `场景一`, `Use case`, or a worked task can qualify when its content states the context.

### `outputs` — up to 8 units
A distinct concrete result, artifact, response, report, rendered state, or measured outcome described in text. Do not count a screenshot caption again when the screenshot represents the same output. Preview/roadmap promises do not qualify.

### `media` — weighted total capped at 6
A meaningful, non-badge image/GIF/video demonstrating the current project. Record each as `{ "excerpt": "exact image/video markup or unique caption", "weight": 1 }` for local/repository-hosted media, or weight `0.5` for externally hosted media. Logos, badges, decorative art, duplicated views, and linked-project media are excluded.

### `reliability` — up to 10 units
A distinct concrete fact about compatibility, current limitation, known issue, troubleshooting/recovery, tests/verification, validation, security boundary, failure behavior, or operational constraint. Do not infer reliability from polish, architecture, reputation, or open-source status. Requirements that are only installation prerequisites do not qualify unless they state a runtime compatibility boundary.

## Required output per repository

Return these fields exactly:
- `repo`
- `inferredType`: one of `dsh-plugin`, `standalone-nonplugin`, `catalog-list`, `unclear` (diagnostic only; never affects score)
- arrays: `capability`, `usageItems`, `usageActions`, `ioPairs`, `codeExamples`, `usecases`, `outputs`, `reliability`
- `media`: array of `{ excerpt, weight }`, weight only `0.5` or `1`
- `concerns`: short array describing omissions/ambiguities

Every evidence string must be an exact README excerpt no longer than 220 characters. Empty arrays are valid and preferred over inference.