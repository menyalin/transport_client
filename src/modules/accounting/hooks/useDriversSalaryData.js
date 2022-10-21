import { ref, watch } from 'vue'
import SalaryTariffService from '../services/salaryTariff.service.js'

export const useDriversSalaryData = (period) => {
  const items = ref([])
  const isLoading = ref(false)

  async function getData() {
    isLoading.value = true
    items.value = await SalaryTariffService.getDriversSalaryByPeriod({
      period: period.value,
    })
    isLoading.value = false
  }

  watch(period, async () => {
    await getData()
  })

  return {
    items,
    isLoading,
  }
}
