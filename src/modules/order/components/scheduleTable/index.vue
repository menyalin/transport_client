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
        @dragover.prevent.stop="dragOverHandler"
        @drop.prevent="dropHandler"
      >
        <tr
          v-for="truck of rows"
          :key="truck._id"
          class="truck-row"
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
          @dragover="disabledZone"
          @dragenter="disabledZone"
          @dragstart="dragStartHandler($event, order._id)"
          @dragend="dragEndHandler($event, order._id)"
        >
          <app-order-cell />
        </div>

        <div
          class="block-2"
          @dragover="disabledZone"
          @dragenter="disabledZone"
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
import moment from 'moment'

export default {
  name: 'ScheduleTable',
  components: {
    appTruckTitleCell,
    appOrderCell,
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
    secInPx: null,
    draggedOrderId: null,
    movedNode: null,
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
      this.$emit('startDragOrder', id)
      dt.setData('application/orderId', id)
      dt.dropEffect = 'moveLink'
      dt.effectAllowed = 'moveLink'
      //dt.setDragImage(e.target, 0, 0)
      e.target.style['z-index'] = -1
    },
    dragEndHandler(e, orderId) {
      this.$emit('endDragOrder', orderId)
      e.target.style.cursor = 'grab'
      e.target.style['z-index'] = 3
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
      const x = e.layerX - this.$refs.rowTitleColumn.clientWidth
      if (x < 0 || y < 0) {
        e.dataTransfer.dropEffect = 'none'
        return true
      }
      return false
    },
    dropHandler(e) {
      const y = e.layerY
      const x = e.layerX - this.$refs.rowTitleColumn.clientWidth
      const startDate = moment
        .unix(moment(this.period[0]).unix() + x * this.secInPx)
        .format('YYYY-MM-DD HH:00')
      const rowInd = Math.floor(y / LINE_HEIGHT)
      this.$emit('updateOrder', {
        truckId: this.rows[rowInd]._id,
        orderId: e.dataTransfer.getData('application/orderId'),
        startDate,
      })
    },
    disabledZone(e) {
      e.dataTransfer.dropEffect = 'none'
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
}
td,
th {
  border: var(--table-border);
}

tbody {
  position: relative;
}
.block {
  position: absolute;
  cursor: grab;
}
.block-2 {
  position: absolute;
  top: 120px;
  left: 340px;
  background-color: red;
  width: 200px;
  height: 100px;
  z-index: 3;
}
.today-header {
  font-weight: 700;
}
</style>
