import { CodeBlock } from '../../../components/code-block'
import { PasswordPreview } from '../../../components/password-preview'
import { PropsTable, SHARED_PROPS } from '../../../components/props-table'
import { docsMetadata } from '../metadata'

const OWN_PROPS = [
  [
    'requirements',
    'PasswordRequirement[]',
    'the four below',
    'Rules to report on. Pass [] to hide the block.',
  ],
  ['requirementsTitle', 'ReactNode', '"Must contain at least:"', 'Heading above the list.'],
  ['showRequirements', 'boolean', 'true', 'Show the strength bar and list.'],
  ['revealable', 'boolean', 'true', 'Show the reveal toggle.'],
  ['forgotHref', 'string', '—', 'Renders the forgot link under the field.'],
  ['forgotLabel', 'ReactNode', '"Forgot password"', 'Text for that link.'],
  ['info', 'string', '—', 'Info marker beside the label, with this as its tooltip.'],
]

const STRENGTH = [
  ['none', 'Grey', 'Nothing typed yet.'],
  ['partial', 'Amber', 'One rule up to all but one. Only the met segments fill.'],
  ['strong', 'Green', 'Every rule passes.'],
  ['invalid', 'Red', 'The consumer says the entry is wrong. Colours the whole bar.'],
]

export const metadata = docsMetadata('/docs/password')

export default function PasswordDocsPage() {
  return (
    <>
      <h1 className="docs-title">Password</h1>
      <p className="docs-lede">
        Masked entry with a reveal toggle, and a requirements block that reports which rules a
        password meets as it is typed.
      </p>

      <PasswordPreview />

      <h2 id="requirements" className="docs-h2">
        Requirements
      </h2>
      <p className="docs-p">
        This is the part worth reading. Yöte does not decide what a good password is. The rules are
        yours, passed in as <code className="inline-code">{'{ label, test }'}</code> pairs. The
        component runs each <code className="inline-code">test</code> against the current value,
        renders whether it passes, and counts how many do. That is the same line the rest of the
        library holds: validation state comes in as a prop, and this is the prop.
      </p>
      <CodeBlock
        filename="sign-up-form.tsx"
        code={`import { PasswordInput } from 'yote-ui'

<PasswordInput
  label="Password"
  requirements={[
    { label: 'At least 12 characters', test: (v) => v.length >= 12 },
    { label: 'Not your email', test: (v) => !v.includes(email) },
  ]}
/>`}
      />
      <p className="docs-p">
        Leave <code className="inline-code">requirements</code> unset and it uses the four below, so
        the field is useful with nothing configured. They are exported, so you can spread, filter or
        extend them rather than retyping.
      </p>
      <CodeBlock
        code={`import { DEFAULT_PASSWORD_REQUIREMENTS } from 'yote-ui'

// At least 1 symbol   /[^\\w\\s]/
// At least 1 uppercase  /[A-Z]/
// At least 1 number     /\\d/
// At least 8 characters  v.length >= 8

<PasswordInput
  requirements={[
    ...DEFAULT_PASSWORD_REQUIREMENTS,
    { label: 'Not a common password', test: (v) => !COMMON.has(v) },
  ]}
/>`}
      />
      <p className="docs-p">
        Pass <code className="inline-code">requirements={'{[]}'}</code>, or{' '}
        <code className="inline-code">showRequirements={'{false}'}</code>, and the whole block
        disappears. A sign-in field wants the input and nothing else.
      </p>

      <h2 id="strength" className="docs-h2">
        Strength
      </h2>
      <p className="docs-p">
        The bar has one segment per rule, so it keeps working whether you pass three or six. The
        ramp is named rather than counted, and reads off{' '}
        <code className="inline-code">data-strength</code> on the requirements block.
      </p>
      <PropsTable head={['data-strength', 'Colour', 'When']} rows={STRENGTH} />
      <p className="docs-p">
        Two orderings are deliberate. <code className="inline-code">invalid</code> beats the count,
        because a green bar inside a red field claims the entry is fine and wrong at once. And
        disabled beats everything: a disabled field shows neutral marks, not greyed ticks, since a
        tick on a field nobody can type into reports an achievement that was never earned.
      </p>

      <h2 id="props" className="docs-h2">
        Props
      </h2>
      <PropsTable head={['Prop', 'Type', 'Default', 'Notes']} rows={OWN_PROPS} />

      <h3 className="docs-h3">Shared</h3>
      <PropsTable head={['Prop', 'Type', 'Default', 'Notes']} rows={SHARED_PROPS} />

      <h2 id="accessibility" className="docs-h2">
        Accessibility
      </h2>
      <p className="docs-p">
        The rule list is the accessible source of truth: each item announces its label and whether
        it is met, and the bar above it is hidden from assistive tech because it says the same thing
        in colour. The reveal control is a real toggle with{' '}
        <code className="inline-code">aria-pressed</code>, and the input keeps{' '}
        <code className="inline-code">autocomplete=&quot;current-password&quot;</code> so managers
        still work.
      </p>
    </>
  )
}
