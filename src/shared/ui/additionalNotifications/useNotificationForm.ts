import useVuelidate from '@vuelidate/core'
import { numeric, required } from '@vuelidate/validators'
import { computed, reactive } from 'vue'

export interface INotification {
  title: string
  expDate: Date | string | null
  daysBeforeRemind: number | null
  note: string | null
}

export const useNotificationForm = () => {
  const state = reactive<INotification>({
    title: '',
    expDate: null,
    daysBeforeRemind: null,
    note: null,
  })

  const rules = {
    title: { required },
    expDate: { required },
    daysBeforeRemind: { required, numeric },
    note: {},
  }

  const v$ = useVuelidate(rules, state)

  function resetFormHandler() {
    v$.value.$reset()
  }

  const isInvalidEditableItem = computed(() => v$.value.$invalid)

  const titleErrors = computed(() => {
    const errors = []
    if (v$.value.$anyDirtytitle.$dirty && !v$.value.title.required)
      errors.push('Заголовок не может быть пустым')
    return errors
  })
  const expDateErrors = computed(() => {
    const errors = []
    if (v$.value.expDate.$dirty && !v$.value.expDate.required)
      errors.push('Укажите дату')
    return errors
  })
  const daysBeforeRemindErrors = computed(() => {
    const errors = []
    if (v$.value.daysBeforeRemind.$dirty && !v$.value.daysBeforeRemind.required)
      errors.push('Не должно быть пустым')
    if (v$.value.daysBeforeRemind.$dirty && !v$.value.daysBeforeRemind.numeric)
      errors.push('Введите число')
    return errors
  })

  return {
    state,
    v$,
    titleErrors,
    isInvalidEditableItem,
    expDateErrors,
    daysBeforeRemindErrors,
    resetFormHandler,
  }
}
