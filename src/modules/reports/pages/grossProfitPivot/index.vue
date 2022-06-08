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
        id="group-settings"
        v-model="settings.groupBy"
        :items="groupItems"
      />
      <app-main-filters
        id="main-filters"
        v-model="mainFilters"
      />
    </div>
    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      striped
      rounded
    />
    <div
      v-else
      class="report-body"
    >
      <app-pivot-table
        :groupItems="groupItems"
        :groupBy="settings.groupBy"
        :pivotData="pivotData"
      />
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
import AppMainFilters from './mainFilters.vue'

export default {
  name: 'GrossProfitReport',
  components: {
    AppDateRange,
    AppGroupBySettings,
    AppPivotTable,
    AppMainFilters,
  },
  data() {
    return {
      pivotData: {},
      groupItems: [
        { text: 'Клиент', value: 'client', disabled: false },
        { text: 'ТК', value: 'tkName', disabled: false },
        { text: 'Регион', value: 'orderType', disabled: false },
        { text: 'ТС', value: 'truck', disabled: false },
        { text: 'Водитель', value: 'driver', disabled: false },
      ],
      settings: {
        dateRange: null,
        groupBy: 'client',
      },
      mainFilters: {
        clients: {
          values: [],
          cond: 'in',
        },
        tkNames: {
          values: [],
          cond: 'in',
        },
      },
      formName: 'grossProfitPivotReport',
      loading: false,
    }
  },
  watch: {
    settings: {
      deep: true,
      handler: function (val) {
        this.getData()
      },
    },
    mainFilters: {
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
    setPivotData(data) {
      this.pivotData = data
    },
    async getData() {
      try {
        this.loading = true
        const { pivot, list } = await ReportService.grossProfitPivot({
          dateRange: this.settings.dateRange,
          company: this.$store.getters.directoriesProfile,
          groupBy: this.settings.groupBy,
          mainFilters: this.mainFilters,
        })
        this.setPivotData(pivot)

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
  grid-template-columns: repeat(3, 1fr);
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
#group-settings {
  grid-column: 1/3;
  grid-row: 2;
}

#main-filters {
  grid-column: 2/3;
  grid-row: 1;
}
</style>
