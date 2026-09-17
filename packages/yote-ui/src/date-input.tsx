import * as React from 'react'
import type { YoteFieldProps } from './types'
import { useComposedRef } from './lib/use-composed-ref'
import { useRequiredOptionalWarning } from './lib/warn-exclusive'
import { applyMask, digitsOf, slotCount } from './lib/mask'
import { AlertIcon, CalendarIcon, InfoIcon } from './icons'

export type DateInputPart =
  | 'root'
  | 'label'
  | 'labelRow'
  | 'required'
  | 'optional'
  | 'info'
  | 'field'
  | 'leading'
  | 'input'
  | 'shortcut'
  | 'message'

type NativeInputProps = Omit<
  React.ComponentPropsWithoutRef<'input'>,
  'value' | 'defaultValue' | 'onChange' | 'className' | 'style' | 'children' | 'size' | 'type'
>

export interface DateInputProps extends YoteFieldProps<DateInputPart>, NativeInputProps {
  /**
   * The shape of the field. `0` is a digit slot, everything else is typed for
   * you. Drives the placeholder, the mask and the max length together, so
   * "MM/DD/YYYY" or "YYYY-MM-DD" need nothing else changed.
   */
  pattern?: string
  /** Fires when every slot is filled. Gives the masked value. */
  onComplete?: (value: string) => void
  leading?: React.ReactNode
  /** A keyboard hint at the end of the field, e.g. ⌘ + S (Figma 6:562). */
  shortcut?: React.ReactNode
  required?: boolean
  optional?: boolean
  info?: string
}

function cx(...parts: Array<string | false | null | undefined>): string | undefined {
  const joined = parts.filter(Boolean).join(' ')
  return joined === '' ? undefined : joined
}

/**
 * A date typed, not picked. Figma node 6:734.
 *
 * There is no calendar popover and there will not be one: the scope rule for
 * this library is inputs, and a date picker is a different product with
 * locales, ranges and a month grid to keep. This is the field half, done
 * properly — masked as you type, tolerant of paste, and honest about what it
 * hands back.
 *
 * `onChange` gives the masked string exactly as displayed. It is never parsed
 * into a Date: "31/02/2026" is a real thing someone can type, and deciding
 * whether that is an error is validation, which the library does not own.
 */
export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(function DateInput(
  {
    value: valueProp,
    defaultValue,
    onChange,
    label = 'Date',
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
    pattern = 'DD/MM/YYYY'.replace(/[A-Z]/g, '0'),
    onComplete,
    leading = <CalendarIcon />,
    shortcut,
    required = false,
    optional = false,
    info,
    id: idProp,
    placeholder = 'DD/MM/YYYY',
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
  const [uncontrolled, setUncontrolled] = React.useState(applyMask(defaultValue ?? '', pattern))
  const value = isControlled ? applyMask(valueProp, pattern) : uncontrolled

  const [focused, setFocused] = React.useState(false)

  useRequiredOptionalWarning('DateInput', required, optional)

  const reactId = React.useId()
  const id = idProp ?? `yote-${reactId}`
  const messageId = `${id}-message`

  const isInvalid = invalid ?? Boolean(error)
  const showError = isInvalid && error != null && error !== false
  const message = showError ? error : hint
  const slots = slotCount(pattern)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = applyMask(event.target.value, pattern)
    if (!isControlled) setUncontrolled(next)
    onChange?.(next)
    if (digitsOf(next).length === slots) onComplete?.(next)
  }

  const describedBy = cx(ariaDescribedByProp, message != null ? messageId : undefined)

  return (
    <div
      className={cx('yote-field', 'yote-input', classNames?.root, className)}
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
        {leading != null ? (
          <span className={cx('yote-input-icon', classNames?.leading)} aria-hidden="true">
            {leading}
          </span>
        ) : null}

        <input
          {...rest}
          ref={composedRef}
          id={id}
          className={cx('yote-input-control', classNames?.input)}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={value}
          onChange={handleChange}
          maxLength={pattern.length}
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

        {shortcut != null ? (
          <kbd className={cx('yote-kbd', classNames?.shortcut)}>{shortcut}</kbd>
        ) : null}
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

DateInput.displayName = 'DateInput'
