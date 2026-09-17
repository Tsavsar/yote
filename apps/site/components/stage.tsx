'use client'

import * as React from 'react'
import { MoonIcon, SunIcon } from './icons'
import { useTheme, type Theme } from './theme'

/**
 * The preview stage, and its own theme control.
 *
 * The control in the corner flips **this stage only**. Everything a component
 * paints with comes from tokens, and the token blocks are scoped to
 * `[data-theme]` rather than to `:root`, so writing the attribute on this box
 * repaints what is inside it and nothing else. That is the honest way to show
 * a component's dark mode: the thing next to it stays light, so you can see
 * both at once instead of taking the page with you and comparing from memory.
 *
 * A local flip is an override, and flipping the page clears it — otherwise a
 * stage you dimmed an hour ago sits inverted forever and reads as a bug.
 */
export function Stage({
  className,
  inner = true,
  children,
}: {
  className?: string
  /** False for a component that centres itself, like the pin input. */
  inner?: boolean
  children: React.ReactNode
}) {
  const page = useTheme()
  const [override, setOverride] = React.useState<Theme | null>(null)

  React.useEffect(() => {
    setOverride(null)
  }, [page])

  const theme = override ?? page
  const isDark = theme === 'dark'

  return (
    <div className={className === undefined ? 'stage' : `stage ${className}`} data-theme={theme}>
      {inner ? <div className="stage-inner">{children}</div> : children}

      <button
        type="button"
        className="stage-theme"
        onClick={() => setOverride(isDark ? 'light' : 'dark')}
        aria-label={
          isDark ? 'Show this preview in the light theme' : 'Show this preview in the dark theme'
        }
        title={isDark ? 'Light' : 'Dark'}
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
    </div>
  )
}
