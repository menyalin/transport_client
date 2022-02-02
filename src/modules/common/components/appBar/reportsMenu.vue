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
        v-for="item of reports"
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
      ],
    }
  },
}
</script>
<style></style>
