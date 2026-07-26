<template>
  <div>
    <ButtonsPanel
      panel-type="form"
      :disabled-submit="!store.getters.hasPermission('orderTemplate:write') || isInvalidForm"
      @cancel="cancel"
      @submit="submit"
    />
    <div class="body-wrapper">
      <v-text-field v-model.trim="form.name" label="Название шаблона" />
      <div id="client-row">
        <v-autocomplete
          v-model="form.client"
          :items="clientItems"
          item-title="name"
          item-value="_id"
          label="Заказчик"
          hide-details
          :style="{ 'max-width': '350px' }"
        />

        <v-select
          v-model="analytics.type"
          label="Тип рейса"
          :items="store.getters.orderAnalyticTypes"
          item-title="text"
          item-value="value"
          clearable
          hide-details
          :style="{ 'max-width': '180px' }"
        />
      </div>

      <ReqTransport v-model="reqTransport" title="Требования к транспорту" />
      <CargoParams v-model="cargoParams" title="Параметры груза" />
      <v-checkbox
        v-model="form.fixedTimeSlots"
        hide-details
        color="primary"
        label="Маршрут имеет фиксированные временные окна"
      />
      <OrderRoute
        v-model="route"
        title="Маршрут"
        :isValid="isValidRoute"
        :fixedTimeSlots="form.fixedTimeSlots"
        is-template
      />
    </div>

    <v-btn v-if="displayDeleteBtn" color="error" @click="$emit('delete')">
      <v-icon start> mdi-delete </v-icon>
      Удалить
    </v-btn>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { ButtonsPanel } from '@/shared/ui'
import { OrderRoute } from '@/entities/order'
import { ReqTransport, CargoParams } from '@/entities/order'

defineOptions({ name: 'OrderTemplateForm' })

defineProps({
  displayDeleteBtn: {
    type: Boolean,
    default: false,
  },
  openInModal: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit', 'cancel', 'delete'])

const model = defineModel({
  type: Object,
  default: () => ({}),
})

const store = useStore()

const route = ref([{ type: 'loading', isMainLoadingPoint: true }, { type: 'unloading' }])
const cargoParams = ref({})
const reqTransport = ref({})
const analytics = ref({ type: null })
const form = ref({
  name: null,
  client: null,
  fixedTimeSlots: false,
})

const rules = {
  form: {
    name: { required },
    client: { required },
  },
}

const v = useVuelidate(rules, form)

const directoriesProfile = computed(() => store.getters.directoriesProfile)
const clientItems = computed(() => store.getters.partners.filter((partner) => partner.isClient))

const isInvalidForm = computed(() => {
  if (!directoriesProfile.value) return true
  return v.value.$invalid || !isValidRoute.value
})

const isValidRoute = computed(() => {
  if (!route.value || route.value.length === 0) return false
  const length = route.value.length >= 2
  const firstPoint = route.value[0]?.type === 'loading'
  const lastPoint = route.value[route.value.length - 1]?.type === 'unloading'
  const hasAddresses = route.value.every((item) => !!item.address)
  return length && firstPoint && lastPoint && hasAddresses
})

const formState = computed(() => ({
  ...form.value,
  company: directoriesProfile.value,
  reqTransport: reqTransport.value,
  route: route.value,
  cargoParams: cargoParams.value,
  analytics: analytics.value,
}))

function submit() {
  emit('submit', formState.value)
  resetForm()
}

function cancel() {
  resetForm()
  emit('cancel')
}

function setFormFields(val) {
  cargoParams.value = val.cargoParams || {}
  reqTransport.value = val.reqTransport || {}
  route.value = val.route?.length
    ? val.route
    : [{ type: 'loading', isMainLoadingPoint: true }, { type: 'unloading' }]
  analytics.value = val.analytics || { type: null }

  const keys = Object.keys(form.value)
  keys.forEach((key) => {
    form.value[key] = val[key] ?? null
  })
}

function resetForm() {
  reqTransport.value = {}
  cargoParams.value = {}
  route.value = [{ type: 'loading', isMainLoadingPoint: true }, { type: 'unloading' }]
  analytics.value = { type: null }
  form.value = {
    name: null,
    client: null,
    fixedTimeSlots: false,
  }
  v.value.$reset()
}

watch(
  model,
  (val) => {
    setFormFields(val || {})
  },
  { immediate: true, deep: true }
)
</script>

<style scoped>
.body-wrapper {
  margin-bottom: 20px;
  padding: 10px;
  display: grid;
  gap: 15px;
}

.row-input {
  display: flex;
  flex-direction: row;
}
#client-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 15px;
}
</style>
