import * as React from 'react'
import type { YoteFieldProps } from './types'
import { useComposedRef } from './lib/use-composed-ref'
import { useRequiredOptionalWarning } from './lib/warn-exclusive'
import { AlertIcon, CloseIcon, InfoIcon } from './icons'

export type TagsInputPart =
  | 'root'
  | 'label'
  | 'labelRow'
  | 'required'
  | 'optional'
  | 'info'
  | 'field'
  | 'leading'
  | 'trailing'
  | 'input'
  | 'tags'
  | 'tag'
  | 'tagLabel'
  | 'tagRemove'
  | 'message'

type NativeInputProps = Omit<
  React.ComponentPropsWithoutRef<'input'>,
  'value' | 'defaultValue' | 'onChange' | 'className' | 'style' | 'children' | 'size'
>

export interface TagsInputProps
  extends
    Omit<YoteFieldProps<TagsInputPart>, 'value' | 'defaultValue' | 'onChange'>,
    NativeInputProps {
  /** The tags themselves. Controlled alongside `onChange`. */
  value?: string[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void

  /**
   * Where the tags sit. `outside` is the frame (6:4209): a row under the
   * field. `inside` puts them in the box ahead of the caret.
   */
  tagsPosition?: 'outside' | 'inside'

  /** Text in the field, if you want to drive it. */
  inputValue?: string
  onInputValueChange?: (value: string) => void

  /** Keys that turn the typed text into a tag. Enter always does. */
  commitKeys?: string[]
  /** Refuse a tag. Return false and the text stays in the field. */
  validate?: (tag: string, tags: string[]) => boolean
  maxTags?: number

  leading?: React.ReactNode
  trailing?: React.ReactNode
  required?: boolean
  optional?: boolean
  info?: string
  removeLabel?: (tag: string) => string
  /** Accessible name for the list of tags. */
  listLabel?: string
}

function cx(...parts: Array<string | false | null | undefined>): string | undefined {
  const joined = parts.filter(Boolean).join(' ')
  return joined === '' ? undefined : joined
}

/**
 * A field that collects a list. Figma node 6:4209.
 *
 * Two placements, because they are two different jobs rather than a taste
 * setting. `outside` is what the frame draws: the field keeps one line
 * forever and the list grows downward, so a form with twenty tags in it does
 * not reflow every time you add one. `inside` puts the tags ahead of the
 * caret, which reads as "these are the value" and is right when there will be
 * three of them, not thirty.
 *
 * Backspace on an empty field removes the last tag — the one behaviour
 * everybody tries and most implementations miss.
 */
export const TagsInput = React.forwardRef<HTMLInputElement, TagsInputProps>(function TagsInput(
  {
    value: valueProp,
    defaultValue,
    onChange,
    label,
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
    tagsPosition = 'outside',
    inputValue: inputValueProp,
    onInputValueChange,
    commitKeys = ['Enter', ','],
    validate,
    maxTags,
    leading,
    trailing,
    required = false,
    optional = false,
    info,
    removeLabel = (tag) => `Remove ${tag}`,
    listLabel = 'Selected',
    id: idProp,
    placeholder = 'Add a tag',
    'aria-describedby': ariaDescribedByProp,
    onFocus,
    onBlur,
    onKeyDown,
    ...rest
  },
  forwardedRef,
) {
  const innerRef = React.useRef<HTMLInputElement>(null)
  const composedRef = useComposedRef<HTMLInputElement>(innerRef, forwardedRef)

  const isControlled = valueProp !== undefined
  const [uncontrolled, setUncontrolled] = React.useState<string[]>(defaultValue ?? [])
  const tags = isControlled ? valueProp : uncontrolled

  const textControlled = inputValueProp !== undefined
  const [ownText, setOwnText] = React.useState('')
  const text = textControlled ? inputValueProp : ownText

  const [focused, setFocused] = React.useState(false)

  useRequiredOptionalWarning('TagsInput', required, optional)

  /*
   * What just happened to the list, announced.
   *
   * Adding a tag is otherwise silent: the text leaves the field and a chip
   * appears somewhere a screen reader is not looking. The message row cannot
   * carry this, because it holds the hint and overwriting it would trade one
   * piece of information for another. So this is its own polite region,
   * visually hidden and empty until something changes.
   */
  const [announcement, setAnnouncement] = React.useState('')

  const reactId = React.useId()
  const id = idProp ?? `yote-${reactId}`
  const messageId = `${id}-message`
  const listId = `${id}-tags`

  const isInvalid = invalid ?? Boolean(error)
  const showError = isInvalid && error != null && error !== false
  const message = showError ? error : hint

  const setText = (next: string) => {
    if (!textControlled) setOwnText(next)
    onInputValueChange?.(next)
  }

  const setTags = (next: string[]) => {
    if (!isControlled) setUncontrolled(next)
    onChange?.(next)
  }

  const addTag = (raw: string) => {
    const tag = raw.trim()
    if (tag === '') return
    if (tags.includes(tag)) {
      setText('')
      return
    }
    if (maxTags !== undefined && tags.length >= maxTags) return
    if (validate !== undefined && !validate(tag, tags)) return
    setTags([...tags, tag])
    setText('')
    setAnnouncement(`${tag} added, ${tags.length + 1} total`)
  }

  const removeAt = (index: number) => {
    const tag = tags[index]
    setTags(tags.filter((_, i) => i !== index))
    if (tag !== undefined) setAnnouncement(`${tag} removed, ${tags.length - 1} total`)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || disabled || readOnly) return

    if (commitKeys.includes(event.key)) {
      event.preventDefault()
      addTag(text)
      return
    }
    /*
     * Backspace into an empty field takes the last tag. Guarded on the field
     * being empty, so it never eats a tag while you are still typing one.
     */
    if (event.key === 'Backspace' && text === '' && tags.length > 0) {
      event.preventDefault()
      removeAt(tags.length - 1)
    }
  }

  const describedBy = cx(ariaDescribedByProp, message != null ? messageId : undefined)

  const tagList = tags.map((tag, index) => (
    <li key={tag} className={cx('yote-tag', classNames?.tag)} data-disabled={disabled || undefined}>
      <span className={cx('yote-tag-label', classNames?.tagLabel)}>{tag}</span>
      {readOnly ? null : (
        <button
          type="button"
          className={cx('yote-tag-remove', classNames?.tagRemove)}
          onClick={() => removeAt(index)}
          disabled={disabled}
          aria-label={removeLabel(tag)}
          /* Keeps focus in the field, so removing three tags in a row does
             not require clicking back into it each time. */
          onPointerDown={(event) => event.preventDefault()}
        >
          <CloseIcon />
        </button>
      )}
    </li>
  ))

  return (
    <div
      className={cx('yote-field', 'yote-input', 'yote-tags', classNames?.root, className)}
      style={style}
      data-size={size}
      data-tags={tagsPosition}
      data-filled={tags.length > 0 || undefined}
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
          {required ? (
            <span className={cx('yote-required', classNames?.required)} aria-hidden="true">
              *
            </span>
          ) : null}
          {optional ? (
            <span className={cx('yote-optional', classNames?.optional)}>(Optional)</span>
          ) : null}
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
        className={cx('yote-input-field', classNames?.field)}
        data-size={size}
        data-tags={tagsPosition}
        data-focused={focused || undefined}
        data-invalid={isInvalid || undefined}
        data-disabled={disabled || undefined}
        onPointerDown={(event) => {
          if (event.target === event.currentTarget && !disabled) {
            event.preventDefault()
            innerRef.current?.focus()
          }
        }}
      >
        {leading != null ? (
          <span className={cx('yote-input-icon', classNames?.leading)} aria-hidden="true">
            {leading}
          </span>
        ) : null}

        {tagsPosition === 'inside' && tags.length > 0 ? (
          <ul id={listId} className={cx('yote-tag-list', classNames?.tags)} aria-label={listLabel}>
            {tagList}
          </ul>
        ) : null}

        <input
          {...rest}
          ref={composedRef}
          id={id}
          className={cx('yote-input-control', classNames?.input)}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={(event) => {
            setFocused(false)
            /* Leaving the field commits what is in it. Losing a half-typed
               tag to a click elsewhere is the most annoying possible bug. */
            addTag(text)
            onBlur?.(event)
          }}
          placeholder={tags.length > 0 && tagsPosition === 'inside' ? '' : placeholder}
          disabled={disabled}
          readOnly={readOnly}
          aria-required={required || undefined}
          aria-invalid={isInvalid || undefined}
          aria-describedby={describedBy}
          /* So the field reports how many are already in it before you type. */
          aria-owns={tags.length > 0 ? listId : undefined}
          onFocus={(event) => {
            setFocused(true)
            onFocus?.(event)
          }}
        />

        {trailing != null ? (
          <span className={cx('yote-input-icon', classNames?.trailing)}>{trailing}</span>
        ) : null}
      </div>

      {tagsPosition === 'outside' && tags.length > 0 ? (
        <ul
          id={listId}
          className={cx('yote-tag-row', 'yote-tag-list', classNames?.tags)}
          aria-label={listLabel}
        >
          {tagList}
        </ul>
      ) : null}

      <span className="yote-sr-only" aria-live="polite">
        {announcement}
      </span>

      <div
        id={messageId}
        className={cx('yote-message', classNames?.message)}
        data-invalid={showError || undefined}
        data-disabled={disabled || undefined}
        aria-live="polite"
      >
        {message != null ? (
          showError ? (
            <AlertIcon size={14} />
          ) : (
            <span className="yote-message-icon yote-message-icon-sm">
              <InfoIcon size={14} />
            </span>
          )
        ) : null}
        {message != null ? <span className="yote-message-text">{message}</span> : null}
      </div>
    </div>
  )
})

TagsInput.displayName = 'TagsInput'
