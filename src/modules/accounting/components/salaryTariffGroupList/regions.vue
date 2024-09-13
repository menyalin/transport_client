<template>
  <span>
    <b>{{ regionsMap.get(item.loadingRegion).name }} </b>
    >>>
    <b>{{ regionsMap.get(item.unloadingRegion).name }} </b>
  </span>
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'RegionColumn',
  props: {
    item: Object,
  },
  computed: {
    regionsMap() {
      return this.$store.getters.regionsMap
    },
  },
})
</script>
