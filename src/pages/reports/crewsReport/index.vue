<template>
  <div>
    <div class="settings-wrapper">
      <v-btn icon @click="getData" variant="text">
        <v-icon> mdi-cached </v-icon>
      </v-btn>
      <DateRangeInput v-model="settings.period" />

      <v-select v-model="settings.group" label="Группировать по" :items="groupItems" hide-details />
      <v-select
        v-model="settings.analitic"
        label="Детализация"
        :items="analiticItems"
        hide-details
      />
      <v-select
        v-model="settings.tkNameFilter"
        label="Фильтр по ТК"
        :items="carrierStore.carriers"
        item-value="_id"
        item-title="name"
        hide-details
        clearable
      />
    </div>
    <div v-if="loading" class="text-center ma-6">
      <v-progress-circular indeterminate color="primary" />
    </div>
    <div v-else-if="!filteredCrews.length" class="text-center">
      <h4>Нет данных для отображения</h4>
    </div>
    <div v-else class="table-wrapper">
      <div class="table-scroll">
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
              <td v-for="day in tableColumns" :key="day.title" class="data-cell" />
            </tr>
          </tbody>
        </table>
        <div v-for="block in blocks" :key="block._id" class="block" :style="block.styles">
          <router-link :to="'/profile/crews/' + block.crewId">
            {{ block.title }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import dayjs from 'dayjs'
import { CrewService } from '@/shared/services'
import { DateRangeInput } from '@/shared/ui'
import { debounce } from '@/shared/utils'
import usePersistedRef from '@/shared/hooks/usePersistedRef'
import getDaysFromPeriod from '@/modules/common/helpers/getDaysFromPeriod'
import getRowsFromCrews from './utils/getRowsFromCrews'
import getBlocksFromCrews from './utils/getBlocksFromCrews'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'

defineOptions({ name: 'CrewsReport' })

const carrierStore = useCarrierStore()
const store = useStore()

const initDateRange = () => {
  const dateFormat = 'YYYY-MM-DD'
  const today = dayjs()
  return [today.add(-7, 'd').format(dateFormat), today.add(5, 'd').format(dateFormat)]
}

const settings = usePersistedRef(
  {
    tkNameFilter: null,
    group: 'truck',
    analitic: 'driver',
    period: initDateRange(),
  },
  'crewDiagramReport:settings'
)

const secInPx = ref(0)
const crews = ref([])
const blocks = ref([])
const tableColumns = ref([])
const tableRows = ref([])
const loading = ref(false)
const tableBody = ref(null)
const titleCell = ref(null)

const groupItems = [
  { value: 'truck', title: 'Грузовик' },
  { value: 'driver', title: 'Водитель' },
  { value: 'trailer', title: 'Прицеп' },
]

const directoriesProfile = computed(() => store.getters.directoriesProfile)

const analiticItems = computed(() =>
  groupItems.filter((item) => item.value !== settings.value.group)
)

const filteredCrews = computed(() =>
  crews.value.filter((item) =>
    settings.value.tkNameFilter ? settings.value.tkNameFilter === item.tkNameId : true
  )
)

watch(
  () => settings.value.group,
  async (val) => {
    await getData()
    if (val === 'driver' || val === 'trailer') settings.value.analitic = 'truck'
    if (val === 'truck') settings.value.analitic = 'driver'
    resizeHandler()
  }
)

watch(
  () => settings.value.period,
  async () => {
    await getData()
    resizeHandler()
  }
)

watch(
  () => settings.value.analitic,
  () => {
    resizeHandler()
  }
)

watch(
  () => settings.value.tkNameFilter,
  () => {
    resizeHandler()
  }
)

const onResize = debounce(resizeHandler, 300)

onMounted(async () => {
  await getData()
  window.addEventListener('resize', onResize)
  resizeHandler()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})

function getUrlForRowTitle(id) {
  if (settings.value.group === 'truck' || settings.value.group === 'trailer')
    return '/profile/trucks/' + id
  return '/profile/drivers/' + id
}

async function getData() {
  loading.value = true
  try {
    crews.value = await CrewService.diagramReport({
      profile: directoriesProfile.value,
      period: settings.value.period.join(','),
    })
  } catch (e) {
    crews.value = []
    store.commit('setError', e?.message || 'Ошибка загрузки отчёта')
  } finally {
    loading.value = false
  }
}

function getHeaderHeight() {
  return tableBody.value?.querySelector('thead')?.offsetHeight || 0
}

function getBlocksWithStyles() {
  const items = getBlocksFromCrews({
    crews: filteredCrews.value,
    group: settings.value.group,
    analitic: settings.value.analitic,
    displayPeriod: settings.value.period,
  })
  return items.map((item) => ({
    ...item,
    styles: {
      width: getWidthInPxForBlock(item),
      height: '25px',
      top: getTopShiftInPxForBlock(item),
      left: getLeftShiftInPxForBlock(item),
      'z-index': 1,
    },
  }))
}

function resizeHandler() {
  tableColumns.value = getDaysFromPeriod(settings.value.period)
  tableRows.value = getRowsFromCrews(filteredCrews.value, settings.value.group)
  nextTick(() => {
    const bodyWidth = tableBody.value?.offsetWidth || 0
    const titleWidth = titleCell.value?.offsetWidth || 0
    const dSec =
      dayjs(settings.value.period[1]).add(24, 'hour').unix() -
      dayjs(settings.value.period[0]).unix()
    secInPx.value = dSec / (bodyWidth - titleWidth)

    nextTick(() => {
      blocks.value = getBlocksWithStyles()
    })
  })
}

function getWidthInPxForBlock(block) {
  if (!secInPx.value) return null
  let endM = null
  let startM = dayjs(block.startDate).unix()
  if (dayjs(settings.value.period[0]).isSameOrAfter(block.startDate))
    startM = dayjs(settings.value.period[0]).unix()
  if (
    !block.endDate ||
    dayjs(settings.value.period[1]).add(24, 'hour').isSameOrBefore(block.endDate)
  )
    endM = dayjs(settings.value.period[1]).add(24, 'hour').unix()
  else endM = dayjs(block.endDate).unix()
  const widthPx = (endM - startM) / secInPx.value
  return widthPx > 10 ? widthPx + 'px' : '10px'
}

function getLeftShiftInPxForBlock(crew) {
  if (!titleCell.value) return null
  const startPeriod = dayjs(settings.value.period[0]).unix()
  const startCrew = dayjs(crew.startDate).unix()
  let leftShift = startCrew <= startPeriod ? 0 : startCrew - startPeriod
  return leftShift / secInPx.value + titleCell.value.offsetWidth + 'px'
}

function getTopShiftInPxForBlock(block) {
  const ROW_HEIGHT = 25
  const rowIndex = tableRows.value.findIndex((item) => item._id === block.rowId)
  const headerHeight = getHeaderHeight()
  return rowIndex * ROW_HEIGHT + headerHeight + 'px'
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
  margin: 0 auto;
  z-index: 5;
}
.table-scroll {
  position: relative;
}
.background-table {
  border-collapse: collapse;
  user-select: none;
  z-index: 3;
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
