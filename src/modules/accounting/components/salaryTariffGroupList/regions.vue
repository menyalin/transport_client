<template>
  <span>
    <b>{{ regionsMap.get(item.loadingRegion).name }} </b>
    >>>
    <b>{{ regionsMap.get(item.unloadingRegion).name }} </b>
  </span>
</template>
<script>
export default {
  name: 'RegionColumn',
  props: {
    item: Object,
  },
  computed: {
    regionsMap() {
      return this.$store.getters.regionsMap
    },
  },
}
</script>
