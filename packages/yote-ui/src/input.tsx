import * as React from 'react'
import type { YoteFieldProps } from './types'
import { useComposedRef } from './lib/use-composed-ref'
import { useRequiredOptionalWarning } from './lib/warn-exclusive'
import { AlertIcon, InfoIcon } from './icons'

export type InputPart =
  | 'root'
  | 'label'
  | 'labelRow'
  | 'required'
  | 'optional'
  | 'info'
  | 'field'
  | 'leading'
  | 'trailing'
  | 'prefix'
  | 'suffix'
  | 'input'
  | 'message'

type NativeInputProps = Omit<
  React.ComponentPropsWithoutRef<'input'>,
  'value' | 'defaultValue' | 'onChange' | 'className' | 'style' | 'children' | 'size' | 'prefix'
>

export interface InputProps extends YoteFieldProps<InputPart>, NativeInputProps {
  /** A mark at the start of the field. 20px in the frame; any node works. */
  leading?: React.ReactNode
  /** A mark at the end. Also where an inline selector goes. */
  trailing?: React.ReactNode
  /**
   * Text at the start, inside the field — a currency symbol, a protocol, a
   * unit. Distinct from `leading` because an affix is read as part of the
   * value and gets the wider gap the frame gives it (Figma 6:2010).
   */
  prefix?: React.ReactNode
  /** Text at the end, inside the field. */
  suffix?: React.ReactNode
  required?: boolean
  optional?: boolean
  info?: string
}

function cx(...parts: Array<string | false | null | undefined>): string | undefined {
  const joined = parts.filter(Boolean).join(' ')
  return joined === '' ? undefined : joined
}

/**
 * The plain text field. Figma node 6:508.
 *
 * Everything else in the family is this box with something in a slot: an
 * affix (6:2010), an inline selector in `trailing` (6:3434). They are not
 * separate components because they are not separate behaviours — one field,
 * four things you can put in it.
 *
 * Only `sm` is measured. The frame draws a single geometry (8px padding, 8px
 * radius, 8px gap), which is this library's `sm`; `md` and `lg` follow the
 * ramp the password input already set, so the three sizes agree across the
 * library rather than each field inventing its own.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    value: valueProp,
    defaultValue,
    onChange,
    label,
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
    leading,
    trailing,
    prefix,
    suffix,
    required = false,
    optional = false,
    info,
    id: idProp,
    placeholder = 'Placeholder text...',
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

  const [focused, setFocused] = React.useState(false)

  useRequiredOptionalWarning('Input', required, optional)

  const reactId = React.useId()
  const id = idProp ?? `yote-${reactId}`
  const messageId = `${id}-message`

  const isInvalid = invalid ?? Boolean(error)
  const showError = isInvalid && error != null && error !== false
  const message = showError ? error : hint
  const hasAffix = prefix != null || suffix != null

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value
    if (!isControlled) setUncontrolled(next)
    onChange?.(next)
  }

  const describedBy = cx(ariaDescribedByProp, message != null ? messageId : undefined)

  return (
    <div
      className={cx('yote-field', 'yote-input', classNames?.root, className)}
      style={style}
      data-size={size}
      data-affix={hasAffix || undefined}
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
        data-affix={hasAffix || undefined}
        data-focused={focused || undefined}
        data-invalid={isInvalid || undefined}
        data-disabled={disabled || undefined}
        /*
         * The field box is bigger than the input inside it, and the gap
         * between them is dead space that looks clickable. Pressing it focuses
         * the input — but only when the press landed on the box itself, so a
         * trailing button or an inline selector still gets its own click.
         */
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
        {prefix != null ? (
          <span className={cx('yote-input-affix', classNames?.prefix)}>{prefix}</span>
        ) : null}

        <input
          {...rest}
          ref={composedRef}
          id={id}
          className={cx('yote-input-control', classNames?.input)}
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

        {suffix != null ? (
          <span className={cx('yote-input-affix', classNames?.suffix)}>{suffix}</span>
        ) : null}
        {trailing != null ? (
          <span className={cx('yote-input-icon', classNames?.trailing)}>{trailing}</span>
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

Input.displayName = 'Input'
