<template>
  <div id="zones-wrapper">
    <app-zone-autocomplete
      ref="loadingEl"
      v-model="zones.loadingZone"
      label="Зона погрузки"
      hide-details
    />
    <app-zone-autocomplete v-model="zones.unloadingZone" label="Зона разгрузки" hide-details />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppZoneAutocomplete from '@/modules/common/components/zoneAutocomplete/index.vue'

const zones = defineModel({ type: Object })

const loadingEl = ref(null)

const focus = () => {
  loadingEl.value?.focus()
}

defineExpose({ focus })
</script>

<style scoped>
#zones-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
