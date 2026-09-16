'use client'

import { MoonIcon, SunIcon } from './icons'
import { setTheme, useIsDark } from './theme'

/**
 * The compact flip in the landing nav. The docs get the full three-way
 * switcher; here there is one control's worth of room, so this flips between
 * light and dark and writes to the same store — a visitor who picked "system"
 * in the docs sees it resolved, and one press pins whichever is not showing.
 *
 * Both glyphs sit in one grid cell and cross-fade with a little blur, the
 * same treatment as the icon swap on shatermt.com. Blur bridges the gap
 * between two overlapping marks so the eye reads one changing rather than two
 * trading places.
 */
export function ThemeToggle() {
  const isDark = useIsDark()

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
