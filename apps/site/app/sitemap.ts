import type { MetadataRoute } from 'next'
import { DOCS_ORDER } from '../components/docs-routes'
import { SITE_URL } from '../lib/site'

/**
 * Generated from the same table the sidebar, the pager and the search index
 * read, so a page cannot ship and be missing from it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: new URL('/', SITE_URL).href, lastModified: now, priority: 1 },
    ...DOCS_ORDER.map((link) => ({
      url: new URL(link.href, SITE_URL).href,
      lastModified: now,
      priority: link.href === '/docs' ? 0.8 : 0.6,
    })),
  ]
}
