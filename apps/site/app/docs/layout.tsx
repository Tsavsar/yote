import type { Metadata } from 'next'
import { DocsNav } from '../../components/docs-nav'
import { GithubLink } from '../../components/github-link'
import { OnThisPage } from '../../components/on-this-page'

export const metadata: Metadata = {
  title: 'Yöte — Docs',
  description: 'Documentation for Yöte, form inputs for React.',
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="docs-shell">
      <DocsNav github={<GithubLink compact />} />
      <main className="docs-content">{children}</main>
      <OnThisPage />
    </div>
  )
}
