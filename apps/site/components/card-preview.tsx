'use client'

import * as React from 'react'
import { CardInput, type CardBrand } from 'yote-ui'
import { CodeBlock } from './code-block'
import { MoreMenu, Toggle } from './more-controls'
import { Stage } from './stage'
import { Pill, PillGroup } from './state-switcher'

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

/* A Mastercard test number, so the mark on the left has something to become. */
const SEED = '5555555555554444'
const ERROR_TEXT = 'That card was declined. Try another.'

type Flags = { required: boolean; optional: boolean; info: boolean; hint: boolean }

function snippetFor(state: StateKey, size: Size, value: string, f: Flags): string {
  const props = [`size="${size}"`, 'label="Card number"']
  if (f.required) props.push('required')
  if (f.optional) props.push('optional')
  if (f.info) props.push('info="We never store the number."')
  if (value) props.push(`defaultValue="${value}"`)
  if (state === 'error') {
    props.push('invalid')
    if (f.hint) props.push(`error="${ERROR_TEXT}"`)
  } else if (f.hint) {
    props.push('hint="The mark follows the number. Try 3782 822463 10005."')
  }
  if (state === 'disabled') props.push('disabled')
  return `<CardInput\n${props.map((p) => `  ${p}`).join('\n')}\n/>`
}

export function CardPreview({
  title,
  description,
  docsHref = '/docs/card',
}: {
  title?: string
  description?: string
  docsHref?: string
}) {
  const [state, setState] = React.useState<StateKey>('idle')
  const [size, setSize] = React.useState<Size>('md')
  const [value, setValue] = React.useState('')
  const [brand, setBrand] = React.useState<CardBrand>('unknown')
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
        <CardInput
          size={size}
          label="Card number"
          required={flags.required}
          optional={flags.optional}
          info={flags.info ? 'We never store the number.' : undefined}
          value={value}
          onChange={setValue}
          onBrandChange={setBrand}
          hint={
            state === 'error' || !flags.hint
              ? undefined
              : brand === 'unknown'
                ? 'The mark follows the number. Try 5555 5555 5555 4444.'
                : brand === 'amex'
                  ? 'Recognised as Amex, so the groups are 4-6-5.'
                  : `Recognised as ${brand}. Try an Amex to see it regroup.`
          }
          invalid={state === 'error'}
          error={state === 'error' && flags.hint ? ERROR_TEXT : undefined}
          disabled={state === 'disabled'}
        />
      </Stage>

      <CodeBlock code={snippetFor(state, size, value, flags)} />
    </div>
  )
}
