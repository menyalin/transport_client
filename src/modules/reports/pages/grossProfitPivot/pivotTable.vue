<template>
  <v-simple-table dense>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">
            Группировка
          </th>
          <th class="text-right">
            Кол-во
          </th>
          <th class="text-right">
            Сумма
          </th>
          <th class="text-right">
            Сред.сумма
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Название группировки</td>
          <td class="text-right">
            33
          </td>
          <td class="text-right">
            1665
          </td>
          <td class="text-right">
            {{ Math.round(1665 / 33) }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th>Итого:</th>
          <th class="text-right">
            33
          </th>
          <th class="text-right">
            1 665
          </th>
          <th class="text-right">
            {{ Math.round(1665 / 33) }}
          </th>
        </tr>
      </tfoot>
    </template>
  </v-simple-table>
</template>
<script>
export default {
  name: 'PivotTable',
}
</script>
<style></style>
