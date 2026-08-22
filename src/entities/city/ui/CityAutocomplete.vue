<template>
  <AppAutocomplete
    v-model="model"
    :label="label"
    :disabled="disabled"
    :hide-details="hideDetails"
    :fetch-items="fetchItems"
    :fetch-by-id="fetchById"
    show-action
    v-bind="$attrs"
    @create="$emit('create')"
    @edit="$emit('edit', $event)"
  />
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useCityStore } from '@/entities/city/cityStore'
import AppAutocomplete from '@/shared/ui/AppAutocomplete/AppAutocomplete.vue'

defineOptions({ name: 'CityAutocomplete' })

withDefaults(
  defineProps<{
    label?: string
    disabled?: boolean
    hideDetails?: boolean
  }>(),
  { disabled: false, hideDetails: false }
)

defineEmits<{
  create: []
  edit: [id: string | null]
}>()

const store = useStore()
const cityStore = useCityStore()

const model = defineModel<string | null>()

const items = computed(() => cityStore.citiesForAutocomplete || [])

onMounted(() => {
  const profile = store.getters.directoriesProfile
  if (profile) cityStore.fetchCities(profile)
})

async function fetchItems(query: string) {
  const search = query.toLowerCase()
  return items.value.filter((i) => i.text.toLowerCase().includes(search))
}

async function fetchById(id: string) {
  return items.value.find((i) => i.value === id) || null
}
</script>
