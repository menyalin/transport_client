module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    'eslint:recommended',
    'plugin:vue/strongly-recommended',
    'prettier',
  ],
  // plugins: ['prettier'],
  parserOptions: {
    parser: 'babel-eslint',
  },

  rules: {
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
  },
}
