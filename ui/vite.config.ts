import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  envDir: '../',
  plugins: [vue(), vueJsx(), vueDevTools()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        bypass(req) {
          if (req.method === 'GET' && (!req.url || !req.url.startsWith('/auth/api'))) return '/index.html'
        },
      },
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
