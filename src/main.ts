import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { createApp } from 'vue'
import './/registerServiceWorker'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'

dayjs.locale('ru')
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(customParseFormat)

createApp(App).use(router).use(store).use(vuetify).mount('#app')
