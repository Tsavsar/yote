import type * as React from 'react'

/**
 * The universal prop contract.
 *
 * These props behave identically on every component in the library. Someone
 * learns the vocabulary once and every future component needs no new
 * learning. Each component extends this interface and narrows `Parts` to
 * whatever it actually renders.
 *
 * Two conventions hold across the entire library:
 *
 *   `onChange` receives the value, not the event. Every component. Nobody
 *   should have to remember which one hands them a synthetic event.
 *
 *   `ref` always lands on the real underlying input, never on a wrapper div.
 */
export interface YoteFieldProps<Parts extends string = string> {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void

  label?: React.ReactNode
  hint?: React.ReactNode
  error?: React.ReactNode

  /** `error` implies `invalid` unless `invalid` explicitly says otherwise. */
  invalid?: boolean
  /**
   * Replays the error animation when the same error fires twice. Without it,
   * a second failed submit with an identical message does nothing.
   */
  errorKey?: string | number

  disabled?: boolean
  /** Reads as filled, not as disabled, and stays focusable. */
  readOnly?: boolean
  size?: 'sm' | 'md' | 'lg'

  /**
   * Per-part class names. A single `className` prop is useless the moment
   * someone wants the cells a different size. Parts differ per component,
   * the prop name does not.
   */
  classNames?: Partial<Record<Parts, string>>
  className?: string
  style?: React.CSSProperties
}
