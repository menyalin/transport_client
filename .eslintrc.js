module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },

  extends: ['eslint:recommended', 'plugin:vue/base', 'plugin:prettier/recommended'],
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
    // Запрещает прямую мутацию props
    'vue/no-mutating-props': 'warn',
    // Запрещает деструктуризацию props (потеря реактивности)
    // 'vue/no-prop-destructure': 'warn',
    // Отключено в пользу Prettier
    // 'vue/html-indent': [
    //   'error',
    //   2,
    //   {
    //     attribute: 1,
    //     baseIndent: 1,
    //     closeBracket: 0,
    //     alignAttributesVertically: true,
    //     ignores: [],
    //   },
    // ],
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
