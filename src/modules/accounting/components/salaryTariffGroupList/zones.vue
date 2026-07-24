<template>
  <span>
    <b>{{ zonesMap.get(item.loadingZone)?.name }} </b>
    >>>
    <b>{{ zonesMap.get(item.unloadingZone)?.name }} </b>
  </span>
</template>
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

defineOptions({ name: 'ZonesColumn' })

defineProps({
  item: Object,
})

const store = useStore()

const zonesMap = computed(() => store.getters.zonesMap)
</script>
