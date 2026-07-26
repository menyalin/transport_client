# План миграции на TypeScript

## Цель

Постепенный перевод кодовой базы с JavaScript на TypeScript без остановки разработки. Конечная цель — подготовка кода для переноса в Nx монорепозиторий, где все проекты используют TypeScript.

## Принципы

- **Постепенность.** Типизируем файл за файлом, начиная с независимых слоёв. Vuex-модули остаются `.js` до миграции на Pinia или полного выпиливания.
- **Не ломаем.** Dev-сервер и production-сборка работают на каждом шаге.
- **Без Vuex-типизации.** Vuex-модули живут как `.js`, не типизируются, постепенно заменяются на Pinia.
- **Без массового переименования.** Файл переводится в `.ts` только когда к нему готовы. Не переименовываем всё сразу и не заполняем `// @ts-nocheck` по всей кодовой базе.
- **Zod для API.** Уже есть в зависимостях, используем для runtime-валидации и вывода типов (`z.infer`).
- **FSD до Nx.** Легаси-модули из `src/modules/` сначала переносим в FSD-структуру, затем типизируем и выделяем в библиотеки Nx.

## Текущее состояние

| Показатель | Значение |
|---|---|
| `.vue` файлов | 296 |
| `.js` файлов в `src/` | 275 |
| Всего строк кода | ~44 000 |
| TypeScript-файлов | 0 |
| `tsconfig.json` | отсутствует |
| `@types/*` пакетов | 0 |
| Компоненты на `<script setup>` | 93% (276 из 296) |
| Vuex-модулей | 4 + 13 подмодулей |
| Pinia-сторов | 5 |
| Сервисов | 27 |
| Composables/hooks | 13 |
| Форм с Vuelidate | 46 |
| Кастомных директив | 0 |
| ESLint-парсер | `@babel/eslint-parser` |

## Этапы миграции

### Этап 0 — Подготовка инфраструктуры (1–2 дня)

На этом этапе **не меняем** существующие `.js` и `.vue` файлы. Только устанавливаем зависимости и создаём конфигурацию.

#### 0.1 Установка TS-зависимостей

```bash
npm i -D typescript vue-tsc @types/node
```

**Не устанавливать на этом этапе:**
- `@types/dayjs` — dayjs v2+ имеет встроенные типы
- `@types/socket.io-client` — socket.io-client v4 имеет встроенные типы
- `@types/vuex` — Vuex не типизируется
- `@typescript-eslint/parser` и `@typescript-eslint/eslint-plugin` — добавляем на этапе ужесточения

#### 0.2 `tsconfig.json` — корневой конфиг

```jsonc
{
  "compilerOptions": {
    "strict": false,
    "noImplicitAny": false,
    "strictNullChecks": false,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "allowJs": false,
    "checkJs": false,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "types": ["node"]
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.d.ts",
    "src/**/*.vue"
  ],
  "exclude": ["node_modules", "dist"]
}
```

Строгие проверки будут включаться постепенно:
1. `strictNullChecks: true` — после типизации сервисов и утилит
2. `noImplicitAny: true` — после типизации composables
3. `strict: true` и `checkJs: true` — финальная цель

#### 0.3 `src/env.d.ts` — глобальные декларации

```ts
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_API_WS_URL: string
  readonly VITE_STATIC_URL: string
  readonly VITE_APP_NAME?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

#### 0.4 `src/shared/types/` — базовые типы предметной области

```
src/shared/types/
├── index.ts               # barrel-реэкспорт
├── order.ts               # Order, RoutePoint, ConfirmedCrew, Price
├── user.ts                # User, UserRole, Permission
├── transport.ts           # Truck, Driver, Trailer
├── company.ts             # Company, Agreement, CarrierAgreement
├── common.ts              # Id, DateString, SelectOption, PaginatedResponse<T>
└── socket-events.ts       # ServerToClientEvents, ClientToServerEvents
```

На старте — минимальные скелеты, наполняются по мере типизации сервисов и компонентов.

#### 0.5 `package.json` — скрипт typecheck

```json
{
  "scripts": {
    "typecheck": "vue-tsc --noEmit"
  }
}
```

#### 0.6 Верификация

```bash
npm install
npm run typecheck    # без ошибок (TS-файлов пока нет)
npm run dev          # dev-сервер запускается
npm run build        # сборка проходит
npm run lint         # без изменений, пока не трогаем ESLint
```

#### Результат Этапа 0

- `tsconfig.json` с алиасом `@/*`
- `src/env.d.ts` с декларациями Vite и env
- `src/shared/types/` — заготовка под будущую Nx-библиотеку `@transport/shared-types`
- `npm run typecheck` работает
- Сборка и dev-сервер не сломаны

---

### Этап 1 — Типизация независимых слоёв

Конвертируем `.js` → `.ts` **по одному файлу**, начиная с самых независимых. Не используем `// @ts-nocheck` как массовый инструмент. Если файл не готов к типизации — оставляем его `.js`.

#### 1.1 Константы и утилиты

`shared/constants/` → `shared/utils/`

- Чистая логика, нет зависимостей от Vue, Vuex, Vuetify.
- Легко типизировать, даёт большую пользу.

Пример:
```ts
// shared/utils/moneyFormatter.ts
export function formatMoney(value: number): string {
  return new Intl.NumberFormat('ru-RU').format(value)
}
```

#### 1.2 Базовые типы предметной области

Наполняем `shared/types/` реальными типами на основе API и сервисов.

#### 1.3 Zod-схемы для API

Используем `zod` для runtime-валидации и генерации типов:

```ts
// shared/types/order.ts
import { z } from 'zod'

export const OrderSchema = z.object({
  id: z.number(),
  orderNumber: z.string(),
  status: z.enum(['new', 'in_progress', 'completed', 'cancelled']),
  clientId: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Order = z.infer<typeof OrderSchema>
```

#### 1.4 API-слой и Socket

- `src/api/index.ts` — Axios instance, типизация interceptors, module augmentation для `_isRetry`
- `src/socket.ts` — типизированный `Socket<ServerToClientEvents, ClientToServerEvents>`

#### 1.5 Сервисы

`shared/services/` — типизация DTO и параметров для каждого метода. Начинаем с сервисов, которые не зависят от Vuex.

```ts
// shared/services/order/order.service.ts
import { api } from '@/api'
import type { OrderFilters, OrderListResponse } from '@/shared/types'

export async function getOrders(params: OrderFilters): Promise<OrderListResponse> {
  const { data } = await api.get('/orders', { params })
  return data
}
```

#### 1.6 Pinia-сторы

`entities/*/model/` — сторы уже на Composition API, типизируются легко.

```ts
// entities/order/model/orderStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Order } from '@/shared/types'

export const useOrderStore = defineStore('order', () => {
  const orders = ref<Order[]>([])
  const selectedOrder = ref<Order | null>(null)

  const activeOrders = computed(() =>
    orders.value.filter(o => o.status !== 'cancelled')
  )

  return { orders, selectedOrder, activeOrders }
})
```

#### 1.7 Composables

`shared/hooks/` — типизация сигнатур, параметров и возвращаемых типов.

#### Результат Этапа 1

- Типизированы константы, утилиты, сервисы, Pinia-сторы, composables
- `typecheck` проходит без ошибок
- `.js` файлы остаются только там, где ещё не добрались

---

### Этап 2 — Типизация компонентов

#### 2.1 Порядок типизации компонентов

1. `shared/ui/` — маленькие переиспользуемые компоненты
2. `entities/*/ui/` — компоненты сущностей
3. `widgets/` — составные блоки
4. `features/` — сценарии
5. `pages/` — страницы, в последнюю очередь

#### 2.2 Правила типизации Vue-компонента

```vue
<script setup lang="ts">
import type { Order } from '@/shared/types'

interface Props {
  order: Order
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
})

const emit = defineEmits<{
  'update:status': [status: string]
  submit: [data: Order]
}>()

const items = ref<Order[]>([])
const loading = ref(false)

const activeItems = computed<Order[]>(() =>
  items.value.filter(i => i.status !== 'cancelled')
)
</script>
```

#### 2.3 Работа с Vuex в TS-компонентах

Vuex не типизируется. Используем `useStore()` без generic, по возможности заменяем на Pinia-стор.

```ts
import { useStore } from 'vuex'

const store = useStore()
```

#### 2.4 Работа с Vuetify 4

Vuetify 4 имеет типы. `useTheme()`, `useDisplay()`, `useLocale()` возвращают типизированные объекты. События компонентов выводятся автоматически.

#### Результат Этапа 2

- Все новые и рефакторимые компоненты пишутся с `lang="ts"`
- Постепенно уменьшается количество не типизированных `.vue` файлов

---

### Этап 3 — Ужесточение и ESLint

Включаем после того, как 60%+ кодовой базы типизировано.

#### 3.1 Ужесточение tsconfig

```jsonc
{
  "compilerOptions": {
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strict": true,
    "checkJs": true,
    "noUncheckedIndexedAccess": true
  }
}
```

#### 3.2 ESLint для TypeScript

```bash
npm i -D @typescript-eslint/parser@^6 @typescript-eslint/eslint-plugin@^6
```

Обновить `.eslintrc.js`:
- Заменить `@babel/eslint-parser` на `@typescript-eslint/parser`
- Добавить `plugin:@typescript-eslint/recommended`
- Отключить базовое `no-unused-vars` в пользу `@typescript-eslint/no-unused-vars`
- На старте `no-explicit-any` — `warn`

```json
{
  "scripts": {
    "lint": "eslint src/ --ext .ts,.vue,.js --fix",
    "typecheck": "vue-tsc --noEmit"
  }
}
```

#### 3.3 CI

Добавить `vue-tsc --noEmit` и обновлённый `eslint` в CI-проверки.

#### Результат Этапа 3

- `strict: true` в проекте
- ESLint проверяет TypeScript
- CI не пропускает ошибки типизации

---

### Этап 4 — Миграция легаси-модулей в FSD

Перед переносом в Nx нужно привести структуру к FSD.

1. `src/modules/auth/` → `features/auth/`, `entities/user/`
2. `src/modules/order/` → `entities/order/`, `features/order/`, `widgets/order/`
3. `src/modules/accounting/` → `features/paymentInvoice/`, `entities/accounting/`
4. `src/modules/profile/` → `entities/user/`, `features/profile/`
5. `src/modules/common/` → `shared/ui/`, `shared/utils/`, `shared/constants/`

Vuex-модули при этом остаются `.js`, но переносятся в соответствующие Pinia-сторы по мере возможности.

#### Результат Этапа 4

- Структура `src/` соответствует FSD
- Легаси-модули распределены по слоям

---

### Этап 5 — Подготовка к Nx

1. **Выделение `shared/types/`** → `libs/shared-types/`
2. **Выделение `shared/constants/`** → `libs/shared-constants/`
3. **Выделение `shared/services/`** → `libs/transport-services/`
4. **Выделение `shared/ui/`** → `libs/shared-ui/`
5. **Выделение `entities/*/`** → `libs/entities/*/
6. **Создание `apps/transport-client/`** — перенос pages, widgets, features, router, main.ts
7. **Настройка Nx-путей** — замена `@/` на `@transport/*` алиасы

---

## Трекинг прогресса

```bash
# Сколько TS-файлов уже типизировано
find src/ -name '*.ts' ! -path '*/store/*' | wc -l

# Сколько JS-файлов осталось вне Vuex
find src/ -name '*.js' ! -path '*/store/*' ! -path '*/modules/*' | wc -l

# Сколько .vue файлов с lang="ts"
grep -rl 'lang="ts"' src/ --include='*.vue' | wc -l

# Сколько any и @ts-nocheck
npx vue-tsc --noEmit | grep -c "any\|@ts-nocheck" || true
```

## Оценка трудозатрат

| Этап | Часов |
|---|---|
| Этап 0 — Инфраструктура | 8–16 |
| Этап 1 — Типизация независимых слоёв | 40–80 |
| Этап 2 — Типизация компонентов | 60–100 |
| Этап 3 — Ужесточение и ESLint | 16–32 |
| Этап 4 — Миграция легаси в FSD | 40–80 |
| Этап 5 — Подготовка к Nx | 40–80 |
| **Итого** | **~200–400** |

Зависит от количества разработчиков, работающих над миграцией параллельно. Рекомендуется разбить на итерации по 2–4 недели и проводить код-ревью после каждой итерации.

## Чего не делать

- **Не конвертировать всё сразу.** Один файл за раз, с проверкой `npm run lint` и `npm run typecheck`.
- **Не ставить `any` везде для скорости.** Лучше оставить JS-файл, чем наполнить TS `any`.
- **Не удалять JS-файлы до проверки работоспособности.** Сначала добавить `.ts` рядом, потом удалить `.js`.
- **Не мигрировать `modules/` в TS сразу.** Легаси-модули сначала мигрировать в FSD (JS), потом в TS.
- **Не добавлять `@types/*` для всего подряд.** Проверить, есть ли встроенные типы у пакета.
- **Не включать `allowImportingTsExtensions`.** Импорты без расширения — доминирующий стиль в проекте.
- **Не подключать ESLint для TS на старте.** Сначала стабилизировать `tsconfig` и `vue-tsc`.
