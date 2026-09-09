#!/usr/bin/env node

/** Build README-only arbitration batches from a validated Practical V3 pair report. */

import fs from 'node:fs'
import crypto from 'node:crypto'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { execFileSync } from 'node:child_process'
import { isDeepStrictEqual } from 'node:util'

const cohortPath = path.resolve(process.argv[2] ?? '')
const pairsPath = path.resolve(process.argv[3] ?? '')
const outputDir = path.resolve(process.argv[4] ?? '')
const batchSize = Number(process.argv[5] ?? 10)
if (!process.argv[2] || !process.argv[3] || !process.argv[4]) throw new Error('Usage: build-practical-v3-arbitration-batches.mjs <cohort.ndjson> <pairs.json> <output-dir> [batch-size=10]')
if (!Number.isSafeInteger(batchSize) || batchSize < 1) throw new Error(`Invalid batch size: ${process.argv[5]}`)

const cohort = fs.readFileSync(cohortPath, 'utf8').trim().split('\n').map(JSON.parse)
const sourceByRepo = new Map(cohort.map((row) => [row.repo.toLowerCase(), row]))
if (sourceByRepo.size !== cohort.length) throw new Error('Cohort repos must be unique')
const pairs = JSON.parse(fs.readFileSync(pairsPath, 'utf8'))
const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const expectedFingerprints = {
  cohortSha256: sha256(cohortPath),
  scorerSha256: sha256(path.resolve(import.meta.dirname, '../lib/score.js')),
  rubricSha256: sha256(path.resolve(import.meta.dirname, '../artifacts/practical-v3/practical-v3-evidence-oracle-rubric.md')),
  pairValidatorSha256: sha256(path.resolve(import.meta.dirname, './validate-practical-v3-oracle.mjs')),
  semanticOwnershipSha256: sha256(path.resolve(import.meta.dirname, './practical-v3-semantic-ownership.mjs')),
}
for (const [name, expected] of Object.entries(expectedFingerprints)) {
  if (pairs.fingerprints?.[name] !== expected) throw new Error(`Oracle pair fingerprint mismatch for ${name}`)
}
const reviewsDir = typeof pairs.reviewsDir === 'string' ? path.resolve(pairs.reviewsDir) : null
if (!reviewsDir || !fs.existsSync(reviewsDir)) throw new Error('Pair report reviewsDir is missing or unreadable')
const replayDir = fs.mkdtempSync(path.join(os.tmpdir(), 'practical-v3-pair-replay-'))
try {
  const replayPath = path.join(replayDir, 'pairs.json')
  execFileSync(process.execPath, [path.resolve(import.meta.dirname, './validate-practical-v3-oracle.mjs'), cohortPath, reviewsDir, replayPath], { stdio: 'pipe' })
  const replayed = JSON.parse(fs.readFileSync(replayPath, 'utf8'))
  const normalized = (value) => { const copy = structuredClone(value); delete copy.generatedAt; return copy }
  if (!isDeepStrictEqual(normalized(pairs), normalized(replayed))) throw new Error('Oracle pair report does not reproduce from current reviews')
} finally {
  fs.rmSync(replayDir, { recursive: true, force: true })
}
if (!Array.isArray(pairs.issues) || pairs.issues.length > 0) throw new Error('Pair report has validation issues')
if (!Array.isArray(pairs.disagreements)) throw new Error('Pair report missing disagreements')

const rows = pairs.disagreements.map(({ repo }) => {
  const source = sourceByRepo.get(repo.toLowerCase())
  if (!source) throw new Error(`Disagreement repo missing from cohort: ${repo}`)
  return { repo: source.repo, text: source.text }
})
fs.mkdirSync(outputDir, { recursive: true })
const files = []
for (let start = 0; start < rows.length; start += batchSize) {
  const file = path.join(outputDir, `arb-batch-${String(files.length + 1).padStart(2, '0')}.ndjson`)
  fs.writeFileSync(file, `${rows.slice(start, start + batchSize).map(JSON.stringify).join('\n')}\n`)
  files.push(file)
}
const report = {
  cohortPath,
  pairsPath,
  threshold: '>10 production-scorer points from validated pair report',
  disagreementCount: rows.length,
  batchSize,
  files,
}
fs.writeFileSync(path.join(outputDir, 'manifest.json'), `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify(report, null, 2))
