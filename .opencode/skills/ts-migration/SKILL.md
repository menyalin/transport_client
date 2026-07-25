---
name: ts-migration
description: Use when adding TypeScript to the project, converting .js/.vue files to TypeScript, typing API responses, or configuring tsconfig. Covers incremental migration strategy from JS → TS.
---

# Миграция на TypeScript

## Текущее состояние

Проект полностью на JavaScript (`.js` + `.vue`). Ни одного `.ts`/`.d.ts` файла. `tsconfig.json` отсутствует. В `vite.config.js` уже прописан `resolve.extensions: ['.js', '.vue', '.json', '.ts']` — Vite готов к TS.

`zod` уже в зависимостях — можно использовать для runtime-валидации API-ответов и генерации типов.

## Стратегия: постепенная миграция

**Этап 0 — Подготовка инфраструктуры**
Установка пакетов и создание `tsconfig.json`. Ни один файл не трогаем.

**Этап 1 — Типизация снизу вверх**
`shared/constants` → `shared/utils` → `shared/hooks` → `shared/services` → `entities/*/model` → `entities/*/ui` → `features/` → `pages/`.

**Этап 2 — Ужесточение**
Включение `checkJs: true`, `strict: true`, удаление JS-файлов по мере готовности.

## Этап 0: Инфраструктура

### Шаг 0.1: Установка dev-зависимостей

```bash
npm i -D typescript vue-tsc @types/node
```

Пакеты **НЕ ставим** (используем существующие или не требуются):
- `@vitejs/plugin-vue` — уже есть, работает и с TS
- `@typescript-eslint/parser` + `@typescript-eslint/eslint-plugin` — добавим на этапе 2

### Шаг 0.2: tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": false,
    "allowJs": true,
    "checkJs": false,
    "noEmit": true,
    "jsx": "preserve",
    "isolatedModules": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "types": ["node"]
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.vue"],
  "exclude": ["node_modules", "dist"]
}
```

Первый подход: `strict: false`, `checkJs: false` — не ломает существующий код.

### Шаг 0.3: env.d.ts (глобальные декларации)

Создать `src/env.d.ts`:

```ts
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
```

### Шаг 0.4: Добавить скрипт typecheck (опционально на этом этапе)

```json
// package.json
"scripts": {
  "typecheck": "vue-tsc --noEmit"
}
```

## Этап 1: Типизация снизу вверх

### Приоритет типизации

| Приоритет | Что типизировать | Почему |
|-----------|-----------------|--------|
| **1** | `shared/constants/` | Константы → enum'ы, типы статусов. Просто, даёт много пользы. |
| **2** | `shared/utils/` | Чистые функции, легко типизировать, используются везде. |
| **3** | `shared/values/` | Value objects (Price), есть `zod` — можно генерировать типы из схем. |
| **4** | `shared/hooks/` | Composables — сигнатуры функций, возвращаемые типы. |
| **5** | `shared/services/` | API-ответы: `zod` схемы → `z.infer<typeof schema>` → типы. |
| **6** | `entities/*/model/` | Сторы Pinia, бизнес-логика. |
| **7** | `entities/*/ui/` | Vue компоненты — `<script setup lang="ts">`, `defineProps<T>()`. |
| **8** | `features/` | Сценарии, композиция. |
| **9** | `pages/` | Страницы — в последнюю очередь, зависят от всего остального. |

### Конвертация JS → TS

#### Обычный .js файл
```js
// ДО: shared/utils/moneyFormatter.js
export function formatMoney(value) {
  return new Intl.NumberFormat('ru-RU').format(value)
}
```

```ts
// ПОСЛЕ: shared/utils/moneyFormatter.ts
export function formatMoney(value: number): string {
  return new Intl.NumberFormat('ru-RU').format(value)
}
```

#### Zod-схема для API-ответа
```ts
// ДО: shared/services/order/order.service.js
import api from '@/api'
export const getOrders = (params) => api.get('/orders', { params })
```

```ts
// ПОСЛЕ: entities/order/api/order.api.ts
import { z } from 'zod'
import api from '@/api'
import type { OrderFilters, OrderListResponse } from './order.types'

// Zod-схема для валидации и вывода типов
export const OrderSchema = z.object({
  id: z.number(),
  orderNumber: z.string(),
  status: z.enum(['new', 'in_progress', 'completed', 'cancelled']),
  // ...
})

export type Order = z.infer<typeof OrderSchema>

export async function getOrders(params: OrderFilters): Promise<OrderListResponse> {
  const { data } = await api.get('/orders', { params })
  // Валидация на рантайме опциональна на этапе 1
  return data
}
```

#### Vue компонент
```vue
<!-- ДО -->
<script setup>
const props = defineProps({
  order: { type: Object, required: true },
  readonly: { type: Boolean, default: false },
})
</script>
```

```vue
<!-- ПОСЛЕ -->
<script setup lang="ts">
import type { Order } from '@/entities/order/model/order.types'

interface Props {
  order: Order
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
})
</script>
```

#### Pinia store
```ts
// entities/order/model/orderStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Order } from './order.types'

export const useOrderStore = defineStore('order', () => {
  const orders = ref<Order[]>([])
  const selectedOrder = ref<Order | null>(null)

  const activeOrders = computed(() =>
    orders.value.filter(o => o.status !== 'cancelled')
  )

  async function fetchOrders(params: Record<string, unknown>): Promise<void> {
    // ...
  }

  return { orders, selectedOrder, activeOrders, fetchOrders }
})
```

## Типизация API-ответов через Zod

Поскольку `zod` уже в проекте, используем его для:
1. Runtime-валидации (опционально)
2. Вывода типов (`z.infer`) — основное применение на этапе миграции

```ts
// shared/api-types/order.ts
import { z } from 'zod'

export const OrderDTO = z.object({
  id: z.number(),
  orderNumber: z.string(),
  status: z.string(),
  clientId: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type OrderDTO = z.infer<typeof OrderDTO>

export const OrderListResponse = z.object({
  items: z.array(OrderDTO),
  total: z.number(),
})

export type OrderListResponse = z.infer<typeof OrderListResponse>
```

## Этап 2: Ужесточение

Когда 60%+ кодовой базы типизировано:

### Шаг 2.1: Ужесточаем tsconfig
```json
{
  "compilerOptions": {
    "strict": true,
    "checkJs": true,
    "noImplicitAny": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### Шаг 2.2: ESLint для TypeScript

```bash
# ESLint 8 совместим с @typescript-eslint v5/v6. Ставим v6 (стабильная для ESLint 8):
npm i -D @typescript-eslint/parser@^6 @typescript-eslint/eslint-plugin@^6
```

Обновить `.eslintrc.js`:
```js
module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-unused-vars': 'off', // Отключаем JS-правило в пользу TS
  },
}
```

### Шаг 2.3: Замена `@babel/eslint-parser` на `@typescript-eslint/parser`

Удалить `@babel/eslint-parser` из devDependencies (больше не нужен).

## Правила миграции Vue-компонентов

1. Всегда добавлять `lang="ts"` в `<script setup lang="ts">`
2. Использовать `defineProps<T>()` вместо `defineProps({})`
3. Типизировать `defineEmits<T>()`:
   ```ts
   const emit = defineEmits<{
     'update:modelValue': [value: string]
     submit: [data: FormData]
   }>()
   ```
4. Типизировать `ref<>()`:
   ```ts
   const items = ref<Order[]>([])
   const loading = ref(false) // boolean выводится автоматически
   ```
5. Типизировать `computed<>()`:
   ```ts
   const activeOrders = computed<Order[]>(() => ...)
   ```

## Совместимость с Vuetify 4

Vuetify 4 имеет типы. При использовании в TS-компонентах:
- `VBtn`, `VTextField` и другие компоненты доступны глобально через `autoImport: true`
- `useTheme()`, `useDisplay()`, `useLocale()` — возвращают типизированные объекты
- События `@click`, `@update:modelValue` — выводятся автоматически

## Чего НЕ делать при миграции

- **Не конвертировать всё сразу.** Один файл за раз, с проверкой `npm run lint`.
- **Не ставить `any` везде для скорости.** Лучше оставить JS-файл, чем наполнить TS `any`.
- **Не удалять JS-файлы до проверки работоспособности.** Сначала добавить `.ts` рядом, потом удалить `.js`.
- **Не мигрировать `modules/` в TS.** Легаси-модули сначала мигрировать в FSD (JS), потом в TS.
- **Не добавлять `@types/*` для всего подряд.** Проверить, есть ли встроенные типы у пакета.
