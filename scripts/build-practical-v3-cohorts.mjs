#!/usr/bin/env node

/**
 * Build deterministic, non-overlapping Top-star README cohorts for Practical V3.
 * The blind NDJSON files contain only repo + README text; stars and catalog
 * metadata stay in the separate manifest and are never shown to reviewers.
 *
 * Usage:
 *   node scripts/build-practical-v3-cohorts.mjs \
 *     [data/registry-snapshot.json] \
 *     [/tmp/dsh-mall-practical-eval/readmes.ndjson] \
 *     [artifacts/practical-v3] \
 *     [cohort-count=3]
 */

import fs from 'node:fs'
import crypto from 'node:crypto'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const snapshotPath = path.resolve(process.argv[2] ?? path.join(ROOT, 'data/registry-snapshot.json'))
const readmesPath = path.resolve(process.argv[3] ?? '/tmp/dsh-mall-practical-eval/readmes.ndjson')
const outputDir = path.resolve(process.argv[4] ?? path.join(ROOT, 'artifacts/practical-v3'))
const COHORT_SIZE = 100
const cohortCountInput = Number(process.argv[5] ?? 3)
if (!Number.isSafeInteger(cohortCountInput) || cohortCountInput < 1) throw new Error(`Invalid cohort count: ${process.argv[5]}`)
const COHORT_COUNT = cohortCountInput

function readNdjson(file) {
  const source = fs.readFileSync(file, 'utf8').trim()
  return source === '' ? [] : source.split('\n').map((line, index) => {
    try {
      return JSON.parse(line)
    } catch (error) {
      throw new Error(`Invalid NDJSON at ${file}:${index + 1}: ${error.message}`)
    }
  })
}

const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'))
const entries = Array.isArray(snapshot) ? snapshot : snapshot.plugins
if (!Array.isArray(entries)) throw new Error(`No plugins array in ${snapshotPath}`)
const readmes = new Map(readNdjson(readmesPath).map((row) => [String(row.repo).toLowerCase(), row]))

const ranked = entries
  .map((entry, catalogIndex) => ({
    repo: `${entry.owner}/${entry.name}`,
    stars: entry.stars,
    catalogIndex,
    pluginStatus: entry.pluginStatus ?? 'unknown',
    category: entry.category ?? '',
  }))
  .filter((row) => Number.isFinite(row.stars))
  .sort((left, right) => right.stars - left.stars || left.catalogIndex - right.catalogIndex)

const cohorts = []
fs.mkdirSync(path.join(outputDir, 'blind'), { recursive: true })
for (let round = 0; round < COHORT_COUNT; round++) {
  const start = round * COHORT_SIZE
  const selected = ranked.slice(start, start + COHORT_SIZE)
  if (selected.length !== COHORT_SIZE) throw new Error(`Round ${round + 1} has only ${selected.length} entries`)
  const blind = selected.map((row) => {
    const readme = readmes.get(row.repo.toLowerCase())
    if (readme?.ok !== true || typeof readme.text !== 'string' || readme.text.trim() === '') {
      throw new Error(`Missing README for Top-star cohort entry ${row.repo}`)
    }
    return { repo: row.repo, text: readme.text }
  })
  const id = `round-${String(round + 1).padStart(2, '0')}`
  const blindPath = path.join(outputDir, 'blind', `${id}.ndjson`)
  const blindContent = blind.map((row) => JSON.stringify(row)).join('\n') + '\n'
  fs.writeFileSync(blindPath, blindContent)
  cohorts.push({
    id,
    selection: `GitHub stars ranks ${start + 1}-${start + COHORT_SIZE} from fixed snapshot`,
    startRank: start + 1,
    endRank: start + COHORT_SIZE,
    count: selected.length,
    maximumStars: selected[0].stars,
    minimumStars: selected.at(-1).stars,
    blindPath: path.relative(ROOT, blindPath),
    blindSha256: crypto.createHash('sha256').update(blindContent).digest('hex'),
    entries: selected.map((row, index) => ({ rank: start + index + 1, ...row })),
  })
}

const manifest = {
  generatedAt: new Date().toISOString(),
  snapshotPath,
  readmesPath,
  population: ranked.length,
  cohortSize: COHORT_SIZE,
  cohorts,
}
const manifestPath = path.join(outputDir, 'cohorts.json')
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
console.log(JSON.stringify({ manifestPath, cohorts: cohorts.map(({ id, count, maximumStars, minimumStars, blindPath }) => ({ id, count, maximumStars, minimumStars, blindPath })) }, null, 2))
