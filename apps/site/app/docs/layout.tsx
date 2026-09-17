import type { Metadata } from 'next'
import { DocsNav } from '../../components/docs-nav'
import { DocsPager } from '../../components/docs-pager'
import { GithubLink } from '../../components/github-link'
import { OnThisPage } from '../../components/on-this-page'

/*
 * No title here. A layout title wins over the pages beneath it, which is how
 * all thirteen docs routes came to share one. Each page sets its own now, and
 * the root template wraps it.
 */
export const metadata: Metadata = {
  description: 'Documentation for Yöte, form inputs for React.',
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="docs-shell">
      <DocsNav github={<GithubLink compact />} />
      <main className="docs-content">
        {children}
        <DocsPager />
      </main>
      <OnThisPage />
    </div>
  )
}
