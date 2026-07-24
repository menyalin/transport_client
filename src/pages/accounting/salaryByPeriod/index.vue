<template>
  <EntityListWrapper>
    <ListSettingsWrapper>
      <app-drivers-salary-period v-model="period" />
      <v-select
        v-model="tks"
        :items="carrierStore.carriers"
        label="ТК"
        multiple
        item-title="name"
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
        item-title="fullName"
        hide-details
        auto-select-first
        clearable
        :style="{ maxWidth: '300px' }"
      />
      <v-autocomplete
        v-model="clients"
        :items="clientItems"
        label="Клиент"
        item-title="text"
        item-value="value"
        hide-details
        multiple
        :style="{ 'max-width': '250px' }"
      />
      <v-select
        v-model="consigneeType"
        :items="store.getters.partnerGroups"
        item-title="text"
        item-value="value"
        label="Тип грузополучателя"
        clearable
        hide-details
        :style="{ 'max-width': '250px' }"
      />
      <v-select
        v-model="orderType"
        :items="store.getters.orderAnalyticTypes"
        item-title="text"
        item-value="value"
        label="Тип рейса"
        clearable
        hide-details
        :style="{ 'max-width': '200px' }"
      />
      <v-btn color="primary" @click="downloadReportHandler"> Скачать в excel </v-btn>
    </ListSettingsWrapper>

    <DriverSalaryTable
      :items="items"
      :loading="isLoading"
      :driver="driver"
      v-model:options="listSettings"
      @chooseDriver="setDriver"
    />
  </EntityListWrapper>
</template>

<script setup>
import dayjs from 'dayjs'
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import AppDriversSalaryPeriod from '@/modules/accounting/components/driversSalaryPeriod/index.vue'
import { DriverSalaryTable } from '@/entities/driverSalary'
import { useDriversSalaryData } from './model'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'
import { usePersistedRef } from '@/shared/hooks'
import { ListSettingsWrapper, EntityListWrapper } from '@/shared/ui'

defineOptions({ name: 'DriversSalary' })

const store = useStore()
const carrierStore = useCarrierStore()

const tks = usePersistedRef([], 'salaryByPeriod:tks')
const driver = usePersistedRef(null, 'salaryByPeriod:driver')
const clients = usePersistedRef([], 'salaryByPeriod:clients')
const consigneeType = usePersistedRef(null, 'salaryByPeriod:consigneeType')
const orderType = usePersistedRef(null, 'salaryByPeriod:orderType')
const period = ref(new Date().toISOString())

const { items, isLoading, listSettings, downloadReportHandler } = useDriversSalaryData({
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

function setDriver(driverId) {
  driver.value = driverId
}
</script>
