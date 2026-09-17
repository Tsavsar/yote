import { Install } from '../components/install'
import { InputPreview } from '../components/input-preview'
import { PasswordPreview } from '../components/password-preview'
import { PhonePreview } from '../components/phone-preview'
import { Preview } from '../components/preview'
import { SiteNav } from '../components/site-nav'
import { SelectPreview } from '../components/select-preview'
import { TagsPreview } from '../components/tags-preview'
import { TextareaPreview } from '../components/textarea-preview'

/**
 * Home, Figma node 2:3.
 *
 * A 650px column: nav, a 30px lead, the install block, then one section per
 * component. The design frame only shows the digit input — the text area
 * follows it in the identical pattern, because it ships too.
 */
export default function LandingPage() {
  return (
    <>
      <SiteNav />

      <main className="page">
        <section className="hero">
          <h1 className="headline">input components for React.</h1>
          <p className="lede">
            Every state designed, every transition tuned, every edge case handled. Install it and
            the field already feels right.
          </p>
        </section>

        <Install />

        <section className="showcase">
          <InputPreview
            title="Text input"
            description="One line, with room at either end for a mark or an affix"
          />
        </section>

        <section className="showcase">
          <Preview title="Digit input" description="Inputs for codes, keys, pins, passwords etcs" />
        </section>

        <section className="showcase">
          <TextareaPreview
            title="Text area"
            description="Multi-line entry, with a counter and a drag handle"
          />
        </section>

        <section className="showcase">
          <PasswordPreview
            title="Password"
            description="Masked entry, with a reveal toggle and live requirements"
          />
        </section>

        <section className="showcase">
          <PhonePreview
            title="Phone number"
            description="A dialling country and a national number, in one field"
          />
        </section>

        <section className="showcase">
          <div className="showcase-head">
            <div className="showcase-text">
              <h2 className="showcase-title">Select</h2>
              <p className="showcase-note">
                A field that is its own search, and a small inline one
              </p>
            </div>
          </div>
          <SelectPreview />
        </section>

        <section className="showcase">
          <div className="showcase-head">
            <div className="showcase-text">
              <h2 className="showcase-title">Tags</h2>
              <p className="showcase-note">
                A list you build by typing, inside the field or under it
              </p>
            </div>
          </div>
          <TagsPreview />
        </section>
      </main>

      <footer className="footer">
        <span>
          Yöte — from the Finnish <em>syöte</em>, input.
        </span>
      </footer>
    </>
  )
}
