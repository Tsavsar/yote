'use client'

import * as React from 'react'
import Link from 'next/link'
import { Tooltip } from './tooltip'

/**
 * The switch, Figma node 26:8643.
 *
 * A 36x20 track with a 16px thumb that carries a 6px dot of its own — the dot
 * is what makes it read as a physical switch rather than a coloured pill, so
 * it is not an ornament to drop.
 */
export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (next: boolean) => void
}) {
  return (
    <label className="switch-row">
      <span className="switch-label">{label}</span>
      <input
        type="checkbox"
        className="switch-input"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="switch-track" aria-hidden="true">
        <span className="switch-thumb">
          <span className="switch-dot" />
        </span>
      </span>
    </label>
  )
}

function DotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <circle cx="3" cy="8" r="1.4" />
      <circle cx="8" cy="8" r="1.4" />
      <circle cx="13" cy="8" r="1.4" />
    </svg>
  )
}

/** The chevron that marks "More parameters" as opening a submenu. */
function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M6 3.5L10.5 8L6 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * The overflow menu beside a component's name, and the parameters submenu it
 * opens — Figma node 26:8703.
 *
 * Two panels, not one expanding row: the menu lists what you can do, and
 * "More parameters" opens the switches beside it. That keeps the menu short
 * however many booleans a component grows.
 *
 * Closes on outside pointerdown and on Escape — a popover that only closes by
 * clicking its own trigger is a trap the moment you open a second one.
 */
export function MoreMenu({
  docsHref,
  children,
}: {
  docsHref: string
  /** The switches. Rendered into the submenu panel. */
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  const [paramsOpen, setParamsOpen] = React.useState(false)
  const [placement, setPlacement] = React.useState<'right' | 'bottom'>('right')
  const rootRef = React.useRef<HTMLDivElement>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const paramsRef = React.useRef<HTMLDivElement>(null)

  /*
   * Right by default, bottom when it will not fit — never left, which would
   * put the switches over the menu that opened them.
   *
   * Measured in a layout effect so the decision is made before paint; the
   * submenu is laid out at its natural size either way, so reading its width
   * here costs one forced reflow on open and nothing afterwards.
   */
  React.useLayoutEffect(() => {
    if (!paramsOpen) return
    const menu = menuRef.current
    const params = paramsRef.current
    if (!menu || !params) return

    const measure = () => {
      const rect = menu.getBoundingClientRect()
      const needed = params.offsetWidth + 10
      setPlacement(rect.right + needed <= window.innerWidth - 8 ? 'right' : 'bottom')
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [paramsOpen])

  const close = React.useCallback(() => {
    setOpen(false)
    setParamsOpen(false)
  }, [])

  React.useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, close])

  return (
    <div className="more-menu" ref={rootRef}>
      <Tooltip title="More parameters" body="Toggle each part of the field, or open its docs.">
        <button
          type="button"
          className="more-trigger"
          onClick={() => (open ? close() : setOpen(true))}
          aria-expanded={open}
          aria-haspopup="menu"
        >
          <DotsIcon />
          <span className="sr-only">More options</span>
        </button>
      </Tooltip>

      <div className="menu-wrap" data-open={open || undefined}>
        <div className="menu" role="menu" ref={menuRef}>
          <button
            type="button"
            role="menuitem"
            className="menu-item menu-item-expand"
            onClick={() => setParamsOpen((o) => !o)}
            aria-expanded={paramsOpen}
          >
            <span>More parameters</span>
            <span className="menu-chevron" data-open={paramsOpen || undefined}>
              <ChevronRight />
            </span>
          </button>
          <Link href={docsHref} role="menuitem" className="menu-item" onClick={close}>
            View docs
          </Link>
        </div>

        <div
          className="menu menu-params"
          ref={paramsRef}
          data-open={paramsOpen || undefined}
          data-placement={placement}
          role="group"
        >
          {children}
        </div>
      </div>
    </div>
  )
}
