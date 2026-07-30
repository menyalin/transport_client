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
import { useRegionStore } from '@/entities/region/regionStore'
import AppAutocomplete from '@/shared/ui/AppAutocomplete/AppAutocomplete.vue'

defineOptions({ name: 'RegionAutocomplete' })

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

const regionStore = useRegionStore()

const model = defineModel<string | null>()

const items = computed(() => regionStore.regionsForAutocomplete || [])
</script>
