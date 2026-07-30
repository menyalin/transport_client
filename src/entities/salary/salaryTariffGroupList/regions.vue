<template>
  <span>
    <b>{{ regionsMap.get(item.loadingRegion)?.name }} </b>
    >>>
    <b>{{ regionsMap.get(item.unloadingRegion)?.name }} </b>
  </span>
</template>
<script setup>
import { computed } from 'vue'
import { useRegionStore } from '@/entities/region/regionStore'

defineOptions({ name: 'RegionColumn' })

defineProps({
  item: Object,
})

const regionStore = useRegionStore()

const regionsMap = computed(() => regionStore.regionsMap)
</script>
