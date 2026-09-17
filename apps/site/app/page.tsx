import { Reveal } from '../components/reveal'
import { Install } from '../components/install'
import { LAST_UPDATED } from '../components/site-meta'
import { InputPreview } from '../components/input-preview'
import { CardPreview } from '../components/card-preview'
import { DatePreview } from '../components/date-preview'
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

        <Reveal>
          <InputPreview
            title="Text input"
            description="One line, with room at either end for a mark or an affix"
          />
        </Reveal>

        <Reveal>
          <Preview title="Digit input" description="One-time codes and PINs, one cell at a time" />
        </Reveal>

        <Reveal>
          <TextareaPreview
            title="Text area"
            description="Multi-line entry, with a counter and a drag handle"
          />
        </Reveal>

        <Reveal>
          <PasswordPreview
            title="Password"
            description="Masked entry, with a reveal toggle and live requirements"
          />
        </Reveal>

        <Reveal>
          <PhonePreview
            title="Phone number"
            description="A dialling country and a national number, in one field"
          />
        </Reveal>

        <Reveal>
          <div className="showcase-head">
            <div className="showcase-text">
              <h2 className="showcase-title">Select</h2>
              <p className="showcase-note">
                A field that is its own search, and a small inline one
              </p>
            </div>
          </div>
          <SelectPreview />
        </Reveal>

        <Reveal>
          <DatePreview title="Date" description="Typed, not picked. The field types the slashes" />
        </Reveal>

        <Reveal>
          <CardPreview
            title="Card number"
            description="Regroups itself as it recognises the card"
          />
        </Reveal>

        <Reveal>
          <div className="showcase-head">
            <div className="showcase-text">
              <h2 className="showcase-title">Tags</h2>
              <p className="showcase-note">
                A list you build by typing, inside the field or under it
              </p>
            </div>
          </div>
          <TagsPreview />
        </Reveal>
      </main>

      <footer className="footer">
        <span>
          Yöte by{' '}
          <a className="footer-link" href="https://shatermt.com">
            Tsavsar
          </a>
        </span>
        {/*
         * The commit date, stamped at build time. `dateTime` carries the full
         * timestamp for anything reading the page, while the text stays the
         * short form a person actually wants.
         */}
        <time className="footer-stamp" dateTime={LAST_UPDATED}>
          Updated{' '}
          {new Date(LAST_UPDATED).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </time>
      </footer>
    </>
  )
}
