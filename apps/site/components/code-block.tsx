'use client'

import * as React from 'react'
import { CheckIcon, CopyIcon } from './icons'

/**
 * A ~40 line JSX highlighter instead of a syntax-highlighting dependency.
 *
 * The site only ever renders one shape of snippet — a single self-closing JSX
 * element — so a scanner that knows tags, attribute names, strings, braces and
 * numbers covers it completely. Shiki or Prism would be several hundred
 * kilobytes to colour six lines of code.
 */
const TOKEN = /("[^"]*")|(\{[^{}]*\})|(<\/?[A-Za-z][\w.]*)|(\/?>)|([a-zA-Z][\w-]*(?==))/g

type Kind = 'str' | 'expr' | 'tag' | 'punct' | 'attr'

const CLASS: Record<Kind, string> = {
  str: 'text-[var(--code-str)]',
  expr: 'text-[var(--code-expr)]',
  tag: 'text-[var(--code-tag)]',
  punct: 'text-[var(--code-punct)]',
  attr: 'text-[var(--code-attr)]',
}

function highlight(code: string): React.ReactNode[] {
  const out: React.ReactNode[] = []
  let last = 0
  let key = 0
  let m: RegExpExecArray | null

  TOKEN.lastIndex = 0
  while ((m = TOKEN.exec(code)) !== null) {
    if (m.index > last) out.push(code.slice(last, m.index))

    const kind: Kind = m[1] ? 'str' : m[2] ? 'expr' : m[3] ? 'tag' : m[4] ? 'punct' : 'attr'
    out.push(
      <span key={key++} className={CLASS[kind]}>
        {m[0]}
      </span>,
    )
    last = m.index + m[0].length
  }
  if (last < code.length) out.push(code.slice(last))

  return out
}

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  React.useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      return
    }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 1600)
  }

  return (
    <button type="button" onClick={copy} className="copy" aria-label="Copy to clipboard">
      {/* Both glyphs share one grid cell, so the button never resizes and the
          swap is a cross-fade rather than a jump. */}
      <span className="icon-slot" data-shown={!copied || undefined}>
        <CopyIcon />
      </span>
      <span className="icon-slot" data-shown={copied || undefined}>
        <CheckIcon />
      </span>
    </button>
  )
}

/**
 * The panel takes the height of the snippet it is showing.
 *
 * Driving the height off the real line count and transitioning it keeps the
 * panel honest without the jump a plain `height: auto` would give: the box
 * grows and shrinks, but visibly, so the eye can follow what moves below it.
 */
export function CodeBlock({ code, filename }: { code: string; filename?: string }) {
  const lines = code.split('\n').length

  return (
    <div className="code" data-titled={filename !== undefined || undefined}>
      {filename !== undefined ? (
        <div className="code-head">
          <span className="code-filename">{filename}</span>
        </div>
      ) : null}
      {/* CSS owns the height maths — under border-box the panel's own padding
          would otherwise be subtracted from the line box. */}
      <pre className="code-pre" style={{ '--code-lines': lines } as React.CSSProperties}>
        <code>{highlight(code)}</code>
      </pre>
      <CopyButton value={code} />
    </div>
  )
}
