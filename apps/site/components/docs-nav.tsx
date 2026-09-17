'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DOCS_GROUPS } from './docs-routes'
import { Logo } from './logo'
import { ThemeToggle } from './theme-toggle'

/**
 * The docs sidebar.
 *
 * Grouped rather than flat, after Sonner: Basics / Components / Guides. A flat
 * list stops being scannable the moment a second component lands, and the
 * whole point of this library is that more are coming.
 *
 * The order itself lives in docs-routes, shared with the pager at the foot of
 * each page, so the two can never disagree about what comes next.
 */
export function DocsNav({ github }: { github: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <nav className="docs-sidebar" aria-label="Documentation">
      <Link className="wordmark docs-wordmark" href="/" aria-label="Yöte, home">
        <Logo className="wordmark-mark" />
        <span>Yöte</span>
      </Link>

      <div className="docs-groups">
        {DOCS_GROUPS.map((group) => (
          <div key={group.title} className="docs-group">
            <span className="docs-group-title">{group.title}</span>
            {group.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="docs-link"
                data-active={pathname === link.href || undefined}
                aria-current={pathname === link.href ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="docs-sidebar-foot">
        {github}
        <ThemeToggle />
      </div>
    </nav>
  )
}
