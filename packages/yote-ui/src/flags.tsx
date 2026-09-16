import * as React from 'react'

/**
 * Flags for the default country list.
 *
 * Emoji was the first answer and it is wrong on the platform most likely to
 * see it: Windows ships no regional-indicator glyphs at all, so 🇬🇧 renders as
 * the letters "GB". A field that reads correctly on a Mac and looks broken on
 * a PC is not a default worth shipping.
 *
 * So these are inline SVG — no dependency, no asset pipeline, no network
 * request, and identical everywhere. The geometry comes from flag-icons
 * (https://github.com/lipis/flag-icons, MIT, © Panayiotis Lipiridis), the
 * same 4x3 set the docs point at for the other two hundred and fifty. All
 * eight together are under 6KB of markup.
 *
 * Only these eight ship. A full set belongs in the consumer's bundle, not
 * ours — pass `flag` on a country to supply your own.
 */

/** Shared wrapper. One size, one hairline, so a white-edged flag such as
 *  Finland or Japan still reads against a white field. */
function FlagSvg({ children }: { children: React.ReactNode }) {
  return (
    <svg className="yote-flag" viewBox="0 0 640 480" aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

function FlagUS() {
  /* The stars are one marker reused along a path, which is why the busiest
     flag here is also one of the smallest. The marker needs a document-unique
     id, hence useId. */
  const uid = React.useId().replace(/:/g, '')
  return (
    <FlagSvg>
      <path fill="#bd3d44" d="M0 0h640v480H0" />
      <path
        stroke="#fff"
        strokeWidth="37"
        d="M0 55.3h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640"
      />
      <path fill="#192f5d" d="M0 0h364.8v258.5H0" />
      <marker id={`${uid}s`} markerHeight="30" markerWidth="30">
        <path fill="#fff" d="m14 0 9 27L0 10h28L5 27z" />
      </marker>
      <path
        fill="none"
        markerMid={`url(#${uid}s)`}
        d="m0 0 16 11h61 61 61 61 60L47 37h61 61 60 61L16 63h61 61 61 61 60L47 89h61 61 60 61L16 115h61 61 61 61 60L47 141h61 61 60 61L16 166h61 61 61 61 60L47 192h61 61 60 61L16 218h61 61 61 61 60z"
      />
    </FlagSvg>
  )
}

function FlagGB() {
  return (
    <FlagSvg>
      <path fill="#012169" d="M0 0h640v480H0z" />
      <path
        fill="#fff"
        d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0z"
      />
      <path
        fill="#c8102e"
        d="m424 281 216 159v40L369 281zm-184 20 6 35L54 480H0zM640 0v3L391 191l2-44L590 0zM0 0l239 176h-60L0 42z"
      />
      <path fill="#fff" d="M241 0v480h160V0zM0 160v160h640V160z" />
      <path fill="#c8102e" d="M0 193v96h640v-96zM273 0v480h96V0z" />
    </FlagSvg>
  )
}

function FlagFI() {
  return (
    <FlagSvg>
      <path fill="#fff" d="M0 0h640v480H0z" />
      <path fill="#002f6c" d="M0 174.5h640v131H0z" />
      <path fill="#002f6c" d="M175.5 0h130.9v480h-131z" />
    </FlagSvg>
  )
}

function FlagNG() {
  return (
    <FlagSvg>
      <path fill="#fff" d="M0 0h640v480H0z" />
      <path fill="#008753" fillRule="evenodd" d="M426.6 0H640v480H426.6zM0 0h213.3v480H0z" />
    </FlagSvg>
  )
}

function FlagDE() {
  return (
    <FlagSvg>
      <path fill="#fc0" d="M0 320h640v160H0z" />
      <path fill="#000001" d="M0 0h640v160H0z" />
      <path fill="red" d="M0 160h640v160H0z" />
    </FlagSvg>
  )
}

function FlagFR() {
  return (
    <FlagSvg>
      <path fill="#fff" d="M0 0h640v480H0z" />
      <path fill="#000091" d="M0 0h213.3v480H0z" />
      <path fill="#e1000f" d="M426.7 0H640v480H426.7z" />
    </FlagSvg>
  )
}

function FlagJP() {
  /* Flattened out of the source's clip path and nested transforms: the disc
     resolves to centre 320,240 at r=149.2, which is all that survived them. */
  return (
    <FlagSvg>
      <path fill="#fff" d="M0 0h640v480H0z" />
      <circle cx="320" cy="240" r="149.2" fill="#bc002d" />
    </FlagSvg>
  )
}

function FlagIN() {
  /* The chakra is one spoke rotated by <use> five times over, then the group
     of six rotated twice more. Four ids, all namespaced, so two India flags on
     one page do not both answer to #a. */
  const uid = React.useId().replace(/:/g, '')
  return (
    <FlagSvg>
      <path fill="#f93" d="M0 0h640v160H0z" />
      <path fill="#fff" d="M0 160h640v160H0z" />
      <path fill="#128807" d="M0 320h640v160H0z" />
      <g transform="matrix(3.2 0 0 3.2 320 240)">
        <circle r="20" fill="#008" />
        <circle r="17.5" fill="#fff" />
        <circle r="3.5" fill="#008" />
        <g id={`${uid}d`}>
          <g id={`${uid}c`}>
            <g id={`${uid}b`}>
              <g id={`${uid}a`} fill="#008">
                <circle r=".9" transform="rotate(7.5 -8.8 133.5)" />
                <path d="M0 17.5.6 7 0 2l-.6 5z" />
              </g>
              <use href={`#${uid}a`} width="100%" height="100%" transform="rotate(15)" />
            </g>
            <use href={`#${uid}b`} width="100%" height="100%" transform="rotate(30)" />
          </g>
          <use href={`#${uid}c`} width="100%" height="100%" transform="rotate(60)" />
        </g>
        <use href={`#${uid}d`} width="100%" height="100%" transform="rotate(120)" />
        <use href={`#${uid}d`} width="100%" height="100%" transform="rotate(-120)" />
      </g>
    </FlagSvg>
  )
}

/** ISO 3166-1 alpha-2 to the drawn flag, for the default country list only. */
export const BUILT_IN_FLAGS: Record<string, React.ReactNode> = {
  US: <FlagUS />,
  GB: <FlagGB />,
  FI: <FlagFI />,
  NG: <FlagNG />,
  DE: <FlagDE />,
  FR: <FlagFR />,
  IN: <FlagIN />,
  JP: <FlagJP />,
}
