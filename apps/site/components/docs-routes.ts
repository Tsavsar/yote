/**
 * The docs' running order, in one place.
 *
 * The sidebar and the prev/next pager both read it, so a page added to the
 * nav cannot fall out of the pager or land in a different order than the one
 * the sidebar shows.
 */
export interface DocsLink {
  href: string
  label: string
}

export const DOCS_GROUPS: { title: string; links: DocsLink[] }[] = [
  {
    title: 'Basics',
    links: [{ href: '/docs', label: 'Getting started' }],
  },
  {
    title: 'Components',
    links: [
      { href: '/docs/input', label: 'Text input' },
      { href: '/docs/digit-input', label: 'Digit input' },
      { href: '/docs/textarea', label: 'Text area' },
      { href: '/docs/password', label: 'Password' },
      { href: '/docs/phone', label: 'Phone number' },
      { href: '/docs/select', label: 'Select' },
      { href: '/docs/tags', label: 'Tags' },
      { href: '/docs/date', label: 'Date' },
      { href: '/docs/card', label: 'Card number' },
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

/** Flat, in reading order — what the pager walks. */
export const DOCS_ORDER: DocsLink[] = DOCS_GROUPS.flatMap((group) => group.links)
