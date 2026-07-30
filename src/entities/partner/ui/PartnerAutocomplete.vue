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
import { usePartnerStore } from '@/entities/partner'
import AppAutocomplete from '@/shared/ui/AppAutocomplete/AppAutocomplete.vue'

defineOptions({ name: 'PartnerAutocomplete' })

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

const partnerStore = usePartnerStore()

const model = defineModel<string | null>()

const items = computed(() => partnerStore.partnersForAutocomplete || [])
</script>
