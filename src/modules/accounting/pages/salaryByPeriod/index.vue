<template>
  <div class="page-wrapper">
    <app-drivers-salary-period v-model="period" />
    <app-drivers-salary-table :items="items" :loading="isLoading" />
  </div>
</template>
<script>
import AppDriversSalaryPeriod from '../../components/driversSalaryPeriod/index.vue'
import AppDriversSalaryTable from '../../components/driversSalaryTable/index.vue'
import { useDriversSalaryData } from '@/modules/accounting/hooks/useDriversSalaryData.js'
import { useDebouncedRef } from '@/modules/common/helpers/utils'

export default {
  name: 'DriversSalary',
  components: {
    AppDriversSalaryPeriod,
    AppDriversSalaryTable,
  },
  setup(_props, _ctx) {
    const period = useDebouncedRef(null, 500)
    const { items, isLoading } = useDriversSalaryData(period)
    return {
      period,
      items,
      isLoading,
    }
  },
}
</script>
<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 85%;
  padding: 20px;
}
</style>
