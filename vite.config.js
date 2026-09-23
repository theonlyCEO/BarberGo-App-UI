import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_BASE_URL || 'http://localhost:3000/api'
  
  // Extract base URL from API URL (remove /api)
  const backendUrl = apiUrl.replace('/api', '')

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false
        },
        '/uploads': {
          target: backendUrl,
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})