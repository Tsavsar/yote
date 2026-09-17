import Link from 'next/link'
import { SiteNav } from '../components/site-nav'
import { DOCS_COMPONENTS } from '../components/docs-routes'

export const metadata = { title: 'Not found' }

/**
 * The 404.
 *
 * Next's default is an unstyled line of text on a white page, which reads as
 * the site being broken rather than the address being wrong. This one keeps
 * the site's own chrome and, more usefully, offers the way out: ⌘K is mounted
 * by the nav on every page including this one, and the components are listed
 * because a mistyped URL here is almost always a component page.
 */
export default function NotFound() {
  return (
    <>
      <SiteNav />

      <main className="page">
        <section className="hero">
          <h1 className="headline">That page is not here.</h1>
          <p className="lede">
            The address does not match anything on the site. Press <kbd className="kbd">⌘K</kbd> to
            search, or pick up from one of these.
          </p>
        </section>

        <ul className="bullets">
          <li>
            <Link className="docs-inline-link" href="/docs">
              Getting started
            </Link>
          </li>
          {DOCS_COMPONENTS.map((component) => (
            <li key={component.href}>
              <Link className="docs-inline-link" href={component.href}>
                {component.label}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}
