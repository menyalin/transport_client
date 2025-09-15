import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { Vuetify3Dialog } from 'vuetify3-dialog'

import 'vuetify/dist/vuetify.min.css'
import vuetify from './plugins/vuetify'

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(customParseFormat)
dayjs.locale('ru')

const app = createApp(App)

app.use(store)
app.use(router)
app.use(vuetify)
app.use(Vuetify3Dialog)

app.mount('#app')
