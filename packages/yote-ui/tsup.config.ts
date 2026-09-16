import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/styles.css'],
  format: ['esm', 'cjs'],
  dts: { entry: 'src/index.ts' },
  sourcemap: true,
  clean: true,
  // Rollup drops module-level directives, which silently strips the
  // "use client" banner below. One component; treeshaking buys nothing.
  treeshake: false,
  external: ['react', 'react-dom'],
  loader: { '.css': 'copy' },
  // React Server Components: consumers on Next.js App Router import this from
  // server files, so every JS output has to carry the directive.
  banner: { js: '"use client";' },
})
