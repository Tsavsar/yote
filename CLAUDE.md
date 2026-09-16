# Yöte — project brief

Hand this to Claude Code as the starting context for the repo. It contains every
decision made so far, the exact design values pulled from Figma, the bugs already
found and their fixes, and the questions still open.

Rename this to `CLAUDE.md` at the repo root if you want it loaded automatically
in every session.

---

## 1. What this is

**Yöte** is an open source React component library. It does form inputs, and only
form inputs, extremely well. Styled and animated out of the box rather than
headless.

The name comes from the Finnish *syöte*, meaning input. It is pronounced "yoat"
in English. Sister project to Luotain, which is Finnish for sonar probe. The
Finnish naming is deliberate house style and should continue for future projects.

**Positioning.** Radix, Base UI and Ark own the headless accessibility primitive
space and we are not competing there. What none of them ship is craft: the error
transition, the focus ring timing, the way a digit lands in a cell. That is the
product. Beautiful defaults, small prop surface, zero dependencies.

**Reference point.** Sonner by Emil Kowalski. Not for its feature count, which is
tiny, but for its philosophy: insert it and it works, the defaults are excellent,
and the documentation site lets you touch the thing before you install it.

**Hard scope rule.** This library does inputs. Not selects, not date pickers, not
form state management, not validation logic. Validation state is accepted as a
prop. We never own validation. Write this in the README so there is something to
point at when the temptation arrives.

---

## 2. Naming and domain decisions, already made

| Thing | Decision | Notes |
| --- | --- | --- |
| npm package | `yote-ui` | Bare `yote` is taken by a dormant CLI from Fugitive Labs, last published ~5 years ago. Check `@yote/*` scope availability first; if free, `@yote/input` is preferable long term. |
| GitHub repo | `Tsavsar/yote` | Brand is Yöte everywhere that matters. The install string is not the product name. |
| Docs domain | `yote.shatermt.com` | Precedent: `sonner.emilkowal.ski`, `vaul.emilkowal.ski`. Costs nothing, ships today, and links the library back to the portfolio. |
| Avoid | `.io` | Most expensive renewal of the realistic options, plus live ccTLD uncertainty from the UK–Mauritius Chagos treaty signed May 2025. Not urgent, but no upside. |
| Optional later | `yote.dev` | Cheap, Google operated, HSTS preloaded. Grab it if available even if unused. |

**Brand colour.** `#7D52F4`. Note that `hsla(256, 88%, 64%)` resolves to `#7E52F4`,
one value off in red. The Figma variable `feature-base` is `#7D52F4` and that is
canonical. Use the hex, not the HSL.

In OKLCH: `oklch(0.578 0.229 289.7)`.

---

## 3. Repository structure

npm workspaces monorepo. The docs site imports the local package directly so the
two can never drift.

```
yote/
├── package.json                 workspaces: ["packages/*", "apps/*"]
├── CLAUDE.md                    this file
├── README.md
├── packages/
│   └── yote-ui/
│       ├── package.json
│       ├── tsconfig.json
│       ├── tsup.config.ts
│       └── src/
│           ├── index.ts         barrel export
│           ├── styles.css       all component CSS, inside @layer yote
│           ├── pin-input.tsx    FIRST COMPONENT
│           ├── input.tsx        scaffolded, comes second
│           └── lib/
│               ├── use-composed-ref.ts
│               └── set-native-value.ts
└── apps/
    └── site/                    Next.js App Router
        ├── app/
        │   ├── page.tsx         landing
        │   ├── docs/
        │   │   ├── layout.tsx   sidebar shell
        │   │   ├── page.tsx     getting started
        │   │   ├── pin-input/page.tsx
        │   │   ├── theming/page.tsx
        │   │   └── accessibility/page.tsx
        │   └── layout.tsx
        └── components/
            ├── predictive-arc.tsx   the WebGL background
            ├── preview.tsx          preview + code panel shell
            └── state-switcher.tsx
```

---

## 4. Build order

1. `packages/yote-ui` scaffold: package.json, tsconfig, tsup config, empty barrel
2. `styles.css` token layer
3. `pin-input.tsx` with all five states
4. `apps/site` scaffold, Next.js, imports the workspace package
5. Landing page with the shader background and a live pin input hero
6. Docs routes
7. Deploy to Vercel, point `yote.shatermt.com`
8. Only then: `input.tsx`, the text field

Do not start the text field until the pin input is finished and deployed. One
finished component beats two half-built ones.

---

## 5. Token layer

Names mirror the Figma variables one to one. All values are CSS custom properties.
Nothing in a component is hardcoded except layout structure.

```css
:root {
  --yote-bg-default: #ffffff;
  --yote-bg-surface: #f7f7f7;
  --yote-stroke-soft: rgba(0, 0, 0, 0.05);
  --yote-text-strong: #171717;
  --yote-text-sub: #5c5c5c;
  --yote-text-soft: #8a8a8a;

  --yote-feature-base: #7d52f4;
  --yote-feature-dark: #351a75;
  --yote-purple-alpha-24: rgba(125, 82, 244, 0.24);

  --yote-error-base: #fb3748;
  --yote-error-faint: #ffc0c5;

  --yote-radius-xl: 24px;
  --yote-shadow-xs: 0 2px 4px -1px rgba(0,0,0,0.02), 0 5px 13px -5px rgba(0,0,0,0.05);
  --yote-focus-active: 0 0 0 2px var(--yote-bg-default), 0 0 0 4px var(--yote-purple-alpha-24);
  --yote-focus-error:  0 0 0 2px var(--yote-bg-default), 0 0 0 4px var(--yote-error-faint);

  --yote-ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --yote-duration: 160ms;
}
```

Dark theme: override the same names under **both** `@media (prefers-color-scheme: dark)`
scoped as `:root:not([data-theme="light"])` **and** `:root[data-theme="dark"]`, so
system preference and an explicit attribute both work.

**The dark values have not been designed yet.** Whatever is in the prototype is a
placeholder derivation, not from the Figma file. Ask before treating them as final.

**Why not Tailwind classes in the components.** Shipping Tailwind classes inside an
npm package means inheriting the consumer's config, their version, their content
scanning and their purge setup. This is exactly why shadcn is copy-paste rather
than a package. Sonner, Vaul and Radix all ship plain CSS. So do we. **Zero
dependencies. Never add Tailwind as a dependency of `yote-ui`.**

---

## 6. Cascade layer, so Tailwind wins without `!important`

Wrap the entire stylesheet:

```css
@layer yote {
  /* everything */
}
```

Unlayered CSS beats layered CSS regardless of specificity, so any Tailwind
utility or consumer class overrides our base with no specificity fight.

Two rules that follow from this:

- **Single class selectors only.** No descendant chains like
  `.yote-pin[data-invalid] .yote-cell`. Put state attributes on the element that
  needs them so a single utility class can win.
- **Nothing marked `!important`, ever.**

For consumers on Tailwind v4, the docs get this snippet for exposing our tokens
as utilities:

```css
@theme {
  --color-yote-accent: var(--yote-feature-base);
}
```

**OPEN QUESTION: Tailwind v3 or v4?** The theming docs page differs between them.
v4 uses `@theme` and native layers, v3 needs a `tailwind.config.js` extension.
Ask before writing that page.

---

## 7. The digit input: exact design spec

Pulled from Figma file `Lg86E9AM1taQ7aZ57HHRVc`, nodes 6-4571, 6-4603, 6-4614,
6-4762, 6-4892. These values are measured, not estimated. Do not round them.

### Geometry

| Property | Value |
| --- | --- |
| Cell size | 87.5 × 66 px |
| Cell radius | 24px (`--yote-radius-xl`) |
| Gap between cells | 10px |
| Digit type | 30px, 38px line height, 0.3px tracking, centred |
| Digit colour | `--yote-text-strong` #171717 |

Four cells plus three 10px gaps comes to exactly **380px**, which is the same
width as the text field in Luotain. The 87.5 is a fit-to-380 value, not a round
number. Five and six cells keep the 87.5 cell and let the group grow to 477.5 and
575. (Open question below.)

### The five states

| State | Treatment |
| --- | --- |
| **Idle** | `bg-default` background, 1px `stroke-soft` border, `shadow-xs` |
| **Active** | 1.5px `feature-base` border, `focus-active` ring, **no** `shadow-xs`, caret visible |
| **Used** | Identical to idle plus the digit. No ring. This is a filled, unfocused field. |
| **Error** | 1px `error-base` border, `focus-error` ring, digits recoloured to `error-base` |
| **Disabled** | `bg-surface` background, **no border, no shadow**, digits transparent (hidden, not dimmed) |

### The caret

2px wide, 28px tall, 2px radius, `--yote-feature-dark` #351A75, centred in the
active cell. Blinks at 1.06s with `steps(1, end)` to match macOS. Not specified in
Figma; flagged as a proposal.

---

## 8. Architecture: one input, not one per cell

**This is the most important implementation decision in the component.**

The cells are presentation only. Underneath sits a single real `<input>`
absolutely positioned across the whole group, `opacity: 0`, with:

```jsx
<input
  type="text"
  inputMode="numeric"
  autoComplete="one-time-code"
  maxLength={length}
  aria-label="Verification code"
/>
```

Rendering one input per cell breaks three things that users notice:

1. Pasting a code from the clipboard
2. `autocomplete="one-time-code"`
3. The iOS and Android keyboard suggestion that fills the code straight from the
   SMS

Almost every hand-rolled OTP field gets this wrong. Do not refactor to
per-cell inputs for any reason.

Other required details:

- Caret always sits at the end. Active cell index is `min(value.length, length - 1)`
- Strip non-digits on input: `value.replace(/\D/g, '').slice(0, length)`
- The hidden input needs `font-size: 16px` so iOS does not zoom the viewport on focus
- `caret-color: transparent` and `color: transparent` on the real input

---

## 9. Universal prop contract

**These props behave identically on every component in the library.** This is the
whole point: someone learns the vocabulary once and every future component needs
no new learning. Define them as a shared TypeScript interface that each component
extends.

```ts
export interface YoteFieldProps {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void

  label?: React.ReactNode
  hint?: React.ReactNode
  error?: React.ReactNode

  invalid?: boolean
  errorKey?: string | number

  disabled?: boolean
  readOnly?: boolean
  size?: 'sm' | 'md' | 'lg'

  classNames?: Record<string, string>
  className?: string
  style?: React.CSSProperties
}
```

Plus native passthrough for `id`, `name`, `required`, `autoFocus` and the rest.

### Two conventions to hold across the entire library

**`onChange` receives the value, not the event.** Every component. Nobody should
have to remember which one hands them a synthetic event.

**`ref` always lands on the real underlying input**, never on a wrapper div, so
form libraries and focus management work without anyone reading the source.

### Semantics worth pinning down

- `error` implies `invalid` unless `invalid` explicitly says otherwise
- `errorKey` exists so the error animation replays when the same error fires
  twice. Without it, a second failed submit with an identical message does nothing
- `readOnly` reads as filled, not as disabled, and stays focusable
- `classNames` is a per-part object. A single `className` prop is useless the
  moment someone wants the cells a different size. Parts differ per component,
  the prop name does not

### Digit input specific props: only three

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `length` | `number` | `4` | Cell count, also sets `maxLength` |
| `onComplete` | `(value: string) => void` | — | Fires when the last cell fills |
| `mask` | `boolean` | `false` | Dots instead of digits, for PINs |

Parts for `classNames`: `root`, `cell`, `digit`, `caret`.

---

## 10. State attribute contract

Every component exposes state as data attributes on the DOM, so states can be
styled from outside without adding props. Same names on every component.

| Design state | Attribute | Sits on |
| --- | --- | --- |
| Idle | no attribute | — |
| Active | `data-active` | the focused cell |
| Used | `data-filled` | root and each filled cell |
| Error | `data-invalid` | root |
| Disabled | `data-disabled` | root |
| — | `data-focused`, `data-readonly`, `data-size` | root |

This is what makes the Tailwind story real:

```jsx
<PinInput classNames={{ cell: 'data-[active]:ring-4 data-[filled]:bg-neutral-50' }} />
```

---

## 11. Motion spec

Easing: `--yote-ease-out: cubic-bezier(0.23, 1, 0.32, 1)`. The built-in CSS
easings are too weak to read as intentional. **Never `ease-in` on UI.** It delays
the initial movement, which is the exact moment the user is watching.

| Element | Duration | Notes |
| --- | --- | --- |
| Border and background transitions | 160ms | `ease` |
| Focus ring fade | 160ms | `--yote-ease-out` |
| Digit entering a cell | 140ms | scale from 0.9 plus opacity |
| Error shake | 280ms | decaying amplitude |
| Caret blink | 1.06s | `steps(1, end)` |

Rules:

- **Never animate from `scale(0)`.** Nothing in the real world appears from
  nothing. Start at 0.9 with opacity.
- **Specify exact properties.** No `transition: all`.
- **Only animate `transform` and `opacity`** where possible. The focus ring is a
  pseudo element whose opacity transitions, not an animated `box-shadow` on the
  control, so the ring fades without repainting the field.
- **Shake stays under 300ms.** A rejected code should not feel slow.
- **Gate hover behind `@media (hover: hover) and (pointer: fine)`** so touch
  devices do not latch hover state after a tap.

### Reduced motion means gentler, not none

```css
@media (prefers-reduced-motion: reduce) { ... }
```

Drop positional motion: the shake becomes nothing, the digit scale becomes a
plain fade, the caret stops blinking and stays visible. **Keep** colour and
opacity changes, because those carry the error meaning.

### Replaying a keyframe animation in React

A single `requestAnimationFrame` gets batched and the keyframes never restart.
Two nested frames are required:

```js
setShaking(false)
requestAnimationFrame(() => {
  requestAnimationFrame(() => setShaking(true))
})
```

---

## 12. Bugs already found in the prototype, with their fixes

These are real and will recur. Treat them as standing rules.

### Baseline shift between states

`display: inline-flex` on the cell group caused the whole group to move
vertically when the first cell went from empty to filled. An inline-flex box
aligns on the baseline of its first flex item; an empty cell has no text so its
baseline falls at the bottom edge, and a filled cell's baseline is the digit's.

**Fix:** block-level `display: flex` with `width: fit-content`. No baseline to
align to. Put `line-height: 0` on the group and `line-height: 38px` on the digit
span.

### Border width change moving centred content

Active going from a 1px to a 1.5px border shrinks the content box by half a pixel
per side and nudges the centred digit.

**Fix:** hold the border at 1px in every state and supply the extra half pixel as
an inset ring:

```css
.yote-cell[data-active] {
  border-color: var(--yote-feature-base);
  box-shadow: inset 0 0 0 0.5px var(--yote-feature-base), var(--yote-focus-active);
}
```

General rule: **any state that changes `border-width` will shift layout.** Use
inset shadows instead.

### Reserve space for anything that appears

The docs code panel grew a line when a state added a prop, and the preview stage
gained a scrollbar at six cells. Both moved the page.

**Fix:** fixed heights on preview stages, `min-height` on code panels sized for
the longest variant, and `scrollbar-gutter: stable` on anything scrollable. Apply
the same thinking to the component's own error message slot, which otherwise
shifts the form when it appears.

---

## 13. Accessibility requirements

- Real `<label>` wired by `htmlFor` and a `useId` generated id
- `aria-describedby` pointing at the hint or the error, whichever is showing
- `aria-invalid` when invalid
- `aria-live="polite"` on the error message container, not `role="alert"`, which
  is too noisy on re-render
- `aria-busy` while loading
- `autoComplete="one-time-code"` and `inputMode="numeric"` on the pin input
- Action buttons keep real focus outlines via `:focus-visible`
- 16px minimum font size on inputs at coarse pointers, to prevent iOS zoom

---

## 14. The site

**One site, two halves.** This is a structural requirement, not a preference.

**Landing page (`/`).** The front door. Shader background, live interactive hero
with the pin input, state switcher, a short pitch, install command. You should be
able to play with the component without reading anything.

**Docs (`/docs/*`).** Everything reference-shaped: getting started, per component
pages with props tables, theming, accessibility, changelog. Sidebar navigation.

The existing prototype has these two mashed into one page, which is why it reads
wrong. Split them.

### Preview component

A reusable shell used on both halves:

- Large preview stage, fixed height, subtle dot grid background
- State pills above it (Idle / Active / Used / Error / Disabled) styled like the
  Sonner "Types" row, but with a much bigger stage
- Length pills (4 / 5 / 6)
- Code panel below with syntax highlighting and a copy button
- The code updates to reflect the selected state
- The preview is the **real component**, not a static mock per state. The pills
  seed a state; typing still works

There is a working reference implementation of all of this in the HTML prototype.
The CSS in it is correct against Figma and should be ported. The JavaScript is
vanilla throwaway and should be rewritten as React.

---

## 15. The shader background

Use the `PredictiveArc` component (Originkit WebGL shader, provided separately)
as the site background. Preset props are already tuned to the brand:

```js
{
  background: "#FFFFFF00",
  baseColor: "#7D52F4",
  accentColor: "#5F3DBF",
  highlight: "#7D52F4",
  density: 209,
  dotSize: 154,
  speed: 85,
  arch:    { peak: 100, falloff: 600, thickness: 206, archHeight: 0 },
  pointer: { radius: 236, enabled: true, strength: 34 }
}
```

Drop it at `apps/site/components/predictive-arc.tsx`. It already has `"use client"`,
and the WebGL init is inside `useEffect`, so App Router is fine without a dynamic
import.

### Five things that need fixing before it ships

**1. The background colour prop does not do what it looks like it does.**
`parseColor` reads only the first six hex digits, so `#FFFFFF00` becomes opaque
white, not transparent. The GL context is created with `alpha: false`, so the
canvas is always opaque. Pass the resolved page background explicitly and swap it
with the theme, or dark mode gets a white block. Alternatively switch to
`alpha: true` and a transparent clear colour, which is the cleaner fix if the
shader is meant to sit behind themed content.

**2. `minWidth: 1200, minHeight: 800` on the wrapper will force horizontal scroll
on mobile.** The `...style` spread comes last, so override with
`style={{ minWidth: 0, minHeight: 0 }}`.

**3. Pointer events.** The arc follows the cursor, which needs pointer events on
the wrapper, but a full-page fixed background with pointer events will swallow
clicks on the page. Either scope it to the hero section where the interaction is
a feature, or set `pointer-events: none` on the wrapper and track pointer
position on `window` instead.

**4. It runs `requestAnimationFrame` forever.** A full-screen shader behind docs
prose is bad for battery and bad for readability. Recommended: **hero only**, not
behind the docs pages. Also pause the loop when the tab is hidden
(`document.hidden`) and when the canvas scrolls out of view
(`IntersectionObserver`), and skip animation entirely under
`prefers-reduced-motion: reduce` by rendering a single frame.

**5. Strict TypeScript will reject two lines.** `hex[0] + hex[0] + ...` and
`m[0]` are possibly-undefined under `noUncheckedIndexedAccess`. Either guard them
or exempt this one file. Do not relax the flag repo-wide.

---

## 16. Package configuration

```json
{
  "name": "yote-ui",
  "type": "module",
  "sideEffects": ["**/*.css"],
  "files": ["dist"],
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./styles.css": "./dist/styles.css"
  },
  "peerDependencies": { "react": ">=18", "react-dom": ">=18" }
}
```

React and react-dom are **peer** dependencies, never real ones. Bundling React
creates a second copy of the hook dispatcher and breaks every hook call.

tsup emits ESM, CJS, types and sourcemaps, with `external: ['react', 'react-dom']`.
`src/styles.css` goes in as an entry with `loader: { '.css': 'copy' }`. If that
errors, fall back to `"build": "tsup && cp src/styles.css dist/styles.css"`.

**Styles ship on by default**, as a real stylesheet consumers import once:

```jsx
import { PinInput } from 'yote-ui'
import 'yote-ui/styles.css'
```

Sonner injects its CSS via a style tag for zero-import DX, which is better but
fights server rendering and makes override order hard to reason about. Revisit at
v0.2 once the visual language has settled.

---

## 17. Deploy

Separate Vercel project pointed at `apps/site`. Custom domain
`yote.shatermt.com` via a CNAME on the existing DNS. The portfolio at
`shatermt.com` stays on its own deploy and is not touched.

---

## 18. Open questions, do not guess

1. **Tailwind v3 or v4?** Blocks the theming docs page.
2. **Five and six cells:** keep the 87.5 cell and let the group grow to 477.5 and
   575, or hold 380 total and shrink the cell to 68 and 55.83? Current default is
   fixed cell.
3. **Error persistence:** does the error clear on the next keypress, or stay until
   the consumer clears it? Current behaviour is persist, with the shake replaying
   per failed attempt.
4. **Caret blink** at 1.06s, and **digit scale-in** from 0.9 over 140ms. Neither is
   in the Figma. Confirm or remove.
5. **Dark theme tokens** have not been designed. The prototype values are a
   derivation, not from the file.
6. **npm scope:** is `@yote/*` available? Changes the install string.

---

## 19. Explicitly out of scope for v0

Selects, comboboxes, date pickers, textareas, checkboxes, radios, file upload,
form state management, validation logic, masking and formatting for the text
field, and the compound `Input.Root` API. The compound API should be shaped by
real usage rather than guessed at.

A narrow library that is finished beats a broad one that is forty percent done.
