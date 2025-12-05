<template>
  <span>
    <b>{{ zonesMap.get(item.loadingZone).name }}</b>
    >>>
    <b>{{ zonesMap.get(item.unloadingZone).name }}</b>
  </span>
</template>
<script>
export default {
  name: 'ZonesColumn',
  props: {
    item: Object,
  },
  computed: {
    zonesMap() {
      return this.$store.getters.zonesMap
    },
  },
}
</script>
