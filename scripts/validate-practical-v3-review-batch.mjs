#!/usr/bin/env node

/** Validate one blind evidence-oracle review file against its assigned README-only batch. */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { evidenceOwnershipIssues } from './practical-v3-semantic-ownership.mjs'

const batchPath = path.resolve(process.argv[2] ?? '')
const reviewPath = path.resolve(process.argv[3] ?? '')
if (!process.argv[2] || !process.argv[3]) throw new Error('Usage: validate-practical-v3-review-batch.mjs <batch.ndjson> <review.json>')

const STRING_FIELDS = ['capability', 'usageItems', 'usageActions', 'ioPairs', 'codeExamples', 'usecases', 'outputs', 'reliability']
const CAPS = { capability: 12, usageItems: 10, usageActions: 10, ioPairs: 8, codeExamples: 4, usecases: 10, outputs: 8, reliability: 10 }
const TYPES = new Set(['dsh-plugin', 'standalone-nonplugin', 'catalog-list', 'unclear'])

function normalized(value) {
  return String(value).trim().replace(/\s+/g, ' ').toLowerCase()
}

const batch = fs.readFileSync(batchPath, 'utf8').trim().split('\n').map(JSON.parse)
const value = JSON.parse(fs.readFileSync(reviewPath, 'utf8'))
const reviews = Array.isArray(value) ? value : value.reviews
if (!Array.isArray(reviews)) throw new Error(`Missing reviews array: ${reviewPath}`)
const sourceByRepo = new Map(batch.map((row) => [row.repo.toLowerCase(), row.text]))
const expected = new Set(sourceByRepo.keys())
const seenRepos = new Set()
const issues = []

if (reviews.length !== batch.length) issues.push(`Expected ${batch.length} reviews, got ${reviews.length}`)
for (let index = 0; index < Math.max(batch.length, reviews.length); index++) {
  if (reviews[index]?.repo !== batch[index]?.repo) issues.push(`Review order mismatch at row ${index + 1}: expected ${batch[index]?.repo}, got ${reviews[index]?.repo}`)
}
for (const review of reviews) {
  const key = String(review.repo).toLowerCase()
  const source = sourceByRepo.get(key)
  if (!source) {
    issues.push(`Unexpected repo ${review.repo}`)
    continue
  }
  if (seenRepos.has(key)) issues.push(`Duplicate review ${review.repo}`)
  seenRepos.add(key)
  if (!TYPES.has(review.inferredType)) issues.push(`${review.repo}: invalid inferredType ${review.inferredType}`)
  if (!Array.isArray(review.concerns)) issues.push(`${review.repo}: missing concerns array`)
  for (const field of STRING_FIELDS) {
    const excerpts = review[field]
    if (!Array.isArray(excerpts)) {
      issues.push(`${review.repo}: missing ${field} array`)
      continue
    }
    if (excerpts.length > CAPS[field]) issues.push(`${review.repo}: ${field} exceeds cap ${CAPS[field]}`)
    for (const excerpt of excerpts) {
      if (typeof excerpt !== 'string' || excerpt.length === 0 || excerpt.length > 220) {
        issues.push(`${review.repo}: invalid ${field} excerpt length`)
        continue
      }
      if (!source.includes(excerpt)) issues.push(`${review.repo}: non-verbatim ${field}: ${JSON.stringify(excerpt)}`)
    }
  }
  for (const issue of evidenceOwnershipIssues(review)) issues.push(`${review.repo}: ${issue}`)
  if (!Array.isArray(review.media)) {
    issues.push(`${review.repo}: missing media array`)
  } else {
    const mediaSeen = new Set()
    const weight = review.media.reduce((sum, item) => sum + Number(item?.weight ?? 0), 0)
    if (weight > 6) issues.push(`${review.repo}: media exceeds cap 6`)
    for (const item of review.media) {
      if (![0.5, 1].includes(item?.weight)) issues.push(`${review.repo}: invalid media weight`)
      if (typeof item?.excerpt !== 'string' || item.excerpt.length === 0 || item.excerpt.length > 220 || !source.includes(item.excerpt)) {
        issues.push(`${review.repo}: invalid/non-verbatim media excerpt`)
        continue
      }
      const signature = normalized(item.excerpt)
      if (mediaSeen.has(signature)) issues.push(`${review.repo}: duplicate media excerpt`)
      mediaSeen.add(signature)
    }
  }
}
for (const key of expected) if (!seenRepos.has(key)) issues.push(`Missing review ${key}`)

const report = { batchPath, reviewPath, expected: batch.length, reviewed: reviews.length, issues }
console.log(JSON.stringify(report, null, 2))
if (issues.length > 0) process.exitCode = 1
