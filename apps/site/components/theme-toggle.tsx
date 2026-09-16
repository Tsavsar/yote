'use client'

import * as React from 'react'
import { MoonIcon, SunIcon } from './icons'

/**
 * Sets `data-theme` on the root, which is one of the two selectors the token
 * layer answers to. With no attribute set the page follows the system, which
 * is the other one — so the initial state here is genuinely "system", not
 * "light pretending to be system".
 *
 * Both glyphs sit in one grid cell and cross-fade with a little blur, the same
 * treatment as the icon swap on shatermt.com. Blur bridges the gap between two
 * overlapping marks so the eye reads one changing rather than two trading
 * places.
 */
export function ThemeToggle() {
  const [theme, setTheme] = React.useState<'light' | 'dark' | null>(null)
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    const el = document.documentElement
    if (theme === null) el.removeAttribute('data-theme')
    else el.setAttribute('data-theme', theme)

    setIsDark(
      theme === null ? window.matchMedia('(prefers-color-scheme: dark)').matches : theme === 'dark',
    )
  }, [theme])

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="nav-icon-button"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <span className="icon-swap">
        <span className="icon-slot" data-shown={!isDark || undefined}>
          <SunIcon />
        </span>
        <span className="icon-slot" data-shown={isDark || undefined}>
          <MoonIcon />
        </span>
      </span>
    </button>
  )
}
