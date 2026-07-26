<template>
  <span>
    <b>{{ regionsMap.get(item.loadingRegion)?.name }} </b>
    >>>
    <b>{{ regionsMap.get(item.unloadingRegion)?.name }} </b>
  </span>
</template>
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

defineOptions({ name: 'RegionColumn' })

defineProps({
  item: Object,
})

const store = useStore()

const regionsMap = computed(() => store.getters.regionsMap)
</script>
