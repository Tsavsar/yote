import * as React from 'react'
import type { YoteFieldProps } from './types'
import { useComposedRef } from './lib/use-composed-ref'
import { AlertIcon, ChevronDownIcon, InfoIcon } from './icons'

export type PhoneInputPart =
  | 'root'
  | 'label'
  | 'labelRow'
  | 'required'
  | 'optional'
  | 'info'
  | 'field'
  | 'country'
  | 'flag'
  | 'dialCode'
  | 'input'
  | 'message'

/**
 * A dialling country.
 *
 * `flag` is the emoji, not an image. Shipping a flag sprite would mean every
 * consumer resolving assets for a field, and a per-country SVG set is both
 * large and a political maintenance burden — the emoji is in every system
 * font and needs nothing.
 */
export interface PhoneCountry {
  /** ISO 3166-1 alpha-2, used as the value and the emoji source. */
  code: string
  /** Dial code including the plus, e.g. "+1". */
  dial: string
  name: string
}

/** A short default list. Pass your own `countries` for anything real. */
export const DEFAULT_PHONE_COUNTRIES: PhoneCountry[] = [
  { code: 'US', dial: '+1', name: 'United States' },
  { code: 'GB', dial: '+44', name: 'United Kingdom' },
  { code: 'FI', dial: '+358', name: 'Finland' },
  { code: 'NG', dial: '+234', name: 'Nigeria' },
  { code: 'DE', dial: '+49', name: 'Germany' },
  { code: 'FR', dial: '+33', name: 'France' },
  { code: 'IN', dial: '+91', name: 'India' },
  { code: 'JP', dial: '+81', name: 'Japan' },
]

/** Rendered when `countries` is empty, so the field still shows something. */
const FALLBACK_COUNTRY: PhoneCountry = { code: 'US', dial: '+1', name: 'United States' }

/** ISO code to its regional-indicator emoji. 'US' -> 🇺🇸 */
function flagOf(code: string): string {
  return code
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .split('')
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join('')
}

type NativeInputProps = Omit<
  React.ComponentPropsWithoutRef<'input'>,
  'value' | 'defaultValue' | 'onChange' | 'className' | 'style' | 'children' | 'type' | 'size'
>

export interface PhoneInputProps extends YoteFieldProps<PhoneInputPart>, NativeInputProps {
  /** Selectable dialling countries. */
  countries?: PhoneCountry[]
  /** Selected ISO code. Controlled alongside `onCountryChange`. */
  country?: string
  defaultCountry?: string
  onCountryChange?: (code: string) => void
  required?: boolean
  optional?: boolean
  info?: string
}

function cx(...parts: Array<string | false | null | undefined>): string | undefined {
  const joined = parts.filter(Boolean).join(' ')
  return joined === '' ? undefined : joined
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(function PhoneInput(
  {
    value: valueProp,
    defaultValue,
    onChange,
    label = 'Phone number',
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
    countries = DEFAULT_PHONE_COUNTRIES,
    country: countryProp,
    defaultCountry = 'US',
    onCountryChange,
    required = false,
    optional = false,
    info,
    id: idProp,
    placeholder = '000 000 0000',
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
  const value = isControlled ? valueProp : uncontrolled

  const countryControlled = countryProp !== undefined
  const [ownCountry, setOwnCountry] = React.useState(defaultCountry)
  const countryCode = countryControlled ? countryProp : ownCountry
  const selected =
    countries.find((c) => c.code === countryCode) ?? countries[0] ?? FALLBACK_COUNTRY

  const [focused, setFocused] = React.useState(false)

  const reactId = React.useId()
  const id = idProp ?? `yote-${reactId}`
  const messageId = `${id}-message`
  const countryId = `${id}-country`

  const isInvalid = invalid ?? Boolean(error)
  const showError = isInvalid && error != null && error !== false
  const message = showError ? error : hint

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value
    if (!isControlled) setUncontrolled(next)
    onChange?.(next)
  }

  const handleCountry = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const next = event.target.value
    if (!countryControlled) setOwnCountry(next)
    onCountryChange?.(next)
  }

  const describedBy = cx(ariaDescribedByProp, message != null ? messageId : undefined)

  return (
    <div
      className={cx('yote-field', 'yote-phone', classNames?.root, className)}
      style={style}
      data-size={size}
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
        className={cx('yote-phone-field', classNames?.field)}
        data-focused={focused || undefined}
        data-invalid={isInvalid || undefined}
        data-disabled={disabled || undefined}
      >
        {/*
          A real <select> under the flag and dial code, rather than a custom
          popover. It gets the platform's own picker — searchable, keyboard
          driven, and correct on a phone — for nothing, and the visible part
          is just styled text sitting on top of it.
        */}
        <span className={cx('yote-phone-country', classNames?.country)}>
          <span className={cx('yote-phone-flag', classNames?.flag)} aria-hidden="true">
            {flagOf(selected.code)}
          </span>
          <span className={cx('yote-phone-dial', classNames?.dialCode)}>{selected.dial}</span>
          <ChevronDownIcon />
          <select
            id={countryId}
            className="yote-phone-select"
            value={selected.code}
            onChange={handleCountry}
            disabled={disabled || readOnly}
            aria-label="Dialling country"
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} ({c.dial})
              </option>
            ))}
          </select>
        </span>

        <input
          {...rest}
          ref={composedRef}
          id={id}
          className={cx('yote-phone-input', classNames?.input)}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          value={value}
          onChange={handleChange}
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
            <AlertIcon />
          ) : (
            <span className="yote-message-icon yote-message-icon-sm">
              <InfoIcon size={16} />
            </span>
          )
        ) : null}
        {message != null ? <span className="yote-message-text">{message}</span> : null}
      </div>
    </div>
  )
})

PhoneInput.displayName = 'PhoneInput'
