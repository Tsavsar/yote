import * as React from 'react'
import type { YoteFieldProps } from './types'
import { useComposedRef } from './lib/use-composed-ref'
import { setNativeValue } from './lib/set-native-value'
import { AlertIcon } from './icons'

export type PinInputPart = 'root' | 'label' | 'group' | 'cell' | 'digit' | 'caret' | 'message'

type NativeInputProps = Omit<
  React.ComponentPropsWithoutRef<'input'>,
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'size'
  | 'className'
  | 'style'
  | 'children'
  | 'type'
  | 'maxLength'
>

export interface PinInputProps extends Omit<YoteFieldProps<PinInputPart>, 'size'>, NativeInputProps {
  /** Cell count, also sets `maxLength`. */
  length?: number
  /** Fires when the last cell fills. */
  onComplete?: (value: string) => void
  /** Dots instead of digits, for PINs. */
  mask?: boolean
}

/** Keys that would move the caret off the end of the value. */
const NAV_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'])

function sanitize(raw: string, length: number): string {
  return raw.replace(/\D/g, '').slice(0, length)
}

function cx(...parts: Array<string | false | null | undefined>): string | undefined {
  const joined = parts.filter(Boolean).join(' ')
  return joined === '' ? undefined : joined
}

export const PinInput = React.forwardRef<HTMLInputElement, PinInputProps>(function PinInput(
  {
    value: valueProp,
    defaultValue,
    onChange,
    label,
    hint,
    error,
    invalid,
    errorKey,
    disabled = false,
    readOnly = false,
    classNames,
    className,
    style,
    length = 4,
    onComplete,
    mask = false,
    id: idProp,
    autoComplete: autoCompleteProp,
    inputMode: inputModeProp,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedByProp,
    onFocus,
    onBlur,
    onKeyDown,
    onSelect,
    ...rest
  },
  forwardedRef,
) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const composedRef = useComposedRef<HTMLInputElement>(inputRef, forwardedRef)

  const isControlled = valueProp !== undefined
  const [uncontrolled, setUncontrolled] = React.useState(() => sanitize(defaultValue ?? '', length))
  const value = sanitize(isControlled ? valueProp : uncontrolled, length)

  const [focused, setFocused] = React.useState(false)
  const [shaking, setShaking] = React.useState(false)

  const reactId = React.useId()
  const id = idProp ?? `yote-${reactId}`
  const messageId = `${id}-message`

  // `error` implies `invalid` unless `invalid` explicitly says otherwise.
  const isInvalid = invalid ?? Boolean(error)
  const showError = isInvalid && error != null && error !== false
  const message = showError ? error : hint

  const interactive = !disabled && !readOnly
  const activeIndex = focused && interactive ? Math.min(value.length, length - 1) : -1

  // Keep the DOM input in step with the value we consider real, so a
  // controlled update or a rejected character never leaves the two apart.
  React.useEffect(() => {
    const el = inputRef.current
    if (el && el.value !== value) setNativeValue(el, value)
  }, [value])

  /**
   * The caret always sits at the end, so clicking into the middle of the
   * group cannot desync the real caret from the painted one. A genuine
   * range selection is left alone — select-all then retype still works.
   */
  const pinCaret = React.useCallback(() => {
    const el = inputRef.current
    if (!el) return
    const { selectionStart, selectionEnd } = el
    if (selectionStart === null || selectionEnd === null) return
    if (selectionStart !== selectionEnd) return
    const end = el.value.length
    if (selectionStart !== end) el.setSelectionRange(end, end)
  }, [])

  React.useEffect(() => {
    if (focused) pinCaret()
  }, [value, focused, pinCaret])

  const lastComplete = React.useRef<string | null>(null)

  const handleChange = () => {
    const el = inputRef.current
    if (!el || disabled || readOnly) return

    const next = sanitize(el.value, length)
    // Strip rejected characters straight back out of the DOM. Without this
    // the invisible input keeps the letter and the next keystroke is parsed
    // against a value the user never typed.
    if (el.value !== next) setNativeValue(el, next)

    if (!isControlled) setUncontrolled(next)
    onChange?.(next)

    if (next.length === length) {
      if (lastComplete.current !== next) {
        lastComplete.current = next
        onComplete?.(next)
      }
    } else {
      lastComplete.current = null
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    if (NAV_KEYS.has(event.key)) event.preventDefault()
  }

  const handleSelect = (event: React.SyntheticEvent<HTMLInputElement>) => {
    onSelect?.(event)
    pinCaret()
  }

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true)
    onFocus?.(event)
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false)
    onBlur?.(event)
  }

  // Replay the shake on every failed attempt, including an identical error
  // fired twice, which is what errorKey is for.
  const prevInvalid = React.useRef(false)
  const prevErrorKey = React.useRef(errorKey)

  React.useEffect(() => {
    const became = isInvalid && !prevInvalid.current
    const replayed = isInvalid && errorKey !== undefined && errorKey !== prevErrorKey.current
    prevInvalid.current = isInvalid
    prevErrorKey.current = errorKey
    if (!became && !replayed) return

    // A single requestAnimationFrame gets batched and the keyframes never
    // restart. Two nested frames are required.
    setShaking(false)
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setShaking(true))
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [isInvalid, errorKey])

  const handleAnimationEnd = (event: React.AnimationEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) setShaking(false)
  }

  const describedBy = cx(ariaDescribedByProp, message != null ? messageId : undefined)

  const cells = Array.from({ length }, (_, index) => {
    const char = value[index]
    const isActive = index === activeIndex
    // No caret over a filled cell: when the code is complete the last cell
    // keeps the active ring but the digit owns the space.
    const showCaret = isActive && value.length < length

    return (
      <div
        key={index}
        className={cx('yote-cell', classNames?.cell)}
        data-active={isActive || undefined}
        data-filled={char !== undefined || undefined}
        data-invalid={isInvalid || undefined}
        data-disabled={disabled || undefined}
        aria-hidden="true"
      >
        {char !== undefined ? (
          <span
            key={`${index}:${char}`}
            className={cx('yote-digit', classNames?.digit)}
            data-invalid={isInvalid || undefined}
            data-disabled={disabled || undefined}
          >
            {mask ? '•' : char}
          </span>
        ) : null}
        {showCaret ? (
          // Keyed on the value length so the blink restarts in its on frame
          // on every keystroke, the way a real text caret does.
          <span key={value.length} className={cx('yote-caret', classNames?.caret)} />
        ) : null}
      </div>
    )
  })

  return (
    <div
      className={cx('yote-field', 'yote-pin-field', classNames?.root, className)}
      // The cell count sizes the field, and the group reads it back through
      // inheritance. It has to live above the container so the field has a
      // definite width to hand down. Consumer style wins.
      style={{ '--yote-len': length, ...style } as React.CSSProperties}
      data-filled={value.length > 0 || undefined}
      data-focused={focused || undefined}
      data-invalid={isInvalid || undefined}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      data-size="md"
    >
      {label != null ? (
        <label htmlFor={id} className={cx('yote-label', classNames?.label)}>
          {label}
        </label>
      ) : null}

      <div
        className={cx('yote-group', classNames?.group)}
        data-disabled={disabled || undefined}
        data-shaking={shaking || undefined}
        onAnimationEnd={handleAnimationEnd}
      >
        {cells}
        <input
          {...rest}
          ref={composedRef}
          id={id}
          className="yote-input"
          type="text"
          inputMode={inputModeProp ?? 'numeric'}
          // A masked PIN is not a one-time code; offering the SMS suggestion
          // for one would be wrong.
          autoComplete={autoCompleteProp ?? (mask ? 'off' : 'one-time-code')}
          maxLength={length}
          disabled={disabled}
          readOnly={readOnly}
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label={ariaLabel ?? (label != null ? undefined : 'Verification code')}
          aria-invalid={isInvalid || undefined}
          aria-describedby={describedBy}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onSelect={handleSelect}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      {/* Always rendered, so an error appearing never moves the form and the
          live region is a stable node rather than one inserted with its own
          content. aria-live="polite", not role="alert", which is too noisy
          on re-render. */}
      <div
        id={messageId}
        className={cx('yote-message', classNames?.message)}
        data-invalid={showError || undefined}
        aria-live="polite"
      >
        {/* The mark is decoration — the message text already carries the
            meaning, and announcing an icon before it would just be noise. */}
        {showError ? <AlertIcon /> : null}
        {message != null ? <span className="yote-message-text">{message}</span> : null}
      </div>
    </div>
  )
})

PinInput.displayName = 'PinInput'
