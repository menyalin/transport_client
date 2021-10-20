/* eslint-disable vue/no-template-key */
<template>
  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          <td
            ref="rowTitleColumn"
            class="row-title-column"
          />
          <td
            v-for="date of columns"
            :key="date.title"
            :class="{ 'today-header': date.isToday, 'text-center': true }"
          >
            {{ date.title }}
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
            v-for="date of columns"
            :key="date.title"
          />
        </tr>
        <div
          v-for="order of filteredOrders"
          :key="order._id"
          tag="div"
          class="block"
          draggable
          :style="getStylesForOrder(order)"
          @dragstart="dragStartHandler($event, order._id)"
          @dragend="dragEndHandler($event, order._id)"
        >
          <app-order-cell />
        </div>

        <app-bg-grid
          v-if="titleColumnWidth"
          :leftShift="titleColumnWidth"
          :tableWidth="tableWidth + titleColumnWidth"
          :days="columns"
        />
      </tbody>
    </table>
  </div>
</template>
<script>
import { LINE_HEIGHT } from './constants'
import appTruckTitleCell from './truckTitleCell.vue'
import appOrderCell from './orderCell.vue'
import getSecInPx from '@/modules/common/helpers/getSecInPx'
import appBgGrid from './bgGrid'
import moment from 'moment'

export default {
  name: 'ScheduleTable',
  components: {
    appTruckTitleCell,
    appOrderCell,
    appBgGrid,
  },
  props: {
    columns: {
      type: Array,
      required: true,
    },
    rows: {
      type: Array,
      required: true,
    },
    period: {
      type: Array,
      required: true,
    },
    orders: {
      type: Array,
    },
  },
  data: () => ({
    tableWidth: 0,
    titleColumnWidth: 0,
    secInPx: null,
    draggedOrderId: null,
    movedNode: null,
    overRowInd: null,
  }),
  computed: {
    cellStyles() {
      return {
        height: LINE_HEIGHT + 'px',
      }
    },
    filteredOrders() {
      return this.orders.filter((item) =>
        this.draggedOrderId ? item._id !== this.draggedOrderId : true
      )
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
    resizeScreen() {
      if (!this.$refs.tableBody) return null
      this.titleColumnWidth = this.$refs.rowTitleColumn.offsetWidth
      this.tableWidth =
        this.$refs.tableBody.offsetWidth - this.$refs.rowTitleColumn.offsetWidth
      this.$nextTick(() => {
        this.secInPx = getSecInPx({
          lengthInPx: this.tableWidth,
          period: this.period,
        })
      })
    },
    getLeftShiftForOrder({ startPositionDate }) {
      if (!this.$refs.rowTitleColumn) return null
      const sPeriod = moment(this.period[0]).unix()
      const sOrder = moment(startPositionDate).unix()
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
      const orderDurationSec =
        moment(endPositionDate).unix() - moment(startPositionDate).unix()
      return orderDurationSec / this.secInPx
    },
    getStylesForOrder(order) {
      return {
        height: LINE_HEIGHT - 1 + 'px',
        width: this.getOrderWidth(order) + 'px',
        left: this.getLeftShiftForOrder(order) + 'px',
        top: this.getTopShiftForOrder(order) + 'px',
      }
    },
    dragStartHandler(e, id) {
      const dt = e.dataTransfer
      dt.setData('text/orderId', id)
      dt.setData(
        'text/leftShiftInPx',
        e.clientX - e.target.getBoundingClientRect().left
      )
      dt.dropEffect = 'move'
      dt.effectAllowed = 'move'
      // dt.setDragImage(
      //   e.target.cloneNode(true),
      //   e.clientX - e.target.getBoundingClientRect().left,
      //   e.clientY - e.target.getBoundingClientRect().top
      // )
      this.$emit('startDragOrder', id)
      e.target.style.zIndex = 1
      e.target.style.opacity = 0.5
    },
    dragEndHandler(e, orderId) {
      this.$emit('endDragOrder', orderId)
      e.target.style.zIndex = 5
      e.target.style.opacity = 1
      this.overRowInd = null
      if (
        e.dataTransfer.dropEffect === 'none' ||
        e.dataTransfer.mozUserCancelled
      ) {
        // console.log('dragCanceled')
      } else {
        // console.log('dragend')
      }
    },
    dragOverHandler(e) {
      const y = e.layerY
      const x = e.layerX - this.$refs.rowTitleColumn.offsetWidth
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
      const y = e.layerY
      const x = e.layerX - this.$refs.rowTitleColumn.offsetWidth
      const leftShiftInSec =
        e.dataTransfer.getData('text/leftShiftInPx') * this.secInPx
      const startDate = moment
        .unix(moment(this.period[0]).unix() + x * this.secInPx - leftShiftInSec)
        .format('YYYY-MM-DD HH:00')
      const rowInd = Math.floor(y / LINE_HEIGHT)
      this.$emit('updateOrder', {
        truckId: this.rows[rowInd]._id,
        orderId: e.dataTransfer.getData('text/orderId'),
        startDate,
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
  padding: 15px;
  box-sizing: border-box;
}
table {
  --table-border: rgb(154, 154, 154) 1px solid;
  width: 100%;
  border-collapse: collapse;
  border: var(--table-border);
  z-index: 3;
}
td,
th {
  border: var(--table-border);
}

tbody {
  position: relative;

  user-select: auto;
}
.block {
  position: absolute;
  z-index: 5;
}

.today-header {
  font-weight: 700;
}
.drag-over-row {
  box-shadow: inset 0px 0px 3px 1px lightskyblue;
}
</style>
