/**
 * Digit masking, shared by the date and card fields.
 *
 * A pattern is a string where `0` is a slot a digit goes into and everything
 * else is a literal the field types for you: `00/00/0000`, `0000 0000 0000
 * 0000`. Only digits are kept from the input, so pasting "12.03.2026" or
 * "4242-4242-4242-4242" lands correctly without the consumer writing a
 * parser.
 *
 * Literals are only ever appended behind a digit, never ahead of the caret.
 * A field that shows "12/" before you have typed the month puts your caret
 * behind punctuation you did not ask for, and every backspace then has to
 * step over it.
 */
export function applyMask(raw: string, pattern: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits === '') return ''

  let out = ''
  let index = 0

  for (const token of pattern) {
    if (index >= digits.length) break
    if (token === '0') {
      out += digits[index]
      index += 1
    } else {
      out += token
    }
  }
  return out
}

/** How many digit slots a pattern has, for `maxLength` and completeness. */
export function slotCount(pattern: string): number {
  let count = 0
  for (const token of pattern) if (token === '0') count += 1
  return count
}

/** Just the digits, for a consumer that wants the value without the dressing. */
export function digitsOf(value: string): string {
  return value.replace(/\D/g, '')
}
