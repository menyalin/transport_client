<template>
  <div id="wrapper">
    <div id="header">
      <h4>Валовая прибыль за период</h4>
    </div>
    <div id="settings">
      <v-btn icon @click.stop="getData">
        <v-icon> mdi-cached </v-icon>
      </v-btn>
      <app-date-range v-model="settings.dateRange" />
    </div>
    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      striped
      rounded
    />
    <v-container v-else-if="totalCount">
      <v-row>
        <v-col>
          <app-report-summary
            :ordersCount="totalCount"
            :totalPrice="totalWithVat"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <app-client-block
            v-for="client in clients"
            :key="client._id"
            :clientId="client._id"
            :orders="client.orders"
            :totalCount="client.totalCount"
            :totalWOVat="client.totalWOVat"
            :totalWithVat="client.totalWithVat"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import AppDateRange from '@/modules/common/components/dateRange2'
import AppReportSummary from './reportSummary'
import AppClientBlock from './clientBlock'
import initDateRange from './initDateRange.js'
import ReportService from '../../services/index.js'

export default {
  name: 'GrossProfitReport',
  components: {
    AppDateRange,
    AppReportSummary,
    AppClientBlock,
  },
  data() {
    return {
      settings: {
        dateRange: null,
      },
      formName: 'grossProfitReport',
      loading: false,
      clients: [],
      totalCount: null,
      totalWithVat: null,
      totalWOVat: null,
    }
  },
  watch: {
    settings: {
      deep: true,
      handler: function () {
        this.getData()
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
        const { clients, totalCount, totalWithVat, totalWOVat } =
          await ReportService.grossProfit({
            dateRange: this.settings.dateRange,
            company: this.$store.getters.directoriesProfile,
          })
        this.clients = clients
        this.totalCount = totalCount
        this.totalWithVat = totalWithVat
        this.totalWOVat = totalWOVat
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
  align-items: start;
  width: 100%;
}
</style>
