import { CodeBlock } from '../../../components/code-block'
import { PropsTable, SHARED_PROPS } from '../../../components/props-table'
import { TextareaPreview } from '../../../components/textarea-preview'
import { docsMetadata } from '../metadata'

const OWN_PROPS = [
  ['required', 'boolean', 'false', 'Renders the asterisk and sets aria-required.'],
  ['optional', 'boolean', 'false', 'Renders the muted "(Optional)" note.'],
  ['info', 'string', '—', 'Adds an info marker after the label, with this as its tooltip.'],
  ['maxLength', 'number', '—', 'Caps the value and turns the counter on.'],
  ['showCounter', 'boolean', 'auto', 'On whenever maxLength is set. Pass false to hide it.'],
  ['resizable', 'boolean', 'true', 'Show the drag handle that resizes the field.'],
]

const SIZES = [
  ['sm', '113px', '8px', 'Figma X-Small.'],
  ['md', '127px', '12px', 'Figma Small. The default.'],
  ['lg', '141px', '12px', 'Figma Medium.'],
]

const VARS = [
  ['--yote-ta-height', 'Field height. The drag handle writes to this one.'],
  ['--yote-ta-radius', 'Corner radius.'],
  ['--yote-ta-pad-y', 'Vertical padding.'],
  ['--yote-ta-pad-left', 'Left padding.'],
  ['--yote-ta-pad-right', 'Right padding. Tighter than the left, to sit the handle near the edge.'],
]

export const metadata = docsMetadata('/docs/textarea')

export default function TextareaPage() {
  return (
    <>
      <h1 className="docs-title">Text area</h1>
      <p className="docs-lede">
        Multi-line entry, with an optional character counter and a drag handle. Hover the field to
        see the hover state. It is a real pointer state, not a pill.
      </p>

      <TextareaPreview />

      <h2 id="sizes" className="docs-h2">
        Sizes
      </h2>
      <p className="docs-p">
        Three, on the shared <code className="inline-code">size</code> scale.
      </p>
      <PropsTable head={['size', 'Height', 'Radius', 'Notes']} rows={SIZES} />

      <h2 id="props" className="docs-h2">
        Props
      </h2>
      <PropsTable head={['Prop', 'Type', 'Default', 'Notes']} rows={OWN_PROPS} />

      <h3 className="docs-h3">Shared</h3>
      <PropsTable head={['Prop', 'Type', 'Default', 'Notes']} rows={SHARED_PROPS} />

      <h2 id="resizing" className="docs-h2">
        Resizing
      </h2>
      <p className="docs-p">
        The handle is a real drag, not the browser&apos;s native{' '}
        <code className="inline-code">resize</code>, which draws its own corner widget on top of the
        mark and only works from the bottom-right corner. Dragging writes to{' '}
        <code className="inline-code">--yote-ta-height</code>, which means you can set the same
        property yourself to pick a starting height.
      </p>
      <CodeBlock
        code={`<Textarea
  label="Input area"
  style={{ '--yote-ta-height': '200px' }}
/>`}
      />

      <h2 id="custom-properties" className="docs-h2">
        Custom properties
      </h2>
      <p className="docs-p">
        Every measured value is a property on the root, so one field can be retuned without a
        stylesheet.
      </p>
      <PropsTable head={['Property', 'Controls']} rows={VARS} />
    </>
  )
}
