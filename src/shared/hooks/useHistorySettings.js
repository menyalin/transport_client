import { ref, watch } from 'vue'

export default function useHistorySettings(
  initialState,
  stateName = 'default'
) {
  const state = ref(
    history.state[stateName]
      ? typeof initialState === 'object'
        ? Object.assign(initialState, history.state[stateName])
        : history.state[stateName]
      : initialState
  )

  watch(
    state,
    (newState) => {
      history.pushState(
        Object.assign({}, history.state, { [stateName]: newState }),
        ''
      )
    },
    { deep: true }
  )

  window.addEventListener('popstate', (event) => {
    if (event.state && event.state[stateName]) {
      state.value = event.state[stateName]
    }
  })

  return state
}
