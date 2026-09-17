'use client'

import * as React from 'react'

/**
 * Fades a section in the first time it comes into view.
 *
 * A component library's front page is a long column of near-identical blocks.
 * Revealing each one as it arrives gives the scroll a rhythm and makes the
 * page feel authored rather than dumped — but it is decoration, so it earns
 * its place only by being almost invisible: 8px of rise, 420ms, once.
 *
 * Two things keep it from getting in the way. The observer fires early
 * (-12% from the bottom), so a section is already settled by the time you
 * reach it rather than animating under your eyes. And nothing is ever hidden
 * from the accessibility tree or from a printer — this is opacity and
 * transform only, on content that is already there.
 */
export function Reveal({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLElement>(null)
  const [shown, setShown] = React.useState(false)

  React.useEffect(() => {
    const node = ref.current
    if (!node) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return
    }

    /* Anything already on screen at load skips the animation entirely — a
       section you did not scroll to has nothing to announce. */
    const rect = node.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.9) {
      setShown(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="showcase reveal" data-shown={shown || undefined} ref={ref}>
      {children}
    </section>
  )
}
