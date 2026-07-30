---
name: autocomplete-wrapper
description: Use when creating an entity-specific autocomplete wrapper over the shared AppAutocomplete component. Covers the thin-wrapper pattern with local data (Vuex/Pinia) and server-side search, create/edit routes, and FSD placement.
---

# Entity Autocomplete Wrapper Pattern

Универсальный `AppAutocomplete` в `shared/ui/AppAutocomplete/AppAutocomplete.vue`.
Для каждой сущности делаем тонкую обёртку в `entities/X/ui/XAutocomplete.vue`.

## API AppAutocomplete (для справки)

| Проп | Тип | Описание |
|------|-----|----------|
| `v-model` | `string \| string[] \| null` | Выбранное значение |
| `items` | `Item[]` | Локальный массив (статика) |
| `fetchItems` | `(query: string) => Promise<Item[]>` | Серверный поиск |
| `fetchById` | `(id: string) => Promise<Item \| null>` | Загрузка по ID (для labelOnly) |
| `label` | `string` | |
| `disabled` | `boolean` | |
| `hideDetails` | `boolean` | |
| `multiple` | `boolean` | |
| `clearable` | `boolean` | |
| `labelOnly` | `boolean` | Только текст (read-only) |
| `createRoute` | `RouteLocationRaw` | Кнопка «+» |
| `editRoute` | `RouteLocationRaw` | Кнопка «✎» |

## Шаблон обёртки (локальные данные)

```vue
<!-- entities/X/ui/XAutocomplete.vue -->
<template>
  <AppAutocomplete
    v-model="model"
    :label="label"
    :disabled="disabled"
    :hide-details="hideDetails"
    :items="items"
    :create-route="{ name: 'XxxCreate' }"
    :edit-route="model ? { name: 'XxxDetails', params: { id: model } } : undefined"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
// для Pinia: import { useXxxStore } from '@/entities/xxx/xxxStore'
import AppAutocomplete from '@/shared/ui/AppAutocomplete/AppAutocomplete.vue'

defineOptions({ name: 'XxxAutocomplete' })

withDefaults(
  defineProps<{
    label?: string
    disabled?: boolean
    hideDetails?: boolean
  }>(),
  { disabled: false, hideDetails: false }
)

const store = useStore()
// const xxxStore = useXxxStore()  // для Pinia

const model = defineModel<string | null>()

const items = computed(() => {
  // Данные из Vuex или Pinia
  // Формат: { value: string, text: string }
  return store.getters.xxxForAutocomplete || []
  // или: return xxxStore.items.map(i => ({ value: i._id, text: i.name }))
})
</script>
```

## Шаблон обёртки (серверный поиск)

```vue
<!-- entities/worker/ui/WorkerAutocomplete.vue -->
<template>
  <AppAutocomplete
    v-model="model"
    :label="label"
    :disabled="disabled"
    :hide-details="hideDetails"
    :fetch-items="fetchItems"
    :fetch-by-id="fetchById"
    :create-route="{ name: 'WorkerCreate' }"
    :edit-route="model ? { name: 'WorkerDetails', params: { id: model } } : undefined"
  />
</template>

<script setup lang="ts">
import AppAutocomplete from '@/shared/ui/AppAutocomplete/AppAutocomplete.vue'
import { XxxService } from '@/shared/services'

defineOptions({ name: 'WorkerAutocomplete' })

withDefaults(
  defineProps<{
    label?: string
    disabled?: boolean
    hideDetails?: boolean
  }>(),
  { disabled: false, hideDetails: false }
)

const model = defineModel<string | null>()

async function fetchItems(query: string) {
  const items = (await XxxService.getForAutocomplete({ searchStr: query })) || []
  return items.map((i: any) => ({ value: i._id, text: i.fullName || i.name }))
}

async function fetchById(id: string) {
  const items = (await XxxService.getForAutocomplete({ id })) || []
  if (!items.length) return null
  const i = items[0]
  return { value: i._id, text: i.fullName || i.name }
}
</script>
```

## Использование в форме

```vue
<RegionAutocomplete v-model="form.regionId" label="Регион" />
<WorkerAutocomplete v-model="form.workerId" label="Сотрудник" />
```

Роуты для create/edit встроены в обёртку. Данные — тоже. Форме ничего не нужно знать о том, как загружаются данные.

## FSD-размещение

- **`entities/X/ui/XAutocomplete.vue`** — обёртка для сущности X
- **`shared/ui/AppAutocomplete/AppAutocomplete.vue`** — универсальная основа

Не класть обёртки в shared — они зависят от конкретной сущности (сервис, Vuex/Pinia).
