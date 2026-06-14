<template>
  <div class="route-wrapper" :class="{ invalid: !isValid }">
    <BlockTitle>{{ title }}</BlockTitle>

    <div v-for="(point, ind) of model" :key="ind" class="point-wrapper-outer">
      <app-point-detail
        :point="point"
        :ind="ind"
        :readonly="readonly"
        :confirmed="confirmed"
        :fixedTimeSlots="fixedTimeSlots"
        :isActive="point.isCurrent"
        :showReturnBtn="showReturnBtn"
        :showMainLoadingPointSelector="showMainLoadingPointSelector"
        :showDeleteBtn="model.length > 2"
        :isTemplate="isTemplate"
        @changePoint="change($event, ind)"
        @delete="deleteHandler"
      />
    </div>

    <div v-if="!readonly" class="row py-3">
      <v-btn color="primary" size="small" class="ma-2" @click="addPoint"> Добавить адрес </v-btn>
      <v-btn
        v-if="!isTemplate && state.status === 'inProgress'"
        size="small"
        color="red"
        class="ma-2"
        @click="addReturn"
      >
        Добавить возврат
      </v-btn>
      <v-btn
        v-if="!isTemplate"
        size="small"
        color="primary"
        class="ma-2"
        @click="getDriverRouteHandler"
      >
        Маршрут для водителя
      </v-btn>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import AppPointDetail from './pointDetail'
import { BlockTitle } from '@/entities/order'
import putRouteForDriverToClipboard from './model/putRouteForDriverToClipboard'
import { useStore } from 'vuex'
const vuexStore = useStore()

defineOptions({ name: 'RoutePoints' })
const model = defineModel()

const props = defineProps({
  driverId: String,
  title: String,
  cargoParams: Object,
  agreement: Object,
  confirmed: Boolean,
  isValid: Boolean,
  state: Object,
  fixedTimeSlots: { type: Boolean, default: false },
  isTemplate: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(['update:model-value'])

//#region computed
// const activePointInd = computed(() => {
//   return model.value.findIndex((p) => !p.departureDate)
// })
const readonly = computed(() => {
  if (props.isTemplate) return false
  return props.state.status === 'completed'
})

const showMainLoadingPointSelector = computed(() => {
  return (
    model.value.filter((p) => p.type === 'loading' && (p.plannedDate || p.plannedDateDoc)).length >
    1
  )
})

const hasMainLoadingPoint = computed(() => {
  return model.value.some((i) => i.isMainLoadingPoint && i.type === 'loading')
})

const showReturnBtn = computed(() => {
  if (props.isTemplate || model.value.length <= 2) return false
  return vuexStore.getters.hasPermission('order:showReturnCheckbox')
})
//#endregion

function setDefaultMainLoadingPoint() {
  const tmpPoints = [...model.value]
  tmpPoints[0].isMainLoadingPoint = true
  emits('update:model-value', tmpPoints)
}

function clearedMainLoadingPointRoute(route) {
  return route.map((p) => ({
    ...p,
    isMainLoadingPoint: false,
  }))
}

function change(val, ind) {
  let tmpPoints
  if (hasMainLoadingPoint.value && val.isMainLoadingPoint)
    tmpPoints = clearedMainLoadingPointRoute([...model.value])
  else tmpPoints = [...model.value]

  tmpPoints.splice(ind, 1, val)

  if (!hasMainLoadingPoint.value) setDefaultMainLoadingPoint()

  emits('update:model-value', tmpPoints)
}

async function getDriverRouteHandler() {
  await putRouteForDriverToClipboard(
    props.driverId,
    model.value,
    props.cargoParams,
    props.agreement
  )
}

function addPoint() {
  emits('update:model-value', [...model.value, { type: 'unloading' }])
}

function addReturn() {
  emits('update:model-value', [...model.value, { type: 'unloading', isReturn: true }])
}

function deleteHandler(ind) {
  emits('update:model-value', [...model.value.slice(0, ind), ...model.value.slice(ind + 1)])
}
</script>
<style scoped>
.route-wrapper {
  padding: 15px;
  border-radius: 5px;
}
.invalid {
  border: tomato 2px solid;
  border-radius: 5px;
}
.point-wrapper-outer {
  border: 2px dotted gray;
  border-radius: 5px;
  margin: 2px;
}
.route-move {
  transition: transform 0.5s;
}
</style>
