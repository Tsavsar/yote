'use client'

import * as React from 'react'
import { PinInput } from 'yote-ui'

const CODE = '4062'
/** Slower than a person types, so each cell is legible on its own. */
const CADENCE = 130
const FIRST = 520

/**
 * The hero's live field.
 *
 * It types a code into itself once, on load, and then it is just a field you
 * can use. The whole pitch of this library is how a digit lands in a cell,
 * and reading that sentence is a worse way to learn it than watching it
 * happen — which is the one valid reason to animate something the user did
 * not ask for.
 *
 * The rules that keep it from being a gimmick:
 *
 *   It runs once per visit, never on a loop. A thing that keeps moving in the
 *   corner of your eye while you read is an advert.
 *
 *   Touching the field cancels it mid-way. If you came here to type, the page
 *   must get out of the way instantly rather than fight you for the caret.
 *
 *   Under reduced motion the code is simply already there. The point is the
 *   filled state; the typing is the flourish.
 */
export function HeroDemo() {
  const [value, setValue] = React.useState('')
  const timers = React.useRef<number[]>([])

  const cancel = React.useCallback(() => {
    timers.current.forEach(window.clearTimeout)
    timers.current = []
  }, [])

  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(CODE)
      return
    }

    for (let i = 1; i <= CODE.length; i++) {
      timers.current.push(
        window.setTimeout(() => setValue(CODE.slice(0, i)), FIRST + (i - 1) * CADENCE),
      )
    }
    return cancel
  }, [cancel])

  return (
    <div className="hero-demo" onPointerDownCapture={cancel} onKeyDownCapture={cancel}>
      <PinInput label={null} value={value} onChange={setValue} aria-label="Try the digit input" />
    </div>
  )
}
