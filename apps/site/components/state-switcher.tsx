'use client'

import * as React from 'react'

/**
 * One control pill.
 *
 * Not fully rounded. A stadium pill reads as a tag or a status chip — a thing
 * that reports something. These are controls you press, and an 8px corner
 * keeps them in the same family as the code panel and the install block.
 */
export function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      data-active={active || undefined}
      className="pill"
    >
      {children}
    </button>
  )
}

interface Box {
  x: number
  y: number
  w: number
  h: number
}

function same(a: Box | null, b: Box): boolean {
  return a !== null && a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h
}

/**
 * A row of pills with a selection that glides between them.
 *
 * One element that moves, not a background that appears on whichever pill is
 * active — the same treatment as the install tabs, and for the same reason:
 * a background that blinks from one place to another makes you re-find the
 * selection, while one that travels carries your eye to it.
 *
 * Measured from the real buttons rather than assumed, because these rows hold
 * labels of very different widths ("Read only" against "sm"). It tracks the
 * vertical offset too, so a row that wraps on a narrow screen still lands on
 * the right pill instead of sliding along a line it has left.
 */
export function PillGroup({ label, children }: { label: string; children: React.ReactNode }) {
  const rowRef = React.useRef<HTMLDivElement>(null)
  const [box, setBox] = React.useState<Box | null>(null)

  const measure = React.useCallback(() => {
    const row = rowRef.current
    if (!row) return
    const active = row.querySelector<HTMLElement>('.pill[data-active]')
    if (active === null) {
      setBox(null)
      return
    }
    const next: Box = {
      x: active.offsetLeft,
      y: active.offsetTop,
      w: active.offsetWidth,
      h: active.offsetHeight,
    }
    /* Returning the previous object makes React bail out. Without that, a new
       object every pass would re-render forever. */
    setBox((prev) => (same(prev, next) ? prev : next))
  }, [])

  /*
   * No dependency array: the active pill changes through children, which this
   * component cannot see. Measuring after every render is two layout reads and
   * a bail-out, which is cheaper than threading the value in.
   *
   * Layout effect, so the indicator is placed in the same commit it mounts in
   * and the first paint has it in position rather than flying in from zero.
   */
  React.useLayoutEffect(measure)

  React.useEffect(() => {
    const row = rowRef.current
    if (!row) return
    /* The fallback font's metrics are a few pixels off the real ones, so a
       pill measured before the webfont lands is measured wrong. */
    document.fonts?.ready.then(measure).catch(() => {})
    const observer = new ResizeObserver(measure)
    observer.observe(row)
    return () => observer.disconnect()
  }, [measure])

  return (
    <div className="control-row pill-group" role="group" aria-label={label} ref={rowRef}>
      {box !== null ? (
        <span
          className="pill-indicator"
          aria-hidden="true"
          style={{
            transform: `translate(${box.x}px, ${box.y}px)`,
            width: `${box.w}px`,
            height: `${box.h}px`,
          }}
        />
      ) : null}
      {children}
    </div>
  )
}
