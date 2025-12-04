import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

// Import Vuetify styles for Vite
import 'vuetify/dist/vuetify.min.css'
import Vuelidate from 'vuelidate'
import VuetifyConfirm from 'vuetify-confirm'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(customParseFormat)
dayjs.locale('ru')

Vue.config.productionTip = false

Vue.use(Vuelidate)

Vue.use(VuetifyConfirm, {
  vuetify,
  buttonTrueText: 'Ок',
  buttonFalseText: 'Отмена',
  color: 'error',
  icon: 'mdi-alert',
  title: 'Внимание',
  width: 350,
  property: '$confirm',
})

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app')
