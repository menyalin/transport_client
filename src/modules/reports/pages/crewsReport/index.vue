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
      <v-select
        v-model="analitic"
        label="Детализация"
        :items="analiticItems"
        hide-details
        outlined
        dense
      />
      <v-select
        v-model="tkNameFilter"
        label="Фильтр по ТК"
        :items="tkNames"
        item-value="_id"
        item-text="name"
        hide-details
        outlined
        clearable
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
            <th ref="titleCell" />
            <th
              v-for="day in tableColumns"
              :key="day.title"
              :class="{ todayHeader: day.isToday }"
            >
              {{ day.title }}
            </th>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr
            v-for="row in tableRows"
            :key="row._id"
          >
            <td>
              <div class="px-2 row-title-text">
                <router-link :to="getUrlForRowTitle(row._id)">
                  {{ row.title }}
                </router-link>
              </div>
            </td>
            <td
              v-for="day in tableColumns"
              :key="day.title"
              class="data-cell"
            />
          </tr>
          <div
            v-for="block in blocks"
            :key="block._id"
            class="block"
            :style="block.styles"
          >
            <div>
              <router-link :to="'/profile/crews/' + block.crewId">
                {{ block.title }}
              </router-link>
            </div>
          </div>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import CrewService from '@/modules/profile/services/crew.service'

import AppDateRange from '@/modules/common/components/dateRange'
import getDaysFromPeriod from '../../../common/helpers/getDaysFromPeriod'
import getRowsFromCrews from './utils/getRowsFromCrews'
import getBlocksFromCrews from './utils/getBlocksFromCrews'

import { mapGetters } from 'vuex'

export default {
  name: 'CrewsReport',
  components: {
    AppDateRange,
  },
  data() {
    return {
      tableWidth: 0,
      tkNameFilter: null,
      secInPx: 0,
      groupItems: [
        { value: 'truck', text: 'Грузовик' },
        { value: 'driver', text: 'Водитель' },
        { value: 'trailer', text: 'Прицеп' },
      ],
      group: 'truck',
      analitic: 'driver',
      titleCellWidth: 0,
      period: this.initDateRange(),
      crews: [],
      blocks: [],
      tableColumns: [],
    }
  },
  computed: {
    ...mapGetters(['directoriesProfile', 'tkNames']),
    tableRows() {
      const rows = getRowsFromCrews(this.filteredCrews, this.group)
      return rows
    },
    analiticItems() {
      return this.groupItems.filter((item) => item.value !== this.group)
    },
    filteredCrews() {
      return this.crews.filter((item) =>
        this.tkNameFilter ? this.tkNameFilter === item.tkNameId : true
      )
    },
  },
  watch: {
    group: function (val) {
      this.getData()
      if (val === 'driver' || val === 'trailer') this.analitic = 'truck'
      if (val === 'truck') this.analitic = 'driver'
      this.resizeHandler()
    },
    period: function () {
      this.getData()
      this.resizeHandler()
    },
    analitic: function () {
      this.resizeHandler()
    },
    tkNameFilter: function () {
      this.resizeHandler()
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler)
  },

  async mounted() {
    await this.getData()
    window.addEventListener('resize', this.resizeHandler)
    this.resizeHandler()
  },
  methods: {
    getUrlForRowTitle(id) {
      if (this.group === 'truck' || this.group === 'trailer')
        return '/profile/trucks/' + id
      else return '/profile/drivers/' + id
    },
    async getData() {
      this.crews = await CrewService.diagramReport({
        profile: this.directoriesProfile,
        period: this.period.join(','),
      })
    },
    getBlocksWithStyles() {
      if (!this.filteredCrews) return null
      let blocks = getBlocksFromCrews({
        crews: this.filteredCrews,
        group: this.group,
        analitic: this.analitic,
        displayPeriod: this.period,
      })
      return blocks.map((item) => ({
        ...item,
        styles: {
          width: this.getWidthInPxForBlock(item),
          height: '30px',
          top: this.getTopShiftInPxForBlock(item, item.type),
          left: this.getLeftShiftInPxForBlock(item),
          'z-index': 1,
        },
      }))
    },
    resizeHandler() {
      this.tableColumns = getDaysFromPeriod(this.period)
      this.$nextTick(() => {
        this.tableWidth =
          this.$refs.tableBody.offsetWidth - this.$refs.titleCell.offsetWidth
        const dSec =
          moment(this.period[1]).add(24, 'hour').unix() -
          moment(this.period[0]).unix()
        this.secInPx = dSec / this.tableWidth
        this.blocks = this.getBlocksWithStyles()
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
      const ROW_HEIGTH = 30
      const rowIndex = this.tableRows.findIndex(
        (item) => item._id === block.rowId
      )
      return rowIndex * ROW_HEIGTH + 'px'
    },
    initDateRange() {
      const dateFormat = 'YYYY-MM-DD'
      const today = moment()
      return [
        today.add(-7, 'd').format(dateFormat),
        today.add(12, 'd').format(dateFormat),
      ]
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
  height: 30px;
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
  min-width: 110px;
  max-width: 180px;
}
td {
  border: rgb(155, 154, 154) 1px solid;
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
  padding-left: 3px;
  border: 1px solid green;
  border-radius: 0px;
  line-height: 15px;
  letter-spacing: -0.03em;
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  white-space: nowrap;
  background-color: rgba(178, 248, 184, 0.801);
  overflow: hidden;
  display: flex;
  align-items: center;
}

.row-title-text {
  line-height: 15px;
  letter-spacing: -0.047em;
  font-weight: 300;
  font-style: normal;
  font-size: 14px;
}

.todayHeader {
  font-weight: 600;
  font-size: 0.95rem;
}
</style>