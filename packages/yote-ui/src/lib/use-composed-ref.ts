import * as React from 'react'

type PossibleRef<T> = React.Ref<T> | undefined

function assignRef<T>(ref: PossibleRef<T>, value: T | null) {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref !== null && ref !== undefined) {
    ;(ref as React.RefObject<T | null>).current = value
  }
}

/**
 * Merge several refs into one callback ref, so a component can hold its own
 * ref on an element and still hand the same element to the consumer's ref.
 *
 * `ref` always lands on the real underlying input, never on a wrapper div,
 * so form libraries and focus management work without anyone reading source.
 */
export function useComposedRef<T>(...refs: PossibleRef<T>[]): React.RefCallback<T> {
  return React.useCallback((node: T | null) => {
    for (const ref of refs) assignRef(ref, node)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs)
}
