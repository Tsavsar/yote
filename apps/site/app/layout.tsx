import type { Metadata } from 'next'
import { IBM_Plex_Mono } from 'next/font/google'
// globals.css first, and the order is not cosmetic. It opens with the
// `@layer` statement that fixes the cascade order, and a layer's position is
// set the first time its name appears. Import yote-ui/styles.css above this
// and `@layer yote` registers as layer one before the statement is ever read,
// so the statement silently does nothing and Tailwind's preflight wins.
import './globals.css'
import 'yote-ui/styles.css'

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
  title: 'Yöte',
  description: 'Input components for React.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={plexMono.variable}>
      <body>{children}</body>
    </html>
  )
}
