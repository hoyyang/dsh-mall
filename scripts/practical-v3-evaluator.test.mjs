import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import crypto from 'node:crypto'
import os from 'node:os'
import path from 'node:path'
import { execFileSync, spawnSync } from 'node:child_process'
import { scorePractical } from '../lib/score.js'
import { practicalEvidence } from '../../dsh-market-index/scripts/readme-signals.mjs'
import { consensusType, fairnessMetrics, fractionalTopKRecall, gateResult } from './practical-v3-metrics.mjs'
import { evidenceOwnershipIssues, semanticExcerptSignature } from './practical-v3-semantic-ownership.mjs'

const ROOT = path.resolve(import.meta.dirname, '..')
const parserPath = path.resolve(ROOT, '../dsh-market-index/scripts/readme-signals.mjs')
const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')

test('gate decisions use raw values instead of rounded display values', () => {
  assert.deepEqual(gateResult(0.7496, { threshold: 0.75 }), { rawValue: 0.7496, value: 0.75, threshold: 0.75, pass: false })
  assert.deepEqual(gateResult(0.1004, { maximum: 0.1 }), { rawValue: 0.1004, value: 0.1, maximum: 0.1, pass: false })
  assert.equal(gateResult(0.75, { threshold: 0.75 }).pass, true)
  assert.equal(gateResult(0.1, { maximum: 0.1 }).pass, true)
  assert.deepEqual(gateResult(null, { threshold: 0.75 }), { rawValue: null, value: null, threshold: 0.75, pass: false })
})

test('fractional top-k recall is tie-safe and independent of item identity or input order', () => {
  assert.equal(fractionalTopKRecall([4, 3, 2, 1], [4, 3, 2, 1], 1), 1)
  assert.equal(fractionalTopKRecall([1, 1, 1, 1], [4, 3, 2, 1], 1), 0.25)
  assert.equal(fractionalTopKRecall([1, 1, 1, 1], [1, 1, 1, 1], 1), 1)
  assert.equal(fractionalTopKRecall([3, 3, 2, 1], [3, 3, 2, 1], 1), 1)
  assert.equal(fractionalTopKRecall([1, 3, 3, 2], [1, 3, 3, 2], 1), 1)
})

test('diagnostic type consensus is symmetric and requires a reviewer majority', () => {
  assert.equal(consensusType('dsh-plugin', 'dsh-plugin'), 'dsh-plugin')
  assert.equal(consensusType('dsh-plugin', 'standalone-nonplugin'), 'unclear')
  assert.equal(consensusType('standalone-nonplugin', 'dsh-plugin'), 'unclear')
  assert.equal(consensusType('dsh-plugin', 'standalone-nonplugin', 'standalone-nonplugin'), 'standalone-nonplugin')
  assert.throws(() => consensusType('dsh-plugin'), /Expected two or three/)
})

test('fairness metrics include eligible type-language intersections and reject missing strata', () => {
  const rows = []
  for (const type of ['plugin', 'standalone']) for (const language of ['mixed', 'non-cjk']) {
    for (let index = 0; index < 10; index++) rows.push({ repo: `${type}-${language}-${index}`, type, language, error: type === 'plugin' && language === 'mixed' && index < 2 ? 20 : 0 })
  }
  const fairness = fairnessMetrics(rows)
  assert.equal(fairness.byType.plugin.severeErrorRate, 0.1)
  assert.equal(fairness.byLanguage.mixed.severeErrorRate, 0.1)
  assert.equal(fairness.byTypeLanguage['plugin × mixed'].severeErrorRate, 0.2)
  assert.equal(fairness.maximumStratumSevereRate, 0.2)
  const boundaryRows = [
    ...Array.from({ length: 10 }, (_, index) => ({ repo: `low-${index}`, type: 'plugin', language: 'low', error: 0 })),
    ...Array.from({ length: 10 }, (_, index) => ({ repo: `high-${index}`, type: 'plugin', language: 'high', error: 5.0004 })),
  ]
  const boundaryFairness = fairnessMetrics(boundaryRows)
  assert.equal(boundaryFairness.byLanguage.high.meanError, 5)
  assert.ok(Math.abs(boundaryFairness.languageMeanResidualGap - 5.0004) < 1e-12)
  assert.equal(gateResult(boundaryFairness.languageMeanResidualGap, { maximum: 5 }).pass, false)
  assert.throws(() => fairnessMetrics([{ repo: 'missing-language', type: 'plugin', error: 0 }]), /missing type\/language\/error/)
})

function oracleEvidence(overrides = {}) {
  return {
    version: 3,
    parserRevision: 3,
    capabilityItems: 12,
    usageItems: 10,
    usageActions: 10,
    ioPairs: 8,
    codeExamples: 4,
    usecaseItems: 10,
    outputItems: 8,
    media: 6,
    reliabilityItems: 10,
    confidence: { overall: 1, coverage: 1, fallbackShare: 0 },
    ...overrides,
  }
}

function reviewFromCapabilities(repo, capabilities) {
  return {
    repo,
    inferredType: 'dsh-plugin',
    capability: capabilities,
    usageItems: [],
    usageActions: [],
    ioPairs: [],
    codeExamples: [],
    usecases: [],
    outputs: [],
    media: [],
    reliability: [],
    concerns: [],
  }
}

function buildCanonicalOraclePipeline(temp, round, prefix, { disagreement = false, disagreementIndices = disagreement ? [11] : [] } = {}) {
  const cohortPath = path.join(temp, `round-${round}.ndjson`)
  const reviewsDir = path.join(temp, 'reviews')
  const pairsPath = path.join(temp, `pairs-${round}.json`)
  const ratingsPath = path.join(temp, `ratings-${round}.json`)
  const reportPath = path.join(temp, `report-${round}.json`)
  fs.mkdirSync(reviewsDir, { recursive: true })
  const cohort = []
  const reviewsA = []
  const reviewsB = []
  for (let index = 0; index < 100; index++) {
    const repo = `${prefix}/project-${index}`
    const count = index % 12 + 1
    const capabilities = Array.from({ length: count }, (_, item) => `- Capability ${item + 1} supports deterministic workflow ${item + 1} for users.`)
    const text = `# Project ${index}\n\n## Features\n${capabilities.join('\n')}\n`
    cohort.push({ repo, text })
    reviewsA.push(reviewFromCapabilities(repo, capabilities))
    reviewsB.push(reviewFromCapabilities(repo, disagreementIndices.includes(index) ? capabilities.slice(0, 1) : capabilities))
  }
  fs.writeFileSync(cohortPath, `${cohort.map(JSON.stringify).join('\n')}\n`)
  fs.writeFileSync(path.join(reviewsDir, `round-${round}-oracle-01-a.json`), `${JSON.stringify({ reviews: reviewsA })}\n`)
  fs.writeFileSync(path.join(reviewsDir, `round-${round}-oracle-01-b.json`), `${JSON.stringify({ reviews: reviewsB })}\n`)
  execFileSync(process.execPath, [path.join(ROOT, 'scripts/validate-practical-v3-oracle.mjs'), cohortPath, reviewsDir, pairsPath], { cwd: ROOT, stdio: 'pipe' })
  if (!disagreement) {
    execFileSync(process.execPath, [path.join(ROOT, 'scripts/aggregate-practical-v3-oracle.mjs'), cohortPath, pairsPath, reviewsDir, ratingsPath], { cwd: ROOT, stdio: 'pipe' })
    execFileSync(process.execPath, [path.join(ROOT, 'scripts/evaluate-practical-v3-round.mjs'), cohortPath, ratingsPath, reportPath], {
      cwd: ROOT,
      env: { ...process.env, DSH_MARKET_INDEX_PARSER: parserPath },
      stdio: 'pipe',
    })
  }
  return { cohortPath, reviewsDir, pairsPath, ratingsPath, reportPath }
}

test('evidence ownership rejects reformatted units and cross-family semantic overlap', () => {
  const base = reviewFromCapabilities('owner/project', ['The plugin builds an HTML report after every run.'])
  assert.deepEqual(evidenceOwnershipIssues(base), [])
  assert.equal(semanticExcerptSignature('**Build report**'), 'build report')
  assert.equal(semanticExcerptSignature('[Build report](https://example.com/a_(b))'), 'build report')
  assert.equal(semanticExcerptSignature('## Demo\n- **Build report.**'), 'build report')
  assert.equal(semanticExcerptSignature('| Build report |'), 'build report')
  assert.equal(semanticExcerptSignature('Build **report**'), 'build report')
  assert.equal(semanticExcerptSignature('Supports foo_bar'), 'supports foo_bar')
  assert.equal(semanticExcerptSignature('Supports a*b'), 'supports a*b')

  const identifierCollision = reviewFromCapabilities('owner/project', ['Supports foo_bar', 'Supports foobar'])
  assert.deepEqual(evidenceOwnershipIssues(identifierCollision), [])

  const sameFamilyReformat = reviewFromCapabilities('owner/project', ['- Build report.', 'Build report'])
  assert.deepEqual(evidenceOwnershipIssues(sameFamilyReformat), ['duplicate capability excerpt'])

  const exact = structuredClone(base)
  exact.outputs = ['The plugin builds an HTML report after every run.']
  assert.deepEqual(evidenceOwnershipIssues(exact), ['semantic duplicate in capability/outputs'])

  const contained = structuredClone(base)
  contained.outputs = ['builds an HTML report']
  assert.deepEqual(evidenceOwnershipIssues(contained), ['semantic overlap in capability/outputs'])

  const cjk = reviewFromCapabilities('owner/project', ['插件会生成 HTML 报告并保存到工作区。'])
  cjk.outputs = ['生成 HTML 报告']
  assert.deepEqual(evidenceOwnershipIssues(cjk), ['semantic overlap in capability/outputs'])

  const structural = structuredClone(base)
  structural.usageActions = ['builds an HTML report']
  structural.ioPairs = ['builds an HTML report']
  structural.codeExamples = ['builds an HTML report']
  assert.deepEqual(evidenceOwnershipIssues(structural), [])

  const incidentalWord = structuredClone(base)
  incidentalWord.outputs = ['report']
  assert.deepEqual(evidenceOwnershipIssues(incidentalWord), [])

  const prefixCollision = reviewFromCapabilities('owner/project', ['The interface supports dark models.'])
  prefixCollision.outputs = ['dark mode']
  assert.deepEqual(evidenceOwnershipIssues(prefixCollision), [])
})

test('review-batch validator rejects same-family reformatting and cross-family containment before aggregation', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'practical-v3-semantic-batch-'))
  try {
    const text = '# Demo\n\nThe plugin builds an HTML report after every run.\n'
    const batchPath = path.join(temp, 'batch.ndjson')
    const reviewPath = path.join(temp, 'review.json')
    const review = reviewFromCapabilities('owner/project', ['The plugin builds an HTML report after every run.'])
    fs.writeFileSync(batchPath, `${JSON.stringify({ repo: review.repo, text })}\n`)
    review.capability.push('**The plugin builds an HTML report after every run.**')
    fs.writeFileSync(reviewPath, `${JSON.stringify({ reviews: [review] })}\n`)
    let result = spawnSync(process.execPath, [path.join(ROOT, 'scripts/validate-practical-v3-review-batch.mjs'), batchPath, reviewPath], { cwd: ROOT, encoding: 'utf8' })
    assert.notEqual(result.status, 0)
    assert.match(result.stdout, /duplicate capability excerpt/)

    review.capability.pop()
    review.usageActions = ['builds an HTML report', '**builds an HTML report**']
    fs.writeFileSync(reviewPath, `${JSON.stringify({ reviews: [review] })}\n`)
    result = spawnSync(process.execPath, [path.join(ROOT, 'scripts/validate-practical-v3-review-batch.mjs'), batchPath, reviewPath], { cwd: ROOT, encoding: 'utf8' })
    assert.notEqual(result.status, 0)
    assert.match(result.stdout, /duplicate usageActions excerpt/)

    review.usageActions = []
    review.outputs = ['builds an HTML report']
    fs.writeFileSync(reviewPath, `${JSON.stringify({ reviews: [review] })}\n`)
    result = spawnSync(process.execPath, [path.join(ROOT, 'scripts/validate-practical-v3-review-batch.mjs'), batchPath, reviewPath], { cwd: ROOT, encoding: 'utf8' })
    assert.notEqual(result.status, 0)
    assert.match(result.stdout, /semantic overlap in capability\/outputs/)
  } finally {
    fs.rmSync(temp, { recursive: true, force: true })
  }
})

test('evaluator recomputes oracle totals from evidence instead of stale reviewer totals', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'practical-v3-evaluator-'))
  try {
    const cohortPath = path.join(temp, 'round-99.ndjson')
    const ratingsPath = path.join(temp, 'ratings.json')
    const outputPath = path.join(temp, 'evaluation.json')
    const cohort = []
    const reviews = []
    for (let index = 0; index < 100; index++) {
      const repo = `owner/project-${String(index).padStart(3, '0')}`
      cohort.push({ repo, text: '# Demo\n\nDescription only.\n' })
      const evidence = oracleEvidence({ capabilityItems: index % 13 })
      reviews.push({
        repo,
        inferredType: index < 50 ? 'dsh-plugin' : 'standalone-nonplugin',
        total: 123,
        capability: 123,
        usage: 0,
        usecases: 0,
        demo: 0,
        reliability: 0,
        oracleEvidence: evidence,
        concern: '',
      })
    }
    fs.writeFileSync(cohortPath, `${cohort.map(JSON.stringify).join('\n')}\n`)
    fs.writeFileSync(ratingsPath, `${JSON.stringify({ reviews })}\n`)
    execFileSync(process.execPath, [
      path.join(ROOT, 'scripts/evaluate-practical-v3-round.mjs'),
      cohortPath,
      ratingsPath,
      outputPath,
    ], {
      cwd: ROOT,
      env: { ...process.env, DSH_MARKET_INDEX_PARSER: parserPath },
      stdio: 'pipe',
    })
    const report = JSON.parse(fs.readFileSync(outputPath, 'utf8'))
    for (const [index, row] of report.rows.entries()) {
      assert.equal(row.human.ratingTotal, 123)
      assert.equal(row.human.total, scorePractical(reviews[index].oracleEvidence))
      assert.notEqual(row.human.total, row.human.ratingTotal)
      assert.equal(row.error, row.score - row.human.total)
    }
    assert.match(report.algorithmFingerprint.parserSha256, /^[a-f0-9]{64}$/)
    assert.match(report.algorithmFingerprint.scorerSha256, /^[a-f0-9]{64}$/)
    assert.match(report.protocolFingerprint.evaluatorSha256, /^[a-f0-9]{64}$/)
    assert.match(report.protocolFingerprint.metricsSha256, /^[a-f0-9]{64}$/)
    assert.match(report.protocolFingerprint.rubricSha256, /^[a-f0-9]{64}$/)
    assert.match(report.inputFingerprint.cohortSha256, /^[a-f0-9]{64}$/)
    assert.match(report.inputFingerprint.ratingsSha256, /^[a-f0-9]{64}$/)
    assert.ok('stratumSevereErrorRate' in report.gates)
    assert.ok('languageMeanResidualGap' in report.gates)
    assert.ok(report.diagnostics.byTypeLanguage)
    assert.equal(Object.values(report.diagnostics.byTypeLanguage).reduce((sum, group) => sum + group.n, 0), 100)

    const runInvalid = (message) => {
      const result = spawnSync(process.execPath, [path.join(ROOT, 'scripts/evaluate-practical-v3-round.mjs'), cohortPath, ratingsPath, outputPath], {
        cwd: ROOT,
        env: { ...process.env, DSH_MARKET_INDEX_PARSER: parserPath },
        encoding: 'utf8',
      })
      assert.notEqual(result.status, 0)
      assert.match(result.stderr, message)
    }
    delete reviews[0].oracleEvidence
    reviews[0].total = 100
    fs.writeFileSync(ratingsPath, `${JSON.stringify({ reviews })}\n`)
    runInvalid(/Missing Practical V3 parser revision 3 oracleEvidence/)
    reviews[0].oracleEvidence = oracleEvidence({ version: 2 })
    fs.writeFileSync(ratingsPath, `${JSON.stringify({ reviews })}\n`)
    runInvalid(/Missing Practical V3 parser revision 3 oracleEvidence/)
  } finally {
    fs.rmSync(temp, { recursive: true, force: true })
  }
})

test('oracle pair replay enforces review order, required concerns, and media uniqueness', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'practical-v3-pair-validation-'))
  try {
    const runMutation = (mutate) => {
      const caseDir = fs.mkdtempSync(path.join(temp, 'case-'))
      const pipeline = buildCanonicalOraclePipeline(caseDir, '96', 'pair-validation')
      const reviewPath = path.join(pipeline.reviewsDir, 'round-96-oracle-01-a.json')
      const value = JSON.parse(fs.readFileSync(reviewPath, 'utf8'))
      mutate(value.reviews)
      fs.writeFileSync(reviewPath, `${JSON.stringify(value)}\n`)
      const result = spawnSync(process.execPath, [path.join(ROOT, 'scripts/validate-practical-v3-oracle.mjs'), pipeline.cohortPath, pipeline.reviewsDir, pipeline.pairsPath], { cwd: ROOT, encoding: 'utf8' })
      assert.notEqual(result.status, 0)
      return `${result.stdout}\n${result.stderr}`
    }
    assert.match(runMutation((reviews) => { [reviews[0], reviews[1]] = [reviews[1], reviews[0]] }), /review order mismatch/)
    assert.match(runMutation((reviews) => { delete reviews[0].concerns }), /missing concerns array/)
    assert.match(runMutation((reviews) => {
      const excerpt = reviews[0].capability[0]
      reviews[0].outputs = [excerpt.slice(excerpt.indexOf('supports'))]
    }), /semantic overlap in capability\/outputs/)
    assert.match(runMutation((reviews) => { const excerpt = reviews[0].capability[0]; reviews[0].media = [{ excerpt, weight: 1 }, { excerpt, weight: 1 }] }), /duplicate media excerpt/)
  } finally {
    fs.rmSync(temp, { recursive: true, force: true })
  }
})

test('oracle aggregation requires exact ordered C coverage and validates C concerns and media uniqueness', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'practical-v3-aggregate-'))
  try {
    const pipeline = buildCanonicalOraclePipeline(temp, '97', 'aggregate', { disagreement: true, disagreementIndices: [11, 23] })
    const aggregator = path.join(ROOT, 'scripts/aggregate-practical-v3-oracle.mjs')
    const ratingsPath = path.join(temp, 'ratings-97.json')
    const args = [aggregator, pipeline.cohortPath, pipeline.pairsPath, pipeline.reviewsDir, ratingsPath]
    assert.throws(() => execFileSync(process.execPath, args, { cwd: ROOT, stdio: 'pipe' }), /Command failed/)

    const cohort = fs.readFileSync(pipeline.cohortPath, 'utf8').trim().split('\n').map(JSON.parse)
    const disputedReviews = [11, 23].map((index) => {
      const disputed = cohort[index]
      const capabilities = disputed.text.split('\n').filter((line) => line.startsWith('- Capability')).slice(0, 6)
      return reviewFromCapabilities(disputed.repo, capabilities)
    })
    const arbitrationPath = path.join(pipeline.reviewsDir, 'round-97-oracle-arb-01.json')
    const writeArbitration = (reviews) => fs.writeFileSync(arbitrationPath, `${JSON.stringify({ reviews })}\n`)
    writeArbitration(disputedReviews)
    execFileSync(process.execPath, args, { cwd: ROOT, stdio: 'pipe' })
    const ratings = JSON.parse(fs.readFileSync(ratingsPath, 'utf8'))
    const disputedRating = ratings.reviews.find((row) => row.repo === disputedReviews[0].repo)
    assert.equal(disputedRating.oracleEvidence.capabilityItems, 6)
    assert.equal(disputedRating.reviewMethod, 'three-reviewer evidence-count median')
    assert.match(ratings.inputFingerprint.pairsSha256, /^[a-f0-9]{64}$/)
    assert.match(ratings.inputFingerprint.arbitrationSha256['round-97-oracle-arb-01.json'], /^[a-f0-9]{64}$/)

    const runInvalidArbitration = (mutate, message) => {
      const reviews = structuredClone(disputedReviews)
      mutate(reviews)
      writeArbitration(reviews)
      const result = spawnSync(process.execPath, args, { cwd: ROOT, encoding: 'utf8' })
      assert.notEqual(result.status, 0)
      assert.match(`${result.stdout}\n${result.stderr}`, message)
    }
    runInvalidArbitration((reviews) => { [reviews[0], reviews[1]] = [reviews[1], reviews[0]] }, /Arbitration order mismatch/)
    runInvalidArbitration((reviews) => { delete reviews[0].concerns }, /missing concerns array/)
    runInvalidArbitration((reviews) => {
      const excerpt = reviews[0].capability[0]
      reviews[0].outputs = [excerpt.slice(excerpt.indexOf('supports'))]
    }, /semantic overlap in capability\/outputs/)
    runInvalidArbitration((reviews) => {
      const excerpt = reviews[0].capability[0]
      reviews[0].media = [{ excerpt, weight: 1 }, { excerpt, weight: 1 }]
    }, /duplicate media excerpt/)

    writeArbitration(disputedReviews)
    const extra = cohort[10]
    const extraCapabilities = extra.text.split('\n').filter((line) => line.startsWith('- Capability')).slice(0, 3)
    fs.writeFileSync(path.join(pipeline.reviewsDir, 'round-97-oracle-arb-02.json'), `${JSON.stringify({ reviews: [reviewFromCapabilities(extra.repo, extraCapabilities)] })}\n`)
    assert.throws(() => execFileSync(process.execPath, args, { cwd: ROOT, stdio: 'pipe' }), /Command failed/)
  } finally {
    fs.rmSync(temp, { recursive: true, force: true })
  }
})

test('consecutive acceptance reproduces reports and rejects tampering or protocol drift', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'practical-v3-consecutive-'))
  try {
    const checker = path.join(ROOT, 'scripts/validate-practical-v3-consecutive.mjs')
    const first = buildCanonicalOraclePipeline(temp, '98', 'first')
    let second = buildCanonicalOraclePipeline(temp, '99', 'second')
    const firstPath = first.reportPath
    const secondPath = second.reportPath
    const rebuildSecond = () => { second = buildCanonicalOraclePipeline(temp, '99', 'second') }
    const runChecker = () => {
      const result = spawnSync(process.execPath, [checker, firstPath, secondPath], {
        cwd: ROOT,
        env: { ...process.env, DSH_MARKET_INDEX_PARSER: parserPath },
        encoding: 'utf8',
      })
      assert.doesNotMatch(result.stderr, /TypeError|ENOENT/)
      return { status: result.status, report: JSON.parse(result.stdout) }
    }
    const positive = runChecker()
    assert.equal(positive.status, 0)
    assert.equal(positive.report.pass, true)

    const tampered = JSON.parse(fs.readFileSync(secondPath, 'utf8'))
    tampered.gates.topQuartileRecall.rawValue = 0
    tampered.gates.topQuartileRecall.value = 0
    tampered.gates.topQuartileRecall.pass = true
    tampered.pass = true
    fs.writeFileSync(secondPath, JSON.stringify(tampered))
    const tamperedResult = runChecker()
    assert.notEqual(tamperedResult.status, 0)
    assert.ok(tamperedResult.report.issues.some((issue) => issue.includes('does not exactly reproduce')))

    rebuildSecond()
    const secondReport = JSON.parse(fs.readFileSync(secondPath, 'utf8'))
    fs.appendFileSync(secondReport.cohortPath, '\n')
    const contentTamper = runChecker()
    assert.notEqual(contentTamper.status, 0)
    assert.ok(contentTamper.report.issues.some((issue) => issue.includes('cohort content does not match its fingerprint')))

    rebuildSecond()
    const overlapping = JSON.parse(fs.readFileSync(secondPath, 'utf8'))
    overlapping.rows = JSON.parse(fs.readFileSync(firstPath, 'utf8')).rows
    fs.writeFileSync(secondPath, JSON.stringify(overlapping))
    const overlapResult = runChecker()
    assert.notEqual(overlapResult.status, 0)
    assert.ok(overlapResult.report.issues.some((issue) => issue.includes('Cohorts overlap on 100 repos')))

    rebuildSecond()
    const malformedRows = JSON.parse(fs.readFileSync(secondPath, 'utf8'))
    malformedRows.rows = 'not-an-array'
    fs.writeFileSync(secondPath, JSON.stringify(malformedRows))
    const malformedResult = runChecker()
    assert.notEqual(malformedResult.status, 0)
    assert.ok(malformedResult.report.issues.some((issue) => issue.includes('missing complete evaluation rows')))

    rebuildSecond()
    const staleBothFirst = JSON.parse(fs.readFileSync(firstPath, 'utf8'))
    const staleBothSecond = JSON.parse(fs.readFileSync(secondPath, 'utf8'))
    staleBothFirst.protocolFingerprint.evaluatorSha256 = '0'.repeat(64)
    staleBothSecond.protocolFingerprint.evaluatorSha256 = '0'.repeat(64)
    fs.writeFileSync(firstPath, JSON.stringify(staleBothFirst))
    fs.writeFileSync(secondPath, JSON.stringify(staleBothSecond))
    const staleResult = runChecker()
    assert.notEqual(staleResult.status, 0)
    assert.ok(staleResult.report.issues.some((issue) => issue.includes('does not match current protocol')))
  } finally {
    fs.rmSync(temp, { recursive: true, force: true })
  }
})

test('arbitration builder rejects stale pair-report fingerprints before creating review batches', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'practical-v3-arbitration-'))
  try {
    const pipeline = buildCanonicalOraclePipeline(temp, '99', 'owner', { disagreement: true })
    const { cohortPath, pairsPath } = pipeline
    const positiveDir = path.join(temp, 'positive')
    const staleDir = path.join(temp, 'stale')
    execFileSync(process.execPath, [
      path.join(ROOT, 'scripts/build-practical-v3-arbitration-batches.mjs'),
      cohortPath,
      pairsPath,
      positiveDir,
    ], { cwd: ROOT, stdio: 'pipe' })
    assert.equal(JSON.parse(fs.readFileSync(path.join(positiveDir, 'manifest.json'), 'utf8')).disagreementCount, 1)

    const pairs = JSON.parse(fs.readFileSync(pairsPath, 'utf8'))
    pairs.disagreements = []
    fs.writeFileSync(pairsPath, `${JSON.stringify(pairs)}\n`)
    assert.throws(() => execFileSync(process.execPath, [
      path.join(ROOT, 'scripts/build-practical-v3-arbitration-batches.mjs'),
      cohortPath,
      pairsPath,
      staleDir,
    ], { cwd: ROOT, stdio: 'pipe' }), /Command failed/)
    assert.equal(fs.existsSync(path.join(staleDir, 'manifest.json')), false)
  } finally {
    fs.rmSync(temp, { recursive: true, force: true })
  }
})
