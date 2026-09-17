import Link from 'next/link'
import { CodeBlock } from '../../components/code-block'
import { DOCS_COMPONENTS } from '../../components/docs-routes'
import { Install } from '../../components/install'
import { Signature } from '../../components/signature'

export default function GettingStartedPage() {
  return (
    <>
      <h1 className="docs-title">Getting started</h1>
      <p className="docs-lede">
        Yöte is a small set of form inputs for React, styled and animated out of the box, with one
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
        {DOCS_COMPONENTS.length} so far. They all take the same props, so every one after the first
        needs no new learning. The vocabulary is the whole API, and each page only documents what
        that field adds to it.
      </p>
      {/* Rendered from the same list the sidebar and the pager read, so a
          component cannot ship and be missing from here. */}
      <ul className="bullets">
        {DOCS_COMPONENTS.map((component) => (
          <li key={component.href}>
            <Link className="docs-inline-link" href={component.href}>
              {component.label}
            </Link>
            : {component.blurb}
          </li>
        ))}
      </ul>

      <h2 id="scope" className="docs-h2">
        Scope
      </h2>
      <p className="docs-p">
        Yöte does fields. Not form state, not validation logic, and not the things that sit on top
        of a field rather than in it: there is a date field but no calendar, a select field but no
        combobox library, a card field but no card validator. Validation state is accepted as a
        prop, and the library renders your error without ever deciding what one is.
      </p>
      <p className="docs-p">
        A narrow library that is finished beats a broad one that is forty percent done. When a
        feature would need the library to hold state, guess a locale or decide whether something is
        correct, that is the line.
      </p>

      <h2 id="founder" className="docs-h2">
        A message from the founder
      </h2>
      <div className="founder">
        <p className="founder-text">
          Hey, thank you for checking out Yöte. It&apos;s from the word <em>syöte</em>, meaning
          input in Finnish. I hope you enjoy using it, and if there&apos;s anything on here you feel
          could be better, or you want to make a feature request, feel free to send me an email at{' '}
          <a className="docs-a" href="mailto:shatermt@gmail.com">
            shatermt@gmail.com
          </a>{' '}
          or shoot me a DM on Twitter. Don&apos;t forget to give the project a{' '}
          <a className="docs-a" href="https://github.com/Tsavsar/yote">
            star on GitHub
          </a>
          . Thank you!
        </p>
        <div className="founder-sign">
          <Signature />
          <span className="founder-name">Shater</span>
        </div>
      </div>
    </>
  )
}
