/* eslint-disable vue/no-template-key */
<template>
  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th />
          <th
            v-for="date of dates"
            :key="date"
            :colspan="timeZones.length"
            class="text-center date-cell"
          >
            {{ date }}
          </th>
        </tr>
        <tr>
          <th />
          <th
            v-for="cell of dayCels"
            :key="cell.id"
            class="text-center date-cell"
          >
            {{ cell.timeZone.title }}
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

          <template v-for="cell of dayCels">
            <td :key="cell.id">
              {{ truck.regNum }}
            </td>
          </template>
        </tr>
      </tbody>
    </table>
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
    timeZones: [
      { title: '00-06' },
      { title: '06-12' },
      { title: '12-18' },
      { title: '18-24' },
    ],
    dates: [
      '2021-09-10',
      '2021-09-11',
      '2021-09-12',
      '2021-09-13',
      '2021-09-14',
    ],
  }),
  computed: {
    dayCels() {
      let cels = []
      for (let date of this.dates) {
        this.timeZones.forEach((zone) => {
          cels.push({ id: date + zone.title, date, timeZone: zone, colspan: 1 })
        })
      }
      return cels
    },
  },
}
</script>
<style>
.table-wrapper {
  width: 100%;
  padding: 15px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
.date-cell {
  border: 1px solid rgb(250, 227, 227);
  border-collapse: collapse;
  box-sizing: content-box;
}
</style>
