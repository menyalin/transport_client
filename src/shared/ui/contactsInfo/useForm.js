import { computed, ref, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'
export const useForm = (props, ctx) => {
  const initialState = () => ({
    name: null,
    position: null,
    phone: null,
    email: null,
    note: null,
  })
  const state = ref(initialState())
  const rules = computed(() => {
    return {
      name: {},
      position: {},
      phone: {},
      email: {},
      note: {},
    }
  })

  const v$ = useVuelidate(rules, state)
  const invalidForm = computed(() => {
    return v$.value.$invalid
  })
  function cancelHandler() {
    ctx.emit('cancel')
  }

  function submitHandler() {
    if (!invalidForm.value) ctx.emit('submit', { ...state.value })
    state.value = initialState()
  }

  watch(
    () => props.item,
    val => {
      state.value = val || initialState()
    },
    { immediate: true }
  )

  return { state, invalidForm, cancelHandler, submitHandler }
}
