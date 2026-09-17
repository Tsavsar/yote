import * as React from 'react'
import { createPortal } from 'react-dom'
import type { YoteFieldProps } from './types'
import { useComposedRef } from './lib/use-composed-ref'
import {
  useDismiss,
  useListboxKeys,
  usePopoverPlacement,
  useScrollActiveIntoView,
} from './lib/popover'
import { AlertIcon, ChevronDownIcon, InfoIcon } from './icons'

export type SelectInputPart =
  | 'root'
  | 'label'
  | 'labelRow'
  | 'required'
  | 'optional'
  | 'info'
  | 'field'
  | 'leading'
  | 'input'
  | 'chevron'
  | 'panel'
  | 'option'
  | 'message'

export interface SelectOption {
  value: string
  label: string
  /** Extra text to match against, never rendered. */
  keywords?: string
}

type NativeInputProps = Omit<
  React.ComponentPropsWithoutRef<'input'>,
  'value' | 'defaultValue' | 'onChange' | 'className' | 'style' | 'children' | 'size'
>

export interface SelectInputProps extends YoteFieldProps<SelectInputPart>, NativeInputProps {
  options: SelectOption[]
  leading?: React.ReactNode
  required?: boolean
  optional?: boolean
  info?: string
  /** Shown when the query matches nothing. */
  emptyLabel?: React.ReactNode
}

function cx(...parts: Array<string | false | null | undefined>): string | undefined {
  const joined = parts.filter(Boolean).join(' ')
  return joined === '' ? undefined : joined
}

/**
 * A select whose field is its own search. Figma node 6:4527.
 *
 * There is no search row inside the panel, unlike the country picker: the
 * field you already focused is the thing you type into, and adding a second
 * text box below the first would be asking which one to use. Typing filters;
 * choosing writes the label back into the field.
 *
 * `value` is the chosen option's value, not the text on screen — the two are
 * different things and a consumer should never have to parse a label back
 * into an id. What is typed while the panel is open is local to the panel and
 * discarded when it closes.
 */
export const SelectInput = React.forwardRef<HTMLInputElement, SelectInputProps>(
  function SelectInput(
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
      options,
      leading,
      required = false,
      optional = false,
      info,
      emptyLabel = 'No match',
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
    const fieldRef = React.useRef<HTMLDivElement>(null)
    const panelRef = React.useRef<HTMLDivElement>(null)
    const listRef = React.useRef<HTMLUListElement>(null)

    const isControlled = valueProp !== undefined
    const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? '')
    const value = isControlled ? valueProp : uncontrolled

    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState('')
    const [activeIndex, setActiveIndex] = React.useState(0)
    const [focused, setFocused] = React.useState(false)

    const selected = options.find((o) => o.value === value)

    const matches = React.useMemo(() => {
      const q = query.trim().toLowerCase()
      if (q === '') return options
      return options.filter(
        (o) =>
          o.label.toLowerCase().includes(q) ||
          (o.keywords !== undefined && o.keywords.toLowerCase().includes(q)),
      )
    }, [options, query])

    const close = React.useCallback(() => {
      setOpen(false)
      setQuery('')
    }, [])

    const placement = usePopoverPlacement(open, fieldRef)
    useDismiss(open, close, [fieldRef, panelRef])
    useScrollActiveIntoView(open, activeIndex, listRef)

    React.useEffect(() => {
      if (!open) return
      const index = options.findIndex((o) => o.value === value)
      setActiveIndex(index < 0 ? 0 : index)
    }, [open, options, value])

    const commit = (index: number) => {
      const option = matches[index]
      if (!option) return
      if (!isControlled) setUncontrolled(option.value)
      onChange?.(option.value)
      close()
      innerRef.current?.focus()
    }

    const onKeyDown = useListboxKeys({
      open,
      setOpen,
      count: matches.length,
      activeIndex,
      setActiveIndex,
      onCommit: commit,
      close,
      /* The field takes typed text, so a space is a space. */
      openOnSpace: false,
    })

    const reactId = React.useId()
    const id = idProp ?? `yote-${reactId}`
    const messageId = `${id}-message`
    const listId = `${id}-list`

    const isInvalid = invalid ?? Boolean(error)
    const showError = isInvalid && error != null && error !== false
    const message = showError ? error : hint
    const describedBy = cx(ariaDescribedByProp, message != null ? messageId : undefined)

    /* Typed text while open, the chosen label when shut. */
    const shown = open ? query : (selected?.label ?? '')

    return (
      <div
        className={cx('yote-field', 'yote-input', classNames?.root, className)}
        style={style}
        data-size={size}
        data-filled={selected !== undefined || undefined}
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
          className={cx('yote-input-field', classNames?.field)}
          data-size={size}
          data-focused={focused || undefined}
          data-invalid={isInvalid || undefined}
          data-disabled={disabled || undefined}
          onKeyDown={onKeyDown}
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
            role="combobox"
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            aria-autocomplete="list"
            aria-activedescendant={
              open && matches[activeIndex] ? `${id}-opt-${matches[activeIndex].value}` : undefined
            }
            value={shown}
            onChange={(event) => {
              setQuery(event.target.value)
              setActiveIndex(0)
              if (!open) setOpen(true)
            }}
            onPointerDown={() => {
              if (!disabled && !readOnly) setOpen(true)
            }}
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

          <span
            className={cx('yote-input-icon', 'yote-select-chevron', classNames?.chevron)}
            data-open={open || undefined}
            aria-hidden="true"
          >
            <ChevronDownIcon size={20} />
          </span>
        </div>

        {open && placement
          ? createPortal(
              <div
                ref={panelRef}
                className={cx('yote-pop-panel', classNames?.panel)}
                data-side={placement.side}
                style={placement.style}
                onKeyDown={onKeyDown}
              >
                <ul className="yote-pop-list" id={listId} role="listbox" ref={listRef}>
                  {matches.map((option, index) => (
                    <li
                      key={option.value}
                      id={`${id}-opt-${option.value}`}
                      role="option"
                      aria-selected={option.value === value}
                      className={cx('yote-pop-item', classNames?.option)}
                      data-active={index === activeIndex || undefined}
                      data-selected={option.value === value || undefined}
                      onPointerDown={(event) => event.preventDefault()}
                      onClick={() => commit(index)}
                      onPointerEnter={() => setActiveIndex(index)}
                    >
                      {option.label}
                    </li>
                  ))}
                  {matches.length === 0 ? <li className="yote-pop-empty">{emptyLabel}</li> : null}
                </ul>
              </div>,
              document.body,
            )
          : null}

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
  },
)

SelectInput.displayName = 'SelectInput'
