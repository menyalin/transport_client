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
        <thead>
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
        </thead>
        <tbody>
          <tr
            v-for="(truck, idx) of rows"
            :key="truck._id"
            class="truck-row"
            :class="{ 'drag-over-row': idx === overRowInd }"
          >
            <td :style="cellStyles" @dragover.prevent="disabledZone">
              <app-truck-title-cell :id="truck._id" :idx="idx" :title="truck.regNum" />
            </td>
            <td v-for="column of columns" :key="column.title"></td>
          </tr>
          <tr :style="{ 'user-select': 'none', height: '100%' }" @dragover.prevent.stop="disabledZone">
            <td class="text-center">Итоги</td>
            <td v-for="column of columns" :key="column.title">
              <app-result-cell :date="column.date" />
            </td>
          </tr>
        </tbody>
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
          tag="div"
          class="block"
          :draggable="item.itemType === 'order' && draggableMode ? isDraggableOrder(item) : false"
          :style="getStylesForOrder(item)"
          @dragstart="dragStartHandler($event, item._id)"
          @dragend="dragEndHandler($event, item._id)"
          @dragover.prevent.stop="disabledZone"
        >
          <app-order-cell v-if="item.itemType === 'order'" :orderId="item._id" />
          <app-downtime-cell v-else :itemId="item._id" />
        </div>

        <app-bg-grid
          v-if="titleColumnWidth"
          :leftShift="titleColumnWidth"
          :tableWidth="tableWidth + titleColumnWidth"
          :days="columns"
        />
      </table>
      <div>
        <v-menu v-model="showMenu" :positionX="menuX" :positionY="menuY" absolute offsetY>
          <v-list>
            <v-list-item :disabled="!$store.getters.hasPermission('order:create')" @click="createOrder">
              <v-list-item-title>Создать рейс</v-list-item-title>
            </v-list-item>
            <v-list-item :disabled="!$store.getters.hasPermission('downtime:write')" @click="createDowntime">
              <v-list-item-title>Создать "сервис/выходной"</v-list-item-title>
            </v-list-item>
            <v-list-item :disabled="!$store.getters.hasPermission('scheduleNote:write')" @click="createScheduleNote">
              <v-list-item-title>Создать заметку</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>

    <v-divider />
    <div v-if="settings.showBufferZone" class="buffer-wrapper">
      <table @dragover.prevent @drop.prevent="dropOnBufferHandler" @dblclick.stop="dblclickHandler($event, true)">
        <tbody>
          <tr :style="{ 'min-height': '100%' }">
            <td
              :style="{
                width: initTitleWidth,
                height: bufferHeight,
              }"
            ></td>
            <td v-for="column of columns" :key="column.title"></td>
          </tr>
        </tbody>
        <template v-if="tableWidth">
          <div
            v-for="order of unDistributedOrders"
            :key="order._id"
            tag="div"
            class="block"
            :draggable="draggableMode && isDraggableOrder(order)"
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
  import dayjs from 'dayjs'

  import { LINE_HEIGHT, ROW_TITLE_COLUMN_WIDTH } from './constants'
  import { roundingHours } from './helpers'
  import getSecInPx from '@/modules/common/helpers/getSecInPx'
  import getDaysFromPeriod from '@/modules/common/helpers/getDaysFromPeriod'
  import getPeriodByWidthAndDate from './utils/getPeriodByWidthAndDate.js'

  import AppTruckTitleCell from './truckTitleCell.vue'
  import AppOrderCell from './orderCell.vue'
  import AppDowntimeCell from './downtimeCell.vue'
  import AppBgGrid from './bgGrid'
  import AppNote from './note.vue'
  import AppResultCell from './resultCell.vue'
  import AppSettingsCell from './settingsCell.vue'
  import { PermissionService } from '@/shared/services'

  export default {
    name: 'ScheduleTable',
    components: {
      AppTruckTitleCell,
      AppDowntimeCell,
      AppOrderCell,
      AppBgGrid,
      AppNote,
      AppResultCell,
      AppSettingsCell,
    },
    props: {
      rows: {
        type: Array,
        required: true,
      },
    },
    setup() {},
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

      notesStyle() {
        const styles = {}
        this.filteredNotes.forEach(note => {
          styles[note._id] = {
            left:
              this.getLeftShiftForOrder({
                startPositionDate: note.startPositionDate,
                needRoundTime: true,
              }) + 'px',
            top: this.getTopShiftForOrder({ truckId: note.truck }) + (LINE_HEIGHT - 3) / 2 + 'px',
          }
        })
        return styles
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
        return (
          this.$store.getters.ordersForSchedule
            // Только требующие контроля
            .filter(i => (this.settings.controlOnly ? i.state.warning : true))
        )
      },

      allItems() {
        // Объединяем в один массив заказы и простою, сортируем по дате отображения
        return (
          this.distributedOrders
            .map(o => ({
              ...o,
              itemType: 'order',
            }))
            .concat(this.filteredDountimes.map(d => ({ ...d, itemType: 'downtime' })))
            .sort((a, b) => new Date(a.startPositionDate) - new Date(b.startPositionDate)) || []
        )
      },
      distributedOrders() {
        return this.filteredOrders.filter(i => !!i?.truckId)
      },
      unDistributedOrders() {
        return this.filteredOrders.filter(i => !i?.truckId)
      },
      filteredNotes() {
        if (this.settings.showNotes) return this.$store.getters.notesForSchedule
        else return []
      },
      filteredDountimes() {
        if (this.settings.showDowntimes)
          return this.$store.getters.downtimesForSchedule.map(item => ({
            ...item,
            truckId: item.truck,
          }))
        else return []
      },

      lineForUndistributedOrdersMap() {
        let tmpMap = new Map()
        // группируем рейсы по дате начала и определяем кол-во строк для отображения буферной зоны
        for (let order of this.unDistributedOrders) {
          const group = Math.floor(this.getLeftShiftForOrder(order))
          if (tmpMap.has(group)) {
            const arr = tmpMap.get(group)
            arr.push(order._id)
            tmpMap.set(group, arr)
          } else tmpMap.set(group, [order._id])
        }
        const orderLinesMap = new Map()
        for (let group of tmpMap) {
          group[1].forEach(orderId => {
            orderLinesMap.set(
              orderId,
              group[1].findIndex(i => i === orderId)
            )
          })
        }
        return orderLinesMap
      },

      bufferHeight() {
        let arr = []
        if (this.lineForUndistributedOrdersMap.size === 0) return LINE_HEIGHT * 2 + 'px'
        this.lineForUndistributedOrdersMap.forEach(val => arr.push(val))
        return ((Math.max(...arr) + 1) * LINE_HEIGHT + LINE_HEIGHT).toString() + 'px'
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
      window.removeEventListener('resize', this.resizeScreen)
    },
    mounted() {
      window.addEventListener('resize', this.resizeScreen)
      this.resizeScreen()
    },
    methods: {
      dblclickHandler(e, isBuffer) {
        e.preventDefault()
        this.truckId = null
        let offsetY
        if (isBuffer) offsetY = e.layerY
        else offsetY = e.layerY - this.titleRowHeight
        const offsetX = e.layerX - this.titleColumnWidth
        if (offsetX < 0 || offsetY < 0) return null

        let startDateM = dayjs(this.period[0]).add(this.secInPx * offsetX, 's')
        startDateM = startDateM.hour(roundingHours(startDateM.hour()))
        this.tmpStartDate = startDateM.format('YYYY-MM-DD HH:00')

        if (isBuffer && this.$store.getters.hasPermission('order:create')) this.createOrder()
        else if (!isBuffer) {
          const rowInd = Math.floor(offsetY / LINE_HEIGHT)
          this.truckId = this.rows[rowInd]._id

          this.menuX = e.clientX
          this.menuY = e.clientY
          this.showMenu = true
        }
      },

      createDowntime() {
        this.$router.push({
          name: 'DowntimeCreate',
          params: {
            truckId: this.truckId,
            startDate: this.tmpStartDate,
          },
        })
      },

      createOrder() {
        this.$router.push({
          name: 'CreateOrder',
          params: {
            truckId: this.truckId,
            startDate: this.tmpStartDate,
          },
        })
      },

      createScheduleNote() {
        this.$router.push({
          name: 'ScheduleNoteCreate',
          params: {
            truckId: this.truckId,
            startDate: this.tmpStartDate,
          },
        })
      },

      notesFilterByPeriod(item) {
        return (
          dayjs(item.startPositionDate).isBefore(this.period[0]) &&
          dayjs(this.period[1]).add('24', 'h').isAfter(item.startPositionDate)
        )
      },

      ordersFilterByDraggedOrder(item) {
        return this.draggedOrderId ? item._id !== this.draggedOrderId : true
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

      getTopShiftForOrder({ truckId, _id }) {
        if (!truckId) return this.lineForUndistributedOrdersMap.get(_id) * LINE_HEIGHT

        const rowIdx = this.rows.findIndex(item => item._id === truckId)
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
        if (dayjs(this.period[1]).add(24, 'h').isBefore(endPositionDate)) endPoint = dayjs(this.period[1]).add(1, 'd')
        else {
          endPoint = dayjs(endPositionDate)
        }
        const dutation = endPoint.unix() - startPoint.unix()
        // если сервис и включен режим "планиуремых дат"
        if (type && this.$store.getters.onlyPlannedDates)
          return (dutation > SEC_IN_THREE_HOURS ? dutation : SEC_IN_THREE_HOURS) / this.secInPx
        else
          return (
            (dutation > SEC_IN_SIX_HOURS || !!type || (isCompleted && !this.$store.getters.onlyPlannedDates)
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
          'z-index': order.itemType === 'order' ? 4 : 3,
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
        if (e.dataTransfer.dropEffect === 'none' || e.dataTransfer.mozUserCancelled) this.$emit('endDragOrder', orderId)
        this.overRowInd = null
        this.draggedOrderId = null
      },

      dragOverHandler(e) {
        const y = e.layerY
        const x = e.layerX - this.titleColumnWidth
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
        const x = e.layerX - this.titleColumnWidth
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
        if (this.overRowInd === null || this.overRowInd < 0 || this.overRowInd > this.rows.length - 1) return null

        const x = e.layerX - this.titleColumnWidth
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
