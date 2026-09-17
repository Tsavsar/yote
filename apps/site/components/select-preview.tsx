'use client'

import * as React from 'react'
import { InlineSelect, Input, SelectInput, UserIcon } from 'yote-ui'
import { CodeBlock } from './code-block'
import { Stage } from './stage'
import { Pill, PillGroup } from './state-switcher'

const KINDS = ['dropdown', 'inline'] as const
type Kind = (typeof KINDS)[number]

const LABELS: Record<Kind, string> = { dropdown: 'Dropdown', inline: 'Inline selector' }

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

const SNIPPETS: Record<Kind, string> = {
  dropdown: `<SelectInput
  label="Country"
  options={[
    { value: 'fi', label: 'Finland' },
    { value: 'se', label: 'Sweden' },
  ]}
  hint="Type to filter. The field is the search."
/>`,
  inline: `<Input
  label="Share with"
  leading={<UserIcon />}
  defaultValue="bradlyspencer"
  trailing={
    <InlineSelect
      aria-label="Access level"
      options={[
        { value: 'view', label: 'can view' },
        { value: 'edit', label: 'can edit' },
      ]}
    />
  }
/>`,
}

export function SelectPreview() {
  const [kind, setKind] = React.useState<Kind>('dropdown')

  return (
    <div className="preview">
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
            label="Country"
            options={COUNTRIES}
            placeholder="Search countries"
            hint="Type to filter. The field is the search."
          />
        ) : (
          <Input
            label="Share with"
            leading={<UserIcon />}
            defaultValue="bradlyspencer"
            hint="The selector is a second decision about the same value."
            trailing={<InlineSelect aria-label="Access level" options={ACCESS} />}
          />
        )}
      </Stage>

      <CodeBlock code={SNIPPETS[kind]} />
    </div>
  )
}
