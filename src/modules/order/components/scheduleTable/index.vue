/* eslint-disable vue/no-template-key */
<template>
  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          <td
            ref="rowTitleColumn"
            class="row-title-column text-center"
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
          </td>
        </tr>
      </thead>
      <tbody
        ref="tableBody"
        @dragover.prevent="dragOverHandler"
        @drop.prevent="dropHandler"
        @dragleave.prevent="disabledZone"
      >
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
            v-for="order of filteredOrders"
            :key="order._id"
            tag="div"
            class="block"
            :draggable="!order.isDisabled"
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
      </tbody>
    </table>
  </div>
</template>
<script>
import moment from 'moment'
import { LINE_HEIGHT } from './constants'
import { roundingHours } from './helpers'
import getSecInPx from '@/modules/common/helpers/getSecInPx'
import getDaysFromPeriod from '@/modules/common/helpers/getDaysFromPeriod'

import appTruckTitleCell from './truckTitleCell.vue'
import appOrderCell from './orderCell.vue'
import appBgGrid from './bgGrid'

export default {
  name: 'ScheduleTable',
  components: {
    appTruckTitleCell,
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
    secInPx: null,
    leftShiftInPx: 0,
    draggedOrderId: null,
    movedNode: null,
    overRowInd: null,
  }),
  computed: {
    period() {
      switch (true) {
        case this.tableWidth > 3000:
          return this.getPeriodFromDate(this.date, -3, 3)
        case this.tableWidth > 1900:
          return this.getPeriodFromDate(this.date, -2, 3)
        case this.tableWidth > 1680:
          return this.getPeriodFromDate(this.date, -1, 3)
        case this.tableWidth > 1470:
          return this.getPeriodFromDate(this.date, -1, 2)
        case this.tableWidth > 1100:
          return this.getPeriodFromDate(this.date, -1, 1)
        case this.tableWidth > 660:
          return this.getPeriodFromDate(this.date, 0, 1)
        case this.tableWidth > 500:
          return this.getPeriodFromDate(this.date, 0, 0)
        default:
          return this.getPeriodFromDate(this.date, -1, 3)
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
      return this.orders.filter(this.ordersFilterByPeriod)
      //.filter(this.ordersFilterByDraggedOrder)
    },
  },
  watch: {
    period: {
      immediate: false,
      handler: function (val, oldVal) {
        if (val && val.toString() !== oldVal.toString())
          this.$store.commit('setPeriod', val)
      },
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeScreen)
  },
  mounted() {
    this.resizeScreen()
    window.addEventListener('resize', this.resizeScreen)
  },
  methods: {
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
    getPeriodFromDate(dateStr, a, b) {
      return [
        moment(dateStr).add(a, 'd').format('YYYY-MM-DD'),
        moment(dateStr).add(b, 'd').format('YYYY-MM-DD'),
      ]
    },
    resizeScreen() {
      if (!this.$refs.tableBody) return null
      this.titleColumnWidth = this.$refs.rowTitleColumn.offsetWidth
      this.tableWidth =
        this.$refs.tableBody.offsetWidth - this.$refs.rowTitleColumn.offsetWidth

      this.secInPx = getSecInPx({
        lengthInPx: this.tableWidth,
        period: this.period,
      })
    },
    getLeftShiftForOrder({ startPositionDate }) {
      // Округляем время отображения до 00, 06, 12, 18
      const sPositionMoment = moment(startPositionDate)
      sPositionMoment.hour(roundingHours(sPositionMoment.hour()))

      if (!this.$refs.rowTitleColumn) return null
      const sPeriod = moment(this.period[0]).unix()
      const sOrder = sPositionMoment.unix()
      let leftShift = 0
      if (sPeriod <= sOrder) leftShift = sOrder - sPeriod
      return leftShift / this.secInPx + this.$refs.rowTitleColumn.offsetWidth
    },

    getTopShiftForOrder({ truckId }) {
      const rowIdx = this.rows.findIndex((item) => item._id === truckId)
      if (rowIdx === -1) return null
      return rowIdx * LINE_HEIGHT
    },

    getOrderWidth({ startPositionDate, endPositionDate }) {
      let startPoint
      let endPoint
      const SEC_IN_SIX_HOURS = 6 * 60 * 60
      if (new Date(startPositionDate) < new Date(this.period[0]))
        startPoint = moment(this.period[0])
      else startPoint = moment(startPositionDate)
      startPoint.hour(roundingHours(startPoint.hour()))

      if (moment(this.period[1]).add(24, 'h').isBefore(endPositionDate))
        endPoint = moment(this.period[1]).add(1, 'd')
      else endPoint = moment(endPositionDate)
      const dutation = endPoint.unix() - startPoint.unix()
      endPoint.hour(roundingHours(endPoint.hour()))
      return (
        (dutation > SEC_IN_SIX_HOURS ? dutation : SEC_IN_SIX_HOURS) /
        this.secInPx
      )
    },

    getStylesForOrder(order) {
      return {
        height: LINE_HEIGHT - 1 + 'px',
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
      // e.target.className = 'empty'
      // e.target.style.zIndex = 5
      e.target.style.opacity = 1
      this.draggedOrderId = null
      this.overRowInd = null
      if (
        e.dataTransfer.dropEffect === 'none' ||
        e.dataTransfer.mozUserCancelled
      ) {
        this.$emit('endDragOrder', orderId)
      } else {
        // console.log('dragend')
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
        this.overRowInd = Math.floor(y / LINE_HEIGHT)
      }
    },

    dropHandler(e) {
      if (
        this.overRowInd === null ||
        this.overRowInd < 0 ||
        this.overRowInd > this.rows.length - 1
      )
        return null
      // const y = e.layerY
      const x = e.layerX - this.$refs.rowTitleColumn.scrollWidth
      // const leftShiftInSec = this.leftShiftInPx * this.secInPx
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
  },
}
</script>
<style scoped>
.table-wrapper {
  width: 100%;
  margin: 8px;
  box-sizing: content-box;
  max-height: 70vh;
  min-height: 70vh;
  overflow-y: scroll;
  overflow-x: hidden;
}
table {
  --table-border: rgb(154, 154, 154) 1px solid;
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  border: var(--table-border);
  box-sizing: border-box;
}
td {
  border: var(--table-border);
}

thead > tr > td {
  position: sticky;
  top: 0;
  z-index: 4;
  background-color: white;
}

tbody {
  position: relative;
  z-index: 0;
  user-select: auto;
}
.block {
  position: absolute;
  /* z-index: 5; */
}

.today-header {
  font-weight: 700;
}
.drag-over-row {
  box-shadow: inset 0px 0px 3px 1px lightskyblue;
}
</style>
