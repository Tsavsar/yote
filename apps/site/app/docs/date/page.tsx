import { CodeBlock } from '../../../components/code-block'
import { DatePreview } from '../../../components/date-preview'
import { PropsTable, SHARED_PROPS } from '../../../components/props-table'

const OWN_PROPS = [
  ['pattern', 'string', "'00/00/0000'", '`0` is a digit slot; everything else is typed for you.'],
  ['onComplete', '(value: string) => void', '—', 'Fires when every slot is filled.'],
  ['shortcut', 'ReactNode', '—', 'A keyboard hint at the end of the field.'],
  ['leading', 'ReactNode', '<CalendarIcon />', 'Pass null to drop it.'],
  ['required', 'boolean', 'false', 'Renders the asterisk and sets aria-required.'],
  ['optional', 'boolean', 'false', 'Renders the muted "(Optional)" note.'],
  ['info', 'string', '—', 'Info marker beside the label, with this as its tooltip.'],
]

export default function DateDocsPage() {
  return (
    <>
      <h1 className="docs-title">Date</h1>
      <p className="docs-lede">
        A date typed, not picked. The field types the punctuation for you, takes a paste of whatever
        shape, and never tells you whether the date is real.
      </p>

      <DatePreview />

      <h2 id="no-picker" className="docs-h2">
        There is no calendar
      </h2>
      <p className="docs-p">
        And there will not be one. The scope rule for this library is inputs, and a date picker is a
        different product, with locales, ranges, a month grid, keyboard navigation across weeks and
        a popover that has to know about the viewport. This is the field half, done properly, and it
        sits happily under whichever picker you already use.
      </p>

      <h2 id="pattern" className="docs-h2">
        Pattern
      </h2>
      <p className="docs-p">
        One prop drives the placeholder, the mask and the max length together, so a different order
        needs nothing else changed. <code className="inline-code">0</code> is a digit slot;
        everything else is a literal the field types for you.
      </p>
      <CodeBlock
        code={`<DateInput pattern="0000-00-00" placeholder="YYYY-MM-DD" />
<DateInput pattern="00/00/0000" placeholder="MM/DD/YYYY" />
<DateInput pattern="00.00.0000" placeholder="DD.MM.YYYY" />`}
      />
      <p className="docs-p">
        Literals are only ever appended behind a digit, never ahead of the caret. A field that shows
        &ldquo;12/&rdquo; before you have typed the month puts your caret behind punctuation you did
        not ask for, and every backspace then has to step over it.
      </p>
      <p className="docs-p">
        Only digits survive from what arrives, so pasting{' '}
        <code className="inline-code">12.03.2026</code> into a slash pattern lands correctly without
        you writing a parser.
      </p>

      <h2 id="value" className="docs-h2">
        What you get back
      </h2>
      <p className="docs-p">
        <code className="inline-code">onChange</code> gives the masked string exactly as displayed,
        never a <code className="inline-code">Date</code>. &ldquo;31/02/2026&rdquo; is a real thing
        somebody can type, and deciding whether that is an error is validation, which this library
        does not own. <code className="inline-code">onComplete</code> fires when every slot is full,
        which is the moment to hand it to whatever does.
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
