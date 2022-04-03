<template>
  <v-menu
    bottom
    offset-y
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        text
        v-on="on"
      >
        Отчеты
      </v-btn>
    </template>

    <v-list dense>
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
      ],
    }
  },
  computed: {
    filteredReports() {
      return this.reports.filter((i) =>
        i.permission
          ? this.$store.getters.hasPermission('report:drivers_grades')
          : true
      )
    },
  },
}
</script>
<style></style>
