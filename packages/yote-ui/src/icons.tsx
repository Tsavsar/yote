/**
 * Icons, from the Figma file's own exports.
 *
 * Path data is the exported asset's, not redrawn. Inlined rather than shipped
 * as files because this package has zero dependencies and no asset pipeline —
 * an <img> would make every consumer resolve a URL to render a hint.
 *
 * All of them take `currentColor`, so a state change or a retheme moves the
 * icon with the text it sits next to instead of pinning a hex.
 */

/**
 * The circle-i mark. One glyph serves both the 14px info affordance beside a
 * label and the 16px hint marker — Figma exports them at two scales, but the
 * coordinates are the same shape (0.8335/16 and 0.7293/14 are the same ratio),
 * so one path rendered at either size is identical to both exports.
 */
export function InfoIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.833541 8.0002C0.833541 4.0422 4.04221 0.833537 8.00021 0.833537C11.9582 0.833537 15.1669 4.0422 15.1669 8.0002C15.1669 11.9582 11.9582 15.1669 8.00021 15.1669C4.04221 15.1669 0.833541 11.9582 0.833541 8.0002ZM8.00021 7.16687C8.13282 7.16687 8.25999 7.21955 8.35376 7.31332C8.44753 7.40709 8.50021 7.53426 8.50021 7.66687V11.0002C8.50021 11.1328 8.44753 11.26 8.35376 11.3538C8.25999 11.4475 8.13282 11.5002 8.00021 11.5002C7.8676 11.5002 7.74042 11.4475 7.64665 11.3538C7.55289 11.26 7.50021 11.1328 7.50021 11.0002V7.66687C7.50021 7.53426 7.55289 7.40709 7.64665 7.31332C7.74042 7.21955 7.8676 7.16687 8.00021 7.16687ZM8.37887 5.33354C8.42421 5.28497 8.45941 5.22786 8.48242 5.16553C8.50544 5.10321 8.5158 5.03692 8.5129 4.97055C8.51001 4.90417 8.49391 4.83904 8.46556 4.77896C8.4372 4.71888 8.39716 4.66505 8.34777 4.62061C8.29837 4.57618 8.24062 4.54204 8.17788 4.52018C8.11514 4.49832 8.04868 4.48919 7.98237 4.49331C7.91606 4.49743 7.85124 4.51472 7.79169 4.54418C7.73214 4.57364 7.67905 4.61467 7.63554 4.66487L7.62887 4.6722C7.5833 4.72069 7.54786 4.77778 7.52463 4.84014C7.50141 4.9025 7.49087 4.96887 7.49362 5.03535C7.49638 5.10184 7.51237 5.16711 7.54068 5.22733C7.56898 5.28755 7.60902 5.34152 7.65845 5.38607C7.70788 5.43062 7.76571 5.46485 7.82854 5.48676C7.89137 5.50868 7.95794 5.51783 8.02436 5.51368C8.09077 5.50953 8.15569 5.49217 8.2153 5.46261C8.27492 5.43305 8.32804 5.39189 8.37154 5.34154L8.37887 5.33354Z"
        fill="currentColor"
      />
    </svg>
  )
}

/** The two-stroke resize grabber (Figma 12x12). */
export function ResizeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M2.32422 9.07107L9.39529 2M6.31641 9.59695L10.559 5.35431"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </svg>
  )
}

/**
 * The error mark, from Figma node 6:4776.
 *
 * Figma sits a 16.4024 x 15 mark in a 20 x 20 frame at insets 10% / 8.99% /
 * 15% / 9%, which is 1.8px from the left and 2px from the top — the offsets
 * are not symmetric, so centring it would land half a pixel low. The translate
 * reproduces the frame exactly.
 */
export function AlertIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g transform="translate(1.8 2)">
        <path
          d="M15.9949 10.5L10.7989 1.5C10.2569 0.561 9.28488 0 8.20088 0C7.11688 0 6.14487 0.561 5.60287 1.5L0.406875 10.5C-0.135125 11.438 -0.136125 12.561 0.406875 13.5C0.948875 14.439 1.92087 15 3.00487 15H13.3979C14.4819 15 15.4539 14.439 15.9959 13.5C16.5379 12.561 16.5369 11.438 15.9949 10.5ZM7.20087 5C7.20087 4.448 7.64788 4 8.20088 4C8.75388 4 9.20088 4.448 9.20088 5V8.5C9.20088 9.052 8.75388 9.5 8.20088 9.5C7.64788 9.5 7.20087 9.052 7.20087 8.5V5ZM8.20088 13C7.51188 13 6.95087 12.439 6.95087 11.75C6.95087 11.061 7.51188 10.5 8.20088 10.5C8.88988 10.5 9.45088 11.061 9.45088 11.75C9.45088 12.439 8.88988 13 8.20088 13Z"
          fill="currentColor"
        />
      </g>
    </svg>
  )
}
