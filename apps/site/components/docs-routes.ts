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
  /** One line, for the list on the getting-started page. */
  blurb?: string
}

export const DOCS_GROUPS: { title: string; links: DocsLink[] }[] = [
  {
    title: 'Basics',
    links: [
      {
        href: '/docs',
        label: 'Getting started',
        blurb: 'install it, import the stylesheet, render a field. Nothing else to wire up.',
      },
    ],
  },
  {
    title: 'Components',
    links: [
      {
        href: '/docs/input',
        label: 'Text input',
        blurb: 'one line, with room at either end for a mark or a text affix.',
      },
      {
        href: '/docs/digit-input',
        label: 'Digit input',
        blurb: 'one-time codes and PINs. Paste, autofill and the SMS suggestion all work.',
      },
      {
        href: '/docs/textarea',
        label: 'Text area',
        blurb: 'multi-line entry with a counter, a drag handle and three sizes.',
      },
      {
        href: '/docs/password',
        label: 'Password',
        blurb: 'masked entry with a reveal toggle and a requirements block you define.',
      },
      {
        href: '/docs/phone',
        label: 'Phone number',
        blurb: 'a dialling country and a national number, kept as two values.',
      },
      {
        href: '/docs/select',
        label: 'Select',
        blurb: 'a field that is its own search, and a small one that sits inside another field.',
      },
      {
        href: '/docs/tags',
        label: 'Tags',
        blurb: 'a list you build by typing, under the field or inside it.',
      },
      {
        href: '/docs/date',
        label: 'Date',
        blurb: 'typed, not picked. The field types the punctuation for you.',
      },
      {
        href: '/docs/card',
        label: 'Card number',
        blurb: 'regroups itself as it recognises the card, and the mark changes with it.',
      },
    ],
  },
  {
    title: 'Guides',
    links: [
      {
        href: '/docs/styling',
        label: 'Styling',
        blurb: 'cascade layers, the Tailwind order that matters, tokens and per-part class names.',
      },
      {
        href: '/docs/accessibility',
        label: 'Accessibility',
        blurb: 'what every field does without being asked. None of it is opt-in.',
      },
    ],
  },
]

/** The components, for the list on the getting-started page. */
export const DOCS_COMPONENTS: DocsLink[] =
  DOCS_GROUPS.find((group) => group.title === 'Components')?.links ?? []

/** Flat, in reading order — what the pager walks. */
export const DOCS_ORDER: DocsLink[] = DOCS_GROUPS.flatMap((group) => group.links)
