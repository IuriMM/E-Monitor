import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Espelha o rewrite de /api feito em produção pelo vercel.json, para que
    // o app sempre chame a API por um caminho relativo (mesma origem).
    proxy: {
      '/api': {
        target: 'https://e-monitorwebapi.onrender.com',
        changeOrigin: true,
      },
    },
  },
})
