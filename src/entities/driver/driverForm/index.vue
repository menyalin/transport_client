<template>
  <div>
    <buttons-panel
      panel-type="form"
      :disabled-submit="disabledSubmitForm"
      @cancel="cancel"
      @submit="submit"
    />

    <div>
      <div class="row-wrapper tk-name">
        <v-select
          v-model.trim="form.tkName"
          :items="carrierItems"
          item-title="name"
          item-value="_id"
          label="ТК"
        />
      </div>

      <div class="row-wrapper driver-name">
        <v-text-field v-model.trim="form.surname" label="Фамилия" :error-messages="surnameErrors" />
        <v-text-field v-model.trim="form.name" label="Имя" :error-messages="nameErrors" />
        <v-text-field
          v-model.trim="form.patronymic"
          label="Отчество"
          :error-messages="nameErrors"
        />
        <DateTimeInput v-model="form.birthday" label="Дата рождения" />
      </div>

      <div class="row-wrapper">
        <div class="passport">
          <div>
            <v-text-field
              v-model.trim="form.passportId"
              hide-details
              label="Номер паспорта"
              class="pb-3"
            />
            <DateTimeInput v-model="form.passportDate" label="Дата выдачи паспорта" />
          </div>
          <v-textarea v-model.trim="form.passportIssued" label="Паспорт выдан" :rows="4" />
        </div>
        <div class="driver-license">
          <v-text-field v-model.trim="form.licenseId" hide-details label="Номер ВУ" />
          <v-text-field v-model.trim="form.licenseCategory" label="Категории ВУ" hide-details />
        </div>
        <div class="driver-cards">
          <v-text-field v-model.trim="form.inn" hide-details label="ИНН" />
          <v-text-field v-model.trim="form.driverCardId" hide-details label="Карта водителя" />
          <DateTimeInput v-model="form.driverCardPeriod" label="КВ действительна до" />
        </div>
      </div>
      <div class="row-wrapper phones">
        <v-text-field v-model.trim="form.phone" label="Телефон" hide-details />
        <v-text-field v-model.trim="form.phone2" label="Телефон 2" hide-details />
      </div>

      <app-med-book v-model="medBook" title="Мед.книжка" class="mb-5" />
      <div class="work-status">
        <div>
          <v-checkbox v-model="form.isBrigadier" label="Бригадир" hide-details />
          <v-checkbox v-model="form.isMechanic" label="Механик" hide-details />
        </div>
        <DateTimeInput v-model="form.employmentDate" label="Дата приема на работу" />

        <DateTimeInput v-model="form.dismissalDate" label="Дата увольнения" />
        <v-text-field v-model.trim="form.recommender" label="Кто рекомедовал" hide-details />
      </div>
      <AdditionalNotifications v-model="additionalNotifications" />
      <v-checkbox v-model="form.hasScans" label="Есть сканы документов" />
      <v-checkbox v-model="form.hideInFines" label="Не показывать в штрафах" />

      <v-checkbox v-model="form.isCalcSalary" label="Расчет ЗП" />
    </div>
    <EntityFiles v-if="driver && driver._id" :itemId="driver._id" docType="driver" />
    <div v-if="displayDeleteBtn" class="delete-btn-row mt-3">
      <v-btn color="error" @click="$emit('delete')">
        <v-icon start> mdi-delete </v-icon>
        Удалить
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import AppMedBook from './medBook.vue'
import { ButtonsPanel, DateTimeInput, AdditionalNotifications, EntityFiles } from '@/shared/ui'

const props = defineProps({
  driver: {
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
const medBook = ref({})
const additionalNotifications = ref([])
const initialFormState = ref(null)
const form = ref({
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
})

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
  },
}

const v = useVuelidate(rules, form)

const disabledSubmitForm = computed(() => {
  return (
    !store.getters.hasPermission('driver:write') ||
    v.value.$invalid ||
    !formChanged.value ||
    loading.value
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
    errors.push('Имя не может быть пустым')
  return errors
})

const formChanged = computed(() => {
  return initialFormState.value !== JSON.stringify(formState.value)
})

const formState = computed(() => ({
  ...form.value,
  medBook: medBook.value,
  company: store.getters.directoriesProfile,
  additionalNotifications: additionalNotifications.value,
}))

const submit = () => {
  emit('submit', formState.value)
}

const cancel = () => {
  resetForm()
  emit('cancel')
}

const setFormFields = (val) => {
  const keys = Object.keys(form.value)
  medBook.value = val.medBook
  if (val.additionalNotifications) additionalNotifications.value = val.additionalNotifications
  keys.forEach((key) => {
    form.value[key] = val[key]
    if (val.tkName?._id) form.value.tkName = val.tkName._id
  })
}

const resetForm = () => {
  const keys = Object.keys(form.value)
  medBook.value = {}
  additionalNotifications.value = []
  keys.forEach((key) => {
    form.value[key] = null
  })
}

watch(
  () => props.driver,
  (val) => {
    if (val) setFormFields(val)
  },
  { immediate: true }
)

onMounted(() => {
  initialFormState.value = JSON.stringify(formState.value)
})
</script>
<style scoped>
.row-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.row-wrapper > * {
  padding: 2px 10px;
  width: 100%;
}
.tk-name > * {
  max-width: 30rem;
}
.driver-name {
  display: grid;
  grid-template-columns: 2fr 2fr 2fr 1fr;
}
.passport {
  display: flex;
  flex-direction: row;
  width: 100%;
}
.passport > * {
  margin-right: 10px;
}
.driver-license {
  max-width: 230px;
}
.driver-license > * {
  margin-bottom: 8px;
}
.phones > * {
  margin-bottom: 8px;
  max-width: 300px;
}

.driver-cards {
  max-width: 230px;
}
.driver-cards > * {
  margin-bottom: 8px;
}
.work-status {
  display: grid;
  grid-template-columns: 150px 200px 200px auto;
  gap: 15px;
  align-items: center;
  margin-bottom: 30px;
}
.delete-btn-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
</style>
