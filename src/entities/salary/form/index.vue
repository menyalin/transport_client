<template>
  <div>
    <v-dialog v-model="tmpDialog" max-width="800px" persistent>
      <v-card>
        <v-card-title>
          {{ tmpItem._id ? 'Редактировать тариф' : 'Добавить тариф' }}
        </v-card-title>
        <v-card-text id="fields-wrapper">
          <v-select
            v-model="tmpItem.type"
            label="Тип"
            :items="store.getters.salaryTariffTypes"
            item-title="text"
            item-value="value"
            hide-details
          />

          <v-select
            v-model="tmpItem.tks"
            label="ТК"
            :items="carrierItems"
            multiple
            item-title="name"
            item-value="_id"
            hide-details
          />

          <v-text-field v-model="tmpItem.date" type="date" label="Дата" hide-details readonly />

          <v-select
            v-model="tmpItem.liftCapacity"
            :items="store.getters.liftCapacityTypes"
            item-title="text"
            item-value="value"
            label="Грузоподъемность ТС"
            multiple
            hide-details
          />
          <v-select
            label="Типы грузополучателей"
            :items="store.getters.partnerGroups"
            item-title="text"
            item-value="value"
            multiple
            hide-details
            v-model="tmpItem.consigneeTypes"
          />
          <AppPoints
            v-if="tmpItem.type === 'points'"
            ref="pointsRef"
            v-model="points"
            :style="{ 'min-width': '550px' }"
          />
          <AppZones
            v-if="tmpItem.type === 'zones'"
            ref="zonesRef"
            v-model="zones"
            :style="{ 'min-width': '550px' }"
          />
          <AppAdditionalPoints
            v-if="tmpItem.type === 'additionalPoints'"
            ref="additionalPointsRef"
            v-model="additionalPoints"
            :style="{ 'min-width': '550px' }"
          />
          <AppRegions
            v-if="tmpItem.type === 'regions'"
            ref="regionsRef"
            v-model="regions"
            :style="{ 'min-width': '550px' }"
          />

          <AppWaiting
            v-if="tmpItem.type === 'waiting'"
            ref="waitingRef"
            v-model="waiting"
            :style="{ 'min-width': '550px' }"
          />
          <AppReturn
            v-if="tmpItem.type === 'return'"
            ref="returnRef"
            v-model="returnTariff"
            :style="{ 'min-width': '550px' }"
          />
          <v-text-field v-model.number="tmpItem.sum" type="number" label="Тариф" hide-details />
          <v-text-field v-model.trim="tmpItem.note" label="Примечание" hide-details />
        </v-card-text>
        <v-card-actions>
          <v-btn @click="tmpDialog = false"> Отмена </v-btn>
          <v-btn v-if="tmpItem._id" :disabled="invalidItem" color="primary" @click="update">
            Обновить
          </v-btn>
          <v-btn v-else :disabled="invalidItem" color="primary" @click="pushItem">
            Добавить в список
          </v-btn>
          <v-spacer />
          <v-btn v-if="showDeleteBtn" color="error" @click="deleteItem"> Удалить </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
defineOptions({ name: 'SalaryFormIndex' })
import { ref, reactive, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import AppPoints from './points.vue'
import AppZones from './zones.vue'
import AppRegions from './regions.vue'
import AppAdditionalPoints from './additionalPoints.vue'
import AppWaiting from './waiting.vue'
import AppReturn from './return.vue'
import { SalaryTariffDTO } from './salaryTariff.dto'

const item = defineModel({ type: Object })
const props = defineProps({
  dialog: Boolean,
  carrierItems: {
    type: Array,
    required: true,
  },
})
const emit = defineEmits(['push', 'update', 'deletedItem', 'cancel'])

const store = useStore()

const pointsRef = ref(null)
const zonesRef = ref(null)
const additionalPointsRef = ref(null)
const regionsRef = ref(null)
const waitingRef = ref(null)
const returnRef = ref(null)

const typeRefs = {
  points: pointsRef,
  zones: zonesRef,
  additionalPoints: additionalPointsRef,
  regions: regionsRef,
  waiting: waitingRef,
  return: returnRef,
}

const tmpDialog = ref(false)

const points = reactive({
  loading: '',
  unloading: '',
})
const zones = reactive({
  loadingZone: '',
  unloadingZone: '',
})
const regions = reactive({
  loadingRegion: '',
  unloadingRegion: '',
})
const additionalPoints = reactive({
  includedPoints: 2,
  orderType: '',
  clients: [],
})
const tmpItem = reactive({
  liftCapacity: [],
  consigneeTypes: [],
})
const waiting = reactive({
  includeHours: '',
  roundByHours: '',
  orderType: '',
  tariffBy: '',
  clients: [],
})
const returnTariff = reactive({
  clients: [],
  isPltReturn: false,
  orderType: '',
})

const typeSpecific = {
  points,
  zones,
  regions,
  additionalPoints,
  waiting,
  return: returnTariff,
}

const invalidItem = computed(() => {
  return SalaryTariffDTO.invalidItem({
    ...tmpItem,
    ...(tmpItem.type ? typeSpecific[tmpItem.type] : {}),
    ...(tmpItem.type === 'return' ? returnTariff : {}),
  })
})

const showDeleteBtn = computed(() => {
  return item.value?._id && store.getters.hasPermission('salaryTariff:delete')
})

const formState = computed(() => {
  if (!tmpItem.type) return {}
  return new SalaryTariffDTO({
    ...tmpItem,
    ...(tmpItem.type ? typeSpecific[tmpItem.type] : {}),
    ...(tmpItem.type === 'return' ? returnTariff : {}),
  })
})

watch(
  () => props.dialog,
  (val) => {
    tmpDialog.value = val
  }
)

watch(tmpDialog, (val) => {
  if (!val) cancel()
})

watch(
  item,
  (val) => {
    if (val) {
      const dtoItem = SalaryTariffDTO.tariffFromDBItem(val)
      Object.assign(tmpItem, dtoItem.tmpItem)
      Object.assign(points, dtoItem.points)
      Object.assign(zones, dtoItem.zones)
      Object.assign(regions, dtoItem.regions)
      Object.assign(additionalPoints, dtoItem.additionalPoints)
      Object.assign(waiting, dtoItem.waiting)
      Object.assign(returnTariff, dtoItem.return)
    }
  },
  { deep: true, immediate: true }
)

function keypressEventHandler(e) {
  if (e.altKey && e.key === 'Enter') pushItem()
}

onMounted(() => {
  document.addEventListener('keyup', keypressEventHandler)
})
onBeforeUnmount(() => {
  document.removeEventListener('keyup', keypressEventHandler)
})

function cancel() {
  emit('cancel')
}

function pushItem() {
  if (!invalidItem.value) {
    emit('push', formState.value)
    nextTick(() => {
      typeRefs[tmpItem.type]?.value?.focus()
    })
  }
}

function update() {
  emit('update', formState.value)
  tmpDialog.value = false
}

function deleteItem() {
  const res = confirm('Вы уверены? Запись будет удалена')
  if (!res) return null
  else emit('deletedItem', item.value._id)
}
</script>
<style scoped>
#fields-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
