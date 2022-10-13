<template>
  <div>
    <app-drivers-salary-period v-model="period" />
    period: {{ period }} <br />
    isLoading: {{ isLoading }} <br />
    drivers: {{ drivers }}
  </div>
</template>
<script>
import { ref } from 'vue'
import AppDriversSalaryPeriod from '../../components/driversSalaryPeriod/index.vue'
import { useDriversSalaryData } from '@/modules/accounting/hooks/useDriversSalaryData.js'

export default {
  name: 'DriversSalary',
  components: {
    AppDriversSalaryPeriod,
  },
  setup(_props, _ctx) {
    const period = ref(null)
    const { drivers, isLoading } = useDriversSalaryData(period)
    return {
      period,
      drivers,
      isLoading,
    }
  },
}
</script>
<style></style>
