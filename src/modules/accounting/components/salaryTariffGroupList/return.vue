<template>
  <span v-if="item.type === 'return'">
    Рейс: <b>{{ orderTypeStr }}</b> Паллеты:
    <b>{{ item.isPltReturn ? 'Да' : 'Нет' }}</b>
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
  },
}
</script>
