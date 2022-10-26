import { ref, watch } from 'vue'
import SalaryTariffService from '../services/salaryTariff.service.js'
import dayjs from 'dayjs'

export const useDriversSalaryData = (period, driver) => {
  const items = ref([])
  const isLoading = ref(false)

  function getPeriod() {
    return [
      dayjs(period.value).startOf('month').toISOString(),
      dayjs(period.value).endOf('month').toISOString(),
    ]
  }

  async function getData() {
    isLoading.value = true
    items.value = await SalaryTariffService.getDriversSalaryByPeriod({
      period: getPeriod(),
      driver: driver.value,
    })
    isLoading.value = false
  }

  watch(
    [period, driver],
    async () => {
      if (period.value) await getData()
    },
    { deep: true, immediate: true }
  )

  return {
    items,
    isLoading,
  }
}
