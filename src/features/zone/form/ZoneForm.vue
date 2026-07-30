<template>
  <div>
    <ButtonsPanel
      panel-type="form"
      :disabledSubmit="!canSubmit"
      @cancel="cancel"
      @submit="submit"
      class="mb-5"
    />
    <v-text-field v-model.trim="state.name" :error-messages="nameErrors" label="Название" />

    <v-btn v-if="displayDeleteBtn" color="error" @click="$emit('delete')">
      <v-icon start> mdi-delete </v-icon>
      Удалить
    </v-btn>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { ButtonsPanel } from '@/shared/ui'

defineOptions({ name: 'ZoneForm' })

const props = defineProps({
  zone: { type: Object },
  displayDeleteBtn: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel', 'delete'])
const store = useStore()

const initialState = { name: '' }
const state = ref({ ...initialState })

const rules = { name: { required } }
const v$ = useVuelidate(rules, state)

const directoriesProfile = computed(() => store.getters.directoriesProfile)

const nameErrors = computed(() => {
  const errors = []
  if (v$.value.name.$dirty && v$.value.name.$invalid)
    errors.push('Название зоны не может быть пустым')
  return errors
})

const formState = computed(() => ({
  ...state.value,
  company: directoriesProfile.value,
}))

const canSubmit = computed(
  () => store.getters.hasPermission('zone:write') && !v$.value.$invalid && formChanged.value
)

const formChanged = computed(() => {
  if (!props.zone) return !!state.value.name
  return state.value.name !== initialState.name
})

const submit = () => {
  emit('submit', formState.value)
}

const cancel = () => {
  emit('cancel')
}

watch(
  () => props.zone,
  (val) => {
    state.value = { ...initialState, ...(val || {}) }
  },
  { immediate: true, deep: true }
)
</script>
