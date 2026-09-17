'use client'

import * as React from 'react'
import { PasswordInput } from 'yote-ui'
import { CodeBlock } from './code-block'
import { MoreMenu, Toggle } from './more-controls'
import { Pill, PillGroup } from './state-switcher'
import { Stage } from './stage'

const STATES = ['idle', 'used', 'error', 'disabled'] as const
type StateKey = (typeof STATES)[number]

const SIZES = ['sm', 'md', 'lg'] as const
type Size = (typeof SIZES)[number]

const LABELS: Record<StateKey, string> = {
  idle: 'Idle',
  used: 'Used',
  error: 'Error',
  disabled: 'Disabled',
}

const SEED = 'Passw0rd!'

type Flags = { info: boolean; forgot: boolean; requirements: boolean; reveal: boolean }

function snippetFor(state: StateKey, size: Size, value: string, f: Flags): string {
  const props = [`size="${size}"`, 'label="Password"']
  if (value) props.push(`defaultValue="${value}"`)
  if (f.info) props.push('info="Use something you have not used elsewhere."')
  if (f.forgot) props.push('forgotHref="/docs/password#requirements"')
  if (!f.requirements) props.push('showRequirements={false}')
  if (!f.reveal) props.push('revealable={false}')
  // No message on error for now — the red field and bar carry it.
  if (state === 'error') props.push('invalid')
  if (state === 'disabled') props.push('disabled')

  return `<PasswordInput\n${props.map((p) => `  ${p}`).join('\n')}\n/>`
}

export function PasswordPreview({
  title,
  description,
  docsHref = '/docs/password',
}: {
  title?: string
  description?: string
  docsHref?: string
}) {
  const [state, setState] = React.useState<StateKey>('idle')
  const [size, setSize] = React.useState<Size>('md')
  const [value, setValue] = React.useState('')
  const [flags, setFlags] = React.useState<Flags>({
    info: true,
    forgot: true,
    requirements: true,
    reveal: true,
  })
  const set = (key: keyof Flags) => (next: boolean) => setFlags((f) => ({ ...f, [key]: next }))

  const pickState = (next: StateKey) => {
    setState(next)
    setValue(next === 'idle' ? '' : SEED)
  }

  return (
    <div className="preview">
      {title !== undefined ? (
        <div className="showcase-head">
          <div className="showcase-text">
            <h2 className="showcase-title">{title}</h2>
            {description !== undefined ? <p className="showcase-note">{description}</p> : null}
          </div>
          <MoreMenu docsHref={docsHref}>
            <Toggle label="Show info icon" checked={flags.info} onChange={set('info')} />
            <Toggle label="Show forgot link" checked={flags.forgot} onChange={set('forgot')} />
            <Toggle
              label="Show requirements"
              checked={flags.requirements}
              onChange={set('requirements')}
            />
            <Toggle label="Show reveal toggle" checked={flags.reveal} onChange={set('reveal')} />
          </MoreMenu>
        </div>
      ) : null}

      <div className="controls">
        <PillGroup label="State">
          {STATES.map((s) => (
            <Pill key={s} active={state === s} onClick={() => pickState(s)}>
              {LABELS[s]}
            </Pill>
          ))}
        </PillGroup>
        <PillGroup label="Size">
          {SIZES.map((s) => (
            <Pill key={s} active={size === s} onClick={() => setSize(s)}>
              {s}
            </Pill>
          ))}
        </PillGroup>
      </div>

      <Stage className="stage-taller">
        <PasswordInput
          size={size}
          label="Password"
          info={flags.info ? 'Use something you have not used elsewhere.' : undefined}
          /* A real page rather than /reset, which does not exist here. */
          forgotHref={flags.forgot ? '/docs/password#requirements' : undefined}
          showRequirements={flags.requirements}
          revealable={flags.reveal}
          value={value}
          onChange={setValue}
          invalid={state === 'error'}
          disabled={state === 'disabled'}
        />
      </Stage>

      <CodeBlock code={snippetFor(state, size, value, flags)} />
    </div>
  )
}
