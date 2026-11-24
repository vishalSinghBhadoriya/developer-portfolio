import process from 'node:process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'
import { staticRoutes } from './src/routePaths.js'

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
          this.emitFile({ type: 'asset', fileName: route.slice(1) + '/index.html', source: entry.source })
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
