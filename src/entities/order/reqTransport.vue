<template>
  <div>
    <div>
      <BlockTitle>{{ title }}</BlockTitle>
    </div>
    <div class="req-transport-block">
      <v-select
        v-if="!hideLiftCapacityField"
        v-model="model.liftCapacity"
        :items="vuexStore.getters.liftCapacityTypes"
        :error-messages="liftCapacityErrors"
        label="Груз-ть"
        itemTitle="text"
        :style="{ minWidth: '100px' }"
      />
      <v-select
        v-if="!hideTruckKindField"
        v-model="model.kind"
        :items="vuexStore.getters.truckKinds"
        :error-messages="truckKindErrors"
        label="Вид ТС"
        itemTitle="text"
        :style="{ minWidth: '100px' }"
      />

      <v-select
        v-if="!hideLoadDirectionField"
        v-model="model.loadDirection"
        :items="vuexStore.getters.loadDirection"
        label="Загрузка"
        itemTitle="text"
        :style="{ minWidth: '100px' }"
      />
      <v-checkbox label="Гидроборт" v-model="model.tailLift" />
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { BlockTitle } from '@/shared/ui'

const vuexStore = useStore()

defineOptions({ name: 'ReqTransport' })
defineProps({ title: String })

const model = defineModel('model-value', {
  type: Object,
  default: () => ({
    kind: null,
    liftCapacity: null,
    loadDirection: null,
    tailLift: false,
  }),
})

// Инициализация дефолтных значений из настроек компании
onMounted(() => {
  const settings = vuexStore.getters.companySettings
  if (settings) {
    if (!model.value.kind && settings.defaultTruckKind) {
      model.value.kind = settings.defaultTruckKind
    }
    if (!model.value.liftCapacity && settings.defaultLiftCapacity) {
      model.value.liftCapacity = settings.defaultLiftCapacity
    }
    if (!model.value.loadDirection && settings.defaultLoadDirection) {
      model.value.loadDirection = settings.defaultLoadDirection
    }
  }
})

const truckKindErrors = computed(() => {
  const errors = []
  if (!model.value?.kind) errors.push('Поле не может быть пустым')
  return errors
})

const liftCapacityErrors = computed(() => {
  const errors = []
  if (!model.value?.liftCapacity) errors.push('Поле не может быть пустым')
  return errors
})

const hideLoadDirectionField = computed(() => {
  const settings = vuexStore.getters.companySettings
  return settings?.loadDirections?.length === 1 && !!settings?.defaultLoadDirection
})

const hideLiftCapacityField = computed(() => {
  const settings = vuexStore.getters.companySettings
  return settings?.liftCapacityTypes?.length === 1 && !!settings?.defaultLiftCapacity
})

const hideTruckKindField = computed(() => {
  const settings = vuexStore.getters.companySettings
  return settings?.truckKinds?.length === 1 && !!settings?.defaultTruckKind
})
</script>
<style scoped>
.req-transport-block {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  max-width: 700px;
  margin: 10px 0 0 10px;
  gap: 15px;
}
.req-transport-block > div {
  flex: 0 0 auto;
}
</style>
