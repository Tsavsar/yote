'use client'

import * as React from 'react'
import { PhoneInput } from 'yote-ui'
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

const SEED = '555 018 2299'
const ERROR_TEXT = 'That number is not valid. Try again.'

type Flags = { required: boolean; optional: boolean; info: boolean; hint: boolean }

function snippetFor(state: StateKey, size: Size, value: string, f: Flags): string {
  const props = [`size="${size}"`, 'label="Phone number"']
  if (f.required) props.push('required')
  if (f.optional) props.push('optional')
  if (f.info) props.push('info="We only use this to secure your account."')
  if (value) props.push(`defaultValue="${value}"`)
  props.push('defaultCountry="US"')
  if (state === 'error') {
    props.push('invalid')
    if (f.hint) props.push(`error="${ERROR_TEXT}"`)
  } else if (f.hint) {
    props.push('hint="This is a hint text to help users."')
  }
  if (state === 'disabled') props.push('disabled')

  return `<PhoneInput\n${props.map((p) => `  ${p}`).join('\n')}\n/>`
}

export function PhonePreview({
  title,
  description,
  docsHref = '/docs/phone',
}: {
  title?: string
  description?: string
  docsHref?: string
}) {
  const [state, setState] = React.useState<StateKey>('idle')
  const [size, setSize] = React.useState<Size>('md')
  const [value, setValue] = React.useState('')
  const [flags, setFlags] = React.useState<Flags>({
    required: true,
    optional: true,
    info: true,
    hint: true,
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
            <Toggle label="Important" checked={flags.required} onChange={set('required')} />
            <Toggle label="Optional" checked={flags.optional} onChange={set('optional')} />
            <Toggle label="Show info icon" checked={flags.info} onChange={set('info')} />
            <Toggle label="Show hint" checked={flags.hint} onChange={set('hint')} />
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

      <Stage>
        <PhoneInput
          size={size}
          label="Phone number"
          required={flags.required}
          optional={flags.optional}
          info={flags.info ? 'We only use this to secure your account.' : undefined}
          value={value}
          onChange={setValue}
          hint={state === 'error' || !flags.hint ? undefined : 'This is a hint text to help users.'}
          invalid={state === 'error'}
          error={state === 'error' && flags.hint ? ERROR_TEXT : undefined}
          disabled={state === 'disabled'}
        />
      </Stage>

      <CodeBlock code={snippetFor(state, size, value, flags)} />
    </div>
  )
}
