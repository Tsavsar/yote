/**
 * Where the site lives.
 *
 * `metadataBase` needs an absolute origin to resolve OG image URLs against,
 * the sitemap needs it to write absolute links, and a preview deploy needs to
 * describe itself rather than the production domain — so Vercel's own URL
 * wins when it is set, and the real one is the fallback.
 */
export const SITE_URL = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_ENV === 'production'
      ? 'https://yote.shatermt.com'
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'https://yote.shatermt.com'),
)

export const SITE_NAME = 'Yöte'
export const SITE_TAGLINE = 'Input components for React.'
export const SITE_DESCRIPTION =
  'A small set of form inputs for React. Styled and animated out of the box, with one prop vocabulary shared by every field. Zero dependencies.'
