'use client'

import * as React from 'react'

/**
 * Tooltip, Figma node 23:6479 — scaled down for this use.
 *
 * The frame is a 230px marketing card at 16px padding; hung off an 18px icon
 * button that would be larger than the control it explains, so the padding,
 * radius and measure all come in while the type scale, colour and the 24px
 * arrow stay as drawn.
 *
 * Opens on hover and on keyboard focus, because a tooltip only reachable by
 * pointer is not a tooltip for everyone. The arrow is the export's own
 * triangle, rotated to point down at the trigger.
 */
export function Tooltip({
  title,
  body,
  children,
}: {
  title: string
  body?: string
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  const id = React.useId()

  return (
    <span
      className="tooltip-root"
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={() => setOpen(false)}
    >
      <span aria-describedby={open ? id : undefined}>{children}</span>

      <span className="tooltip" id={id} role="tooltip" data-open={open || undefined}>
        <span className="tooltip-title">{title}</span>
        {body !== undefined ? <span className="tooltip-body">{body}</span> : null}
        <svg
          className="tooltip-arrow"
          width="18"
          height="16"
          viewBox="0 0 17.8624 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M7.19914 1C7.96894 -0.333334 9.89344 -0.333333 10.6632 1L17.5914 13C18.3612 14.3333 17.399 16 15.8594 16H2.00298C0.463383 16 -0.498868 14.3333 0.270933 13L7.19914 1Z"
            fill="currentColor"
          />
        </svg>
      </span>
    </span>
  )
}
