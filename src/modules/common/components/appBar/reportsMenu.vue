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
      <v-list-item to="/reports/crews">
        <v-list-item-title>Использование транспорта</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script>
export default {
  name: 'ReportsMenu',
}
</script>
<style></style>
