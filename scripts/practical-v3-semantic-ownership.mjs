/** Shared deterministic ownership checks for citation-grounded semantic evidence. */

export const PRACTICAL_V3_SEMANTIC_FIELDS = ['capability', 'usageItems', 'usecases', 'outputs', 'reliability']
export const PRACTICAL_V3_STRING_FIELDS = [...PRACTICAL_V3_SEMANTIC_FIELDS, 'usageActions', 'ioPairs', 'codeExamples']

function unwrapMarkdownLinks(value) {
  let output = ''
  for (let index = 0; index < value.length;) {
    if (value[index] !== '[') {
      output += value[index++]
      continue
    }
    const labelEnd = value.indexOf('](', index + 1)
    if (labelEnd === -1) {
      output += value[index++]
      continue
    }
    let depth = 1
    let cursor = labelEnd + 2
    for (; cursor < value.length && depth > 0; cursor++) {
      if (value[cursor] === '\\') {
        cursor++
      } else if (value[cursor] === '(') {
        depth++
      } else if (value[cursor] === ')') {
        depth--
      }
    }
    if (depth !== 0) {
      output += value[index++]
      continue
    }
    output += value.slice(index + 1, labelEnd)
    index = cursor
  }
  return output
}

function stripInlineWrappers(value) {
  let output = value
  for (let pass = 0; pass < 4; pass++) {
    const previous = output
    output = output
      .replace(/(?<![\p{Letter}\p{Number}])(`+)(?=\S)([^`\n]*?\S)\1(?![\p{Letter}\p{Number}])/gu, '$2')
      .replace(/(?<![\p{Letter}\p{Number}])(\*{1,3}|_{1,3}|~{2})(?=\S)(.*?\S)\1(?![\p{Letter}\p{Number}])/gu, '$2')
    if (output === previous) break
  }
  return output
}

export function semanticExcerptSignature(value) {
  return stripInlineWrappers(unwrapMarkdownLinks(String(value))
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\r\n?/g, '\n')
    .replace(/^\s*#{1,6}[^\n]*\n+(?=\s*\S)/, '')
    .replace(/^\s*(?:(?:[-+*]|\d+[.)])\s+|>+\s*)/, '')
    .replace(/^\s*\|\s*|\s*\|\s*$/g, '')
    .replace(/<[^>]+>/g, ' '))
    .replace(/[.!?。！？；;:,，：]+\s*$/, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function substantiveContainmentSignature(signature) {
  const cjk = signature.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu)?.length ?? 0
  const words = signature.match(/[\p{Letter}\p{Number}]+/gu)?.filter((word) => !/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(word)) ?? []
  return cjk >= 4 || words.length >= 2
}

function containsSemanticSignature(haystack, needle) {
  if (/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(needle)) return haystack.includes(needle)
  let index = haystack.indexOf(needle)
  while (index !== -1) {
    const before = index === 0 ? '' : haystack[index - 1]
    const afterIndex = index + needle.length
    const after = afterIndex === haystack.length ? '' : haystack[afterIndex]
    const startsWithWord = /^[\p{Letter}\p{Number}]/u.test(needle)
    const endsWithWord = /[\p{Letter}\p{Number}]$/u.test(needle)
    const leftBoundary = !startsWithWord || before === '' || !/[\p{Letter}\p{Number}]/u.test(before)
    const rightBoundary = !endsWithWord || after === '' || !/[\p{Letter}\p{Number}]/u.test(after)
    if (leftBoundary && rightBoundary) return true
    index = haystack.indexOf(needle, index + 1)
  }
  return false
}

export function evidenceOwnershipIssues(review) {
  const entries = []
  const issues = new Set()
  for (const field of PRACTICAL_V3_STRING_FIELDS) {
    const excerpts = Array.isArray(review?.[field]) ? review[field] : []
    const fieldSignatures = new Set()
    for (const excerpt of excerpts) {
      if (typeof excerpt !== 'string') continue
      const signature = semanticExcerptSignature(excerpt)
      if (!signature) continue
      if (fieldSignatures.has(signature)) issues.add(`duplicate ${field} excerpt`)
      fieldSignatures.add(signature)
      if (PRACTICAL_V3_SEMANTIC_FIELDS.includes(field)) {
        for (const prior of entries) {
          if (prior.field === field) continue
          if (signature === prior.signature) {
            issues.add(`semantic duplicate in ${prior.field}/${field}`)
          } else if (substantiveContainmentSignature(signature)
            && substantiveContainmentSignature(prior.signature)
            && (containsSemanticSignature(signature, prior.signature) || containsSemanticSignature(prior.signature, signature))) {
            issues.add(`semantic overlap in ${prior.field}/${field}`)
          }
        }
        entries.push({ field, signature })
      }
    }
  }
  return [...issues]
}
