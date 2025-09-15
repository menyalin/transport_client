<template>
  <div>
    <div class="settings-wrapper">
      <v-btn icon @click.stop="getData">
        <v-icon> mdi-cached </v-icon>
      </v-btn>
      <DateRangeInput v-model="settings.period" />

      <v-select
        v-model="settings.group"
        label="Группировать по"
        :items="groupItems"
        hide-details
        variant="outlined"
        density="compact"
      />
      <v-select
        v-model="settings.analitic"
        label="Детализация"
        :items="analiticItems"
        hide-details
        variant="outlined"
        density="compact"
      />
      <v-select
        v-model="settings.tkNameFilter"
        label="Фильтр по ТК"
        :items="tkNames"
        item-value="_id"
        item-title="name"
        hide-details
        variant="outlined"
        clearable
        density="compact"
      />
    </div>
    <div v-if="!filteredCrews.length" class="text-center">
      <load-spinner v-if="false" />
      <h4 v-else>Нет данных для отображния</h4>
    </div>
    <div v-else class="table-wrapper">
      <table ref="tableBody" class="background-table">
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
          <tr v-for="row in tableRows" :key="row._id">
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
import dayjs from 'dayjs'
import { CrewService } from '@/shared/services'
import { DateRangeInput, LoadSpinner } from '@/shared/ui'
import getDaysFromPeriod from '@/modules/common/helpers/getDaysFromPeriod'
import getRowsFromCrews from './utils/getRowsFromCrews'
import getBlocksFromCrews from './utils/getBlocksFromCrews'

import { mapGetters } from 'vuex'

export default {
  name: 'CrewsReport',
  components: {
    DateRangeInput,
    LoadSpinner,
  },
  data() {
    return {
      formName: 'crewDiagramReport',
      settings: {
        tkNameFilter: null,
        group: 'truck',
        analitic: 'driver',
        period: this.initDateRange(),
      },
      tableWidth: 0,
      secInPx: 0,
      groupItems: [
        { value: 'truck', text: 'Грузовик' },
        { value: 'driver', text: 'Водитель' },
        { value: 'trailer', text: 'Прицеп' },
      ],

      titleCellWidth: 0,

      crews: [],
      blocks: [],
      tableColumns: [],
      tableRows: [],
      loading: false,
    }
  },
  computed: {
    ...mapGetters(['directoriesProfile', 'tkNames']),
    analiticItems() {
      return this.groupItems.filter(
        (item) => item.value !== this.settings.group
      )
    },
    filteredCrews() {
      return this.crews.filter((item) =>
        this.settings.tkNameFilter
          ? this.settings.tkNameFilter === item.tkNameId
          : true
      )
    },
  },
  watch: {
    ['settings.group']: async function (val) {
      await this.getData()
      if (val === 'driver' || val === 'trailer')
        this.settings.analitic = 'truck'
      if (val === 'truck') this.settings.analitic = 'driver'
      this.resizeHandler()
    },
    ['settings.period']: async function () {
      await this.getData()
      this.resizeHandler()
    },
    ['settings.analitic']: function () {
      this.resizeHandler()
    },
    ['settings.tkNameFilter']: function () {
      this.resizeHandler()
    },
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeHandler)
  },
  created() {
    if (this.$store.getters.formSettingsMap.has(this.formName)) {
      this.settings = this.$store.getters.formSettingsMap.get(this.formName)
    }
  },
  async mounted() {
    await this.getData()
    window.addEventListener('resize', this.resizeHandler)
    this.resizeHandler()
  },
  methods: {
    getUrlForRowTitle(id) {
      if (this.settings.group === 'truck' || this.settings.group === 'trailer')
        return '/profile/trucks/' + id
      else return '/profile/drivers/' + id
    },
    async getData() {
      this.loading = true
      this.crews = await CrewService.diagramReport({
        profile: this.directoriesProfile,
        period: this.settings.period.join(','),
      })
      this.loading = false
    },
    getBlocksWithStyles() {
      if (!this.filteredCrews) return null
      let blocks = getBlocksFromCrews({
        crews: this.filteredCrews,
        group: this.settings.group,
        analitic: this.settings.analitic,
        displayPeriod: this.settings.period,
      })
      return blocks.map((item) => ({
        ...item,
        styles: {
          width: this.getWidthInPxForBlock(item),
          height: '25px',
          top: this.getTopShiftInPxForBlock(item, item.type),
          left: this.getLeftShiftInPxForBlock(item),
          'z-index': 1,
        },
      }))
    },
    resizeHandler() {
      this.tableColumns = getDaysFromPeriod(this.settings.period)
      this.tableRows = getRowsFromCrews(this.filteredCrews, this.settings.group)
      this.$nextTick(() => {
        this.tableWidth =
          this.$refs.tableBody?.offsetWidth - this.$refs.titleCell?.offsetWidth
        const dSec =
          dayjs(this.settings.period[1]).add(24, 'hour').unix() -
          dayjs(this.settings.period[0]).unix()
        this.secInPx = dSec / this.tableWidth

        this.$nextTick(() => {
          this.blocks = this.getBlocksWithStyles()
        })
      })
      this.$store.commit('setFormSettings', {
        formName: this.formName,
        settings: this.settings,
      })
    },
    getWidthInPxForBlock(block) {
      if (!this.secInPx) return null
      let endM = null
      let startM = dayjs(block.startDate).unix()
      if (dayjs(this.settings.period[0]).isSameOrAfter(block.startDate))
        startM = dayjs(this.settings.period[0]).unix()
      if (
        !block.endDate ||
        dayjs(this.settings.period[1])
          .add('24', 'hour')
          .isSameOrBefore(block.endDate)
      )
        endM = dayjs(this.settings.period[1]).add(24, 'hour').unix()
      else endM = dayjs(block.endDate).unix()
      const widthPx = (endM - startM) / this.secInPx
      return widthPx > 10 ? widthPx + 'px' : '10px'
    },

    getLeftShiftInPxForBlock(crew) {
      if (!this.$refs?.titleCell) return null
      let leftShift = null
      const startPeriod = dayjs(this.settings.period[0]).unix()
      const startCrew = dayjs(crew.startDate).unix()
      if (startCrew <= startPeriod) leftShift = 0
      else leftShift = startCrew - startPeriod
      return leftShift / this.secInPx + this.$refs.titleCell.offsetWidth + 'px'
    },

    getTopShiftInPxForBlock(block) {
      const ROW_HEIGTH = 25
      const rowIndex = this.tableRows.findIndex(
        (item) => item._id === block.rowId
      )
      return rowIndex * ROW_HEIGTH + 'px'
    },

    initDateRange() {
      const dateFormat = 'YYYY-MM-DD'
      const today = dayjs()
      return [
        today.add(-7, 'd').format(dateFormat),
        today.add(5, 'd').format(dateFormat),
      ]
    },
  },
}
</script>
<style scoped>
.settings-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 15px;
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
  height: 25px;
}
.table-body {
  position: relative;
}
thead {
  background-color: white;
  position: sticky;
  max-height: 30px;
  min-height: 20px;
  top: 0;
  z-index: 2;
  font-weight: 300;
  font-size: 14px;
}
tbody td:first-child {
  position: sticky;
  box-sizing: content-box;
  left: 0;
  z-index: 5;
  background: white;
  min-width: 110px;
  max-width: 180px;
}
td {
  border: rgb(155, 154, 154) 1px solid;
}
tbody tr {
  max-height: 25px;
}
table thead th:first-child {
  position: sticky;
  left: 0;
  background: white;
  z-index: 3;
}
.block {
  position: absolute;
  padding-left: 5px;
  border: 1px solid green;
  border-radius: 0px;
  line-height: 15px;
  letter-spacing: -0.03em;
  font-weight: 400;
  font-style: normal;
  font-size: 13px;
  white-space: nowrap;
  background-color: rgba(178, 248, 184, 0.5);
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
../../../modules/common/helpers/getDaysFromPeriod
