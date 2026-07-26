# FSD: вложенное создание сущностей и возвратный контекст

## Проблема

Пользователь на форме создания заявки не находит нужный адрес в автокомплите. Хочет создать новый адрес, не закрывая заявку. На форме адреса — не находит партнёра. Хочет создать партнёра. После создания — вернуться на форму заявки с уже выбранными значениями.

```
OrderForm → create Address → create Partner → return to Address → return to OrderForm
```

При этом возможна перезагрузка страницы на любом шаге, и цепочка не должна потеряться.

## Ограничения FSD

- **entity** не может импортировать другую entity
- **feature** не может импортировать другую feature
- Только **page** может импортировать несколько фич

Следовательно, композиция сценариев — задача страницы.

## Архитектура: Return-context stack

Стек контекстов в `localStorage` — каждый шаг «хочу создать сущность и вернуться» кладёт запись. При создании — забирает верхнюю запись и делает `router.push()` обратно.

```
localStorage: 'return-context-stack' (TTL 30 минут)

┌──────────────────────────────────────────────────────┐
│ [{ id, from: '/orders/create',                        │
│    action: 'pick-address', pointIndex: 0,             │
│    createdAt: 1722000000000 },                        │
│  { id, from: '/profile/addresses/create',            │
│    action: 'pick-partner', fieldName: 'partner',      │
│    createdAt: 1722000001000 }]                        │
└──────────────────────────────────────────────────────┘
```

## Полный поток

```
Шаг 1: /orders/create
  pointIndex=0, жмёт «+ создать адрес»
  → pushContext({ from: '/orders/create', action: 'pick-address', pointIndex: 0 })
  → router.push('/profile/addresses/create?ctx=ctx001')

Шаг 2: /profile/addresses/create?ctx=ctx001
  В автокомплите партнёра — жмёт «+ создать партнёра»
  → pushContext({ from: '/profile/addresses/create', action: 'pick-partner', fieldName: 'partner' })
  → router.push('/profile/partners/create?ctx=ctx002')

Шаг 3: /profile/partners/create?ctx=ctx002
  Заполнил форму → submit → partner._id = 'p42'
  → popContext('ctx002') → { action: 'pick-partner', fieldName: 'partner', from: '...' }
  → router.push('/profile/addresses/create?ctx=ctx001&newPartnerId=p42')

Шаг 4: /profile/addresses/create?ctx=ctx001&newPartnerId=p42
  Партнёр уже в URL → автозаполнен в форме
  Заполнил остальное → submit → address._id = 'a7'
  → popContext('ctx001') → { action: 'pick-address', pointIndex: 0, from: '/orders/create' }
  → router.push('/orders/create?newAddressId=a7&pointIndex=0')

Шаг 5: /orders/create?newAddressId=a7&pointIndex=0
  onMounted: routePoints[0].addressId = 'a7'
  router.replace('/orders/create') ← убираем query из URL
```

## Перезагрузка страницы

Пользователь на шаге 2, перезагрузил браузер:

1. `onMounted` страницы читает `query.ctx`
2. Проверяет `localStorage`: контекст `ctx001` существует → страница знает, что это «возвратный» вызов
3. Ничего не делает — контекст остаётся в стеке. Пользователь продолжает создание
4. Если пользователь передумал — кнопка «Отмена» вызывает `popContext(ctxId)` + `router.back()`
5. Если контекст провисел >30 минут — автоочистка при следующем `pushContext`

## Файлы

### `shared/composables/useReturnContext.ts`

```ts
import { nanoid } from 'nanoid'

interface ReturnContext {
  id: string
  from: string
  action: string
  params: Record<string, unknown>
  createdAt: number
}

const STORAGE_KEY = 'return-context-stack'
const TTL = 30 * 60 * 1000

function readStack(): ReturnContext[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function writeStack(stack: ReturnContext[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stack))
}

/**
 * Сохранить контекст и получить ID для передачи в URL.
 */
export function pushContext(
  from: string,
  action: string,
  params: Record<string, unknown>,
): string {
  const stack = readStack().filter((c) => Date.now() - c.createdAt < TTL)
  const ctx: ReturnContext = {
    id: nanoid(8),
    from,
    action,
    params,
    createdAt: Date.now(),
  }
  stack.push(ctx)
  writeStack(stack)
  return ctx.id
}

/**
 * Извлечь и удалить контекст. Возвращает null, если контекст не найден или истёк.
 */
export function popContext(contextId: string): ReturnContext | null {
  const stack = readStack()
  const idx = stack.findIndex(
    (c) => c.id === contextId && Date.now() - c.createdAt < TTL,
  )
  if (idx === -1) return null
  const [ctx] = stack.splice(idx, 1)
  writeStack(stack)
  return ctx
}

/**
 * Прочитать контекст без удаления (для проверки валидности).
 */
export function getContext(contextId: string): ReturnContext | null {
  return (
    readStack().find(
      (c) => c.id === contextId && Date.now() - c.createdAt < TTL,
    ) ?? null
  )
}
```

### Страница-источник: `pages/orders/create.vue`

```vue
<script setup lang="ts">
import { pushContext } from '@/shared/composables/useReturnContext'

const route = useRoute()
const router = useRouter()

// Восстановление после возврата с созданной сущностью
onMounted(() => {
  const { newAddressId, newPartnerId, pointIndex, ...rest } = route.query
  if (newAddressId !== undefined && pointIndex !== undefined) {
    routePoints.value[Number(pointIndex)].addressId = newAddressId as string
    // Убираем query-параметры из URL, чтобы не сработало при перезагрузке
    router.replace({ query: rest })
  }
})

function onNeedCreateAddress(pointIndex: number): void {
  const ctxId = pushContext('/orders/create', 'pick-address', { pointIndex })
  router.push(`/profile/addresses/create?ctx=${ctxId}`)
}

function onNeedCreatePartner(pointIndex: number): void {
  const ctxId = pushContext('/orders/create', 'pick-partner', { pointIndex })
  router.push(`/profile/partners/create?ctx=${ctxId}`)
}
</script>
```

### Промежуточная страница: `pages/profile/address/create.vue`

```vue
<script setup lang="ts">
import { pushContext, popContext, getContext } from '@/shared/composables/useReturnContext'

const route = useRoute()
const router = useRouter()
const ctxId = (route.query.ctx as string) || ''

// Данные, переданные через URL после возврата
const partnerIdFromReturn = computed(() => route.query.newPartnerId as string)
const selectedPartnerId = ref<string>(partnerIdFromReturn.value || '')

// При загрузке: проверить, что ctx валиден (не истёк, не удалён)
const isValidReturnContext = computed(() => !!getContext(ctxId))

async function onSubmit(): Promise<void> {
  const address = await api.create({ ...formState.value, partner: selectedPartnerId.value })

  if (ctxId) {
    const ctx = popContext(ctxId)
    if (ctx) {
      // Возврат на страницу-источник с созданным ID
      router.push({
        path: ctx.from,
        query: {
          newAddressId: address._id,
          ...ctx.params,
        },
      })
      return
    }
  }

  // Обычный сценарий: без возвратного контекста
  router.push('/profile/addresses')
}

function onNeedCreatePartner(): void {
  const newCtxId = pushContext(route.fullPath, 'pick-partner', { fieldName: 'partner' })
  router.push(`/profile/partners/create?ctx=${newCtxId}`)
}

function onCancel(): void {
  if (ctxId) {
    popContext(ctxId)
    router.back()
  } else {
    router.push('/profile/addresses')
  }
}
</script>
```

## Кто что импортит (FSD-карта)

```
shared/composables/useReturnContext.ts
  ← чистый примитив: только localStorage + nanoid
  ← НЕ знает о роутах, НЕ знает о сущностях

features/order/OrderForm.vue
  → entities/order/
  → shared/ui/, shared/composables/
  emit: 'need-create-address', 'need-create-partner'

features/address/CreateAddressForm.vue
  → entities/address/api.ts
  → shared/ui/
  emit: 'need-create-partner'
  ← использует @update:search для автокомплита

features/partner/CreatePartnerForm.vue
  → entities/partner/api.ts
  → shared/ui/

pages/orders/create.vue
  → features/order/OrderForm.vue
  → shared/composables/useReturnContext.ts

pages/profile/address/create.vue
  → features/address/CreateAddressForm.vue
  → entities/address/api.ts
  → shared/composables/useReturnContext.ts

pages/profile/partner/create.vue
  → features/partner/CreatePartnerForm.vue
  → entities/partner/api.ts
  → shared/composables/useReturnContext.ts
```

Ни одна feature не импортит другую. Страницы — точки композиции. `useReturnContext` — shared-примитив.

## Диалоги как модальный вариант

Для простых случаев (создание партнёра — 5 полей) можно использовать диалоги вместо переходов между страницами:

```ts
// shared/composables/useInlineCreate.ts
export function useInlineCreate() {
  const stack = ref<Array<{
    entity: string
    resolve: (item: unknown) => void
    reject: () => void
  }>>([])

  function open(entity: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      stack.value.push({ entity, resolve, reject })
    })
  }

  function onSuccess(entity: string, item: unknown): void {
    const idx = stack.value.findLastIndex((s) => s.entity === entity)
    if (idx === -1) return
    const [entry] = stack.value.splice(idx, 1)
    entry.resolve(item)
  }

  function onCancel(entity: string): void {
    const idx = stack.value.findLastIndex((s) => s.entity === entity)
    if (idx === -1) return
    const [entry] = stack.value.splice(idx, 1)
    entry.reject()
  }

  const current = computed(() => stack.value[stack.value.length - 1] ?? null)

  return { stack, current, open, onSuccess, onCancel }
}
```

Использование: ровно так же, только вместо `pushContext/popContext` — `open/onSuccess`. Для диалогов контекст живёт в памяти (Promise), для страниц — в localStorage.

## Сравнение: диалог vs страница

| Характеристика | Диалог | Страница |
|---|---|---|
| Где контекст | Promise в памяти | localStorage |
| Перезагрузка | ❌ теряется | ✅ восстанавливается |
| Сложность формы | простые (3-5 полей) | сложные (10+ полей, файлы) |
| Вложенность | ограничена UI | любая глубина |
| UX | мгновенно | переход с анимацией |
| Реализация | ~30 строк | ~50 строк |

Можно комбинировать: партнёра создаём в диалоге (он простой), адрес — на отдельной странице (сложный, с файлами). Оба используют **один и тот же стек** в `useReturnContext`.

## Граничные случаи

### Пользователь закрыл вкладку посреди цепочки

При следующем `pushContext()` все истёкшие контексты (>30 мин) удаляются из localStorage. Если пользователь вернулся на `/profile/addresses/create?ctx=expired` — `getContext()` вернёт null, страница работает в обычном режиме без возврата.

### Пользователь нажал «назад» в браузере вместо «отмена»

Стек не чистится. При следующем `pushContext()` — автоочистка по TTL. Это не ломает функциональность, просто оставляет мусор в localStorage на 30 минут.

### Два параллельных создания

Невозможно: стек гарантирует, что в каждый момент активен только один возвратный контекст. Пользователь не может инициировать второе создание, пока не завершит первое.

### Одно и то же действие из разных мест

```ts
pushContext('/orders/create', 'pick-address', { pointIndex: 2 })
// ... и позже
pushContext('/orders/create', 'pick-address', { pointIndex: 5 })
```

Оба контекста корректно различаются по `params.pointIndex`. При возврате каждый попадёт в свой routePoint.

## TTL и безопасность

- **TTL = 30 минут.** Достаточно для заполнения даже сложной формы с перерывом. Не настолько долго, чтобы localStorage разрастался.
- **Автоочистка** при каждом `pushContext()` — все истёкшие записи удаляются.
- **Валидация при чтении** — `popContext()` и `getContext()` проверяют TTL и возвращают null для истёкших.
- **Никаких чувствительных данных** — только ID сущностей и номера индексов. Никаких токенов, паролей, персональных данных.
