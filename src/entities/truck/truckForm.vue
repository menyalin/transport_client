<template>
  <div>
    <buttons-panel
      :disabledSubmit="!store.getters.hasPermission('truck:write') || isInvalidForm || loading"
      panel-type="form"
      @cancel="cancel"
      @submit="submit"
    />
    <div>
      <div class="row-wrapper first-row">
        <div class="base-info">
          <v-autocomplete
            v-model.trim="form.tkName"
            :items="carrierItems"
            item-title="name"
            item-value="_id"
            label="ТК"
            auto-select-first
          />
          <v-select
            v-model="form.type"
            label="Тип ТС"
            :items="truckTypes"
            :error-messages="typeErrors"
          />
          <v-select
            v-model="form.liftCapacityType"
            label="Грузоподъемность, тн"
            :items="liftCapacityTypes"
          />
          <template v-if="form.type === 'trailer' || form.liftCapacityType !== 20">
            <v-select v-model="form.kind" label="Вид ТС" :items="truckKinds" />

            <v-text-field v-model.number="form.pltCount" label="Макс.кол-во плт" type="number" />
          </template>
        </div>
        <div class="servive-dates">
          <DateTimeInput
            v-model="form.startServiceDate"
            label="Дата ввода в эксплуатацию"
            hide-details
          />

          <DateTimeInput
            v-model="form.endServiceDate"
            label="Дата вывода из эксплуатации"
            hide-details
          />
        </div>
      </div>
      <div class="row-wrapper second-row">
        <v-text-field v-model.trim="form.regNum" label="Гос.номер" :error-messages="regNumErrors" />
        <v-text-field v-model.trim="form.brand" label="Марка" />

        <v-text-field v-model.trim="form.model" label="Модель" />

        <v-text-field v-model.trim="form.issueYear" label="Год выпуска" />

        <v-text-field v-model.number="form.order" label="Индекс в списке" type="number" />
        <v-text-field
          v-model.number="form.volumeFuel"
          label="Объем топливного бака"
          type="number"
        />
        <v-text-field v-model.number="form.volumeRef" label="Объем бака рефа" type="number" />
      </div>
      <div class="row-wrapper third-row">
        <v-text-field v-model.trim="form.win" label="WIN" />
        <v-text-field v-model.trim="form.owner" label="Собственник" />

        <v-text-field v-model.trim="form.sts" label="СТС" />
        <DateTimeInput v-model="form.stsDate" label="Дата СТС" hide-details />
        <v-text-field v-model.trim="form.pts" label="ПТС" />
      </div>
      <app-insurance v-model="insurance" title="Страховка" :truckType="form.type" />

      <app-permits v-if="form.type === 'truck'" v-model="permits" title="Разрешения" />
      <app-additional-details
        v-if="form.type === 'truck'"
        v-model="additionalDetails"
        title="Доп.реквизиты"
      />
      <div v-if="form.type === 'trailer' || form.liftCapacityType !== 20" id="sanpassport">
        <DateTimeInput
          v-model="form.sanitaryPassportExpDate"
          label="Сан.паспорт действует до"
          hide-details
        />
        <v-text-field v-model.trim="form.sanitaryPassportNote" label="Комментарий к сан.паспорту" />
      </div>

      <div id="diagnostic-card">
        <DateTimeInput
          v-model="additionalDetails.diagnosticCardExpDate"
          label="ДК действительна до"
          hide-details
        />
        <v-text-field
          v-model.trim="additionalDetails.diagnosticCardNote"
          label="Комментарий к диагностической карте"
        />
      </div>
      <div id="leaders">
        <v-autocomplete v-model="form.brigadier" label="Бригадир" :items="brigadiers" />
        <v-autocomplete v-model="form.mechanic" label="Механик" :items="mechanics" />
      </div>
      <additional-notifications v-model="additionalNotifications" />
      <div class="row-wrapper my-3">
        <v-textarea v-model.trim="form.note" rows="3" label="Примечание" />
      </div>

      <v-row v-if="!!form.tkName && form.type === 'truck'">
        <app-allowed-drivers
          v-model="form.allowedDrivers"
          :tkName="typeof form.tkName === 'object' ? form.tkName._id : form.tkName"
        />
      </v-row>
      <div class="row-wrapper my-3">
        <v-checkbox v-model="form.alwaysInSchedule" label="Всегда в распределении" />
        <v-checkbox v-model="form.hideInFines" label="Не показывать в штрафах" />
        <v-checkbox v-model="form.hasScans" label="Есть сканы документов" />
      </div>
      <v-divider />
    </div>
    <EntityFiles v-if="truck && truck._id" :itemId="truck._id" docType="truck" />

    <div class="delete-btn-row mt-3">
      <v-btn v-if="displayDeleteBtn" color="error" @click="$emit('delete')">
        <v-icon start> mdi-delete </v-icon>
        Удалить
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric } from '@vuelidate/validators'
import { ButtonsPanel, DateTimeInput, EntityFiles } from '@/shared/ui'

import AppAllowedDrivers from './allowedDrivers.vue'
import AppInsurance from './insurance.vue'
import AppPermits from './permits.vue'
import AppAdditionalDetails from './additionalDetails.vue'

const props = defineProps({
  truck: {
    type: Object,
  },
  displayDeleteBtn: {
    type: Boolean,
    default: false,
  },
  carrierItems: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['submit', 'cancel', 'delete'])

const store = useStore()

const loading = ref(false)
const insurance = ref({})
const additionalDetails = ref({})
const additionalNotifications = ref([])
const permits = ref({})
const form = ref({
  brigadier: null,
  mechanic: null,
  sanitaryPassportExpDate: null,
  sanitaryPassportNote: null,
  brand: null,
  model: null,
  issueYear: null,
  startServiceDate: null,
  endServiceDate: null,
  tkName: null,
  type: 'truck',
  kind: null,
  liftCapacityType: null,
  regNum: null,
  win: null,
  sts: null,
  stsDate: null,
  pts: null,
  owner: null,
  volumeFuel: null,
  volumeRef: null,
  liftCapacity: null,
  pltCount: null,
  note: null,
  allowedDrivers: null,
  order: 50,
  alwaysInSchedule: false,
  hideInFines: false,
  hasScans: false,
})

const rules = {
  form: {
    brand: {},
    model: {},
    issueYear: {},
    startServiceDate: {},
    endServiceDate: {},
    tkName: { required },
    type: { required },
    kind: {},
    liftCapacity: { numeric },
    liftCapacityType: { required },
    regNum: { required },
    win: {},
    sts: {},
    stsDate: {},
    pts: {},
    owner: {},
    volumeFuel: { numeric },
    volumeRef: { numeric },
    pltCount: { numeric },
    note: {},
    allowedDrivers: {},
    order: { numeric },
    alwaysInSchedule: {},
    hasScans: {},
  },
}

const v = useVuelidate(rules, form)

// const myCompanies = computed(() => store.getters.myCompanies)
const directoriesProfile = computed(() => store.getters.directoriesProfile)
const truckTypes = computed(() => store.getters.truckTypes)
const truckKinds = computed(() => store.getters.truckKinds)
const liftCapacityTypes = computed(() => store.getters.liftCapacityTypes)
const brigadiers = computed(() => store.getters.brigadiersForSelect)
const mechanics = computed(() => store.getters.mechanicsForSelect)

const isInvalidForm = computed(() => {
  if (!directoriesProfile.value) return true
  return v.value.$invalid
})

// const directoriesProfileName = computed(() => {
//   if (!directoriesProfile.value) return null
//   return myCompanies.value.find((item) => item._id === directoriesProfile.value)?.name
// })

const regNumErrors = computed(() => {
  const errors = []
  if (v.value.form.regNum.$dirty && v.value.form.regNum.$invalid && !loading.value)
    errors.push('Гос.номер должен быть заполнен')
  return errors
})

const typeErrors = computed(() => {
  const errors = []
  if (v.value.form.type.$dirty && v.value.form.type.$invalid && !loading.value)
    errors.push('Тип должен быть заполнен')
  return errors
})

const submit = () => {
  const truck = {
    ...form.value,
    company: directoriesProfile.value,
    insurance: insurance.value,
    permits: permits.value,
    additionalDetails: additionalDetails.value,
    additionalNotifications: additionalNotifications.value,
  }
  emit('submit', truck)
  resetForm()
}

const cancel = () => {
  resetForm()
  emit('cancel')
}

const setFormFields = (val) => {
  const keys = Object.keys(form.value)
  keys.forEach((key) => {
    form.value[key] = val[key]
  })
  if (val.additionalNotifications) additionalNotifications.value = val.additionalNotifications
  if (val.insurance) insurance.value = val.insurance
  if (val.permits) permits.value = val.permits
  if (val.additionalDetails) additionalDetails.value = val.additionalDetails
  if (val.tkName?._id) form.value.tkName = val.tkName._id
}

const resetForm = () => {
  const keys = Object.keys(form.value)
  insurance.value = {}
  permits.value = {}
  additionalNotifications.value = []
  additionalDetails.value = {}
  keys.forEach((key) => {
    form.value[key] = null
  })
}

watch(
  () => props.truck,
  (val) => {
    if (val) setFormFields(val)
  },
  { immediate: true }
)
</script>

<style scoped>
.row-wrapper {
  display: flex;
  flex-direction: row;
  gap: 15px;
}
.first-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.base-info {
  display: grid;
  grid-template-columns: 250px 130px 130px 180px 180px;
  gap: 10px;
}
.servive-dates {
  display: flex;
  flex-direction: row;
}
.servive-dates > * {
  margin-right: 10px;
  width: 230px;
}
.delete-btn-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.second-row {
  display: grid;
  grid-template-columns: 180px 1fr 1fr 150px 150px 170px 170px;
  gap: 10px;
}
.third-row {
  display: grid;
  gap: 10px;
  grid-template-columns: 250px 250px 250px 200px 250px;
}
#sanpassport {
  display: grid;
  gap: 10px;
  grid-template-columns: 200px auto;
}
#leaders {
  display: grid;
  gap: 10px;
  grid-template-columns: 300px 300px;
}
#diagnostic-card {
  display: grid;
  gap: 10px;
  grid-template-columns: 220px 400px;
}
</style>
