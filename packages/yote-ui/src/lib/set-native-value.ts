/**
 * Write a value to an input through the native prototype setter.
 *
 * React installs its own `value` setter on the element instance to track
 * what it last saw. Assigning `el.value = x` goes through that patched
 * setter and updates the tracker, so React concludes nothing changed and
 * swallows the next change event that produces the same string. Going
 * through the prototype's setter writes the DOM without touching the
 * tracker, which is what keeps sanitised input and programmatic updates
 * visible to React and to form libraries listening for real events.
 */
export function setNativeValue(el: HTMLInputElement, value: string, dispatch = false): void {
  const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')
  const setter = descriptor?.set

  if (setter) {
    setter.call(el, value)
  } else {
    el.value = value
  }

  if (dispatch) {
    el.dispatchEvent(new Event('input', { bubbles: true }))
  }
}
