'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from './logo'
import { ThemeToggle } from './theme-toggle'

/**
 * The docs sidebar.
 *
 * Grouped rather than flat, after Sonner: Basics / Components / Guides. A flat
 * list stops being scannable the moment a second component lands, and the
 * whole point of this library is that more are coming.
 */
const GROUPS = [
  {
    title: 'Basics',
    links: [{ href: '/docs', label: 'Getting started' }],
  },
  {
    title: 'Components',
    links: [
      { href: '/docs/digit-input', label: 'Digit input' },
      { href: '/docs/textarea', label: 'Text area' },
      { href: '/docs/password', label: 'Password' },
      { href: '/docs/phone', label: 'Phone number' },
    ],
  },
  {
    title: 'Guides',
    links: [
      { href: '/docs/styling', label: 'Styling' },
      { href: '/docs/accessibility', label: 'Accessibility' },
    ],
  },
]

/**
 * `github` arrives as a prop rather than an import.
 *
 * This file is a client component — it reads the pathname to mark the active
 * link — and GithubLink is an async server component that fetches the star
 * count. Rendering one inside the other made React treat it as an async
 * *client* component, which is not a thing: it threw on every docs page and
 * suspended on an uncached promise. Passing it down as an already-rendered
 * element keeps it on the server where it belongs.
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
        {GROUPS.map((group) => (
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
