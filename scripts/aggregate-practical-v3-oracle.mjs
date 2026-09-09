#!/usr/bin/env node

/** Aggregate validated Practical V3 evidence-oracle reviews into deterministic ratings. */

import fs from 'node:fs'
import crypto from 'node:crypto'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { isDeepStrictEqual } from 'node:util'
import { scorePractical, scorePracticalDimensions } from '../lib/score.js'
import { consensusType } from './practical-v3-metrics.mjs'
import { evidenceOwnershipIssues } from './practical-v3-semantic-ownership.mjs'

const cohortPath = path.resolve(process.argv[2] ?? 'artifacts/practical-v3/blind/round-02.ndjson')
const roundId = path.basename(cohortPath, '.ndjson')
if (!/^round-\d{2}$/.test(roundId)) throw new Error(`Cohort filename must be round-NN.ndjson, got ${path.basename(cohortPath)}`)
const pairsPath = path.resolve(process.argv[3] ?? `artifacts/practical-v3/${roundId}-oracle-review-pairs.json`)
const reviewsDir = path.resolve(process.argv[4] ?? 'artifacts/practical-v3/reviews')
const outputPath = path.resolve(process.argv[5] ?? `artifacts/practical-v3/${roundId}-oracle-ratings.json`)
const arbitrationFileRe = new RegExp(`^${roundId}-oracle-arb-\\d{2}\\.json$`)
const scorerPath = path.resolve(import.meta.dirname, '../lib/score.js')
const rubricPath = path.resolve(import.meta.dirname, '../artifacts/practical-v3/practical-v3-evidence-oracle-rubric.md')
const pairValidatorPath = path.resolve(import.meta.dirname, './validate-practical-v3-oracle.mjs')
const aggregatorPath = fileURLToPath(import.meta.url)
const metricsPath = path.resolve(import.meta.dirname, './practical-v3-metrics.mjs')
const semanticOwnershipPath = path.resolve(import.meta.dirname, './practical-v3-semantic-ownership.mjs')
const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')

const STRING_FIELDS = ['capability', 'usageItems', 'usageActions', 'ioPairs', 'codeExamples', 'usecases', 'outputs', 'reliability']
const CAPS = { capability: 12, usageItems: 10, usageActions: 10, ioPairs: 8, codeExamples: 4, usecases: 10, outputs: 8, reliability: 10 }
const EVIDENCE_KEYS = ['capabilityItems', 'usageItems', 'usageActions', 'ioPairs', 'codeExamples', 'usecaseItems', 'outputItems', 'media', 'reliabilityItems']
const TYPES = new Set(['dsh-plugin', 'standalone-nonplugin', 'catalog-list', 'unclear'])

function ndjson(file) {
  const text = fs.readFileSync(file, 'utf8').trim()
  return text === '' ? [] : text.split('\n').map(JSON.parse)
}

function reviewRows(file) {
  const value = JSON.parse(fs.readFileSync(file, 'utf8'))
  const rows = Array.isArray(value) ? value : value.reviews
  if (!Array.isArray(rows)) throw new Error(`Missing reviews array: ${file}`)
  return rows
}

function normalized(value) {
  return String(value).trim().replace(/\s+/g, ' ').toLowerCase()
}

function evidenceFromReview(review) {
  return {
    capabilityItems: review.capability.length,
    usageItems: review.usageItems.length,
    usageActions: review.usageActions.length,
    ioPairs: review.ioPairs.length,
    codeExamples: review.codeExamples.length,
    usecaseItems: review.usecases.length,
    outputItems: review.outputs.length,
    media: review.media.reduce((sum, item) => sum + item.weight, 0),
    reliabilityItems: review.reliability.length,
  }
}

function validateReview(review, source, label, issues) {
  if (!TYPES.has(review.inferredType)) issues.push(`${label}: invalid inferredType ${review.inferredType}`)
  if (!Array.isArray(review.concerns)) issues.push(`${label}: missing concerns array`)
  for (const field of STRING_FIELDS) {
    if (!Array.isArray(review[field])) {
      issues.push(`${label}: missing ${field}`)
      continue
    }
    if (review[field].length > CAPS[field]) issues.push(`${label}: ${field} exceeds cap`)
    for (const excerpt of review[field]) {
      if (typeof excerpt !== 'string' || excerpt.length === 0 || excerpt.length > 220 || !source.includes(excerpt)) {
        issues.push(`${label}: non-verbatim ${field}: ${JSON.stringify(excerpt)}`)
      }
    }
  }
  if (!Array.isArray(review.media)) {
    issues.push(`${label}: missing media`)
  } else {
    let mediaWeight = 0
    const mediaSeen = new Set()
    for (const item of review.media) {
      if (item == null || typeof item !== 'object') {
        issues.push(`${label}: invalid media evidence`)
        continue
      }
      mediaWeight += item.weight
      if (![0.5, 1].includes(item.weight) || typeof item.excerpt !== 'string' || item.excerpt.length === 0 || item.excerpt.length > 220 || !source.includes(item.excerpt)) {
        issues.push(`${label}: invalid media evidence`)
        continue
      }
      const signature = normalized(item.excerpt)
      if (mediaSeen.has(signature)) issues.push(`${label}: duplicate media excerpt`)
      mediaSeen.add(signature)
    }
    if (mediaWeight > 6) issues.push(`${label}: media exceeds cap`)
  }
  for (const issue of evidenceOwnershipIssues(review)) issues.push(`${label}: ${issue}`)
}

function mean(left, right) {
  return (left + right) / 2
}

function median(values) {
  return [...values].sort((left, right) => left - right)[Math.floor(values.length / 2)]
}

function productionEvidence(counts) {
  return {
    version: 3,
    parserRevision: 3,
    ...counts,
    confidence: { overall: 1, coverage: 1, fallbackShare: 0 },
  }
}

const cohort = ndjson(cohortPath)
const cohortByRepo = new Map(cohort.map((row) => [row.repo.toLowerCase(), row]))
if (cohort.length < 100 || cohortByRepo.size !== cohort.length) throw new Error('Cohort must contain at least 100 unique repos')
const pairsReport = JSON.parse(fs.readFileSync(pairsPath, 'utf8'))
const expectedFingerprints = {
  cohortSha256: sha256(cohortPath),
  scorerSha256: sha256(scorerPath),
  rubricSha256: sha256(rubricPath),
  pairValidatorSha256: sha256(pairValidatorPath),
  semanticOwnershipSha256: sha256(semanticOwnershipPath),
}
for (const [name, expected] of Object.entries(expectedFingerprints)) {
  if (pairsReport.fingerprints?.[name] !== expected) throw new Error(`Oracle pair fingerprint mismatch for ${name}`)
}
const pairReviewsDir = typeof pairsReport.reviewsDir === 'string' ? path.resolve(pairsReport.reviewsDir) : null
if (!pairReviewsDir || pairReviewsDir !== reviewsDir || !fs.existsSync(pairReviewsDir)) throw new Error('Pair report reviewsDir does not match the aggregator reviewsDir')
const pairReplayDir = fs.mkdtempSync(path.join(os.tmpdir(), 'practical-v3-pair-replay-'))
try {
  const replayPath = path.join(pairReplayDir, 'pairs.json')
  execFileSync(process.execPath, [pairValidatorPath, cohortPath, reviewsDir, replayPath], { stdio: 'pipe' })
  const replayed = JSON.parse(fs.readFileSync(replayPath, 'utf8'))
  const normalized = (value) => { const copy = structuredClone(value); delete copy.generatedAt; return copy }
  if (!isDeepStrictEqual(normalized(pairsReport), normalized(replayed))) throw new Error('Oracle pair report does not reproduce from current reviews')
} finally {
  fs.rmSync(pairReplayDir, { recursive: true, force: true })
}
if (pairsReport.issues.length > 0 || pairsReport.reviewedA !== cohort.length || pairsReport.reviewedB !== cohort.length) {
  throw new Error('Oracle A/B reviews have not passed validation')
}
const disputed = new Set(pairsReport.disagreements.map((row) => row.repo.toLowerCase()))
const arbitration = new Map()
const arbitrationSequence = []
const issues = []
const arbitrationFiles = fs.readdirSync(reviewsDir)
  .filter((name) => arbitrationFileRe.test(name))
  .sort()
for (const name of arbitrationFiles) {
  for (const review of reviewRows(path.join(reviewsDir, name))) {
    arbitrationSequence.push(review?.repo)
    if (review == null || typeof review !== 'object' || typeof review.repo !== 'string' || review.repo === '') {
      issues.push(`${name}: invalid review object or repo`)
      continue
    }
    const key = review.repo.toLowerCase()
    const cohortRow = cohortByRepo.get(key)
    if (!cohortRow) {
      issues.push(`${name}: unexpected repo ${review.repo}`)
      continue
    }
    if (!disputed.has(key)) issues.push(`${name}: arbitration not requested for ${review.repo}`)
    if (arbitration.has(key)) issues.push(`${name}: duplicate arbitration for ${review.repo}`)
    const issueCount = issues.length
    validateReview(review, cohortRow.text, `${name}: ${review.repo}`, issues)
    if (issues.length === issueCount) arbitration.set(key, review)
  }
}
const expectedArbitrationSequence = pairsReport.disagreements.map((row) => row.repo)
if (arbitrationSequence.length !== expectedArbitrationSequence.length) issues.push(`Expected ${expectedArbitrationSequence.length} arbitration reviews, got ${arbitrationSequence.length}`)
for (let index = 0; index < Math.max(expectedArbitrationSequence.length, arbitrationSequence.length); index++) {
  if (arbitrationSequence[index] !== expectedArbitrationSequence[index]) issues.push(`Arbitration order mismatch at row ${index + 1}: expected ${expectedArbitrationSequence[index]}, got ${arbitrationSequence[index]}`)
}
for (const repo of disputed) if (!arbitration.has(repo)) issues.push(`Missing arbitration for ${repo}`)
if (issues.length > 0) {
  console.error(JSON.stringify({ issues: issues.length, issueExamples: issues.slice(0, 30) }, null, 2))
  process.exit(1)
}

const pairByRepo = new Map(pairsReport.pairs.map((row) => [row.repo.toLowerCase(), row]))
const reviews = cohort.map((cohortRow) => {
  const key = cohortRow.repo.toLowerCase()
  const pair = pairByRepo.get(key)
  if (!pair?.a || !pair?.b) throw new Error(`Missing A/B pair for ${cohortRow.repo}`)
  const a = pair.a.evidence
  const b = pair.b.evidence
  const cReview = arbitration.get(key)
  const c = cReview ? evidenceFromReview(cReview) : null
  const counts = Object.fromEntries(EVIDENCE_KEYS.map((evidenceKey) => [
    evidenceKey,
    c ? median([a[evidenceKey], b[evidenceKey], c[evidenceKey]]) : mean(a[evidenceKey], b[evidenceKey]),
  ]))
  const evidence = productionEvidence(counts)
  const dimensions = scorePracticalDimensions(evidence)
  const total = scorePractical(evidence)
  const inferredType = consensusType(pair.a.inferredType, pair.b.inferredType, cReview?.inferredType)
  return {
    repo: cohortRow.repo,
    inferredType,
    capability: dimensions.capability,
    usage: dimensions.usage,
    usecases: dimensions.usecases,
    demo: dimensions.demo,
    reliability: dimensions.reliability,
    total,
    confidence: c ? 'high' : 'medium',
    evidence: `citation-grounded oracle: ${c ? 'three-reviewer count median' : 'two-reviewer count mean'}`,
    concern: '',
    reviewMethod: c ? 'three-reviewer evidence-count median' : 'two-reviewer evidence-count mean',
    oracleEvidence: evidence,
  }
})
const scores = reviews.map((review) => review.total)
const report = {
  generatedAt: new Date().toISOString(),
  rubric: 'artifacts/practical-v3/practical-v3-evidence-oracle-rubric.md',
  source: {
    cohortPath,
    pairsPath,
    reviewsDir,
    arbitrationFiles: arbitrationFiles.map((name) => path.join(reviewsDir, name)),
  },
  inputFingerprint: {
    cohortSha256: sha256(cohortPath),
    pairsSha256: sha256(pairsPath),
    arbitrationSha256: Object.fromEntries(arbitrationFiles.map((name) => [name, sha256(path.join(reviewsDir, name))])),
  },
  fingerprints: expectedFingerprints,
  oracleProtocolFingerprint: {
    pairValidatorSha256: sha256(pairValidatorPath),
    semanticOwnershipSha256: sha256(semanticOwnershipPath),
    aggregatorSha256: sha256(aggregatorPath),
    metricsSha256: sha256(metricsPath),
  },
  design: {
    blind: true,
    citationGrounded: true,
    reviewersPerProject: 2,
    arbitrationThreshold: 10,
    arbitrated: arbitration.size,
    aggregation: 'two-reviewer evidence-count mean; three-reviewer evidence-count median when score difference > 10',
    scoring: 'production Practical V3 dimension scorer',
  },
  diagnostics: {
    count: reviews.length,
    mean: scores.reduce((sum, score) => sum + score, 0) / scores.length,
    minimum: Math.min(...scores),
    maximum: Math.max(...scores),
  },
  reviews,
}
fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, JSON.stringify(report, null, 2) + '\n')
console.log(JSON.stringify({ outputPath, arbitrationFiles, issues: 0, ...report.diagnostics }, null, 2))
