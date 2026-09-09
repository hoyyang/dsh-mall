#!/usr/bin/env node

/** Build compact, citation-grounded parser diagnostic packs from Round 2. */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const ROOT = path.resolve(import.meta.dirname, '..')
const evaluationPath = path.resolve(process.argv[2] ?? path.join(ROOT, 'artifacts/practical-v3/round-02-production-scorer-evaluation.json'))
const evaluation = JSON.parse(fs.readFileSync(evaluationPath, 'utf8'))
const cohortPath = path.resolve(evaluation.cohortPath)
const roundId = path.basename(cohortPath, '.ndjson')
if (!/^round-\d{2}$/.test(roundId)) throw new Error(`Evaluation cohort must be round-NN.ndjson, got ${path.basename(cohortPath)}`)
const pairsPath = path.resolve(process.argv[3] ?? path.join(ROOT, `artifacts/practical-v3/${roundId}-oracle-review-pairs.json`))
const reviewsDir = path.resolve(process.argv[4] ?? path.join(ROOT, 'artifacts/practical-v3/reviews'))
const outputDir = path.resolve(process.argv[5] ?? path.join(ROOT, 'artifacts/practical-v3/diagnostics'))
const arbitrationFileRe = new RegExp(`^${roundId}-oracle-arb-\\d{2}\\.json$`)

function ndjson(file) {
  const text = fs.readFileSync(file, 'utf8').trim()
  return text === '' ? [] : text.split('\n').map(JSON.parse)
}

function reviewRows(file) {
  const value = JSON.parse(fs.readFileSync(file, 'utf8'))
  return Array.isArray(value) ? value : value.reviews
}

function nearestHeading(text, excerpt) {
  const lines = text.split(/\r?\n/)
  const firstLine = String(excerpt).split(/\r?\n/)[0]
  let index = lines.findIndex((line) => line.includes(firstLine))
  if (index < 0) index = lines.findIndex((line) => firstLine.includes(line.trim()) && line.trim().length >= 12)
  for (let cursor = index; cursor >= 0; cursor--) {
    if (/^#{1,6}\s+/.test(lines[cursor])) return lines[cursor].trim()
  }
  return '(preamble)'
}

function signature(value) {
  return String(value).trim().replace(/\s+/g, ' ').toLowerCase()
}

const cohort = ndjson(cohortPath)
const sourceByRepo = new Map(cohort.map((row) => [row.repo.toLowerCase(), row.text]))
const pairs = JSON.parse(fs.readFileSync(pairsPath, 'utf8'))
const pairByRepo = new Map(pairs.pairs.map((row) => [row.repo.toLowerCase(), row]))
const arbitrationByRepo = new Map()
for (const name of fs.readdirSync(reviewsDir).filter((name) => arbitrationFileRe.test(name)).sort()) {
  for (const review of reviewRows(path.join(reviewsDir, name))) arbitrationByRepo.set(review.repo.toLowerCase(), review)
}

const familyConfig = {
  usageActions: { oracleKey: 'usageActions', reviewKey: 'usageActions' },
  ioPairs: { oracleKey: 'ioPairs', reviewKey: 'ioPairs' },
  usecaseItems: { oracleKey: 'usecaseItems', reviewKey: 'usecases' },
  outputItems: { oracleKey: 'outputItems', reviewKey: 'outputs' },
  media: { oracleKey: 'media', reviewKey: 'media' },
  reliabilityItems: { oracleKey: 'reliabilityItems', reviewKey: 'reliability' },
  capabilityItems: { oracleKey: 'capabilityItems', reviewKey: 'capability' },
}

function citations(repo, reviewKey, limit = 8) {
  const key = repo.toLowerCase()
  const source = sourceByRepo.get(key)
  const pair = pairByRepo.get(key)
  const reviews = [pair?.a, pair?.b, arbitrationByRepo.get(key)].filter(Boolean)
  const seen = new Set()
  const output = []
  for (const review of reviews) {
    const values = reviewKey === 'media'
      ? (review.media ?? []).map((item) => item.excerpt)
      : (review[reviewKey] ?? [])
    for (const excerpt of values) {
      const normalized = signature(excerpt)
      if (!normalized || seen.has(normalized)) continue
      seen.add(normalized)
      output.push({ heading: nearestHeading(source, excerpt), excerpt })
      if (output.length >= limit) return output
    }
  }
  return output
}

function gapRows(families, direction, limit = 14) {
  const rows = []
  for (const row of evaluation.rows) {
    const familyGaps = Object.fromEntries(families.map((family) => {
      const config = familyConfig[family]
      const machine = row.evidence?.[family] ?? 0
      const oracle = row.human?.oracleEvidence?.[config.oracleKey] ?? 0
      return [family, { machine, oracle, gap: oracle - machine }]
    }))
    const rankGap = direction === 'under'
      ? Math.max(...Object.values(familyGaps).map((item) => item.gap))
      : Math.max(...Object.values(familyGaps).map((item) => -item.gap))
    if (rankGap <= 0) continue
    rows.push({
      repo: row.repo,
      practicalScore: row.score,
      oracleScore: row.human.total,
      familyGaps,
      citations: Object.fromEntries(families.map((family) => [family, citations(row.repo, familyConfig[family].reviewKey)])),
    })
  }
  return rows.sort((left, right) => {
    const leftGap = direction === 'under'
      ? Math.max(...Object.values(left.familyGaps).map((item) => item.gap))
      : Math.max(...Object.values(left.familyGaps).map((item) => -item.gap))
    const rightGap = direction === 'under'
      ? Math.max(...Object.values(right.familyGaps).map((item) => item.gap))
      : Math.max(...Object.values(right.familyGaps).map((item) => -item.gap))
    return rightGap - leftGap
  }).slice(0, limit)
}

const packs = [
  {
    name: 'actions-io',
    question: 'Diagnose recurring deterministic misses in usageActions and ioPairs.',
    families: ['usageActions', 'ioPairs'],
    under: gapRows(['usageActions', 'ioPairs'], 'under', 16),
    over: gapRows(['usageActions', 'ioPairs'], 'over', 6),
  },
  {
    name: 'usecases',
    question: 'Diagnose recurring deterministic usecaseItems misses and overcounts.',
    families: ['usecaseItems'],
    under: gapRows(['usecaseItems'], 'under', 16),
    over: gapRows(['usecaseItems'], 'over', 8),
  },
  {
    name: 'outputs-demo',
    question: 'Diagnose outputItems under-extraction and media over/under-counting.',
    families: ['outputItems', 'media'],
    under: gapRows(['outputItems', 'media'], 'under', 16),
    over: gapRows(['outputItems', 'media'], 'over', 12),
  },
  {
    name: 'reliability-capability',
    question: 'Diagnose reliabilityItems under-extraction and capabilityItems saturation/overcounting.',
    families: ['reliabilityItems', 'capabilityItems'],
    under: gapRows(['reliabilityItems', 'capabilityItems'], 'under', 18),
    over: gapRows(['reliabilityItems', 'capabilityItems'], 'over', 14),
  },
]

fs.mkdirSync(outputDir, { recursive: true })
for (const pack of packs) {
  const outputPath = path.join(outputDir, `${roundId}-${pack.name}.json`)
  fs.writeFileSync(outputPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    source: {
      cohortPath,
      evaluationPath,
      pairsPath,
    },
    invariant: 'No repository-specific exception; propose only cross-project deterministic rules with negative regressions.',
    ...pack,
  }, null, 2) + '\n')
  console.log(JSON.stringify({ outputPath, under: pack.under.length, over: pack.over.length }))
}
