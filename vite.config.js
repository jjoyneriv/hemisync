import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 443,
    host: '0.0.0.0',
    https: {
      key: fs.readFileSync('./certs/key.pem'),
      cert: fs.readFileSync('./certs/cert.pem'),
    },
    proxy: {
      '/api': {
        target: 'https://localhost:3001',
        secure: false,
        changeOrigin: true,
      },
      '/store': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/song': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/cart': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/checkout': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/account': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/admin': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/_next': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
