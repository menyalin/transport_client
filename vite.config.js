import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import vuetify from 'vite-plugin-vuetify'
// import Components from 'unplugin-vue-components/vite'
// import { VuetifyResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vuetify({ autoImport: true })],
  server: {
    port: 8080,
  },
  resolve: {
    extensions: ['.js', '.json', '.vue'],
    alias: {
      // vue: '@vue/compat',
      '@': path.resolve(__dirname, './src'),
    },
  },
})
