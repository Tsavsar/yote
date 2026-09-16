export function PropsTable({ rows, head }: { rows: string[][]; head: string[] }) {
  return (
    <div className="table-wrap">
      <table className="props">
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, i) => (
                <td key={i}>{i === 0 ? <code className="inline-code">{cell}</code> : cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** The universal contract. Every field in the library takes these. */
export const SHARED_PROPS = [
  ['value', 'string', '—', 'Controlled value.'],
  ['defaultValue', 'string', '—', 'Initial value when uncontrolled.'],
  ['onChange', '(value: string) => void', '—', 'Receives the value, never the event.'],
  ['label', 'ReactNode', '—', 'Rendered as a real <label> wired by htmlFor.'],
  ['hint', 'ReactNode', '—', 'Helper text under the field.'],
  ['error', 'ReactNode', '—', 'Error text. Implies invalid unless invalid says otherwise.'],
  ['invalid', 'boolean', '—', 'Forces the error styling on or off.'],
  ['errorKey', 'string | number', '—', 'Change it to replay the error animation.'],
  ['disabled', 'boolean', 'false', 'Greys the field out.'],
  ['readOnly', 'boolean', 'false', 'Reads as filled, stays focusable.'],
  ['size', "'sm' | 'md' | 'lg'", "'md'", 'Size scale, where the component defines one.'],
  ['classNames', 'Record<Part, string>', '—', 'Per-part class names.'],
]
