import { Install } from '../components/install'
import { Preview } from '../components/preview'
import { SiteNav } from '../components/site-nav'
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
            Every state designed, every transition tuned, every edge case handled. Install it and the
            field already feels right.
          </p>
        </section>

        <Install />

        <section className="showcase">
          <div className="showcase-head">
            <h2 className="showcase-title">Digit input</h2>
            <p className="showcase-note">Inputs for codes, keys, pins, passwords etcs</p>
          </div>
          <Preview />
        </section>

        <section className="showcase">
          <div className="showcase-head">
            <h2 className="showcase-title">Text area</h2>
            <p className="showcase-note">Multi-line entry, with a counter and a drag handle</p>
          </div>
          <TextareaPreview />
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
