import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true, // Lắng nghe trên 0.0.0.0 để điện thoại cùng mạng Wi-Fi truy cập được
    port: 5173,
    cors: true,
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.jpg'],
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg,webmanifest}'],
        // Không cho SW can thiệp vào URL xác thực và API Supabase
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [
          /^\/auth/,
          /supabase/,
          /\/rest\/v1\//,
          /\/auth\/v1\//,
          /\.supabase\.co/,
        ],
        runtimeCaching: [
          {
            // Tất cả request tới Supabase phải luôn đi qua network, không cache
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkOnly',
          },
          {
            // Các font/image từ CDN thì cache lại cho nhanh
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 năm
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: false, // Tắt service worker ở môi trường dev để tránh kẹt cache trên mobile
      },
      manifest: {
        name: 'Family Finance Manager',
        short_name: 'Thu Chi Gia Đình',
        description: 'Ứng dụng quản lý tài chính thu chi gia đình',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: 'logo.jpg',
            sizes: '192x192',
            type: 'image/jpeg',
            purpose: 'any maskable'
          },
          {
            src: 'logo.jpg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  css: {
    postcss: {}
  },
  build: {
    chunkSizeWarningLimit: 3000
  }
})
