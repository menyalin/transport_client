<template>
  <div>
    <div class="settings-wrapper">
      <app-date-range v-model="period" />
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
      <table
        ref="tableBody"
        class="background-table"
      >
        <thead>
          <tr>
            <th
              ref="titleCell"
              width="110px"
            />
            <th
              v-for="day in tableColumns"
              :key="day"
              width="120px"
            >
              {{ new Date(day).toLocaleDateString() }}
            </th>
          </tr>
        </thead>
        <tbody
          v-if="!rerender"
          class="table-body"
        >
          <tr
            v-for="row in tableRows"
            :key="row._id"
          >
            <td>
              <div class="px-2 row-title-text">
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
            :style="getBlockStyles(block)"
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
import AppDateRange from '@/modules/common/components/dateRange'
import getDaysFromPeriod from '../utils/getDaysFromPeriod'
import getRowsFromCrews from '../utils/getRowsFromCrews'
import getBlocksFromCrews from '../utils/getBlocksFromCrews'

import mockCrews from './mockCrews'
export default {
  name: 'CrewsReport',
  components: {
    AppDateRange,
  },
  data() {
    return {
      tableWidth: 0,
      rerender: false,
      secInPx: 0,
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
      let blocks = getBlocksFromCrews({
        crews: this.crews,
        group: this.group,
        displayPeriod: this.period,
      })
      return blocks.map((item) => ({
        ...item,
        styles: {
          width: this.getWidthInPxForBlock(item),
          background: 'lightpink',
          height: '19px',
          top: this.getTopShiftInPxForBlock(item, item.type),
          left: this.getLeftShiftInPxForBlock(item),
          'z-index': 1,
        },
      }))
    },
  },
  watch: {
    group: function () {
      this.resizeHandler()
    },
    period: function () {
      this.resizeHandler()
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
    getBlockStyles(block) {
      return {
        width: this.getWidthInPxForBlock(block),
        background: 'lightgreen',
        height: '19px',
        top: this.getTopShiftInPxForBlock(block, block.type),
        left: this.getLeftShiftInPxForBlock(block),
        'z-index': 1,
      }
    },
    resizeHandler() {
      this.rerender = true
      this.tableWidth =
        this.$refs.tableBody.offsetWidth - this.$refs.titleCell.offsetWidth

      const dSec =
        moment(this.period[1]).add(24, 'hour').unix() -
        moment(this.period[0]).unix()
      this.secInPx = dSec / this.tableWidth
      this.$nextTick(() => {
        this.rerender = false
      })
    },
    getWidthInPxForBlock(block) {
      if (!this.secInPx) return null
      let endM = null
      let startM = moment(block.startDate).unix()
      if (moment(this.period[0]).isSameOrAfter(block.startDate))
        startM = moment(this.period[0]).unix()
      if (
        !block.endDate ||
        moment(this.period[1]).add('24', 'hour').isSameOrBefore(block.endDate)
      )
        endM = moment(this.period[1]).add(24, 'hour').unix()
      else endM = moment(block.endDate).unix()

      return (endM - startM) / this.secInPx + 'px'
    },

    getLeftShiftInPxForBlock(crew) {
      // dates in seconds
      if (!this.$refs?.titleCell) return null
      let leftShift = null
      const startPeriod = moment(this.period[0]).unix()
      const startCrew = moment(crew.startDate).unix()
      if (startCrew <= startPeriod) leftShift = 0
      else leftShift = startCrew - startPeriod
      return leftShift / this.secInPx + this.$refs.titleCell.offsetWidth + 'px'
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
  border-collapse: collapse;
  user-select: none;
  z-index: 3;
  /* table-layout: fixed; */
}

.data-cell {
  min-width: 120px;
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
  box-sizing: content-box;
  left: 0;
  z-index: 2;
  background: white;
  column-width: 110px;
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
  word-wrap: none;
  overflow-wrap: break-word;
}

.row-title-text {
  line-height: 15px;
  letter-spacing: -0.047em;
  font-weight: 300;
  font-style: normal;
  font-size: 14px;
}
</style>
