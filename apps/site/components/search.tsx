'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { SearchIcon } from 'yote-ui'
import { SEARCH_INDEX, type SearchEntry } from './search-index'

const MAX_RESULTS = 8

/**
 * Scores an entry against a query.
 *
 * Every word has to appear somewhere, so "tag inside" finds the placement
 * section and "tag select" finds nothing — an AND is what people mean when
 * they add a second word. Where it matched decides the rank: a title beats a
 * section, a section beats body text, and a prefix beats a match in the
 * middle, because someone typing "pho" wants Phone number, not the sentence
 * that happens to contain "telephone".
 */
function score(entry: SearchEntry, words: string[]): number {
  const title = entry.title.toLowerCase()
  const section = (entry.section ?? '').toLowerCase()
  const text = entry.text.toLowerCase()

  let total = 0
  for (const word of words) {
    if (title.startsWith(word)) total += 100
    else if (title.includes(word)) total += 60
    else if (section.startsWith(word)) total += 50
    else if (section.includes(word)) total += 30
    else if (text.includes(word)) total += 10
    else return 0
  }
  /* A page beats one of its own sections when both match equally. */
  return entry.section === null ? total + 5 : total
}

function useResults(query: string): SearchEntry[] {
  return React.useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean)
    if (words.length === 0) {
      return SEARCH_INDEX.filter((entry) => entry.section === null).slice(0, MAX_RESULTS)
    }
    return SEARCH_INDEX.map((entry) => ({ entry, rank: score(entry, words) }))
      .filter((hit) => hit.rank > 0)
      .sort((a, b) => b.rank - a.rank)
      .slice(0, MAX_RESULTS)
      .map((hit) => hit.entry)
  }, [query])
}

/**
 * The search palette.
 *
 * Opened with ⌘K anywhere, or by the button in the nav — the shortcut is the
 * one people reach for and the button is how they learn it exists, which is
 * why the button wears the shortcut on its face.
 *
 * No open or close animation. This is a thing you hit dozens of times an
 * hour; anything that has to play first makes the whole site feel slower, and
 * Raycast is right about that.
 */
export function Search() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [active, setActive] = React.useState(0)

  const inputRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLUListElement>(null)
  const results = useResults(query)

  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((was) => !was)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  React.useEffect(() => {
    if (!open) {
      setQuery('')
      setActive(0)
      return
    }
    inputRef.current?.focus()
    /* The page behind must not scroll while a dialog is over it. */
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  React.useEffect(() => {
    if (!open) return
    listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  const go = (entry: SearchEntry | undefined) => {
    if (!entry) return
    setOpen(false)
    router.push(entry.href)
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setActive((i) => (results.length === 0 ? 0 : (i + 1) % results.length))
        break
      case 'ArrowUp':
        event.preventDefault()
        setActive((i) => (results.length === 0 ? 0 : (i - 1 + results.length) % results.length))
        break
      case 'Home':
        event.preventDefault()
        setActive(0)
        break
      case 'End':
        event.preventDefault()
        setActive(Math.max(0, results.length - 1))
        break
      case 'Enter':
        event.preventDefault()
        go(results[active])
        break
      case 'Escape':
        event.preventDefault()
        setOpen(false)
        break
    }
  }

  return (
    <>
      <button type="button" className="search-trigger" onClick={() => setOpen(true)}>
        <SearchIcon size={15} />
        <span className="search-trigger-label">Search</span>
        <kbd className="search-trigger-kbd" aria-hidden="true">
          ⌘K
        </kbd>
      </button>

      {/*
       * Portalled to the body. The trigger lives in the docs sidebar, which is
       * `position: sticky` and therefore a stacking context of its own, so a
       * fixed overlay inside it still paints under anything later on the page
       * that has a z-index. Here that meant the control pills sat on top of
       * the dialog.
       */}
      {open
        ? createPortal(
            <div
              className="search-overlay"
              role="presentation"
              onPointerDown={(event) => {
                if (event.target === event.currentTarget) setOpen(false)
              }}
            >
              <div
                className="search-panel"
                role="dialog"
                aria-modal="true"
                aria-label="Search the documentation"
                onKeyDown={onKeyDown}
              >
                <div className="search-field">
                  <SearchIcon size={18} />
                  <input
                    ref={inputRef}
                    className="search-input"
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value)
                      setActive(0)
                    }}
                    placeholder="Search the docs"
                    role="combobox"
                    aria-expanded="true"
                    aria-controls="search-results"
                    aria-autocomplete="list"
                    aria-activedescendant={results[active] ? `search-${active}` : undefined}
                  />
                  <kbd className="search-trigger-kbd">Esc</kbd>
                </div>

                <ul className="search-results" id="search-results" role="listbox" ref={listRef}>
                  {results.map((entry, index) => (
                    <li
                      key={entry.href}
                      id={`search-${index}`}
                      role="option"
                      aria-selected={index === active}
                      className="search-result"
                      data-active={index === active || undefined}
                      onPointerDown={(event) => event.preventDefault()}
                      onPointerEnter={() => setActive(index)}
                      onClick={() => go(entry)}
                    >
                      <span className="search-result-title">{entry.section ?? entry.title}</span>
                      {entry.section !== null ? (
                        <span className="search-result-page">{entry.title}</span>
                      ) : null}
                    </li>
                  ))}
                  {results.length === 0 ? (
                    <li className="search-empty">Nothing matches &ldquo;{query}&rdquo;</li>
                  ) : null}
                </ul>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
