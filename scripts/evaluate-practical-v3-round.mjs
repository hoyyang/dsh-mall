#!/usr/bin/env node

/** Evaluate one Practical V3 blind-review cohort without mutating the snapshot. */

import fs from 'node:fs'
import crypto from 'node:crypto'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { execFileSync } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { isDeepStrictEqual } from 'node:util'
import { scorePractical, scorePracticalDimensions } from '../lib/score.js'
import { fairnessMetrics, fractionalTopKRecall, gateResult } from './practical-v3-metrics.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const EVALUATOR_PATH = fileURLToPath(import.meta.url)
const METRICS_PATH = path.join(ROOT, 'scripts/practical-v3-metrics.mjs')
const CONSECUTIVE_PATH = path.join(ROOT, 'scripts/validate-practical-v3-consecutive.mjs')
const AGGREGATOR_PATH = path.join(ROOT, 'scripts/aggregate-practical-v3-oracle.mjs')
const PAIR_VALIDATOR_PATH = path.join(ROOT, 'scripts/validate-practical-v3-oracle.mjs')
const SEMANTIC_OWNERSHIP_PATH = path.join(ROOT, 'scripts/practical-v3-semantic-ownership.mjs')
const RUBRIC_PATH = path.join(ROOT, 'artifacts/practical-v3/practical-v3-evidence-oracle-rubric.md')
const INDEX_PARSER = path.resolve(process.env.DSH_MARKET_INDEX_PARSER ?? path.join(ROOT, '../dsh-market-index/scripts/readme-signals.mjs'))
const cohortPath = path.resolve(process.argv[2] ?? path.join(ROOT, 'artifacts/practical-v3/blind/round-01.ndjson'))
const ratingsPath = path.resolve(process.argv[3] ?? path.join(ROOT, 'artifacts/practical-v3/round-01-blind-ratings.json'))
const outputPath = path.resolve(process.argv[4] ?? path.join(ROOT, 'artifacts/practical-v3/round-01-evaluation.json'))

const { practicalEvidence, README_PRACTICAL_PARSER_REVISION, README_PRACTICAL_VERSION } = await import(pathToFileURL(INDEX_PARSER))
if (README_PRACTICAL_VERSION !== 3 || README_PRACTICAL_PARSER_REVISION !== 3) {
  throw new Error(`Expected Practical V3 parser revision 3, got v${README_PRACTICAL_VERSION}/r${README_PRACTICAL_PARSER_REVISION}`)
}

function ndjson(file) {
  const text = fs.readFileSync(file, 'utf8').trim()
  return text === '' ? [] : text.split('\n').map(JSON.parse)
}
function mean(values) { return values.length === 0 ? null : values.reduce((sum, value) => sum + value, 0) / values.length }
function ranks(values) {
  const sorted = values.map((value, index) => ({ value, index })).sort((a, b) => a.value - b.value)
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
  return ls === 0 || rs === 0 ? null : numerator / Math.sqrt(ls * rs)
}
function spearman(left, right) { return pearson(ranks(left), ranks(right)) }
function round(value, digits = 3) { return value == null ? null : Number(value.toFixed(digits)) }
function languageStratum(text) {
  const cjk = (text.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu) ?? []).length
  const latin = (text.match(/\p{Script=Latin}/gu) ?? []).length
  const total = cjk + latin
  if (total === 0 || cjk / total < 0.15) return 'non-cjk-dominant'
  if (latin / total < 0.15) return 'cjk-dominant'
  return 'mixed'
}
function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
}

const cohort = ndjson(cohortPath)
const ratingsReport = JSON.parse(fs.readFileSync(ratingsPath, 'utf8'))
const ratings = ratingsReport.reviews
if (cohort.length < 100 || ratings.length !== cohort.length) throw new Error(`Cohort/rating mismatch: ${cohort.length}/${ratings.length}`)
const cohortRepos = cohort.map((row) => typeof row?.repo === 'string' ? row.repo.toLowerCase() : '')
const ratingRepos = ratings.map((row) => typeof row?.repo === 'string' ? row.repo.toLowerCase() : '')
if (cohortRepos.some((repo) => repo === '') || new Set(cohortRepos).size !== cohort.length) throw new Error('Cohort repos must be non-empty and unique')
if (ratingRepos.some((repo) => repo === '') || new Set(ratingRepos).size !== ratings.length) throw new Error('Rating repos must be non-empty and unique')
const expectedOracleProtocol = {
  pairValidatorSha256: sha256(PAIR_VALIDATOR_PATH),
  semanticOwnershipSha256: sha256(SEMANTIC_OWNERSHIP_PATH),
  aggregatorSha256: sha256(AGGREGATOR_PATH),
  metricsSha256: sha256(METRICS_PATH),
}
if (ratingsReport.oracleProtocolFingerprint != null) {
  if (!isDeepStrictEqual(ratingsReport.oracleProtocolFingerprint, expectedOracleProtocol)) throw new Error('Ratings oracle protocol does not match current owners')
  const source = ratingsReport.source
  if (!source || path.resolve(source.cohortPath ?? '') !== cohortPath || !source.pairsPath || !source.reviewsDir) throw new Error('Ratings source provenance is missing or mismatched')
  const replayDir = fs.mkdtempSync(path.join(os.tmpdir(), 'practical-v3-ratings-replay-'))
  try {
    const replayPath = path.join(replayDir, 'ratings.json')
    execFileSync(process.execPath, [AGGREGATOR_PATH, cohortPath, path.resolve(source.pairsPath), path.resolve(source.reviewsDir), replayPath], { cwd: ROOT, stdio: 'pipe' })
    const replayed = JSON.parse(fs.readFileSync(replayPath, 'utf8'))
    const normalized = (value) => { const copy = structuredClone(value); delete copy.generatedAt; return copy }
    if (!isDeepStrictEqual(normalized(ratingsReport), normalized(replayed))) throw new Error('Ratings do not reproduce from the current oracle sources')
  } finally {
    fs.rmSync(replayDir, { recursive: true, force: true })
  }
}
const EVIDENCE_CAPS = { capabilityItems: 12, usageItems: 10, usageActions: 10, ioPairs: 8, codeExamples: 4, usecaseItems: 10, outputItems: 8, media: 6, reliabilityItems: 10 }
for (const rating of ratings) {
  if (rating.oracleEvidence?.version !== 3 || rating.oracleEvidence?.parserRevision !== 3) throw new Error(`Missing Practical V3 parser revision 3 oracleEvidence for ${rating.repo}`)
  for (const [key, maximum] of Object.entries(EVIDENCE_CAPS)) {
    const value = rating.oracleEvidence[key]
    if (!Number.isFinite(value) || value < 0 || value > maximum) throw new Error(`Invalid oracleEvidence.${key} for ${rating.repo}: ${value}`)
  }
}
const ratingByRepo = new Map(ratings.map((row) => [row.repo.toLowerCase(), row]))
const rows = cohort.map(({ repo, text }) => {
  const human = ratingByRepo.get(repo.toLowerCase())
  if (!human) throw new Error(`Missing rating for ${repo}`)
  const raw = practicalEvidence(text)
  const evidence = raw == null ? null : {
    version: raw.version,
    parserRevision: raw.parser_revision,
    capabilityItems: raw.capability_items,
    usageItems: raw.usage_items,
    usageActions: raw.usage_actions,
    ioPairs: raw.io_pairs,
    codeExamples: raw.code_examples,
    usecaseItems: raw.usecase_items,
    outputItems: raw.output_items,
    media: raw.media,
    reliabilityItems: raw.reliability_items,
    confidence: {
      overall: raw.confidence.overall,
      coverage: raw.confidence.coverage,
      fallbackShare: raw.confidence.fallback_share,
    },
  }
  const dimensions = scorePracticalDimensions(evidence)
  const score = scorePractical(evidence)
  const oracleDimensions = scorePracticalDimensions(human.oracleEvidence)
  const oracleTotal = scorePractical(human.oracleEvidence)
  if (oracleDimensions == null || oracleTotal == null) throw new Error(`Invalid Practical V3 oracleEvidence for ${repo}`)
  const normalizedHuman = {
    ...human,
    ratingTotal: human.total,
    total: oracleTotal,
    capability: oracleDimensions.capability,
    usage: oracleDimensions.usage,
    usecases: oracleDimensions.usecases,
    demo: oracleDimensions.demo,
    reliability: oracleDimensions.reliability,
  }
  return { repo, type: human.inferredType, language: languageStratum(text), score, human: normalizedHuman, dimensions, evidence, error: score - oracleTotal }
})

const scores = rows.map((row) => row.score)
const human = rows.map((row) => row.human.total)
const quarter = Math.ceil(rows.length / 4)
const topQuartileRecall = fractionalTopKRecall(scores, human, quarter)
const severeFalseNegatives = rows.filter((row) => row.error <= -25)
const severeFalsePositives = rows.filter((row) => row.error >= 20)
const within20 = rows.filter((row) => Math.abs(row.error) <= 20)
const dimensionPairs = [
  ['capability', 'capability'], ['usage', 'usage'], ['usecases', 'usecases'], ['demo', 'demo'], ['reliability', 'reliability'],
]
const { byType, byLanguage, byTypeLanguage, maximumStratumSevereRate, languageMeanResidualGap } = fairnessMetrics(rows)
const rawGates = {
  spearman: gateResult(spearman(scores, human), { threshold: 0.75 }),
  topQuartileRecall: gateResult(topQuartileRecall, { threshold: 0.8 }),
  severeFalseNegativeRate: gateResult(severeFalseNegatives.length / rows.length, { maximum: 0.05 }),
  severeFalsePositiveRate: gateResult(severeFalsePositives.length / rows.length, { maximum: 0.05 }),
  within20Share: gateResult(within20.length / rows.length, { threshold: 0.8 }),
  stratumSevereErrorRate: gateResult(maximumStratumSevereRate, { maximum: 0.1 }),
  languageMeanResidualGap: gateResult(languageMeanResidualGap, { maximum: 5 }),
}
const report = {
  generatedAt: new Date().toISOString(),
  parser: INDEX_PARSER,
  algorithmFingerprint: {
    parserSha256: sha256(INDEX_PARSER),
    scorerSha256: sha256(path.join(ROOT, 'lib/score.js')),
  },
  protocolFingerprint: {
    evaluatorSha256: sha256(EVALUATOR_PATH),
    metricsSha256: sha256(METRICS_PATH),
    rubricSha256: sha256(RUBRIC_PATH),
    consecutiveValidatorSha256: sha256(CONSECUTIVE_PATH),
  },
  oracleProtocolFingerprint: ratingsReport.oracleProtocolFingerprint ?? null,
  oracleProvenanceVerified: ratingsReport.oracleProtocolFingerprint != null,
  inputFingerprint: {
    cohortSha256: sha256(cohortPath),
    ratingsSha256: sha256(ratingsPath),
  },
  cohortPath,
  ratingsPath,
  count: rows.length,
  gates: rawGates,
  diagnostics: {
    meanScore: round(mean(scores)),
    meanHuman: round(mean(human)),
    meanError: round(mean(rows.map((row) => row.error))),
    meanAbsoluteError: round(mean(rows.map((row) => Math.abs(row.error)))),
    dimensionSpearman: Object.fromEntries(dimensionPairs.map(([scoreKey, humanKey]) => [scoreKey, round(spearman(rows.map((row) => row.dimensions[scoreKey]), rows.map((row) => row.human[humanKey])))])),
    byType,
    byLanguage,
    byTypeLanguage,
  },
  severeFalseNegatives: severeFalseNegatives.sort((a, b) => a.error - b.error).map(({ repo, type, score, human, dimensions, evidence, error }) => ({ repo, type, score, human: human.total, error, dimensions, evidence, concern: human.concern })),
  severeFalsePositives: severeFalsePositives.sort((a, b) => b.error - a.error).map(({ repo, type, score, human, dimensions, evidence, error }) => ({ repo, type, score, human: human.total, error, dimensions, evidence, concern: human.concern })),
  rows,
}
report.pass = report.oracleProvenanceVerified && Object.values(report.gates).every((gate) => gate.pass)
fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, JSON.stringify(report, null, 2) + '\n')
console.log(JSON.stringify({ outputPath, pass: report.pass, gates: report.gates, diagnostics: report.diagnostics, severeFalseNegatives: report.severeFalseNegatives.map(({ repo, score, human, error }) => ({ repo, score, human, error })), severeFalsePositives: report.severeFalsePositives.map(({ repo, score, human, error }) => ({ repo, score, human, error })) }, null, 2))
