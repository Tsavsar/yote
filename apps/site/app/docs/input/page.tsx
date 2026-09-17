import { CodeBlock } from '../../../components/code-block'
import { InputPreview } from '../../../components/input-preview'
import { PropsTable, SHARED_PROPS } from '../../../components/props-table'

const OWN_PROPS = [
  ['leading', 'ReactNode', '—', 'A mark at the start of the field. 20px in the frame.'],
  ['trailing', 'ReactNode', '—', 'A mark at the end. Also where an inline selector goes.'],
  ['prefix', 'ReactNode', '—', 'Text at the start, inside the field.'],
  ['suffix', 'ReactNode', '—', 'Text at the end, inside the field.'],
  ['required', 'boolean', 'false', 'Renders the asterisk and sets aria-required.'],
  ['optional', 'boolean', 'false', 'Renders the muted "(Optional)" note.'],
  ['info', 'string', '—', 'Info marker beside the label, with this as its tooltip.'],
]

const SIZES = [
  ['sm', '8px', '8px', 'Figma 6:508. The only measured one.'],
  ['md', '12px', '10px', 'The default.'],
  ['lg', '12px', '12px', ''],
]

export default function InputDocsPage() {
  return (
    <>
      <h1 className="docs-title">Text input</h1>
      <p className="docs-lede">
        One line of text, with room at either end for a mark or an affix. The plainest field in the
        library, and the one the others are shaped like.
      </p>

      <InputPreview />

      <h2 id="slots" className="docs-h2">
        Slots
      </h2>
      <p className="docs-p">
        Four, and the pairing is deliberate. <code className="inline-code">leading</code> and{' '}
        <code className="inline-code">trailing</code> take a mark — an icon, a spinner, a button.{' '}
        <code className="inline-code">prefix</code> and <code className="inline-code">suffix</code>{' '}
        take text that is read as part of the value: a currency symbol, a protocol, a unit. They are
        separate props because the design spaces them differently — an affix sits 12px in from the
        edge with 14px to the value, because it belongs to the value rather than sitting beside it.
      </p>
      <CodeBlock
        filename="billing-form.tsx"
        code={`import { Input } from 'yote-ui'

<Input label="Website" prefix="https://" placeholder="billia.io" />
<Input label="Amount" prefix="$" suffix="USD" />
<Input label="Search" leading={<SearchIcon />} />`}
      />
      <p className="docs-p">
        Nothing is rendered for a slot you leave unset, so the field collapses to a plain box with
        no stray padding — the gap belongs to the slot, not to the field.
      </p>

      <h2 id="sizes" className="docs-h2">
        Sizes
      </h2>
      <p className="docs-p">
        Only <code className="inline-code">sm</code> is drawn in Figma. The other two follow the
        ramp the password field already set, so a form mixing fields lines up rather than each
        component inventing its own scale.
      </p>
      <PropsTable head={['size', 'Radius', 'Padding', 'Notes']} rows={SIZES} />

      <h2 id="props" className="docs-h2">
        Props
      </h2>
      <PropsTable head={['Prop', 'Type', 'Default', 'Notes']} rows={OWN_PROPS} />

      <h3 className="docs-h3">Shared</h3>
      <PropsTable head={['Prop', 'Type', 'Default', 'Notes']} rows={SHARED_PROPS} />
    </>
  )
}
