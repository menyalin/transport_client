import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import Vuelidate from 'vuelidate'
import VuetifyConfirm from 'vuetify-confirm'
import moment from 'moment'
import VueCompositionAPI from '@vue/composition-api'

moment.locale('ru')

Vue.config.productionTip = false

Vue.use(Vuelidate)
Vue.use(VueCompositionAPI)

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
