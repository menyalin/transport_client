<template>
  <div>
    <ButtonsPanel
      panel-type="form"
      :disabledSubmit="!store.getters.hasPermission('worker:write') || isInvalidForm"
      class="mb-4"
      @cancel="cancel"
      @submit="submit"
    />

    <div class="input-row mt-5">
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
      <DateTimeInput
        v-model="form.employmentDate"
        label="Дата приема на работу"
        :style="{ 'max-width': '260px' }"
      />

      <DateTimeInput
        v-model="form.dismissalDate"
        type="date"
        label="Дата увольнения"
        :style="{ 'max-width': '260px' }"
      />
    </div>

    <v-text-field v-model.trim="form.position" label="Должность" />

    <v-text-field v-model.trim="form.note" label="Примечание" />

    <div v-if="!item._id" class="text-body-small mx-3">
      *Для сопоставления сотрудника с пользователем, запись необходимо сохранить
    </div>
    <v-btn v-if="displayDeleteBtn" color="error" @click="$emit('delete')">
      <v-icon start icon="mdi-delete" />
      Удалить
    </v-btn>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { ButtonsPanel, DateTimeInput } from '@/shared/ui'

const props = defineProps({
  item: {
    type: Object,
  },
  displayDeleteBtn: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit', 'cancel', 'delete'])

const store = useStore()

const form = ref({
  name: null,
  fullName: null,
  position: null,
  note: null,
  employmentDate: null,
  dismissalDate: null,
})

const rules = {
  name: { required },
  fullName: { required },
  position: {},
}

const v = useVuelidate(rules, form)

const directoriesProfile = computed(() => store.getters.directoriesProfile)

const isInvalidForm = computed(() => {
  return v.value.$invalid
})

const nameErrors = computed(() => {
  const errors = []
  if (v.value.name.$dirty && v.value.name.$invalid) errors.push('Имя не может быть пустым')
  return errors
})

const fullNameErrors = computed(() => {
  const errors = []
  if (v.value.fullName.$dirty && v.value.fullName.$invalid)
    errors.push('Полное имя не может быть пустым')
  return errors
})

const formState = computed(() => {
  return { ...form.value, company: directoriesProfile.value }
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
    form.value[key] = val[key]
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
</script>
<style scoped>
.input-row {
  display: flex;
  margin-top: 15px;
  margin-bottom: 15px;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}
</style>
