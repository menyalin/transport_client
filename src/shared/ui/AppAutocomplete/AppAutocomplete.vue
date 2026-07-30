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
    :hide-details="hideDetails"
    :multiple="multiple"
    :clearable="clearable"
    :append-inner-icon="actionIcon"
    v-bind="serverModeAttrs"
    @click:append-inner="onActionClick"
  >
    <template v-if="noDataText && !loading && !resolvedItems.length" #no-data>
      {{ noDataText }}
    </template>
  </v-autocomplete>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, type Ref } from 'vue'
import { useRouter, type RouteLocationRaw } from 'vue-router'

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
    createRoute?: RouteLocationRaw
    editRoute?: RouteLocationRaw
    showAction?: boolean
    labelOnly?: boolean
    multiple?: boolean
    disabled?: boolean
    clearable?: boolean
    hideDetails?: boolean
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
    showAction: false,
    noDataText: '',
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string | string[] | null]
  create: []
  edit: [id: string | null]
  'update:search': [value: string | null]
}>()

const router = useRouter()

const inputRef = ref<{ focus: () => void } | null>(null)

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
  if (!props.showAction && !props.createRoute && !props.editRoute) return undefined
  return currentModel.value ? 'mdi-pencil' : 'mdi-plus-circle'
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

const displayText = computed(() => {
  if (!currentModel.value) return ''
  const val = currentModel.value
  if (Array.isArray(val)) return ''
  const found = (props.items || []).find((i) => i[props.itemValue] === val)
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
  } finally {
    loading.value = false
  }
}

function onActionClick() {
  const id = Array.isArray(currentModel.value) ? null : currentModel.value
  if (currentModel.value && props.editRoute) {
    emit('edit', id)
    router.push(props.editRoute)
  } else if (props.createRoute) {
    emit('create')
    router.push(props.createRoute)
  } else if (currentModel.value) {
    emit('edit', id)
  } else {
    emit('create')
  }
}

async function loadInitialItem() {
  const val = currentModel.value
  if (!val || !props.fetchById || !props.fetchItems) return
  if (Array.isArray(val)) return
  loading.value = true
  try {
    const item = await props.fetchById(val)
    if (item) fetchedItems.value = [item]
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (isServerMode.value && currentModel.value) {
    loadInitialItem()
  }
})

watch(currentModel, (val) => {
  if (val && props.fetchById && isServerMode.value) {
    loadInitialItem()
  }
})

defineExpose({ focus: () => inputRef.value?.focus() })
</script>

<style scoped></style>
