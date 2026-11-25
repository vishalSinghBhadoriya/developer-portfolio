import process from 'node:process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'
import { featuredProjects } from './src/featuredProjects.js'
import { staticRoutes, workPath } from './src/routePaths.js'

const featuredRoutes = new Map(featuredProjects.map(project => [workPath(project.slug), project]))
const htmlEntities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }
const escapeHtml = value => value.replace(/[&<>"]/g, character => htmlEntities[character])

function projectHtml(html, project) {
  const title = escapeHtml(project.name + ' | Vishal Bhadoriya')
  const description = escapeHtml(project.summary)
  return html
    .replace(/<title>[^<]*<\/title>/, () => '<title>' + title + '</title>')
    .replace(/(<meta property="og:title" content=")[^"]*/, (_, start) => start + title)
    .replace(/(<meta (?:name="description"|property="og:description") content=")[^"]*/g, (_, start) => start + description)
}

function staticRouteEntries() {
  return {
    name: 'static-route-entries',
    apply: 'build',
    generateBundle: {
      order: 'post',
      handler(_, bundle) {
        const entry = bundle['index.html']
        if (entry?.type !== 'asset') this.error('The application HTML is missing.')
        for (const route of staticRoutes) {
          const project = featuredRoutes.get(route)
          const source = project ? projectHtml(String(entry.source), project) : entry.source
          this.emitFile({ type: 'asset', fileName: route.slice(1) + '/index.html', source })
        }
        this.emitFile({ type: 'asset', fileName: '404.html', source: entry.source })
      },
    },
  }
}

export default defineConfig({
  base: process.env.VERCEL ? '/' : '/developer-portfolio/',
  plugins: [react(), tailwind(), staticRouteEntries()],
  build: {
    rollupOptions: {
      output: {
        onlyExplicitManualChunks: true,
        manualChunks(id) {
          if (/\/node_modules\/(gsap|lenis)\//.test(id)) return 'scroll'
          if (id.endsWith('/three/build/three.core.js')) return 'three-core'
          if (id.endsWith('/three/build/three.module.js')) return 'three-renderer'
        },
      },
    },
  },
})
