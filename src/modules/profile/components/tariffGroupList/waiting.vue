<template>
  <span>
    Рейс: <b>{{ orderTypeStr }}</b>, тариф за: <b>{{ waitingTariffBy }}</b>
  </span>
</template>
<script>
export default {
  name: 'WaitingColumn',
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
<style></style>
