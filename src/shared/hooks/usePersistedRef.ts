import { ref, watch, type Ref } from 'vue'

export default function usePersistedRef<T = any>(initialState: T, key: string): Ref<T> {
  if (!key) throw new Error('persisted ref state key is missing')
  const savedRef = sessionStorage.getItem(key)

  const state = ref(savedRef ? JSON.parse(savedRef) : initialState) as Ref<T>
  watch(state, (val) => sessionStorage.setItem(key, JSON.stringify(val)), {
    deep: true,
  })

  return state
}
