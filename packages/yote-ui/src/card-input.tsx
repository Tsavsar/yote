import * as React from 'react'
import type { YoteFieldProps } from './types'
import { useComposedRef } from './lib/use-composed-ref'
import { useRequiredOptionalWarning } from './lib/warn-exclusive'
import { applyMask, digitsOf } from './lib/mask'
import { AlertIcon, InfoIcon } from './icons'
import { BRAND_MARKS } from './card-marks'

export type CardInputPart =
  | 'root'
  | 'label'
  | 'labelRow'
  | 'required'
  | 'optional'
  | 'info'
  | 'field'
  | 'leading'
  | 'input'
  | 'message'

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown'

/**
 * Brand from the issuer identification number.
 *
 * Deliberately shallow — enough to group the digits correctly and show a
 * mark, not a card validator. Checking that a number is real is the payment
 * processor's job and it will do it whatever this field decides.
 */
export function cardBrandOf(value: string): CardBrand {
  const digits = digitsOf(value)
  if (/^4/.test(digits)) return 'visa'
  if (/^(5[1-5]|2[2-7])/.test(digits)) return 'mastercard'
  if (/^3[47]/.test(digits)) return 'amex'
  if (/^6(011|5)/.test(digits)) return 'discover'
  return 'unknown'
}

/* Two spaces between groups, from the frame: at 14px the single space was too
   tight to read the groups apart at a glance. Amex is 4-6-5. */
const GROUPING: Record<CardBrand, string> = {
  amex: '0000  000000  00000',
  visa: '0000  0000  0000  0000',
  mastercard: '0000  0000  0000  0000',
  discover: '0000  0000  0000  0000',
  unknown: '0000  0000  0000  0000',
}

type NativeInputProps = Omit<
  React.ComponentPropsWithoutRef<'input'>,
  'value' | 'defaultValue' | 'onChange' | 'className' | 'style' | 'children' | 'size' | 'type'
>

export interface CardInputProps extends YoteFieldProps<CardInputPart>, NativeInputProps {
  /**
   * The mark at the start of the field. Left unset it shows the network the
   * number belongs to, and a plain card glyph until it knows.
   */
  brand?: React.ReactNode
  /** Fires when the detected brand changes, so you can render your own mark. */
  onBrandChange?: (brand: CardBrand) => void
  required?: boolean
  optional?: boolean
  info?: string
}

function cx(...parts: Array<string | false | null | undefined>): string | undefined {
  const joined = parts.filter(Boolean).join(' ')
  return joined === '' ? undefined : joined
}

/**
 * A card number. Figma node 6:3156.
 *
 * The grouping follows the brand as you type — Amex is 4-6-5 and everything
 * else is four fours — because a field that regroups your digits the moment
 * it recognises the card is the clearest possible signal that it read them.
 *
 * `onChange` gives the number as displayed, spaces and all. What it never
 * does is tell you whether the card is valid: a Luhn check passes for
 * numbers no bank ever issued and fails for nothing your processor will not
 * catch anyway, so it would be a confident answer to the wrong question.
 */
export const CardInput = React.forwardRef<HTMLInputElement, CardInputProps>(function CardInput(
  {
    value: valueProp,
    defaultValue,
    onChange,
    label = 'Card number',
    hint,
    error,
    invalid,
    errorKey: _errorKey,
    disabled = false,
    readOnly = false,
    size = 'md',
    classNames,
    className,
    style,
    brand,
    onBrandChange,
    required = false,
    optional = false,
    info,
    id: idProp,
    placeholder = '0000  0000  0000  0000',
    'aria-describedby': ariaDescribedByProp,
    onFocus,
    onBlur,
    ...rest
  },
  forwardedRef,
) {
  const innerRef = React.useRef<HTMLInputElement>(null)
  const composedRef = useComposedRef<HTMLInputElement>(innerRef, forwardedRef)

  const isControlled = valueProp !== undefined
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? '')
  const raw = isControlled ? valueProp : uncontrolled

  const detected = cardBrandOf(raw)
  const value = applyMask(raw, GROUPING[detected])

  const [focused, setFocused] = React.useState(false)

  useRequiredOptionalWarning('CardInput', required, optional)

  /* Reported rather than returned, so a consumer can swap in their own mark
     without reimplementing the detection. */
  const lastBrand = React.useRef<CardBrand>(detected)
  React.useEffect(() => {
    if (lastBrand.current === detected) return
    lastBrand.current = detected
    onBrandChange?.(detected)
  }, [detected, onBrandChange])

  const reactId = React.useId()
  const id = idProp ?? `yote-${reactId}`
  const messageId = `${id}-message`

  const isInvalid = invalid ?? Boolean(error)
  const showError = isInvalid && error != null && error !== false
  const message = showError ? error : hint

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = applyMask(event.target.value, GROUPING[cardBrandOf(event.target.value)])
    if (!isControlled) setUncontrolled(next)
    onChange?.(next)
  }

  /*
   * One mark, at the start, and it changes. The frame draws a generic card
   * glyph on the left and the network's plate on the right, which says the
   * same thing twice, and the left is where your eye already is because it is
   * where the number begins. So the glyph becomes the card.
   *
   * The slot it sits in is a fixed width, so recognising the card swaps the
   * mark without moving a single digit. A field that jolts sideways the
   * moment it understands you is worse than one that never noticed.
   */
  const mark = brand ?? BRAND_MARKS[detected] ?? BRAND_MARKS.unknown
  const describedBy = cx(ariaDescribedByProp, message != null ? messageId : undefined)

  return (
    <div
      className={cx('yote-field', 'yote-input', classNames?.root, className)}
      style={style}
      data-size={size}
      data-brand={detected}
      data-filled={value.length > 0 || undefined}
      data-focused={focused || undefined}
      data-invalid={isInvalid || undefined}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
    >
      {label != null ? (
        <div className={cx('yote-label-row', classNames?.labelRow)}>
          <label htmlFor={id} className={cx('yote-label', classNames?.label)}>
            {label}
          </label>
          {required ? (
            <span className={cx('yote-required', classNames?.required)} aria-hidden="true">
              *
            </span>
          ) : null}
          {optional ? (
            <span className={cx('yote-optional', classNames?.optional)}>(Optional)</span>
          ) : null}
          {info != null ? (
            <span
              className={cx('yote-info', classNames?.info)}
              title={info}
              role="img"
              aria-label={info}
            >
              <InfoIcon size={14} />
            </span>
          ) : null}
        </div>
      ) : null}

      <div
        className={cx('yote-input-field', classNames?.field)}
        data-size={size}
        data-focused={focused || undefined}
        data-invalid={isInvalid || undefined}
        data-disabled={disabled || undefined}
        onPointerDown={(event) => {
          if (event.target === event.currentTarget && !disabled) {
            event.preventDefault()
            innerRef.current?.focus()
          }
        }}
      >
        {mark != null ? (
          <span className={cx('yote-card-mark', classNames?.leading)} aria-hidden="true">
            {mark}
          </span>
        ) : null}

        <input
          {...rest}
          ref={composedRef}
          id={id}
          className={cx('yote-input-control', classNames?.input)}
          type="text"
          inputMode="numeric"
          autoComplete="cc-number"
          value={value}
          onChange={handleChange}
          maxLength={GROUPING[detected].length}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          aria-required={required || undefined}
          aria-invalid={isInvalid || undefined}
          aria-describedby={describedBy}
          onFocus={(event) => {
            setFocused(true)
            onFocus?.(event)
          }}
          onBlur={(event) => {
            setFocused(false)
            onBlur?.(event)
          }}
        />
      </div>

      <div
        id={messageId}
        className={cx('yote-message', classNames?.message)}
        data-invalid={showError || undefined}
        data-disabled={disabled || undefined}
        aria-live="polite"
      >
        {message != null ? (
          showError ? (
            <AlertIcon size={14} />
          ) : (
            <span className="yote-message-icon yote-message-icon-sm">
              <InfoIcon size={14} />
            </span>
          )
        ) : null}
        {message != null ? <span className="yote-message-text">{message}</span> : null}
      </div>
    </div>
  )
})

CardInput.displayName = 'CardInput'
