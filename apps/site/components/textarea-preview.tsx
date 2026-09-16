'use client'

import * as React from 'react'
import { Textarea } from 'yote-ui'
import { CodeBlock } from './code-block'
import { Pill } from './state-switcher'

/**
 * The textarea's live preview, built on the same shell as the digit input's.
 *
 * Hover is not a pill. It is a real pointer state on a real element, and a
 * button that fakes it would be lying about what the component does — so the
 * stage says to hover the field instead.
 */
const STATES = ['idle', 'used', 'error', 'disabled', 'readOnly'] as const
type StateKey = (typeof STATES)[number]

const SIZES = ['sm', 'md', 'lg'] as const
type Size = (typeof SIZES)[number]

const LABELS: Record<StateKey, string> = {
  idle: 'Idle',
  used: 'Used',
  error: 'Error',
  disabled: 'Disabled',
  readOnly: 'Read only',
}

const SEED = 'Twelve chars'
const ERROR_TEXT = 'That entry is incorrect. Try again.'

function snippetFor(state: StateKey, size: Size, value: string): string {
  const props = [`size="${size}"`, 'label="Input area"']
  if (value) props.push(`defaultValue="${value}"`)
  props.push('maxLength={200}')
  if (state === 'error') props.push(`error="${ERROR_TEXT}"`)
  else props.push('hint="This is a hint text to help users."')
  if (state === 'disabled') props.push('disabled')
  if (state === 'readOnly') props.push('readOnly')

  return `<Textarea\n${props.map((p) => `  ${p}`).join('\n')}\n/>`
}

export function TextareaPreview() {
  const [state, setState] = React.useState<StateKey>('idle')
  const [size, setSize] = React.useState<Size>('md')
  const [value, setValue] = React.useState('')

  const pickState = (next: StateKey) => {
    setState(next)
    setValue(next === 'idle' ? '' : SEED)
  }

  return (
    <div className="preview">
      <div className="controls">
        <div className="control-row" role="group" aria-label="State">
          {STATES.map((s) => (
            <Pill key={s} active={state === s} onClick={() => pickState(s)}>
              {LABELS[s]}
            </Pill>
          ))}
        </div>
        <div className="control-row" role="group" aria-label="Size">
          {SIZES.map((s) => (
            <Pill key={s} active={size === s} onClick={() => setSize(s)}>
              {s}
            </Pill>
          ))}
        </div>
      </div>

      <div className="stage stage-tall">
        <div className="stage-inner">
          <Textarea
            size={size}
            label="Input area"
            required
            optional
            info="We only use this to improve the product."
            maxLength={200}
            value={value}
            onChange={setValue}
            hint={state === 'error' ? undefined : 'This is a hint text to help users.'}
            error={state === 'error' ? ERROR_TEXT : undefined}
            disabled={state === 'disabled'}
            readOnly={state === 'readOnly'}
          />
        </div>
      </div>

      <CodeBlock code={snippetFor(state, size, value)} />
    </div>
  )
}
