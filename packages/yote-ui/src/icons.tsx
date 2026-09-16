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

/* ---- password input, Figma 23:6839 ---------------------------------- */

/** The lock, 20px, stroke. */
export function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M8.33359 10.0003C8.33359 10.8843 7.9824 11.7322 7.35728 12.3573C6.73216 12.9824 5.88431 13.3336 5.00026 13.3336C4.1162 13.3336 3.26836 12.9824 2.64324 12.3573C2.01812 11.7322 1.66693 10.8843 1.66693 10.0003C1.66693 9.1162 2.01812 8.26835 2.64324 7.64323C3.26836 7.01811 4.1162 6.66692 5.00026 6.66692C5.88431 6.66692 6.73216 7.01811 7.35728 7.64323C7.9824 8.26835 8.33359 9.1162 8.33359 10.0003ZM8.33359 10.0003H18.3336V12.5003M15.0003 10.0003V12.5003"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * The eye. Figma draws a 16.5 x 9.833 mark inside a 20px frame; the viewBox
 * is offset to centre that art rather than rescaling the path.
 */
export function EyeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="-1.75 -5.0835 20 20"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M0.750185 5.75C3.75019 -0.916667 12.7502 -0.916667 15.7502 5.75M8.25019 9.08333C7.92188 9.08333 7.59679 9.01867 7.29348 8.89303C6.99016 8.7674 6.71456 8.58325 6.48242 8.3511C6.25027 8.11895 6.06612 7.84336 5.94049 7.54004C5.81485 7.23673 5.75019 6.91164 5.75019 6.58333C5.75019 6.25503 5.81485 5.92994 5.94049 5.62662C6.06612 5.32331 6.25027 5.04771 6.48242 4.81557C6.71456 4.58342 6.99016 4.39927 7.29348 4.27363C7.59679 4.148 7.92188 4.08333 8.25019 4.08333C8.91323 4.08333 9.54911 4.34673 10.018 4.81557C10.4868 5.28441 10.7502 5.92029 10.7502 6.58333C10.7502 7.24637 10.4868 7.88226 10.018 8.3511C9.54911 8.81994 8.91323 9.08333 8.25019 9.08333Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * The eye, struck through. Not in the Figma file — the frames only draw the
 * masked state — so it is the same mark plus a slash at the same weight and
 * cap, rather than a second glyph from somewhere else.
 */
export function EyeOffIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="-1.75 -5.0835 20 20"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M0.750185 5.75C3.75019 -0.916667 12.7502 -0.916667 15.7502 5.75M8.25019 9.08333C7.92188 9.08333 7.59679 9.01867 7.29348 8.89303C6.99016 8.7674 6.71456 8.58325 6.48242 8.3511C6.25027 8.11895 6.06612 7.84336 5.94049 7.54004C5.81485 7.23673 5.75019 6.91164 5.75019 6.58333C5.75019 6.25503 5.81485 5.92994 5.94049 5.62662C6.06612 5.32331 6.25027 5.04771 6.48242 4.81557C6.71456 4.58342 6.99016 4.39927 7.29348 4.27363C7.59679 4.148 7.92188 4.08333 8.25019 4.08333C8.91323 4.08333 9.54911 4.34673 10.018 4.81557C10.4868 5.28441 10.7502 5.92029 10.7502 6.58333C10.7502 7.24637 10.4868 7.88226 10.018 8.3511C9.54911 8.81994 8.91323 9.08333 8.25019 9.08333Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.5 11.5L15 -1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** A met requirement: circle with a check. */
export function MetIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path fillRule="evenodd" clipRule="evenodd" d="M8.00021 0.833537C4.04221 0.833537 0.833541 4.0422 0.833541 8.0002C0.833541 11.9582 4.04221 15.1669 8.00021 15.1669C11.9582 15.1669 15.1669 11.9582 15.1669 8.0002C15.1669 4.0422 11.9582 0.833537 8.00021 0.833537ZM5.02021 7.9802C4.92542 7.89188 4.80006 7.8438 4.67053 7.84609C4.54099 7.84837 4.4174 7.90085 4.32579 7.99246C4.23418 8.08406 4.18171 8.20765 4.17942 8.33719C4.17714 8.46672 4.22522 8.59209 4.31354 8.68687L6.31354 10.6869C6.40729 10.7805 6.53437 10.8331 6.66687 10.8331C6.79937 10.8331 6.92646 10.7805 7.02021 10.6869L11.6869 6.0202C11.7752 5.92542 11.8233 5.80006 11.821 5.67052C11.8187 5.54099 11.7662 5.4174 11.6746 5.32579C11.583 5.23418 11.4594 5.18171 11.3299 5.17942C11.2004 5.17713 11.075 5.22522 10.9802 5.31354L6.66687 9.62687L5.02021 7.9802Z" fill="currentColor" />
    </svg>
  )
}

/** An unmet requirement: circle with a cross. */
export function UnmetIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path fillRule="evenodd" clipRule="evenodd" d="M8.00021 0.833537C4.04221 0.833537 0.833541 4.0422 0.833541 8.0002C0.833541 11.9582 4.04221 15.1669 8.00021 15.1669C11.9582 15.1669 15.1669 11.9582 15.1669 8.0002C15.1669 4.0422 11.9582 0.833537 8.00021 0.833537ZM6.46821 5.76087C6.37395 5.66975 6.24767 5.61929 6.11657 5.62036C5.98547 5.62144 5.86004 5.67397 5.76729 5.76663C5.67454 5.85929 5.6219 5.98467 5.6207 6.11577C5.6195 6.24687 5.66984 6.37319 5.76087 6.46754L7.29287 8.0002L5.76087 9.5322C5.67255 9.62699 5.62447 9.75235 5.62676 9.88188C5.62904 10.0114 5.68152 10.135 5.77313 10.2266C5.86473 10.3182 5.98832 10.3707 6.11786 10.373C6.24739 10.3753 6.37276 10.3272 6.46754 10.2389L8.00021 8.7082L9.53221 10.2402C9.62699 10.3285 9.75235 10.3766 9.88189 10.3743C10.0114 10.372 10.135 10.3196 10.2266 10.228C10.3182 10.1363 10.3707 10.0128 10.373 9.88322C10.3753 9.75368 10.3272 9.62832 10.2389 9.53354L8.70687 8.0002L10.2389 6.4682C10.288 6.42243 10.3274 6.36723 10.3547 6.3059C10.3821 6.24456 10.3968 6.17835 10.3979 6.11122C10.3991 6.04408 10.3868 5.9774 10.3616 5.91514C10.3365 5.85288 10.299 5.79632 10.2516 5.74884C10.2041 5.70137 10.1475 5.66394 10.0853 5.63879C10.023 5.61364 9.95633 5.60129 9.88919 5.60248C9.82206 5.60366 9.75585 5.61835 9.69451 5.64568C9.63318 5.67301 9.57798 5.71241 9.53221 5.76154L8.00021 7.2922L6.46821 5.76087Z" fill="currentColor" />
    </svg>
  )
}

/* ---- phone input, Figma 26:9409 -------------------------------------- */

/** The country-select chevron (Figma nav-arrow-down, 14px). */
export function ChevronDownIcon() {
  return (
    <svg
      className="yote-phone-chevron"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M3.5 5.25L7 8.75L10.5 5.25"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** The dropdown search glyph (Figma 29:10434, 16px). */
export function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M11.3335 11.3335L14.0002 14.0002M2.00021 7.33354C2.00021 8.74802 2.56211 10.1046 3.5623 11.1048C4.5625 12.105 5.91905 12.6669 7.33354 12.6669C8.74803 12.6669 10.1046 12.105 11.1048 11.1048C12.105 10.1046 12.6669 8.74802 12.6669 7.33354C12.6669 5.91905 12.105 4.56249 11.1048 3.5623C10.1046 2.56211 8.74803 2.0002 7.33354 2.0002C5.91905 2.0002 4.5625 2.56211 3.5623 3.5623C2.56211 4.56249 2.00021 5.91905 2.00021 7.33354Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
