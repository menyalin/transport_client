import { ref, watch } from 'vue'

export default function useHistorySettings(initialState) {
  const state = ref(
    history.state ? Object.assign(initialState, history.state) : initialState
  )

  watch(
    state,
    (newState) => {
      history.pushState(Object.assign({}, state.value, newState), '')
    },
    { deep: true }
  )

  window.addEventListener('popstate', (event) => {
    if (event.state) {
      Object.assign(state.value, event.state)
    }
  })

  return state
}
