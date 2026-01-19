<template>
  <div class="page-wrapper">
    <div class="filters-wrapper">
      <app-drivers-salary-period v-model="period" />
      <v-select
        v-model="tks"
        :items="carrierStore.carriers"
        label="ТК"
        dense
        multiple
        item-text="name"
        item-value="_id"
        clearable
        hide-details
        :style="{ 'max-width': '250px' }"
      />

      <v-autocomplete
        label="Водитель"
        v-model="driver"
        :items="drivers"
        item-value="_id"
        item-text="fullName"
        hide-details
        auto-select-first
        dense
        clearable
        :style="{ maxWidth: '300px' }"
      />
      <v-autocomplete
        v-model="clients"
        :items="clientItems"
        label="Клиент"
        dense
        hide-details
        multiple
        :style="{ 'max-width': '250px' }"
      />
      <v-select
        v-model="consigneeType"
        :items="$store.getters.partnerGroups"
        label="Тип грузополучателя"
        dense
        clearable
        hide-details
        :style="{ 'max-width': '250px' }"
      />
      <v-select
        v-model="orderType"
        :items="$store.getters.orderAnalyticTypes"
        label="Тип рейса"
        dense
        clearable
        hide-details
        :style="{ 'max-width': '200px' }"
      />
      <v-btn color="primary" @click="downloadReportHandler">
        Скачать в excel
      </v-btn>
    </div>

    <DriverSalaryTable
      :items="items"
      :loading="isLoading"
      :driver="driver"
      :setListSettings="setListSettings"
      @chooseDriver="setDriver"
    />
  </div>
</template>
<script>
import dayjs from 'dayjs'
import { computed, ref, watch } from 'vue'
import store from '@/store'
import AppDriversSalaryPeriod from '@/modules/accounting/components/driversSalaryPeriod/index.vue'

import { useDebouncedRef } from '@/modules/common/helpers/utils'
import { DriverSalaryTable } from '@/entities/driverSalary'
import { useDriversSalaryData } from './model'
import { useCarrierStore } from '@/entities/carrier'

const getInitialPeriod = (historyState) => {
  if (historyState.period) return historyState.period
  else return new Date().toISOString()
}

export default {
  name: 'DriversSalary',
  components: {
    AppDriversSalaryPeriod,
    DriverSalaryTable,
  },
  setup() {
    const carrierStore = useCarrierStore()
    const historyState = window.history.state
    const tks = ref(historyState.tks || [])
    const driver = ref(historyState.driver)
    const clients = ref(historyState.clients || [])
    const consigneeType = ref(historyState.consigneeType)
    const orderType = ref(historyState.orderType)
    const period = useDebouncedRef(getInitialPeriod(historyState), 500)

    const { items, isLoading, setListSettings, downloadReportHandler } =
      useDriversSalaryData({
        period,
        driver,
        clients,
        orderType,
        consigneeType,
        tks,
      })

    const drivers = computed(() => {
      const startPeriod = dayjs(period.value).startOf('month')
      const endPeriod = dayjs(period.value).endOf('month')
      return store.getters.drivers
        .filter((i) => !!i?.isCalcSalary)
        .filter(
          (i) =>
            (!i.dismissalDate || startPeriod.isBefore(i.dismissalDate)) &&
            (!i.employmentDate || endPeriod.isAfter(i.employmentDate))
        )
    })

    const clientItems = computed(() => {
      return store.getters.partners
        .filter((i) => i.isClient)
        .map((i) => ({ value: i._id, text: i.name }))
    })

    watch([period, driver, clients, consigneeType, orderType, tks], () => {
      window.history.pushState(
        {
          period: period.value,
          driver: driver.value,
          clients: clients.value,
          consigneeType: consigneeType.value,
          orderType: orderType.value,
          tks: tks.value,
        },
        ''
      )
    })

    addEventListener('popstate', (e) => {
      period.value = e.state.period
      driver.value = e.state.driver
      clients.value = e.state.clients
      orderType.value = e.state.orderType
      consigneeType.value = e.state.consigneeType
      tks.value = e.state.tks
    })

    function setDriver(driverId) {
      driver.value = driverId
    }

    return {
      carrierStore,
      period,
      items,
      isLoading,
      driver,
      clients,
      orderType,
      drivers,
      clientItems,
      setDriver,
      setListSettings,
      consigneeType,
      tks,
      downloadReportHandler,
    }
  },
}
</script>
<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  width: 100%;
}
.driver-mode {
  width: 100%;
}
.pivot-mode {
  min-width: 80%;
}
.filters-wrapper {
  padding-top: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 30px;
}
</style>
