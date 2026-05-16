import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: ['.js', '.vue', '.json'],
  },
  server: {
    port: 8080,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3040',
        changeOrigin: true,
      },
      '/socket.io': {
        target: process.env.VITE_API_WS_URL || 'http://localhost:3040',
        changeOrigin: true,
        ws: true,
      },
      '/templates': {
        target: process.env.VITE_STATIC_URL || 'http://localhost:3040',
        changeOrigin: true,
      },
      '/static': {
        target: process.env.VITE_STATIC_URL || 'http://localhost:3040',
        changeOrigin: true,
      },
    },
  },
  define: {
    'process.env': process.env,
  },
})