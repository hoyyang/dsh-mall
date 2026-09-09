# Repair Round 2 full-lock 评审 — owner（lock-repair-2）

日期：2026-09-09。评审员：owner full-lock（正式验收门）。输入：lock-repair-2 哈希核对 + 修复轮 1/2 两份报告 + 机械重放 + /tmp 行为探针。

## 结论

**VERDICT: CRITICAL=1, IMPORTANT=3, MINOR=2。不予通过（fix ① 的文档声明行为与实际不符）。**

## 第 1 步：哈希核对 — 全部一致

- parser 24138f149ea4… / parser-tests 99b6c7b5a13a… / scorer-src 141550aefdb7… / runtime-scorer 77a1a9f910b5… 与 repair-round-2.md 记录一致。
- 其余 11 个传播文件与 repair-round-1.md 锁记录逐一一致（ownership 188559c0 / aggregator ff6fe614 / oracle-validator 341696d7 / review-batch cba91fda / evaluator-test 752abb1c / evaluator f6fe1b78 / metrics 8a74562d / consecutive be1c2a99 / arbitration efdbab28 / perturbations d5a6f8a8 / rubric 2d124059）。score.ts 与 lib/score.js 与轮 1 相同 → 评分器零改动成立。

## 第 3 步：机械重放 — 全部通过

- dsh-market-index readme-signals：**155/155**（tests 155 / pass 155 / fail 0）
- dsh-mall test:practical：**23/23**；validate-practical-v3-perturbations：**pass: true**

## 逐项核对（五项修复）

| # | 修复 | 实现 | 判定 |
|---|------|------|------|
| ① | fallbackPlannedContent 重设计 | :328-337 will+动词/coming soon/planned to·for/proposed to/TODO·待办/CJK 计划·即将·将来·日后·未来版本；裸 ^planned 前缀已移除 | ⚠️ 函数本身正确，但同名误杀经 PLANNED_MEDIA_RE 在主路径存续（C1）；且 preamble 路径未覆盖（I1） |
| ② | 主观赞美三族零贡献 | :268 词表 + :1326-1329 三族门 | ⚠️ reliability/usecase 生效；output 家族不经过 sectionItems，门为死分支（I3） |
| ③ | 身份尾缀数字归一 | :244 尾缀裸数字归一后过门 | ✅ 探针 P7：Built for professionals 2.1 / Designed for developers 7 → usecase 0 |
| ④ | CJK 解决方案后缀 | :177 后缀表含 解决方案/方案/工具/产品/平台/系统/功能/模块 | ⚠️ 直接复合（面向企业管理解决方案的用户）生效=0；后缀不紧邻名词时逃逸（M1） |
| ⑤ | 人士 入身份名词表 | :153 CJK 名词表含 人士(?!级) | ⚠️ 关闭「面向人士…」缺口，但引入域限定 人士 新绕过（I2） |

既有 150 测试无回归（155 = 142 + 8 轮1 + 5 轮2）。

## 发现

### C1（Critical）：fix ① 的声明目标未达成 — 裸 planned 特性名误杀经 PLANNED_MEDIA_RE 存续
repair-round-2.md 明确声明「移除裸 ^planned 前缀（『Planned report scheduler』等特性名不再误杀）」。探针实证（## Features 下同形 bullet 仅一词之差）：
- Nightly report scheduler for batch jobs → capability **1**（钉死测试恰好用此词，通过）
- Planned report scheduler for batch jobs → capability **0**
- Proposed / Future report scheduler … → **0**；甚至 PlannedGiving report scheduler …（无空格、无 planned to/for）→ **0**

根因：PLANNED_MEDIA_RE（readme-signals.mjs:421）为裸子串 /planned|proposed|future|coming soon|…/i，经 semanticContentEligible（:324）作用于主路径全部 sectionItems/散文。fix ① 只改了 fallbackPlannedContent，主路径的裸 planned 误杀原样保留，文档声明为假；钉死 M-2 边界测试改用「Nightly」恰好绕开了该断言。该误杀与四评审否决的原向量同类（真实特性名零贡献）。

### I1（Important）：fix ① 传播缺口 — preamble 路径 roadmap bullet 照常计分
preambleBullets（:1536-1541）只过 REQUIREMENT_BULLET_RE 与 IDENTITY_ONLY_RE，既不过 semanticContentEligible 也不过 fallbackPlannedContent。探针：# Demo + 三个 preamble bullet（We will build mobile support / TODO: oauth integration / Will ship a new dashboard）→ capability_items=**3**。文档首屏（首个标题前）的未来交付承诺 bullet 直接刷 capability 家族。

### I2（Important）：fix ⑤ 引入新绕过 — 域限定「X人士」纯身份 bullet 计 usecase 分
探针：## 使用场景 下 适合商务人士 / 适合法律人士 / 适合金融人士 → usecase_items=**3**；英文平行用例 Built for business professionals / legal professionals → **0**（GENERIC_PERSONA_ONLY_RE 前缀白名单覆盖）。根因：concreteCjkPersona 的泛化限定词白名单（:163 安全/工程/开发/产品/研究/维护/审查/响应/技术/业务/企业级/个人/专业）不含商务/法律/金融/医疗等域限定词，suffix 表（:177）也不含「人士」（名词被正则捕获组消耗，q 只剩「商务」）。与轮 1 修复 F2 的「纯身份限定词零分」不变量直接冲突，且构成「适合{X}人士」 farming 向量（每变体 1 claim，上限 10）。

### I3（Important）：fix ② 传播缺口 — output 家族主观赞美零门
三族门（:1326-1329）写明含 output，但 output 家族证据从不经过 sectionItems（hardOutputValues :1468-1481 结构化行只过 semanticContentEligible+fallbackPlannedContent；soft output :1523-1533 完全无内容门），kind !== 'output' 分支为死代码。探针：## 运行结果 下 The output feels smooth and polished. → output_items=**1**（权重 1）；## Results 同类 → **2**（0.5×2）。钉死测试只覆盖 usecase+reliability，漏掉 output。主观赞美刷 output 上限（8）的灌水向量原样可行。

### M1（Minor）：fix ④ 后缀门仅在「后缀紧邻名词」时触发
「适合数据工具的用户」→ q=「数据工具的」（以 的 结尾，不入后缀表，亦无任务线索）→ usecase_items=**1**。后缀表命中依赖捕获组在名词前恰好以列出的后缀词结尾；「{域}+工具/方案+的+用户」族全部逃逸。与 I2 同根（CJK 身份门白名单式判别覆盖不全），建议合并修复。

### M2（Minor）：文档与代码不一致 — 主观词表词数
repair-round-2.md 称「35 词表」；SUBJECTIVE_QUALITY_RE（:268）实为 **32** 词（smooth…endless 逐一清点）。不影响行为，但验收文档失实。

## 修复方向建议（供下一轮参考，非验收条件）
1. C1：把裸 planned/proposed/future 的排除从「任意位置子串」收敛为与 fallbackPlannedContent 相同的「未来交付承诺」语义（planned to/for、proposed to、coming soon、will+动词、TODO、CJK 计划词族），并补「Planned report scheduler 必须计分」的钉死测试（用 planned 原词，而非 Nightly 替词）。
2. I1：preambleBullets 补 semanticContentEligible + fallbackPlannedContent 门。
3. I2/M1：concreteCjkPersona 对「{域}人士」与「{域}+工具/方案/产品/平台/系统/功能/模块(+的)?+用户」在无 CJK_CONCRETE_TASK_CUE_RE 任务线索时一律判非具体人设。
4. I3：把主观门下沉到 hardOutputValues 结构化行与 soft output 路径（或统一改从语义事实集合取 output 证据），并补 output 家族钉死测试。

## 未覆盖项（限时收尾，如实声明）
- 本评审为 owner 视角；adversarial 视角（绕过构造的系统化穷举）不在本轮覆盖范围。
- 五项修复仅核对其声明作用域及探针可达路径；fallback 家族（fallbackSemanticContentEligible）与 usage/code/io/media 通道未逐一探针。
- PLANNED_MEDIA_RE 误杀的全部词表成员（concept/mockup/wireframe/roadmap/计划 等）未逐一实测，仅验证 planned/proposed/future/PlannedGiving。
- blind/round-05、round-07、.round-*-review-batches 正文按边界未读，评审独立性以此为准。

## 边界遵守
未读 blind/round-05、round-07、.round-*-review-batches 正文；除本报告与 /tmp 探针（/tmp/repair2-probe.mjs、/tmp/repair2-probe2.mjs）外未写任何文件；未 git/publish/网络。探针均为只读调用 practicalEvidence 纯函数。
