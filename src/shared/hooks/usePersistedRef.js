import { ref, watch } from 'vue'

export default function usePersistedRef(initialState, key) {
  if (!key) throw new Error('persisted ref state key is missing')
  const savedRef = sessionStorage.getItem(key)

  const state = ref(savedRef ? JSON.parse(savedRef) : initialState)
  watch(state, val => sessionStorage.setItem(key, JSON.stringify(val)), {
    deep: true,
  })

  return state
}
