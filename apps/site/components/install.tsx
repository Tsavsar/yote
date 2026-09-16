'use client'

import * as React from 'react'
import { CopyButton } from './code-block'

/**
 * Install block, Figma node 18:5876.
 *
 * Tabs sit above the command as their own row rather than inside a shared
 * box, and the command row is a plain surface panel. A bare `npm i` makes
 * everyone on pnpm or bun translate it before pasting; the copy button always
 * carries whichever line is showing.
 */
const MANAGERS = [
  { id: 'npm', command: 'npm i yote-ui' },
  { id: 'pnpm', command: 'pnpm add yote-ui' },
  { id: 'yarn', command: 'yarn add yote-ui' },
  { id: 'bun', command: 'bun add yote-ui' },
] as const

type ManagerId = (typeof MANAGERS)[number]['id']

export function Install() {
  const [manager, setManager] = React.useState<ManagerId>('npm')
  const active = MANAGERS.find((m) => m.id === manager) ?? MANAGERS[0]

  return (
    <div className="install">
      <div className="install-tabs" role="tablist" aria-label="Package manager">
        {MANAGERS.map((m) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={m.id === manager}
            onClick={() => setManager(m.id)}
            data-active={m.id === manager || undefined}
            className="install-tab"
          >
            {m.id}
          </button>
        ))}
      </div>

      <div className="install-row">
        <code className="install-code">
          <span className="install-prompt">$</span> {active.command}
        </code>
        <CopyButton value={active.command} />
      </div>
    </div>
  )
}
