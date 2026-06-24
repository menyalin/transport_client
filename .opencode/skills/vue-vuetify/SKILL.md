---
name: vue-vuetify
description: Use when working with Vue 3 components, Vuetify 4, Pinia stores, Vuelidate forms, FSD structure, or any Vue-related code in this project. Provides patterns for Composition API, script setup, state management, form validation, and routing.
---

# Vue 3 + Vuetify 4 Patterns

## Composition API & script setup

Все новые компоненты пишем на `<script setup>` с Composition API.

```vue
<script setup>
import { ref, computed, watch } from 'vue'
import { useSomeStore } from '@/shared/stores/someStore'

const props = defineProps({
  item: { type: Object, required: true },
})

const emit = defineEmits(['update:modelValue'])

const store = useSomeStore()
</script>
```

Типизация пропсов через `defineProps`, событий — через `defineEmits`.

`defineModel()` для v-model:

```vue
<script setup>
const model = defineModel({ type: Array, default: () => [] })
</script>
```

### Миграция с Options API на script setup

При переписывании компонента с Options API на script setup:
- `data()` → `ref()` / `reactive()`
- `computed: {}` → `computed(() => ...)`
- `methods: {}` → обычные функции
- `watch: {}` → `watch(() => ..., ...)` / `watch(ref, ...)`
- `props: {}` → `defineProps({})`
- `this.$emit(...)` → `emit(...)` из `defineEmits`
- `this.$store` → импорт нужного стора (Vuex или Pinia)
- `created()` / `mounted()` → код на верхнем уровне скрипта или `onMounted()`
- `model: { prop, event }` → `defineModel()`
- `this.$router` / `this.$route` → `useRouter()` / `useRoute()`
- `this.$vuetify` → `useTheme()` и другие композаблы Vuetify

## Vuetify 4

Используем Vuetify 4 с MD3. Ручной импорт через `use*` композаблы:
- `useTheme()` для темы
- `useDisplay()` для брейкпоинтов
- `useLocale()` для локализации

Компоненты доступны глобально через `autoImport: true` в `vite-plugin-vuetify`.

Vuetify 3 → 4 breaking changes смотреть в официальном гайде по миграции.

## Состояние

Новый код — Pinia (`defineStore`). Старый — Vuex.

```js
// shared/stores/exampleStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useExampleStore = defineStore('example', () => {
  const items = ref([])

  const itemCount = computed(() => items.value.length)

  async function fetchItems() {
    // ...
  }

  return { items, itemCount, fetchItems }
})
```

Vuex stores лежат в `src/store/` — их не трогаем без явной задачи на миграцию.

## Валидация форм (Vuelidate 2)

```vue
<script setup>
import { ref, computed } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, minLength, email } from '@vuelidate/validators'

const form = ref({ name: '', email: '' })

const rules = computed(() => ({
  name: { required, minLength: minLength(2) },
  email: { required, email },
}))

const v$ = useVuelidate(rules, form)
</script>
```

## Роутинг (vue-router 4)

```js
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
```

## Day.js

```js
import dayjs from 'dayjs'
import 'dayjs/locale/ru'

dayjs.locale('ru')
```

## API / Аксиос

```js
import api from '@/api' // готовый инстанс axios с перехватчиком токена
```

## FSD структура

```
shared/     — переиспользуемые ui, stores, utils, hooks
entities/   — доменные сущности (order, driver, truck, …)
features/   — фичи (order, docsRegistry, …)
widgets/    — композиции (docsRegistry, transportWaybillsInOrder, …)
pages/      — страницы
```

Компонент из `shared/ui/` не должен знать о доменной логике.
Стор из `entities/order/` не должен импортировать из `pages/`.
