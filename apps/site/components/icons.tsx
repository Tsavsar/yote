/**
 * Site chrome icons, from the Figma Home frame (node 2:3).
 *
 * Path data is the export's own, with the hardcoded strokes swapped for
 * `currentColor` so each one takes the colour of the control it sits in and
 * flips with the theme.
 */

/** Copy affordance, 13.85 drawn inside an 18px frame at 15% inset. */
export function CopyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false">
      <g transform="translate(2.075 2.075)">
        <path
          d="M9.625 4.225H11.425C12.4195 4.225 13.225 5.0305 13.225 6.025V11.425C13.225 12.4195 12.4195 13.225 11.425 13.225H6.025C5.0305 13.225 4.225 12.4195 4.225 11.425V9.625"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.825 0.625H2.425C1.43089 0.625 0.625 1.43089 0.625 2.425V7.825C0.625 8.81911 1.43089 9.625 2.425 9.625H7.825C8.81911 9.625 9.625 8.81911 9.625 7.825V2.425C9.625 1.43089 8.81911 0.625 7.825 0.625Z"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}

/** Check, shown after a copy. Not in the file — same stroke weight and caps. */
export function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M4 9.5L7.2 12.5L14 5.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** The sun, from node 16:5839. */
export function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 0.75V2.25" />
        <path d="M14.834 3.166L13.773 4.227" />
        <path d="M17.25 9H15.75" />
        <path d="M14.834 14.834L13.773 13.773" />
        <path d="M9 17.25V15.75" />
        <path d="M3.166 14.834L4.227 13.773" />
        <path d="M0.75 9H2.25" />
        <path d="M3.166 3.166L4.227 4.227" />
        <path d="M9 13.25C11.3472 13.25 13.25 11.3472 13.25 9C13.25 6.65279 11.3472 4.75 9 4.75C6.65279 4.75 4.75 6.65279 4.75 9C4.75 11.3472 6.65279 13.25 9 13.25Z" />
      </g>
    </svg>
  )
}

/** The moon. Drawn to the sun's stroke weight, since the file has no dark frame. */
export function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M15.2 11.4A6.6 6.6 0 0 1 6.6 2.8a6.6 6.6 0 1 0 8.6 8.6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
