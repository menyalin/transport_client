<template>
  <div id="wrapper">
    <div id="header">
      <h4>Валовая прибыль за период</h4>
    </div>
    <div id="settings">
      <div id="period-settings">
        <v-btn
          icon
          @click.stop="getData"
        >
          <v-icon> mdi-cached </v-icon>
        </v-btn>
        <app-date-range v-model="settings.dateRange" />
      </div>

      <app-group-by-settings
        v-model="settings.groupBy"
        :items="groupItems"
      />
    </div>
    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      striped
      rounded
    />
    <div class="report-body">
      <app-pivot-table />
      <div>Детализация с рейсами</div>
    </div>
  </div>
</template>

<script>
import AppDateRange from '@/modules/common/components/dateRange2'
import initDateRange from './initDateRange.js'
import ReportService from '../../services/index.js'
import AppGroupBySettings from './groupBySettings.vue'
import AppPivotTable from './pivotTable.vue'

export default {
  name: 'GrossProfitReport',
  components: {
    AppDateRange,
    AppGroupBySettings,
    AppPivotTable,
  },
  data() {
    return {
      groupItems: [
        { text: 'Клиент', value: 'client' },
        { text: 'ТК', value: 'tkName' },
        { text: 'Город/Регион', value: 'orderType' },
        { text: 'Грузовик', value: 'truck' },
        { text: 'Водитель', value: 'driver' },
      ],
      settings: {
        dateRange: null,
        groupBy: 'client',
      },
      formName: 'grossProfitPivotReport',
      loading: false,
    }
  },
  watch: {
    settings: {
      deep: true,
      handler: function (val) {
        console.log(val)
        // this.getData()
      },
    },
  },
  async created() {
    if (this.$store.getters.formSettingsMap.has(this.formName)) {
      this.settings = this.$store.getters.formSettingsMap.get(this.formName)
    } else {
      this.settings.dateRange = initDateRange()
    }
    await this.getData()
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('setFormSettings', {
      formName: this.formName,
      settings: this.settings,
    })
    next()
  },
  methods: {
    async getData() {
      try {
        this.loading = true
        // const { clients, totalCount, totalWithVat, totalWOVat } =
        //   await ReportService.grossProfit({
        //     dateRange: this.settings.dateRange,
        //     company: this.$store.getters.directoriesProfile,
        //   })
        // this.clients = clients
        // this.totalCount = totalCount
        // this.totalWithVat = totalWithVat
        // this.totalWOVat = totalWOVat
        this.loading = false
      } catch (e) {
        this.$store.commit('setError', e.message)
        this.loading = false
      }
    },
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
  display: grid;
  margin: 0 30px;
  gap: 10px;
}

#period-settings {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.report-body {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: start;
  width: 100%;
  gap: 10px;
}
</style>
