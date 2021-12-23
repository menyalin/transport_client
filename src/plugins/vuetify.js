import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

Vue.use(Vuetify)

export default new Vuetify({
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
