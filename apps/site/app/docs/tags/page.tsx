import { CodeBlock } from '../../../components/code-block'
import { PropsTable, SHARED_PROPS } from '../../../components/props-table'
import { TagsPreview } from '../../../components/tags-preview'

const OWN_PROPS = [
  ['value', 'string[]', '—', 'The tags, controlled. `onChange` gives the next array.'],
  ['defaultValue', 'string[]', '[]', 'The tags, uncontrolled.'],
  ['tagsPosition', "'outside' | 'inside'", "'outside'", 'Where the tags sit.'],
  ['inputValue', 'string', '—', 'The text in the field, if you want to drive it.'],
  ['onInputValueChange', '(value: string) => void', '—', 'Fires as that text changes.'],
  ['commitKeys', 'string[]', "['Enter', ',']", 'Keys that turn the text into a tag.'],
  ['validate', '(tag, tags) => boolean', '—', 'Return false and the text stays in the field.'],
  ['maxTags', 'number', '—', 'Stops accepting past this many.'],
  [
    'removeLabel',
    '(tag: string) => string',
    '"Remove {tag}"',
    'Accessible name for each remove button.',
  ],
]

const PLACEMENTS = [
  ['outside', 'A row under the field', 'Figma 6:4209. The field keeps one line forever.'],
  [
    'inside',
    'Ahead of the caret',
    'Reads as "these are the value". The field grows a line at a time.',
  ],
]

export default function TagsDocsPage() {
  return (
    <>
      <h1 className="docs-title">Tags</h1>
      <p className="docs-lede">
        A field that collects a list. Type, press Enter, and the text becomes a tag you can remove.
      </p>

      <TagsPreview />

      <h2 id="placement" className="docs-h2">
        Two placements
      </h2>
      <p className="docs-p">
        Not a taste setting: they are two different jobs. Outside is what the design draws: the
        field stays one line forever and the list grows downward, so a form holding twenty tags does
        not reflow every time you add one. Inside puts them ahead of the caret, which reads as
        &ldquo;these are the value&rdquo; and is right when there will be three of them, not thirty.
      </p>
      <PropsTable head={['tagsPosition', 'Where', 'Why']} rows={PLACEMENTS} />

      <h2 id="editing" className="docs-h2">
        Adding and removing
      </h2>
      <p className="docs-p">
        Enter or a comma commits; <code className="inline-code">commitKeys</code> changes that.
        Leaving the field commits too, because losing a half-typed tag to a click elsewhere is the
        most annoying bug this component can have. Backspace on an empty field removes the last tag
        , the one behaviour everybody tries and most implementations miss, and it is guarded on the
        field being empty so it never eats a tag while you are still typing one.
      </p>
      <p className="docs-p">
        Duplicates are dropped silently rather than rejected loudly: you typed something already in
        the list, the list is already correct.
      </p>
      <CodeBlock
        filename="recipe-form.tsx"
        code={`const [ingredients, setIngredients] = useState<string[]>([])

<TagsInput
  label="Ingredients"
  value={ingredients}
  onChange={setIngredients}
  validate={(tag) => tag.length <= 24}
  maxTags={12}
/>`}
      />

      <h2 id="props" className="docs-h2">
        Props
      </h2>
      <PropsTable head={['Prop', 'Type', 'Default', 'Notes']} rows={OWN_PROPS} />

      <h3 className="docs-h3">Shared</h3>
      <p className="docs-p">
        The same contract as every other field, with one difference:{' '}
        <code className="inline-code">value</code> is a{' '}
        <code className="inline-code">string[]</code> rather than a{' '}
        <code className="inline-code">string</code>, because the value of this field is a list.
      </p>
      <PropsTable head={['Prop', 'Type', 'Default', 'Notes']} rows={SHARED_PROPS} />
    </>
  )
}
