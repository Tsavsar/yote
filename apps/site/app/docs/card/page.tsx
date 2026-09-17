import { CardPreview } from '../../../components/card-preview'
import { CodeBlock } from '../../../components/code-block'
import { PropsTable, SHARED_PROPS } from '../../../components/props-table'

const OWN_PROPS = [
  ['brand', 'ReactNode', 'the detected mark', 'Overrides the mark at the start of the field.'],
  ['onBrandChange', '(brand: CardBrand) => void', '—', 'Fires when the detected brand changes.'],
  ['required', 'boolean', 'false', 'Renders the asterisk and sets aria-required.'],
  ['optional', 'boolean', 'false', 'Renders the muted "(Optional)" note.'],
  ['info', 'string', '—', 'Info marker beside the label, with this as its tooltip.'],
]

const BRANDS = [
  ['visa', '4', '4-4-4-4'],
  ['mastercard', '51–55, 22–27', '4-4-4-4'],
  ['amex', '34, 37', '4-6-5'],
  ['discover', '6011, 65', '4-4-4-4'],
  ['unknown', 'anything else', '4-4-4-4'],
]

export default function CardDocsPage() {
  return (
    <>
      <h1 className="docs-title">Card number</h1>
      <p className="docs-lede">
        A card number that regroups itself as it recognises the card, and a mark that changes with
        it. It does not tell you whether the number is real.
      </p>

      <CardPreview />

      <h2 id="grouping" className="docs-h2">
        Grouping follows the brand
      </h2>
      <p className="docs-p">
        Amex is 4-6-5 and everything else is four fours. A field that regroups your digits the
        moment it recognises the card is the clearest signal it could give that it read them — you
        get the confirmation for free, from the thing you were doing anyway.
      </p>
      <PropsTable head={['CardBrand', 'Starts with', 'Groups']} rows={BRANDS} />

      <h2 id="mark" className="docs-h2">
        The mark is on the left
      </h2>
      <p className="docs-p">
        The design draws a generic card glyph at the start and the network&apos;s plate at the end,
        which says the same thing twice. One mark is enough, and it belongs at the start: that is
        where your eye already is, because it is where the number begins. So the glyph becomes the
        card.
      </p>
      <p className="docs-p">
        Only Mastercard&apos;s symbol ships, because that is the one the design draws. Every other
        network&apos;s is its own trademark and yours to supply — the detected brand is handed to
        you so you do not have to redo the detection.
      </p>
      <CodeBlock
        filename="checkout.tsx"
        code={`const [brand, setBrand] = useState<CardBrand>('unknown')

<CardInput
  onBrandChange={setBrand}
  brand={brand === 'visa' ? <VisaMark /> : undefined}
/>`}
      />

      <h2 id="validation" className="docs-h2">
        No Luhn check
      </h2>
      <p className="docs-p">
        Detection is deliberately shallow: enough to group correctly and show a mark, not a
        validator. A Luhn check passes for numbers no bank ever issued and fails for nothing your
        processor will not catch a moment later, so it would be a confident answer to the wrong
        question. Pass <code className="inline-code">invalid</code> and{' '}
        <code className="inline-code">error</code> when the processor answers the right one.
      </p>

      <h2 id="props" className="docs-h2">
        Props
      </h2>
      <PropsTable head={['Prop', 'Type', 'Default', 'Notes']} rows={OWN_PROPS} />

      <h3 className="docs-h3">Shared</h3>
      <PropsTable head={['Prop', 'Type', 'Default', 'Notes']} rows={SHARED_PROPS} />
    </>
  )
}
