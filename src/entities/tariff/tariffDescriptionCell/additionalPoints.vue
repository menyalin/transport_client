<template>
  <span>
    Рейс:
    <b>{{ orderTypeStr }}</b>, Кол-во точек в тарифе: <b> {{ item.includedPoints }}</b>
  </span>
</template>
<script>
export default {
  name: 'AdditionalPointsColumn',
  props: {
    item: Object,
  },
  computed: {
    orderTypeStr() {
      return this.$store.getters.orderAnalyticTypesMap.get(this.item.orderType)
    },
  },
}
</script>
<style />
