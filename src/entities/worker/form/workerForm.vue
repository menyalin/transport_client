<template>
  <div>
    <buttons-panel
      panel-type="form"
      :disabledSubmit="
        !store.getters.hasPermission('worker:write') || isInvalidForm || !formChanged
      "
      class="mb-4"
      @cancel="cancel"
      @submit="submit"
    />

    <div class="input-row">
      <v-text-field
        v-model.trim="form.name"
        :error-messages="nameErrors"
        label="Сокращенное имя"
        :style="{ 'max-width': '330px' }"
      />
      <v-text-field
        v-model.trim="form.fullName"
        :error-messages="fullNameErrors"
        label="Полное имя"
      />
    </div>
    <div class="input-row">
      <v-text-field
        v-model="form.employmentDate"
        type="date"
        label="Дата приема на работу"
        :style="{ 'max-width': '260px' }"
      />

      <v-text-field
        v-model="form.dismissalDate"
        type="date"
        label="Дата увольнения"
        :style="{ 'max-width': '260px' }"
      />
    </div>

    <v-text-field v-model.trim="form.position" label="Должность" />

    <v-text-field v-model.trim="form.note" label="Примечание" />

    <div v-if="!item._id" class="text-caption mx-3">
      *Для сопоставления сотрудника с пользователем, запись необходимо сохранить
    </div>
    <v-btn v-if="displayDeleteBtn" color="error" @click="$emit('delete')">
      <v-icon start> mdi-delete </v-icon>
      Удалить
    </v-btn>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { ButtonsPanel } from '@/shared/ui'

const props = defineProps({
  item: {
    type: Object,
  },
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

const store = useStore()

const initialFormState = ref(null)
const dateFields = ['dismissalDate', 'employmentDate']
const form = ref({
  name: null,
  fullName: null,
  position: null,
  note: null,
  employmentDate: null,
  dismissalDate: null,
})

const rules = {
  form: {
    name: { required },
    fullName: { required },
    position: {},
  },
}

const v = useVuelidate(rules, form)

const directoriesProfile = computed(() => store.getters.directoriesProfile)

const isInvalidForm = computed(() => {
  if (!directoriesProfile.value) return true
  return v.value.$invalid
})

const nameErrors = computed(() => {
  const errors = []
  if (v.value.form.name.$dirty && v.value.form.name.$invalid)
    errors.push('Имя не может быть пустым')
  return errors
})

const fullNameErrors = computed(() => {
  const errors = []
  if (v.value.form.fullName.$dirty && v.value.form.fullName.$invalid)
    errors.push('Полное имя не может быть пустым')
  return errors
})

const formState = computed(() => {
  const dates = {}
  dateFields.forEach((item) => {
    dates[item] = form.value[item] ? dayjs(form.value[item]).toISOString() : null
  })
  return { ...form.value, company: directoriesProfile.value, ...dates }
})

const formChanged = computed(() => {
  return JSON.stringify(formState.value) !== initialFormState.value
})

const submit = () => {
  emit('submit', formState.value)
  resetForm()
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
  { immediate: true, deep: true }
)

onMounted(() => {
  initialFormState.value = JSON.stringify(formState.value)
})
</script>
<style scoped>
.input-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}
</style>
