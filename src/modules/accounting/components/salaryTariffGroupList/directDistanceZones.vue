<template>
  <span>
    {{
      `Погрузка: ${
        addressMap.get(item.loading).shortName
      }, зоны до ${distances} км.`
    }}
  </span>
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'DirectDistanceZones',
  props: {
    item: Object,
  },
  computed: {
    distances() {
      return this.item.zones.map((i) => i.distance).join(', ')
    },
    addressMap() {
      return this.$store.getters.addressMap
    },
  },
})
</script>
<style />
