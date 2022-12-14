import { ref, watch } from 'vue'

const useListData = () => {
  const historyState = window.history.state
  const initialState = { clients: [], tks: [], state: null }
  const headers = ref([])
  const settings = ref(historyState.settings || initialState)

  function changeHeaders(value) {
    headers.value = value
  }

  function refresh() {
    console.log('refresh data')
  }

  function create() {
    console.log('create')
  }

  watch(
    settings,
    () => {
      window.history.pushState({ settings: settings.value }, '')
    },
    { immediate: true }
  )

  addEventListener('popstate', (e) => {
    settings.value = e.state.settings
  })

  return {
    refresh,
    create,
    settings,
    changeHeaders,
  }
}

export default useListData
