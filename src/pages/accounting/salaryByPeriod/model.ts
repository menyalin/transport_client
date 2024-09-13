//@ts-nocheck
import dayjs from 'dayjs'
import { ref, watch } from 'vue'

import SalaryTariffService from '@/shared/services/salaryTariff/salaryTariff.service'

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
  function setListSettings(newSettings) {
    listSettings.value = newSettings
  }

  async function getData() {
    isLoading.value = true
    items.value = []
    items.value = await SalaryTariffService.getDriversSalaryByPeriod({
      period: getPeriod(),
      driver: driver.value,
      clients: clients.value,
      consigneeType: consigneeType.value,
      orderType: orderType.value,
      options: listSettings.value,
      tks: tks.value,
    })
    isLoading.value = false
  }

  watch(
    [period, driver, clients, consigneeType, orderType, tks],
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
    setListSettings,
    downloadReportHandler,
  }
}
