import { ref, getCurrentInstance } from 'vue'
import { v4 as uuidv4 } from 'uuid'

export const usePersistedFormState = () => {
  const { proxy } = getCurrentInstance()
  const { $router, $route } = proxy
  const formId = ref(null)
  const currentQuery = $route?.query

  const getFormKey = (formId, scope = 'root') => `${formId}:${scope}`

  const saveForm = (formId, scope, stateString) => {
    sessionStorage.setItem(getFormKey(formId, scope), stateString)
  }

  const savedForm = (scope, needClear = false) => {
    const state = sessionStorage.getItem(getFormKey(formId.value, scope))
    if (!state) return null
    if (needClear) sessionStorage.removeItem(getFormKey(formId.value, scope))
    return state
  }

  function updatePrevFormValue(route, value) {
    const prevFormId = route.query?.prevFormId
    const scope = route.query?.scope

    if (prevFormId && route.query?.field) {
      const storedForm = sessionStorage.getItem(getFormKey(prevFormId, scope))
      if (!storedForm) return
      else
        sessionStorage.setItem(
          getFormKey(prevFormId, scope),
          JSON.stringify({
            ...JSON.parse(storedForm),
            [route.query.field]: value,
          })
        )
    }
  }

  if (currentQuery.formId) formId.value = currentQuery.formId
  else {
    const newFormId = uuidv4()
    formId.value = newFormId
    $router.replace({
      path: $route.path,
      query: { ...currentQuery, formId: newFormId },
    })
  }

  function getState(formScope, item, initialState) {
    if (savedForm(formScope)) return JSON.parse(savedForm(formScope))
    else return item ? item : initialState
  }
  function clearStoredForm(formScope) {
    sessionStorage.removeItem(getFormKey(formId.value, formScope))
  }

  return {
    saveForm,
    updatePrevFormValue,
    formId,
    savedForm,
    getState,
    clearStoredForm,
  }
}
