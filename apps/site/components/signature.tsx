/**
 * Shater's signature, from the brand file (Figma 3127:13948).
 *
 * Inlined rather than linked: the exported asset URL expires, and a
 * signature that 404s a week after it ships is worse than no signature.
 *
 * The one change from the export is the stroke, which was a hardcoded
 * #171717 and would have disappeared on the dark page. It takes
 * `currentColor` now, like every other mark on the site.
 */
export function Signature({ size = 42 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" fill="none" role="img" aria-label="Shater">
      <path
        d="M19.0686 15.9329C23.2694 13.9059 22.4915 10.7094 20.0799 11.0212C17.0239 12.4513 15.918 15.0364 13.1953 24.431C9.96692 31.6036 4.32695 33.3188 5.06604 30.5901C7.50268 27.1677 17.9795 20.7277 26.6533 18.7396C33.3434 17.2062 35.6772 17.4143 37.1941 15.9329M35.4049 12.5805C35.016 13.2042 33.6145 12.7364 32.6421 13.4771C31.526 13.7764 31.4529 14.025 30.504 14.6855C29.7974 15.1774 29.3049 15.8781 28.4814 16.1278C27.6425 16.3823 27.5502 15.5251 26.8867 15.816C25.0197 16.6346 23.1527 17.6871 22.2581 17.96C21.7787 18.1062 22.5303 16.9075 21.8691 16.7126C21.2079 16.5177 18.8741 19.1684 18.524 18.8566C18.174 18.5447 18.4074 17.96 18.4074 17.96M32.6421 13.4771C32.9144 12.8144 34.3936 11.8398 34.0825 11.411C33.7713 10.9822 33.3045 12.0348 32.8767 12.8924C32.4488 13.75 31.9505 15.8218 33.1878 16.1668C34.2979 16.4764 36.121 14.6855 36.5503 14.0048"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </svg>
  )
}
