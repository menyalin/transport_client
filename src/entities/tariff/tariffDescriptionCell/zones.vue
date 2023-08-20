<template>
  <span>
    <b>{{ zonesMap.get(item.loadingZone).name }} </b>
    >>>
    <b>{{ zonesMap.get(item.unloadingZone).name }} </b>
  </span>
</template>
<script>
export default {
  name: 'AdditionalPointsColumn',
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
<style />
