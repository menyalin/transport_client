import { defineConfig, globalIgnores } from 'eslint/config'
import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import pluginVuetify from 'eslint-plugin-vuetify'
import pluginPinia from 'eslint-plugin-pinia'
import prettierConfig from '@vue/eslint-config-prettier'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),

  {
    name: 'app/files-to-lint',
    files: ['src/**/*.{js,mjs,jsx,ts,tsx,vue}'],
  },

  {
    name: 'app/language-options',
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },

  js.configs.recommended,
  pluginVue.configs['flat/base'],
  pluginVuetify.configs['flat/recommended-v4'],
  pluginPinia.configs['recommended-flat'],
  prettierConfig,

  {
    name: 'app/custom-rules',
    rules: {
      'no-console': 'off',
      'no-debugger': 'off',
      'no-useless-assignment': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      'vue/require-default-prop': 'off',
      'vue/valid-v-slot': 'off',
      'vue/attribute-hyphenation': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/no-mutating-props': 'off',
      'vue/multi-word-component-names': 'warn',
      'vue/component-name-in-template-casing': ['warn', 'PascalCase'],
      'vue/require-explicit-emits': 'warn',
      'vue/require-prop-types': 'warn',

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

      'vuetify/no-deprecated-typography': 'warn',
      'vuetify/no-deprecated-classes': 'warn',
      'vuetify/no-deprecated-components': 'warn',
    },
  },

  {
    name: 'app/typescript',
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-unused-vars': 'off',
    },
  },

  {
    name: 'app/vue-typescript',
    files: ['src/**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
])
