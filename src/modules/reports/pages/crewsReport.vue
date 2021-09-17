<template>
  <div>
    <span>period: {{ period }}</span>
    <div class="table-wrapper">
      <table class="background-table">
        <thead>
          <tr>
            <td class="title-column" />
            <td
              v-for="day in tableColumns"
              :key="day"
            >
              {{ day }}
            </td>
          </tr>
        </thead>
        <tbody
          ref="tableBody"
          class="table-body"
        >
          <tr
            v-for="row in tableRows"
            :key="row"
          >
            <td class="title-column">
              Гос.номер
            </td>
            <td
              v-for="day in tableColumns"
              :key="day"
              class="data-cell"
            />
          </tr>
          <div class="block" />
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import getDaysFromPeriod from '../utils/getDaysFromPeriod'
import mockCrews from './mockCrews'
export default {
  name: 'CrewsReport',
  data() {
    return {
      period: ['2021-09-01', '2021-09-20'],
      crews: mockCrews,
    }
  },
  computed: {
    tableColumns() {
      return getDaysFromPeriod(this.period)
    },
    tableRows() {
      return [
        '001',
        '002',
        '003',
        '004',
        '005',
        '006',
        '007',
        '008',
        '009',
        '010',
        '011',
      ]
    },
  },
  mounted() {
    console.log(this.$refs.tableBody)
  },
}
</script>
<style scoped>
.table-wrapper {
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow-x: auto;
}
.background-table {
  width: 100%;
  height: 100%;
  border-collapse: collapse;
  border: 1px solid green;
  user-select: none;
}
.title-column {
  min-width: 150px;
  border: lightgray 1px dotted;
}
.data-cell {
  min-width: 150px;
  height: 50px;
  border: lightgray 1px dotted;
}
.table-body {
  position: relative;
}
.block {
  background: lightpink;
  height: 50px;
  width: 120px;
  top: 50px;
  left: 800px;
  position: absolute;
}
</style>
