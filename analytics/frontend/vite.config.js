import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'node:process'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '../', 'VITE_')
  const apiTarget = env.VITE_DEV_API_URL || 'http://localhost:5050'

  return {
    plugins: [react()],
    envDir: '../',
    server: {
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: process.env.NETLIFY ? 'dist' : '../static/dist',
      emptyOutDir: true,
    },
  }
})
