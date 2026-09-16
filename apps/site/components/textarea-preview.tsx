'use client'

import * as React from 'react'
import { Textarea } from 'yote-ui'
import { CodeBlock } from './code-block'
import { MoreMenu, MorePanel, Toggle } from './more-controls'
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

type Flags = {
  required: boolean
  optional: boolean
  info: boolean
  label: boolean
  hint: boolean
  counter: boolean
  resize: boolean
}

function snippetFor(state: StateKey, size: Size, value: string, f: Flags): string {
  const props = [`size="${size}"`]
  if (f.label) props.push('label="Input area"')
  if (f.required) props.push('required')
  if (f.optional) props.push('optional')
  if (f.info) props.push('info="We only use this to improve the product."')
  if (value) props.push(`defaultValue="${value}"`)
  if (f.counter) props.push('maxLength={200}')
  else props.push('showCounter={false}')
  if (!f.resize) props.push('resizable={false}')
  if (state === 'error') props.push(`error="${ERROR_TEXT}"`)
  else if (f.hint) props.push('hint="This is a hint text to help users."')
  if (state === 'disabled') props.push('disabled')
  if (state === 'readOnly') props.push('readOnly')

  return `<Textarea\n${props.map((p) => `  ${p}`).join('\n')}\n/>`
}

export function TextareaPreview({
  title,
  description,
  docsHref = '/docs/textarea',
}: {
  title?: string
  description?: string
  docsHref?: string
}) {
  const [paramsOpen, setParamsOpen] = React.useState(false)
  const [state, setState] = React.useState<StateKey>('idle')
  const [size, setSize] = React.useState<Size>('md')
  const [value, setValue] = React.useState('')
  /* One object rather than seven useStates — these are read together by the
     snippet and the field, and never independently. */
  const [flags, setFlags] = React.useState<Flags>({
    required: true,
    optional: true,
    info: true,
    label: true,
    hint: true,
    counter: true,
    resize: true,
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
          <MoreMenu
            paramsOpen={paramsOpen}
            onToggleParams={() => setParamsOpen((o) => !o)}
            docsHref={docsHref}
          />
        </div>
      ) : null}

      {/*
        The controls live inside the stage, as its toolbar. They belong to the
        thing they change, so the panel reads as one object rather than a row
        of buttons that happens to sit above a box.
      */}
      <div className="stage stage-tall">
        <div className="stage-bar">
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

          <MorePanel open={paramsOpen}>
            <Toggle label="Important" checked={flags.required} onChange={set('required')} />
            <Toggle label="Optional" checked={flags.optional} onChange={set('optional')} />
            <Toggle label="Show label" checked={flags.label} onChange={set('label')} />
            <Toggle label="Show info icon" checked={flags.info} onChange={set('info')} />
            <Toggle label="Show hint" checked={flags.hint} onChange={set('hint')} />
            <Toggle label="Show counter" checked={flags.counter} onChange={set('counter')} />
            <Toggle label="Show resize handle" checked={flags.resize} onChange={set('resize')} />
          </MorePanel>
        </div>

        <div className="stage-body">
          <div className="stage-inner">
            <Textarea
              size={size}
              label={flags.label ? 'Input area' : undefined}
              required={flags.required}
              optional={flags.optional}
              info={flags.info ? 'We only use this to improve the product.' : undefined}
              maxLength={flags.counter ? 200 : undefined}
              showCounter={flags.counter}
              resizable={flags.resize}
              value={value}
              onChange={setValue}
              hint={
                state === 'error' || !flags.hint ? undefined : 'This is a hint text to help users.'
              }
              error={state === 'error' ? ERROR_TEXT : undefined}
              disabled={state === 'disabled'}
              readOnly={state === 'readOnly'}
            />
          </div>
        </div>
      </div>

      <CodeBlock code={snippetFor(state, size, value, flags)} />
    </div>
  )
}
