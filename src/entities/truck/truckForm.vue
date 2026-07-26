<template>
  <div>
    <ButtonsPanel
      :disabledSubmit="
        !store.getters.hasPermission('truck:write') || isInvalidForm || props.loading
      "
      panel-type="form"
      @cancel="cancel"
      @submit="submit"
    />
    <div id="form">
      <div class="fields-row">
        <v-autocomplete
          v-model="form.tkName"
          :items="carrierItems"
          item-title="name"
          item-value="_id"
          label="ТК"
          class="field-autocomplete"
        />
        <v-select
          v-model="form.type"
          label="Тип ТС"
          :items="truckTypes"
          :error-messages="typeErrors"
          class="field-select"
        />
        <v-select
          v-model="form.liftCapacityType"
          label="Грузоподъемность, тн"
          :items="liftCapacityTypes"
          class="field-select"
        />
        <template v-if="form.type === 'trailer' || form.liftCapacityType !== 20">
          <v-select v-model="form.kind" label="Вид ТС" :items="truckKinds" class="field-select" />
          <v-text-field
            v-model.number="form.pltCount"
            label="Макс.кол-во плт"
            type="number"
            class="field-xs"
          />
        </template>
        <DateTimeInput
          v-model="form.startServiceDate"
          label="Дата ввода в эксплуатацию"
          hide-details
          class="field-date"
        />
        <DateTimeInput
          v-model="form.endServiceDate"
          label="Дата вывода из эксплуатации"
          hide-details
          class="field-date"
        />
      </div>

      <div class="fields-row">
        <v-text-field
          v-model.trim="form.regNum"
          label="Гос.номер"
          :error-messages="regNumErrors"
          class="field-md"
        />
        <v-text-field v-model.trim="form.brand" label="Марка" class="field-lg" />
        <v-text-field v-model.trim="form.model" label="Модель" class="field-lg" />
        <v-text-field v-model.trim="form.issueYear" label="Год выпуска" class="field-xs" />
        <v-text-field
          v-model.number="form.order"
          label="Индекс в списке"
          type="number"
          class="field-xs"
        />
        <v-text-field
          v-model.number="form.volumeFuel"
          label="Объем топливного бака"
          type="number"
          class="field-sm"
        />
        <v-text-field
          v-model.number="form.volumeRef"
          label="Объем бака рефа"
          type="number"
          class="field-sm"
        />
      </div>

      <div class="fields-row">
        <v-text-field v-model.trim="form.win" label="WIN" class="field-md" />
        <v-text-field v-model.trim="form.owner" label="Собственник" class="field-lg" />
        <v-text-field v-model.trim="form.sts" label="СТС" class="field-md" />
        <DateTimeInput v-model="form.stsDate" label="Дата СТС" hide-details class="field-date" />
        <v-text-field v-model.trim="form.pts" label="ПТС" class="field-md" />
      </div>

      <AppInsurance v-model="form.insurance" title="Страховка" :truckType="form.type" />

      <AppPermits v-if="form.type === 'truck'" v-model="form.permits" title="Разрешения" />

      <AppAdditionalDetails
        v-if="form.type === 'truck'"
        v-model="form.additionalDetails"
        title="Доп.реквизиты"
      />

      <div v-if="form.type === 'trailer' || form.liftCapacityType !== 20" class="fields-row">
        <DateTimeInput
          v-model="form.sanitaryPassportExpDate"
          label="Сан.паспорт действует до"
          hide-details
          class="field-date"
        />
        <v-text-field
          v-model.trim="form.sanitaryPassportNote"
          label="Комментарий к сан.паспорту"
          class="field-lg"
        />
      </div>

      <div class="fields-row">
        <DateTimeInput
          v-model="form.additionalDetails.diagnosticCardExpDate"
          label="ДК действительна до"
          hide-details
          class="field-date"
        />
        <v-text-field
          v-model.trim="form.additionalDetails.diagnosticCardNote"
          label="Комментарий к диагностической карте"
          class="field-lg"
        />
      </div>

      <div class="fields-row">
        <v-autocomplete
          v-model="form.brigadier"
          label="Бригадир"
          :items="brigadiers"
          class="field-autocomplete"
        />
        <v-autocomplete
          v-model="form.mechanic"
          label="Механик"
          :items="mechanics"
          class="field-autocomplete"
        />
      </div>

      <AdditionalNotifications v-model="form.additionalNotifications" />

      <div class="fields-row">
        <v-textarea v-model.trim="form.note" rows="3" label="Примечание" class="field-fluid" />
      </div>

      <div v-if="!!form.tkName && form.type === 'truck'">
        <AppAllowedDrivers
          v-model="form.allowedDrivers"
          :tkName="typeof form.tkName === 'object' ? form.tkName._id : form.tkName"
        />
      </div>

      <div class="fields-row">
        <v-checkbox v-model="form.alwaysInSchedule" label="Всегда в распределении" />
        <v-checkbox v-model="form.hideInFines" label="Не показывать в штрафах" />
        <v-checkbox v-model="form.hasScans" label="Есть сканы документов" />
      </div>
      <v-divider />
    </div>
    <EntityFiles v-if="truck?._id" :itemId="truck._id" docType="truck" />

    <div class="delete-btn-row mt-3">
      <v-btn
        v-if="displayDeleteBtn"
        color="error"
        prepend-icon="mdi-delete"
        @click="emit('delete')"
      >
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
import { ButtonsPanel, DateTimeInput, AdditionalNotifications, EntityFiles } from '@/shared/ui'

import AppAllowedDrivers from './allowedDrivers.vue'
import AppInsurance from './insurance.vue'
import AppPermits from './permits.vue'
import AppAdditionalDetails from './additionalDetails.vue'

const props = defineProps({
  displayDeleteBtn: {
    type: Boolean,
    default: false,
  },
  carrierItems: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const truck = defineModel({ type: Object })

const emit = defineEmits(['submit', 'cancel', 'delete'])

const store = useStore()

const defaultTruck = {
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
  allowedDrivers: [],
  order: 50,
  alwaysInSchedule: false,
  hideInFines: false,
  hasScans: false,
  insurance: {},
  permits: {},
  additionalDetails: {},
  additionalNotifications: [],
}

const form = ref({ ...defaultTruck })

watch(
  truck,
  (val) => {
    if (!val) return
    const keys = Object.keys(defaultTruck)
    keys.forEach((key) => {
      form.value[key] = val[key] ?? defaultTruck[key]
    })
  },
  { immediate: true }
)

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

const regNumErrors = computed(() => {
  const errors = []
  if (v.value.form.regNum.$dirty && v.value.form.regNum.$invalid && !props.loading)
    errors.push('Гос. номер должен быть заполнен')
  return errors
})

const typeErrors = computed(() => {
  const errors = []
  if (v.value.form.type.$dirty && v.value.form.type.$invalid && !props.loading)
    errors.push('Тип должен быть заполнен')
  return errors
})

const submit = () => {
  emit('submit', { ...form.value, company: directoriesProfile.value })
}

const cancel = () => {
  emit('cancel')
}
</script>

<style scoped>
#form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 1400px;
}

.fields-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 15px;
}

.field-xs {
  flex: 0 0 120px;
  min-width: 120px;
  max-width: 120px;
}

.field-sm {
  flex: 0 0 160px;
  min-width: 160px;
  max-width: 160px;
}

.field-md {
  flex: 1 1 220px;
  min-width: 220px;
  max-width: 320px;
}

.field-lg {
  flex: 1 1 320px;
  min-width: 320px;
  max-width: 450px;
}

.field-autocomplete {
  flex: 1 1 320px;
  min-width: 320px;
  max-width: 450px;
}

.field-select {
  flex: 1 1 260px;
  min-width: 260px;
  max-width: 320px;
}

.field-date {
  flex: 0 0 220px;
  min-width: 220px;
  max-width: 220px;
}

.field-fluid {
  flex: 1 1 100%;
  min-width: 100%;
  max-width: none;
}

.delete-btn-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
</style>
