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
        formatted, normalised or validated — Yöte does not own validation, and phone numbers are the
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
        The default list is eight common entries — enough to see the component work, not a data set.
        Pass your own for anything real.
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
      <p className="docs-p">
        Flags are emoji derived from the ISO code, not images. A per-country SVG set is large, needs
        an asset pipeline this package deliberately does not have, and carries a maintenance burden
        that is not really about code. The emoji is in every system font.
      </p>

      <h2 id="picker" className="docs-h2">
        The picker
      </h2>
      <p className="docs-p">
        The country control is a real <code className="inline-code">&lt;select&gt;</code>, sized over
        the flag and dial code and made invisible. That buys the platform&apos;s own picker —
        type-to-search, keyboard driven, and a native wheel on a phone — instead of a custom popover
        that would be all of that to rebuild and worse at every one.
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
