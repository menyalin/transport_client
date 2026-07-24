import { ref, watch } from 'vue'
import SalaryTariffService from '@/shared/services/salaryTariff/salaryTariff.service.js'
import dayjs from 'dayjs'

export const useDriversSalaryData = ({
  period,
  driver,
  clients,
  consigneeType,
  orderType,
  tks,
}) => {
  const items = ref([])
  const isLoading = ref(false)
  const listSettings = ref({})

  function getPeriod() {
    return [
      dayjs(period.value).startOf('month').toISOString(),
      dayjs(period.value).endOf('month').toISOString(),
    ]
  }

  async function getData() {
    isLoading.value = true
    try {
      const result = await SalaryTariffService.getDriversSalaryByPeriod({
        period: getPeriod(),
        driver: driver.value,
        clients: clients.value,
        consigneeType: consigneeType.value,
        orderType: orderType.value,
        options: listSettings.value,
        tks: tks.value,
      })
      items.value = result || []
    } catch (e) {
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }

  watch(
    [period, driver, clients, consigneeType, orderType, tks, listSettings],
    async () => {
      if (period.value) await getData()
    },
    { deep: true, immediate: true }
  )

  async function downloadReportHandler() {
    try {
      isLoading.value = true
      await SalaryTariffService.getDriverSalaryByPeriodReport({
        period: getPeriod(),
      })
    } finally {
      isLoading.value = false
    }
  }

  return {
    items,
    isLoading,
    listSettings,
    downloadReportHandler,
  }
}
