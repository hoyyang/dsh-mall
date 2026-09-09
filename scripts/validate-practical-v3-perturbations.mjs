#!/usr/bin/env node

/** Validate Practical V3 invariants across frozen README cohorts. */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import { scorePractical } from '../lib/score.js'

const ROOT = path.resolve(import.meta.dirname, '..')
const parserPath = path.resolve(process.env.DSH_MARKET_INDEX_PARSER ?? path.join(ROOT, '../dsh-market-index/scripts/readme-signals.mjs'))
const cohortCount = Number(process.argv[2] ?? 5)
const outputPath = path.resolve(process.argv[3] ?? path.join(ROOT, 'artifacts/practical-v3/practical-v3-perturbation-validation.json'))
if (!Number.isSafeInteger(cohortCount) || cohortCount < 1) throw new Error(`Invalid cohort count: ${process.argv[2]}`)

const { practicalEvidence, README_PRACTICAL_PARSER_REVISION, README_PRACTICAL_VERSION } = await import(pathToFileURL(parserPath))
if (README_PRACTICAL_VERSION !== 3 || README_PRACTICAL_PARSER_REVISION !== 3) {
  throw new Error(`Expected Practical V3 parser revision 3, got v${README_PRACTICAL_VERSION}/r${README_PRACTICAL_PARSER_REVISION}`)
}

function evidence(raw) {
  return raw == null ? null : {
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
}

function score(text) {
  return scorePractical(evidence(practicalEvidence(text)))
}

function percentile(values, quantile) {
  if (values.length === 0) return 0
  const sorted = [...values].sort((left, right) => left - right)
  return sorted[Math.ceil(sorted.length * quantile) - 1]
}

const rows = []
for (let round = 1; round <= cohortCount; round++) {
  const cohortPath = path.join(ROOT, `artifacts/practical-v3/blind/round-${String(round).padStart(2, '0')}.ndjson`)
  const lines = fs.readFileSync(cohortPath, 'utf8').trim().split('\n')
  for (const line of lines) rows.push(JSON.parse(line))
}

const transforms = {
  installConfig: {
    mutate: (text) => `${text}\n\n## Installation\n\`\`\`bash\nnpm install irrelevant-package\n\`\`\`\n## Configuration\nSet \`IRRELEVANT_API_KEY=demo\`.\n`,
    p95Maximum: 0,
    absoluteMaximum: 0,
  },
  duplicateDocument: {
    mutate: (text) => `${text}\n\n${text}`,
    p95Maximum: 0,
    absoluteMaximum: 0,
  },
  irrelevantFence: {
    mutate: (text) => `${text}\n\n## Notes\n\`\`\`txt\nthis fence is not an operational example\n\`\`\`\n`,
    p95Maximum: 0,
    absoluteMaximum: 2,
  },
  marketingProse: {
    mutate: (text) => `${text}\n\n## About\nThe revolutionary future of agent productivity is finally here. Best-in-class, seamless, powerful, and delightful.\n`,
    p95Maximum: 0,
    absoluteMaximum: 2,
  },
  decorativeMedia: {
    mutate: (text) => `${text}\n\n![build badge](https://img.shields.io/badge/build-passing-green)\n![project logo](assets/logo.png)\n`,
    p95Maximum: 0,
    absoluteMaximum: 0,
  },
}

const results = {}
for (const [name, config] of Object.entries(transforms)) {
  const changes = []
  const deltas = []
  for (const row of rows) {
    const before = score(row.text)
    const after = score(config.mutate(row.text))
    const delta = after - before
    const absoluteDelta = Math.abs(delta)
    deltas.push(absoluteDelta)
    if (delta !== 0) changes.push({ repo: row.repo, before, after, delta })
  }
  const p95 = percentile(deltas, 0.95)
  const maximum = Math.max(...deltas)
  results[name] = {
    changed: changes.length,
    p95AbsoluteDelta: p95,
    maximumAbsoluteDelta: maximum,
    p95Maximum: config.p95Maximum,
    absoluteMaximum: config.absoluteMaximum,
    pass: p95 <= config.p95Maximum && maximum <= config.absoluteMaximum,
    examples: changes.slice(0, 20),
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  parserPath,
  cohortCount,
  projectCount: rows.length,
  invariant: 'README length, installation/configuration, duplicate text, irrelevant fences, marketing prose, and decorative media cannot materially inflate Practical V3.',
  results,
  pass: Object.values(results).every((result) => result.pass),
}
fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify(report, null, 2))
if (!report.pass) process.exitCode = 1
