<template>
  <div>
    <span>period: {{ period }}</span><br>
    <span>width: {{ tableWidth }} </span> <br>
    <span> secInPx: {{ secInPx }}</span>
    <div class="settings-wrapper">
      <v-select
        v-model="group"
        label="Группировать по"
        :items="groupItems"
        hide-details
        outlined
        dense
      />
    </div>
    <div class="table-wrapper">
      <table class="background-table">
        <thead>
          <tr>
            <th ref="titleCell" />
            <th
              v-for="day in tableColumns"
              :key="day"
            >
              {{ new Date(day).toLocaleDateString() }}
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
            <td>
              <div class="px-2 row-title">
                {{ row.title }}
              </div>
            </td>
            <td
              v-for="day in tableColumns"
              :key="day"
              class="data-cell"
            />
          </tr>
          <div
            v-for="block in blocks"
            :key="block._id"
            class="block"
            :style="block.styles"
          >
            {{ block.title }}
          </div>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import getDaysFromPeriod from '../utils/getDaysFromPeriod'
import getRowsFromCrews from '../utils/getRowsFromCrews'
import getBlocksFromCrews from '../utils/getBlocksFromCrews'

import mockCrews from './mockCrews'
export default {
  name: 'CrewsReport',
  data() {
    return {
      tableWidth: 0,
      groupItems: [
        { value: 'truck', text: 'Грузовик' },
        { value: 'driver', text: 'Водитель' },
        { value: 'trailer', text: 'Прицеп' },
      ],
      group: 'truck',
      titleCellWidth: 0,
      period: ['2021-09-01', '2021-09-30'],
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
      if (!this.crews) return null
      let blocks = getBlocksFromCrews({ crews: this.crews, group: this.group })
      return blocks.map((item) => ({
        ...item,
        styles: {
          width: this.getWidthInPxForBlock(item),
          background: 'lightpink',
          height: '18px',
          top: this.getTopShiftInPxForBlock(item, item.type),
          left: this.getLeftShiftInPxForBlock(item),
          'z-index': 1,
        },
      }))
    },
    secInPx() {
      if (!this.tableWidth) return 0
      const dSec =
        moment(this.period[1]).add(24, 'hour').unix() -
        moment(this.period[0]).unix()
      return dSec / this.tableWidth
    },
  },
  watch: {
    group: function () {
      this.resizeHandler()
    },
    '$refs.titleCell.clientWidth': function (val) {
      console.log(val)
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler)
  },

  mounted() {
    window.addEventListener('resize', this.resizeHandler)
    this.resizeHandler()
    console.log(this.$refs.titleCell)
  },
  methods: {
    resizeHandler() {
      this.tableWidth =
        this.$refs.tableBody.clientWidth - this.$refs.titleCell.clientWidth
    },
    getWidthInPxForBlock(crew) {
      if (!this.secInPx) return null
      let endM = null
      let startM = moment(crew.startDate).unix()
      if (moment(this.period[0]).isSameOrAfter(crew.startDate))
        startM = moment(this.period[0]).unix()
      if (
        !crew.endDate ||
        moment(this.period[1]).add('24', 'hour').isSameOrBefore(crew.endDate)
      )
        endM = moment(this.period[1]).add(24, 'hour').unix()
      else endM = moment(crew.endDate).unix()

      return (endM - startM) / this.secInPx + 'px'
    },

    getLeftShiftInPxForBlock(crew) {
      // dates in seconds
      if (!this.$refs?.titleCell?.clientWidth) return null
      let leftShift = null
      const startPeriod = moment(this.period[0]).unix()
      const startCrew = moment(crew.startDate).unix()
      if (startCrew <= startPeriod) leftShift = 0
      else leftShift = startCrew - startPeriod
      return leftShift / this.secInPx + this.$refs.titleCell.clientWidth + 'px'
    },

    getTopShiftInPxForBlock(block) {
      const ROW_HEIGTH = 40
      const rowIndex = this.tableRows.findIndex(
        (item) => item._id === block.rowId
      )
      return (
        rowIndex * ROW_HEIGTH + (ROW_HEIGTH / 2) * (block.line - 1) + 1 + 'px'
      )
    },
  },
}
</script>
<style scoped>
.settings-wrapper {
  display: flex;
  flex-direction: row;
}
.settings-wrapper > * {
  max-width: 300px;
  padding: 15px;
}

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
  font-weight: 300;
  font-size: 14px;
}
tbody td:first-child {
  position: sticky;
  left: 0;
  z-index: 2;
  /* min-width: 150px; */

  background: white;
}
tbody tr td {
  border: lightgray 1px dotted;
}
tbody tr {
  max-height: 40px;
}
table thead th:first-child {
  position: sticky;
  left: 0;
  background: white;
  z-index: 3;
}
.block {
  position: absolute;
  border: 1px dotted grey;
  border-radius: 3px;
  line-height: 15px;
  letter-spacing: -0.047em;
  font-weight: 300;
  font-style: normal;
  font-size: 14px;
}
.row-title {
  min-width: 110px;
  line-height: 15px;
  letter-spacing: -0.047em;
  font-weight: 300;
  font-style: normal;
  font-size: 14px;
}
</style>
