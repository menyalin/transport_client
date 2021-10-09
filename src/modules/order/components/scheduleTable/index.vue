/* eslint-disable vue/no-template-key */
<template>
  <div class="table-wrapper">
    {{ tableWidth }}
    <table border="1">
      <thead>
        <tr>
          <td ref="rowTitleColumn" />
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
        @dragenter.prevent
        @dragover.prevent
      >
        <tr
          v-for="truck of rows"
          :key="truck._id"
          class="truck-row"
        >
          <td :style="cellStyles">
            <app-truck-title-cell :title="truck.regNum" />
          </td>
          <td
            v-for="date of columns"
            :key="date.title"
          />
        </tr>
        <div
          v-for="order of orders"
          :key="order._id"
          class="block"
          draggable
          :style="getStylesForOrder(order)"
          @dragstart="dragstart"
        />
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
import getSecInPx from '@/modules/common/helpers/getSecInPx'
import moment from 'moment'

export default {
  name: 'ScheduleTable',
  components: {
    appTruckTitleCell,
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
  }),
  computed: {
    cellStyles() {
      return {
        height: LINE_HEIGHT + 'px',
      }
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
    getStylesForOrder(order) {
      return {
        left: this.getLeftShiftForOrder(order) + 'px',
      }
    },
    dragstart(e) {
      console.log(e)
    },
    disabledZone(e) {
      e.dataTransfer.effectAllowed = 'none'
      return false
    },
  },
}
</script>
<style scoped>
.table-wrapper {
  width: 100%;
  padding: 15px;
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
  top: 20px;
  background-color: indigo;
  width: 70px;
  height: 50px;
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
