import { ref, computed, watch, getCurrentInstance } from 'vue'
import { useVuelidate } from '@vuelidate/core'
// import { required } from '@vuelidate/validators'

export const useForm = (props, ctx) => {
  const { proxy } = getCurrentInstance()
  const getState = (item) => {
    return item !== null
      ? item
      : {
          name: '',
          agreement: null,
          outsource: false,
          contacts: [],
          companyInfo: null,
          bankAccountInfo: null,
        }
  }
  const state = ref({})
  const rules = computed(() => ({
    name: {},
    outsource: {},
  }))

  const v$ = useVuelidate(rules, state)
  const isInvalidForm = computed(() => v$.value.$invalid)

  function resetForm() {
    state.value = {}
  }

  function deleteHandler() {
    ctx.emit('delete')
  }

  function submitHandler() {
    ctx.emit('submit', {
      ...state.value,
      company: proxy.$store.getters.directoriesProfile,
    })
    resetForm()
  }

  function cancelHandler() {
    ctx.emit('cancel')
    resetForm()
  }

  watch(
    () => props.item,
    (value) => {
      if (!value) return
      state.value = getState(value)
    },
    { immediate: true, deep: true }
  )
  return {
    state,
    submitHandler,
    cancelHandler,
    isInvalidForm,
    // nameErrors,
    deleteHandler,
  }
}
