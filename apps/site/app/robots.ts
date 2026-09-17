import type { MetadataRoute } from 'next'
import { SITE_URL } from '../lib/site'

export default function robots(): MetadataRoute.Robots {
  /* Preview deploys describe themselves, so a staging URL cannot end up in an
     index competing with the real one. */
  const isProduction = SITE_URL.hostname === 'yote.shatermt.com'

  return {
    rules: isProduction ? { userAgent: '*', allow: '/' } : { userAgent: '*', disallow: '/' },
    sitemap: isProduction ? new URL('/sitemap.xml', SITE_URL).href : undefined,
  }
}
