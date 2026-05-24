<template>
  <div>
    <buttons-panel
      panel-type="form"
      :disabled-submit="!store.getters.hasPermission('fine:write') || isInvalidForm"
      class="mb-4"
      @cancel="cancel"
      @submit="submit"
    />

    <div class="row-input">
      <v-text-field
        v-model="form.date"
        type="date"
        label="Дата постановления"
        :style="{ maxWidth: '250px' }"
        @paste="pasteDate"
      />

      <v-text-field
        v-model.trim="form.number"
        label="Номер постановления"
        :style="{ maxWidth: '350px' }"
        @blur="$emit('fineNumberUpdated', $event)"
      />
      <v-select
        v-model.trim="form.category"
        :items="store.getters.fineCategories"
        label="Категория"
        itemTitle="text"
        clearable
        :style="{ maxWidth: '450px' }"
      />
    </div>
    <v-text-field v-model.trim="form.violation" label="Нарушение" />

    <div class="row-input mt-2">
      <v-text-field
        v-model.number="form.discountedSum"
        type="number"
        label="Сумма штрафа со скидкой"
        :style="{ maxWidth: '300px' }"
      />

      <v-text-field
        v-model.number="form.totalSum"
        type="number"
        label="Общая сумма штрафа"
        :style="{ maxWidth: '300px' }"
      />

      <v-text-field
        v-model="form.expiryDateOfDiscount"
        type="date"
        label="Скидка до"
        :style="{ maxWidth: '250px' }"
        @paste="pasteDate"
      />
    </div>

    <div class="row-input">
      <v-text-field
        v-model="form.violationDate"
        type="datetime-local"
        label="Дата и время нарушения"
        :style="{ maxWidth: '250px' }"
        @paste="pasteDate"
      />

      <v-autocomplete
        v-model="form.truck"
        label="Грузовик / Прицеп"
        :items="trucks"
        auto-select-first
        :style="{ maxWidth: '250px' }"
      />
      <v-autocomplete
        v-model="form.driver"
        label="Водитель"
        :items="drivers"
        auto-select-first
        :style="{ maxWidth: '350px' }"
        :append-inner-icon="form.truck && form.violationDate ? 'mdi-crosshairs' : null"
        @click:append-inner="getDriver"
      />
    </div>

    <v-text-field v-model="form.address" label="Место нарушения" />
    <div class="row-input">
      <v-checkbox v-model="form.isCulpritDriver" label="Виноват водитель" />
      <v-checkbox
        v-if="form.isCulpritDriver"
        v-model="form.isPaydByDriver"
        :disabled="!!form.payingByWorker"
        label="Оплачен водителем"
      />
    </div>

    <div v-if="showPaymentBlock" class="row-input">
      <v-text-field
        v-model.number="form.paymentSum"
        type="number"
        label="Сумма оплаты"
        :style="{ maxWidth: '300px' }"
      />

      <v-text-field
        v-model="form.paymentDate"
        type="date"
        label="Дата оплаты"
        :style="{ maxWidth: '250px' }"
        @paste="pasteDate"
      />

      <app-worker-autocomplete
        v-model="form.payingByWorker"
        label="Кто оплатил"
        :style="{ maxWidth: '350px' }"
      />
      <v-select
        v-if="isNeedWithheldFromDriver"
        v-model="form.kX"
        :items="[1, 2, 4]"
        itemTitle="text"
        label="kX"
        :style="{ maxWidth: '80px' }"
      />
      <v-text-field
        v-if="isNeedWithheldFromDriver"
        v-model.number="form.withheldSum"
        type="number"
        readonly
        label="Удержать"
        :style="{ maxWidth: '250px' }"
      />
      <v-checkbox
        v-if="isNeedWithheldFromDriver && showIsWithheldField"
        v-model="form.isWithheld"
        label="Удержано"
        :disabled="isWithheldReadonly"
      />
    </div>
    <v-text-field v-model="form.note" label="Примечание" />

    <v-btn v-if="displayDeleteBtn" color="error" @click="$emit('delete')">
      <v-icon start> mdi-delete </v-icon>
      Удалить
    </v-btn>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { ButtonsPanel } from '@/shared/ui'
import AppWorkerAutocomplete from '@/modules/common/components/workerAutocomplete/index.vue'
import { CrewService } from '@/shared/services'
import { usePasteDateInput } from '@/shared/ui/DateInputs/usePasteDateInput'

const props = defineProps({
  item: { type: Object },
  displayDeleteBtn: { type: Boolean, default: false },
  openInModal: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel', 'delete', 'fineNumberUpdated'])

const { pasteDate } = usePasteDateInput()
const store = useStore()

const dateFields = ['date', 'paymentDate', 'expiryDateOfDiscount']
const dateTimeFields = ['violationDate']
const form = ref({
  date: null,
  number: null,
  category: null,
  violation: null,
  violationDate: null,
  truck: null,
  driver: null,
  totalSum: null,
  discountedSum: null,
  expiryDateOfDiscount: null,
  address: null,
  paymentDate: null,
  paymentSum: null,
  isPaydByDriver: false,
  payingByWorker: null,
  isCulpritDriver: false,
  kX: 2,
  withheldSum: 0,
  isWithheld: false,
  note: null,
})

const rules = {
  form: {
    date: { required },
    number: { required },
    truck: { required },
    totalSum: { required },
    category: {},
    discountedSum: { required },
    expiryDateOfDiscount: {},
    driver: {},
    violation: {},
    violationDate: {},
    address: {},
    paymentDate: {},
    paymentSum: {},
    isPaydByDriver: {},
    payingByWorker: {},
    isCulpritDriver: {},
    kX: {},
    withheldSum: {},
    isWithheld: {},
    note: {},
  },
}

const v = useVuelidate(rules, form)

// const myCompanies = computed(() => store.getters.myCompanies)
const directoriesProfile = computed(() => store.getters.directoriesProfile)

const showIsWithheldField = computed(() => {
  return (
    isNeedWithheldFromDriver.value &&
    form.value.withheldSum > 0 &&
    store.getters.hasPermission('fine:isWithheldRead')
  )
})

const isWithheldReadonly = computed(() => {
  return !store.getters.hasPermission('fine:isWithheldWrite')
})

const isInvalidForm = computed(() => {
  if (!directoriesProfile.value) return true
  return v.value.$invalid
})

const isNeedWithheldFromDriver = computed(() => {
  return form.value.isCulpritDriver && !form.value.isPaydByDriver
})

const showPaymentBlock = computed(() => {
  return !form.value.isPaydByDriver
})

// const directoriesProfileName = computed(() => {
//   if (!directoriesProfile.value) return null
//   return myCompanies.value.find((item) => item._id === directoriesProfile.value)?.name
// })

const formState = computed(() => {
  const dates = {}
  dateFields.concat(dateTimeFields).forEach((item) => {
    dates[item] = form.value[item] ? dayjs(form.value[item]).toISOString() : null
  })
  const withheldParams = {}
  if (form.value.isPaydByDriver) {
    withheldParams.withheldSum = 0
    withheldParams.payingByWorker = null
  }
  return {
    ...form.value,
    company: directoriesProfile.value,
    ...dates,
    ...withheldParams,
  }
})

const trucks = computed(() => {
  return store.getters
    .activeTrucksOnDate(form.value.violationDate)
    .filter((item) => ['truck', 'trailer'].includes(item.type))
    .filter((item) => !item.hideInFines)
    .map((item) => ({ value: item._id, text: item.regNum }))
})

const drivers = computed(() => {
  return store.getters
    .activeDriversOnDate(form.value.violationDate)
    .filter((item) => !item.hideInFines)
    .map((item) => ({ value: item._id, text: item.fullName }))
})

const getDriver = async () => {
  if (!form.value.truck || !form.value.violationDate) return null
  const crew = await CrewService.getCrewByTruckAndDate({
    truck: form.value.truck,
    date: new Date(form.value.violationDate).toISOString(),
  })
  if (crew) form.value.driver = crew.driver
  else {
    form.value.driver = null
    store.commit('setError', 'Экипаж не найден')
  }
}

const submit = () => {
  emit('submit', formState.value)
}

const cancel = () => {
  resetForm()
  emit('cancel')
}

const setFormFields = (val) => {
  const keys = Object.keys(form.value)
  keys.forEach((key) => {
    if (dateFields.includes(key) && !!val[key]) {
      form.value[key] = dayjs(val[key]).format('YYYY-MM-DD')
    } else if (dateTimeFields.includes(key) && !!val[key]) {
      form.value[key] = dayjs(val[key]).format('YYYY-MM-DDTHH:mm')
    } else {
      form.value[key] = val[key]
    }
  })
}

const resetForm = () => {
  const keys = Object.keys(form.value)
  keys.forEach((key) => {
    form.value[key] = null
  })
}

watch(
  () => props.item,
  (val) => {
    if (val) setFormFields(val)
  },
  { immediate: true }
)

watch(
  () => form.value.violationDate,
  () => {
    form.value.truck = null
    form.value.driver = null
  }
)

watch(
  () => form.value.paymentSum,
  (val) => {
    if (!val || !isNeedWithheldFromDriver.value) form.value.withheldSum = 0
    else form.value.withheldSum = form.value.kX * form.value.paymentSum
  },
  { immediate: true }
)

watch(
  () => form.value.kX,
  () => {
    form.value.withheldSum = form.value.kX * form.value.paymentSum
  }
)
</script>
<style>
.row-input {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
}
</style>
