---
name: code-standards
description: Use when writing or reviewing code for style consistency, ESLint/Prettier rules, import ordering, naming conventions, and commit message format. Activated automatically for any code change.
---

# Code Standards

## ESLint + Prettier

- `no-console` / `no-debugger` — разрешены (`off`)
- `no-unused-vars` — error, но `_` префикс игнорируется
- Без точек с запятой
- Одинарные кавычки
- Trailing commas в ES5-стиле (запятые после последнего элемента массива/объекта)
- `printWidth: 100`
- `tabWidth: 2`
- `vue/html-self-closing: always`
- `vue/require-default-prop: off`
- `vue/valid-v-slot: off`

Перед коммитом прогонять `npm run lint`. Автофикс: `npm run lint --fix`.

## Импорты

Порядок группировки (с пустой строкой между группами):
1. Системные/библиотечные (vue, pinia, vuetify, ...)
2. Внутренние алиасы (`@/shared/...`, `@/entities/...`, ...)
3. Относительные (`./Component`, `../hooks/...`)

Алиас `@` → `src/`.

## Naming

- Компоненты: PascalCase (многословные), файлы — kebab-case
- Сторы: `use<Name>Store` (camelCase файлы)
- Обычные функции/переменные: camelCase
- Константы: UPPER_SNAKE_CASE
- Пропсы: camelCase, а в шаблонах kebab-case

## Комментарии

Комментарии в коде — на русском языке.

## Git commits

Conventional commits:

```
feat(scope): краткое описание
fix(scope): краткое описание
refactor(scope): краткое описание
```

Без `Co-Authored-By`.
Без emoji.
Описание — настоящее предложение с маленькой буквы.
