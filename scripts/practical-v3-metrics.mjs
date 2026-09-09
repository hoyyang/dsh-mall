/** Identity- and input-order-independent top-k overlap with a fixed selection budget. */
function topKMembership(values, count) {
  if (!Array.isArray(values) || !Number.isSafeInteger(count) || count < 1 || count > values.length) {
    throw new Error(`Invalid top-k input: n=${values?.length ?? 'unknown'}, k=${count}`)
  }
  if (values.some((value) => typeof value !== 'number' || !Number.isFinite(value))) {
    throw new Error('Top-k values must be finite numbers')
  }
  const cutoff = [...values].sort((left, right) => right - left)[count - 1]
  const above = values.filter((value) => value > cutoff).length
  const tied = values.filter((value) => value === cutoff).length
  const tiedShare = (count - above) / tied
  return values.map((value) => value > cutoff ? 1 : value === cutoff ? tiedShare : 0)
}

/**
 * Fixed-budget fuzzy overlap of two top-k memberships, divided by k.
 * Both sides retain exactly k total membership, ties cannot inflate recall, and
 * an identical score ordering (including identical cutoff ties) scores 1.
 */
export function fractionalTopKRecall(predicted, reference, count) {
  if (predicted.length !== reference.length) throw new Error(`Top-k length mismatch: ${predicted.length}/${reference.length}`)
  const predictedMembership = topKMembership(predicted, count)
  const referenceMembership = topKMembership(reference, count)
  return predictedMembership.reduce((sum, value, index) => sum + Math.min(value, referenceMembership[index]), 0) / count
}

function mean(values) {
  return values.length === 0 ? null : values.reduce((sum, value) => sum + value, 0) / values.length
}

function round(value, digits = 3) {
  return value == null ? null : Number(value.toFixed(digits))
}

function rawStratumStats(rows, key) {
  return Object.fromEntries([...new Set(rows.map((row) => row[key]))].sort().map((value) => {
    const group = rows.filter((row) => row[key] === value)
    const severe = group.filter((row) => row.error <= -25 || row.error >= 20)
    return [value, {
      n: group.length,
      meanError: mean(group.map((row) => row.error)),
      severeErrorRate: severe.length / group.length,
      severeFalseNegativeRate: group.filter((row) => row.error <= -25).length / group.length,
      severeFalsePositiveRate: group.filter((row) => row.error >= 20).length / group.length,
    }]
  }))
}

function roundedStratumStats(raw) {
  return Object.fromEntries(Object.entries(raw).map(([key, item]) => [key, {
    ...item,
    meanError: round(item.meanError),
    severeErrorRate: round(item.severeErrorRate),
    severeFalseNegativeRate: round(item.severeFalseNegativeRate),
    severeFalsePositiveRate: round(item.severeFalsePositiveRate),
  }]))
}

export function gateResult(rawValue, boundary) {
  if (rawValue === null) {
    if ('threshold' in boundary) return { rawValue: null, value: null, threshold: boundary.threshold, pass: false }
    if ('maximum' in boundary) return { rawValue: null, value: null, maximum: boundary.maximum, pass: false }
  }
  if (!Number.isFinite(rawValue)) throw new Error(`Gate value must be finite or null: ${rawValue}`)
  if ('threshold' in boundary) return { rawValue, value: round(rawValue), threshold: boundary.threshold, pass: rawValue >= boundary.threshold }
  if ('maximum' in boundary) return { rawValue, value: round(rawValue), maximum: boundary.maximum, pass: rawValue <= boundary.maximum }
  throw new Error('Gate boundary must define threshold or maximum')
}

/** Symmetric diagnostic type aggregation; disagreements never default to reviewer A/B. */
export function consensusType(...values) {
  const types = values.filter((value) => typeof value === 'string' && value !== '')
  if (types.length < 2 || types.length > 3) throw new Error(`Expected two or three type reviews, got ${types.length}`)
  return types.find((type) => types.filter((candidate) => candidate === type).length >= 2) ?? 'unclear'
}

/** Shared evaluator/search fairness contract; identity/language are diagnostics only. */
export function fairnessMetrics(rows) {
  if (!Array.isArray(rows) || rows.length === 0) throw new Error('Fairness rows are required')
  for (const row of rows) {
    if (typeof row.type !== 'string' || typeof row.language !== 'string' || !Number.isFinite(row.error)) {
      throw new Error(`Fairness row missing type/language/error for ${row.repo ?? 'unknown'}`)
    }
  }
  const enriched = rows.map((row) => ({ ...row, typeLanguage: `${row.type} × ${row.language}` }))
  const rawByType = rawStratumStats(enriched, 'type')
  const rawByLanguage = rawStratumStats(enriched, 'language')
  const rawByTypeLanguage = rawStratumStats(enriched, 'typeLanguage')
  const eligible = [rawByType, rawByLanguage, rawByTypeLanguage].flatMap((group) => Object.values(group)).filter((item) => item.n >= 10)
  const maximumStratumSevereRate = eligible.length === 0 ? 0 : Math.max(...eligible.map((item) => item.severeErrorRate))
  const languageMeans = Object.values(rawByLanguage).filter((item) => item.n >= 10).map((item) => item.meanError)
  const languageMeanResidualGap = languageMeans.length < 2 ? 0 : Math.max(...languageMeans) - Math.min(...languageMeans)
  return {
    byType: roundedStratumStats(rawByType),
    byLanguage: roundedStratumStats(rawByLanguage),
    byTypeLanguage: roundedStratumStats(rawByTypeLanguage),
    maximumStratumSevereRate,
    languageMeanResidualGap,
  }
}
