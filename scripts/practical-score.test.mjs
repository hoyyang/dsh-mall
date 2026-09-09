import test from 'node:test'
import assert from 'node:assert/strict'
import { attachScores, computeBaseScore, enrichScore, scorePractical, scorePracticalDimensions } from '../lib/score.js'

const evidence = (overrides = {}) => ({
  version: 3,
  parserRevision: 3,
  capabilityItems: 0,
  usageItems: 0,
  usageActions: 0,
  ioPairs: 0,
  codeExamples: 0,
  usecaseItems: 0,
  outputItems: 0,
  media: 0,
  reliabilityItems: 0,
  confidence: { overall: 1, coverage: 1, fallbackShare: 0 },
  ...overrides,
})

const sig = (practical) => ({
  len: 1000,
  installSection: true,
  codeBlocks: 200,
  heading: true,
  cmds: ['npm install demo'],
  needsConfig: false,
  practical,
})

test('code examples contribute at most five points with mild diminishing returns', () => {
  assert.equal(scorePractical(evidence({ codeExamples: 0 })), 0)
  assert.equal(scorePractical(evidence({ codeExamples: 1 })), 1)
  assert.equal(scorePractical(evidence({ codeExamples: 3 })), 4)
  assert.equal(scorePractical(evidence({ codeExamples: 4 })), 5)
  assert.equal(scorePractical(evidence({ codeExamples: 300 })), 5)
})

test('length, installation and raw fence counts cannot create practical score', () => {
  const base = computeBaseScore({
    pushedAt: '2026-08-27T00:00:00Z', stars: 1, openIssues: 0, forks: 0,
    hasDescription: true, descriptionLen: 20, hasLicense: true, hasHomepage: false,
    topics: ['dsh-plugin'], p99Stars: 10, readmeSig: sig(null),
  })
  assert.equal(base.breakdown.practical, null)
})

test('partial current-revision counts are normalized to zero while stale parser evidence fails closed', () => {
  assert.equal(scorePractical({ version: 3, parserRevision: 3, capabilityItems: 4, confidence: { overall: 1, coverage: 1, fallbackShare: 0 } }), 9)
  assert.equal(scorePractical({ version: 3, capabilityItems: 4, confidence: { overall: 1, coverage: 1, fallbackShare: 0 } }), null)
  assert.equal(scorePractical({ version: 3, parserRevision: 1, capabilityItems: 4, confidence: { overall: 1, coverage: 1, fallbackShare: 0 } }), null)
  assert.equal(scorePractical(evidence({ capabilityItems: 0.5 })), 1)
  assert.equal(scorePractical(evidence({ capabilityItems: Number.NaN, media: Number.POSITIVE_INFINITY })), 0)
})

test('every valid unit has positive raw dimension value through each family cap', () => {
  const families = [
    ['capabilityItems', 'capability', 12],
    ['usageItems', 'usage', 10],
    ['usageActions', 'usage', 10],
    ['ioPairs', 'usage', 8],
    ['codeExamples', 'usage', 4],
    ['usecaseItems', 'usecases', 10],
    ['outputItems', 'demo', 8],
    ['media', 'demo', 6],
    ['reliabilityItems', 'reliability', 10],
  ]
  for (const [field, dimension, cap] of families) {
    let previous = scorePracticalDimensions(evidence())[dimension]
    for (let count = 1; count <= cap; count++) {
      const current = scorePracticalDimensions(evidence({ [field]: count }))[dimension]
      assert.ok(current > previous, `${field} stopped contributing at ${count}/${cap}`)
      previous = current
    }
  }
})

test('semantic deduplication and family caps bound mildly concave evidence credit', () => {
  const one = scorePractical(evidence({ usecaseItems: 1 }))
  const two = scorePractical(evidence({ usecaseItems: 2 }))
  const ten = scorePractical(evidence({ usecaseItems: 10 }))
  assert.equal(one, 3)
  assert.equal(two, 5)
  assert.ok(two - one < one)
  assert.equal(ten, 20)
})

test('score uses several capped evidence families', () => {
  assert.equal(scorePractical(evidence({
    capabilityItems: 12,
    usageItems: 10,
    usageActions: 10,
    ioPairs: 8,
    codeExamples: 4,
    usecaseItems: 10,
    outputItems: 8,
    media: 6,
    reliabilityItems: 10,
  })), 100)
})

test('stale legacy cache cannot restore practical after the v3 contract changes', () => {
  const staleScore = (practical) => ({
    total: 80,
    breakdown: { maintain: 80, practical, popularity: 80, ease: 80, signal: 80 },
    confidence: 1,
    explanation: { zh: '', en: '' },
    complete: true,
    starsAt: 1,
    pushedAt: '2026-08-27T00:00:00Z',
  })
  const entry = (practical, score) => ({
    stars: 1,
    pushed: '2026-08-27T00:00:00Z',
    openIssues: 0,
    forks: 0,
    description: 'demo',
    license: 'MIT',
    homepage: null,
    topics: ['dsh-plugin'],
    readmeSig: sig(practical),
    score,
    isPlugin: true,
  })

  const withV3 = entry(evidence({ capabilityItems: 4 }), staleScore(80))
  attachScores([withV3])
  assert.equal(withV3.score.breakdown.practical, 9)
  assert.match(withV3.score.practicalEvidenceAt, /^3:3:4:/)

  const missingV3 = entry(null, staleScore(80))
  attachScores([missingV3])
  assert.equal(missingV3.score.breakdown.practical, null)
  assert.equal(missingV3.score.practicalEvidenceAt, null)
})

test('README detail enrichment never overwrites canonical practical score', () => {
  const base = computeBaseScore({
    pushedAt: '2026-08-27T00:00:00Z', stars: 1, openIssues: 0, forks: 0,
    hasDescription: true, descriptionLen: 20, hasLicense: true, hasHomepage: false,
    topics: ['dsh-plugin'], p99Stars: 10,
    readmeSig: sig(evidence({ capabilityItems: 4 })),
  })
  assert.equal(base.breakdown.practical, 9)
  const enriched = enrichScore(base, '# Huge README\n```js\ncode\n```\n'.repeat(100), false, {
    description: 'demo', license: 'MIT', topics: ['dsh-plugin'],
  })
  assert.equal(enriched.breakdown.practical, 9)
  assert.equal(enriched.practicalEvidenceAt, base.practicalEvidenceAt)
})
