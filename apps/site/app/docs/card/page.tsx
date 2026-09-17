import { AmexMark, DiscoverMark, MastercardMark, VisaMark } from 'yote-ui'
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

const BRANDS: { value: string; starts: string; groups: string; mark: React.ReactNode }[] = [
  { value: 'visa', starts: '4', groups: '4-4-4-4', mark: <VisaMark /> },
  { value: 'mastercard', starts: '51-55, 22-27', groups: '4-4-4-4', mark: <MastercardMark /> },
  { value: 'amex', starts: '34, 37', groups: '4-6-5', mark: <AmexMark /> },
  { value: 'discover', starts: '6011, 65', groups: '4-4-4-4', mark: <DiscoverMark /> },
  { value: 'unknown', starts: 'anything else', groups: '4-4-4-4', mark: null },
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
        moment it recognises the card is the clearest signal it could give that it read them. You
        get the confirmation for free, from the thing you were doing anyway.
      </p>
      <div className="table-wrap">
        <table className="props">
          <thead>
            <tr>
              <th>CardBrand</th>
              <th>Mark</th>
              <th>Starts with</th>
              <th>Groups</th>
            </tr>
          </thead>
          <tbody>
            {BRANDS.map((brand) => (
              <tr key={brand.value}>
                <td>
                  <code className="inline-code">{brand.value}</code>
                </td>
                <td>
                  <span className="yote-card-mark">{brand.mark}</span>
                </td>
                <td>{brand.starts}</td>
                <td>{brand.groups}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
        The slot it sits in is a fixed 29px whatever is in it, including nothing. That is not a
        detail: the plain glyph is 20px square and the network plates are 29px wide, so a slot sized
        to its contents shunted every digit sideways the moment the card was recognised. A field
        that jolts as it understands you is worse than one that never noticed.
      </p>
      <p className="docs-p">
        All four marks ship, drawn on one 780&times;500 plate so they read as a family rather than
        four different treatments. They are the networks&apos; trademarks, shown to say which card
        was recognised. A real checkout should use the assets each network distributes under its own
        brand guidelines, and <code className="inline-code">brand</code> takes any node for that.
        The detected brand is handed to you either way, so you never have to redo the detection.
      </p>
      <CodeBlock
        filename="checkout.tsx"
        code={`const [brand, setBrand] = useState<CardBrand>('unknown')

// Your own artwork, or your processor's:
<CardInput
  onBrandChange={setBrand}
  brand={<img src={\`/brands/\${brand}.svg\`} alt="" width={29} />}
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
