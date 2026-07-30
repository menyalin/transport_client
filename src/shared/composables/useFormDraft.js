import { ref, watch, onMounted } from 'vue'

/**
 * Сохраняет/восстанавливает черновик формы в sessionStorage.
 *
 * @param {Object} options
 * @param {string} options.key
 * @param {import('vue').Ref} options.state
 * @param {import('vue').Ref<boolean>} [options.enabled]
 * @returns {{ clearDraft: () => void }}
 */
export function useFormDraft({ key, state, enabled = ref(true) }) {
  if (!key) throw new Error('form draft key is required')

  function saveDraft() {
    if (!enabled.value) return
    sessionStorage.setItem(key, JSON.stringify(state.value))
  }

  function loadDraft() {
    if (!enabled.value) return
    const saved = sessionStorage.getItem(key)
    if (!saved) return
    try {
      state.value = JSON.parse(saved)
    } catch {
      sessionStorage.removeItem(key)
    }
  }

  function clearDraft() {
    sessionStorage.removeItem(key)
  }

  onMounted(() => {
    loadDraft()
  })

  watch(
    state,
    () => {
      saveDraft()
    },
    { deep: true }
  )

  return { clearDraft }
}
