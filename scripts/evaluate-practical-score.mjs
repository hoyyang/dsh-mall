#!/usr/bin/env node

/**
 * Offline comparison between the retired practical formula and canonical v2.
 * Reads a bundled registry snapshot; never mutates runtime state.
 *
 * Usage:
 *   node scripts/evaluate-practical-score.mjs \
 *     [data/registry-snapshot.json] \
 *     [artifacts/practical-score-comparison.csv]
 */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { scoreEaseFromSig, scorePractical } from '../lib/score.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const inputPath = path.resolve(process.argv[2] ?? path.join(ROOT, 'data/registry-snapshot.json'))
const outputPath = path.resolve(process.argv[3] ?? path.join(ROOT, 'artifacts/practical-score-comparison.csv'))
const summaryPath = path.join(path.dirname(outputPath), 'practical-score-evaluation-summary.json')

/** Frozen historical baseline; never called by runtime scoring. */
export function scorePracticalOld(sig) {
  if (sig?.len == null) return null
  let score = sig.len > 2_000 ? 30 : sig.len > 500 ? 20 : sig.len > 0 ? 10 : 0
  if (sig.installSection) score += 30
  if (sig.codeBlocks >= 2) score += 20
  return Math.max(0, Math.min(100, Math.round(score)))
}

function mean(values) {
  return values.length === 0 ? null : values.reduce((sum, value) => sum + value, 0) / values.length
}

function ranks(values) {
  const sorted = values.map((value, index) => ({ value, index })).filter((row) => Number.isFinite(row.value)).sort((a, b) => a.value - b.value)
  const output = Array(values.length).fill(null)
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
  const pairs = left.map((value, index) => [value, right[index]]).filter((pair) => pair.every(Number.isFinite))
  if (pairs.length < 2) return null
  const leftMean = mean(pairs.map(([value]) => value))
  const rightMean = mean(pairs.map(([, value]) => value))
  let numerator = 0
  let leftSquare = 0
  let rightSquare = 0
  for (const [leftValue, rightValue] of pairs) {
    numerator += (leftValue - leftMean) * (rightValue - rightMean)
    leftSquare += (leftValue - leftMean) ** 2
    rightSquare += (rightValue - rightMean) ** 2
  }
  return leftSquare === 0 || rightSquare === 0 ? null : numerator / Math.sqrt(leftSquare * rightSquare)
}

function spearman(left, right) {
  const pairs = left.map((value, index) => [value, right[index]]).filter((pair) => pair.every(Number.isFinite))
  if (pairs.length < 2) return null
  return pearson(ranks(pairs.map(([value]) => value)), ranks(pairs.map(([, value]) => value)))
}

function summarize(values) {
  const scored = values.filter(Number.isFinite).sort((a, b) => a - b)
  const distribution = new Map()
  for (const value of scored) distribution.set(value, (distribution.get(value) ?? 0) + 1)
  const quantile = (p) => scored[Math.floor((scored.length - 1) * p)]
  const average = mean(scored)
  const mode = [...distribution.entries()].sort((left, right) => right[1] - left[1])[0]
  const entropyBits = -[...distribution.values()].reduce((sum, count) => {
    const p = count / scored.length
    return sum + p * Math.log2(p)
  }, 0)
  return {
    count: scored.length,
    missing: values.length - scored.length,
    mean: Number(average.toFixed(3)),
    standardDeviation: Number(Math.sqrt(scored.reduce((sum, value) => sum + (value - average) ** 2, 0) / scored.length).toFixed(3)),
    min: scored[0],
    p10: quantile(0.1),
    p25: quantile(0.25),
    median: quantile(0.5),
    p75: quantile(0.75),
    p90: quantile(0.9),
    p95: quantile(0.95),
    max: scored.at(-1),
    uniqueValues: distribution.size,
    mode: { score: mode[0], count: mode[1], share: Number((mode[1] / scored.length).toFixed(6)) },
    entropyBits: Number(entropyBits.toFixed(3)),
    shareAtMost20: Number((scored.filter((value) => value <= 20).length / scored.length).toFixed(6)),
    shareAtLeast80: Number((scored.filter((value) => value >= 80).length / scored.length).toFixed(6)),
  }
}

function csvCell(value) {
  if (value == null) return ''
  const text = String(value)
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

export function runEvaluation(sourcePath = inputPath, destinationPath = outputPath) {
  const snapshot = JSON.parse(fs.readFileSync(sourcePath, 'utf8'))
  const entries = Array.isArray(snapshot) ? snapshot : snapshot.plugins
  if (!Array.isArray(entries)) throw new Error(`No plugins array in ${sourcePath}`)

  const rows = entries.map((entry) => {
    const oldScore = scorePracticalOld(entry.readmeSig)
    const practicalV2 = scorePractical(entry.readmeSig?.practical)
    const ease = entry.readmeSig == null ? null : scoreEaseFromSig(entry.readmeSig)
    return {
      repo: `${entry.owner}/${entry.name}`,
      pluginStatus: entry.pluginStatus ?? '',
      category: entry.category ?? '',
      readmeLength: entry.readmeSig?.len ?? null,
      fenceMarkCount: entry.readmeSig?.codeBlocks ?? null,
      practicalVersion: entry.readmeSig?.practical?.version ?? null,
      oldScore,
      practicalV2,
      delta: oldScore == null || practicalV2 == null ? null : practicalV2 - oldScore,
      ease,
    }
  })

  fs.mkdirSync(path.dirname(destinationPath), { recursive: true })
  const columns = Object.keys(rows[0])
  fs.writeFileSync(destinationPath, [columns.join(','), ...rows.map((row) => columns.map((column) => csvCell(row[column])).join(','))].join('\n') + '\n')

  const byCategory = Object.fromEntries([...new Set(rows.map((row) => row.category))].sort().map((category) => {
    const group = rows.filter((row) => row.category === category)
    return [category, summarize(group.map((row) => row.practicalV2))]
  }))
  const report = {
    generatedAt: new Date().toISOString(),
    inputPath: sourcePath,
    outputPath: destinationPath,
    population: rows.length,
    formula: {
      version: 2,
      weights: { capability: 25, usage: 25, usecases: 20, demo: 15, reliability: 15 },
      codeExamplesMaximum: 5,
      excludedInputs: ['README length', 'installation', 'configuration', 'stars/downloads', 'identity/catalog policy'],
    },
    old: summarize(rows.map((row) => row.oldScore)),
    practicalV2: summarize(rows.map((row) => row.practicalV2)),
    correlations: {
      oldVsV2Spearman: spearman(rows.map((row) => row.oldScore), rows.map((row) => row.practicalV2)),
      v2VsFenceMarkersSpearman: spearman(rows.map((row) => row.practicalV2), rows.map((row) => row.fenceMarkCount)),
      oldVsEasePearson: pearson(rows.map((row) => row.oldScore), rows.map((row) => row.ease)),
      v2VsEasePearson: pearson(rows.map((row) => row.practicalV2), rows.map((row) => row.ease)),
    },
    categories: byCategory,
  }
  fs.writeFileSync(summaryPath, JSON.stringify(report, null, 2) + '\n')
  return report
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(runEvaluation(), null, 2))
}
