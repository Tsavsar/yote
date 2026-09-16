'use client'

import * as React from 'react'
import { CopyButton } from './code-block'

/**
 * Install block, Figma node 18:5876.
 *
 * A bare `npm i` makes everyone on pnpm or bun translate it before pasting;
 * the copy button always carries whichever line is showing.
 */
const MANAGERS = [
  { id: 'npm', verb: 'i' },
  { id: 'pnpm', verb: 'add' },
  { id: 'yarn', verb: 'add' },
  { id: 'bun', verb: 'add' },
] as const

type Manager = (typeof MANAGERS)[number]
const PACKAGE = 'yote-ui'

const commandOf = (m: Manager) => `${m.id} ${m.verb} ${PACKAGE}`

/**
 * One segment of the command, which rolls only when its own text changes.
 *
 * Keeping the whole line as one unit meant `add yote-ui` re-animated on every
 * switch even though it was identical before and after — motion on something
 * that did not change reads as a glitch. Each segment owns its own previous
 * value, so pnpm → yarn moves the manager and leaves the rest still, while
 * npm → pnpm moves the manager and the verb.
 */
function Roll({ text }: { text: string }) {
  const [current, setCurrent] = React.useState(text)
  const [outgoing, setOutgoing] = React.useState<string | null>(null)

  if (text !== current) {
    // Derived during render rather than in an effect: the swap has to be in
    // the same commit as the new text, or the old line paints twice.
    setOutgoing(current)
    setCurrent(text)
  }

  return (
    <span className="install-lines">
      {outgoing !== null ? (
        <span
          key={`out-${outgoing}`}
          className="install-line"
          data-out
          aria-hidden="true"
          onAnimationEnd={() => setOutgoing(null)}
        >
          {outgoing}
        </span>
      ) : null}
      <span key={current} className="install-line">
        {current}
      </span>
    </span>
  )
}

export function Install() {
  const [manager, setManager] = React.useState<Manager>(MANAGERS[0])
  const tabsRef = React.useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = React.useState<{ x: number; w: number } | null>(null)

  /*
   * The selected pill is a single element that glides between tabs, rather
   * than a background that appears on whichever tab is active. Measured from
   * the real buttons so it tracks the text rather than assuming equal widths.
   */
  React.useLayoutEffect(() => {
    const tabs = tabsRef.current
    if (!tabs) return

    const measure = () => {
      const active = tabs.querySelector<HTMLElement>('[data-active]')
      if (!active) return
      setIndicator({ x: active.offsetLeft, w: active.offsetWidth })
    }
    measure()

    // Re-measure when the font lands, or the pill sits on the fallback metrics.
    document.fonts?.ready.then(measure).catch(() => {})
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [manager])

  return (
    <div className="install">
      <div className="install-tabs" role="tablist" aria-label="Package manager" ref={tabsRef}>
        {indicator !== null ? (
          <span
            className="install-tab-indicator"
            aria-hidden="true"
            style={{ transform: `translateX(${indicator.x}px)`, width: `${indicator.w}px` }}
          />
        ) : null}
        {MANAGERS.map((m) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={m.id === manager.id}
            onClick={() => setManager(m)}
            data-active={m.id === manager.id || undefined}
            className="install-tab"
          >
            {m.id}
          </button>
        ))}
      </div>

      <div className="install-row">
        <code className="install-code" aria-label={commandOf(manager)}>
          <span className="install-prompt">$</span>
          <Roll text={manager.id} />
          <Roll text={manager.verb} />
          <span>{PACKAGE}</span>
        </code>
        <CopyButton value={commandOf(manager)} />
      </div>
    </div>
  )
}
