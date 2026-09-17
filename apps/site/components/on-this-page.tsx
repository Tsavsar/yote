'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'

/**
 * The right-hand contents rail.
 *
 * Headings are read from the rendered DOM rather than passed in, so a page
 * cannot grow a section that the rail forgets about. The active entry is
 * tracked with an IntersectionObserver rather than a scroll handler — no
 * work on the main thread between intersections.
 */
export function OnThisPage() {
  const [items, setItems] = React.useState<{ id: string; text: string }[]>([])
  const [active, setActive] = React.useState<string | null>(null)
  const listRef = React.useRef<HTMLDivElement>(null)
  const [marker, setMarker] = React.useState<{ y: number; h: number } | null>(null)
  /*
   * Keyed on the path, because this component lives in the docs layout and
   * the layout survives navigation between docs pages. Without it the rail
   * keeps the first page's headings for the rest of the session.
   */
  const pathname = usePathname()

  React.useEffect(() => {
    setActive(null)
    const headings = [...document.querySelectorAll<HTMLElement>('.docs-content h2[id]')]
    setItems(headings.map((h) => ({ id: h.id, text: h.textContent ?? '' })))
    if (headings.length === 0) return

    const seen = new Map<string, boolean>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) seen.set(entry.target.id, entry.isIntersecting)
        const firstVisible = headings.find((h) => seen.get(h.id))
        if (firstVisible) setActive(firstVisible.id)
      },
      // Bias the band to the top of the viewport: the heading you are reading
      // under is the one that just left the top, not the one in the middle.
      { rootMargin: '-80px 0px -66% 0px' },
    )

    for (const h of headings) observer.observe(h)
    return () => observer.disconnect()
  }, [pathname])

  /*
   * The rule down the side of the rail is one element that travels, not a
   * border that lights up on whichever entry is active. Same reasoning as the
   * control pills: a marker that moves takes your eye to the new section,
   * where one that blinks somewhere else makes you find it.
   *
   * Measured after every render, since `active` changes from an observer
   * rather than from anything this render can see, and bailing out on an
   * unchanged box is what stops that being a loop.
   */
  React.useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return
    const el = list.querySelector<HTMLElement>('.docs-toc-link[data-active]')
    if (el === null) {
      setMarker(null)
      return
    }
    const next = { y: el.offsetTop, h: el.offsetHeight }
    setMarker((prev) => (prev && prev.y === next.y && prev.h === next.h ? prev : next))
  })

  if (items.length === 0) return null

  return (
    <aside className="docs-toc" aria-label="On this page">
      <span className="docs-toc-title">On this page</span>
      <div className="docs-toc-list" ref={listRef}>
        {marker !== null ? (
          <span
            className="docs-toc-marker"
            aria-hidden="true"
            style={{ transform: `translateY(${marker.y}px)`, height: `${marker.h}px` }}
          />
        ) : null}
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="docs-toc-link"
            data-active={active === item.id || undefined}
          >
            {item.text}
          </a>
        ))}
      </div>
    </aside>
  )
}
