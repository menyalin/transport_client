<template>
  <div>
    <ButtonsPanel
      panel-type="form"
      :disabledSubmit="
        !store.getters.hasPermission('region:write') || isInvalidForm || !formChanged
      "
      @cancel="cancel"
      @submit="submit"
      class="mb-5"
    />
    <v-text-field v-model.trim="form.name" :error-messages="nameErrors" label="Название" />

    <v-btn v-if="displayDeleteBtn" color="error" @click="$emit('delete')">
      <v-icon start> mdi-delete </v-icon>
      Удалить
    </v-btn>
  </div>
</template>

<script setup>
defineOptions({ name: 'RegionForm' })
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { ButtonsPanel } from '@/shared/ui'

const props = defineProps({
  region: {
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
const form = ref({
  name: null,
})

const rules = {
  form: {
    name: { required },
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

const nameErrors = computed(() => {
  const errors = []
  if (v.value.form.name.$dirty && v.value.form.name.$invalid)
    errors.push('Название не может быть пустым')
  return errors
})

const formState = computed(() => ({
  ...form.value,
  company: directoriesProfile.value,
}))

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
  () => props.region,
  (val) => {
    if (val) setFormFields(val)
  },
  { immediate: true }
)

onMounted(() => {
  initialFormState.value = JSON.stringify(formState.value)
})
</script>
