import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: [
          'legacy-js-api',
          'import',
          'global-builtin',
          'slash-div',
        ],
      },
      sass: {
        silenceDeprecations: [
          'legacy-js-api',
          'import',
          'global-builtin',
          'slash-div',
        ],
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
  define: {
    'process.env': JSON.stringify(process.env),
    'process.browser': true,
  },
  server: {
    port: 8080,
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:3040',
    //     changeOrigin: true,
    //   },
    // },
  },
  build: {
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'vuex'],
          vuetify: ['vuetify'],
          utils: ['axios', 'dayjs'],
          services: [
            // Shared services
            'src/shared/services/user/user.service.js',
            'src/shared/services/order/order.service.js',
            'src/shared/services/company/company.service.js',
            'src/shared/services/agreement/agreement.service.js',
            'src/shared/services/paymentInvoice/paymentInvoice.service.js',
            'src/shared/services/report/report.service.js',
            'src/shared/services/crew/crew.service.js',
            'src/shared/services/worker/worker.service.js',
            'src/shared/services/region/region.service.js',
            'src/shared/services/city/city.service.js',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
