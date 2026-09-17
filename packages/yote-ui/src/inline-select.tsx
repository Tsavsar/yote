import * as React from 'react'
import { createPortal } from 'react-dom'
import {
  useDismiss,
  useListboxKeys,
  usePopoverPlacement,
  useScrollActiveIntoView,
} from './lib/popover'
import { ChevronDownIcon } from './icons'
import type { SelectOption } from './select-input'

export interface InlineSelectProps {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  disabled?: boolean
  'aria-label'?: string
  className?: string
}

function cx(...parts: Array<string | false | null | undefined>): string | undefined {
  const joined = parts.filter(Boolean).join(' ')
  return joined === '' ? undefined : joined
}

/**
 * A small select that lives inside a field's `trailing` slot. Figma 6:3434.
 *
 * "bradlyspencer — can view ⌄". It is not a field of its own: it is a second
 * decision attached to the value beside it, which is why it sits inside the
 * same box rather than next to it, and why it has no label of its own.
 *
 * The panel is the library's shared one, anchored to this control rather than
 * to the field — it is narrow, and stretching it to the field's width would
 * make a three-word menu look like a mistake.
 */
export function InlineSelect({
  options,
  value: valueProp,
  defaultValue,
  onChange,
  disabled = false,
  'aria-label': ariaLabel,
  className,
}: InlineSelectProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const panelRef = React.useRef<HTMLDivElement>(null)
  const listRef = React.useRef<HTMLUListElement>(null)

  const isControlled = valueProp !== undefined
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? options[0]?.value ?? '')
  const value = isControlled ? valueProp : uncontrolled

  const [open, setOpen] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(0)

  const selected = options.find((o) => o.value === value) ?? options[0]

  const close = React.useCallback(() => setOpen(false), [])
  /* Wider than the trigger, which is three words of text. */
  const placement = usePopoverPlacement(open, rootRef, 200)
  useDismiss(open, close, [rootRef, panelRef])
  useScrollActiveIntoView(open, activeIndex, listRef)

  React.useEffect(() => {
    if (!open) return
    const index = options.findIndex((o) => o.value === value)
    setActiveIndex(index < 0 ? 0 : index)
  }, [open, options, value])

  const commit = (index: number) => {
    const option = options[index]
    if (!option) return
    if (!isControlled) setUncontrolled(option.value)
    onChange?.(option.value)
    close()
  }

  const onKeyDown = useListboxKeys({
    open,
    setOpen,
    count: options.length,
    activeIndex,
    setActiveIndex,
    onCommit: commit,
    close,
  })

  const reactId = React.useId()
  const id = `yote-${reactId}`
  const listId = `${id}-list`

  return (
    <div className={cx('yote-pop', className)} ref={rootRef} onKeyDown={onKeyDown}>
      <button
        type="button"
        id={id}
        className="yote-inline-select"
        onClick={() => (open ? close() : setOpen(true))}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        <span className="yote-inline-select-value">{selected?.label}</span>
        <span className="yote-inline-select-chevron" data-open={open || undefined}>
          <ChevronDownIcon size={18} />
        </span>
      </button>

      {open && placement
        ? createPortal(
            <div
              ref={panelRef}
              className="yote-pop-panel"
              data-side={placement.side}
              style={placement.style}
              onKeyDown={onKeyDown}
            >
              <ul className="yote-pop-list" id={listId} role="listbox" ref={listRef}>
                {options.map((option, index) => (
                  <li
                    key={option.value}
                    id={`${id}-opt-${option.value}`}
                    role="option"
                    aria-selected={option.value === value}
                    className="yote-pop-item"
                    data-active={index === activeIndex || undefined}
                    data-selected={option.value === value || undefined}
                    onPointerDown={(event) => event.preventDefault()}
                    onClick={() => commit(index)}
                    onPointerEnter={() => setActiveIndex(index)}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
