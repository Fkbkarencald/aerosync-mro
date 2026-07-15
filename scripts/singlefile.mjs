/**
 * Packages the built preview (dist/) into one self-contained HTML file
 * so the design preview can be shared/clicked-through from any static
 * host. Inlines the JS bundle, CSS and self-hosted fonts (base64).
 *
 * Usage:
 *   VITE_ROUTER=hash npx vite build
 *   node scripts/singlefile.mjs   → dist/aerosync-mro-preview.html
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'

const dist = resolve(process.cwd(), 'dist')
const htmlPath = join(dist, 'index.html')
if (!existsSync(htmlPath)) {
  console.error('dist/index.html not found — run the build first')
  process.exit(1)
}

let html = readFileSync(htmlPath, 'utf8')

// Inline stylesheet(s), embedding font files as data URIs.
html = html.replace(
  /<link rel="stylesheet"[^>]*href="\/(assets\/[^"]+\.css)"[^>]*>/g,
  (_m, cssFile) => {
    let css = readFileSync(join(dist, cssFile), 'utf8')
    css = css.replace(/url\((\/assets\/[^)]+?\.(woff2|woff))\)/g, (_m2, fontPath, ext) => {
      const data = readFileSync(join(dist, fontPath.slice(1))).toString('base64')
      const mime = ext === 'woff2' ? 'font/woff2' : 'font/woff'
      return `url(data:${mime};base64,${data})`
    })
    return `<style>\n${css}\n</style>`
  },
)

// Inline the module bundle.
html = html.replace(
  /<script type="module"[^>]*src="\/(assets\/[^"]+\.js)"[^>]*><\/script>/g,
  (_m, jsFile) => {
    const js = readFileSync(join(dist, jsFile), 'utf8')
    return `<script type="module">\n${js}\n</script>`
  },
)

// Inline the favicon.
html = html.replace(/<link rel="icon"[^>]*>/, () => {
  const svg = readFileSync(resolve(process.cwd(), 'public/favicon.svg')).toString('base64')
  return `<link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,${svg}" />`
})

const out = join(dist, 'aerosync-mro-preview.html')
writeFileSync(out, html)
console.log(`Wrote ${out} (${(html.length / 1024 / 1024).toFixed(2)} MB)`)
