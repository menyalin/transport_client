<template>
  <div>
    <div class="table-wrapper" :style="{ 'max-height': settings.showBufferZone ? '77vh' : '93vh' }">
      <table
        ref="tableBody"
        @dragover.prevent="dragOverHandler"
        @drop.prevent="dropHandler"
        @dragleave.prevent="disabledZone"
        @dblclick.stop="dblclickHandler"
      >
        <tbody>
          <tr class="head-row" @dragover.prevent="disabledZone">
            <td ref="rowTitleColumn" class="text-center" :style="{ width: initTitleWidth }">
              <AppSettingsCell v-model="settings" />
            </td>
            <td
              v-for="column of columns"
              :key="column.title"
              :class="{ 'today-header': column.isToday, 'text-center': true }"
            >
              <div>
                <div>{{ column.title }}</div>
                <div class="title-time-row">
                  <div>00-06</div>
                  <div>06-12</div>
                  <div>12-18</div>
                  <div>18-00</div>
                </div>
              </div>
            </td>
          </tr>
          <tr
            v-for="(truck, idx) of rows"
            :key="truck._id"
            :data-truck-id="truck._id"
            class="truck-row"
            :class="{ 'drag-over-row': idx === overRowInd }"
          >
            <td :style="cellStyles" @dragover.prevent="disabledZone">
              <appTruckTitleCell :id="truck._id" :idx="idx" :title="truck.regNum" />
            </td>
            <td v-for="column of columns" :key="column.title" />
          </tr>
          <tr :style="{ 'user-select': 'none' }" @dragover.prevent.stop="disabledZone">
            <td class="text-center">Итоги</td>
            <td v-for="column of columns" :key="column.title">
              <appResultCell :date="column.date" />
            </td>
          </tr>
          <appNote
            v-for="note of filteredNotes"
            :key="note._id"
            :note="note"
            :styles="notesStyle[note._id]"
            @dragover.prevent
          />

          <div
            v-for="item of allItems"
            :key="item._id"
            class="block"
            :draggable="
              itemTypeMap[item._id] === 'order' && draggableMode ? isDraggableOrder(item) : false
            "
            :style="stylesByItemId[item._id]"
            @dragstart="dragStartHandler($event, item._id)"
            @dragend="dragEndHandler($event, item._id)"
            @dragover.prevent.stop="disabledZone"
          >
            <appOrderCell v-if="itemTypeMap[item._id] === 'order'" :orderId="item._id" />
            <appDowntimeCell v-else :itemId="item._id" />
          </div>

          <appBgGrid
            v-if="titleColumnWidth"
            :leftShift="titleColumnWidth"
            :tableWidth="tableWidth + titleColumnWidth"
            :days="columns"
          />
        </tbody>
      </table>

      <ScheduleContextMenu
        ref="contextMenuRef"
        :truck-id="contextTruckId"
        :start-date="contextStartDate"
      />
    </div>

    <v-divider />
    <div v-if="settings.showBufferZone" class="buffer-wrapper">
      <table
        @dragover.prevent
        @drop.prevent="dropOnBufferHandler"
        @dblclick.stop="dblclickHandler($event, true)"
      >
        <tbody>
          <tr :style="{ 'min-height': '100%' }">
            <td
              :style="{
                width: initTitleWidth,
                height: bufferHeight,
              }"
            />
            <td v-for="column of columns" :key="column.title" />
          </tr>
          <template v-if="tableWidth">
            <div
              v-for="order of unDistributedOrders"
              :key="order._id"
              class="block"
              :draggable="draggableMode && isDraggableOrder(order)"
              :style="stylesByItemId[order._id]"
              @dragstart="dragStartHandler($event, order._id)"
              @dragend="dragEndHandler($event, order._id)"
              @dragover="disabledZone"
            >
              <appOrderCell :orderId="order._id" />
            </div>

            <appBgGrid
              v-if="titleColumnWidth"
              :leftShift="titleColumnWidth"
              :tableWidth="tableWidth + titleColumnWidth"
              :days="columns"
            />
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, toRef, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import dayjs from 'dayjs'

import { useOrderStore } from '@/entities/order/orderStore'
import { LINE_HEIGHT, ROW_TITLE_COLUMN_WIDTH } from './constants'
import getSecInPx from '@/shared/utils/getSecInPx'
import getDaysFromPeriod from '@/shared/utils/getDaysFromPeriod'
import getPeriodByWidthAndDate from './utils/getPeriodByWidthAndDate.js'

import appTruckTitleCell from './truckTitleCell.vue'
import appOrderCell from './orderCell.vue'
import appDowntimeCell from './downtimeCell.vue'
import appBgGrid from './bgGrid.vue'
import appNote from './note.vue'
import appResultCell from './resultCell.vue'
import AppSettingsCell from './settingsCell.vue'
import ScheduleContextMenu from './ScheduleContextMenu.vue'

import { useScheduleLayout } from './composables/useScheduleLayout.js'
import { useScheduleData } from './composables/useScheduleData.js'
import { useScheduleDrag } from './composables/useScheduleDrag.js'
import { PermissionService } from '@/shared/services'

defineOptions({ name: 'ScheduleTable' })

const props = defineProps({
  rows: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['startDragOrder', 'endDragOrder', 'updateOrder'])

const store = useStore()
const orderStore = useOrderStore()
const router = useRouter()

const tableBody = ref(null)
const rowTitleColumn = ref(null)
const settings = ref({})
const initTitleWidth = ROW_TITLE_COLUMN_WIDTH

const {
  tableWidth,
  titleColumnWidth,
  titleRowHeight,
  getLeftShiftForOrder: _getLeftShift,
  getOrderWidth: _getOrderWidth,
} = useScheduleLayout(tableBody, rowTitleColumn)

const date = computed(() => orderStore.scheduleDate)

const period = computed(() => {
  return getPeriodByWidthAndDate({
    date: date.value,
    width: tableWidth.value,
  })
})

const columns = computed(() => getDaysFromPeriod(period.value))

const secInPx = computed(() =>
  getSecInPx({
    lengthInPx: tableWidth.value,
    dayCount: columns.value.length,
  })
)

const onlyPlannedDates = computed(() => orderStore.onlyPlannedDates)

const draggableMode = computed(
  () =>
    PermissionService.check({ permissions: ['order:move'] }) &&
    settings.value.showDowntimes &&
    !settings.value.controlOnly
)

const cellStyles = computed(() => ({
  height: LINE_HEIGHT + 'px',
}))

function getLeftShiftForOrder(item) {
  return _getLeftShift(item, { period, secInPx })
}

function getOrderWidth(item) {
  return _getOrderWidth(item, { period, secInPx, onlyPlannedDates: onlyPlannedDates.value })
}

const dataComposable = useScheduleData(settings)

const { unDistributedOrders, filteredNotes, downtimeTruckIdMap, itemTypeMap, allItems } =
  dataComposable

function getTopShiftForOrder({ _id, truckId }, truckOverrides) {
  const id = truckId || truckOverrides?.truckId || downtimeTruckIdMap.value[_id]
  if (!id) return lineForUndistributedOrdersMap.value.get(_id) * LINE_HEIGHT

  const rowIdx = props.rows.findIndex((item) => item._id === id)
  if (rowIdx === -1) return 0
  return rowIdx * LINE_HEIGHT + titleRowHeight.value
}

const lineForUndistributedOrdersMap = computed(() => {
  const linesMap = new Map()
  for (const order of unDistributedOrders.value) {
    const group = Math.floor(getLeftShiftForOrder(order))
    if (!linesMap.has(group)) linesMap.set(group, [])
    linesMap.get(group).push(order._id)
  }
  const orderLinesMap = new Map()
  for (const [, ids] of linesMap) {
    ids.forEach((orderId, idx) => {
      orderLinesMap.set(orderId, idx)
    })
  }
  return orderLinesMap
})

const bufferHeight = computed(() => {
  const size = lineForUndistributedOrdersMap.value.size
  if (size === 0) return LINE_HEIGHT * 2 + 'px'
  let max = 0
  lineForUndistributedOrdersMap.value.forEach((val) => {
    if (val > max) max = val
  })
  return ((max + 1) * LINE_HEIGHT + LINE_HEIGHT).toString() + 'px'
})

const notesStyle = computed(() => {
  if (!filteredNotes.value.length) return {}
  const styles = {}
  for (const note of filteredNotes.value) {
    styles[note._id] = {
      left:
        getLeftShiftForOrder({
          startPositionDate: note.startPositionDate,
          needRoundTime: true,
        }) + 'px',
      top:
        getTopShiftForOrder({ _id: note._id }, { truckId: note.truck }) +
        (LINE_HEIGHT - 3) / 2 +
        'px',
    }
  }
  return styles
})

function getStylesForOrder(order) {
  return {
    height: LINE_HEIGHT + 'px',
    width: getOrderWidth(order) + 'px',
    left: getLeftShiftForOrder(order) + 'px',
    top: getTopShiftForOrder(order) + 'px',
    opacity: order.isDisabled ? 0.5 : 0.92,
    'z-index': itemTypeMap.value[order._id] === 'order' ? 4 : 3,
  }
}

const stylesByItemId = computed(() => {
  const map = {}
  for (const item of allItems.value) {
    map[item._id] = getStylesForOrder(item)
  }
  for (const order of unDistributedOrders.value) {
    map[order._id] = getStylesForOrder(order)
  }
  return map
})

const drag = useScheduleDrag({
  rows: toRef(props, 'rows'),
  period,
  secInPx,
  titleColumnWidth,
  titleRowHeight,
  draggableMode,
  emit,
})

const {
  overRowInd,
  dragStartHandler,
  dragEndHandler,
  dragOverHandler,
  dropOnBufferHandler,
  dropHandler,
  disabledZone,
  isDraggableOrder,
} = drag

const contextMenuRef = ref(null)
const contextTruckId = ref(null)
const contextStartDate = ref(null)

function dblclickHandler(e, isBuffer) {
  e.preventDefault()
  contextTruckId.value = null

  const td = e.target.closest('td')
  if (!td) return

  const cellIndex = td.cellIndex
  if (cellIndex < 1) return

  const columnIndex = cellIndex - 1
  if (columnIndex >= columns.value.length) return

  const column = columns.value[columnIndex]
  const cellRect = td.getBoundingClientRect()
  const xInCell = e.clientX - cellRect.left
  const slotIndex = Math.min(3, Math.floor((xInCell / cellRect.width) * 4))
  const hour = slotIndex * 6

  contextStartDate.value = dayjs(column.date).hour(hour).format('YYYY-MM-DD HH:00')

  if (isBuffer && store.getters.hasPermission('order:create')) {
    router.push({
      name: 'CreateOrder',
      query: { truckId: contextTruckId.value, startDate: contextStartDate.value },
    })
  } else if (!isBuffer) {
    const tr = td.closest('tr.truck-row')
    if (!tr) return

    contextTruckId.value = tr.dataset.truckId
    if (!contextTruckId.value) return

    contextMenuRef.value.open(e.clientX, e.clientY)
  }
}

watch(period, (val) => {
  if (val) orderStore.setPeriod(val)
})
</script>
<style scoped>
.table-wrapper {
  width: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
}
.buffer-wrapper {
  width: 100%;
  margin-top: 5px;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
}

table {
  width: 100%;
  height: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  user-select: auto;
}
td {
  border-bottom: 1px dotted grey;
}
.head-row {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: white;
  user-select: none;
}

.block {
  position: absolute;
}

.today-header {
  font-weight: 700;
}
.drag-over-row {
  box-shadow: inset 0px 0px 3px 1px lightskyblue;
}
.title-time-row {
  display: grid;
  box-sizing: border-box;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  font-size: 0.75rem;
  border-bottom: 2px solid grey;
}
</style>
