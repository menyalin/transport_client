---
name: vue-migration-script-setup
description: Use ONLY when migrating a Vue component from Options API to Composition API with `<script setup>`. This skill provides step-by-step migration rules, including analyzing parent usage and simplifying with defineModel.
---

# Миграция на `<script setup>` с упрощением через defineModel

## Процесс

1. **Найти все места использования компонента** во всём проекте (grep по имени компонента).
2. **Определить паттерн v-model** в текущем компоненте и в местах использования:
   - Vue 2: `model: { prop: 'value', event: 'change' }` + `$emit('change', ...)` — в шаблонах может быть `:value="..." @change="..."` или `v-model="..."`.
   - Vue 3: `props: { modelValue: ... }` + `emit('update:modelValue', ...)` — в шаблонах `v-model="..."`.
   - Связанные пропсы: если есть `value` / `modelValue` / кастомный проп из `model`, и событие `change` / `input` / `update:...` — это кандидат на `defineModel()`.
3. **После определения паттерна v-model — заменить на `defineModel()`.** Это автоматически даёт корректную двустороннюю привязку для Vue 3.

## Правила миграции: Options API → script setup + defineModel

### Общий шаблон

```vue
<!-- ДО: Options API с v-model -->
<template>
  <v-text-field
    :value="modelValue"
    @input="$emit('update:modelValue', $event)"
  />
</template>

<script>
export default {
  name: 'AppInput',
  props: { modelValue: [String, Number] },
  emits: ['update:modelValue'],
}
</script>
```

```vue
<!-- ПОСЛЕ: script setup с defineModel -->
<template>
  <v-text-field v-model="model" />
</template>

<script setup>
const model = defineModel({ type: [String, Number] })
</script>
```

### Для шаблона `model: { prop, event }` (Vue 2 совместимость)

```vue
<!-- ДО -->
<template>
  <v-autocomplete
    :value="value"
    @change="$emit('change', $event)"
  />
</template>

<script>
export default {
  name: 'AppZoneAutocomplete',
  model: { prop: 'value', event: 'change' },
  props: { value: [String, Array] },
}
</script>
```

```vue
<!-- ПОСЛЕ -->
<template>
  <v-autocomplete v-model="model" />
</template>

<script setup>
const model = defineModel({ type: [String, Array] })
</script>
```

Важно: в местах использования компонента:
- `:value="x" @change="fn"` → `v-model="x"` или оставить как есть (defineModel поддерживает обе формы)
- `v-model="x"` — работает без изменений

### Для нескольких v-model (v-model:something)

```vue
<!-- ДО -->
<script>
export default {
  props: { visible: Boolean, title: String },
  emits: ['update:visible', 'update:title'],
}
</script>
```

```vue
<!-- ПОСЛЕ -->
<script setup>
const visible = defineModel('visible', { type: Boolean })
const title = defineModel('title', { type: String })
</script>
```

В шаблонах использования:
```vue
<MyDialog v-model:visible="show" v-model:title="name" />
```

### Когда НЕ использовать defineModel

- Если компонент не использует v-model (нет пропса для value/modelValue и соответствующего emit)
- Если v-model реализована через computed с get/set + внутреннее состояние (сначала упростить, потом смотреть)
- Пропсы без v-model, например `:items`, `:headers`, `@click` — не трогать

### Проверка после миграции

1. `npm run lint` — не должно быть ошибок
2. Проверить, что импорт `defineModel` не нужен (это макрос, импортируется автоматически)
3. Проверить, что все использования компонента в шаблонах работают с новой сигнатурой
4. Если компонент использовал `this.$emit('change', val)` и у него был `model: { event: 'change' }` — заменить emit на модель, а все `@change` на местах использования можно также заменить на `v-model`

## Типичные ошибки при миграции

- Забыли заменить `this.$emit('update:xxx')` — в script setup нет `this`, emit получаем из `defineEmits`
- Использовали `this.someMethod()` — заменить на прямые вызовы функций
- `this.$store` — заменить на импорт стора
- Оставили `model: {}` в Options API при частичной миграции — если компонент переписан полностью, удалить
