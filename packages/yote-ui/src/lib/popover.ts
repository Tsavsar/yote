import * as React from 'react'

/**
 * The bits every popover in this library shares: where it goes, how the
 * keyboard drives it, and when it closes.
 *
 * Extracted out of the phone input's country picker, which was the first one
 * to need them. The markup stays with each component — a flag, a dial code
 * and a country name is not the same row as a plain option, and pretending
 * otherwise produces a render-prop tangle. What is genuinely identical is
 * everything below.
 */

/** Panel geometry. Fixed coordinates, so it is measured against the viewport. */
export interface Placement {
  style: React.CSSProperties
  side: 'top' | 'bottom'
}

/** The gap from the anchor, and the least room left to the viewport edge. */
const GAP = 6
const MARGIN = 12
const MAX = 320
const MIN = 180

function placeFor(anchor: HTMLElement, minWidth: number): Placement {
  const rect = anchor.getBoundingClientRect()
  const vw = document.documentElement.clientWidth
  const vh = document.documentElement.clientHeight

  const below = vh - rect.bottom - GAP - MARGIN
  const above = rect.top - GAP - MARGIN
  const side: Placement['side'] = below >= MIN || below >= above ? 'bottom' : 'top'

  const room = Math.max(MIN, Math.min(MAX, side === 'bottom' ? below : above))
  /* A panel is at least as wide as its anchor. `minWidth` raises that for a
     trigger too narrow to hang a menu off — the inline selector is three
     words wide and its options are longer. */
  const width = Math.min(Math.max(rect.width, minWidth), vw - MARGIN * 2)
  const left = Math.max(MARGIN, Math.min(rect.left, vw - MARGIN - width))

  return {
    side,
    style:
      side === 'bottom'
        ? { top: rect.bottom + GAP, left, width, maxHeight: room }
        : { bottom: vh - rect.top + GAP, left, width, maxHeight: room },
  }
}

/**
 * Where the panel goes, re-measured whenever it opens, scrolls or the window
 * resizes.
 *
 * Anchored to the field box, so the panel takes the field's left edge and its
 * width: a popover narrower than its control and offset from it reads as a
 * floating object that happens to be nearby, where matching the box makes it
 * an extension of the field, which is what it is.
 *
 * Below unless below cannot hold it and above can.
 */
export function usePopoverPlacement(
  open: boolean,
  anchorRef: React.RefObject<HTMLElement | null>,
  minWidth = 0,
): Placement | null {
  const [placement, setPlacement] = React.useState<Placement | null>(null)

  React.useLayoutEffect(() => {
    if (!open) {
      setPlacement(null)
      return
    }
    const anchor = anchorRef.current
    if (!anchor) return

    const reposition = () => setPlacement(placeFor(anchor, minWidth))
    reposition()

    /* Capture, so a scroll in any ancestor moves it, not just the window. */
    window.addEventListener('scroll', reposition, true)
    window.addEventListener('resize', reposition)
    return () => {
      window.removeEventListener('scroll', reposition, true)
      window.removeEventListener('resize', reposition)
    }
  }, [open, anchorRef, minWidth])

  return placement
}

/**
 * Closes the popover on a pointer down outside it.
 *
 * Both refs, because the panel is portalled to the body and so is not inside
 * the trigger's subtree — testing only the trigger closes the panel the
 * instant you click an option in it.
 */
export function useDismiss(
  open: boolean,
  close: () => void,
  refs: Array<React.RefObject<HTMLElement | null>>,
) {
  React.useEffect(() => {
    if (!open) return
    const onDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (!refs.some((ref) => ref.current?.contains(target))) close()
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, close])
}

/**
 * The listbox keyboard model, shared so every dropdown in the library answers
 * to the same keys.
 *
 * Arrows wrap, Home and End jump, Enter commits, Escape closes. When the
 * panel is shut, Down and Enter open it — the two things people try first.
 */
export function useListboxKeys({
  open,
  setOpen,
  count,
  activeIndex,
  setActiveIndex,
  onCommit,
  close,
  openOnSpace = true,
}: {
  open: boolean
  setOpen: (next: boolean) => void
  count: number
  activeIndex: number
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>
  onCommit: (index: number) => void
  close: () => void
  /** False where the field takes typed text and a space is a space. */
  openOnSpace?: boolean
}) {
  return (event: React.KeyboardEvent) => {
    if (!open) {
      if (
        event.key === 'ArrowDown' ||
        event.key === 'Enter' ||
        (openOnSpace && event.key === ' ')
      ) {
        event.preventDefault()
        setOpen(true)
      }
      return
    }
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setActiveIndex((i) => (count === 0 ? 0 : (i + 1) % count))
        break
      case 'ArrowUp':
        event.preventDefault()
        setActiveIndex((i) => (count === 0 ? 0 : (i - 1 + count) % count))
        break
      case 'Home':
        event.preventDefault()
        setActiveIndex(0)
        break
      case 'End':
        event.preventDefault()
        setActiveIndex(Math.max(0, count - 1))
        break
      case 'Enter':
        event.preventDefault()
        onCommit(activeIndex)
        break
      case 'Escape':
        event.preventDefault()
        close()
        break
    }
  }
}

/** Keeps the active row in view when the arrows move past the fold. */
export function useScrollActiveIntoView(
  open: boolean,
  activeIndex: number,
  listRef: React.RefObject<HTMLElement | null>,
) {
  React.useEffect(() => {
    if (!open) return
    listRef.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' })
  }, [open, activeIndex, listRef])
}
