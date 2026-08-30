<template>
  <div>
    <ButtonsPanel
      :disabledSubmit="!store.getters.hasPermission('truck:write') || v$.$invalid || loading"
      panel-type="form"
      @cancel="cancel"
      @submit="submit"
    />
    <div class="truck-form">
      <div class="fields-row">
        <div class="fields-row">
          <v-autocomplete
            v-model="v$.tkName.$model"
            :items="carrierItems"
            item-title="name"
            item-value="_id"
            label="ТК"
            :style="{ minWidth: '250px' }"
          />
          <v-select
            v-model="form.type"
            label="Тип ТС"
            :items="truckTypes"
            :error-messages="typeErrors"
            :style="{ minWidth: '150px' }"
          />
          <v-select
            v-model="form.liftCapacityType"
            label="Грузоподъемность, тн"
            :items="liftCapacityTypes"
            :style="{ minWidth: '150px' }"
          />
          <template v-if="form.type === 'trailer' || form.liftCapacityType !== 20">
            <v-select
              v-model="form.kind"
              label="Вид ТС"
              :items="truckKinds"
              :style="{ minWidth: '150px' }"
            />
            <v-text-field
              v-model.number="v$.pltCount.$model"
              label="Макс.кол-во плт"
              type="number"
              :style="{ minWidth: '150px' }"
            />
          </template>
        </div>
        <v-spacer />
        <div class="fields-row">
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

      <div class="fields-row">
        <v-text-field
          v-model.trim="v$.regNum.$model"
          label="Гос.номер"
          :error-messages="regNumErrors"
          :style="{ minWidth: '230px', maxWidth: '230px' }"
        />
        <v-text-field v-model.trim="form.brand" label="Марка" class="field-lg" />
        <v-text-field v-model.trim="form.model" label="Модель" class="field-lg" />
        <v-text-field v-model.trim="form.issueYear" label="Год выпуска" class="field-xs" />
        <v-text-field
          v-model.number="v$.order.$model"
          label="Индекс в списке"
          type="number"
          class="field-xs"
        />
        <v-text-field
          v-model.number="v$.volumeFuel.$model"
          label="Объем топл. бака"
          type="number"
          class="field-sm"
        />
        <v-text-field
          v-model.number="v$.volumeRef.$model"
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

      <div v-if="form.tkName != null && form.type === 'truck'">
        <AppAllowedDrivers
          v-model="form.allowedDrivers"
          :tkName="typeof form.tkName === 'object' ? (form.tkName as any)._id : form.tkName"
        />
      </div>

      <div class="fields-row">
        <v-checkbox v-model="form.alwaysInSchedule" label="Всегда в распределении" />
        <v-checkbox v-model="form.hideInFines" label="Не показывать в штрафах" />
        <v-checkbox v-model="form.hasScans" label="Есть сканы документов" />
      </div>

      <v-divider />

      <EntityFiles v-if="truck?._id" :itemId="truck._id" docType="truck" class="mt-3" />

      <v-btn
        v-if="displayDeleteBtn"
        color="error"
        prepend-icon="mdi-delete"
        class="mt-3 delete-btn"
        @click="emit('delete')"
      >
        Удалить
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric } from '@vuelidate/validators'
import { ButtonsPanel, DateTimeInput, AdditionalNotifications, EntityFiles } from '@/shared/ui'

import AppAllowedDrivers from './TruckAllowedDrivers.vue'
import AppInsurance from '@/entities/truck/insurance.vue'
import AppPermits from '@/entities/truck/permits.vue'
import AppAdditionalDetails from './TruckAdditionalDetails.vue'

interface TruckState {
  brigadier: string | null
  mechanic: string | null
  sanitaryPassportExpDate: string | null
  sanitaryPassportNote: string | null
  brand: string | null
  model: string | null
  issueYear: string | null
  startServiceDate: string | null
  endServiceDate: string | null
  tkName: string | null
  type: string
  kind: string | null
  liftCapacityType: number | null
  regNum: string | null
  win: string | null
  sts: string | null
  stsDate: string | null
  pts: string | null
  owner: string | null
  volumeFuel: number | null
  volumeRef: number | null
  liftCapacity: number | null
  pltCount: number | null
  note: string | null
  allowedDrivers: string[]
  order: number
  alwaysInSchedule: boolean
  hideInFines: boolean
  hasScans: boolean
  insurance: Record<string, any>
  permits: Record<string, any>
  additionalDetails: Record<string, any>
  additionalNotifications: any[]
}

defineOptions({ name: 'TruckForm' })

withDefaults(
  defineProps<{
    displayDeleteBtn?: boolean
    carrierItems: any[]
    loading?: boolean
  }>(),
  {
    displayDeleteBtn: false,
    loading: false,
  }
)

const truck = defineModel<Record<string, any> | null>({ default: null })

const emit = defineEmits<{
  submit: [truck: TruckState & { company: string }]
  cancel: []
  delete: []
}>()

const store = useStore()

const defaultTruck: TruckState = {
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

const form = ref<TruckState>({ ...defaultTruck })

watch(
  truck,
  (val) => {
    if (!val) {
      form.value = { ...defaultTruck, insurance: {}, permits: {}, additionalDetails: {} }
    } else {
      form.value = {
        ...defaultTruck,
        ...val,
        insurance: { ...(val.insurance || {}) },
        permits: { ...(val.permits || {}) },
        additionalDetails: { ...(val.additionalDetails || {}) },
        tkName: (val.tkName?._id || val.tkName) as string,
      }
    }
  },
  { immediate: true }
)

const rules = {
  tkName: { required },
  type: { required },
  liftCapacityType: { required },
  regNum: { required },
  liftCapacity: { numeric },
  volumeFuel: { numeric },
  volumeRef: { numeric },
  pltCount: { numeric },
  order: { numeric },
}

const v$ = useVuelidate(rules, form, { $scope: false })

const directoriesProfile = computed(() => store.getters.directoriesProfile)
const truckTypes = computed(() => store.getters.truckTypes)
const truckKinds = computed(() => store.getters.truckKinds)
const liftCapacityTypes = computed(() => store.getters.liftCapacityTypes)
const brigadiers = computed(() => store.getters.brigadiersForSelect)
const mechanics = computed(() => store.getters.mechanicsForSelect)

const regNumErrors = computed(() => {
  const errors: string[] = []
  if (v$.value.regNum.$dirty && v$.value.regNum.$invalid)
    errors.push('Гос. номер должен быть заполнен')
  return errors
})

const typeErrors = computed(() => {
  const errors: string[] = []
  if (v$.value.type.$dirty && v$.value.type.$invalid) errors.push('Тип должен быть заполнен')
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
.truck-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.delete-btn {
  align-self: flex-start;
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
  flex: 0 0 250px;
  min-width: 250px;
  max-width: 250px;
}

.field-fluid {
  flex: 1 1 100%;
  min-width: 100%;
  max-width: none;
}
</style>
