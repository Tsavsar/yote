'use client'

import * as React from 'react'
import { TagsInput } from 'yote-ui'
import { CodeBlock } from './code-block'
import { Stage } from './stage'
import { Pill, PillGroup } from './state-switcher'

const PLACES = ['outside', 'inside'] as const
type Place = (typeof PLACES)[number]

const LABELS: Record<Place, string> = { outside: 'Tags outside', inside: 'Tags inside' }

const SEED = ['Carrots', 'Onions', 'Tomatoes']

export function TagsPreview() {
  const [place, setPlace] = React.useState<Place>('outside')
  const [outside, setOutside] = React.useState<string[]>(SEED)
  const [inside, setInside] = React.useState<string[]>(SEED)

  const tags = place === 'outside' ? outside : inside
  const setTags = place === 'outside' ? setOutside : setInside

  return (
    <div className="preview">
      <div className="controls">
        <PillGroup label="Placement">
          {PLACES.map((p) => (
            <Pill key={p} active={place === p} onClick={() => setPlace(p)}>
              {LABELS[p]}
            </Pill>
          ))}
        </PillGroup>
      </div>

      <Stage className="stage-tall">
        <TagsInput
          label="Ingredients"
          optional
          tagsPosition={place}
          value={tags}
          onChange={setTags}
          placeholder="Type and press Enter..."
          hint="Enter or a comma adds one. Backspace on an empty field removes the last."
        />
      </Stage>

      <CodeBlock
        code={`<TagsInput
  label="Ingredients"
  tagsPosition="${place}"
  value={tags}
  onChange={setTags}
  placeholder="Type and press Enter..."
/>`}
      />
    </div>
  )
}
