import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Puerto por defecto de Vite
    host: true,
    // Permitir geolocalización en desarrollo
    https: false, // Cambia a true si necesitas HTTPS
    // Configuración adicional para geolocalización
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  define: {
    'process.env': {},
    global: 'globalThis'
  },
  resolve: {
    alias: {
      process: 'process/browser',
      stream: 'stream-browserify',
      zlib: 'browserify-zlib',
      util: 'util'
    }
  }
})
