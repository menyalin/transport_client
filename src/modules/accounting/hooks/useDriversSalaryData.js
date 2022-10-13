import { ref, watch } from 'vue'
import { debounce } from '@/modules/common/helpers/utils.js'

export const useDriversSalaryData = (period) => {
  const drivers = ref([])
  const isLoading = ref(false)

  function getData() {
    console.log(period)
  }

  watch(period, debounce(getData, 500))
  return {
    drivers,
    isLoading,
  }
}
