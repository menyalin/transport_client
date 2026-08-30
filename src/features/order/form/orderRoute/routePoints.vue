<template>
  <CardSection :title="title" :valid="isValid">
    <table class="route-table">
      <AppPointDetail
        v-for="(point, ind) of model"
        :key="ind"
        :model-value="model[ind]"
        @update:model-value="onPointUpdate(ind, $event)"
        :ind="ind"
        :readonly="readonly"
        :confirmed="confirmed"
        :fixedTimeSlots="fixedTimeSlots"
        :isActive="point.isCurrent"
        :showReturnBtn="showReturnBtn"
        :showMainLoadingPointSelector="showMainLoadingPointSelector"
        :showDeleteBtn="model.length > 2"
        :isTemplate="isTemplate"
        @changePoint="change(ind)"
        @delete="deleteHandler"
        @need-create-address="$emit('need-create-address', ind)"
        @need-edit-address="(id) => $emit('need-edit-address', id, ind)"
      />
    </table>

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
  </CardSection>
</template>
<script setup>
import { computed, watch } from 'vue'
import AppPointDetail from './pointDetail'
import { CardSection } from '@/shared/ui'
import putRouteForDriverToClipboard from '@/entities/order/form/orderRoute/model/putRouteForDriverToClipboard'
import { useStore } from 'vuex'
const vuexStore = useStore()

defineOptions({ name: 'RoutePoints' })
defineEmits(['need-create-address', 'need-edit-address'])
const model = defineModel({ type: Array, default: () => [] })

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

function change(ind) {
  if (hasMainLoadingPoint.value && model.value[ind]?.isMainLoadingPoint) {
    const cleared = model.value.map((p, i) => (i !== ind ? { ...p, isMainLoadingPoint: false } : p))
    model.value = cleared
  }
}

watch(
  model,
  () => {
    if (model.value.length && !hasMainLoadingPoint.value) {
      const tmp = [...model.value]
      tmp[0].isMainLoadingPoint = true
      model.value = tmp
    }
  },
  { deep: true }
)

async function getDriverRouteHandler() {
  await putRouteForDriverToClipboard(
    props.driverId,
    model.value,
    props.cargoParams,
    props.agreement
  )
}

function addPoint() {
  model.value = [...model.value, { type: 'unloading' }]
}

function addReturn() {
  model.value = [...model.value, { type: 'unloading', isReturn: true }]
}

function deleteHandler(ind) {
  model.value = [...model.value.slice(0, ind), ...model.value.slice(ind + 1)]
}

function onPointUpdate(ind, newVal) {
  const updated = [...model.value]
  updated[ind] = newVal
  model.value = updated
}
</script>
<style scoped>
.route-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}
</style>
