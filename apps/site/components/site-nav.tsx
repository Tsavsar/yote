import Link from 'next/link'
import { GithubLink } from './github-link'
import { Logo } from './logo'
import { ThemeToggle } from './theme-toggle'

export function SiteNav() {
  return (
    <header className="nav">
      <Link className="wordmark" href="/" aria-label="Yöte, home">
        <Logo className="wordmark-mark" />
        <span>Yöte</span>
      </Link>
      <div className="nav-links">
        <Link className="nav-link" href="/docs">
          Docs
        </Link>
        <GithubLink />
        <ThemeToggle />
      </div>
    </header>
  )
}
