import * as React from 'react'
import type { YoteFieldProps } from './types'
import { useComposedRef } from './lib/use-composed-ref'
import { AlertIcon, EyeIcon, EyeOffIcon, InfoIcon, LockIcon, MetIcon, UnmetIcon } from './icons'

export type PasswordInputPart =
  | 'root'
  | 'label'
  | 'labelRow'
  | 'info'
  | 'field'
  | 'input'
  | 'lead'
  | 'reveal'
  | 'forgot'
  | 'requirements'
  | 'bar'
  | 'segment'
  | 'requirementsTitle'
  | 'requirement'
  | 'message'

/**
 * One rule the field reports on.
 *
 * `test` belongs to the consumer, not to Yöte. The library renders whether a
 * rule passes and counts how many do; it never decides what a good password
 * is. That is the same line the rest of the library holds — validation state
 * comes in as a prop, and this is the prop.
 */
export interface PasswordRequirement {
  label: string
  test: (value: string) => boolean
}

/**
 * The four from the Figma frame, exported so they can be spread, filtered or
 * replaced. They are a starting point, not a policy.
 */
export const DEFAULT_PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { label: 'At least 1 symbol', test: (v) => /[^\w\s]/.test(v) },
  { label: 'At least 1 uppercase', test: (v) => /[A-Z]/.test(v) },
  { label: 'At least 1 number', test: (v) => /\d/.test(v) },
  { label: 'At least 8 characters', test: (v) => v.length >= 8 },
]

type NativeInputProps = Omit<
  React.ComponentPropsWithoutRef<'input'>,
  'value' | 'defaultValue' | 'onChange' | 'className' | 'style' | 'children' | 'type' | 'size'
>

export interface PasswordInputProps extends YoteFieldProps<PasswordInputPart>, NativeInputProps {
  /** Rules to report on. Pass `[]` to hide the block entirely. */
  requirements?: PasswordRequirement[]
  /** Heading above the rules. */
  requirementsTitle?: React.ReactNode
  /** Show the strength bar and rule list. */
  showRequirements?: boolean
  /** Renders an info marker beside the label, with this as its tooltip. */
  info?: string
  /** Renders the "Forgot password" link under the field. */
  forgotHref?: string
  forgotLabel?: React.ReactNode
  /** Show the reveal toggle. */
  revealable?: boolean
}

function cx(...parts: Array<string | false | null | undefined>): string | undefined {
  const joined = parts.filter(Boolean).join(' ')
  return joined === '' ? undefined : joined
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    {
      value: valueProp,
      defaultValue,
      onChange,
      label = 'Password',
      hint,
      error,
      invalid,
      errorKey: _errorKey,
      disabled = false,
      readOnly = false,
      size = 'md',
      classNames,
      className,
      style,
      requirements = DEFAULT_PASSWORD_REQUIREMENTS,
      requirementsTitle = 'Must contain at least;',
      showRequirements = true,
      info,
      forgotHref,
      forgotLabel = 'Forgot password',
      revealable = true,
      id: idProp,
      placeholder,
      'aria-describedby': ariaDescribedByProp,
      onFocus,
      onBlur,
      ...rest
    },
    forwardedRef,
  ) {
    const innerRef = React.useRef<HTMLInputElement>(null)
    const composedRef = useComposedRef<HTMLInputElement>(innerRef, forwardedRef)

    const isControlled = valueProp !== undefined
    const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? '')
    const value = isControlled ? valueProp : uncontrolled

    const [focused, setFocused] = React.useState(false)
    const [revealed, setRevealed] = React.useState(false)

    const reactId = React.useId()
    const id = idProp ?? `yote-${reactId}`
    const messageId = `${id}-message`
    const reqId = `${id}-requirements`

    const isInvalid = invalid ?? Boolean(error)
    const showError = isInvalid && error != null && error !== false
    const message = showError ? error : hint

    // Evaluated on the consumer's own predicates — the library only counts.
    const results = React.useMemo(
      () => requirements.map((r) => ({ ...r, met: r.test(value) })),
      [requirements, value],
    )
    const metCount = results.filter((r) => r.met).length
    const total = results.length
    const hasRequirements = showRequirements && total > 0

    /*
     * Strength names the ramp rather than the count, so the bar keeps working
     * whether a consumer passes three rules or six:
     *
     *   none     nothing typed yet, every segment grey
     *   partial  anything from one rule to all-but-one, filled segments amber
     *   strong   every rule passes, the whole bar green
     *   invalid  the consumer says the entry is wrong
     *
     * `invalid` is checked first and colours the whole bar, not just the
     * filled segments — at zero there are none to recolour, and at four a
     * green bar over a red field claimed the entry was fine and wrong at the
     * same time.
     *
     * Disabled outranks both, in the stylesheet rather than here: the count
     * is still true, it just must not be reported as an achievement on a
     * field nobody can type into.
     */
    const strength = isInvalid
      ? 'invalid'
      : metCount === 0
        ? 'none'
        : metCount === total
          ? 'strong'
          : 'partial'

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const next = event.target.value
      if (!isControlled) setUncontrolled(next)
      onChange?.(next)
    }

    const describedBy = cx(
      ariaDescribedByProp,
      message != null ? messageId : undefined,
      hasRequirements ? reqId : undefined,
    )

    return (
      <div
        className={cx('yote-field', 'yote-pw', classNames?.root, className)}
        style={style}
        data-size={size}
        data-filled={value.length > 0 || undefined}
        data-focused={focused || undefined}
        data-invalid={isInvalid || undefined}
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
      >
        {label != null ? (
          <div className={cx('yote-label-row', classNames?.labelRow)}>
            <label htmlFor={id} className={cx('yote-label', classNames?.label)}>
              {label}
            </label>
            {info != null ? (
              <span
                className={cx('yote-info', classNames?.info)}
                title={info}
                role="img"
                aria-label={info}
              >
                <InfoIcon size={14} />
              </span>
            ) : null}
          </div>
        ) : null}

        <div
          className={cx('yote-pw-field', classNames?.field)}
          data-focused={focused || undefined}
          data-invalid={isInvalid || undefined}
          data-disabled={disabled || undefined}
        >
          <span className={cx('yote-pw-lead', classNames?.lead)} aria-hidden="true">
            <LockIcon />
          </span>

          <input
            {...rest}
            ref={composedRef}
            id={id}
            className={cx('yote-pw-input', classNames?.input)}
            type={revealed ? 'text' : 'password'}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            autoComplete="current-password"
            aria-invalid={isInvalid || undefined}
            aria-describedby={describedBy}
            onFocus={(event) => {
              setFocused(true)
              onFocus?.(event)
            }}
            onBlur={(event) => {
              setFocused(false)
              onBlur?.(event)
            }}
          />

          {revealable ? (
            <button
              type="button"
              className={cx('yote-pw-reveal', classNames?.reveal)}
              onClick={() => setRevealed((r) => !r)}
              disabled={disabled}
              // The control's own state, not a label for the field.
              aria-pressed={revealed}
              aria-label={revealed ? 'Hide password' : 'Show password'}
            >
              {revealed ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          ) : null}
        </div>

        {forgotHref != null ? (
          <a className={cx('yote-pw-forgot', classNames?.forgot)} href={forgotHref}>
            {forgotLabel}
          </a>
        ) : null}

        {hasRequirements ? (
          <div
            id={reqId}
            className={cx('yote-pw-req', classNames?.requirements)}
            data-strength={strength}
            data-disabled={disabled || undefined}
          >
            {/*
              The bar is decoration over the list below it — the list already
              says which rules pass, in text. Announcing both would read the
              same information twice.
            */}
            <div className={cx('yote-pw-bar', classNames?.bar)} aria-hidden="true">
              {results.map((r, i) => (
                <span
                  key={r.label}
                  className={cx('yote-pw-segment', classNames?.segment)}
                  data-filled={i < metCount || undefined}
                  data-disabled={disabled || undefined}
                />
              ))}
            </div>

            <p className={cx('yote-pw-req-title', classNames?.requirementsTitle)}>
              {requirementsTitle}
            </p>

            <ul className="yote-pw-req-list">
              {results.map((r) => (
                <li
                  key={r.label}
                  className={cx('yote-pw-req-item', classNames?.requirement)}
                  data-met={(r.met && !disabled) || undefined}
                  data-disabled={disabled || undefined}
                >
                  <span
                    className="yote-pw-req-icon"
                    data-met={(r.met && !disabled) || undefined}
                    data-invalid={isInvalid || undefined}
                    data-disabled={disabled || undefined}
                    aria-hidden="true"
                  >
                    {/*
                      Disabled never shows a tick. A greyed-out check still
                      says the rule was satisfied, on a field nobody can type
                      into — the neutral mark reads as "not evaluated", which
                      is what a disabled field actually means.
                    */}
                    {r.met && !disabled ? <MetIcon /> : <UnmetIcon />}
                  </span>
                  {/* The only part a screen reader needs: the rule and whether
                      it passes, as words. */}
                  <span className="yote-pw-req-label">{r.label}</span>
                  <span className="yote-sr-only">
                    {disabled ? ' — unavailable' : r.met ? ' — met' : ' — not met'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div
          id={messageId}
          className={cx('yote-message', classNames?.message)}
          data-invalid={showError || undefined}
          data-disabled={disabled || undefined}
          aria-live="polite"
        >
          {message != null ? (
            showError ? (
              <AlertIcon />
            ) : (
              <span className="yote-message-icon yote-message-icon-sm">
                <InfoIcon size={16} />
              </span>
            )
          ) : null}
          {message != null ? <span className="yote-message-text">{message}</span> : null}
        </div>
      </div>
    )
  },
)

PasswordInput.displayName = 'PasswordInput'
