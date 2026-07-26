<template>
  <div>
    <ButtonsPanel
      panel-type="form"
      :disabledSubmit="disabledSubmitForm"
      @cancel="cancel"
      @submit="submit"
    />

    <div id="form">
      <div class="fields-row">
        <v-select
          v-model="form.tkName"
          :items="carrierItems"
          item-title="name"
          item-value="_id"
          label="ТК"
          class="field-select"
        />
      </div>

      <div class="fields-row">
        <v-text-field
          v-model.trim="form.surname"
          label="Фамилия"
          :error-messages="surnameErrors"
          class="field-md"
        />
        <v-text-field
          v-model.trim="form.name"
          label="Имя"
          :error-messages="nameErrors"
          class="field-md"
        />
        <v-text-field
          v-model.trim="form.patronymic"
          label="Отчество"
          :error-messages="nameErrors"
          class="field-md"
        />
        <DateTimeInput v-model="form.birthday" label="Дата рождения" class="field-date" />
      </div>

      <div class="fields-row">
        <v-text-field
          v-model.trim="form.passportId"
          label="Номер паспорта"
          hide-details
          class="field-md"
        />
        <DateTimeInput
          v-model="form.passportDate"
          label="Дата выдачи паспорта"
          class="field-date"
        />
        <v-textarea
          v-model.trim="form.passportIssued"
          label="Паспорт выдан"
          :rows="4"
          class="field-lg"
        />
      </div>

      <div class="fields-row">
        <v-text-field
          v-model.trim="form.licenseId"
          label="Номер ВУ"
          hide-details
          class="field-md"
        />
        <v-text-field
          v-model.trim="form.licenseCategory"
          label="Категории ВУ"
          hide-details
          class="field-md"
        />
      </div>

      <div class="fields-row">
        <v-text-field v-model.trim="form.inn" label="ИНН" hide-details class="field-md" />
        <v-text-field
          v-model.trim="form.driverCardId"
          label="Карта водителя"
          hide-details
          class="field-md"
        />
        <DateTimeInput
          v-model="form.driverCardPeriod"
          label="КВ действительна до"
          class="field-date"
        />
      </div>

      <div class="fields-row">
        <v-text-field v-model.trim="form.phone" label="Телефон" hide-details class="field-md" />
        <v-text-field v-model.trim="form.phone2" label="Телефон 2" hide-details class="field-md" />
      </div>

      <AppMedBook v-model="form.medBook" title="Мед.книжка" class="mb-5" />

      <div class="fields-row">
        <v-checkbox v-model="form.isBrigadier" label="Бригадир" hide-details />
        <v-checkbox v-model="form.isMechanic" label="Механик" hide-details />
        <DateTimeInput
          v-model="form.employmentDate"
          label="Дата приема на работу"
          class="field-date"
        />
        <DateTimeInput v-model="form.dismissalDate" label="Дата увольнения" class="field-date" />
        <v-text-field
          v-model.trim="form.recommender"
          label="Кто рекомедовал"
          hide-details
          class="field-md"
        />
      </div>

      <AdditionalNotifications v-model="form.additionalNotifications" />

      <div class="fields-row">
        <v-checkbox v-model="form.hasScans" label="Есть сканы документов" />
        <v-checkbox v-model="form.hideInFines" label="Не показывать в штрафах" />
        <v-checkbox v-model="form.isCalcSalary" label="Расчет ЗП" />
      </div>
    </div>

    <EntityFiles v-if="driver?._id" :itemId="driver._id" docType="driver" />

    <div v-if="displayDeleteBtn" class="delete-btn-row mt-3">
      <v-btn color="error" prepend-icon="mdi-delete" @click="emit('delete')">Удалить</v-btn>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'DriverFormIndex' })
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import AppMedBook from './medBook.vue'
import { ButtonsPanel, DateTimeInput, AdditionalNotifications, EntityFiles } from '@/shared/ui'

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

const driver = defineModel({ type: Object })

const emit = defineEmits(['submit', 'cancel', 'delete'])

const store = useStore()

const defaultDriver = {
  tkName: null,
  surname: null,
  name: null,
  patronymic: null,
  passportId: null,
  passportIssued: null,
  passportDate: null,
  licenseId: null,
  licenseDate: null,
  licenseCategory: null,
  driverCardId: null,
  driverCardPeriod: null,
  hasScans: null,
  phone: null,
  phone2: null,
  employmentDate: null,
  dismissalDate: null,
  recommender: null,
  birthday: null,
  isBrigadier: false,
  isMechanic: false,
  hideInFines: false,
  isCalcSalary: true,
  inn: null,
  medBook: {},
  additionalNotifications: [],
}

const form = ref({ ...defaultDriver })

const directoriesProfile = computed(() => store.getters.directoriesProfile)

const formState = computed(() => ({
  ...form.value,
  company: directoriesProfile.value,
}))

const initialFormState = ref(null)

watch(
  driver,
  (val) => {
    if (!val) return
    const keys = Object.keys(defaultDriver)
    keys.forEach((key) => {
      form.value[key] = val[key] ?? defaultDriver[key]
    })
    if (val.tkName?._id) form.value.tkName = val.tkName._id
    if (!initialFormState.value) initialFormState.value = JSON.stringify(formState.value)
  },
  { immediate: true }
)

const rules = {
  form: {
    tkName: { required },
    surname: { required },
    name: { required },
    patronymic: {},
    passportId: {},
    passportIssued: {},
    passportDate: {},
    licenseId: {},
    licenseDate: {},
    licenseCategory: {},
    driverCardId: {},
    driverCardPeriod: {},
    hasScans: {},
    phone: {},
    phone2: {},
    employmentDate: {},
    dismissalDate: {},
    recommender: {},
    birthday: {},
    inn: {},
    medBook: {},
    additionalNotifications: {},
  },
}

const v = useVuelidate(rules, form)

const disabledSubmitForm = computed(() => {
  return (
    !store.getters.hasPermission('driver:write') ||
    v.value.$invalid ||
    !formChanged.value ||
    props.loading
  )
})

const nameErrors = computed(() => {
  const errors = []
  if (v.value.form.name.$dirty && v.value.form.name.$invalid)
    errors.push('Имя не может быть пустым')
  return errors
})

const surnameErrors = computed(() => {
  const errors = []
  if (v.value.form.surname.$dirty && v.value.form.surname.$invalid)
    errors.push('Фамилия не может быть пустой')
  return errors
})

const formChanged = computed(() => {
  return initialFormState.value !== JSON.stringify(formState.value)
})

const submit = () => {
  emit('submit', formState.value)
}

const cancel = () => {
  resetForm()
  emit('cancel')
}

const resetForm = () => {
  form.value = { ...defaultDriver }
}

onMounted(() => {
  if (!initialFormState.value) initialFormState.value = JSON.stringify(formState.value)
})
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
