'use client'

import * as React from 'react'
import Link from 'next/link'
import { Tooltip } from './tooltip'

/** A labelled switch. One per boolean the component exposes. */
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
    <label className="toggle">
      <input
        type="checkbox"
        className="toggle-input"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="toggle-track" aria-hidden="true">
        <span className="toggle-thumb" />
      </span>
      <span className="toggle-label">{label}</span>
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

/**
 * The overflow menu that sits beside a component's name.
 *
 * Two entries: the parameter panel, and the component's own docs page. It is
 * a menu rather than a bare toggle because "more parameters" was never going
 * to be the only thing anyone wants from a preview.
 *
 * Closes on outside pointerdown and on Escape — a popover that only closes by
 * clicking its own trigger is a trap the moment you open a second one.
 */
export function MoreMenu({
  paramsOpen,
  onToggleParams,
  docsHref,
}: {
  paramsOpen: boolean
  onToggleParams: () => void
  docsHref: string
}) {
  const [open, setOpen] = React.useState(false)
  const rootRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="more-menu" ref={rootRef}>
      <Tooltip title="More parameters" body="Toggle each part of the field, or open its docs.">
        <button
          type="button"
          className="more-trigger"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-haspopup="menu"
        >
          <DotsIcon />
          <span className="sr-only">More options</span>
        </button>
      </Tooltip>

      <div className="menu" role="menu" data-open={open || undefined}>
        <button
          type="button"
          role="menuitemcheckbox"
          aria-checked={paramsOpen}
          className="menu-item"
          onClick={() => {
            onToggleParams()
            setOpen(false)
          }}
        >
          More parameters
        </button>
        <Link href={docsHref} role="menuitem" className="menu-item">
          View in docs
        </Link>
      </div>
    </div>
  )
}

/**
 * The parameter panel.
 *
 * Collapsing animates `grid-template-rows` from 0fr to 1fr rather than a
 * measured pixel height: the content stays in normal flow, so the panel is
 * always exactly as tall as what is inside it and nothing needs re-measuring
 * on resize.
 */
export function MorePanel({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    // No `hidden` — it would remove the box and there would be nothing to
    // animate. The stylesheet takes it out of the tab order with `visibility`
    // instead, which is animatable.
    <div className="more-panel" data-open={open || undefined}>
      <div className="more-panel-inner">{children}</div>
    </div>
  )
}
