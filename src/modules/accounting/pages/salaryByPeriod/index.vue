<template>
  <div class="page-wrapper">
    <div class="filters-wrapper">
      <app-drivers-salary-period v-model="period" />
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
      <app-partners-autocomplete
        v-model="client"
        label="Клиент"
        dense
        hide-details
        hideappend
        onlyClients
        hideAppendIcon
      />
    </div>

    <app-drivers-salary-table
      :class="!!driver ? 'driver-mode' : 'pivot-mode'"
      :items="items"
      :loading="isLoading"
      :driver="driver"
      :setListSettings="setListSettings"
      @chooseDriver="setDriver"
    />
  </div>
</template>
<script>
import { computed, ref, watch } from 'vue'
import store from '@/store'
import AppDriversSalaryPeriod from '../../components/driversSalaryPeriod/index.vue'
import AppDriversSalaryTable from '../../components/driversSalaryTable/index.vue'
import AppPartnersAutocomplete from '@/modules/common/components/partnerAutocomplete'
import { useDriversSalaryData } from '@/modules/accounting/hooks/useDriversSalaryData.js'
import { useDebouncedRef } from '@/modules/common/helpers/utils'

const getInitialPeriod = (historyState) => {
  if (historyState.period) return historyState.period
  else return new Date().toISOString()
}

export default {
  name: 'DriversSalary',
  components: {
    AppDriversSalaryPeriod,
    AppDriversSalaryTable,
    AppPartnersAutocomplete,
  },
  setup(_props, _ctx) {
    const historyState = window.history.state
    const driver = ref(historyState.driver)
    const client = ref(historyState.client)
    const period = useDebouncedRef(getInitialPeriod(historyState), 500)
    const drivers = computed(() => {
      return store.getters.drivers.filter((i) => i.isCalcSalary)
    })

    const { items, isLoading, setListSettings } = useDriversSalaryData({
      period,
      driver,
      client,
    })

    watch([period, driver], () => {
      window.history.pushState(
        {
          period: period.value,
          driver: driver.value,
          client: client.value,
        },
        ''
      )
    })

    addEventListener('popstate', (e) => {
      period.value = e.state.period
      driver.value = e.state.driver
      client.value = e.state.client
    })

    function setDriver(driverId) {
      driver.value = driverId
    }

    return {
      period,
      items,
      isLoading,
      driver,
      client,
      drivers,
      setDriver,
      setListSettings,
    }
  },
}
</script>
<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 50%;
  padding: 20px;
}
.driver-mode {
  width: 100%;
}

.pivot-mode {
  min-width: 50%;
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
