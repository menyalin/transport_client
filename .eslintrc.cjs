// require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  parser: 'vue-eslint-parser',
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  ignorePatterns: ['dist/**/*', 'node_modules/**/*'],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: [
    'import',
    'vue',
    '@typescript-eslint',
    'prettier',
    'unused-imports',
    'simple-import-sort',
    'promise',
  ],
  extends: [
    'plugin:vue/vue3-recommended', // Рекомендуемые правила для Vue 3
    'plugin:vuetify/base',
    'plugin:@typescript-eslint/recommended', // Рекомендуемые правила для TypeScript
    'plugin:prettier/recommended', // Интеграция с Prettier
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.vue'],
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.vue'],
      },
      typescript: {
        project: './tsconfig.json',
      },
    },
  },

  rules: {
    '@typescript-eslint/no-unused-expressions': 'off', // Убрать

    'vue/no-mutating-props': 'off',
    'vue/require-explicit-emits': 'off',
    'vue/order-in-components': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'import/no-unresolved': 'error',
    'import/order': [
      'off',
      {
        groups: [
          'builtin', // Встроенные модули Node.js
          'external', // Внешние модули
          'internal', // Внутренние модули
          ['parent', 'sibling', 'index'], // Родительские, соседние и индексные файлы
          'object', // Импорты объектов (только для TypeScript)
          'type', // Импорты типов (только для Flow и TypeScript)
        ],
        pathGroups: [
          {
            pattern: '^@/*',
            group: 'internal',
            position: 'after',
          },
        ],
        // pathGroupsExcludedImportTypes: ['builtin', 'external'],
        alphabetize: { order: 'asc', caseInsensitive: false }, // Сортировка по алфавиту
      },
    ],
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'import/no-cycle': 0,
    'no-console': 'off',
    'no-debugger': 'off',
    'arrow-spacing': 'error',
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    'vue/require-default-prop': 'off',
    'vue/valid-v-slot': 'off',
    'vue/attribute-hyphenation': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/no-multiple-template-root': 'off', // Только если нужно поддерживать старый синтаксис
    'promise/always-return': 'off',
    'promise/no-return-wrap': 'error',
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
