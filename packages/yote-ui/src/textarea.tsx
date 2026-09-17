import * as React from 'react'
import type { YoteFieldProps } from './types'
import { useComposedRef } from './lib/use-composed-ref'
import { AlertIcon, InfoIcon, ResizeIcon } from './icons'

export type TextareaPart =
  | 'root'
  | 'label'
  | 'labelRow'
  | 'required'
  | 'optional'
  | 'info'
  | 'field'
  | 'input'
  | 'footer'
  | 'counter'
  | 'resize'
  | 'message'

type NativeTextareaProps = Omit<
  React.ComponentPropsWithoutRef<'textarea'>,
  'value' | 'defaultValue' | 'onChange' | 'className' | 'style' | 'children' | 'required'
>

export interface TextareaProps extends YoteFieldProps<TextareaPart>, NativeTextareaProps {
  /** Marks the field required: renders the asterisk and sets aria-required. */
  required?: boolean
  /** Renders the muted "(Optional)" note beside the label. */
  optional?: boolean
  /** Renders an info marker after the label, with this as its tooltip. */
  info?: string
  /** Caps the value and turns the counter on. */
  maxLength?: number
  /** Show the character counter. Defaults to on whenever maxLength is set. */
  showCounter?: boolean
  /** Show the drag handle that resizes the field. */
  resizable?: boolean
}

function cx(...parts: Array<string | false | null | undefined>): string | undefined {
  const joined = parts.filter(Boolean).join(' ')
  return joined === '' ? undefined : joined
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    value: valueProp,
    defaultValue,
    onChange,
    label,
    hint,
    error,
    invalid,
    // Accepted so the prop vocabulary is identical across the library — a
    // consumer can swap one field for another without editing props. Nothing
    // here replays, so it is deliberately unread.
    errorKey: _errorKey,
    disabled = false,
    readOnly = false,
    size = 'md',
    classNames,
    className,
    style,
    required = false,
    optional = false,
    info,
    maxLength,
    showCounter,
    resizable = true,
    id: idProp,
    placeholder = 'Share your thoughts',
    'aria-describedby': ariaDescribedByProp,
    onFocus,
    onBlur,
    ...rest
  },
  forwardedRef,
) {
  const innerRef = React.useRef<HTMLTextAreaElement>(null)
  const composedRef = useComposedRef<HTMLTextAreaElement>(innerRef, forwardedRef)
  const fieldRef = React.useRef<HTMLDivElement>(null)

  const isControlled = valueProp !== undefined
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? '')
  const value = isControlled ? valueProp : uncontrolled

  const [focused, setFocused] = React.useState(false)

  const reactId = React.useId()
  const id = idProp ?? `yote-${reactId}`
  const messageId = `${id}-message`

  // `error` implies `invalid` unless `invalid` explicitly says otherwise.
  const isInvalid = invalid ?? Boolean(error)
  const showError = isInvalid && error != null && error !== false
  const message = showError ? error : hint
  const counterOn = showCounter ?? maxLength !== undefined

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = event.target.value
    if (!isControlled) setUncontrolled(next)
    onChange?.(next)
  }

  /*
   * Resizing is driven by the handle rather than the browser's own grabber.
   *
   * Native `resize` would draw its own corner widget on top of the Figma mark
   * and only ever works from the bottom-right corner of the control. Taking
   * the pointer means the handle in the design is the real affordance.
   *
   * setPointerCapture keeps the drag alive when the pointer leaves the handle,
   * which it does immediately — you are dragging the box, not the icon.
   */
  const dragging = React.useRef<{ startY: number; startHeight: number } | null>(null)

  const onHandleDown = (event: React.PointerEvent<HTMLSpanElement>) => {
    const field = fieldRef.current
    if (!field || disabled) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragging.current = { startY: event.clientY, startHeight: field.getBoundingClientRect().height }
  }

  const onHandleMove = (event: React.PointerEvent<HTMLSpanElement>) => {
    const drag = dragging.current
    const field = fieldRef.current
    if (!drag || !field) return
    // A floor, so the field can never be dragged smaller than its own footer.
    const next = Math.max(64, drag.startHeight + (event.clientY - drag.startY))
    field.style.setProperty('--yote-ta-height', `${Math.round(next)}px`)
  }

  const endDrag = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (!dragging.current) return
    dragging.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const describedBy = cx(ariaDescribedByProp, message != null ? messageId : undefined)
  const filled = value.length > 0

  return (
    <div
      className={cx('yote-field', 'yote-ta', classNames?.root, className)}
      style={style}
      data-size={size}
      data-filled={filled || undefined}
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
        ref={fieldRef}
        className={cx('yote-ta-field', classNames?.field)}
        data-focused={focused || undefined}
        data-invalid={isInvalid || undefined}
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
      >
        <textarea
          {...rest}
          ref={composedRef}
          id={id}
          className={cx('yote-ta-input', classNames?.input)}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          maxLength={maxLength}
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

        {counterOn || resizable ? (
          <div className={cx('yote-ta-footer', classNames?.footer)}>
            {counterOn ? (
              <span className={cx('yote-ta-counter', classNames?.counter)}>
                {/* Tabular figures in the stylesheet, so the count does not
                    shuffle the resize handle sideways as digits change. */}
                {value.length}
                {maxLength !== undefined ? `/${maxLength}` : null}
              </span>
            ) : null}
            {resizable ? (
              <span
                className={cx('yote-ta-resize', classNames?.resize)}
                onPointerDown={onHandleDown}
                onPointerMove={onHandleMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                aria-hidden="true"
              >
                <ResizeIcon />
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Always rendered, so an error appearing never moves the form. */}
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

Textarea.displayName = 'Textarea'
