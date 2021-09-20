<template>
  <div>
    <span>period: {{ period }}</span><br>
    <span>width: {{ tableWidth }} </span>
    <div class="table-wrapper">
      <table class="background-table">
        <thead>
          <tr>
            <th ref="titleCell" />
            <th
              v-for="day in tableColumns"
              :key="day"
            >
              {{ day }}
            </th>
          </tr>
        </thead>
        <tbody
          ref="tableBody"
          class="table-body"
        >
          <tr
            v-for="row in tableRows"
            :key="row._id"
          >
            <td>{{ row.title }}</td>
            <td
              v-for="day in tableColumns"
              :key="day"
              class="data-cell"
            />
          </tr>
          <div
            class="block"
            :style="blockStyles()"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import getDaysFromPeriod from '../utils/getDaysFromPeriod'
import getRowsFromCrews from '../utils/getRowsFromCrews'

import mockCrews from './mockCrews'
export default {
  name: 'CrewsReport',
  data() {
    return {
      tableWidth: 0,
      group: 'truck',
      titleCellWidth: 0,
      period: ['2021-09-01', '2021-09-07'],
      crews: mockCrews,
    }
  },
  computed: {
    tableColumns() {
      return getDaysFromPeriod(this.period)
    },
    tableRows() {
      const rows = getRowsFromCrews(this.crews, this.group)
      return rows
    },
    blocks() {
      return []
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler)
  },

  mounted() {
    window.addEventListener('resize', this.resizeHandler)
    this.resizeHandler()
  },
  methods: {
    resizeHandler() {
      this.tableWidth =
        this.$refs.tableBody.scrollWidth - this.$refs.titleCell.scrollWidth
    },
    blockStyles(crew) {
      return {
        background: 'lightpink',
        height: '35px',
        width: '120px',
        top: '50px',
        left: '800px',
      }
    },
  },
}
</script>
<style scoped>
.table-wrapper {
  width: 98vw;
  height: 80vh;
  overflow: auto;
  padding: 0px;
  margin: 0 auto;
  z-index: 5;
}
.background-table {
  width: 100%;
  border-collapse: collapse;
  user-select: none;
  z-index: 3;
}

.data-cell {
  min-width: 100px;
  height: 40px;
}
.table-body {
  position: relative;
}

thead th {
  position: sticky;
  background-color: white;
  position: sticky;
  max-height: 30px;
  min-height: 20px;
  top: 0;
  z-index: 1;
}
tbody td:first-child {
  position: sticky;
  left: 0;
  z-index: 2;
  min-width: 100px;
  max-width: 100px;
  background: white;
}
tbody tr td {
  border: lightgray 1px dotted;
}
table thead th:first-child {
  position: sticky;
  left: 0;
  background: white;
  z-index: 3;
  min-width: 100px;
  max-width: 100px;
}
.block {
  position: absolute;
  border: 1px solid blue;
  border-radius: 3px;
}
</style>
