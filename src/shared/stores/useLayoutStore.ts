import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLayoutStore = defineStore('layout', () => {
  const isLeftNavCollapsed = ref(false)

  const toggleLeftNav = () => {
    isLeftNavCollapsed.value = !isLeftNavCollapsed.value
  }

  const setLeftNavCollapsed = (value: boolean) => {
    isLeftNavCollapsed.value = value
  }

  return {
    isLeftNavCollapsed,
    toggleLeftNav,
    setLeftNavCollapsed,
  }
})
