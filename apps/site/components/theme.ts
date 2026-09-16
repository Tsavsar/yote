'use client'

import * as React from 'react'
import { THEME_KEY } from './theme-script'

export type Theme = 'light' | 'dark'

/**
 * Theme state, shared by the toggle in the landing nav and the one at the
 * foot of the docs sidebar.
 *
 * A module store rather than context: the two live in different layouts and
 * nothing between them should have to know about theming to pass a provider
 * through.
 *
 * **Light is the default, not the system preference.** Someone arriving with
 * a dark machine and no opinion about this site sees it the way it was
 * designed, and the toggle is how they say otherwise.
 */
const listeners = new Set<() => void>()
let current: Theme = 'light'
let read = false

/** Pulled once, lazily, so this module never touches storage on the server. */
function hydrate() {
  if (read) return
  read = true
  try {
    if (localStorage.getItem(THEME_KEY) === 'dark') current = 'dark'
  } catch {
    /* Private mode, blocked storage. The default stands. */
  }
}

function subscribe(onChange: () => void) {
  hydrate()
  listeners.add(onChange)
  return () => {
    listeners.delete(onChange)
  }
}

export function setTheme(next: Theme) {
  current = next
  read = true

  try {
    localStorage.setItem(THEME_KEY, next)
  } catch {
    /* The theme still applies for this visit. */
  }

  document.documentElement.setAttribute('data-theme', next)
  for (const fn of listeners) fn()
}

export function useTheme(): Theme {
  return React.useSyncExternalStore(
    subscribe,
    () => {
      hydrate()
      return current
    },
    () => 'light',
  )
}

export function useIsDark(): boolean {
  return useTheme() === 'dark'
}
