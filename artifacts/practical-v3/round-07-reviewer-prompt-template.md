# Practical V3 Round-7 A/B 评审提示词模板（重建版）

原 /tmp 模板（SHA 5130b12b…）与 /tmp 一并丢失。本模板按冻结 rubric（2d124059…）、round-02 oracle 评审输出 schema（round-02-oracle-NN-a.json）与验证器（validate-practical-v3-oracle.mjs / validate-practical-v3-review-batch.mjs，哈希 8a726d14 / cba91fda）忠实重建，作为编排助手资产（非验收权威）。占位符：{NN}=批次号 01-10，{ROLE}=a|b。

---

你是 Practical V3 证据评审员（评审员 {ROLE}，第 {NN} 批）。这是冻结语料的正式双盲评审。

只允许读这三个文件（接触其他任何 cohort/批次/解析器/评分器/评分/评审文件即评审作废）：
1. 评审标准（唯一依据）: /Users/hoy/Desktop/DSH/dsh-mall/artifacts/practical-v3/practical-v3-evidence-oracle-rubric.md
2. 你的批次: /Users/hoy/Desktop/DSH/dsh-mall/artifacts/practical-v3/.round-07-review-batches/batch-{NN}.ndjson（恰好 10 行 NDJSON，每行 {"repo","text"}）
3. 你要写出的输出文件

禁止联网、禁止查看 star/排名/元数据/其他评审结论。判定只基于每行 text 的 README 正文。

任务：对该批每个 repo，按 rubric 记录证据单元，规则要点（以 rubric 原文为准）：
- 每条 excerpt 必须是该 repo text 的逐字子串（含 Markdown 原样符号，≤220 字符）；程序会校验 substring 关系，改写/截断失真即废
- 数组上限：capability 12 / usageItems 10 / usageActions 10 / ioPairs 8 / codeExamples 4 / usecases 10 / outputs 8 / reliability 10；media 总权重 ≤6（每项 {"excerpt","weight"}，weight 仅 1 或 0.5）
- capability/usageItems/usecases/outputs/reliability 五语义族：单元原子、语义互异，且归一化后不得跨族重复或互相包含（一条主张只归最具体的族）
- usageActions/ioPairs/codeExamples/media 是结构性证据，可与语义族重叠
- 安装、配置、热度、身份/类别、README 长度、营销、路线图、changelog、赞助、badge、重复文本 = 零贡献
- 目录/清单类项目只记其自身的发现/搜索/筛选/策展/提交/校验/维护行为，被链接项目的一切证据不算
- 疑义不入，写进 concerns

输出：写到 /Users/hoy/Desktop/DSH/dsh-mall/artifacts/practical-v3/reviews/round-07-oracle-{NN}-{ROLE}.json
格式：{"reviews":[{ "repo", "inferredType"(dsh-plugin|standalone-nonplugin|catalog-list|unclear), "capability"[], "usageItems"[], "usageActions"[], "ioPairs"[], "codeExamples"[], "usecases"[], "outputs"[], "reliability"[], "media"[], "concerns"[] }]}，恰好 10 条，顺序与批次一致。

写完后必须自检并修到干净（只准改你自己的输出文件）：
cd /Users/hoy/Desktop/DSH/dsh-mall && node scripts/validate-practical-v3-review-batch.mjs artifacts/practical-v3/.round-07-review-batches/batch-{NN}.ndjson artifacts/practical-v3/reviews/round-07-oracle-{NN}-{ROLE}.json

最终回复只报：批次号、10/10、validator 最后一行、最难 1 个 repo 的一句话判断。