#!/usr/bin/env node

/** Verify two consecutive fresh Practical V3 acceptance reports use one unchanged algorithm. */

import fs from 'node:fs'
import crypto from 'node:crypto'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { isDeepStrictEqual } from 'node:util'

const reportPaths = process.argv.slice(2).map((file) => path.resolve(file))
if (reportPaths.length !== 2) throw new Error('Usage: validate-practical-v3-consecutive.mjs <first-evaluation.json> <second-evaluation.json>')
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const parserPath = path.resolve(process.env.DSH_MARKET_INDEX_PARSER ?? path.join(root, '../dsh-market-index/scripts/readme-signals.mjs'))
const bootstrapIssues = []
const parserSha256 = fs.existsSync(parserPath) ? sha256(parserPath) : null
if (parserSha256 === null) bootstrapIssues.push(`Current parser is missing or unreadable: ${parserPath}`)
const current = {
  algorithmFingerprint: {
    parserSha256,
    scorerSha256: sha256(path.join(root, 'lib/score.js')),
  },
  protocolFingerprint: {
    evaluatorSha256: sha256(path.join(root, 'scripts/evaluate-practical-v3-round.mjs')),
    metricsSha256: sha256(path.join(root, 'scripts/practical-v3-metrics.mjs')),
    rubricSha256: sha256(path.join(root, 'artifacts/practical-v3/practical-v3-evidence-oracle-rubric.md')),
    // Intentional: any validator change invalidates both acceptance reports and requires a fresh pair.
    consecutiveValidatorSha256: sha256(fileURLToPath(import.meta.url)),
  },
  oracleProtocolFingerprint: {
    pairValidatorSha256: sha256(path.join(root, 'scripts/validate-practical-v3-oracle.mjs')),
    semanticOwnershipSha256: sha256(path.join(root, 'scripts/practical-v3-semantic-ownership.mjs')),
    aggregatorSha256: sha256(path.join(root, 'scripts/aggregate-practical-v3-oracle.mjs')),
    metricsSha256: sha256(path.join(root, 'scripts/practical-v3-metrics.mjs')),
  },
}
const reports = reportPaths.map((file) => JSON.parse(fs.readFileSync(file, 'utf8')))
const issues = [...bootstrapIssues]
const evaluatorPath = path.join(root, 'scripts/evaluate-practical-v3-round.mjs')

function withoutGeneratedAt(value) {
  const copy = structuredClone(value)
  delete copy.generatedAt
  return copy
}

function verifyReproduction(report, label) {
  const cohortPath = typeof report.cohortPath === 'string' ? path.resolve(report.cohortPath) : null
  const ratingsPath = typeof report.ratingsPath === 'string' ? path.resolve(report.ratingsPath) : null
  if (!cohortPath || !fs.existsSync(cohortPath)) {
    issues.push(`${label} cohortPath is missing or unreadable`)
    return
  }
  if (!ratingsPath || !fs.existsSync(ratingsPath)) {
    issues.push(`${label} ratingsPath is missing or unreadable`)
    return
  }
  if (sha256(cohortPath) !== report.inputFingerprint?.cohortSha256) issues.push(`${label} cohort content does not match its fingerprint`)
  if (sha256(ratingsPath) !== report.inputFingerprint?.ratingsSha256) issues.push(`${label} ratings content does not match its fingerprint`)
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'practical-v3-reproduce-'))
  const reproducedPath = path.join(tempDir, 'evaluation.json')
  try {
    execFileSync(process.execPath, [evaluatorPath, cohortPath, ratingsPath, reproducedPath], {
      cwd: root,
      env: { ...process.env, DSH_MARKET_INDEX_PARSER: parserPath },
      stdio: 'pipe',
    })
    const reproduced = JSON.parse(fs.readFileSync(reproducedPath, 'utf8'))
    if (!isDeepStrictEqual(withoutGeneratedAt(report), withoutGeneratedAt(reproduced))) issues.push(`${label} does not exactly reproduce with the current evaluator and inputs`)
  } catch (error) {
    issues.push(`${label} could not be reproduced: ${error.message}`)
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
}

for (const [index, report] of reports.entries()) {
  const label = `report ${index + 1}`
  if (report.pass !== true) issues.push(`${label} did not pass every gate`)
  if (!Number.isSafeInteger(report.count) || report.count < 100) issues.push(`${label} has fewer than 100 projects`)
  if (!Array.isArray(report.rows) || report.rows.length !== report.count) {
    issues.push(`${label} missing complete evaluation rows`)
  } else {
    const repos = report.rows.map((row) => String(row.repo ?? '').toLowerCase())
    if (repos.some((repo) => repo === '')) issues.push(`${label} has a row without repo`)
    if (new Set(repos).size !== repos.length) issues.push(`${label} contains duplicate repos`)
  }
  if (!/^[a-f0-9]{64}$/.test(report.algorithmFingerprint?.parserSha256 ?? '')) issues.push(`${label} missing parser hash`)
  if (!/^[a-f0-9]{64}$/.test(report.algorithmFingerprint?.scorerSha256 ?? '')) issues.push(`${label} missing scorer hash`)
  if (!/^[a-f0-9]{64}$/.test(report.protocolFingerprint?.evaluatorSha256 ?? '')) issues.push(`${label} missing evaluator hash`)
  if (!/^[a-f0-9]{64}$/.test(report.protocolFingerprint?.metricsSha256 ?? '')) issues.push(`${label} missing metrics hash`)
  if (!/^[a-f0-9]{64}$/.test(report.protocolFingerprint?.rubricSha256 ?? '')) issues.push(`${label} missing rubric hash`)
  if (!/^[a-f0-9]{64}$/.test(report.protocolFingerprint?.consecutiveValidatorSha256 ?? '')) issues.push(`${label} missing consecutive-validator hash`)
  if (!/^[a-f0-9]{64}$/.test(report.oracleProtocolFingerprint?.pairValidatorSha256 ?? '')) issues.push(`${label} missing oracle pair-validator hash`)
  if (!/^[a-f0-9]{64}$/.test(report.oracleProtocolFingerprint?.semanticOwnershipSha256 ?? '')) issues.push(`${label} missing oracle semantic-ownership hash`)
  if (!/^[a-f0-9]{64}$/.test(report.oracleProtocolFingerprint?.aggregatorSha256 ?? '')) issues.push(`${label} missing oracle aggregator hash`)
  if (!/^[a-f0-9]{64}$/.test(report.oracleProtocolFingerprint?.metricsSha256 ?? '')) issues.push(`${label} missing oracle metrics hash`)
  if (!/^[a-f0-9]{64}$/.test(report.inputFingerprint?.cohortSha256 ?? '')) issues.push(`${label} missing cohort hash`)
  if (!/^[a-f0-9]{64}$/.test(report.inputFingerprint?.ratingsSha256 ?? '')) issues.push(`${label} missing ratings hash`)
  for (const section of ['algorithmFingerprint', 'protocolFingerprint', 'oracleProtocolFingerprint']) {
    for (const [key, expected] of Object.entries(current[section])) {
      if (report[section]?.[key] !== expected) issues.push(`${label} ${section}.${key} does not match current protocol`)
    }
  }
  verifyReproduction(report, label)
}

if (reports[0].inputFingerprint?.cohortSha256 === reports[1].inputFingerprint?.cohortSha256) issues.push('Cohorts are not fresh/non-overlapping: identical cohort hash')
const firstRows = Array.isArray(reports[0].rows) ? reports[0].rows : []
const secondRows = Array.isArray(reports[1].rows) ? reports[1].rows : []
const firstRepos = new Set(firstRows.map((row) => String(row.repo ?? '').toLowerCase()))
const secondRepos = new Set(secondRows.map((row) => String(row.repo ?? '').toLowerCase()))
const overlappingRepos = [...firstRepos].filter((repo) => repo !== '' && secondRepos.has(repo)).sort()
if (overlappingRepos.length > 0) issues.push(`Cohorts overlap on ${overlappingRepos.length} repos: ${overlappingRepos.slice(0, 10).join(', ')}`)
if (reports[0].algorithmFingerprint?.parserSha256 !== reports[1].algorithmFingerprint?.parserSha256) issues.push('Parser changed between acceptance rounds')
if (reports[0].algorithmFingerprint?.scorerSha256 !== reports[1].algorithmFingerprint?.scorerSha256) issues.push('Scorer changed between acceptance rounds')
for (const key of ['evaluatorSha256', 'metricsSha256', 'rubricSha256', 'consecutiveValidatorSha256']) {
  if (reports[0].protocolFingerprint?.[key] !== reports[1].protocolFingerprint?.[key]) issues.push(`${key} changed between acceptance rounds`)
}
for (const key of ['pairValidatorSha256', 'semanticOwnershipSha256', 'aggregatorSha256', 'metricsSha256']) {
  if (reports[0].oracleProtocolFingerprint?.[key] !== reports[1].oracleProtocolFingerprint?.[key]) issues.push(`oracle ${key} changed between acceptance rounds`)
}

const result = {
  reports: reportPaths,
  cohortHashes: reports.map((report) => report.inputFingerprint?.cohortSha256 ?? null),
  algorithmFingerprint: reports[0].algorithmFingerprint ?? null,
  protocolFingerprint: reports[0].protocolFingerprint ?? null,
  oracleProtocolFingerprint: reports[0].oracleProtocolFingerprint ?? null,
  issues,
  pass: issues.length === 0,
}
console.log(JSON.stringify(result, null, 2))
if (!result.pass) process.exitCode = 1
