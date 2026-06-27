<template>
  <v-tooltip location="bottom" open-delay="700" close-delay="50" transition="fade-transition">
    <template #activator="{ props: tooltipProps }">
      <div v-bind="tooltipProps" :class="orderClasses" @dblclick.stop="dblclickHandler">
        <div class="row-text">
          <span v-for="point of loadingPoints" :key="point.idx" :class="getPointStyles(point)">
            {{ point.title }}
          </span>
        </div>
        <div class="row-text">
          <span v-for="point of unloadingPoints" :key="point.idx" :class="getPointStyles(point)">
            {{ point.title }}
          </span>
        </div>
      </div>
    </template>
    <div>
      <div v-for="point in loadingPoints" :key="point.idx" class="title-row-text">
        {{ point.title }}
      </div>
      <div v-for="point in unloadingPoints" :key="point.idx" class="title-row-text">
        {{ point.title }}
      </div>
    </div>
  </v-tooltip>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import dayjs from 'dayjs'
import { useAddressStore } from '@/entities/address'
import { roundingHours } from './helpers'

defineOptions({ name: 'OrderCell' })

const props = defineProps({
  orderId: {
    type: String,
    required: true,
  },
})

const store = useStore()
const router = useRouter()
const addressStore = useAddressStore()

const order = computed(() => {
  return store.getters.ordersMap.get(props.orderId)
})

const breakingSchedule = computed(() => {
  if (order.value.route[0].arrivalDate) return false
  let roundedPlannedDate = dayjs(order.value?.route[0]?.plannedDate)
  roundedPlannedDate = roundedPlannedDate.hour(roundingHours(roundedPlannedDate.hour()))
  let roundedStartPositionDate = dayjs(order.value.startPositionDate)
  roundedStartPositionDate = roundedStartPositionDate.hour(
    roundingHours(roundedStartPositionDate.hour())
  )
  return !roundedPlannedDate.isSame(roundedStartPositionDate, 'hour')
})

const orderClasses = computed(() => {
  let classes = ['order-wrapper']
  if (order.value.state.driverNotified) classes.push('driver-notified')
  if (order.value.state.status === 'needGet') classes.push('need-get')
  if (order.value.state.status === 'notСonfirmedByClient') classes.push('not-confirmed-by-client')
  if (order.value.state.status === 'weRefused') classes.push('we-refused')
  if (order.value.state.clientNotified) classes.push('client-notified')
  if (order.value.state.warning) classes.push('warning-state')
  classes.push(order.value.state.status)
  if (breakingSchedule.value) classes.push('breaking-schedule')
  return classes
})

const waitAtPoint = computed(() => {
  return order.value.route.findIndex((p) => !!p.arrivalDate && !p.departureDate)
})

const nextPointIndex = computed(() => {
  if (order.value.state.status !== 'inProgress') return null
  return order.value.route.findIndex((p) => !p.departureDate)
})

const delayToPointInd = computed(() => {
  if (
    ['notСonfirmedByClient', 'weRefused', 'clientRefused', 'needGet'].includes(
      order.value.state.status
    )
  )
    return -1
  const idx = order.value.route.findIndex(
    (p) => !!p.plannedDate && new Date(p.plannedDate) < new Date() && !p.arrivalDate
  )
  return idx
})

function getPointTitle(idx) {
  if (idx === null || undefined) return null
  let res = []
  const address = addressStore.addressMap.get(order.value.route[idx].address)?.shortName
  res.push(address)
  let plannedTime = null
  if (order.value.route[idx]?.plannedDate) {
    plannedTime = dayjs(order.value.route[idx].plannedDate).format('HH')
    res.push(plannedTime)
  }
  return res.join(' ')
}

function createPoint(idx) {
  return {
    idx: idx,
    type: order.value.route[idx].type,
    title: getPointTitle(idx),
    isNextPoint: nextPointIndex.value === idx,
    isWait: waitAtPoint.value === idx,
    isDelayed: delayToPointInd.value === idx,
    isCompleted: !!order.value.route[idx].departureDate,
  }
}

const points = computed(() => {
  let res = []
  for (let i = 0; i < order.value.route.length; i++) {
    res.push(createPoint(i))
  }
  return res
})

const loadingPoints = computed(() => {
  return points.value.filter((p) => p.type === 'loading')
})

const unloadingPoints = computed(() => {
  return points.value.filter((p) => p.type === 'unloading')
})

function getPointStyles(point) {
  return {
    'next-point': point.isNextPoint,
    'wait-at-point': point.isWait,
    delay: point.isDelayed,
    'completed-point': point.isCompleted,
  }
}

function dblclickHandler() {
  router.push('/orders/' + props.orderId)
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
  text-overflow: ellipsis;
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
