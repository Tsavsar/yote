'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DOCS_GROUPS } from './docs-routes'
import { Logo } from './logo'
import { Search } from './search'
import { Version } from './version'
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

  /*
   * Below 720px the rail becomes a bar and the link list collapses behind
   * this. Twelve links and three group headings is most of a phone screen
   * standing between you and the page you came to read.
   *
   * State rather than <details>, because CSS cannot reliably reveal a closed
   * <details> and the list has to be open on desktop regardless of what a
   * phone-sized visit left it at.
   */
  const [menuOpen, setMenuOpen] = React.useState(false)
  React.useEffect(() => setMenuOpen(false), [pathname])

  return (
    <nav className="docs-sidebar" aria-label="Documentation">
      <div className="wordmark-row docs-wordmark">
        <Link className="wordmark" href="/" aria-label="Yöte, home">
          <Logo className="wordmark-mark" />
          <span>Yöte</span>
        </Link>
        <Version />
      </div>

      <div className="docs-bar">
        <Search />
        <button
          type="button"
          className="docs-menu-toggle"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((was) => !was)}
        >
          {menuOpen ? 'Close' : 'Browse'}
        </button>
      </div>

      <div className="docs-groups" data-open={menuOpen || undefined}>
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
