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
              <app-settings-cell v-model="settings" />
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
              <app-truck-title-cell :id="truck._id" :idx="idx" :title="truck.regNum" />
            </td>
            <td v-for="column of columns" :key="column.title" />
          </tr>
          <tr
            :style="{ 'user-select': 'none', height: '100%' }"
            @dragover.prevent.stop="disabledZone"
          >
            <td class="text-center">Итоги</td>
            <td v-for="column of columns" :key="column.title">
              <app-result-cell :date="column.date" />
            </td>
          </tr>
          <app-note
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
            <app-order-cell v-if="itemTypeMap[item._id] === 'order'" :orderId="item._id" />
            <app-downtime-cell v-else :itemId="item._id" />
          </div>

          <app-bg-grid
            v-if="titleColumnWidth"
            :leftShift="titleColumnWidth"
            :tableWidth="tableWidth + titleColumnWidth"
            :days="columns"
          />
        </tbody>
      </table>
      <div>
        <v-menu v-model="showMenu" :target="[menuX, menuY]">
          <v-list>
            <v-list-item
              :disabled="!$store.getters.hasPermission('order:create')"
              @click="createOrder"
            >
              <v-list-item-title>Создать рейс</v-list-item-title>
            </v-list-item>
            <v-list-item
              :disabled="!$store.getters.hasPermission('downtime:write')"
              @click="createDowntime"
            >
              <v-list-item-title>Создать "сервис/выходной"</v-list-item-title>
            </v-list-item>
            <v-list-item
              :disabled="!$store.getters.hasPermission('scheduleNote:write')"
              @click="createScheduleNote"
            >
              <v-list-item-title>Создать заметку</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
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
              <app-order-cell :orderId="order._id" />
            </div>

            <app-bg-grid
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
<script>
import dayjs from 'dayjs'

import { LINE_HEIGHT, ROW_TITLE_COLUMN_WIDTH } from './constants'
import { roundingHours } from './helpers'
import getSecInPx from '@/modules/common/helpers/getSecInPx'
import getDaysFromPeriod from '@/modules/common/helpers/getDaysFromPeriod'
import getPeriodByWidthAndDate from './utils/getPeriodByWidthAndDate.js'

import appTruckTitleCell from './truckTitleCell.vue'
import appOrderCell from './orderCell.vue'
import appDowntimeCell from './downtimeCell.vue'
import appBgGrid from './bgGrid.vue'
import appNote from './note.vue'
import appResultCell from './resultCell.vue'
import AppSettingsCell from './settingsCell.vue'
import { PermissionService } from '@/shared/services'
import { debounce } from '@/shared/utils'

export default {
  name: 'ScheduleTable',
  components: {
    appTruckTitleCell,
    appDowntimeCell,
    appOrderCell,
    appBgGrid,
    appNote,
    appResultCell,
    AppSettingsCell,
  },
  props: {
    rows: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    tableWidth: 0,
    titleColumnWidth: 0,
    titleRowHeight: 0,
    leftShiftInPx: 0,
    draggedOrderId: null,
    movedNode: null,
    overRowInd: null,
    initTitleWidth: ROW_TITLE_COLUMN_WIDTH,
    showMenu: false,
    settings: {},
    menuX: 0,
    menuY: 0,
    truckId: null,
    tmpStartDate: null,
  }),
  computed: {
    date() {
      return this.$store.getters.scheduleDate
    },

    secInPx() {
      return getSecInPx({
        lengthInPx: this.tableWidth,
        dayCount: this.columns.length,
      })
    },

    draggableMode() {
      return (
        PermissionService.check({ permissions: ['order:move'] }) &&
        this.settings.showDowntimes &&
        !this.settings.controlOnly
      )
    },

    period() {
      return getPeriodByWidthAndDate({
        date: this.date,
        width: this.tableWidth,
      })
    },

    columns() {
      return getDaysFromPeriod(this.period)
    },

    cellStyles() {
      return {
        height: LINE_HEIGHT + 'px',
      }
    },

    filteredOrders() {
      const orders = this.$store.getters.ordersForSchedule
      if (!this.settings.controlOnly) return orders
      return orders.filter((i) => i.state.warning)
    },

    distributedOrders() {
      return this.filteredOrders.filter((i) => !!i?.truckId)
    },
    unDistributedOrders() {
      return this.filteredOrders.filter((i) => !i?.truckId)
    },

    filteredNotes() {
      if (this.settings.showNotes) return this.$store.getters.notesForSchedule
      return []
    },

    downtimeTruckIdMap() {
      if (!this.settings.showDowntimes) return {}
      const map = {}
      for (const d of this.$store.getters.downtimesForSchedule) {
        map[d._id] = d.truck
      }
      return map
    },
    filteredDountimes() {
      if (!this.settings.showDowntimes) return []
      return this.$store.getters.downtimesForSchedule
    },

    itemTypeMap() {
      const map = {}
      for (const o of this.distributedOrders) map[o._id] = 'order'
      for (const d of this.filteredDountimes) map[d._id] = 'downtime'
      return map
    },

    allItems() {
      const items = [...this.distributedOrders, ...this.filteredDountimes]
      return items.sort((a, b) => new Date(a.startPositionDate) - new Date(b.startPositionDate))
    },

    notesStyle() {
      if (!this.filteredNotes.length) return {}
      const styles = {}
      for (const note of this.filteredNotes) {
        styles[note._id] = {
          left:
            this.getLeftShiftForOrder({
              startPositionDate: note.startPositionDate,
              needRoundTime: true,
            }) + 'px',
          top:
            this.getTopShiftForOrder({ _id: note._id }, { truckId: note.truck }) +
            (LINE_HEIGHT - 3) / 2 +
            'px',
        }
      }
      return styles
    },

    lineForUndistributedOrdersMap() {
      const linesMap = new Map()
      for (const order of this.unDistributedOrders) {
        const group = Math.floor(this.getLeftShiftForOrder(order))
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
    },

    bufferHeight() {
      const size = this.lineForUndistributedOrdersMap.size
      if (size === 0) return LINE_HEIGHT * 2 + 'px'
      let max = 0
      this.lineForUndistributedOrdersMap.forEach((val) => {
        if (val > max) max = val
      })
      return ((max + 1) * LINE_HEIGHT + LINE_HEIGHT).toString() + 'px'
    },

    stylesByItemId() {
      const map = {}
      for (const item of this.allItems) {
        map[item._id] = this.getStylesForOrder(item)
      }
      for (const order of this.unDistributedOrders) {
        map[order._id] = this.getStylesForOrder(order)
      }
      return map
    },
  },
  watch: {
    period: {
      immediate: false,
      handler: function (val) {
        if (val) this.$store.commit('setPeriod', val)
      },
    },
  },
  beforeUnmount() {
    window.removeEventListener('resize', this._debouncedResize)
  },
  mounted() {
    this._debouncedResize = debounce(this.resizeScreen, 150)
    window.addEventListener('resize', this._debouncedResize)
    this.resizeScreen()
  },
  methods: {
    dblclickHandler(e, isBuffer) {
      e.preventDefault()
      this.truckId = null

      const td = e.target.closest('td')
      if (!td) return null

      const cellIndex = td.cellIndex
      if (cellIndex < 1) return null

      const columnIndex = cellIndex - 1
      if (columnIndex >= this.columns.length) return null

      const column = this.columns[columnIndex]
      const cellRect = td.getBoundingClientRect()
      const xInCell = e.clientX - cellRect.left
      const slotIndex = Math.min(3, Math.floor((xInCell / cellRect.width) * 4))
      const hour = slotIndex * 6

      this.tmpStartDate = dayjs(column.date).hour(hour).format('YYYY-MM-DD HH:00')

      if (isBuffer && this.$store.getters.hasPermission('order:create')) this.createOrder()
      else if (!isBuffer) {
        const tr = td.closest('tr.truck-row')
        if (!tr) return null

        this.truckId = tr.dataset.truckId
        if (!this.truckId) return null

        this.menuX = e.clientX
        this.menuY = e.clientY
        this.showMenu = true
      }
    },

    createDowntime() {
      this.$router.push({
        name: 'DowntimeCreate',
        query: {
          truckId: this.truckId,
          startDate: this.tmpStartDate,
        },
      })
    },

    createOrder() {
      this.$router.push({
        name: 'CreateOrder',
        query: {
          truckId: this.truckId,
          startDate: this.tmpStartDate,
        },
      })
    },

    createScheduleNote() {
      this.$router.push({
        name: 'ScheduleNoteCreate',
        query: {
          truckId: this.truckId,
          startDate: this.tmpStartDate,
        },
      })
    },

    resizeScreen() {
      if (!this.$refs.tableBody) return null
      this.titleColumnWidth = this.$refs.rowTitleColumn.offsetWidth
      this.titleRowHeight = this.$refs.rowTitleColumn.offsetHeight
      this.tableWidth = this.$refs.tableBody.offsetWidth - this.titleColumnWidth
    },

    getLeftShiftForOrder({ startPositionDate, needRoundTime }) {
      // Округляем время отображения до 00, 06, 12, 18
      if (!this.tableWidth) return null

      let sPositionMoment
      if (needRoundTime) {
        sPositionMoment = dayjs(startPositionDate)
        sPositionMoment = sPositionMoment.hour(roundingHours(sPositionMoment.hour()))
        sPositionMoment = sPositionMoment.minute(0)
      } else {
        // если это downtime
        sPositionMoment = dayjs(startPositionDate)
      }

      const sPeriod = dayjs(this.period[0]).unix()
      const sOrder = sPositionMoment.unix()
      let leftShift = 0
      if (sPeriod <= sOrder) leftShift = sOrder - sPeriod
      return leftShift / this.secInPx + this.titleColumnWidth
    },

    getTopShiftForOrder({ _id, truckId }, truckOverrides) {
      const id = truckId || truckOverrides?.truckId || this.downtimeTruckIdMap[_id]
      if (!id) return this.lineForUndistributedOrdersMap.get(_id) * LINE_HEIGHT

      const rowIdx = this.rows.findIndex((item) => item._id === id)
      if (rowIdx === -1) return null
      return rowIdx * LINE_HEIGHT + this.titleRowHeight
    },

    getOrderWidth({ startPositionDate, endPositionDate, type, needRoundTime, isCompleted }) {
      let startPoint
      let endPoint
      const SEC_IN_SIX_HOURS = 6 * 60 * 60
      const SEC_IN_THREE_HOURS = 3 * 60 * 60
      if (dayjs(startPositionDate).isBefore(this.period[0])) startPoint = dayjs(this.period[0])
      else {
        startPoint = dayjs(startPositionDate)
      }

      if (needRoundTime) {
        startPoint = startPoint.hour(roundingHours(startPoint.hour()))
        startPoint = startPoint.minute(0)
      }
      if (dayjs(this.period[1]).add(24, 'h').isBefore(endPositionDate))
        endPoint = dayjs(this.period[1]).add(1, 'd')
      else {
        endPoint = dayjs(endPositionDate)
      }
      const dutation = endPoint.unix() - startPoint.unix()
      // если сервис и включен режим "планиуремых дат"
      if (type && this.$store.getters.onlyPlannedDates)
        return (dutation > SEC_IN_THREE_HOURS ? dutation : SEC_IN_THREE_HOURS) / this.secInPx
      else
        return (
          (dutation > SEC_IN_SIX_HOURS ||
          !!type ||
          (isCompleted && !this.$store.getters.onlyPlannedDates)
            ? dutation
            : SEC_IN_SIX_HOURS) / this.secInPx
        )
    },

    getStylesForOrder(order) {
      return {
        height: LINE_HEIGHT + 'px',
        width: this.getOrderWidth(order) + 'px',
        left: this.getLeftShiftForOrder(order) + 'px',
        top: this.getTopShiftForOrder(order) + 'px',
        opacity: order.isDisabled ? 0.5 : 0.92,
        'z-index': this.itemTypeMap[order._id] === 'order' ? 4 : 3,
      }
    },

    dragStartHandler(e, id) {
      const dt = e.dataTransfer
      dt.setData('text/orderId', id)
      dt.effectAllowed = 'move'
      this.draggedOrderId = id
      e.target.style.opacity = 0.5
      this.$emit('startDragOrder', id)
    },

    dragEndHandler(e, orderId) {
      e.target.style.opacity = 1
      if (e.dataTransfer.dropEffect === 'none') this.$emit('endDragOrder', orderId)
      this.overRowInd = null
      this.draggedOrderId = null
    },

    dragOverHandler(e) {
      const tableRect = e.currentTarget.getBoundingClientRect()
      const y = e.clientY - tableRect.top
      const x = e.clientX - tableRect.left - this.titleColumnWidth
      if (x < 0 || y < 0 || e.dataTransfer.effectAllowed === 'none') {
        e.dataTransfer.dropEffect = 'none'
        this.overRowInd = null
        return true
      }
      e.dataTransfer.dropEffect = 'move'
      if (this._dragRAF) return
      this._dragRAF = requestAnimationFrame(() => {
        this._dragRAF = null
        this.overRowInd = Math.max(0, Math.floor((y - this.titleRowHeight) / LINE_HEIGHT))
      })
    },

    dropOnBufferHandler(e) {
      this.draggedOrderId = null
      const tableRect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - tableRect.left - this.titleColumnWidth
      let startDate = dayjs.unix(dayjs(this.period[0]).unix() + x * this.secInPx)
      startDate = startDate.hour(roundingHours(startDate.hour()))
      this.$emit('updateOrder', {
        truckId: null,
        orderId: e.dataTransfer.getData('text/orderId'),
        startDate: startDate.toISOString(),
      })
    },

    dropHandler(e) {
      this.draggedOrderId = null
      if (this.overRowInd === null || this.overRowInd < 0 || this.overRowInd > this.rows.length - 1)
        return null

      const tableRect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - tableRect.left - this.titleColumnWidth
      let startDate = dayjs.unix(dayjs(this.period[0]).unix() + x * this.secInPx)
      startDate = startDate.hour(roundingHours(startDate.hour()))

      this.$emit('updateOrder', {
        truckId: this.rows[this.overRowInd]._id,
        orderId: e.dataTransfer.getData('text/orderId'),
        startDate: startDate.format('YYYY-MM-DD HH:00'),
      })
    },

    disabledZone(e) {
      e.dataTransfer.dropEffect = 'none'
      e.dataTransfer.effectAllowed = 'none'
      this.overRowInd = null
      return true
    },

    isDraggableOrder(order) {
      const disabled = order.isDisabled
      const confirmed = order.state?.driverNotified || order.state?.clientNotified
      return !disabled && !confirmed
    },
  },
}
</script>
<style scoped>
.table-wrapper {
  --table-border: rgb(0, 0, 0) 1px solid;
  width: 100%;
  box-sizing: border-box;
  overflow-y: scroll;
  overflow-x: hidden;
}
.buffer-wrapper {
  width: 100%;
  margin-top: 5px;
  box-sizing: border-box;
  overflow-y: scroll;
  overflow-x: hidden;
}

table {
  --table-border: rgb(0, 0, 0) 1px solid;
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
