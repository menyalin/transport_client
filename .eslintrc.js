module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: ['plugin:vue/recommended'],

  parserOptions: {
    parser: 'babel-eslint',
  },

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'arrow-spacing': 'error',
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    'vue/valid-v-slot': 'off',
  },
}
