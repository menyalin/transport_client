<template>
  <v-menu location="bottom">
    <template #activator="{ props }">
      <v-btn v-bind="props" variant="text"> Отчеты </v-btn>
    </template>

    <v-list density="compact">
      <v-list-item
        v-for="item of filteredReports"
        :key="item.link"
        :to="item.link"
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script>
export default {
  name: 'ReportsMenu',
  data() {
    return {
      reports: [
        {
          link: '/reports/truckStateOnDate',
          title: 'Статус транспорта на дату',
        },
        { link: '/reports/crews', title: 'Использование транспорта' },
        { link: '/reports/daysControl', title: 'Контроль сроков' },
        { link: '/reports/ordersInProgress', title: 'Простой транспорта' },
        {
          link: '/reports/drivers_grades',
          title: 'Оценки водителей',
          permission: 'report:drivers_grades',
        },
        {
          link: '/reports/order_docs',
          title: 'Отчет по документам',
          permission: 'report:orderDocs',
        },
        {
          link: '/reports/orders_wo_invoice',
          title: 'Рейсы, не включенные в акты',
          permission: 'report:orders_wo_invoice',
        },
        {
          link: '/reports/gross_profit_pivot',
          title: 'Валовая прибыль свод',
          permission: 'report:gross_profit',
        },
      ],
    }
  },
  computed: {
    filteredReports() {
      return this.reports.filter((i) =>
        i.permission ? this.$store.getters.hasPermission(i.permission) : true
      )
    },
  },
}
</script>
<style></style>
