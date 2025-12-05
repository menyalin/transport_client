import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { ru } from 'vuetify/locale'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  components,
  directives,
  locale: {
    locale: 'ru',
    messages: { ru },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#0f335f',
          secondary: '#ef6c00',
          accent: '#ffc107',
          error: '#FF5252',
          info: '#2196F3',
          success: '#6aff95',
          warning: '#FFC107',
        },
      },
    },
  },
})
