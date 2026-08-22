# FSD: вложенное создание сущностей и возвратный контекст

## Проблема

Пользователь на форме создания/редактирования сущности (заявка, адрес, простой) не находит нужное значение в автокомплите. Хочет создать связанную сущность, не закрывая текущую форму. После создания — вернуться с уже выбранным значением.

```
DowntimeForm → edit Partner → return to DowntimeForm (partner выбран)
AddressForm → create Region → create City → return to AddressForm (region + city выбраны)
OrderForm → create Address → return to OrderForm (address выбран в точке маршрута)
```

Возможна перезагрузка страницы на любом шаге, и цепочка не должна потеряться.

## Ограничения FSD

- **entity** не может импортировать другую entity
- **feature** не может импортировать другую feature
- Только **page** может импортировать несколько фич

Следовательно, композиция сценариев — задача страницы.

## Архитектура: Return-context stack

Стек контекстов в `sessionStorage` — каждый шаг «хочу создать сущность и вернуться» кладёт запись. При создании — забирает верхнюю запись и делает `router.replace()` обратно (не `router.push`, чтобы не засорять историю).

```
sessionStorage: 'return-context-stack' (TTL 30 минут)

┌──────────────────────────────────────────────────────┐
│ [{ id, from: '/profile/downtimes/create',             │
│    action: 'pick-partner', fieldName: 'partner',      │
│    createdAt: 1722000000000 },                        │
│  { id, from: '/profile/addresses/create',            │
│    action: 'edit-region', fieldName: 'region',        │
│    id: 'r42',                                         │
│    createdAt: 1722000001000 }]                        │
└──────────────────────────────────────────────────────┘
```

## Реализация

### `shared/composables/useReturnContext.js`

Чистый примитив — только `sessionStorage` + `uuid`. Не знает о роутах и сущностях.

ID генерируется через `uuid.v4()` с `.slice(0, 8)`.

```js
import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'return-context-stack'
const TTL = 30 * 60 * 1000

export function pushContext(from, action, params = {}) { ... }
export function popContext(contextId) { ... }
export function getContext(contextId) { ... }
export function cleanupExpiredContexts() { ... }
```

`popContext` — извлекает И удаляет контекст. `getContext` — читает без удаления (для `isReturnContext`).

### `shared/composables/useReturnContextPage.js`

Хук для страниц создания/редактирования, участвующих в возвратном контексте (Region, City, Zone, Partner).

**Параметры:**
- `service` — объект с методами `getById`, `create`, `updateOne`, `deleteById`
- `id` — Ref или геттер ID сущности
- `options.returnContextField` — имя query-параметра при создании/сохранении (напр. `'newCityId'`)
- `options.returnContextClearField` — имя query-параметра при удалении (напр. `'clearedCity'`)
- `options.detailsRouteName` — имя роута для редиректа после `create` в режиме `saveOnly`

**Логика submit** (при `ctxId` в query):
```js
const ctx = popContext(ctxId)
if (ctx && options.returnContextField) {
  router.replace({
    path: ctx.from,
    query: { [options.returnContextField]: item.value?._id, ...ctx.params },
  })
  return
}

// saveOnly — остаться на странице редактирования
if (saveOnly && !getId() && options.detailsRouteName) {
  router.replace({ name: options.detailsRouteName, params: { id: item.value?._id } })
  return
}

router.go(-1) // без ctx
```

**Логика deleteHandler** (при `ctxId`):
```js
const ctx = popContext(ctxId)
if (ctx && options.returnContextClearField) {
  router.replace({
    path: ctx.from,
    query: { [options.returnContextClearField]: true, ...ctx.params },
  })
  return
}
router.go(-1)
```

**Логика cancel** (при `ctxId`):
```js
popContext(ctxId)  // чистит контекст без возврата
router.go(-1)
```

## Текущие страницы: обзор

### Страницы, использующие `pushContext` (источники)

| Страница | Куда переходит | action | query-параметры возврата |
|----------|---------------|--------|-------------------------|
| `address/details.vue` | Region, City, Partner, Zone | `pick-*` / `edit-*` | `newRegionId`, `newCityId`, `newPartnerId`, `newZoneId`, `clearedRegion`, `clearedCity`, `clearedPartner`, `clearedZone`, `clearedAddress` |
| `downtime/details.vue` | Partner | `pick-partner` / `edit-partner` | `newPartnerId`, `clearedPartner` |
| `orders/details.vue` | Address | `pick-address` / `edit-address` | `newAddressId`, `pointIndex`, `action` |
| `scheduleNote/details.vue` | — | — | — (пока не использует) |

### Страницы, принимающие возврат (обработчики)

| Страница | Механизм обнаружения | Механизм применения |
|----------|---------------------|-------------------|
| `address/details.vue` | `watch(() => route.query, ...)` в `useAddressForm.ts` | `useAddressForm.ts` применяет параметры и делает `router.replace` для очистки query |
| `downtime/details.vue` | `watch(() => route.query, ...)` в `useDowntimeForm.ts` | `useDowntimeForm.ts` применяет `newPartnerId`/`clearedPartner` и чистит query |
| `orders/details.vue` | `created()` → `applyReturnAddress()` | устанавливает `route[pointIndex].address` и чистит query |

### Страницы, использующие `useReturnContextPage` (целевые)

| Страница | returnContextField | returnContextClearField | detailsRouteName |
|----------|-------------------|------------------------|------------------|
| `region/details.vue` | `newRegionId` | `clearedRegion` | `RegionDetails` |
| `city/details.vue` | `newCityId` | `clearedCity` | `CityDetails` |
| `zone/details.vue` | `newZoneId` | `clearedZone` | `ZoneDetails` |
| `partner/details.vue` | `newPartnerId` | `clearedPartner` | `PartnerDetails` |

## Полный поток (на примере address → region)

```
Шаг 1: /profile/addresses/create?truck=...
  Заполняет форму адреса. Autocomplete «Регион» — не находит нужный.
  Жмёт «+ создать регион» (кнопка в RegionAutocomplete).

  pushContext(route.path, 'pick-region', { fieldName: 'region' })
  → router.push('/profile/regions/create?ctx=ctx001')

Шаг 2: /profile/regions/create?ctx=ctx001
  RegionDetails использует useReturnContextPage.
  Заполнил форму → submit → region._id = 'r42'

  popContext('ctx001') → { action: 'pick-region', from: '/profile/addresses/create', ... }
  → router.replace('/profile/addresses/create?ctx=orig&newRegionId=r42&fieldName=region')

Шаг 3: /profile/addresses/create?ctx=orig&newRegionId=r42&fieldName=region
  useAddressForm.ts watch срабатывает:
    state.value.region = 'r42'
    router.replace({ query: { ...остальные_параметры } }) — убирает return-параметры

  Поле «Регион» заполнено значением 'r42'.
```

История браузера остаётся чистой: `[...previous, address_create]`. `router.go(-1)` при отмене/сохранении работает корректно.

## Полный поток (OrderForm → create Address)

```
Шаг 1: /orders/create
  Заполняет форму рейса. В точке маршрута адрес не найден.
  Жмёт «+ создать адрес».

  pushContext('/orders/create', 'pick-address', { pointIndex: 0, action: 'select' })
  → router.push('/profile/addresses/create?ctx=ctx002')

Шаг 2: /profile/addresses/create?ctx=ctx002
  В автокомплите партнёра жмёт «+ создать партнёра».

  pushContext('/profile/addresses/create', 'pick-partner', { fieldName: 'partner' })
  → router.push('/profile/partners/create?ctx=ctx003')

Шаг 3: /profile/partners/create?ctx=ctx003
  Сохраняет партнёра → partner._id = 'p42'
  popContext('ctx003') → router.replace('/profile/addresses/create?ctx=ctx002&newPartnerId=p42')

Шаг 4: /profile/addresses/create?ctx=ctx002&newPartnerId=p42
  useAddressForm.ts применяет partner = 'p42'.
  Сохраняет адрес → address._id = 'a7'
  popContext('ctx002') → router.replace('/orders/create?newAddressId=a7&pointIndex=0&action=select')

Шаг 5: /orders/create?newAddressId=a7&pointIndex=0&action=select
  orders/details.vue applyReturnAddress():
    this.item.route[0].address = 'a7'
    this.$router.replace({ query: {} }) — убирает return-параметры

  Точка маршрута заполнена адресом 'a7'.
```

## Навигация при возврате

Все целевые страницы используют `router.replace` при возврате. Это не добавляет лишних записей в историю и не требует `router.go(-2)` или других хаков.

- Целевая страница (`region/details.vue`, `city/details.vue`, `zone/details.vue`, `partner/details.vue`) — `useReturnContextPage` делает `router.replace`.
- `address/details.vue` — `submit`/`deleteHandler` делают `router.replace`.
- `orders/details.vue` — `applyReturnAddress` делает `router.replace` для очистки одноразовых query-параметров.

## Как форма подхватывает возвращённые параметры

### useDowntimeForm.ts

```ts
const RETURN_QUERY_KEYS = ['newPartnerId', 'clearedPartner']
let returnQueryApplied = false
const returnPatch: Partial<DowntimeFormState> = {}

function applyReturnQuery() {
  if (returnQueryApplied) return
  const query = route.query
  if (!RETURN_QUERY_KEYS.some((k) => query[k])) return

  if (query.newPartnerId) returnPatch.partner = query.newPartnerId as string
  if (query.clearedPartner) returnPatch.partner = null

  state.value = { ...state.value, ...returnPatch }
  returnQueryApplied = true

  const cleanedQuery = { ...query }
  RETURN_QUERY_KEYS.forEach((k) => delete cleanedQuery[k])
  router.replace({ query: cleanedQuery })
}

watch(() => route.query, applyReturnQuery, { immediate: true })
```

Черновик восстанавливается при любом монтировании (не только при возвратном контексте).

### useAddressForm.ts

```ts
const RETURN_QUERY_KEYS = [
  'newRegionId', 'newCityId', 'clearedRegion', 'clearedCity',
  'newPartnerId', 'clearedPartner', 'newZoneId', 'clearedZone',
  'newAddressId', 'clearedAddress',
]
let returnQueryApplied = false
const returnPatch: Partial<AddressFormState> = {}

function applyReturnQuery() {
  if (returnQueryApplied) return
  const query = route.query
  if (!RETURN_QUERY_KEYS.some((k) => query[k])) return

  if (query.newRegionId) returnPatch.region = query.newRegionId as string
  if (query.clearedRegion) returnPatch.region = null
  // ... аналогично для city, partner, zone, address

  state.value = { ...state.value, ...returnPatch }
  returnQueryApplied = true

  const cleanedQuery = { ...query }
  RETURN_QUERY_KEYS.forEach((k) => delete cleanedQuery[k])
  router.replace({ query: cleanedQuery })
}

watch(() => route.query, applyReturnQuery, { immediate: true })

watch(() => props.address, (val) => {
  state.value = { ...initialState, ...(val || {}), ...returnPatch }
}, { deep: true })
```

`returnPatch` сохраняет возвращённые значения, чтобы они не терялись после асинхронной загрузки `props.address` в режиме редактирования.

## Сводная таблица query-параметров возврата

| Параметр | Значение | Устанавливается при | Обрабатывается в |
|----------|----------|---------------------|------------------|
| `newRegionId` | `_id` региона | submit RegionDetails | `useAddressForm.ts` |
| `clearedRegion` | `true` | delete RegionDetails | `useAddressForm.ts` |
| `newCityId` | `_id` города | submit CityDetails | `useAddressForm.ts` |
| `clearedCity` | `true` | delete CityDetails | `useAddressForm.ts` |
| `newPartnerId` | `_id` партнёра | submit PartnerDetails | `useAddressForm.ts`, `useDowntimeForm.ts` |
| `clearedPartner` | `true` | delete PartnerDetails | `useAddressForm.ts`, `useDowntimeForm.ts` |
| `newZoneId` | `_id` зоны | submit ZoneDetails | `useAddressForm.ts` |
| `clearedZone` | `true` | delete ZoneDetails | `useAddressForm.ts` |
| `newAddressId` | `_id` адреса | submit AddressDetails | `orders/details.vue` |
| `pointIndex` | индекс точки в `route` | `pushContext` из `orders/details.vue` | `orders/details.vue` |

## Автокомплиты

### `shared/ui/AppAutocomplete/AppAutocomplete.vue`

Универсальная основа. Работает в двух режимах:
- **Клиентский** — передать `:items`.
- **Серверный** — передать `:fetch-items` и `:fetch-by-id`.

Целевые обёртки живут в `entities/X/ui/XAutocomplete.vue`.

```vue
<AppAutocomplete
  v-model="form.regionId"
  :fetch-items="fetchRegions"
  :fetch-by-id="fetchRegionById"
  show-action
  @create="$emit('create')"
  @edit="$emit('edit', $event)"
/>
```

`AppAutocomplete` **не** использует `vue-router`. Кнопки create/edit только эмитят события. Родитель (страница) решает, куда переходить и вызывать `pushContext`.

### `entities/address/ui/AddressAutocomplete.vue`

```vue
<AddressAutocomplete
  v-model="state.address"
  :pointType="!state.isReturn ? state.type : null"
  hint="Контакты: ..."
  show-action
  @create="$emit('need-create-address')"
  @edit="$emit('need-edit-address', $event)"
/>
```

- `pointType` — `'loading' | 'unloading' | 'service' | null`, фильтрует список адресов по типу точки.
- `fetchItems`/`fetchById` сейчас работают локально: фильтруют `addressStore.addressesForAutocomplete` и ищут в `addressStore.addressMap`.
- После появления серверного эндпоинта `/addresses/search` достаточно заменить реализацию `fetchItems`/`fetchById`.

### RegionAutocomplete / CityAutocomplete / PartnerAutocomplete / ZoneAutocomplete

Все обёртки уже принимают `fetchItems`/`fetchById`. Сейчас это локальная фильтрация по загруженным из стора данным. Когда на backend появятся `/search` и `/getById`, заменить на серверные вызовы.

## Подключение address create/edit на форме рейса

Реализовано:

1. `pointDetail.vue` использует `AddressAutocomplete` с `show-action`.
2. `routePoints.vue` и `orderForm.vue` пробрасывают `need-create-address` / `need-edit-address` вверх.
3. `orders/details.vue` добавляет обработчики:

```js
function onNeedCreateAddress(pointIndex) {
  const ctxId = pushContext(this.$route.path, 'pick-address', { pointIndex, action: 'select' })
  this.$router.push({ name: 'AddressCreate', query: { ctx: ctxId } })
}

function onNeedEditAddress(addressId, pointIndex) {
  const ctxId = pushContext(this.$route.path, 'edit-address', {
    pointIndex,
    action: 'select',
    id: addressId,
  })
  this.$router.push({
    name: 'AddressDetails',
    params: { id: addressId },
    query: { ctx: ctxId },
  })
}
```

4. `orders/details.vue` при загрузке вызывает `applyReturnAddress()`:

```js
applyReturnAddress() {
  const { newAddressId, pointIndex } = this.$route.query
  if (newAddressId === undefined || pointIndex === undefined) return
  const index = Number(pointIndex)
  if (!this.item || !this.item.route || !this.item.route[index]) return
  this.item.route[index].address = newAddressId

  const query = { ...this.$route.query }
  ;['newAddressId', 'pointIndex', 'action'].forEach((k) => delete query[k])
  this.$router.replace({ query })
}
```

## FSD-карта (актуальная)

```
shared/composables/useReturnContext.js
  ← чистый примитив: только sessionStorage + uuid
  ← НЕ знает о роутах, НЕ знает о сущностях

shared/composables/useReturnContextPage.js
  ← popContext, getContext
  ← хук для Region/City/Zone/Partner страниц
  ← router.replace при возврате
  ← поддержка saveOnly

shared/ui/AppAutocomplete/AppAutocomplete.vue
  ← универсальный автокомплит
  ← fetchItems + fetchById
  ← НЕ знает о vue-router, только emit create/edit

entities/address/ui/AddressAutocomplete.vue
  ← обёртка над AppAutocomplete
  ← локальные fetchItems/fetchById
  ← pointType, hint

entities/region/ui/RegionAutocomplete.vue
entities/city/ui/CityAutocomplete.vue
entities/partner/ui/PartnerAutocomplete.vue
entities/zone/ui/ZoneAutocomplete.vue
  ← обёртки с локальными fetchItems/fetchById

features/address/form/useAddressForm.ts
  ← читает route.query.*Return* параметры
  ← заполняет поля формы
  ← returnPatch для сохранения значений после загрузки props.address

features/downtime/form/useDowntimeForm.ts
  ← читает route.query.newPartnerId/clearedPartner
  ← восстанавливает черновик из sessionStorage при любом монтировании

features/order/form/orderRoute/pointDetail.vue
  ← AddressAutocomplete
  ← эмиты need-create-address / need-edit-address

features/order/form/orderRoute/routePoints.vue
features/order/form/orderForm.vue
  ← проброс need-create-address / need-edit-address

pages/orders/details.vue
  → pushContext для адреса
  → applyReturnAddress
  → router.replace для очистки query

pages/profile/address/details.vue
  → pushContext для region/city/partner/zone
  → popContext при submit/delete
  → router.replace при возврате
  → ctxId обрабатывается и при создании, и при редактировании

pages/profile/partner/details.vue
  → useReturnContextPage
  → router.replace при возврате
  → saveOnly

pages/profile/downtime/details.vue
  → pushContext для partner
  → watch route.query в useDowntimeForm

pages/profile/region/details.vue
  → useReturnContextPage(RegionService, id, { newRegionId, clearedRegion, detailsRouteName: 'RegionDetails' })

pages/profile/city/details.vue
  → useReturnContextPage(CityService, id, { newCityId, clearedCity, detailsRouteName: 'CityDetails' })

pages/profile/zone/details.vue
  → useReturnContextPage(ZoneService, id, { newZoneId, clearedZone, detailsRouteName: 'ZoneDetails' })
```

## Граничные случаи

### Пользователь закрыл вкладку посреди цепочки

При следующем `pushContext()` все истёкшие контексты (>30 мин) удаляются из `sessionStorage`. Если пользователь вернулся на `/profile/addresses/create?ctx=expired` — `getContext()` вернёт null, страница работает в обычном режиме без возврата.

### Пользователь нажал «назад» в браузере вместо «отмена»

Стек не чистится. При следующем `pushContext()` — автоочистка по TTL (30 минут).

### Два параллельных создания

Невозможно: пользователь не может инициировать второе создание, пока не завершит первое — навигация в браузере последовательная.

### Одно и то же действие из разных мест

```js
pushContext('/orders/create', 'pick-address', { pointIndex: 2 })
pushContext('/orders/create', 'pick-address', { pointIndex: 5 })
```

Оба контекста корректно различаются по `params.pointIndex`.

### saveOnly

`useReturnContextPage` поддерживает режим `saveOnly` (кнопка «Сохранить» без возврата). При `saveOnly` и отсутствии `id` происходит `create`, после чего `router.replace` на страницу редактирования (`detailsRouteName`).

При активном возвратном контексте `saveOnly` игнорируется — приоритет у возврата к вызывающей странице.

## TTL и безопасность

- **TTL = 30 минут.** Автоочистка при каждом `pushContext()`.
- **Валидация при чтении** — `popContext()` и `getContext()` проверяют TTL.
- **Никаких чувствительных данных** — только ID сущностей и номера индексов.
- **sessionStorage** — стек изолирован по вкладкам, не конфликтует между вкладками.

## Что осталось для перехода на серверный поиск

1. Добавить backend-эндпоинты `/search` для `region`, `city`, `zone`, `partner`.
2. Добавить backend-эндпоинт `/addresses/search`.
3. Заменить `fetchItems`/`fetchById` в entity-обёртках с локальной фильтрации на серверные вызовы.

Интерфейс `AppAutocomplete` уже готов.
