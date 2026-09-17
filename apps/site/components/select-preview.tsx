'use client'

import * as React from 'react'
import { InlineSelect, Input, SelectInput, UserIcon } from 'yote-ui'
import { CodeBlock } from './code-block'
import { Stage } from './stage'
import { Pill, PillGroup } from './state-switcher'

const KINDS = ['dropdown', 'inline'] as const
type Kind = (typeof KINDS)[number]

const STATES = ['idle', 'used', 'error', 'disabled'] as const
type StateKey = (typeof STATES)[number]

const SIZES = ['sm', 'md', 'lg'] as const
type Size = (typeof SIZES)[number]

const LABELS: Record<Kind, string> = { dropdown: 'Dropdown', inline: 'Inline selector' }
const STATE_LABELS: Record<StateKey, string> = {
  idle: 'Idle',
  used: 'Used',
  error: 'Error',
  disabled: 'Disabled',
}

const ERROR_TEXT = 'Pick a country to continue.'

const COUNTRIES = [
  { value: 'fi', label: 'Finland' },
  { value: 'se', label: 'Sweden' },
  { value: 'no', label: 'Norway' },
  { value: 'dk', label: 'Denmark' },
  { value: 'is', label: 'Iceland' },
  { value: 'ee', label: 'Estonia' },
]

const ACCESS = [
  { value: 'view', label: 'can view' },
  { value: 'comment', label: 'can comment' },
  { value: 'edit', label: 'can edit' },
]

/*
 * Built from the same state the field is, so the code under the demo is
 * always the code that produced it. A static snippet beside a live control is
 * a mismatch waiting to happen.
 */
function snippetFor(kind: Kind, state: StateKey, size: Size, country: string): string {
  const shared: string[] = [`size="${size}"`]
  if (state === 'error') shared.push('invalid')
  if (state === 'disabled') shared.push('disabled')

  if (kind === 'dropdown') {
    const props = [...shared, 'label="Country"', 'options={COUNTRIES}']
    if (country) props.push(`value="${country}"`)
    props.push(
      state === 'error'
        ? `error="${ERROR_TEXT}"`
        : 'hint="Type to filter. The field is the search."',
    )
    return `<SelectInput\n${props.map((p) => `  ${p}`).join('\n')}\n/>`
  }

  const props = [...shared, 'label="Share with"', 'leading={<UserIcon />}']
  if (state !== 'idle') props.push('value="bradlyspencer"')
  props.push(
    state === 'error'
      ? 'error="That person is not in your workspace."'
      : 'hint="The selector is a second decision about the same value."',
  )
  props.push('trailing={<InlineSelect aria-label="Access level" options={ACCESS} />}')
  return `<Input\n${props.map((p) => `  ${p}`).join('\n')}\n/>`
}

export function SelectPreview() {
  const [kind, setKind] = React.useState<Kind>('dropdown')
  const [state, setState] = React.useState<StateKey>('idle')
  const [size, setSize] = React.useState<Size>('md')
  const [country, setCountry] = React.useState('')

  const pickState = (next: StateKey) => {
    setState(next)
    setCountry(next === 'idle' ? '' : 'fi')
  }

  return (
    <div className="preview">
      <div className="controls">
        <PillGroup label="State">
          {STATES.map((s) => (
            <Pill key={s} active={state === s} onClick={() => pickState(s)}>
              {STATE_LABELS[s]}
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

      <div className="controls">
        <PillGroup label="Kind">
          {KINDS.map((k) => (
            <Pill key={k} active={kind === k} onClick={() => setKind(k)}>
              {LABELS[k]}
            </Pill>
          ))}
        </PillGroup>
      </div>

      <Stage>
        {kind === 'dropdown' ? (
          <SelectInput
            size={size}
            label="Country"
            options={COUNTRIES}
            placeholder="Search countries"
            value={country}
            onChange={setCountry}
            hint={state === 'error' ? undefined : 'Type to filter. The field is the search.'}
            invalid={state === 'error'}
            error={state === 'error' ? ERROR_TEXT : undefined}
            disabled={state === 'disabled'}
          />
        ) : (
          <Input
            size={size}
            label="Share with"
            leading={<UserIcon />}
            value={state === 'idle' ? '' : 'bradlyspencer'}
            onChange={() => {}}
            hint={
              state === 'error'
                ? undefined
                : 'The selector is a second decision about the same value.'
            }
            invalid={state === 'error'}
            error={state === 'error' ? 'That person is not in your workspace.' : undefined}
            disabled={state === 'disabled'}
            trailing={
              <InlineSelect
                aria-label="Access level"
                options={ACCESS}
                disabled={state === 'disabled'}
              />
            }
          />
        )}
      </Stage>

      <CodeBlock code={snippetFor(kind, state, size, country)} />
    </div>
  )
}
