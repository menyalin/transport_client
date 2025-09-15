import 'vuetify/styles'
import ru from 'vuetify/lib/locale/ru'
import { createVuetify } from 'vuetify'

const vuetify = createVuetify({
  lang: {
    locales: { ru },
    current: 'ru',
  },
  theme: {
    // options: {
    //   customProperties: true,
    // },

    themes: {
      light: {
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
})

export default vuetify
