#!/usr/bin/env node

/**
 * Deterministic Practical V3 scorer search.
 *
 * The evidence oracle owns evidence counts, not scores. Every candidate curve
 * therefore rescales both parser evidence and oracle evidence before metrics
 * are computed. Dimension maxima and family point allocations stay fixed;
 * only one shared concave-or-linear exponent varies. Every family anchor equals its
 * frozen rubric/parser cap, so every valid evidence unit retains marginal value.
 */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fairnessMetrics, fractionalTopKRecall } from './practical-v3-metrics.mjs'

const ROOT = path.resolve(import.meta.dirname, '..')
const evaluationPath = path.resolve(process.argv[2] ?? path.join(ROOT, 'artifacts/practical-v3/round-02-oracle-evaluation-iteration-18.json'))
const outputPath = path.resolve(process.argv[3] ?? path.join(ROOT, 'artifacts/practical-v3/practical-v3-scorer-search.json'))

const EXPONENTS = [0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1]
const EVIDENCE_CAPS = {
  capabilityItems: 12,
  usageItems: 10,
  usageActions: 10,
  ioPairs: 8,
  codeExamples: 4,
  usecaseItems: 10,
  outputItems: 8,
  media: 6,
  reliabilityItems: 10,
}
const FULL_EVIDENCE = { version: 3, parserRevision: 3, ...EVIDENCE_CAPS, confidence: { overall: 1, coverage: 1, fallbackShare: 0 } }
const FOLD_COUNT = 5
const TOP_LIMIT = 20

function practicalCount(value) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0
}

function dimensions(evidence, config) {
  const credit = (count, anchor, points) => points * Math.min(1, Math.pow(practicalCount(count) / anchor, config.exponent))
  return {
    capability: credit(evidence.capabilityItems, config.anchors.capabilityItems, 25),
    usage: Math.min(25,
      credit(evidence.usageItems, config.anchors.usageItems, 8)
      + credit(evidence.usageActions, config.anchors.usageActions, 8)
      + credit(evidence.ioPairs, config.anchors.ioPairs, 4)
      + credit(evidence.codeExamples, config.anchors.codeExamples, 5)),
    usecases: credit(evidence.usecaseItems, config.anchors.usecaseItems, 20),
    demo: Math.min(15,
      credit(evidence.outputItems, config.anchors.outputItems, 6)
      + credit(evidence.media, config.anchors.media, 9)),
    reliability: credit(evidence.reliabilityItems, config.anchors.reliabilityItems, 15),
  }
}

function candidateConfig(exponent) {
  return {
    exponent,
    anchors: { ...EVIDENCE_CAPS },
  }
}

function score(evidence, config) {
  return Math.round(Object.values(dimensions(evidence, config)).reduce((sum, value) => sum + value, 0))
}

function mean(values) {
  return values.length === 0 ? null : values.reduce((sum, value) => sum + value, 0) / values.length
}

function ranks(values) {
  const sorted = values.map((value, index) => ({ value, index })).sort((left, right) => left.value - right.value)
  const output = Array(values.length)
  for (let index = 0; index < sorted.length;) {
    let end = index + 1
    while (end < sorted.length && sorted[end].value === sorted[index].value) end++
    const rank = (index + end - 1) / 2 + 1
    for (let cursor = index; cursor < end; cursor++) output[sorted[cursor].index] = rank
    index = end
  }
  return output
}

function pearson(left, right) {
  const lm = mean(left), rm = mean(right)
  let numerator = 0, ls = 0, rs = 0
  for (let index = 0; index < left.length; index++) {
    numerator += (left[index] - lm) * (right[index] - rm)
    ls += (left[index] - lm) ** 2
    rs += (right[index] - rm) ** 2
  }
  return ls === 0 || rs === 0 ? 0 : numerator / Math.sqrt(ls * rs)
}

function spearman(left, right) {
  return pearson(ranks(left), ranks(right))
}

function round(value, digits = 4) {
  return Number(value.toFixed(digits))
}

function metrics(sourceRows, config) {
  const rows = sourceRows.map((row) => {
    const machine = score(row.evidence, config)
    const oracle = score(row.human.oracleEvidence, config)
    return { repo: row.repo, type: row.type, language: row.language, machine, oracle, error: machine - oracle }
  })
  const quarter = Math.ceil(rows.length / 4)
  const fairness = fairnessMetrics(rows)
  return {
    count: rows.length,
    spearman: spearman(rows.map((row) => row.machine), rows.map((row) => row.oracle)),
    topQuartileRecall: fractionalTopKRecall(rows.map((row) => row.machine), rows.map((row) => row.oracle), quarter),
    severeFalseNegativeRate: rows.filter((row) => row.error <= -25).length / rows.length,
    severeFalsePositiveRate: rows.filter((row) => row.error >= 20).length / rows.length,
    within20Share: rows.filter((row) => Math.abs(row.error) <= 20).length / rows.length,
    meanError: mean(rows.map((row) => row.error)),
    meanAbsoluteError: mean(rows.map((row) => Math.abs(row.error))),
    maximumStratumSevereRate: fairness.maximumStratumSevereRate,
    languageMeanResidualGap: fairness.languageMeanResidualGap,
    byType: fairness.byType,
    byLanguage: fairness.byLanguage,
    byTypeLanguage: fairness.byTypeLanguage,
  }
}

function gateSummary(value) {
  const gates = {
    spearman: value.spearman >= 0.75,
    topQuartileRecall: value.topQuartileRecall >= 0.8,
    severeFalseNegativeRate: value.severeFalseNegativeRate <= 0.05,
    severeFalsePositiveRate: value.severeFalsePositiveRate <= 0.05,
    within20Share: value.within20Share >= 0.8,
    stratumSevereRate: value.maximumStratumSevereRate <= 0.1,
    languageResidualGap: value.languageMeanResidualGap <= 5,
  }
  return { passCount: Object.values(gates).filter(Boolean).length, pass: Object.values(gates).every(Boolean), gates }
}

function deficit(value) {
  return Math.max(0, 0.75 - value.spearman) / 0.75
    + Math.max(0, 0.8 - value.topQuartileRecall) / 0.8
    + Math.max(0, value.severeFalseNegativeRate - 0.05) / 0.05
    + Math.max(0, value.severeFalsePositiveRate - 0.05) / 0.05
    + Math.max(0, 0.8 - value.within20Share) / 0.8
    + Math.max(0, value.maximumStratumSevereRate - 0.1) / 0.1
    + Math.max(0, value.languageMeanResidualGap - 5) / 5
}

function candidate(config, value) {
  const gate = gateSummary(value)
  return { config, metrics: value, ...gate, deficit: deficit(value) }
}

function compare(left, right) {
  return right.passCount - left.passCount
    || left.deficit - right.deficit
    || right.metrics.spearman - left.metrics.spearman
    || right.metrics.topQuartileRecall - left.metrics.topQuartileRecall
    || right.metrics.within20Share - left.metrics.within20Share
    || left.metrics.meanAbsoluteError - right.metrics.meanAbsoluteError
}

function stableHash(value) {
  let hash = 2166136261
  for (const char of value) {
    hash ^= char.codePointAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function roundedMetrics(value) {
  return {
    ...value,
    spearman: round(value.spearman),
    topQuartileRecall: round(value.topQuartileRecall),
    severeFalseNegativeRate: round(value.severeFalseNegativeRate),
    severeFalsePositiveRate: round(value.severeFalsePositiveRate),
    within20Share: round(value.within20Share),
    meanError: round(value.meanError),
    meanAbsoluteError: round(value.meanAbsoluteError),
    maximumStratumSevereRate: round(value.maximumStratumSevereRate),
    languageMeanResidualGap: round(value.languageMeanResidualGap),
    byType: value.byType,
    byLanguage: value.byLanguage,
    byTypeLanguage: value.byTypeLanguage,
  }
}

const evaluation = JSON.parse(fs.readFileSync(evaluationPath, 'utf8'))
const rows = evaluation.rows
if (!Array.isArray(rows) || rows.length < 100) throw new Error(`Expected 100+ evaluation rows, got ${rows?.length ?? 0}`)
for (const row of rows) {
  if (!row.evidence || !row.human?.oracleEvidence || typeof row.language !== 'string') throw new Error(`Missing machine/oracle evidence or language stratum for ${row.repo}`)
}

const folds = Array.from({ length: FOLD_COUNT }, (_, fold) => ({
  fold,
  train: rows.filter((row) => stableHash(row.repo.toLowerCase()) % FOLD_COUNT !== fold),
  holdout: rows.filter((row) => stableHash(row.repo.toLowerCase()) % FOLD_COUNT === fold),
  best: null,
}))
const fullTop = []
const leaders = {
  highestTopQuartileRecall: null,
  highestSpearman: null,
  lowestSevereFalseNegativeRate: null,
  lowestMeanAbsoluteError: null,
  bestTopQuartileWithOtherCoreGates: null,
}
let candidatesEvaluated = 0

for (const exponent of EXPONENTS) {
    const config = candidateConfig(exponent)
    if (score(FULL_EVIDENCE, config) !== 100) throw new Error(`Invalid unreachable-full-score candidate: ${JSON.stringify(config)}`)
    const full = candidate(config, metrics(rows, config))
    fullTop.push(full)
    fullTop.sort(compare)
    if (fullTop.length > TOP_LIMIT) fullTop.length = TOP_LIMIT
    if (leaders.highestTopQuartileRecall === null
      || full.metrics.topQuartileRecall > leaders.highestTopQuartileRecall.metrics.topQuartileRecall
      || (full.metrics.topQuartileRecall === leaders.highestTopQuartileRecall.metrics.topQuartileRecall && compare(full, leaders.highestTopQuartileRecall) < 0)) leaders.highestTopQuartileRecall = full
    if (leaders.highestSpearman === null || full.metrics.spearman > leaders.highestSpearman.metrics.spearman) leaders.highestSpearman = full
    if (leaders.lowestSevereFalseNegativeRate === null
      || full.metrics.severeFalseNegativeRate < leaders.lowestSevereFalseNegativeRate.metrics.severeFalseNegativeRate
      || (full.metrics.severeFalseNegativeRate === leaders.lowestSevereFalseNegativeRate.metrics.severeFalseNegativeRate && compare(full, leaders.lowestSevereFalseNegativeRate) < 0)) leaders.lowestSevereFalseNegativeRate = full
    if (leaders.lowestMeanAbsoluteError === null || full.metrics.meanAbsoluteError < leaders.lowestMeanAbsoluteError.metrics.meanAbsoluteError) leaders.lowestMeanAbsoluteError = full
    const otherCoreGates = full.metrics.spearman >= 0.75
      && full.metrics.severeFalseNegativeRate <= 0.05
      && full.metrics.severeFalsePositiveRate <= 0.05
      && full.metrics.within20Share >= 0.8
      && full.metrics.maximumStratumSevereRate <= 0.1
      && full.metrics.languageMeanResidualGap <= 5
    if (otherCoreGates && (leaders.bestTopQuartileWithOtherCoreGates === null
      || full.metrics.topQuartileRecall > leaders.bestTopQuartileWithOtherCoreGates.metrics.topQuartileRecall
      || (full.metrics.topQuartileRecall === leaders.bestTopQuartileWithOtherCoreGates.metrics.topQuartileRecall && compare(full, leaders.bestTopQuartileWithOtherCoreGates) < 0))) leaders.bestTopQuartileWithOtherCoreGates = full
    for (const fold of folds) {
      const train = candidate(config, metrics(fold.train, config))
      if (fold.best === null || compare(train, fold.best.train) < 0) fold.best = { config, train }
    }
    candidatesEvaluated++
}

const currentConfig = candidateConfig(0.9)
const currentMetrics = metrics(rows, currentConfig)
const report = {
  generatedAt: new Date().toISOString(),
  evaluationPath,
  invariant: 'Popularity, identity, README length, installation and target score distribution are absent. Every evidence-family anchor equals its frozen rubric/parser cap, preserving marginal value through the full 0–100 scale.',
  searchSpace: { exponents: EXPONENTS, anchors: EVIDENCE_CAPS, candidatesEvaluated },
  current: {
    config: currentConfig,
    selection: 'Exponent 0.9: median of five all-gate fixed-fold selections and the full-development-set overall leader within the strict cap-equal family; tied modal choices are 0.9 and 0.95.',
    fullScoreAtRubricCaps: score(FULL_EVIDENCE, currentConfig),
    rawMetrics: currentMetrics,
    metrics: roundedMetrics(currentMetrics),
  },
  top: fullTop.map((item) => ({ ...item, deficit: round(item.deficit), metrics: roundedMetrics(item.metrics) })),
  leaders: Object.fromEntries(Object.entries(leaders).map(([name, item]) => [name, item === null ? null : { ...item, deficit: round(item.deficit), metrics: roundedMetrics(item.metrics) }])),
  crossValidation: folds.map((fold) => {
    const holdout = metrics(fold.holdout, fold.best.config)
    return {
      fold: fold.fold,
      trainCount: fold.train.length,
      holdoutCount: fold.holdout.length,
      selectedConfig: fold.best.config,
      train: { ...fold.best.train, deficit: round(fold.best.train.deficit), metrics: roundedMetrics(fold.best.train.metrics) },
      holdout: { ...gateSummary(holdout), deficit: round(deficit(holdout)), metrics: roundedMetrics(holdout) },
    }
  }),
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, JSON.stringify(report, null, 2) + '\n')
console.log(JSON.stringify({
  outputPath,
  candidatesEvaluated,
  current: report.current,
  best: report.top[0],
  leaders: report.leaders,
  crossValidation: report.crossValidation.map(({ fold, holdoutCount, selectedConfig, holdout }) => ({ fold, holdoutCount, selectedConfig, holdout })),
}, null, 2))
