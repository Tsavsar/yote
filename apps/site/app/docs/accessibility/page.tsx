import { docsMetadata } from '../metadata'

export const metadata = docsMetadata('/docs/accessibility')

export default function AccessibilityPage() {
  return (
    <>
      <h1 className="docs-title">Accessibility</h1>
      <p className="docs-lede">
        What every Yöte field does without being asked. None of it is opt-in.
      </p>

      <h2 id="labelling" className="docs-h2">
        Labelling
      </h2>
      <ul className="bullets">
        <li>
          A real <code className="inline-code">&lt;label&gt;</code> wired by{' '}
          <code className="inline-code">htmlFor</code> to a generated id, so clicking the label
          focuses the field.
        </li>
        <li>
          <code className="inline-code">aria-describedby</code> points at whichever of the hint or
          error is currently showing.
        </li>
        <li>
          <code className="inline-code">aria-invalid</code> whenever the field is invalid, and{' '}
          <code className="inline-code">aria-required</code> where the field is required.
        </li>
      </ul>

      <h2 id="messages" className="docs-h2">
        Messages
      </h2>
      <ul className="bullets">
        <li>
          The message container is an{' '}
          <code className="inline-code">aria-live=&quot;polite&quot;</code> region rather than{' '}
          <code className="inline-code">role=&quot;alert&quot;</code>, which is too noisy on
          re-render.
        </li>
        <li>
          It is always in the DOM, even when empty, so an error appearing never moves the form and
          the live region is a stable node rather than one inserted with its content.
        </li>
        <li>
          Error and hint marks are decorative and hidden from assistive tech, because the text
          carries the meaning.
        </li>
      </ul>

      <h2 id="input" className="docs-h2">
        Input behaviour
      </h2>
      <ul className="bullets">
        <li>
          The digit input uses one real field with{' '}
          <code className="inline-code">inputMode=&quot;numeric&quot;</code> and{' '}
          <code className="inline-code">autocomplete=&quot;one-time-code&quot;</code>, so paste and
          the SMS suggestion work.
        </li>
        <li>
          Text is 16px at the control, so iOS does not zoom the viewport when a field takes focus.
        </li>
        <li>Focus rings are always visible on keyboard focus and never removed.</li>
      </ul>

      <h2 id="dropdowns" className="docs-h2">
        Dropdowns
      </h2>
      <p className="docs-p">
        Three fields open a list: the country picker inside{' '}
        <code className="inline-code">PhoneInput</code>,{' '}
        <code className="inline-code">SelectInput</code>, and{' '}
        <code className="inline-code">InlineSelect</code>. They share one implementation, so they
        answer to the same keys and report themselves the same way.
      </p>
      <ul className="bullets">
        <li>
          The control is a <code className="inline-code">combobox</code> with{' '}
          <code className="inline-code">aria-expanded</code>, and the panel is a{' '}
          <code className="inline-code">listbox</code> whose rows are{' '}
          <code className="inline-code">option</code>s carrying{' '}
          <code className="inline-code">aria-selected</code>.
        </li>
        <li>
          The highlighted row is tracked with{' '}
          <code className="inline-code">aria-activedescendant</code> rather than by moving focus, so
          the field keeps it and typing never breaks mid-filter.
        </li>
        <li>
          Arrows move and wrap, Home and End jump, Enter chooses, Escape closes. With the panel
          shut, Down and Enter open it, which are the two things people try first.
        </li>
        <li>
          Pointer and keyboard share one highlight, so hovering and arrowing can never disagree
          about what Enter will pick.
        </li>
        <li>
          The panel renders to <code className="inline-code">document.body</code> and positions
          against the viewport, so no ancestor&apos;s overflow can clip it out of reach.
        </li>
      </ul>

      <h2 id="tags" className="docs-h2">
        Tags
      </h2>
      <ul className="bullets">
        <li>
          The tags are a real <code className="inline-code">&lt;ul&gt;</code> of{' '}
          <code className="inline-code">&lt;li&gt;</code>, named by{' '}
          <code className="inline-code">listLabel</code>, so they are a list to a screen reader
          rather than chips that happen to sit next to each other.
        </li>
        <li>
          Adding or removing one is announced in its own polite region, with the new total. The
          message row cannot carry that, because it is holding the hint.
        </li>
        <li>
          Each remove button has a real name from <code className="inline-code">removeLabel</code>,
          and it keeps focus in the field so removing three in a row does not mean clicking back in
          each time.
        </li>
        <li>
          Backspace on an empty field removes the last tag, guarded on the field being empty so it
          never eats one while you are still typing.
        </li>
      </ul>

      <h2 id="masked" className="docs-h2">
        Masked fields
      </h2>
      <ul className="bullets">
        <li>
          <code className="inline-code">DateInput</code> and{' '}
          <code className="inline-code">CardInput</code> are ordinary text inputs with{' '}
          <code className="inline-code">inputMode=&quot;numeric&quot;</code>, not a row of
          single-character boxes, so selection, paste and a screen reader&apos;s own caret review
          all behave normally.
        </li>
        <li>
          Punctuation is only ever appended behind a digit, never ahead of the caret, so backspace
          never has to step over a character you did not type.
        </li>
        <li>
          The card mark is decorative and hidden, and its slot is a fixed width, so recognising a
          card changes no layout and announces nothing.
        </li>
      </ul>

      <h2 id="motion" className="docs-h2">
        Motion
      </h2>
      <ul className="bullets">
        <li>
          Under <code className="inline-code">prefers-reduced-motion</code> the movement goes and
          the meaning stays: the shake stops, entrances become plain fades, the caret stops
          blinking. Colour changes are kept, because those are what carry the error.
        </li>
        <li>
          Hover treatments sit behind{' '}
          <code className="inline-code">@media (hover: hover) and (pointer: fine)</code>, so a tap
          on a touch device cannot latch a hover state.
        </li>
      </ul>
    </>
  )
}
