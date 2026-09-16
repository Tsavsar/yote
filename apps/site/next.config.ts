import path from 'node:path'
import type { NextConfig } from 'next'

const config: NextConfig = {
  /*
   * Pin the trace root to the monorepo.
   *
   * Next walks up looking for a lockfile to decide what to trace, and a stray
   * package-lock.json anywhere above the repo wins the guess. Saying it
   * outright keeps the file trace to this workspace, which is what the Vercel
   * project deploying apps/site needs.
   */
  outputFileTracingRoot: path.join(import.meta.dirname, '../..'),
}

export default config
