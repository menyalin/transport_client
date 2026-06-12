import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { ru } from 'vuetify/locale'
import { md3 } from 'vuetify/blueprints'

export default createVuetify({
  defaults: {
    VTextField: { density: 'compact' },
    VSelect: { density: 'compact' },
    VAutocomplete: {
      density: 'compact',
      itemTitle: 'text',
      clearable: true,
      color: 'primary',
      autoSelectFirst: true,
    },
    VSwitch: {
      color: 'primary',
      density: 'compact',
      class: 'ma-2',
    },
    VTextarea: { density: 'compact', autocomplete: false },
    VCheckbox: { density: 'compact', color: 'primary' },
    VDataTableServer: {
      itemValue: '_id',
      density: 'compact',
      color: 'primary',
      itemsPerPageOptions: [25, 50, 100, 200],
    },
    VDataTable: { density: 'compact', color: 'primary', itemValue: '_id' },
  },
  theme: {
    defaultTheme: 'githubLight',
    themes: {
      githubLight: {
        dark: false,
        colors: {
          primary: '#18559bc5', // GitHub's accent blue for primary elements
          secondary: '#b1b2b3', // Neutral gray for secondary elements
          accent: '#4574ff', // Accent color
          error: '#d1242f', // Danger red
          warning: '#ff9361', // Attention yellow/orange
          info: '#2581eb', // Info blue
          success: '#24aa4a', // Success green
          background: '#f8f6f6', // Main background
          surface: '#ffffff', // Subtle surfaces like cards or panels
          'on-primary': '#ffffff', // Text on primary
          'on-secondary': '#ffffff', // Text on secondary
          'on-background': '#24292f', // Text on background
          'on-surface': '#24292f', // Text on surfaces
          'on-error': '#ffffff', // Text on error
          'on-warning': '#24292f', // Text on warning
          'on-info': '#ffffff', // Text on info
          'on-success': '#ffffff', // Text on success
        },
        variables: {
          'border-color': '#d0d7de', // Border color
          'medium-emphasis-opacity': 0.6, // For muted text
        },
      },
    },
  },
  locale: {
    locale: 'ru',
    messages: { ru },
  },
  icons: {
    defaultSet: 'mdi', // This is already the default value - only for display purposes
  },
  blueprint: md3,
  components,
  directives,
})
