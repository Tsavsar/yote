import { CodeBlock } from '../../../components/code-block'
import { PropsTable, SHARED_PROPS } from '../../../components/props-table'
import { SelectPreview } from '../../../components/select-preview'

const OWN_PROPS = [
  [
    'options',
    'SelectOption[]',
    '—',
    '{ value, label, keywords? }. `keywords` is matched but never shown.',
  ],
  ['leading', 'ReactNode', '—', 'A mark at the start of the field.'],
  ['emptyLabel', 'ReactNode', '"No match"', 'Shown when the query matches nothing.'],
  ['required', 'boolean', 'false', 'Renders the asterisk and sets aria-required.'],
  ['optional', 'boolean', 'false', 'Renders the muted "(Optional)" note.'],
  ['info', 'string', '—', 'Info marker beside the label, with this as its tooltip.'],
]

const INLINE_PROPS = [
  ['options', 'SelectOption[]', '—', 'The choices.'],
  ['value', 'string', '—', 'Selected value, controlled.'],
  ['defaultValue', 'string', 'first option', 'Selected value, uncontrolled.'],
  ['onChange', '(value: string) => void', '—', 'Fires on selection.'],
  ['aria-label', 'string', '—', 'Required: it has no visible label of its own.'],
]

export default function SelectDocsPage() {
  return (
    <>
      <h1 className="docs-title">Select</h1>
      <p className="docs-lede">
        Two shapes of the same idea. <code className="inline-code">SelectInput</code> is a field
        whose own text is the search. <code className="inline-code">InlineSelect</code> is a small
        one that lives inside another field.
      </p>

      <SelectPreview />

      <h2 id="search" className="docs-h2">
        The field is the search
      </h2>
      <p className="docs-p">
        The country picker in the phone field puts a search box inside its panel, because the thing
        you clicked was a flag and a dial code, not somewhere to type. Here the thing you clicked is
        already a text field, so it filters. A second text box below the first would only be asking
        which one you meant.
      </p>
      <p className="docs-p">
        <code className="inline-code">value</code> is the option&apos;s value, never the label on
        screen. Those are different things, and you should not have to parse a label back into an
        id. What you type while the panel is open is the panel&apos;s business and is discarded when
        it closes.
      </p>
      <CodeBlock
        filename="address-form.tsx"
        code={`const [country, setCountry] = useState('fi')

<SelectInput
  label="Country"
  value={country}
  onChange={setCountry}
  options={COUNTRIES}
/>`}
      />

      <h2 id="inline" className="docs-h2">
        Inline selector
      </h2>
      <p className="docs-p">
        A second decision attached to the value beside it: an access level on a name, a unit on a
        number. It goes in another field&apos;s <code className="inline-code">trailing</code> slot,
        which is why it has no label of its own and why{' '}
        <code className="inline-code">aria-label</code> is not optional.
      </p>
      <CodeBlock
        code={`<Input
  label="Share with"
  trailing={<InlineSelect aria-label="Access level" options={ACCESS} />}
/>`}
      />

      <h2 id="keyboard" className="docs-h2">
        Keyboard
      </h2>
      <p className="docs-p">
        Both answer to the same keys as the country picker, because they are the same popover:
        arrows with wrap, Home and End, Enter to choose, Escape to close. The highlighted option is
        tracked with <code className="inline-code">aria-activedescendant</code> rather than by
        moving focus, so the field keeps it and typing never breaks.
      </p>

      <h2 id="props" className="docs-h2">
        SelectInput props
      </h2>
      <PropsTable head={['Prop', 'Type', 'Default', 'Notes']} rows={OWN_PROPS} />

      <h3 className="docs-h3">Shared</h3>
      <PropsTable head={['Prop', 'Type', 'Default', 'Notes']} rows={SHARED_PROPS} />

      <h2 id="inline-props" className="docs-h2">
        InlineSelect props
      </h2>
      <p className="docs-p">
        Not a field, so it does not take the shared contract. It has no label, hint, error or size.
      </p>
      <PropsTable head={['Prop', 'Type', 'Default', 'Notes']} rows={INLINE_PROPS} />
    </>
  )
}
