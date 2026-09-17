import { CodeBlock } from '../../../components/code-block'
import { Preview } from '../../../components/preview'
import { PropsTable, SHARED_PROPS } from '../../../components/props-table'
import { docsMetadata } from '../metadata'

const OWN_PROPS = [
  ['length', 'number', '4', 'Cell count. Also sets maxLength.'],
  ['onComplete', '(value: string) => void', '—', 'Fires when the last cell fills.'],
  ['mask', 'boolean', 'false', 'Dots instead of digits, for PINs.'],
]

const STATE_ATTRS = [
  ['data-active', 'the focused cell', 'The cell the caret is in.'],
  ['data-filled', 'root, and each filled cell', 'Has a value.'],
  ['data-invalid', 'root and cells', 'Error state.'],
  ['data-disabled', 'root and cells', 'Disabled.'],
  ['data-focused', 'root', 'The field has focus.'],
]

export const metadata = docsMetadata('/docs/digit-input')

export default function DigitInputPage() {
  return (
    <>
      <h1 className="docs-title">Digit input</h1>
      <p className="docs-lede">
        A one-time code field. Type in it: the pills seed a state, but the component underneath is
        the real thing.
      </p>

      <Preview />

      <h2 id="anatomy" className="docs-h2">
        One input, not one per cell
      </h2>
      <p className="docs-p">
        The cells are presentation. Underneath sits a single real{' '}
        <code className="inline-code">&lt;input&gt;</code> spanning the whole group. That is what
        makes pasting a code,{' '}
        <code className="inline-code">autocomplete=&quot;one-time-code&quot;</code> and the iOS and
        Android SMS keyboard suggestion work. All three break the moment you render one input per
        cell, which is how most hand-rolled versions are built.
      </p>

      <h2 id="props" className="docs-h2">
        Props
      </h2>
      <p className="docs-p">Three of its own, on top of the shared contract.</p>
      <PropsTable head={['Prop', 'Type', 'Default', 'Notes']} rows={OWN_PROPS} />

      <h3 className="docs-h3">Shared</h3>
      <PropsTable head={['Prop', 'Type', 'Default', 'Notes']} rows={SHARED_PROPS} />

      <h2 id="errors" className="docs-h2">
        Errors
      </h2>
      <p className="docs-p">
        An <code className="inline-code">error</code> implies{' '}
        <code className="inline-code">invalid</code>, and the field shakes once when it appears. A
        second failed submit with the same message would otherwise do nothing visible, so change{' '}
        <code className="inline-code">errorKey</code> to replay it.
      </p>
      <CodeBlock
        filename="verify-form.tsx"
        code={`const [attempt, setAttempt] = useState(0)

<PinInput
  error={wrong ? 'That code is incorrect. Try again.' : undefined}
  errorKey={attempt}
  onComplete={async (code) => {
    const ok = await verify(code)
    if (!ok) setAttempt((n) => n + 1)
  }}
/>`}
      />

      <h2 id="state-attributes" className="docs-h2">
        State attributes
      </h2>
      <p className="docs-p">Every state is on the DOM, so it can be styled from outside.</p>
      <PropsTable head={['Attribute', 'Sits on', 'Meaning']} rows={STATE_ATTRS} />
      <CodeBlock
        code={`<PinInput
  classNames={{
    cell: 'data-[active]:ring-4 data-[filled]:bg-neutral-50',
  }}
/>`}
      />
    </>
  )
}
