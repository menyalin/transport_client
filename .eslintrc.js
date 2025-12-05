module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
  },

  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-recommended',
    'plugin:vue/vue3-strongly-recommended',
    'plugin:prettier/recommended',
    'plugin:vuetify/base',
  ],
  plugins: ['prettier'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2022,
  },

  rules: {
    // Общие правила
    'no-console': 'off',
    'no-debugger': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_', ignoreRestSiblings: true }],
    'arrow-spacing': 'error',
    'semi': ['error', 'never'],
    'quotes': ['error', 'single', { avoidEscape: true }],

    // Vue 3 специфичные правила
    'vue/multi-word-component-names': 'off',
    'vue/no-unused-components': 'off',
    'vue/no-unused-vars': 'error',
    'vue/require-default-prop': 'off',
    'vue/require-prop-types': 'off',
    'vue/require-explicit-emits': 'off',
    'vue/prefer-import-from-vue': 'off',
    'vue/v-on-event-hyphenation': 'off',
    'vue/attribute-hyphenation': 'off',
    'vue/component-definition-name-casing': 'off',
    'vue/component-name-in-template-casing': 'off',
    'vue/custom-event-name-casing': 'off',
    'vue/define-macros-order': 'off',
    'vue/html-self-closing': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'vue/html-closing-bracket-spacing': 'off',
    'vue/html-indent': 'off',
    'vue/script-indent': 'off',
    'vue/no-v-html': 'off',
    'vue/valid-v-slot': 'off',
    'vue/first-attribute-linebreak': 'off',

    // Vuetify специфичные правила - отключаем для совместимости
    'vuetify/no-deprecated-components': 'warn',
    'vuetify/no-deprecated-props': 'warn',
    'vuetify/no-deprecated-events': 'warn',

    // Prettier - отключаем временно
    'prettier/prettier': 'off',
  },
  overrides: [
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
        ecmaVersion: 2022,
      },
    },
  ],
}
