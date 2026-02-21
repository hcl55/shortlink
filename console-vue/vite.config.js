import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api/short-link/admin': {
        target: 'http://127.0.0.1:8002',
        changeOrigin: true
      },
      '/api/short-link/project': {
        target: 'http://127.0.0.1:8001',
        changeOrigin: true
      }
    }
  }
})
