import { computed, onMounted, ref } from 'vue'

export default ({ listSettingsName, defaultHeaders, allHeaders }) => {
  const activeHeaders = ref([])

  onMounted(() => {
    const fields = JSON.parse(localStorage.getItem(listSettingsName))
    if (!fields || fields.length === 0) activeHeaders.value = defaultHeaders
    else activeHeaders.value = fields
  })

  const headers = computed(() => {
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
