import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  envDir: '../',
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['plain_logo.png', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Fincthub',
        short_name: 'Fincthub',
        description: 'Premium Personal Finance Manager',
        theme_color: '#3b82f6',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait-primary',
        categories: ['finance', 'productivity'],
        icons: [
          {
            src: 'plain_logo.png',
            sizes: '1024x1024',
            type: 'image/png'
          },
          {
            src: 'plain_logo.png',
            sizes: '1024x1024',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html',
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
      }
    })
  ],
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
