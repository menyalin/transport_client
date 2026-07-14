<template>
  <FormWrapper>
    <buttons-panel
      panel-type="form"
      :disabledSubmit="!store.getters.hasPermission('scheduleNote:write') || isInvalidForm"
      @cancel="cancel"
      @submit="submit"
    />

    <v-autocomplete v-model="form.truck" label="Грузовик" :items="trucks" />
    <v-text-field v-model.trim="form.text" label="Текст" :style="{ minWidth: '300px' }" />
    <v-select v-model="form.priority" label="Приоритет" :items="priorityItems" />

    <DateTimeInput
      v-model="form.startPositionDate"
      label="Дата начала"
      type="datetime-local"
      :style="{ maxWidth: '300px' }"
    />
    <v-btn v-if="displayDeleteBtn" class="mt-5" color="error" @click="$emit('delete')">
      <v-icon start> mdi-delete </v-icon>
      Удалить
    </v-btn>
  </FormWrapper>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { ButtonsPanel, DateTimeInput, FormWrapper } from '@/shared/ui'

const props = defineProps({
  scheduleNote: {
    type: Object,
  },
  displayDeleteBtn: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit', 'cancel', 'delete'])

const store = useStore()

const priorityItems = [
  { value: 'low', title: 'Обычный' },
  { value: 'middle', title: 'Средний' },
  { value: 'high', title: 'Высокий' },
]

const form = ref({
  text: null,
  truck: null,
  startPositionDate: null,
  priority: 'low',
})

const rules = {
  form: {
    text: { required },
    truck: { required },
    startPositionDate: { required },
  },
}

const v = useVuelidate(rules, form)

// const myCompanies = computed(() => store.getters.myCompanies)
const directoriesProfile = computed(() => store.getters.directoriesProfile)

const isInvalidForm = computed(() => {
  if (!directoriesProfile.value) return true
  return v.value.$invalid
})

// const directoriesProfileName = computed(() => {
//   if (!directoriesProfile.value) return null
//   return myCompanies.value.find((item) => item._id === directoriesProfile.value)?.name
// })

const formState = computed(() => ({ ...form.value, company: directoriesProfile.value }))

const trucks = computed(() => {
  return store.getters.trucks
    .filter((item) => item.type === 'truck')
    .map((item) => ({ value: item._id, title: item.regNum }))
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
  () => props.scheduleNote,
  (val) => {
    if (val) setFormFields(val)
  },
  { immediate: true }
)
</script>
<style>
.row-input {
  display: flex;
  flex-direction: row;
}
</style>
