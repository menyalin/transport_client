<template>
  <v-menu v-if="hasAllowedReports">
    <template #activator="{ props }">
      <v-btn v-bind="props"> Отчеты </v-btn>
    </template>

    <v-list>
      <v-list-item v-for="item of filteredReports" :key="item.link" :to="item.link">
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const reports = [
  {
    link: '/reports/truckStateOnDate',
    title: 'Статус транспорта на дату (будет удален) ',
    permission: 'report:truckStateOnDate',
  },
  {
    link: '/reports/crews',
    title: 'Использование транспорта',
    permission: 'report:crew_diagram',
  },
  {
    link: '/reports/daysControl',
    title: 'Контроль сроков',
    permission: 'report:daysControl',
  },
  {
    link: '/reports/ordersInProgress',
    title: 'Простой транспорта',
    permission: 'report:inProgressOrders',
  },
  {
    link: '/reports/drivers_grades',
    title: 'Оценки водителей',
    permission: 'report:driversGrades',
  },
  {
    link: '/reports/order_docs',
    title: 'Отчет по документам',
    permission: 'report:orderDocs',
  },
  {
    link: '/reports/orders_wo_invoice',
    title: 'Рейсы, не включенные в акты',
    permission: 'report:ordersWOInvoice',
  },
  {
    link: '/reports/gross_profit_pivot',
    title: 'Валовая прибыль свод',
    permission: 'report:grossProfit',
  },
]

const filteredReports = computed(() =>
  reports.filter((i) => (i.permission ? store.getters.hasPermission(i.permission) : true))
)

const hasAllowedReports = computed(() => filteredReports.value.length > 0)
</script>
<style></style>
