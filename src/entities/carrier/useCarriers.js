import { getCurrentInstance, computed } from 'vue'

export const useCarriers = () => {
  const { proxy } = getCurrentInstance()
  const ownCarriers = computed(() =>
    proxy.$store.getters.tkNames.filter((i) => !i.outsource)
  )
  return {
    ownCarriers,
  }
}
