<template>
  <AppAutocomplete
    v-model="model"
    :label="label"
    :disabled="disabled"
    :hide-details="hideDetails"
    :items="items"
    show-action
    v-bind="$attrs"
    @create="$emit('create')"
    @edit="$emit('edit', $event)"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
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

const cityStore = useCityStore()

const model = defineModel<string | null>()

const items = computed(() => {
  const cities = cityStore.cities || []
  return cities.map((i: any) => ({ value: i._id, text: i.name }))
})
</script>
