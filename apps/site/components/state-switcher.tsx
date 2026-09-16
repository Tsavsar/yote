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
