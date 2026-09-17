import * as React from 'react'
import { createPortal } from 'react-dom'
import type { YoteFieldProps } from './types'
import { useComposedRef } from './lib/use-composed-ref'
import { AlertIcon, ChevronDownIcon, InfoIcon, SearchIcon } from './icons'
import { BUILT_IN_FLAGS } from './flags'

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
 * The eight in the default list draw a real SVG flag. Anything else falls
 * back to the regional-indicator emoji, which is free and needs no assets but
 * is missing entirely on Windows — it renders the two letters. So `flag`
 * takes any node: an <img>, an icon component, a `<span class="fi fi-gb" />`
 * from flag-icons. Supply it and neither fallback is used.
 */
export interface PhoneCountry {
  /** ISO 3166-1 alpha-2, used as the value and the emoji fallback. */
  code: string
  /** Dial code including the plus, e.g. "+1". */
  dial: string
  name: string
  /** Overrides the emoji. Anything renderable. */
  flag?: React.ReactNode
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

/** The country's own mark, else a drawn flag, else the emoji. */
function markOf(c: PhoneCountry): React.ReactNode {
  return c.flag ?? BUILT_IN_FLAGS[c.code.toUpperCase()] ?? emojiOf(c.code)
}

/** ISO code to its regional-indicator emoji. 'US' -> 🇺🇸 */
function emojiOf(code: string): string {
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

/** Panel geometry. Fixed coordinates, so it is measured against the viewport. */
interface Placement {
  style: React.CSSProperties
  side: 'top' | 'bottom'
}

/** The gap between the field and the panel, and the least room left to the
 *  viewport edge. */
const PANEL_GAP = 6
const VIEWPORT_MARGIN = 12
const PANEL_MAX = 320
const PANEL_MIN = 180

/**
 * Where the panel goes, measured fresh every time it opens, scrolls or the
 * window resizes.
 *
 * It is anchored to the *field*, not to the country button inside it: left
 * edge to left edge, the field's own width, sitting just under it. A popover
 * that is narrower than its control and offset from it reads as a floating
 * object that happens to be nearby; matching the box makes it an extension of
 * the field, which is what it is.
 *
 * Below unless below cannot hold it and above can — the same rule the
 * parameters submenu follows, and for the same reason: a popover that jumps
 * to a surprising edge is worse than one that is a little short.
 */
function placeFor(anchor: HTMLElement): Placement {
  const rect = anchor.getBoundingClientRect()
  const vw = document.documentElement.clientWidth
  const vh = document.documentElement.clientHeight

  const below = vh - rect.bottom - PANEL_GAP - VIEWPORT_MARGIN
  const above = rect.top - PANEL_GAP - VIEWPORT_MARGIN
  const side: Placement['side'] = below >= PANEL_MIN || below >= above ? 'bottom' : 'top'

  const room = Math.max(PANEL_MIN, Math.min(PANEL_MAX, side === 'bottom' ? below : above))
  const width = Math.min(rect.width, vw - VIEWPORT_MARGIN * 2)
  const left = Math.max(VIEWPORT_MARGIN, Math.min(rect.left, vw - VIEWPORT_MARGIN - width))

  return {
    side,
    style:
      side === 'bottom'
        ? { top: rect.bottom + PANEL_GAP, left, width, maxHeight: room }
        : { bottom: vh - rect.top + PANEL_GAP, left, width, maxHeight: room },
  }
}

/**
 * The country dropdown, Figma node 29:10460.
 *
 * This replaces a native <select>. The native one was better on a phone and
 * free to make accessible, but it cannot render a search field, a flag, and a
 * two-column row — which is what the design is. So the keyboard and screen
 * reader behaviour a select gave for nothing is rebuilt here explicitly:
 * combobox semantics, arrow keys with wrap, Home and End, Enter and Escape,
 * and the active option tracked with aria-activedescendant rather than by
 * moving focus, so the search field keeps it and typing never breaks.
 */
function CountrySelect({
  id,
  countries,
  selected,
  onSelect,
  disabled,
  classNames,
  anchorRef,
}: {
  id: string
  countries: PhoneCountry[]
  selected: PhoneCountry
  onSelect: (code: string) => void
  disabled: boolean
  classNames: PhoneInputProps['classNames']
  /** The field box the panel lines up with. */
  anchorRef: React.RefObject<HTMLDivElement | null>
}) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [activeIndex, setActiveIndex] = React.useState(0)

  const rootRef = React.useRef<HTMLDivElement>(null)
  const panelRef = React.useRef<HTMLDivElement>(null)
  const searchRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLUListElement>(null)
  const [placement, setPlacement] = React.useState<Placement | null>(null)

  const matches = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q === '') return countries
    return countries.filter(
      (c) => c.name.toLowerCase().includes(q) || c.dial.includes(q) || c.code.toLowerCase() === q,
    )
  }, [countries, query])

  const close = React.useCallback(() => {
    setOpen(false)
    setQuery('')
  }, [])

  React.useEffect(() => {
    if (!open) return
    searchRef.current?.focus()
    const idx = countries.findIndex((c) => c.code === selected.code)
    setActiveIndex(idx < 0 ? 0 : idx)

    /* The panel is portalled, so it is not inside rootRef — both count. */
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (!rootRef.current?.contains(target) && !panelRef.current?.contains(target)) close()
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open, countries, selected.code, close])

  /*
   * The panel renders into the body rather than beside the trigger.
   *
   * A dropdown that lives inside the field is at the mercy of every ancestor:
   * one `overflow: hidden` on a card, a stage or a modal and it is sliced in
   * half or gone entirely. Consumers do not control that and should not have
   * to think about it, so the panel leaves the tree and positions itself
   * against the viewport.
   *
   * Layout effect, not effect: it must be placed before the browser paints,
   * or the first frame of the entrance animation is at the wrong coordinates.
   */
  React.useLayoutEffect(() => {
    if (!open) {
      setPlacement(null)
      return
    }
    const anchor = anchorRef.current ?? rootRef.current
    if (!anchor) return

    const reposition = () => setPlacement(placeFor(anchor))
    reposition()

    /* Capture, so a scroll in any ancestor moves it, not just the window. */
    window.addEventListener('scroll', reposition, true)
    window.addEventListener('resize', reposition)
    return () => {
      window.removeEventListener('scroll', reposition, true)
      window.removeEventListener('resize', reposition)
    }
  }, [open, anchorRef])

  // Keep the active row in view when the arrows move past the fold.
  React.useEffect(() => {
    if (!open) return
    listRef.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' })
  }, [open, activeIndex])

  const commit = (c: PhoneCountry | undefined) => {
    if (!c) return
    onSelect(c.code)
    close()
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!open) {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        setOpen(true)
      }
      return
    }
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setActiveIndex((i) => (matches.length === 0 ? 0 : (i + 1) % matches.length))
        break
      case 'ArrowUp':
        event.preventDefault()
        setActiveIndex((i) =>
          matches.length === 0 ? 0 : (i - 1 + matches.length) % matches.length,
        )
        break
      case 'Home':
        event.preventDefault()
        setActiveIndex(0)
        break
      case 'End':
        event.preventDefault()
        setActiveIndex(Math.max(0, matches.length - 1))
        break
      case 'Enter':
        event.preventDefault()
        commit(matches[activeIndex])
        break
      case 'Escape':
        event.preventDefault()
        close()
        break
    }
  }

  const listId = `${id}-list`

  return (
    <div className="yote-pop" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        type="button"
        id={id}
        className={cx('yote-phone-country', classNames?.country)}
        onClick={() => (open ? close() : setOpen(true))}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Dialling country, ${selected.name} ${selected.dial}`}
      >
        <span className={cx('yote-phone-flag', classNames?.flag)} aria-hidden="true">
          {markOf(selected)}
        </span>
        <span className={cx('yote-phone-dial', classNames?.dialCode)}>{selected.dial}</span>
        <ChevronDownIcon />
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
              <div className="yote-pop-search">
                <input
                  ref={searchRef}
                  className="yote-pop-search-input"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setActiveIndex(0)
                  }}
                  placeholder="Search country or code..."
                  role="combobox"
                  aria-expanded="true"
                  aria-controls={listId}
                  aria-autocomplete="list"
                  aria-activedescendant={
                    matches[activeIndex] ? `${id}-opt-${matches[activeIndex].code}` : undefined
                  }
                  aria-label="Search country or code"
                />
                <SearchIcon />
              </div>

              <ul className="yote-pop-list" id={listId} role="listbox" ref={listRef}>
                {matches.map((c, i) => (
                  <li
                    key={c.code}
                    id={`${id}-opt-${c.code}`}
                    role="option"
                    aria-selected={c.code === selected.code}
                    className="yote-pop-item"
                    data-active={i === activeIndex || undefined}
                    data-selected={c.code === selected.code || undefined}
                    onPointerDown={(e) => e.preventDefault()}
                    onClick={() => commit(c)}
                    onPointerEnter={() => setActiveIndex(i)}
                  >
                    <span className="yote-country-flag" aria-hidden="true">
                      {markOf(c)}
                    </span>
                    <span className="yote-country-dial">{c.dial}</span>
                    <span className="yote-country-name">{c.name}</span>
                  </li>
                ))}
                {matches.length === 0 ? <li className="yote-pop-empty">No match</li> : null}
              </ul>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
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
  const fieldRef = React.useRef<HTMLDivElement>(null)

  const isControlled = valueProp !== undefined
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? '')
  const value = isControlled ? valueProp : uncontrolled

  const countryControlled = countryProp !== undefined
  const [ownCountry, setOwnCountry] = React.useState(defaultCountry)
  const countryCode = countryControlled ? countryProp : ownCountry
  const selected = countries.find((c) => c.code === countryCode) ?? countries[0] ?? FALLBACK_COUNTRY

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

  const handleCountry = (next: string) => {
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
        ref={fieldRef}
        className={cx('yote-phone-field', classNames?.field)}
        data-focused={focused || undefined}
        data-invalid={isInvalid || undefined}
        data-disabled={disabled || undefined}
      >
        <CountrySelect
          id={countryId}
          countries={countries}
          selected={selected}
          onSelect={handleCountry}
          disabled={disabled || readOnly}
          classNames={classNames}
          anchorRef={fieldRef}
        />

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
