<template>
  <span v-if="labelOnly">{{ displayText }}</span>
  <v-autocomplete
    v-else
    ref="inputRef"
    :model-value="modelValue"
    @update:model-value="onModelUpdate"
    :label="label"
    :items="resolvedItems"
    :item-title="itemTitle"
    :item-value="itemValue"
    :loading="loading"
    :disabled="disabled"
    :readonly="readonly"
    :hide-details="hideDetails"
    :multiple="multiple"
    :clearable="clearable"
    :hint="hint"
    :persistent-hint="persistentHint"
    :append-inner-icon="actionIcon"
    v-bind="autocompleteAttrs"
    @click:append-inner="onActionClick"
  >
    <template v-if="noDataText && !loading && !resolvedItems.length" #no-data>
      {{ noDataText }}
    </template>
  </v-autocomplete>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, useAttrs, type Ref } from 'vue'

defineOptions({ name: 'AppAutocomplete' })

interface Item {
  [key: string]: any
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | string[] | null
    label?: string
    items?: Item[]
    fetchItems?: (_query: string) => Promise<Item[]>
    fetchById?: (_id: string) => Promise<Item | null>
    itemTitle?: string
    itemValue?: string
    showAction?: boolean
    labelOnly?: boolean
    multiple?: boolean
    disabled?: boolean
    readonly?: boolean
    clearable?: boolean
    hideDetails?: boolean
    hint?: string
    persistentHint?: boolean
    noDataText?: string
  }>(),
  {
    itemTitle: 'text',
    itemValue: 'value',
    clearable: true,
    hideDetails: false,
    labelOnly: false,
    multiple: false,
    disabled: false,
    readonly: false,
    showAction: false,
    persistentHint: false,
    noDataText: '',
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string | string[] | null]
  create: []
  edit: [id: string | null]
  'update:search': [value: string | null]
  error: [error: unknown]
}>()

const inputRef = ref<{ focus: () => void } | null>(null)
const attrs = useAttrs()

const isServerMode = computed(() => !!props.fetchItems)

const loading = ref(false)
const searchQuery = ref<string | null>(null)
const fetchedItems: Ref<Item[]> = ref([])

let debounceTimer: ReturnType<typeof setTimeout>

const resolvedItems = computed<Item[]>(() => {
  if (isServerMode.value) return fetchedItems.value
  return props.items || []
})

const currentModel = computed(() => props.modelValue)

const actionIcon = computed(() => {
  if (props.disabled || props.readonly) return undefined
  if (!props.showAction) return undefined

  const val = currentModel.value
  if (props.multiple) {
    if (Array.isArray(val) && val.length > 1) return undefined
    if (Array.isArray(val) && val.length === 1) return 'mdi-pencil'
    return 'mdi-plus-circle'
  }
  return val ? 'mdi-pencil' : 'mdi-plus-circle'
})

const serverModeAttrs = computed(() => {
  if (!isServerMode.value) return {}
  return {
    'no-filter': true,
    'custom-filter': () => true,
    search: searchQuery.value,
    'onUpdate:search': onSearchInput,
  }
})

const autocompleteAttrs = computed(() => ({
  ...serverModeAttrs.value,
  ...attrs,
}))

const displayText = computed(() => {
  if (!currentModel.value) return ''
  const val = currentModel.value
  if (Array.isArray(val)) return ''
  const found = (resolvedItems.value || []).find((i) => i[props.itemValue] === val)
  return found ? String(found[props.itemTitle] || '') : ''
})

function onModelUpdate(val: string | string[] | null) {
  emit('update:modelValue', val)
}

function onSearchInput(val: string | null) {
  searchQuery.value = val

  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    fetchFromServer(val || '')
  }, 300)

  emit('update:search', val)
}

async function fetchFromServer(query: string) {
  if (!props.fetchItems) return
  loading.value = true
  try {
    fetchedItems.value = (await props.fetchItems(query)) || []
  } catch (e) {
    emit('error', e)
  } finally {
    loading.value = false
  }
}

function onActionClick() {
  const val = currentModel.value

  if (props.multiple) {
    if (Array.isArray(val) && val.length === 1) {
      emit('edit', val[0])
      return
    }
    emit('create')
    return
  }

  const id = typeof val === 'string' ? val : null
  if (val) {
    emit('edit', id)
  } else {
    emit('create')
  }
}

async function loadInitialItems() {
  const val = currentModel.value
  if (!val || !props.fetchById || !props.fetchItems) return
  const ids = Array.isArray(val) ? val : [val]
  if (!ids.length) return
  loading.value = true
  try {
    const items: Item[] = []
    for (const id of ids) {
      const item = await props.fetchById(id)
      if (item) items.push(item)
    }
    fetchedItems.value = items
  } catch (e) {
    emit('error', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (isServerMode.value) {
    fetchFromServer('')
    if (currentModel.value) {
      loadInitialItems()
    }
  }
})

watch(currentModel, (val) => {
  if (val && props.fetchById && isServerMode.value) {
    loadInitialItems()
  }
})

defineExpose({ focus: () => inputRef.value?.focus() })
</script>

<style scoped></style>
