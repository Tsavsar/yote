# Yöte

Form inputs for React. Styled and animated out of the box, with one prop
vocabulary shared by every field.

**Zero dependencies · 24KB gzipped · TypeScript**

From the Finnish *syöte*, input. Pronounced "yoat".

```bash
npm i yote-ui
```

```jsx
import { Input } from 'yote-ui'
import 'yote-ui/styles.css'

<Input label="Last name" hint="As it appears on your card." />
```

Documentation and live previews: **[yote.shatermt.com](https://yote.shatermt.com)**

## What is in it

| Component | |
| --- | --- |
| `Input` | One line, with room at either end for a mark or a text affix. |
| `PinInput` | One-time codes and PINs. Paste, autofill and the SMS suggestion all work. |
| `Textarea` | Multi-line entry with a counter, a drag handle and three sizes. |
| `PasswordInput` | Masked entry with a reveal toggle and a requirements block you define. |
| `PhoneInput` | A dialling country and a national number, kept as two values. |
| `SelectInput` | A field that is its own search. `InlineSelect` sits inside another field. |
| `TagsInput` | A list you build by typing, under the field or inside it. |
| `DateInput` | Typed, not picked. The field types the punctuation for you. |
| `CardInput` | Regroups itself as it recognises the card, and the mark changes with it. |

## One vocabulary

Every field takes the same props, so the second one you use needs no new
learning.

```ts
value  defaultValue  onChange       // onChange gives the value, never the event
label  hint  error  invalid  errorKey
disabled  readOnly  size            // 'sm' | 'md' | 'lg'
classNames  className  style        // classNames is per-part
```

`ref` always lands on the real underlying input, never on a wrapper, so form
libraries and focus management work without reading the source.

Every state is also a data attribute — `data-focused`, `data-filled`,
`data-invalid`, `data-disabled`, `data-size` — so you can style any of them
from outside without a prop:

```jsx
<PinInput classNames={{ cell: 'data-[active]:ring-4 data-[filled]:bg-neutral-50' }} />
```

## Stability

1.0 means the prop contract is settled. Every field takes the same props,
`onChange` gives the value, `ref` lands on the real input, and the state
attributes are part of the API — those will not change under you in a 1.x.

The scope is closed too, which is the other half of why this is 1.0 rather
than a long 0.x: there is no roadmap of features waiting to reshape the API,
because the things a field does are the things this does.

## Scope

**Yöte does fields.** Not form state, not validation logic, and not the things
that sit on top of a field rather than in it: there is a date field but no
calendar, a select field but no combobox library, a card field but no card
validator.

Validation state is accepted as a prop. The library renders your error and
never decides what one is. When a feature would need the library to hold
state, guess a locale, or decide whether something is correct, that is the
line — and it is there on purpose. A narrow library that is finished beats a
broad one that is forty percent done.

## Styling

All CSS lives in `@layer yote`. Unlayered CSS beats layered CSS regardless of
specificity, so your own classes win with no `!important` and no specificity
fight. On Tailwind v4, declare the layer order before importing anything:

```css
@layer theme, base, yote, components, utilities;
@import 'tailwindcss';
```

`yote` has to sit after `base`, because Tailwind's preflight resets form
controls, and before `utilities`, so your classes still override ours.

## Development

npm workspaces. The docs site imports the local package directly, so the two
cannot drift.

```bash
npm install
npm run -w yote-ui build
npm run -w site dev
```

## Licence

MIT. See [LICENSE](LICENSE). Third-party artwork is credited in
[NOTICE](packages/yote-ui/NOTICE).
