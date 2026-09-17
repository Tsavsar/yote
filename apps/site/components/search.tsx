'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { SearchIcon } from 'yote-ui'
import type { SearchEntry } from './search-index'

const MAX_RESULTS = 7
const SNIPPET = 130

/** A page, versus a section inside one. */
function PageIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M9.5 1.75H4.5A1.25 1.25 0 0 0 3.25 3v10A1.25 1.25 0 0 0 4.5 14.25h7A1.25 1.25 0 0 0 12.75 13V5m-3.25-3.25L12.75 5m-3.25-3.25V5h3.25"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SectionIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M6.25 2.5 4.75 13.5M11.25 2.5l-1.5 11M2.75 5.75h11M2.25 10.25h11"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

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
  let named = false
  for (const word of words) {
    if (title.startsWith(word)) {
      total += 100
      named = true
    } else if (title.includes(word)) {
      total += 60
      named = true
    } else if (section.startsWith(word)) {
      total += 50
      named = true
    } else if (section.includes(word)) {
      total += 30
      named = true
    } else if (text.includes(word)) total += 10
    else return 0
  }

  /*
   * Which of a page and its own sections wins depends on where the match
   * was. "tags" names the page, so the page comes first. "backspace" is
   * buried in the body of three of them, and the section that talks about it
   * is a better answer than the page that mentions it.
   */
  if (named) return entry.section === null ? total + 5 : total
  return entry.section === null ? total : total + 3
}

/**
 * The sentence the match sits in, cut to fit.
 *
 * Centred slightly left of the hit so there is room to read forward, which is
 * the direction the answer usually lies. Falls back to the opening of the
 * text when the match was in the title and the body has nothing to show.
 */
function snippet(text: string, words: string[]): string {
  const lower = text.toLowerCase()
  let at = -1
  for (const word of words) {
    const found = lower.indexOf(word)
    if (found >= 0 && (at < 0 || found < at)) at = found
  }

  if (at < 0) return text.length > SNIPPET ? `${text.slice(0, SNIPPET).trimEnd()}…` : text

  const start = Math.max(0, at - Math.floor(SNIPPET / 3))
  const end = Math.min(text.length, start + SNIPPET)
  return `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`
}

function Highlight({ text, words }: { text: string; words: string[] }) {
  if (words.length === 0) return <>{text}</>
  const pattern = new RegExp(`(${words.map(escapeRegExp).join('|')})`, 'ig')
  return (
    <>
      {text.split(pattern).map((part, index) =>
        words.includes(part.toLowerCase()) ? (
          <mark key={index} className="search-mark">
            {part}
          </mark>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        ),
      )}
    </>
  )
}

/**
 * The search palette.
 *
 * Opened with ⌘K anywhere, or by the button — the shortcut is the one people
 * reach for and the button is how they learn it exists, which is why the
 * button wears the shortcut on its face.
 *
 * `trigger={false}` mounts the shortcut and the palette without the button.
 * The landing page uses that: it is a page you read rather than search, its
 * nav is already five things wide, and the shortcut still works for anyone
 * who learned it in the docs.
 *
 * No open or close animation. This is a thing you hit dozens of times an
 * hour; anything that has to play first makes the whole site feel slower, and
 * Raycast is right about that.
 *
 * The index is imported on first open rather than with the page. It is the
 * prose of every docs page, which is worth carrying to answer a search and
 * not worth carrying on a page view that never runs one.
 */
export function Search({ trigger = true }: { trigger?: boolean }) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [active, setActive] = React.useState(0)
  const [index, setIndex] = React.useState<SearchEntry[] | null>(null)

  const inputRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLUListElement>(null)

  const words = React.useMemo(() => query.toLowerCase().split(/\s+/).filter(Boolean), [query])

  const results = React.useMemo(() => {
    if (index === null) return []
    if (words.length === 0) {
      return index
        .filter((entry) => entry.section === null)
        .slice(0, MAX_RESULTS)
        .map((entry) => ({ entry, quote: snippet(entry.text, words) }))
    }

    const ranked = index
      .map((entry) => ({ entry, rank: score(entry, words) }))
      .filter((hit) => hit.rank > 0)
      .sort((a, b) => b.rank - a.rank)

    /*
     * A page's text contains its sections' text, so a hit buried in the body
     * surfaces twice: once as the section that discusses it, once as the page
     * that contains it, quoting the very same sentence. Deduplicating on the
     * quote drops the second, and because the list is already ranked the one
     * that survives is the more specific of the two.
     */
    const seen = new Set<string>()
    const out: { entry: SearchEntry; quote: string }[] = []
    for (const hit of ranked) {
      const quote = snippet(hit.entry.text, words)
      if (seen.has(quote)) continue
      seen.add(quote)
      out.push({ entry: hit.entry, quote })
      if (out.length === MAX_RESULTS) break
    }
    return out
  }, [index, words])

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
    if (!open || index !== null) return
    let live = true
    import('./search-index').then((module) => {
      if (live) setIndex(module.SEARCH_INDEX)
    })
    return () => {
      live = false
    }
  }, [open, index])

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
        go(results[active]?.entry)
        break
      case 'Escape':
        event.preventDefault()
        setOpen(false)
        break
    }
  }

  return (
    <>
      {trigger ? (
        <button type="button" className="search-trigger" onClick={() => setOpen(true)}>
          <SearchIcon size={15} />
          <span className="search-trigger-label">Search</span>
          <kbd className="search-trigger-kbd" aria-hidden="true">
            ⌘K
          </kbd>
        </button>
      ) : null}

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
                  {results.map(({ entry, quote }, position) => (
                    <li
                      key={entry.href}
                      id={`search-${position}`}
                      role="option"
                      aria-selected={position === active}
                      className="search-result"
                      data-active={position === active || undefined}
                      onPointerDown={(event) => event.preventDefault()}
                      onPointerEnter={() => setActive(position)}
                      onClick={() => go(entry)}
                    >
                      <span className="search-result-icon">
                        {entry.section === null ? <PageIcon /> : <SectionIcon />}
                      </span>
                      <span className="search-result-body">
                        <span className="search-result-title">{entry.section ?? entry.title}</span>
                        <span className="search-result-snippet">
                          <Highlight text={quote} words={words} />
                        </span>
                      </span>
                      <span className="search-result-page">
                        {entry.section === null ? 'Page' : entry.title}
                      </span>
                    </li>
                  ))}
                  {index !== null && results.length === 0 ? (
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
