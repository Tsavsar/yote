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
        <li>Error and hint marks are decorative and hidden from assistive tech — the text carries the meaning.</li>
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

      <h2 id="motion" className="docs-h2">
        Motion
      </h2>
      <ul className="bullets">
        <li>
          Under <code className="inline-code">prefers-reduced-motion</code> the movement goes and the
          meaning stays: the shake stops, entrances become plain fades, the caret stops blinking.
          Colour changes are kept, because those are what carry the error.
        </li>
        <li>
          Hover treatments sit behind{' '}
          <code className="inline-code">@media (hover: hover) and (pointer: fine)</code>, so a tap on
          a touch device cannot latch a hover state.
        </li>
      </ul>
    </>
  )
}
