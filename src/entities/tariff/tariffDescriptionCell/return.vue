<template>
  <span v-if="item.percentOfTariff">
    <b>{{ item.percentOfTariff }}%</b> от основного тарифа
  </span>
</template>
<script>
export default {
  name: 'ReturnColumn',
  props: {
    item: Object,
  },
  computed: {
    orderTypeStr() {
      return this.$store.getters.orderAnalyticTypesMap.get(this.item.orderType)
    },
    waitingTariffBy() {
      return this.$store.getters.waitingTariffByItemsMap.get(this.item.tariffBy)
    },
  },
}
</script>
