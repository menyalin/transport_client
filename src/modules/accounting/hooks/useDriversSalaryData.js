import { ref, watch } from 'vue'
import SalaryTariffService from '../services/salaryTariff.service.js'
import dayjs from 'dayjs'

export const useDriversSalaryData = ({
  period,
  driver,
  client,
  consigneeType,
  orderType,
  tk,
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
  function setListSettings(newSettings) {
    listSettings.value = newSettings
  }

  async function getData() {
    isLoading.value = true
    items.value = []
    items.value = await SalaryTariffService.getDriversSalaryByPeriod({
      period: getPeriod(),
      driver: driver.value,
      client: client.value,
      consigneeType: consigneeType.value,
      orderType: orderType.value,
      options: listSettings.value,
      tk: tk.value,
    })
    isLoading.value = false
  }

  watch(
    [period, driver, client, consigneeType, orderType, tk],
    async () => {
      if (period.value) await getData()
    },
    { deep: true, immediate: true }
  )

  return {
    items,
    isLoading,
    setListSettings,
  }
}
