'use client'

/*
 * TEMPORARY verification harness, not the landing page.
 *
 * The real landing page (build-order step 5) needs the HTML prototype's
 * preview shell and the PredictiveArc shader, neither of which has landed
 * yet. This page exists only to exercise every state of the pin input in a
 * real browser. Delete it when the landing page is built.
 */

import * as React from 'react'
import { PinInput } from 'yote-ui'

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-500">{title}</h2>
      {children}
    </section>
  )
}

export default function VerificationPage() {
  const [dark, setDark] = React.useState(false)
  const [live, setLive] = React.useState('')
  const [completed, setCompleted] = React.useState<string | null>(null)
  const [attempt, setAttempt] = React.useState(0)

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <main
      className="min-h-screen px-6 py-12"
      style={{ background: 'var(--yote-bg-default)', color: 'var(--yote-text-strong)' }}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-12">
        <header className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-medium">Yöte pin input: verification</h1>
          <button
            type="button"
            onClick={() => setDark((d) => !d)}
            className="rounded-full border border-neutral-300 px-4 py-1.5 text-sm"
          >
            {dark ? 'Light' : 'Dark'}
          </button>
        </header>

        <Row title="Idle: 4 cells, uncontrolled">
          <PinInput label="Verification code" hint="Enter the code we sent you." />
        </Row>

        <Row title="Used: seeded value, unfocused">
          <PinInput defaultValue="4821" label="Verification code" />
        </Row>

        <Row title="Error: shake replays on every attempt">
          <PinInput
            defaultValue="4821"
            label="Verification code"
            error="That code is not right."
            errorKey={attempt}
          />
          <button
            type="button"
            onClick={() => setAttempt((a) => a + 1)}
            className="w-fit rounded-full bg-yote-accent px-4 py-1.5 text-sm text-white"
          >
            Fail again (attempt {attempt})
          </button>
        </Row>

        <Row title="Disabled: digits hidden, no border, no shadow">
          <PinInput defaultValue="4821" label="Verification code" disabled />
        </Row>

        <Row title="Read only: reads as filled, stays focusable">
          <PinInput defaultValue="4821" label="Verification code" readOnly />
        </Row>

        <Row title="Masked: dots, autoComplete off">
          <PinInput defaultValue="4821" label="PIN" mask />
        </Row>

        <Row title="Five cells: group grows to 477.5px">
          <PinInput length={5} />
        </Row>

        <Row title="Six cells: group grows to 575px">
          <PinInput length={6} />
        </Row>

        <Row title="Controlled: onChange gives the value, onComplete fires once">
          <PinInput
            value={live}
            onChange={setLive}
            onComplete={setCompleted}
            label="Verification code"
            hint={`value: "${live}"  ·  completed: ${completed ?? 'none'}`}
          />
        </Row>

        <Row title="Tailwind override: utilities must win over @layer yote">
          <PinInput classNames={{ cell: 'bg-amber-100 data-[active]:bg-amber-200' }} />
        </Row>
      </div>
    </main>
  )
}
