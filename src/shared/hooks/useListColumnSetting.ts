import { ref, onMounted, computed, type Ref, type ComputedRef } from 'vue'

export interface ListSettingItem {
  text: string
  value: string
  [key: string]: any
}

export interface UseListColumnSettingInput {
  listSettingsName: string
  defaultHeaders: string[]
  allHeaders: ListSettingItem[]
}

export default ({ listSettingsName, defaultHeaders, allHeaders }: UseListColumnSettingInput) => {
  const activeHeaders: Ref<string[]> = ref([])

  onMounted(() => {
    const fields = JSON.parse(localStorage.getItem(listSettingsName) || 'null')
    if (!fields || fields.length === 0) activeHeaders.value = defaultHeaders
    else activeHeaders.value = fields
  })

  const headers: ComputedRef<ListSettingItem[]> = computed(() => {
    return allHeaders.filter((i) => activeHeaders.value.includes(i.value))
  })

  return {
    listSettingsName,
    activeHeaders,
    allHeaders,
    headers,
    defaultHeaders,
  }
}
