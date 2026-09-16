import Link from 'next/link'
import { CodeBlock } from '../../components/code-block'
import { Install } from '../../components/install'

export default function GettingStartedPage() {
  return (
    <>
      <h1 className="docs-title">Getting started</h1>
      <p className="docs-lede">
        Yöte is a small set of form inputs for React — styled and animated out of the box, with one
        prop vocabulary shared by every field. Zero dependencies.
      </p>

      <h2 id="installation" className="docs-h2">
        Installation
      </h2>
      <p className="docs-p">Install the package from your command line.</p>
      <Install />

      <h2 id="usage" className="docs-h2">
        Usage
      </h2>
      <p className="docs-p">
        Import the stylesheet once, wherever you keep global styles. Everything in it lives inside{' '}
        <code className="inline-code">@layer yote</code>, so your own utilities always win.
      </p>
      <CodeBlock
        filename="app/layout.tsx"
        code={`import 'yote-ui/styles.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`}
      />

      <p className="docs-p">Then render a field. Nothing else to wire up.</p>
      <CodeBlock
        filename="verify-form.tsx"
        code={`import { PinInput } from 'yote-ui'

export function VerifyForm() {
  return (
    <PinInput
      label="Verification code"
      hint="Enter the code we sent you."
      onComplete={(code) => verify(code)}
    />
  )
}`}
      />

      <h2 id="components" className="docs-h2">
        Components
      </h2>
      <p className="docs-p">
        Two so far. Both take the same props, so the second one needs no new learning.
      </p>
      <ul className="bullets">
        <li>
          <Link className="docs-inline-link" href="/docs/digit-input">
            Digit input
          </Link>{' '}
          — one-time codes and PINs. Paste, autofill and the SMS suggestion all work.
        </li>
        <li>
          <Link className="docs-inline-link" href="/docs/textarea">
            Text area
          </Link>{' '}
          — multi-line entry with a counter, a drag handle and three sizes.
        </li>
      </ul>

      <h2 id="scope" className="docs-h2">
        Scope
      </h2>
      <p className="docs-p">
        Yöte does inputs. Not selects, not date pickers, not form state, not validation logic.
        Validation state is accepted as a prop — the library renders your error and never decides
        what one is.
      </p>
    </>
  )
}
