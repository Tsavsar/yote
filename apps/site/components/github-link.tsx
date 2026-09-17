const REPO = 'Tsavsar/yote'

/**
 * Star count, fetched on the server and revalidated hourly.
 *
 * Unauthenticated, so no token to leak and no client JavaScript. Every
 * failure path returns null and the link simply renders without a number:
 * the repo not existing yet, the API rate limiting the build, the network
 * being down. A star count is decoration — it must never be able to take the
 * page down with it.
 */
async function getStarCount(): Promise<number | null> {
  /*
   * Skipped in development. `revalidate` is a production cache directive, so
   * `next dev` refetches on every render — which rate-limits the
   * unauthenticated API within minutes and fills the console with 429s that
   * look like a bug in the page. Production still gets one call an hour.
   */
  if (process.env.NODE_ENV === 'development') return null

  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}`, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    const data: unknown = await res.json()
    const count = (data as { stargazers_count?: unknown }).stargazers_count
    return typeof count === 'number' ? count : null
  } catch {
    return null
  }
}

/** 1240 -> "1.2k". Keeps the nav from reflowing once it takes off. */
function format(count: number): string {
  if (count < 1000) return String(count)
  const k = count / 1000
  return `${k >= 10 ? Math.round(k) : k.toFixed(1)}k`
}

/**
 * `compact` is the docs sidebar's version: the mark alone, no word and no
 * count. The sidebar is 216px of quiet link text and a labelled button with a
 * number in it was the loudest thing on the column.
 */
export async function GithubLink({ compact = false }: { compact?: boolean }) {
  const stars = compact ? null : await getStarCount()

  return (
    <a
      className={compact ? 'nav-icon-button' : 'nav-link nav-link-github'}
      href={`https://github.com/${REPO}`}
      aria-label={compact ? 'GitHub repository' : undefined}
    >
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className={compact ? 'icon icon-lg' : 'icon'}
        fill="currentColor"
      >
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
      </svg>
      {compact ? null : <span className="nav-link-label">GitHub</span>}
      {stars !== null ? <span className="star-count">{format(stars)}</span> : null}
    </a>
  )
}
