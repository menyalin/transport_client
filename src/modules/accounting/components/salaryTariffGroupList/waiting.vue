<template>
  <span>
    <span>
      Клиенты: <b>{{ clients }}</b> ,
    </span>
    <span>
      Рейс: <b>{{ orderTypeStr }}</b> , тариф за: <b>{{ waitingTariffBy }}</b>
    </span>
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
    clients() {
      return this.item.clients
        .map((clientId) => this.$store.getters.partnersMap.get(clientId)?.name)
        .join(', ')
    },
  },
}
</script>
<style></style>
