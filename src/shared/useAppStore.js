import { defineStore } from 'pinia'
import { computed } from 'vue'
import store from '@/store'

export const useAppStore = defineStore('AppStore', () => {
  const userCurrentProfile = computed(() => store.getters.directoriesProfile)
  return {
    userCurrentProfile,
  }
})
