import * as React from 'react'

/*
 * Declared rather than imported from @types/node. The package sets
 * `types: []` on purpose — a browser library has no business pulling ambient
 * Node globals — and this is the only Node-ish thing it touches. Every
 * bundler substitutes it, so the branch below is gone from a production
 * build along with everything it guards.
 */
declare const process: { env: { NODE_ENV?: string } }

const warned = new Set<string>()

/**
 * Warns, once per component, when a field is told it is both required and
 * optional.
 *
 * The two render together quite happily — an asterisk and "(Optional)" on the
 * same row — and say opposite things to the person reading the form. That is
 * a mistake in the calling code rather than a state worth supporting, so the
 * library says so instead of picking a winner. It does not throw: a
 * contradictory label should not take a checkout down.
 *
 * Development only. The whole block is removed from a production build, so
 * the check costs consumers nothing.
 */
export function useRequiredOptionalWarning(
  component: string,
  required: boolean,
  optional: boolean,
) {
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') return
    if (!required || !optional) return
    if (warned.has(component)) return
    warned.add(component)
    console.warn(
      `[yote] <${component}> was given both \`required\` and \`optional\`. ` +
        'They contradict each other: the field renders an asterisk and "(Optional)" ' +
        'side by side. Pick one.',
    )
  }, [component, required, optional])
}
