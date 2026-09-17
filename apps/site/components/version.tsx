import pkg from 'yote-ui/package.json'

/**
 * The published version, beside the wordmark.
 *
 * Read from the package rather than typed here, so it cannot claim a version
 * that was never released. It is a fact about the library, not a label, and
 * it is set in the same tabular figures the install block uses so the badge
 * does not change width between 0.9.9 and 0.10.0.
 */
export function Version() {
  return <span className="version">{pkg.version}</span>
}
