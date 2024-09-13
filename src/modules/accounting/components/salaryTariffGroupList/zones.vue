<template>
  <span>
    <b>{{ zonesMap.get(item.loadingZone).name }} </b>
    >>>
    <b>{{ zonesMap.get(item.unloadingZone).name }} </b>
  </span>
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ZonesColumn',
  props: {
    item: Object,
  },
  computed: {
    zonesMap() {
      return this.$store.getters.zonesMap
    },
  },
})
</script>
