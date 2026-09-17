'use client'

import * as React from 'react'
import { PinInput } from 'yote-ui'
import { CodeBlock } from './code-block'
import { MoreMenu, Toggle } from './more-controls'
import { Pill, PillGroup } from './state-switcher'
import { Stage } from './stage'

/**
 * The preview shell, shared by the landing page and (later) the docs.
 *
 * One row per prop, after the way Sonner separates Types from Position from
 * Expand — a single undifferentiated pill soup makes you guess which control
 * does what. The stage holds the real component, not a mock per state: the
 * pills seed a state and typing still works from there.
 */

const STATES = ['idle', 'active', 'used', 'error', 'disabled'] as const
type StateKey = (typeof STATES)[number]

const LENGTHS = [4, 5, 6] as const
type Length = (typeof LENGTHS)[number]

const SEED = '482159'
/** Figma node 6:4770. */
const ERROR_TEXT = 'That code is incorrect. Try again.'

const seedFor = (state: StateKey, length: number) =>
  state === 'idle' || state === 'active' ? '' : SEED.slice(0, length)

/**
 * Always the multi-line form, and always an explicit `length`.
 *
 * Collapsing to `<PinInput onComplete={verify} />` on the idle state left one
 * line of code floating in a panel reserved for seven, which read as broken
 * rather than as stable. Holding the shape costs a redundant `length={4}` and
 * makes the panel look deliberate at every setting.
 */
function snippetFor(
  state: StateKey,
  length: Length,
  value: string,
  mask: boolean,
  showLabel: boolean,
  showHint: boolean,
): string {
  const props = [`length={${length}}`]
  if (showLabel) props.push('label="Verification code"')
  if (value) props.push(`defaultValue="${value}"`)
  if (mask) props.push('mask')
  if (state === 'active') props.push('autoFocus')
  if (state === 'error') {
    props.push('invalid')
    if (showHint) props.push(`error="${ERROR_TEXT}"`)
  } else if (showHint) {
    props.push('hint="Enter the code we sent you."')
  }
  if (state === 'disabled') props.push('disabled')
  props.push('onComplete={verify}')

  return `<PinInput\n${props.map((p) => `  ${p}`).join('\n')}\n/>`
}

type Model = {
  state: StateKey
  length: Length
  value: string
  mask: boolean
  showLabel: boolean
  showHint: boolean
  errorKey: number
}

type Action =
  | { type: 'state'; state: StateKey }
  | { type: 'length'; length: Length }
  | { type: 'value'; value: string }
  | { type: 'mask'; mask: boolean }
  | { type: 'showLabel'; showLabel: boolean }
  | { type: 'showHint'; showHint: boolean }

/**
 * One reducer rather than five useStates.
 *
 * Picking a length has to know the current state to decide whether to re-seed
 * or just truncate. Reading that from a render closure goes stale the moment
 * two pills are clicked inside one tick — the second handler still sees the
 * state the first one replaced, and seeds a value the user never asked for.
 * A reducer always sees the state it is actually updating.
 */
function reduce(model: Model, action: Action): Model {
  switch (action.type) {
    case 'state':
      return {
        ...model,
        state: action.state,
        value: seedFor(action.state, model.length),
        // Bumped every time Error is picked, so the shake replays on a repeat
        // click exactly the way a second failed submit should.
        errorKey: action.state === 'error' ? model.errorKey + 1 : model.errorKey,
      }
    case 'length':
      return {
        ...model,
        length: action.length,
        value:
          model.state === 'idle' || model.state === 'active'
            ? model.value.slice(0, action.length)
            : seedFor(model.state, action.length),
      }
    case 'value':
      return { ...model, value: action.value }
    case 'mask':
      return { ...model, mask: action.mask }
    case 'showLabel':
      return { ...model, showLabel: action.showLabel }
    case 'showHint':
      return { ...model, showHint: action.showHint }
  }
}

/**
 * No visible label.
 *
 * The groups are already legible apart — words, then numbers, then a pair —
 * and this component has the fewest controls of anything the library will
 * ship. Labelling three rows now sets a pattern that will not survive a
 * component with a dozen props.
 *
 * The name stays on the group for screen readers, which cannot use the
 * "you can see they are different" argument.
 */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return <PillGroup label={label}>{children}</PillGroup>
}

export function Preview({
  title,
  description,
  docsHref = '/docs/digit-input',
}: {
  title?: string
  description?: string
  docsHref?: string
}) {
  const [{ state, length, value, mask, showLabel, showHint, errorKey }, dispatch] =
    React.useReducer(reduce, {
      state: 'idle',
      length: 4,
      value: '',
      mask: false,
      showLabel: true,
      showHint: true,
      errorKey: 0,
    })

  const inputRef = React.useRef<HTMLInputElement>(null)

  const pickState = (next: StateKey) => {
    dispatch({ type: 'state', state: next })
    if (next === 'active') requestAnimationFrame(() => inputRef.current?.focus())
    else inputRef.current?.blur()
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
            <Toggle
              label="Mask as dots"
              checked={mask}
              onChange={(next) => dispatch({ type: 'mask', mask: next })}
            />
            <Toggle
              label="Show label"
              checked={showLabel}
              onChange={(next) => dispatch({ type: 'showLabel', showLabel: next })}
            />
            <Toggle
              label="Show hint"
              checked={showHint}
              onChange={(next) => dispatch({ type: 'showHint', showHint: next })}
            />
          </MoreMenu>
        </div>
      ) : null}

      <div className="controls">
        <Row label="State">
          {STATES.map((s) => (
            <Pill key={s} active={state === s} onClick={() => pickState(s)}>
              {s[0]!.toUpperCase() + s.slice(1)}
            </Pill>
          ))}
        </Row>

        <Row label="Length">
          {LENGTHS.map((n) => (
            <Pill
              key={n}
              active={length === n}
              onClick={() => dispatch({ type: 'length', length: n })}
            >
              {n}
            </Pill>
          ))}
        </Row>
      </div>

      <Stage inner={false}>
        <PinInput
          ref={inputRef}
          length={length}
          value={value}
          onChange={(next) => dispatch({ type: 'value', value: next })}
          mask={mask}
          label={showLabel ? 'Verification code' : undefined}
          hint={showHint ? 'Enter the code we sent you.' : undefined}
          invalid={state === 'error'}
          error={state === 'error' && showHint ? ERROR_TEXT : undefined}
          errorKey={errorKey}
          disabled={state === 'disabled'}
        />
      </Stage>

      <CodeBlock code={snippetFor(state, length, value, mask, showLabel, showHint)} />
    </div>
  )
}
