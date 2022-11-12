<template>
  <v-tooltip
    bottom
    nudge-left="70"
    open-delay="700"
    close-delay="50"
    transition="fade-transition"
  >
    <template #activator="{ on, attrs }">
      <div
        v-bind="attrs"
        :class="orderClasses"
        v-on="on"
        @dblclick.stop="dblclickHandler"
      >
        <div class="row-text">
          <span
            v-for="point of points.filter((p) => p.type === 'loading')"
            :key="point.idx"
            :class="getPointStyles(point)"
          >
            {{ point.title }}
          </span>
        </div>
        <div class="row-text">
          <span
            v-for="point of points.filter((p) => p.type === 'unloading')"
            :key="point.idx"
            :class="getPointStyles(point)"
          >
            {{ point.title }}
          </span>
        </div>
      </div>
    </template>
    <div>
      <div
        v-for="point in points.filter((p) => p.type === 'loading')"
        :key="point.idx"
        class="title-row-text"
      >
        {{ point.title }}
      </div>
      <div
        v-for="point in points.filter((p) => p.type === 'unloading')"
        :key="point.idx"
        class="title-row-text"
      >
        {{ point.title }}
      </div>
    </div>
  </v-tooltip>
</template>

<script>
import dayjs from 'dayjs'

import { roundingHours } from './helpers'
export default {
  name: 'OrderCell',
  props: {
    orderId: {
      type: String,
      required: true,
    },
  },
  computed: {
    breakingSchedule() {
      if (this.order.route[0].arrivalDate) return false
      let roundedPlannedDate = dayjs(this.order?.route[0]?.plannedDate)
      roundedPlannedDate = roundedPlannedDate.hour(
        roundingHours(roundedPlannedDate.hour())
      )
      let roundedStartPositionDate = dayjs(this.order.startPositionDate)
      roundedStartPositionDate = roundedStartPositionDate.hour(
        roundingHours(roundedStartPositionDate.hour())
      )
      return !roundedPlannedDate.isSame(roundedStartPositionDate, 'hour')
    },
    orderClasses() {
      let classes = ['order-wrapper']
      if (this.order.state.driverNotified) classes.push('driver-notified')
      if (this.order.state.status === 'needGet') classes.push('need-get')
      if (this.order.state.status === 'notСonfirmedByClient')
        classes.push('not-confirmed-by-client')
      if (this.order.state.status === 'weRefused') classes.push('we-refused')
      if (this.order.state.clientNotified) classes.push('client-notified')
      if (this.order.state.warning) classes.push('warning-state')
      classes.push(this.order.state.status)
      if (this.breakingSchedule) classes.push('breaking-schedule')
      return classes
    },

    order() {
      return this.$store.getters.ordersMap.get(this.orderId)
    },

    firstRow() {
      const addressId = this.order.route[0].address
      const hours = dayjs(this.order.route[0].plannedDate).format('HH')
      const addressName =
        this.$store.getters.addressMap.get(addressId)?.shortName || ' - '
      return `${addressName} - ${hours}`
    },
    waitAtPoint() {
      return this.order.route.findIndex(
        (p) => !!p.arrivalDate && !p.departureDate
      )
    },
    nextPointIndex() {
      if (this.order.state.status !== 'inProgress') return null
      //if (this.waitAtPoint !== -1) return null
      return this.order.route.findIndex((p) => !p.departureDate)
    },
    points() {
      let res = []
      for (let i = 0; i < this.order.route.length; i++) {
        res.push(this.createPoint(i))
      }
      return res
    },
    delayToPointInd() {
      if (
        [
          'notСonfirmedByClient',
          'weRefused',
          'clientRefused',
          'needGet',
        ].includes(this.order.state.status)
      )
        return -1
      const idx = this.order.route.findIndex(
        (p) => new Date(p.plannedDate) < new Date() && !p.arrivalDate
      )
      return idx
    },
  },
  methods: {
    getPointStyles(point) {
      return {
        'next-point': point.isNextPoint,
        'wait-at-point': point.isWait,
        delay: point.isDelayed,
        'completed-point': point.isCompleted,
      }
    },
    createPoint(idx) {
      return {
        idx: idx,
        type: this.order.route[idx].type,
        title: this.getPointTitle(idx),
        isNextPoint: this.nextPointIndex === idx,
        isWait: this.waitAtPoint === idx,
        isDelayed: this.delayToPointInd === idx,
        isCompleted: !!this.order.route[idx].departureDate,
      }
    },
    dblclickHandler() {
      this.$router.push('/orders/' + this.orderId)
    },
    getPointTitle(idx) {
      if (idx === null || undefined) return null
      let res = []
      const address = this.$store.getters.addressMap.get(
        this.order.route[idx].address
      )?.shortName
      res.push(address)
      let plannedTime = null
      if (this.order.route[idx]?.plannedDate) {
        plannedTime = dayjs(this.order.route[idx].plannedDate).format('HH')
        res.push(plannedTime)
      }
      return res.join(' ')
    },
  },
}
</script>
<style scoped>
.order-wrapper {
  height: 100%;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px dotted rgb(80, 80, 80);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.row-text {
  padding-left: 3px;
  font-size: 11px;
  line-height: 11px;
  letter-spacing: -0.023em;
  white-space: nowrap;
  font-weight: 300;
  overflow: hidden;
  user-select: none;
}
.next-point {
  font-weight: 500;
}
.completed-point {
  font-weight: 300;
  color: rgb(65, 64, 64);
}
.wait-at-point {
  text-decoration: underline;
}
.delay {
  color: red;
}
.need-get {
  border: 1px solid red;
}
.getted {
  border: 1px solid black;
}
.breaking-schedule {
  border-bottom: red 2px solid;
}
.driver-notified {
  color: rgb(27, 27, 252);
}

.client-notified {
  background-color: rgba(200, 239, 252, 0.9);
}
.inProgress {
  background-color: rgba(217, 255, 217, 0.9);
}
.title-row-text {
  font-size: 13px;
}
.warning-state {
  box-shadow: 0px 0px 3px 1px #f97509 inset;
}

.completed {
  background-color: rgba(189, 223, 189, 0.9);
}
.tooltip-wrapper {
  position: relative;
}
.not-confirmed-by-client,
.clientRefused {
  background-color: rgba(255, 28, 28, 0.7);
  color: black;
}
.we-refused {
  background-color: rgb(0, 0, 0);
  color: rgb(252, 115, 115);
}
</style>
