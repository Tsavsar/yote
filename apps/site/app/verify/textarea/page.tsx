'use client'

/*
 * TEMPORARY verification harness for the textarea, not a docs page.
 * Exercises all three sizes and all six states in a real browser.
 */

import * as React from 'react'
import { Textarea } from 'yote-ui'

const SIZES = ['sm', 'md', 'lg'] as const

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <h2 className="section-title">{title}</h2>
      {children}
    </section>
  )
}

export default function VerifyTextarea() {
  const [dark, setDark] = React.useState(false)

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  const common = {
    label: 'Input area',
    required: true,
    optional: true,
    info: 'We only use this to improve the product.',
    maxLength: 200,
    hint: 'This is a hint text to help users.',
  }

  return (
    <main className="page" style={{ maxWidth: 760 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="headline" style={{ fontSize: 28 }}>
          Textarea — verification
        </h1>
        <button type="button" className="pill" onClick={() => setDark((d) => !d)}>
          {dark ? 'Light' : 'Dark'}
        </button>
      </header>

      <Row title="Sizes — sm 113px / md 127px / lg 141px">
        <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {SIZES.map((s) => (
            <Textarea key={s} {...common} size={s} defaultValue="" />
          ))}
        </div>
      </Row>

      <Row title="Idle">
        <Textarea {...common} />
      </Row>

      <Row title="Used — has a value">
        <Textarea {...common} defaultValue="Twelve chars" />
      </Row>

      <Row title="Error">
        <Textarea {...common} defaultValue="Twelve chars" error="That entry is incorrect. Try again." />
      </Row>

      <Row title="Disabled — no border, no shadow, muted text">
        <Textarea {...common} defaultValue="Twelve chars" disabled />
      </Row>

      <Row title="Read only">
        <Textarea {...common} defaultValue="Twelve chars" readOnly />
      </Row>

      <Row title="No counter, no resize handle">
        <Textarea label="Input area" showCounter={false} resizable={false} hint="Plain." />
      </Row>

      <Row title="Per-instance override — height and radius via custom properties">
        <Textarea
          {...common}
          style={
            { '--yote-ta-height': '200px', '--yote-ta-radius': '2px' } as React.CSSProperties
          }
        />
      </Row>
    </main>
  )
}
