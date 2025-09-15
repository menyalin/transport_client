// eslint.config.js
import vue from 'eslint-plugin-vue'
import vuetify from 'eslint-plugin-vuetify'
import importPlugin from 'eslint-plugin-import'
import { defineConfig } from 'vite'

export const viteConfig = defineConfig([
  ...vue.configs['flat/recommended'],
  ...vuetify.configs['flat/base'],
  importPlugin.flatConfigs.warnings,

  {
    files: ['**/*.js', '**/*.vue'],
    languageOptions: {
      ecmaVersion: 2022, // 2020 и выше поддерживают ?. и ??
      sourceType: 'module',
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },

    rules: {
      'vue/order-in-components': 'off',
      'vue/require-explicit-emits': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/no-mutating-props': 'off',
      'vue/no-lone-template': 'off',

      'import/no-named-as-default-member': 'off',
      'import/no-named-as-default': 'off',
      'import/no-cycle': 'error',

      'no-console': 'off',
      'no-debugger': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'arrow-spacing': 'error',
      semi: ['error', 'never'],
      quotes: ['error', 'single'],
      'vue/require-default-prop': 'off',
      'vue/valid-v-slot': 'off',
      'vue/attribute-hyphenation': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'always',
            component: 'always',
          },
          svg: 'always',
          math: 'always',
        },
      ],
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.vue'], // Убедимся, что index.js в директориях резолвится автоматически
          moduleDirectory: ['node_modules'], // Добавили 'src' для лучшего разрешения локальных путей
        },
        alias: {
          map: [
            ['@', './src'], // Ваш алиас для '@/shared/ui' -> './src/shared/ui/index.js'
          ],
          extensions: ['.js', '.vue'],
        },
      },
      'import/extensions': ['.js', '.vue'], // Дополнительно для plugin-import
    },
  },
])

export default viteConfig
