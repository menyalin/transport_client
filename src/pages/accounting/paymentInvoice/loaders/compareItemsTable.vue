<template>
  <v-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">#</th>
          <th class="text-left">№ маршр. листа</th>
          <th class="text-left">Маршрут</th>
          <th>Водитель</th>
          <th>Грузовик</th>
          <th>Тип ТС</th>
          <th class="text-right">Цена без НДС</th>
        </tr>
      </thead>
      <tbody>
        <CompareItemsTableRow
          v-for="(item, idx) in items"
          :key="item.clientNum"
          :item="item"
          :idx="idx"
        />
      </tbody>
    </template>
  </v-table>
</template>
<script setup>
import CompareItemsTableRow from './compareItemsTableRow.vue'

defineOptions({ name: 'CompareItemsTable' })

defineProps({
  items: Array,
})
</script>
<style></style>
