module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },

  extends: ['eslint:recommended', 'plugin:vue/base'],
  plugins: ['prettier'],
  parserOptions: {
    sourceType: 'module',
 
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
}
