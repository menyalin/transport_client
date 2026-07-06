import { ref, computed, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { useStore } from 'vuex'

export const useForm = (props, emit) => {
  const store = useStore()

  const getState = (item) => {
    return item !== null
      ? item
      : {
          name: '',
          agreements: [],
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
    agreements: {},
  }))

  const v$ = useVuelidate(rules, state)
  const isInvalidForm = computed(() => v$.value.$invalid)

  function resetForm() {
    state.value = {}
  }

  function deleteHandler() {
    emit('delete')
  }

  function submitHandler() {
    emit('submit', {
      ...state.value,
      company: store.getters.directoriesProfile,
    })
    resetForm()
  }

  function cancelHandler() {
    emit('cancel')
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
    v$,
    deleteHandler,
  }
}
