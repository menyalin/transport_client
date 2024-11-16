import { ref, computed, watch, getCurrentInstance } from 'vue'
import { useVuelidate } from '@vuelidate/core'
// import { required } from '@vuelidate/validators'

export const useForm = (props, ctx) => {
  const { proxy } = getCurrentInstance()
  const getState = (item) => {
    return item !== null
      ? item
      : {
          name: null,
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
  // const nameErrors = computed(() => {
  //   const err = []
  //   const field = v$.value.name
  //   if (!field.$invalid) return err

  //   field.$dirty &&
  //     field.required.$invalid &&
  //     err.push('Название не может быть пустым')
  //   return err
  // })

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
