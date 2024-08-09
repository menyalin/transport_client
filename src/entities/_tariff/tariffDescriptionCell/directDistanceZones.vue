<template>
  <span>
    {{
      hasAddress
        ? `Погрузка: ${address}, зоны до ${distances} км.`
        : '___адрес не определен___'
    }}
  </span>
</template>
<script>
export default {
  name: 'DirectDistanceZones',
  props: {
    item: Object,
  },
  computed: {
    distances() {
      return this.item.zones.map((i) => i.distance).join(', ')
    },
    hasAddress() {
      return this.$store.getters.addressMap.has(this.item?.loading)
    },
    address() {
      if (!this.hasAddress) return ''
      return this.$store.getters.addressMap.get(this.item?.loading)?.shortName
    },
  },
}
</script>
<style />
