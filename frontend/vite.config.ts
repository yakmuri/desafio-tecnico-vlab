import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      // No Docker Compose, "api" é o nome do serviço do Laravel.
      '/api': {
        target: 'http://api:8000',
        changeOrigin: true,
      },
    },
  },
})
