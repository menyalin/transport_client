import DateFnsAdapter from '@date-io/date-fns'
import '@mdi/font/css/materialdesignicons.css'
import { ru } from 'date-fns/locale'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import 'vuetify/styles'

export default createVuetify({
  components,
  directives,
  date: {
    adapter: DateFnsAdapter,
    locale: {
      ru: ru,
    },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light', // Или 'dark' по умолчанию
    themes: {
      light: {
        colors: {
          background: '#FFFFFF',
          surface: '#F6F8FA',
          primary: '#0366d6', // Ссылки и кнопки
          secondary: '#586069', // Вторичный текст и иконки
          accent: '#2ea44f', // Акцентные элементы
          error: '#d73a49',
          info: '#0366d6',
          success: '#2ea44f',
          warning: '#fbca04',
          // Дополнительные цвета по необходимости
          onBackground: '#24292E', // Цвет основного текста
          onSurface: '#24292E',
          onPrimary: '#FFFFFF', // Текст на кнопках и ссылках
          onSecondary: '#FFFFFF',
        },
      },
      dark: {
        colors: {
          primary: '#2196F3',
          secondary: '#FF5722',
          accent: '#FF4081',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
        },
      },
    },
  },
})
