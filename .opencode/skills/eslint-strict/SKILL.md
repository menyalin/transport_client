---
name: eslint-strict
description: Use when tightening ESLint rules, adding new lint plugins, fixing lint warnings, or configuring ESLint for TypeScript. Covers incremental adoption plan — from current soft config to strict config.
---

# Ужесточение ESLint

## Текущее состояние

Конфиг мягкий:
- `no-console` / `no-debugger` — **off** (разрешены)
- `vue/no-mutating-props` — **off** (прямая мутация пропсов не ловится)
- `vue/require-default-prop` — **off**
- `vue/valid-v-slot` — **off**
- `no-unused-vars` — единственное активное правило

Используются **4 плагина**: `vue`, `vuetify`, `prettier`, `eslint-config-prettier`.

**Проблемы**, к которым приводит мягкий линтер:
- Мёртвый код (неиспользуемые переменные, импорты, функции)
- Мутация пропсов (теряется реактивность, сложно дебажить)
- Хаос в порядке атрибутов/директив шаблонов
- Нет контроля сложности функций/компонентов

## Стратегия ужесточения

**Фаза 1 — Безопасные правила** (можно включить сразу, `npm run lint` проходит без переписывания кода)
**Фаза 2 — Правила с фиксом** (включаются с автофиксом: `npm run lint -- --fix`)
**Фаза 3 — Правила, требующие ручной правки** (включаются по одному, с фиксом ошибок)
**Фаза 4 — TS-правила** (после начала TS-миграции)

---

## Фаза 1: Безопасные правила (включить сразу)

Добавить в `.eslintrc.js`:

```js
rules: {
  // === Существующие (сохранить) ===
  'no-console': 'off',
  'no-debugger': 'off',
  'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  semi: ['error', 'never'],
  quotes: ['error', 'single'],
  'arrow-spacing': 'error',
  'vue/html-self-closing': ['error', { /* текущий конфиг */ }],

  // === НОВЫЕ: Безопасные, не требуют правок кода ===

  // Отлов опечаток и ошибок
  'no-unreachable': 'error',
  'no-unsafe-negation': 'error',
  'no-cond-assign': ['error', 'except-parens'],
  'no-constant-condition': ['error', { checkLoops: false }],
  'no-dupe-keys': 'error',
  'no-duplicate-case': 'error',
  'no-empty': ['error', { allowEmptyCatch: true }],
  'no-extra-boolean-cast': 'error',
  'no-sparse-arrays': 'error',
  'no-template-curly-in-string': 'error',
  'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
  'valid-typeof': 'error',

  // Читаемость
  'no-multi-spaces': ['error', { ignoreEOLComments: true }],
  'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
  'no-trailing-spaces': 'error',
  'eol-last': ['error', 'always'],
  'comma-spacing': ['error', { before: false, after: true }],
  'key-spacing': ['error', { beforeColon: false, afterColon: true }],
  'keyword-spacing': ['error', { before: true, after: true }],
  'space-infix-ops': 'error',
  'space-before-blocks': 'error',
  'object-curly-spacing': ['error', 'always'],
  'array-bracket-spacing': ['error', 'never'],

  // ES6+
  'prefer-const': 'error',
  'no-var': 'error',
  'no-new-object': 'error',
  'object-shorthand': 'error',
  'prefer-template': 'error',
  'template-curly-spacing': 'error',

  // === НОВЫЕ: Vue-правила ===
  'vue/multi-word-component-names': 'off', // проект использует однословные имена
  'vue/no-v-html': 'warn',
  'vue/this-in-template': 'error',
  'vue/no-use-v-if-with-v-for': 'error',
  'vue/no-v-text-v-html-on-component': 'error',
  'vue/no-multiple-template-root': 'off', // Vue 3 позволяет
  'vue/require-v-for-key': 'error',
  'vue/no-dupe-keys': 'error',
  'vue/no-reserved-component-names': 'error',
  'vue/no-potential-component-option-typo': 'error',
  'vue/no-useless-template-attributes': 'error',
  'vue/require-explicit-emits': 'warn',
  'vue/block-order': ['error', { order: ['template', 'script', 'style'] }],
  'vue/component-api-style': ['error', ['script-setup']],
  'vue/define-props-declaration': ['error', 'type-based'],
  'vue/define-emits-declaration': ['error', 'type-based'],
}
```

**Ожидаемый результат:** `npm run lint` должен пройти с 0 ошибок. Если есть ошибки — правило временно в `warn`.

---

## Фаза 2: Установка новых плагинов + автофикс

### Плагины для установки

```bash
npm i -D eslint-plugin-import eslint-plugin-unused-imports eslint-import-resolver-alias
```

### import-order: порядок импортов

Добавить в `extends` и `rules`:

```js
module.exports = {
  extends: [
    // ... существующие
    'plugin:import/recommended',
  ],
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.js', '.vue', '.json'],
      },
    },
  },
  rules: {
    // Порядок импортов — автофикс
    'import/order': ['error', {
      groups: [
        'builtin',          // node:url, fs
        'external',         // vue, pinia, axios
        'internal',         // @/shared/..., @/entities/...
        'parent',           // ../
        'sibling',          // ./
        'index',            // ./index
      ],
      'newlines-between': 'always',
      alphabetize: { order: 'asc', caseInsensitive: true },
    }],
    'import/no-duplicates': 'error',
    'import/no-unresolved': 'off', // Алиас @/ может не резолвиться в старом ESLint

    // Автоудаление неиспользуемых импортов
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': ['error', {
      vars: 'all',
      varsIgnorePattern: '^_',
      args: 'after-used',
      argsIgnorePattern: '^_',
    }],
  },
}
```

После установки — прогнать автофикс:
```bash
npm run lint -- --fix
```

---

## Фаза 3: Правила, требующие ручной правки

Включать **по одному правилу**, исправлять ошибки, коммитить.

### Контроль сложности

```js
rules: {
  'max-lines-per-function': ['warn', { max: 80, skipBlankLines: true, skipComments: true }],
  'max-depth': ['warn', { max: 3 }],
  'max-params': ['warn', { max: 4 }],
  'complexity': ['warn', { max: 10 }],
  'no-nested-ternary': 'error',
}
```

### Запрет мутации (требует рефакторинга компонентов)

```js
rules: {
  'no-param-reassign': ['error', { props: true }],
  'vue/no-mutating-props': 'error', // Сейчас off!
  'vue/no-side-effects-in-computed-properties': 'error',
}
```

**Важно:** `vue/no-mutating-props: error` сломает множество компонентов, где мутируют пропсы напрямую. Исправлять через:
- `defineModel()` для v-model
- Локальный `ref()`, инициализированный из пропса
- `emit('update:propName', newValue)`

### Vue-правила для шаблонов

```js
rules: {
  'vue/component-name-in-template-casing': ['error', 'PascalCase'],
  'vue/define-macros-order': ['error', {
    order: ['defineProps', 'defineEmits', 'defineModel', 'defineSlots'],
  }],
  'vue/no-undef-components': ['warn', {
    ignorePatterns: ['^v-', '^V', 'router-link', 'router-view'],
  }],
  'vue/require-prop-types': 'error',
  'vue/require-default-prop': 'warn', // Сейчас off!
  'vue/valid-define-options': 'error',
  'vue/html-button-has-type': 'error',
  'vue/no-unused-refs': 'error',
}
```

### Правила для консистентности

```js
rules: {
  'eqeqeq': ['error', 'always', { null: 'ignore' }],
  'curly': ['error', 'all'],
  'default-case': 'error',
  'no-eval': 'error',
  'no-implied-eval': 'error',
  'no-new-func': 'error',
  'no-return-await': 'error',
  'require-await': 'warn',
  'no-throw-literal': 'error',
  'prefer-destructuring': ['warn', { object: true, array: false }],
}
```

---

## Фаза 4: TypeScript-правила

После установки `@typescript-eslint@^6` (см. ts-migration skill):

```js
module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: [
    // ... существующие
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    // Отключаем JS-правила, которые конфликтуют с TS
    'no-unused-vars': 'off',
    'no-undef': 'off',

    // TS-правила
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    '@typescript-eslint/consistent-type-exports': 'error',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'warn',
  },
}
```

---

## План внедрения

| Фаза | Что делаем | Ожидаемые ошибки | Время |
|------|-----------|-----------------|-------|
| **1** | Безопасные правила | 0 (если повезёт) или несколько `prefer-const` | 5 мин |
| **2** | Плагины + автофикс | 0 после `--fix` | 10 мин |
| **3.1** | `vue/no-mutating-props` | Много, нужен рефакторинг компонентов | 1-2 дня |
| **3.2** | `vue/require-prop-types` | Умеренно | 1-2 часа |
| **3.3** | Сложность функций | Умеренно/много, требует рефакторинга | 1-2 дня |
| **4** | TS-правила | Зависит от прогресса TS-миграции | После миграции |

**Критическое правило:** `vue/no-mutating-props` — самое важное для включения. Мутация пропсов делает компоненты непредсказуемыми.

## Full .eslintrc.js после фазы 2

```js
module.exports = {
  root: true,
  env: { browser: true, node: true },

  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:vue/base',
    'plugin:prettier/recommended',
    'plugin:vuetify/base',
  ],

  parserOptions: { sourceType: 'module' },

  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.js', '.vue', '.json'],
      },
    },
  },

  rules: {
    // Безопасность
    'no-console': 'off',
    'no-debugger': 'off',
    'no-unused-vars': 'off', // Заменено на unused-imports
    'no-unreachable': 'error',
    'no-unsafe-negation': 'error',
    'no-cond-assign': ['error', 'except-parens'],
    'no-constant-condition': ['error', { checkLoops: false }],
    'no-dupe-keys': 'error',
    'no-duplicate-case': 'error',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'no-extra-boolean-cast': 'error',
    'no-sparse-arrays': 'error',
    'no-template-curly-in-string': 'error',
    'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
    'valid-typeof': 'error',
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-throw-literal': 'error',

    // Стиль
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    'arrow-spacing': 'error',
    'no-multi-spaces': ['error', { ignoreEOLComments: true }],
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
    'no-trailing-spaces': 'error',
    'eol-last': ['error', 'always'],
    'comma-spacing': ['error', { before: false, after: true }],
    'key-spacing': ['error', { beforeColon: false, afterColon: true }],
    'keyword-spacing': ['error', { before: true, after: true }],
    'space-infix-ops': 'error',
    'space-before-blocks': 'error',
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],

    // ES6+
    'prefer-const': 'error',
    'no-var': 'error',
    'no-new-object': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',
    'template-curly-spacing': 'error',

    // Импорты
    'import/order': ['error', {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'always',
      alphabetize: { order: 'asc', caseInsensitive: true },
    }],
    'import/no-duplicates': 'error',
    'import/no-unresolved': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': ['error', {
      vars: 'all', varsIgnorePattern: '^_',
      args: 'after-used', argsIgnorePattern: '^_',
    }],

    // Vue
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'warn',
    'vue/this-in-template': 'error',
    'vue/no-use-v-if-with-v-for': 'error',
    'vue/no-v-text-v-html-on-component': 'error',
    'vue/require-v-for-key': 'error',
    'vue/no-dupe-keys': 'error',
    'vue/no-reserved-component-names': 'error',
    'vue/no-potential-component-option-typo': 'error',
    'vue/no-useless-template-attributes': 'error',
    'vue/require-explicit-emits': 'warn',
    'vue/block-order': ['error', { order: ['template', 'script', 'style'] }],
    'vue/component-api-style': ['error', ['script-setup']],
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/define-macros-order': ['error', {
      order: ['defineProps', 'defineEmits', 'defineModel', 'defineSlots'],
    }],
    'vue/require-prop-types': 'error',
    'vue/require-default-prop': 'off',
    'vue/valid-v-slot': 'off',
    'vue/html-button-has-type': 'error',
    'vue/html-self-closing': ['error', {
      html: { void: 'always', normal: 'always', component: 'always' },
      svg: 'always', math: 'always',
    }],
  },
}
```
