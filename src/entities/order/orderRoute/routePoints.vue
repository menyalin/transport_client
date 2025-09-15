<template>
  <div class="route-wrapper" :class="{ invalid: !isValid }">
    <BlockTitle>{{ title }}</BlockTitle>

    <div v-for="(point, ind) of points" :key="ind" class="point-wrapper-outer">
      <app-point-detail
        :point="point"
        :ind="ind"
        :readonly="readonly"
        :confirmed="confirmed"
        :fixedTimeSlots="fixedTimeSlots"
        :isActive="point.isCurrent"
        :showReturnBtn="showReturnBtn"
        :showMainLoadingPointSelector="showMainLoadingPointSelector"
        :showDeleteBtn="points.length > 2"
        :isTemplate="isTemplate"
        @update:model-value-point="change($event, ind)"
        @delete="deleteHandler"
      />
    </div>

    <div v-if="!readonly" class="row py-3">
      <v-btn
        variant="text outlined"
        color="primary"
        size="small"
        class="ma-2"
        @click="addPoint"
      >
        Добавить адрес
      </v-btn>
      <v-btn
        v-if="!isTemplate && state.status === 'inProgress'"
        variant="text outlined"
        size="small"
        color="red"
        class="ma-2"
        @click="addReturn"
      >
        Добавить возврат
      </v-btn>
      <v-btn
        v-if="!isTemplate"
        variant="outlined text"
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
<script>
import store from '@/store'
import { computed } from 'vue'
import AppPointDetail from './pointDetail'
import { BlockTitle } from '@/entities/order'
import putRouteForDriverToClipboard from './model/putRouteForDriverToClipboard'

export default {
  name: 'RoutePoints',
  components: {
    AppPointDetail,
    BlockTitle,
  },
  model: {
    prop: 'points',
    event: 'changePoints',
  },

  props: {
    driverId: String,
    points: Array,
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
  },
  setup(props, ctx) {
    //#region computed
    const activePointInd = computed(() => {
      return props.points.findIndex((p) => !p.departureDate)
    })
    const readonly = computed(() => {
      if (props.isTemplate) return false
      return props.state.status === 'completed'
    })

    const showMainLoadingPointSelector = computed(() => {
      return (
        props.points.filter(
          (p) => p.type === 'loading' && (p.plannedDate || p.plannedDateDoc)
        ).length > 1
      )
    })

    const hasMainLoadingPoint = computed(() => {
      return props.points.some(
        (i) => i.isMainLoadingPoint && i.type === 'loading'
      )
    })

    const showReturnBtn = computed(() => {
      if (props.isTemplate || props.points.length <= 2) return false
      return store.getters.hasPermission('order:showReturnCheckbox')
    })
    //#endregion

    function setDefaultMainLoadingPoint() {
      const tmpPoints = [...props.points]
      tmpPoints[0].isMainLoadingPoint = true
      ctx.emit('changePoints', tmpPoints)
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
        tmpPoints = clearedMainLoadingPointRoute([...props.points])
      else tmpPoints = [...props.points]

      tmpPoints.splice(ind, 1, val)

      if (!hasMainLoadingPoint.value) setDefaultMainLoadingPoint()

      ctx.emit('changePoints', tmpPoints)
    }

    async function getDriverRouteHandler() {
      await putRouteForDriverToClipboard(
        props.driverId,
        props.points,
        props.cargoParams,
        props.agreement
      )
    }

    function addPoint() {
      ctx.emit('changePoints', [...props.points, { type: 'unloading' }])
    }

    function addReturn() {
      ctx.emit('changePoints', [
        ...props.points,
        { type: 'unloading', isReturn: true },
      ])
    }

    function deleteHandler(ind) {
      ctx.emit('changePoints', [
        ...props.points.slice(0, ind),
        ...props.points.slice(ind + 1),
      ])
    }

    return {
      activePointInd,
      readonly,
      showMainLoadingPointSelector,
      hasMainLoadingPoint,
      showReturnBtn,
      change,
      getDriverRouteHandler,
      addPoint,
      addReturn,
      deleteHandler,
    }
  },
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
