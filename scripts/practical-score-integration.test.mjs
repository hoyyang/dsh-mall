import fs from 'node:fs'
import test from 'node:test'
import assert from 'node:assert/strict'
import { attachScores, enrichScore } from '../lib/score.js'

const snapshot = JSON.parse(fs.readFileSync(new URL('../data/registry-snapshot.json', import.meta.url), 'utf8'))
const syntheticDetailReadme = `
# Detail-only README
## Installation
1. Install this package.
\`\`\`bash
npm install demo
\`\`\`
## Configuration
- Set API_KEY before launch.
`

test('all snapshot entries keep one canonical practical value through detail enrichment', () => {
  for (const entry of snapshot.plugins) entry.score = null
  attachScores(snapshot.plugins, true)
  let mismatches = 0
  let missing = 0
  let complete = 0
  const examples = []
  for (const entry of snapshot.plugins) {
    const repo = `${entry.owner}/${entry.name}`
    const listPractical = entry.score?.breakdown?.practical ?? null
    if (listPractical === null) missing++
    else complete++
    if (entry.score == null) continue
    const detail = enrichScore(entry.score, syntheticDetailReadme, true, {
      stars: entry.stars,
      pushedAt: entry.pushed,
      curated: entry.curated === true,
      verified: entry.verified != null,
      bundled: entry.bundled === true,
      description: entry.description,
      license: entry.license,
      topics: entry.topics ?? [],
      hasHomepage: typeof entry.homepage === 'string' && entry.homepage !== '',
    })
    const detailPractical = detail.breakdown.practical
    if (detailPractical !== listPractical) {
      mismatches++
      if (examples.length < 20) examples.push({ repo, listPractical, detailPractical })
    }
  }
  const expectedComplete = snapshot.plugins.filter((entry) => entry.readmeSig?.practical?.version === 3 && entry.readmeSig?.practical?.parserRevision === 3).length
  const report = { total: snapshot.plugins.length, complete, missing, mismatches, examples }
  console.log(JSON.stringify(report, null, 2))
  assert.equal(complete, expectedComplete)
  assert.equal(missing, snapshot.plugins.length - expectedComplete)
  assert.equal(mismatches, 0)
})
