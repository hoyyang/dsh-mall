#!/usr/bin/env node
/**
 * Export the host's live catalog back into data/registry-snapshot.json —
 * run while the market has fetched live data, to refresh the bundled
 * fallback snapshot.
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const base = process.env.DSHM_BASE_URL ?? 'http://127.0.0.1:3080'
const res = await fetch(base + '/dsh-mall/registry?force=1', { headers: { accept: 'application/json' } })
const body = await res.json()
const registry = body.registry
if (registry.source !== 'live' && registry.source !== 'cdn') {
  console.error('registry source is ' + registry.source + ' (need live/cdn) — aborting')
  process.exit(1)
}
const file = join(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'registry-snapshot.json')
writeFileSync(file, JSON.stringify(registry))
console.log('registry-snapshot.json updated:', registry.count, 'entries from live data')
