import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Get API URL from Railway's process.env at build time
const VITE_API_URL = process.env.VITE_API_URL

console.log('[Vite Build] VITE_API_URL from process.env:', VITE_API_URL)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  define: {
    // Inject VITE_API_URL from Railway's environment into the app
    'import.meta.env.VITE_API_URL': JSON.stringify(VITE_API_URL || '')
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})