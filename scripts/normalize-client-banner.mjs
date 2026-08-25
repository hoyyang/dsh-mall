#!/usr/bin/env node
/**
 * Post-process the tsdown CJS client bundle into the loader's
 * closure-factory shape (same as dsh-market's normalize script):
 * wraps the code in window.__ModuleLoader__.load, defines the factory's
 * own module/exports pair, drops rolldown's CJS preamble, and returns
 * module.exports so the module loader receives the plugin object.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const file = join(dirname(fileURLToPath(import.meta.url)), '..', 'client', 'client.js')
let code = readFileSync(file, 'utf8')

// Strip a pre-existing wrapper if a previous normalize ran.
const head = 'window.__ModuleLoader__.load({ id: "dsh-mall", factory: (require) => {'
if (code.includes(head)) {
  const start = code.indexOf(head) + head.length
  const end = code.lastIndexOf('\n\t}\n});')
  if (end > start) code = code.slice(start, end)
}

// Drop rolldown's own CJS preamble (it would clobber our module pair).
code = code.replace(/^\t*var exports = \{ exports: \{\} \}\.exports;\n/, '')
code = code.replace(/\t+var exports = \{ exports: \{\} \}\.exports;\n/, '')

// Drop any existing closing return line.
code = code.replace(/\n\t*return module\.exports;\n/, '\n')

const wrapped = head + '\n'
  + '\t\tvar module = { exports: {} };\n'
  + '\t\tvar exports = module.exports;\n'
  + code.trimEnd()
  + '\n\t\treturn module.exports;\n\t}\n});\n'

writeFileSync(file, wrapped)
console.log('client/client.js normalized:', wrapped.length, 'bytes')
