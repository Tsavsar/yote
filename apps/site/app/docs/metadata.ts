import type { Metadata } from 'next'
import { DOCS_ORDER } from '../../components/docs-routes'

/**
 * Per-page metadata, from the table the sidebar and the pager already read.
 *
 * Every docs route shared one title before this, so thirteen pages showed up
 * in a tab strip, a search result and a link preview all called "Yöte Docs".
 * Generating it from the routes means a page cannot ship with the wrong one,
 * and cannot ship with none.
 */
export function docsMetadata(href: string): Metadata {
  const link = DOCS_ORDER.find((entry) => entry.href === href)
  const blurb = link?.blurb ?? ''

  return {
    title: link?.label,
    /* The blurbs are written to follow a component name, so they start
       lowercase. A description stands alone. */
    description: blurb === '' ? undefined : blurb.charAt(0).toUpperCase() + blurb.slice(1),
    alternates: { canonical: href },
  }
}
