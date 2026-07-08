<template>
  <v-autocomplete
    clearable
    auto-select-first
    variant="solo"
    :model-value="model"
    :items="items"
    :loading="isLoading"
    v-model:search="search"
    no-filter
    hide-no-data
    item-title="value"
    placeholder="Начните вводить адрес для поиска"
    prepend-icon="mdi-database-search"
    return-object
    @update:model-value="change"
  />
</template>

<script setup>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { debounce } from '@/shared/utils'
import { AddressService } from '@/shared/services'

defineOptions({ name: 'AddressSuggestion' })

const emit = defineEmits(['change'])
const store = useStore()

const model = ref(null)
const search = ref(null)
const isLoading = ref(false)
const items = ref([])

const fetchSuggestions = debounce(async (val) => {
  try {
    isLoading.value = true
    items.value = await AddressService.getSuggestions(val)
  } catch (e) {
    store.commit('setError', e.message)
  } finally {
    isLoading.value = false
  }
}, 500)

watch(search, (val) => {
  if (!val || !val?.trim()) {
    model.value = null
    items.value = []
    return
  }
  if (isLoading.value) return
  fetchSuggestions(val)
})

function change(val) {
  emit('change', val)
}
</script>
