<template>
  <div id="zones-wrapper">
    <AppAutocomplete
      ref="loadingEl"
      v-model="zones.loadingZone"
      label="Зона погрузки"
      :items="zonesItems"
      hide-details
      :create-route="{ name: 'ZoneCreate' }"
      :edit-route="
        zones.loadingZone ? { name: 'ZoneDetails', params: { id: zones.loadingZone } } : undefined
      "
    />
    <AppAutocomplete
      v-model="zones.unloadingZone"
      label="Зона разгрузки"
      :items="zonesItems"
      hide-details
      :create-route="{ name: 'ZoneCreate' }"
      :edit-route="
        zones.unloadingZone
          ? { name: 'ZoneDetails', params: { id: zones.unloadingZone } }
          : undefined
      "
    />
  </div>
</template>

<script setup>
defineOptions({ name: 'SalaryZones' })
import { ref, computed } from 'vue'
import { useZoneStore } from '@/entities/zone/zoneStore'
import AppAutocomplete from '@/shared/ui/AppAutocomplete/AppAutocomplete.vue'

const zoneStore = useZoneStore()
const zones = defineModel({ type: Object })

const loadingEl = ref(null)

const zonesItems = computed(() => zoneStore.zonesForAutocomplete || [])

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
