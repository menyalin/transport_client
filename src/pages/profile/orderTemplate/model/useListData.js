import {computed} from 'vue'
import store from '@/store'



export const useListData = () => {
  const items = computed(() => {
    return store.getters.orderTemplates
  })  
  return {
        items
    }
}

