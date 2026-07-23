import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Trinity Engine ERP API (Express)
      '/api/auth': { target: 'http://127.0.0.1:5000', changeOrigin: true },
      '/api/data': { target: 'http://127.0.0.1:5000', changeOrigin: true },
      // GuardianAI Python (security stream + incidents)
      '/api/stream': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/api/incidents': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/api/alerts': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/api/status': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/api/analytics': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/api/chat': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/api/config': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/health': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/ws': { target: 'ws://127.0.0.1:8000', ws: true },
    },
  },
})
