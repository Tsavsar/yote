'use client'

import * as React from 'react'
import { CopyButton } from './code-block'

/**
 * Install block, Figma node 18:5876.
 *
 * Tabs sit above the command as their own row, and the command row is a plain
 * surface panel. A bare `npm i` makes everyone on pnpm or bun translate it
 * before pasting; the copy button always carries whichever line is showing.
 */
const MANAGERS = [
  { id: 'npm', command: 'npm i yote-ui' },
  { id: 'pnpm', command: 'pnpm add yote-ui' },
  { id: 'yarn', command: 'yarn add yote-ui' },
  { id: 'bun', command: 'bun add yote-ui' },
] as const

type ManagerId = (typeof MANAGERS)[number]['id']

/**
 * The command, one span per character.
 *
 * Each span is keyed on the manager, so switching remounts every character
 * and replays the roll — the same trick the pin input uses to restart its
 * caret blink. The stagger is 14ms, which reads as the line flipping rather
 * than as four separate words arriving.
 *
 * Characters that do not change still replay: the line reads as one object
 * turning over, and holding some letters still while others move looks like
 * a rendering fault rather than a deliberate stagger.
 */
function Command({ command, manager }: { command: string; manager: ManagerId }) {
  return (
    <code className="install-code" aria-label={command}>
      <span className="install-prompt">$</span>{' '}
      <span className="install-chars">
        {command.split('').map((char, i) => (
          <span
            key={`${manager}-${i}`}
            className="install-char"
            style={{ animationDelay: `${i * 14}ms` }}
            aria-hidden="true"
          >
            {char === ' ' ? ' ' : char}
          </span>
        ))}
      </span>
    </code>
  )
}

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
        <Command command={active.command} manager={manager} />
        <CopyButton value={active.command} />
      </div>
    </div>
  )
}
