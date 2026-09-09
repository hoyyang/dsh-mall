#!/usr/bin/env node

/** Validate and summarize citation-grounded Practical V3 oracle reviews. */

import fs from 'node:fs'
import crypto from 'node:crypto'
import path from 'node:path'
import process from 'node:process'
import { scorePractical, scorePracticalDimensions } from '../lib/score.js'
import { PRACTICAL_V3_SEMANTIC_FIELDS, evidenceOwnershipIssues } from './practical-v3-semantic-ownership.mjs'

const cohortPath = path.resolve(process.argv[2] ?? 'artifacts/practical-v3/blind/round-02.ndjson')
const reviewsDir = path.resolve(process.argv[3] ?? 'artifacts/practical-v3/reviews')
const roundId = path.basename(cohortPath, '.ndjson')
if (!/^round-\d{2}$/.test(roundId)) throw new Error(`Cohort filename must be round-NN.ndjson, got ${path.basename(cohortPath)}`)
const outputPath = path.resolve(process.argv[4] ?? `artifacts/practical-v3/${roundId}-oracle-review-pairs.json`)
const reviewFileRe = new RegExp(`^${roundId}-oracle-(?:pilot-\\d{2}|\\d{2})-[ab]\\.json$`)
const scorerPath = path.resolve(import.meta.dirname, '../lib/score.js')
const rubricPath = path.resolve(import.meta.dirname, '../artifacts/practical-v3/practical-v3-evidence-oracle-rubric.md')
const validatorPath = path.resolve(import.meta.dirname, './validate-practical-v3-oracle.mjs')
const semanticOwnershipPath = path.resolve(import.meta.dirname, './practical-v3-semantic-ownership.mjs')
const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')

const SEMANTIC_FIELDS = PRACTICAL_V3_SEMANTIC_FIELDS
const STRING_FIELDS = [...SEMANTIC_FIELDS, 'usageActions', 'ioPairs', 'codeExamples']
const TYPES = new Set(['dsh-plugin', 'standalone-nonplugin', 'catalog-list', 'unclear'])
const CAPS = {
  capability: 12,
  usageItems: 10,
  usageActions: 10,
  ioPairs: 8,
  codeExamples: 4,
  usecases: 10,
  outputs: 8,
  reliability: 10,
}

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
    version: 3,
    parserRevision: 3,
    capabilityItems: review.capability.length,
    usageItems: review.usageItems.length,
    usageActions: review.usageActions.length,
    ioPairs: review.ioPairs.length,
    codeExamples: review.codeExamples.length,
    usecaseItems: review.usecases.length,
    outputItems: review.outputs.length,
    media: review.media.reduce((sum, item) => sum + item.weight, 0),
    reliabilityItems: review.reliability.length,
    confidence: { overall: 1, coverage: 1, fallbackShare: 0 },
  }
}

const cohort = ndjson(cohortPath)
if (cohort.length < 100) throw new Error(`Expected at least 100 cohort rows, got ${cohort.length}`)
const cohortRepos = cohort.map((row) => typeof row?.repo === 'string' ? row.repo.toLowerCase() : '')
if (cohortRepos.some((repo) => repo === '') || new Set(cohortRepos).size !== cohort.length) {
  throw new Error('Cohort repos must be non-empty and unique')
}
if (cohort.some((row) => typeof row.text !== 'string' || row.text.trim() === '')) throw new Error('Cohort README text must be non-empty')
const cohortByRepo = new Map(cohort.map((row) => [row.repo.toLowerCase(), row]))
const expectedRepos = new Set(cohortByRepo.keys())
const issues = []
const byPass = { a: new Map(), b: new Map() }

for (const pass of ['a', 'b']) {
  const reviewSequence = []
  const files = fs.readdirSync(reviewsDir)
    .filter((name) => reviewFileRe.test(name))
    .filter((name) => name.endsWith(`-${pass}.json`))
    .sort()
  for (const name of files) {
    const file = path.join(reviewsDir, name)
    for (const review of reviewRows(file)) {
      reviewSequence.push(review?.repo)
      const issueCount = issues.length
      if (review == null || typeof review !== 'object' || typeof review.repo !== 'string' || review.repo === '') {
        issues.push(`${name}: invalid review object or repo`)
        continue
      }
      const key = review.repo.toLowerCase()
      if (!expectedRepos.has(key)) {
        issues.push(`${name}: unexpected repo ${review.repo}`)
        continue
      }
      if (byPass[pass].has(key)) {
        issues.push(`${name}: duplicate ${pass} review for ${review.repo}`)
        continue
      }
      const source = cohortByRepo.get(key).text
      if (!TYPES.has(review.inferredType)) issues.push(`${name}: ${review.repo} invalid inferredType ${review.inferredType}`)
      if (!Array.isArray(review.concerns)) issues.push(`${name}: ${review.repo} missing concerns array`)
      for (const field of STRING_FIELDS) {
        if (!Array.isArray(review[field])) {
          issues.push(`${name}: ${review.repo} missing array ${field}`)
          continue
        }
        if (review[field].length > CAPS[field]) issues.push(`${name}: ${review.repo} ${field} exceeds cap`)
        for (const excerpt of review[field]) {
          if (typeof excerpt !== 'string' || excerpt.length === 0 || excerpt.length > 220) {
            issues.push(`${name}: ${review.repo} invalid ${field} excerpt length`)
            continue
          }
          if (!source.includes(excerpt)) issues.push(`${name}: ${review.repo} non-verbatim ${field}: ${JSON.stringify(excerpt)}`)
        }
      }
      if (!Array.isArray(review.media)) {
        issues.push(`${name}: ${review.repo} missing media array`)
      } else {
        let mediaWeight = 0
        const mediaSeen = new Set()
        for (const item of review.media) {
          if (item == null || typeof item !== 'object') {
            issues.push(`${name}: ${review.repo} invalid media item`)
            continue
          }
          mediaWeight += item.weight
          if (![0.5, 1].includes(item.weight)) issues.push(`${name}: ${review.repo} invalid media weight`)
          if (typeof item.excerpt !== 'string' || item.excerpt.length === 0 || item.excerpt.length > 220 || !source.includes(item.excerpt)) {
            issues.push(`${name}: ${review.repo} non-verbatim media excerpt`)
            continue
          }
          const signature = normalized(item.excerpt)
          if (mediaSeen.has(signature)) issues.push(`${name}: ${review.repo} duplicate media excerpt`)
          mediaSeen.add(signature)
        }
        if (mediaWeight > 6) issues.push(`${name}: ${review.repo} media exceeds cap`)
      }
      for (const issue of evidenceOwnershipIssues(review)) issues.push(`${name}: ${review.repo} ${issue}`)
      if (issues.length > issueCount) continue
      const evidence = evidenceFromReview(review)
      byPass[pass].set(key, {
        ...review,
        sourceFile: name,
        evidence,
        dimensions: scorePracticalDimensions(evidence),
        score: scorePractical(evidence),
      })
    }
  }
  if (reviewSequence.length !== cohort.length) issues.push(`Expected ${cohort.length} ${pass} reviews, got ${reviewSequence.length}`)
  for (let index = 0; index < Math.max(cohort.length, reviewSequence.length); index++) {
    if (reviewSequence[index] !== cohort[index]?.repo) issues.push(`${pass} review order mismatch at row ${index + 1}: expected ${cohort[index]?.repo}, got ${reviewSequence[index]}`)
  }
}

for (const pass of ['a', 'b']) {
  for (const row of cohort) {
    if (!byPass[pass].has(row.repo.toLowerCase())) issues.push(`Missing ${pass} review for ${row.repo}`)
  }
}

const pairs = cohort.map((row) => {
  const key = row.repo.toLowerCase()
  const a = byPass.a.get(key)
  const b = byPass.b.get(key)
  return {
    repo: row.repo,
    a,
    b,
    scoreDifference: a && b ? Math.abs(a.score - b.score) : null,
  }
})
const completePairs = pairs.filter((row) => row.a && row.b)
const differences = completePairs.map((row) => row.scoreDifference)
const disagreements = completePairs
  .filter((row) => row.scoreDifference > 10)
  .map((row) => ({ repo: row.repo, scoreA: row.a.score, scoreB: row.b.score, difference: row.scoreDifference }))
const report = {
  generatedAt: new Date().toISOString(),
  cohortPath,
  reviewsDir,
  count: cohort.length,
  fingerprints: {
    cohortSha256: sha256(cohortPath),
    scorerSha256: sha256(scorerPath),
    rubricSha256: sha256(rubricPath),
    pairValidatorSha256: sha256(validatorPath),
    semanticOwnershipSha256: sha256(semanticOwnershipPath),
  },
  reviewedA: byPass.a.size,
  reviewedB: byPass.b.size,
  issues,
  agreement: {
    meanAbsoluteScoreDifference: differences.length === 0 ? null : differences.reduce((sum, value) => sum + value, 0) / differences.length,
    maximumScoreDifference: differences.length === 0 ? null : Math.max(...differences),
    within10Count: differences.filter((value) => value <= 10).length,
    arbitrationCount: disagreements.length,
  },
  disagreements,
  pairs,
}
fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, JSON.stringify(report, null, 2) + '\n')
console.log(JSON.stringify({
  outputPath,
  reviewedA: report.reviewedA,
  reviewedB: report.reviewedB,
  issues: issues.length,
  issueExamples: issues.slice(0, 20),
  agreement: report.agreement,
  disagreements,
}, null, 2))
if (issues.length > 0 || byPass.a.size !== cohort.length || byPass.b.size !== cohort.length) process.exitCode = 1
