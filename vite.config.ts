import path from 'path'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import eslintPlugin from 'vite-plugin-eslint'

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [
    vue(),

    eslintPlugin({
      cache: false,
      include: ['src/**/*.vue', 'src/**/*.js', 'src/**/*.ts'],
      exclude: ['node_modules'],
    }),
  ],
  server: {
    port: 8080,
  },
  resolve: {
    extensions: ['.vue', '.ts', '.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
