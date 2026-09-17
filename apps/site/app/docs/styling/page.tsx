import { CodeBlock } from '../../../components/code-block'

export default function StylingPage() {
  return (
    <>
      <h1 className="docs-title">Styling</h1>
      <p className="docs-lede">
        Yöte ships plain CSS inside a cascade layer. There is no Tailwind in the package and no
        config to inherit.
      </p>

      <h2 id="layer-order" className="docs-h2">
        Layer order
      </h2>
      <p className="docs-p">
        Everything lives in <code className="inline-code">@layer yote</code>. On Tailwind v4 that is
        not enough on its own: v4 emits real cascade layers, so what decides the winner is layer
        order, not specificity, and order is set the first time a layer name appears.
      </p>
      <p className="docs-p">
        Declare it before importing anything. <code className="inline-code">yote</code> has to sit
        after <code className="inline-code">base</code>, because Tailwind&apos;s preflight resets
        form controls with <code className="inline-code">color: inherit; opacity: 1</code>. Put yote
        first and preflight wins, which un-hides the invisible input inside the digit input and
        paints the raw value over the cells. It has to sit before{' '}
        <code className="inline-code">utilities</code>, so your own classes still override ours.
      </p>
      <CodeBlock
        filename="app/globals.css"
        code={`@layer theme, base, yote, components, utilities;

@import 'tailwindcss';

@theme {
  --color-yote-accent: var(--yote-feature-base);
}`}
      />
      <p className="docs-p">
        Import order matters for the same reason: the file holding that statement has to be read
        first.
      </p>
      <CodeBlock
        filename="app/layout.tsx"
        code={`import './globals.css'
import 'yote-ui/styles.css'`}
      />

      <h2 id="per-part" className="docs-h2">
        Per-part classes
      </h2>
      <p className="docs-p">
        A single <code className="inline-code">className</code> stops being useful the moment you
        want the cells a different size, so every component takes a{' '}
        <code className="inline-code">classNames</code> object instead. The parts differ per
        component; the prop name does not.
      </p>
      <CodeBlock
        code={`<PinInput
  classNames={{
    cell: 'data-[active]:ring-4 data-[filled]:bg-neutral-50',
  }}
/>`}
      />

      <h2 id="tokens" className="docs-h2">
        Tokens
      </h2>
      <p className="docs-p">
        Every colour, radius, shadow and duration is a custom property on{' '}
        <code className="inline-code">:root</code>. Override one and every component follows.
      </p>
      <CodeBlock
        filename="app/globals.css"
        code={`:root {
  --yote-feature-base: #0f6dff;
  --yote-radius-md: 4px;
  --yote-duration: 120ms;
}`}
      />
      <p className="docs-p">
        Dark values are declared under both{' '}
        <code className="inline-code">prefers-color-scheme</code> and{' '}
        <code className="inline-code">[data-theme=&quot;dark&quot;]</code>, so a system preference
        and an explicit toggle both work. Those values are provisional until the dark frames are
        designed.
      </p>
    </>
  )
}
