import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // FIX: Expose API_KEY to the client-side code, as required by the Gemini API guidelines.
  // This will replace `process.env.API_KEY` with the actual value at build time.
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
})
