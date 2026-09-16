import type { Metadata } from 'next'
import { DocsNav } from '../../components/docs-nav'
import { OnThisPage } from '../../components/on-this-page'

export const metadata: Metadata = {
  title: 'Yöte — Docs',
  description: 'Documentation for Yöte, form inputs for React.',
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="docs-shell">
      <DocsNav />
      <main className="docs-content">{children}</main>
      <OnThisPage />
    </div>
  )
}
