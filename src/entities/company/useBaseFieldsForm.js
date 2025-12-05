import { computed, ref } from 'vue'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

const getInitialState = editedItem => ({
  fullName: editedItem?.fullName || null,
})

export const useBaseFieldsForm = item => {
  let state = ref({})

  const rules = {
    fullName: { required },
  }

  const v$ = useVuelidate(rules, state)

  const fullNameErrorMessages = computed(() => {
    const err = []
    const field = v$.value.fullName
    if (!field.$invalid) return err

    field.$dirty && field.required.$invalid && err.push('Полное имя компании не может быть пустым')
    return err
  })

  const isStateUpdated = computed(() => {
    const fields = Object.keys(state.value)
    return fields.some(field => item[field] !== state.value[field])
  })
  const invalidForm = computed(() => v$.value.$invalid || !isStateUpdated.value)

  function setFormState(item) {
    state.value = { ...getInitialState(item) }
  }
  return {
    v$,
    state,
    invalidForm,
    fullNameErrorMessages,
    setFormState,
  }
}
