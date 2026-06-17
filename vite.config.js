import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Im Dev-Modus (`npm run dev`) gibt es keinen Express-Server — `/api/*` wird
  // deshalb an den lokal laufenden Lead-Server (`npm start`, Port 3000) weitergeleitet.
  server: {
    proxy: {
      '/api': { target: 'http://localhost:3000', changeOrigin: true },
    },
  },
})
