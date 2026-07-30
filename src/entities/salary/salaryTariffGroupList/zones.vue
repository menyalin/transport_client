<template>
  <span>
    <b>{{ zonesMap.get(item.loadingZone)?.name }} </b>
    >>>
    <b>{{ zonesMap.get(item.unloadingZone)?.name }} </b>
  </span>
</template>
<script setup>
import { computed } from 'vue'
import { useZoneStore } from '@/entities/zone/zoneStore'

defineOptions({ name: 'ZonesColumn' })

defineProps({
  item: Object,
})

const zoneStore = useZoneStore()

const zonesMap = computed(() => zoneStore.zonesMap)
</script>
