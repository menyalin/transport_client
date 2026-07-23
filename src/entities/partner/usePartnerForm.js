import { ref, watch, computed } from 'vue'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import store from '@/store'

export const usePartnerForm = (props, { emit }) => {
  const initialState = () => ({
    name: null,
    fullName: null,
    inn: null,
    group: null,
    contacts: null,
    isClient: false,
    isService: false,
    cargoDescription: null,
    // placesForTransferDocs: [],
    invoiceLoader: null,
    // idleTruckNotifications: [],
    companyInfo: {},
    bankAccountInfo: {},
  })
  const state = ref(initialState())
  const rules = computed(() => ({ name: { required } }))
  const v$ = useVuelidate(rules, state, { scope: false })
  const isAdmin = computed(() => store.getters.user?.isAdmin)
  const isInvalidForm = computed(() => v$.value.$invalid)
  const nameFieldErrors = computed(() => {
    if (v$.value.name.$invalid && v$.value.name.$dirty) {
      return 'Поле обязательно для заполнения'
    }
  })
  function companyInfoChangedHandler(val) {
    state.value = { ...state.value, companyInfo: val }
  }

  function bankAccountInfoChangedHandler(val) {
    state.value = { ...state.value, bankAccountInfo: val }
  }
  function submitHandler() {
    emit('submit', state.value)
  }

  function saveHandler() {
    emit('save', state.value)
  }

  function cancelHandler() {
    emit('cancel')
  }

  watch(
    () => props.item,
    (val) => {
      state.value = { ...initialState(), ...val }
    },
    { immediate: true, deep: true }
  )

  return {
    state,
    v$,
    isAdmin,
    nameFieldErrors,
    companyInfoChangedHandler,
    bankAccountInfoChangedHandler,
    isInvalidForm,
    submitHandler,
    saveHandler,
    cancelHandler,
  }
}
