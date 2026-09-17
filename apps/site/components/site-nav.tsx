import Link from 'next/link'
import { GithubLink } from './github-link'
import { Logo } from './logo'
import { Search } from './search'
import { ThemeToggle } from './theme-toggle'
import { Version } from './version'

export function SiteNav() {
  return (
    <header className="nav">
      <div className="wordmark-row">
        <Link className="wordmark" href="/" aria-label="Yöte, home">
          <Logo className="wordmark-mark" />
          <span>Yöte</span>
        </Link>
        <Version />
      </div>
      <div className="nav-links">
        {/* No button here, but ⌘K still opens it. */}
        <Search trigger={false} />
        <Link className="nav-link" href="/docs">
          Docs
        </Link>
        <GithubLink />
        <ThemeToggle />
      </div>
    </header>
  )
}
