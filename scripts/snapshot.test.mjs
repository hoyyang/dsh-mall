import test from 'node:test'
import assert from 'node:assert/strict'
import { assertNoPracticalDowngrade, practicalCount } from './snapshot.mjs'

const entry = (practical) => ({ readmeSig: practical === undefined ? null : { practical } })
const registry = (...plugins) => ({ plugins })

test('snapshot schema guard counts only Practical V3 parser revision 3 evidence', () => {
  assert.equal(practicalCount(registry(entry({ version: 3, parserRevision: 3 }), entry({ version: 3, parserRevision: 2 }), entry({ version: 3 }), entry(null), entry({ version: 2 }))), 1)
})

test('snapshot schema guard rejects replacing prior practical evidence with a candidate lacking current parser revision', () => {
  assert.throws(
    () => assertNoPracticalDowngrade(registry(entry({ version: 2 })), registry(entry(null))),
    (error) => error?.code === 'PRACTICAL_SCHEMA_DOWNGRADE',
  )
  assert.throws(
    () => assertNoPracticalDowngrade(registry(entry({ version: 3, parserRevision: 3 })), registry(entry({ version: 3 }))),
    (error) => error?.code === 'PRACTICAL_SCHEMA_DOWNGRADE',
  )
})

test('snapshot schema guard allows first generation and current-revision refreshes', () => {
  const current = { version: 3, parserRevision: 3 }
  assert.doesNotThrow(() => assertNoPracticalDowngrade(null, registry(entry(null))))
  assert.doesNotThrow(() => assertNoPracticalDowngrade(registry(entry({ version: 2 })), registry(entry(current))))
  assert.doesNotThrow(() => assertNoPracticalDowngrade(registry(entry({ version: 3 })), registry(entry(current))))
  assert.doesNotThrow(() => assertNoPracticalDowngrade(registry(entry(current)), registry(entry(current))))
})
