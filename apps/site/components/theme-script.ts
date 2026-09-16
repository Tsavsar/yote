/**
 * No 'use client' here on purpose: the layout is a server component and needs
 * the literal string, and anything exported from a client module reaches it as
 * a reference rather than its value.
 */
export const THEME_KEY = 'yote-theme'

/**
 * Runs before the first paint, from the document head. Inline and blocking by
 * design — anything deferred paints the light page and then snaps, and a theme
 * flash is the one bug every visitor notices.
 *
 * The root ships with data-theme="light", so this only has work to do for the
 * one choice that is not the default.
 */
export const THEME_SCRIPT = `try{if(localStorage.getItem('${THEME_KEY}')==='dark')document.documentElement.setAttribute('data-theme','dark')}catch(e){}`
