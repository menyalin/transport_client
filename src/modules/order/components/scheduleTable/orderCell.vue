<template>
  <v-tooltip
    bottom
    open-delay="650"
    close-delay="50"
  >
    <template v-slot:activator="{ on, attrs }">
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
import moment from 'moment'
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
      const roundedPlannedDate = moment(this.order?.route[0]?.plannedDate)
      roundedPlannedDate.hours(roundingHours(roundedPlannedDate.hours()))
      const roundedStartPositionDate = moment(this.order.startPositionDate)
      roundedStartPositionDate.hours(
        roundingHours(roundedStartPositionDate.hours())
      )
      return !roundedPlannedDate.isSame(roundedStartPositionDate, 'hour')
    },
    orderClasses() {
      let classes = ['order-wrapper']
      if (this.order.state.driverNotified) classes.push('driver-notified')
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
      const hours = moment(this.order.route[0].plannedDate).format('HH')
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
      if (!!this.order.route[idx]?.plannedDate) {
        plannedTime = moment(this.order.route[idx].plannedDate).format('HH')
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
  background-color: white;
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
  font-weight: 200;
  color: gray;
}
.wait-at-point {
  text-decoration: underline;
}
.delay {
  color: red;
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
  background-color: rgb(200, 239, 252);
}
.inProgress {
  background-color: rgb(217, 255, 217);
}
.title-row-text {
  font-size: 16px;
}
.warning-state {
  box-shadow: 0px 0px 3px 1px #f97509;
}

.completed {
  background-color: rgb(189, 223, 189);
}
</style>
