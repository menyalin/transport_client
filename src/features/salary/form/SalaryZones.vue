<template>
  <div id="zones-wrapper">
    <AppZoneAutocomplete
      ref="loadingEl"
      v-model="zones.loadingZone"
      label="Зона погрузки"
      hide-details
    />
    <AppZoneAutocomplete v-model="zones.unloadingZone" label="Зона разгрузки" hide-details />
  </div>
</template>

<script setup>
defineOptions({ name: 'SalaryZones' })
import { ref } from 'vue'
import AppZoneAutocomplete from '@/entities/zone/ui/zoneAutocomplete.vue'

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
