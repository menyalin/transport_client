<template>
  <div id="points-wrapper">
    <v-autocomplete
      ref="loadingEl"
      :model-value="points.loading"
      :items="loadingAddressItems"
      label="Погрузка"
      hide-details
      @update:model-value="changeHandler($event, 'loading')"
    />
    <v-autocomplete
      :model-value="points.unloading"
      :items="unloadingAddressItems"
      label="Разгрузка"
      hide-details
      @update:model-value="changeHandler($event, 'unloading')"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAddressStore } from '@/entities/address'

const points = defineModel({
  type: Object,
  default: () => ({ loading: null, unloading: null }),
})

const loadingEl = ref(null)
const addressStore = useAddressStore()

const loadingAddressItems = computed(
  () => addressStore.addressesForAutocomplete?.filter((i) => i.loading) || []
)

const unloadingAddressItems = computed(
  () => addressStore.addressesForAutocomplete?.filter((i) => i.unloading) || []
)

function changeHandler(value, field) {
  points.value = { ...points.value, [field]: value }
}

const focus = () => {
  loadingEl.value?.focus()
}

defineExpose({ focus })
</script>
<style scoped>
#points-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
