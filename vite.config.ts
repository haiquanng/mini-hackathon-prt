import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { brand } from './src/brand'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'prompt',
    includeAssets: ['icons/*.png', 'favicon.svg', 'images/*.webp', 'pets/boba/*'],
    manifest: {
      id: '/',
      name: brand.name,
      short_name: brand.shortName,
      description: brand.description,
      lang: 'vi',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      theme_color: brand.colors.background,
      background_color: brand.colors.background,
      icons: [
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    workbox: {
      maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      globPatterns: ['**/*.{js,css,html,webp,png,svg,woff2}'],
      cleanupOutdatedCaches: true,
      navigateFallback: '/index.html',
      navigateFallbackDenylist: [/^\/api\//],
    },
  })],
  server: { port: 5173, strictPort: true },
})
