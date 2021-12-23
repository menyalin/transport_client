/* eslint-disable vue/no-template-key */
<template>
  <div>
    <div class="table-wrapper">
      <table
        ref="tableBody"
        @dragover.prevent="dragOverHandler"
        @drop.prevent="dropHandler"
        @dragleave.prevent="disabledZone"
        @dblclick.stop="dblclickHandler"
      >
        <tr class="head-row">
          <td
            ref="rowTitleColumn"
            class="text-center"
            :style="{ width: initTitleWidth }"
          >
            <v-icon
              small
              @click="$emit('showSetting')"
            >
              mdi-cog
            </v-icon>
          </td>
          <td
            v-for="column of columns"
            :key="column.title"
            :class="{ 'today-header': column.isToday, 'text-center': true }"
          >
            <div>{{ column.title }}</div>
            <div class="title-time-row">
              <div>00-06</div>
              <div>06-12</div>
              <div>12-18</div>
              <div>18-00</div>
            </div>
          </td>
        </tr>

        <tr
          v-for="(truck, idx) of rows"
          :key="truck._id"
          class="truck-row"
          :class="{ 'drag-over-row': idx === overRowInd }"
        >
          <td :style="cellStyles">
            <app-truck-title-cell
              :id="truck._id"
              :title="truck.regNum"
            />
          </td>
          <td
            v-for="column of columns"
            :key="column.title"
          />
        </tr>
        <template v-if="tableWidth">
          <div
            v-for="item of allItems"
            :key="item._id"
            tag="div"
            class="block"
            :draggable="
              item.itemType === 'order' ? isDraggableOrder(item) : false
            "
            :style="item.itemStyles"
            @dragstart="dragStartHandler($event, item._id)"
            @dragend="dragEndHandler($event, item._id)"
            @dragover="disabledZone"
          >
            <app-order-cell
              v-if="item.itemType === 'order'"
              :orderId="item._id"
            />
            <app-downtime-cell
              v-else
              :itemId="item._id"
            />
          </div>

          <app-bg-grid
            v-if="titleColumnWidth"
            :leftShift="titleColumnWidth"
            :tableWidth="tableWidth + titleColumnWidth"
            :days="columns"
          />
        </template>
      </table>
    </div>
    <v-divider />
    <div class="buffer-wrapper">
      <table
        @dragover.prevent
        @drop.prevent="dropOnBufferHandler"
        @dblclick.stop="dblclickHandler($event, true)"
      >
        <tr :style="{ 'min-height': '100%' }">
          <td
            :style="{
              width: initTitleWidth,
              height: bufferHeight,
            }"
          />
          <td
            v-for="column of columns"
            :key="column.title"
          />
        </tr>
        <template v-if="tableWidth">
          <div
            v-for="order of unDistributedOrders"
            :key="order._id"
            tag="div"
            class="block"
            :draggable="isDraggableOrder(order)"
            :style="getStylesForOrder(order)"
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
      </table>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import { LINE_HEIGHT, ROW_TITLE_COLUMN_WIDTH } from './constants'
import { roundingHours } from './helpers'
import getSecInPx from '@/modules/common/helpers/getSecInPx'
import getDaysFromPeriod from '@/modules/common/helpers/getDaysFromPeriod'

import appTruckTitleCell from './truckTitleCell.vue'
import appOrderCell from './orderCell.vue'
import appDowntimeCell from './downtimeCell.vue'
import appBgGrid from './bgGrid'

export default {
  name: 'ScheduleTable',
  components: {
    appTruckTitleCell,
    appDowntimeCell,
    appOrderCell,
    appBgGrid,
  },
  props: {
    rows: {
      type: Array,
      required: true,
    },
    orders: {
      type: Array,
    },
    date: {
      type: String,
    },
  },
  data: () => ({
    tableWidth: 0,
    titleColumnWidth: 0,
    titleRowHeight: 0,
    leftShiftInPx: 0,
    draggedOrderId: null,
    dayCount: 5,
    movedNode: null,
    overRowInd: null,
    initTitleWidth: ROW_TITLE_COLUMN_WIDTH,
  }),
  computed: {
    secInPx() {
      return getSecInPx({
        lengthInPx: this.tableWidth,
        dayCount: this.dayCount,
      })
    },
    period() {
      switch (true) {
        case this.tableWidth > 3000:
          return this.getPeriodFromDate(this.date, -3, 3, 7)
        case this.tableWidth > 1900:
          return this.getPeriodFromDate(this.date, -2, 3, 6)
        case this.tableWidth > 1680:
          return this.getPeriodFromDate(this.date, -1, 3, 5)
        case this.tableWidth > 1470:
          return this.getPeriodFromDate(this.date, -1, 2, 4)
        case this.tableWidth > 1100:
          return this.getPeriodFromDate(this.date, -1, 1, 3)
        case this.tableWidth > 660:
          return this.getPeriodFromDate(this.date, 0, 1, 2)
        case this.tableWidth > 500:
          return this.getPeriodFromDate(this.date, 0, 0, 1)
        default:
          return this.getPeriodFromDate(this.date, -1, 3, 5)
      }
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
      return this.$store.getters.ordersForSchedule
    },
    allItems() {
      // Объединяем в один массив заказы и простою, сортируем по дате отображения
      return this.distributedOrders
        .map((o) => ({
          ...o,
          itemType: 'order',
        }))
        .concat(
          this.filteredDountimes.map((d) => ({ ...d, itemType: 'downtime' }))
        )
        .sort(
          (a, b) =>
            new Date(a.startPositionDate) - new Date(b.startPositionDate)
        )
        .map((item) => ({
          ...item,
          itemStyles: this.getStylesForOrder(item),
        }))
    },
    distributedOrders() {
      return this.filteredOrders.filter((i) => !!i?.truckId)
    },
    unDistributedOrders() {
      return this.filteredOrders.filter((i) => !i?.truckId)
    },
    filteredDountimes() {
      return this.$store.getters.downtimesForSchedule.map((item) => ({
        ...item,
        truckId: item.truck,
      }))
    },
    lineForUndistributedOrdersMap() {
      let tmpMap = new Map()
      // группируем рейсы по дате начала и определяем кол-во строк для отображения буферной зоны
      for (let order of this.unDistributedOrders) {
        const group = this.getLeftShiftForOrder(order)
        if (tmpMap.has(group)) {
          const arr = tmpMap.get(group)
          arr.push(order._id)
          tmpMap.set(group, arr)
        } else tmpMap.set(group, [order._id])
      }
      const orderLinesMap = new Map()
      for (let group of tmpMap) {
        group[1].forEach((orderId) => {
          orderLinesMap.set(
            orderId,
            group[1].findIndex((i) => i === orderId)
          )
        })
      }
      return orderLinesMap
    },
    bufferHeight() {
      let arr = []
      if (this.lineForUndistributedOrdersMap.size === 0)
        return LINE_HEIGHT * 2 + 'px'
      this.lineForUndistributedOrdersMap.forEach((val) => arr.push(val))
      return (
        ((Math.max(...arr) + 1) * LINE_HEIGHT + LINE_HEIGHT).toString() + 'px'
      )
    },
  },
  watch: {
    period: {
      immediate: false,
      handler: function (val) {
        if (!!val) this.$store.commit('setPeriod', val)
      },
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeScreen)
  },
  mounted() {
    window.addEventListener('resize', this.resizeScreen)
    this.$nextTick(() => {
      this.resizeScreen()
    })
  },
  methods: {
    dblclickHandler(e, isBuffer) {
      let truckId = null
      let offsetY
      if (isBuffer) {
        offsetY = e.layerY
      } else {
        offsetY = e.layerY - this.titleRowHeight
      }

      const offsetX = e.layerX - this.titleColumnWidth
      if (offsetX < 0 || offsetY < 0) return null
      if (!isBuffer) {
        const rowInd = Math.floor(offsetY / LINE_HEIGHT)
        truckId = this.rows[rowInd]._id
      }

      const startDateM = moment(this.period[0]).add(this.secInPx * offsetX, 's')
      startDateM.hour(roundingHours(startDateM.hour()))

      this.$router.push({
        name: 'CreateOrder',
        params: {
          truckId,
          startDate: startDateM.format('YYYY-MM-DD HH:00'),
        },
      })
    },
    ordersFilterByPeriod(item) {
      return !(
        moment(item.endPositionDate).isBefore(this.period[0]) ||
        moment(this.period[1])
          .add('24', 'd')
          .isSameOrBefore(item.startPositionDate)
      )
    },
    ordersFilterByDraggedOrder(item) {
      return this.draggedOrderId ? item._id !== this.draggedOrderId : true
    },

    getPeriodFromDate(dateStr, a, b, dayCount) {
      this.dayCount = dayCount
      return [
        moment(dateStr).add(a, 'd').format('YYYY-MM-DD'),
        moment(dateStr).add(b, 'd').format('YYYY-MM-DD'),
      ]
    },

    resizeScreen() {
      if (!this.$refs.tableBody) return null
      this.titleColumnWidth = this.$refs.rowTitleColumn.offsetWidth
      this.titleRowHeight = this.$refs.rowTitleColumn.offsetHeight
      this.tableWidth =
        this.$refs.tableBody.offsetWidth - this.$refs.rowTitleColumn.offsetWidth
    },

    getLeftShiftForOrder({ startPositionDate, needRoundTime }) {
      // Округляем время отображения до 00, 06, 12, 18
      if (!this.$refs.rowTitleColumn) return null

      let sPositionMoment
      // У заказа нет поля type, оно только у dowtime
      if (needRoundTime) {
        sPositionMoment = moment(startPositionDate)
        sPositionMoment.hour(roundingHours(sPositionMoment.hour()))
        sPositionMoment.minute(0)
      } else {
        // если это downtime
        sPositionMoment = moment(startPositionDate)
      }

      const sPeriod = moment(this.period[0]).unix()
      const sOrder = sPositionMoment.unix()
      let leftShift = 0
      if (sPeriod <= sOrder) leftShift = sOrder - sPeriod
      return leftShift / this.secInPx + this.$refs.rowTitleColumn.offsetWidth
    },

    getTopShiftForOrder({ truckId, _id }) {
      if (!truckId)
        return this.lineForUndistributedOrdersMap.get(_id) * LINE_HEIGHT

      const rowIdx = this.rows.findIndex((item) => item._id === truckId)
      if (rowIdx === -1) return null
      return rowIdx * LINE_HEIGHT + this.titleRowHeight
    },

    getOrderWidth({
      startPositionDate,
      endPositionDate,
      needRoundTime,
      isCompleted,
    }) {
      let startPoint
      let endPoint
      const SEC_IN_SIX_HOURS = 6 * 60 * 60
      if (moment(startPositionDate).isBefore(this.period[0]))
        startPoint = moment(this.period[0])
      else {
        startPoint = moment(startPositionDate)
      }

      if (needRoundTime) {
        startPoint.hour(roundingHours(startPoint.hour()))
        startPoint.minute(0)
      }
      if (moment(this.period[1]).add(24, 'h').isBefore(endPositionDate))
        endPoint = moment(this.period[1]).add(1, 'd')
      else {
        endPoint = moment(endPositionDate)
      }
      const dutation = endPoint.unix() - startPoint.unix()
      return (
        (dutation > SEC_IN_SIX_HOURS || isCompleted
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
        opacity: order.isDisabled ? 0.5 : 1,
      }
    },

    dragStartHandler(e, id) {
      const dt = e.dataTransfer
      dt.setData('text/orderId', id)
      // this.leftShiftInPx = e.clientX - e.target.getBoundingClientRect().left
      dt.dropEffect = 'move'
      dt.effectAllowed = 'move'
      this.draggedOrderId = id
      this.$emit('startDragOrder', id)
      // e.target.style.zIndex = 1

      // setTimeout(() => (e.target.className = 'invisible'), 0)
      e.target.style.opacity = 0.5
    },

    dragEndHandler(e, orderId) {
      e.target.style.opacity = 1
      this.overRowInd = null
      if (this.draggedOrderId) {
        this.draggedOrderId = null
        this.$emit('endDragOrder', orderId)
      }
    },

    dragOverHandler(e) {
      const y = e.layerY
      const x = e.layerX - this.$refs.rowTitleColumn.scrollWidth
      if (x < 0 || y < 0 || e.dataTransfer.effectAllowed === 'none') {
        e.dataTransfer.dropEffect = 'none'
        this.overRowInd = null
        return true
      } else {
        e.dataTransfer.dropEffect = 'move'
        this.overRowInd = Math.floor((y - this.titleRowHeight) / LINE_HEIGHT)
      }
    },
    dropOnBufferHandler(e) {
      this.draggedOrderId = null
      const x = e.layerX - this.$refs.rowTitleColumn.scrollWidth
      const startDate = moment.unix(
        moment(this.period[0]).unix() + x * this.secInPx
      )
      startDate.hour(roundingHours(startDate.hour()))
      this.$emit('updateOrder', {
        truckId: null,
        orderId: e.dataTransfer.getData('text/orderId'),
        startDate: startDate.format('YYYY-MM-DD HH:00'),
      })
    },
    dropHandler(e) {
      this.draggedOrderId = null
      if (
        this.overRowInd === null ||
        this.overRowInd < 0 ||
        this.overRowInd > this.rows.length - 1
      )
        return null

      const x = e.layerX - this.$refs.rowTitleColumn.scrollWidth

      const startDate = moment.unix(
        moment(this.period[0]).unix() + x * this.secInPx
      )
      startDate.hour(roundingHours(startDate.hour()))

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
      const confirmed =
        order.state?.driverNotified || order.state?.clientNotified
      return !disabled && !confirmed
    },
  },
}
</script>
<style scoped>
.table-wrapper {
  --table-border: rgb(0, 0, 0) 1px solid;
  width: 100%;
  margin: 8px;
  box-sizing: border-box;
  max-height: 75vh;
  overflow-y: scroll;
  overflow-x: hidden;
  border-top: var(--table-border);
}
.buffer-wrapper {
  width: 100%;
  margin: 8px;
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
  z-index: 0;
  user-select: auto;
}
td {
  border-left: var(--table-border);
  border-right: var(--table-border);
  border-bottom: 1px dotted grey;
}
.head-row {
  position: sticky;
  top: 0;
  z-index: 4;
  background-color: white;
  user-select: none;
}

.block {
  position: absolute;
  padding-left: 1px;
  /* z-index: 5; */
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
  border-bottom: 1px dotted grey;
}
</style>
