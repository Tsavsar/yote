'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DOCS_ORDER } from './docs-routes'

function Arrow({ back = false }: { back?: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      focusable="false"
      style={back ? { transform: 'rotate(180deg)' } : undefined}
    >
      <path
        d="M5.25 3.5L8.75 7L5.25 10.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Previous and next, at the foot of every docs page.
 *
 * Reading order, not alphabetical: the pages are written to be read in the
 * order the sidebar lists them, and the pager is what makes that order do
 * something. Both ends are always rendered as a row so the first and last
 * pages do not shift their footer to one side.
 */
export function DocsPager() {
  const pathname = usePathname()
  const index = DOCS_ORDER.findIndex((link) => link.href === pathname)
  if (index < 0) return null

  const prev = index > 0 ? DOCS_ORDER[index - 1] : undefined
  const next = index < DOCS_ORDER.length - 1 ? DOCS_ORDER[index + 1] : undefined

  return (
    <nav className="docs-pager" aria-label="Pagination">
      {prev !== undefined ? (
        <Link className="docs-pager-link" data-side="prev" href={prev.href}>
          <Arrow back />
          <span className="docs-pager-text">
            <span className="docs-pager-kicker">Previous</span>
            <span className="docs-pager-label">{prev.label}</span>
          </span>
        </Link>
      ) : (
        <span />
      )}

      {next !== undefined ? (
        <Link className="docs-pager-link" data-side="next" href={next.href}>
          <span className="docs-pager-text">
            <span className="docs-pager-kicker">Next</span>
            <span className="docs-pager-label">{next.label}</span>
          </span>
          <Arrow />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}
