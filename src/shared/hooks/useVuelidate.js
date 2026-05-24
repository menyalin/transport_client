import { useVuelidate as vUseVuelidate } from '@vuelidate/core'

// Обёртка для обратной совместимости с Options API
export function useVuelidate(validations, state) {
  const v = vUseVuelidate(validations, state)

  return {
    ...v,
    // Обёртки для computed свойств
    getErrors(field) {
      const errors = []
      if (!v.value[field].$dirty) return errors

      const fieldValidation = v.value[field]

      if (fieldValidation.required?.$invalid === true && fieldValidation.required.$invalid) {
        errors.push('Это поле обязательно')
      }
      if (fieldValidation.email?.$invalid === true && fieldValidation.email.$invalid) {
        errors.push('Некорректный email')
      }
      if (fieldValidation.minLength?.$invalid === true && fieldValidation.minLength.$invalid) {
        errors.push(`Минимум ${fieldValidation.minLength.$params.min} символов`)
      }
      if (fieldValidation.sameAs?.$invalid === true && fieldValidation.sameAs.$invalid) {
        errors.push('Значения не совпадают')
      }

      return errors
    },
  }
}
