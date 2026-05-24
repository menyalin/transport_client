import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { createPinia } from 'pinia'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(customParseFormat)
dayjs.locale('ru')

const app = createApp(App)

app.use(router)
app.use(store)
app.use(vuetify)
app.use(createPinia())

app.mount('#app')
