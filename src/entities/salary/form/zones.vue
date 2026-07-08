<template>
  <div id="zones-wrapper">
    <app-zone-autocomplete
      ref="loadingEl"
      :value="zones.loadingZone"
      label="Зона погрузки"
      hide-details
      @change="changeHandler($event, 'loadingZone')"
    />
    <app-zone-autocomplete
      :value="zones.unloadingZone"
      label="Зона разгрузки"
      hide-details
      @change="changeHandler($event, 'unloadingZone')"
    />
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

function changeHandler(val, field) {
  zones.value = { ...zones.value, [field]: val }
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
