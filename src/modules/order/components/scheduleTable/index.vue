<template>
  <div class="table-wrapper">
    <v-simple-table
      dense
      fixed-header
      height="80vh"
    >
      <template v-slot:default>
        <thead>
          <tr>
            <th />
            <th
              v-for="date of dates"
              :key="date"
            >
              {{ date }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="truck of trucks"
            :key="truck._id"
            class="truck-row"
          >
            <td>
              <app-truck-title-cell :title="truck.regNum" />
            </td>

            <td
              v-for="date of dates"
              :key="date"
            >
              {{ truck.regNum }} {{ date }}
            </td>
          </tr>
        </tbody>
      </template>
      <caption>
        тут будет заголовок таблицы
      </caption>
    </v-simple-table>
  </div>
</template>
<script>
import appTruckTitleCell from './truckTitleCell.vue'
import mockTrucks from './mockTrucks.json'

export default {
  name: 'ScheduleTable',
  components: {
    appTruckTitleCell,
  },
  data: () => ({
    trucks: mockTrucks,
    dates: [
      '2021-09-10',
      '2021-09-11',
      '2021-09-12',
      '2021-09-13',
      '2021-09-14',
    ],
  }),
}
</script>
<style>
.table-wrapper {
  width: 100%;
  padding: 15px;
}
table {
  width: 100%;
}
.truck-row {
  border-bottom: indianred 1px dotted;
}
</style>
