import { useVuelidate as vUseVuelidate } from '@vuelidate/core'

export function useVuelidate(validations: Record<string, any>, state: Record<string, any>) {
  const v = vUseVuelidate(validations, state)

  const getErrors = (field: string): string[] => {
    const errors: string[] = []
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
  }

  return {
    ...v,
    getErrors,
  }
}
