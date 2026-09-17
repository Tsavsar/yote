import { CodeBlock } from '../../../components/code-block'
import { PhonePreview } from '../../../components/phone-preview'
import { PropsTable, SHARED_PROPS } from '../../../components/props-table'

const OWN_PROPS = [
  ['countries', 'PhoneCountry[]', 'eight common ones', 'The selectable dialling countries.'],
  ['country', 'string', '—', 'Selected ISO code, controlled.'],
  ['defaultCountry', 'string', '"US"', 'Selected ISO code, uncontrolled.'],
  ['onCountryChange', '(code: string) => void', '—', 'Fires when the country changes.'],
  ['required', 'boolean', 'false', 'Renders the asterisk and sets aria-required.'],
  ['optional', 'boolean', 'false', 'Renders the muted "(Optional)" note.'],
  ['info', 'string', '—', 'Info marker beside the label, with this as its tooltip.'],
]

const SIZES = [
  ['sm', '8px', '12px / 8px', 'Figma 26:9409.'],
  ['md', '12px', '14px / 8px', 'Figma 26:9410. The default.'],
  ['lg', '12px', '16px / 8px', 'Figma 26:9411.'],
]

export default function PhoneDocsPage() {
  return (
    <>
      <h1 className="docs-title">Phone number</h1>
      <p className="docs-lede">
        A dialling country and a national number in one field. The country and the number are
        separate values, because storing them joined is a decision you should make, not one the
        field makes for you.
      </p>

      <PhonePreview />

      <h2 id="values" className="docs-h2">
        Two values
      </h2>
      <p className="docs-p">
        <code className="inline-code">onChange</code> gives the number exactly as typed.{' '}
        <code className="inline-code">onCountryChange</code> gives the ISO code. Neither is
        formatted, normalised or validated. Yöte does not own validation, and phone numbers are the
        worst possible place to start.
      </p>
      <CodeBlock
        filename="contact-form.tsx"
        code={`const [country, setCountry] = useState('GB')
const [number, setNumber] = useState('')

<PhoneInput
  label="Phone number"
  country={country}
  onCountryChange={setCountry}
  value={number}
  onChange={setNumber}
/>`}
      />

      <h2 id="countries" className="docs-h2">
        Countries
      </h2>
      <p className="docs-p">
        The default list is eight common entries, enough to see the component work and not a data
        set. Pass your own for anything real.
      </p>
      <CodeBlock
        code={`<PhoneInput
  countries={[
    { code: 'FI', dial: '+358', name: 'Finland' },
    { code: 'SE', dial: '+46', name: 'Sweden' },
  ]}
  defaultCountry="FI"
/>`}
      />
      <h2 id="flags" className="docs-h2">
        Flags
      </h2>
      <p className="docs-p">
        The eight defaults draw a real SVG flag, inline, with no request and no asset pipeline. The
        first version used the regional-indicator emoji, 🇬🇧 built from the letters G and B. It is
        free and needs nothing, and it is missing entirely on Windows: there it renders the two
        letters. A default that looks right on a Mac and broken on a PC is not a default.
      </p>
      <p className="docs-p">
        A country the library does not draw still falls back to the emoji, so pass{' '}
        <code className="inline-code">flag</code> for anything outside the eight. It takes any node.
        The full 260 belong in your bundle rather than ours. The usual answer is{' '}
        <a className="docs-a" href="https://github.com/lipis/flag-icons">
          flag-icons
        </a>
        , which is where these eight came from, MIT, and pure CSS.
      </p>
      <CodeBlock
        filename="phone-field.tsx"
        code={`import 'flag-icons/css/flag-icons.min.css'

<PhoneInput
  countries={[
    { code: 'FI', dial: '+358', name: 'Finland' },
    { code: 'EE', dial: '+372', name: 'Estonia', flag: <span className="fi fi-ee" /> },
  ]}
/>`}
      />

      <h2 id="picker" className="docs-h2">
        The picker
      </h2>
      <p className="docs-p">
        The list is a popover rather than a native{' '}
        <code className="inline-code">&lt;select&gt;</code>, because the design is a search field, a
        flag and a two-column row and a select can render none of those. Everything the select gave
        away for nothing is rebuilt explicitly: combobox roles, arrows with wrap, Home and End,
        Enter and Escape, and the highlighted option tracked with{' '}
        <code className="inline-code">aria-activedescendant</code> so focus stays in the search
        field and typing never breaks.
      </p>
      <p className="docs-p">
        It renders into <code className="inline-code">document.body</code> and positions itself
        against the viewport, flipping above the field when there is no room below. That is not
        fussiness: a dropdown that stays inside the field is at the mercy of every ancestor, and one{' '}
        <code className="inline-code">overflow: hidden</code> on a card, a modal or a preview stage
        slices it in half. You do not control that and should not have to think about it.
      </p>

      <h2 id="sizes" className="docs-h2">
        Sizes
      </h2>
      <p className="docs-p">
        The left padding grows with the size while the right stays at 8px: the country group sits at
        the start and the number runs to the end.
      </p>
      <PropsTable head={['size', 'Radius', 'Padding left / right', 'Notes']} rows={SIZES} />

      <h2 id="props" className="docs-h2">
        Props
      </h2>
      <PropsTable head={['Prop', 'Type', 'Default', 'Notes']} rows={OWN_PROPS} />

      <h3 className="docs-h3">Shared</h3>
      <PropsTable head={['Prop', 'Type', 'Default', 'Notes']} rows={SHARED_PROPS} />
    </>
  )
}
