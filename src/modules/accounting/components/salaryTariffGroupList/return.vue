<template>
  <span v-if="item.type === 'return'">
    Рейс: <b>{{ orderTypeStr }}</b> Клиенты: <b>{{ clients }}</b> Типы
    грузополучателей:
    <b>{{ consigneeTypes }}</b>
    Паллеты: <b>{{ item.isPltReturn ? 'Да' : 'Нет' }}</b>
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
    clients() {
      return this.item.clients
        .map((i) => this.$store.getters.partnersMap.get(i)?.name)
        .join(', ')
    },
    consigneeTypes() {
      return this.item.consigneeTypes
        .map((i) => this.$store.getters.partnerGroupsMap.get(i))
        .join(', ')
    },
  },
}
</script>
