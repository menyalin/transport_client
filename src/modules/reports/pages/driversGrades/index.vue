<template>
  <div id="wrapper">
    <div id="header">
      <h4>Оценки водителей</h4>
    </div>
    <div id="settings">
      <date-range-input v-model="dateRange" />
      <v-btn small color="primary" @click="getReportHandler">
        <v-icon left> mdi-download </v-icon> Скачать отчет
      </v-btn>
    </div>
    <div id="report-body">
      <v-progress-linear
        v-if="loading"
        indeterminate
        color="primary"
        striped
        rounded
      />
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import { DateRangeInput } from '@/shared/ui'
import initDateRange from './initDateRange.js'
import { ReportService } from '@/shared/services'
import store from '@/store'

export default {
  name: 'DriversGradesReport',
  components: {
    DateRangeInput,
  },
  props: {},
  setup() {
    const loading = ref(false)
    const dateRange = ref(initDateRange())

    async function getReportHandler() {
      try {
        loading.value = true
        await ReportService.getDriversGradesReportFile(dateRange.value)
        loading.value = false
      } catch (e) {
        loading.value = false
        store.commit('setError', e.message)
      }
    }
    return {
      dateRange,
      loading,
      getReportHandler,
    }
  },
}
</script>
<style scoped>
#wrapper {
  margin: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

#settings {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin: 0 30px;
  gap: 10px;
}
#report-body {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}
</style>
