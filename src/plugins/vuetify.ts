import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import 'vuetify/styles'
export default createVuetify({
  components,
  directives,

  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light',
  },

  // theme: {
  //   light: {
  //     primary: '#0f335f',
  //     secondary: '#ef6c00',
  //     accent: '#ffc107',
  //     error: '#FF5252',
  //     info: '#2196F3',
  //     success: '#6aff95',
  //     warning: '#FFC107',
  //   },
  // },
})
