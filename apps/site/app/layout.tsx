import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from '../lib/site'
import { IBM_Plex_Mono } from 'next/font/google'
// globals.css first, and the order is not cosmetic. It opens with the
// `@layer` statement that fixes the cascade order, and a layer's position is
// set the first time its name appears. Import yote-ui/styles.css above this
// and `@layer yote` registers as layer one before the statement is ever read,
// so the statement silently does nothing and Tailwind's preflight wins.
import './globals.css'
import 'yote-ui/styles.css'
import { THEME_SCRIPT } from '../components/theme-script'

/**
 * The one webfont on the site, for code only — the design specifies IBM Plex
 * Mono and a system mono stack reads visibly differently at 14px. Body type
 * stays on the system stack, matching shatermt.com.
 *
 * next/font self-hosts it and emits the face with `font-display: swap`, so
 * there is no render-blocking request to Google and no layout shift class to
 * manage by hand.
 */
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  /*
   * `default` is what the landing page gets; `template` wraps every page that
   * sets its own. A middle dot rather than a dash, and the name second, so a
   * tab strip of open docs pages reads as the page you are on.
   */
  title: {
    /* Not lowercased: it swallowed the capital in React. */
    default: `${SITE_NAME}, ${SITE_TAGLINE.replace(/\.$/, '')}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    url: '/',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: { card: 'summary_large_image', creator: '@tsavsar_' },
  /* The site is light by default and says so, rather than letting a browser
     guess a dark form control onto a light page. */
  other: { 'color-scheme': 'light dark' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  /*
   * Light is the default, written into the markup rather than left to the
   * system preference. Someone arriving with a dark machine and no opinion
   * about this site should see it the way it was designed, and the toggle is
   * how they say otherwise.
   *
   * The script then corrects the attribute for a returning visitor before the
   * first paint. It is inline and blocking for that reason.
   */
  return (
    <html
      lang="en"
      className={plexMono.variable}
      data-theme="light"
      /* The script below rewrites this attribute before React sees it, which
         is the whole point of it running first — so the mismatch it causes on
         hydration is expected rather than a bug to chase. */
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        {children}
        {/*
         * Vercel's own analytics: a page-view beacon, no cookies and no
         * cross-site identifier, so there is nothing here that needs a
         * consent banner in front of it. It is inert outside a Vercel
         * deployment, so local development sends nothing.
         */}
        <Analytics />
      </body>
    </html>
  )
}
