import store from '@/store'
import { computed, watch, ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'

export const useFormState = (props, { emit }) => {
  function validateEmails(value) {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    const emails = value
      .split(';')
      .map((s) => s.trim())
      .filter((s) => !!s)
    for (let i = 0; i < emails.length; i++) {
      if (!emailRegex.test(emails[i].trim())) return false
    }
    return true
  }

  function getInitialState() {
    if (props.initialState?._id) return props.initialState
    return {
      title: '',
      addresses: [],
      idleHoursBeforeNotify: 0,
      emails: '',
      ccEmails: '',
      templateName: '',
      note: '',
      usePlannedDate: false,
    }
  }

  let state = ref(getInitialState())

  const rules = {
    title: { required, $autoDirty: true },
    addresses: { required, $autoDirty: true },
    emails: {
      required,
      $autoDirty: true,
      validateEmails: helpers.withMessage(
        'Введите корректные email-адреса, разделенные ";"',
        validateEmails
      ),
    },
    ccEmails: {
      $autoDirty: true,
      validateEmails: helpers.withMessage(
        'Введите корректные email-адреса, разделенные ";"',
        validateEmails
      ),
    },
    templateName: { $autoDirty: true },
    note: { $autoDirty: true },
    usePlannedDate: { $autoDirty: true },
  }
  const v$ = useVuelidate(rules, state)

  function cancel() {
    state.value = Object.assign({})
    v$.value.$reset()
    emit('cancel')
  }

  function submit() {
    emit('submit', { ...state.value })
    cancel()
  }

  const titleFieldErrors = computed(() => {
    return v$.value.title.$errors.map((error) => error.$message)
  })

  const addressFieldErrors = computed(() => {
    return v$.value.addresses.$errors.map((error) => error.$message)
  })

  const emailFieldErrors = computed(() => {
    return v$.value.emails.$errors.map((error) => error.$message)
  })

  const ccEmailFieldErrors = computed(() => {
    return v$.value.ccEmails.$errors.map((error) => error.$message)
  })

  const invalidForm = computed(() => {
    return v$.value.$invalid
  })

  const addressItems = computed(() => {
    return store.getters.addressesForAutocomplete.filter(
      (i) => i.partner === props.partnerId
    )
  })

  watch(
    () => props.initialState,
    () => {
      state.value = Object.assign({}, getInitialState())
      v$.value.$reset()
    },
    { deep: true }
  )

  return {
    state,
    v$,
    cancel,
    submit,
    addressItems,
    invalidForm,
    titleFieldErrors,
    addressFieldErrors,
    emailFieldErrors,
    ccEmailFieldErrors,
  }
}
