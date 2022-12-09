<template>
  <div id="wrapper">
    <div id="header">
      <h4>Валовая прибыль за период</h4>
    </div>
    <div id="settings">
      <div id="period-settings">
        <v-btn icon @click.stop="getData">
          <v-icon> mdi-cached </v-icon>
        </v-btn>
        <app-date-range v-model="settings.dateRange" />
        <v-checkbox
          v-model="usePriceWithVat"
          label="Цены с НДС"
          hide-details
          class="ml-3"
        />
      </div>

      <app-group-by-settings
        id="group-settings"
        v-model="settings.groupBy"
        :items="groupItems"
      />
      <app-filters
        id="main-filters"
        v-model="mainFilters"
        title="Основной отбор"
      />
      <app-filters
        id="additional-filters"
        v-model="additionalFilters"
        title="Дополнительный отбор"
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
      <app-pivot-table
        :groupItems="groupItems"
        :groupBy="settings.groupBy"
        :pivotData="pivotData"
        :priceWithVat="usePriceWithVat"
        @updateSelected="updateSelected"
        :daysCount="daysInRange"
      />
      <v-divider />
      <app-orders-table
        :mainFilters="mainFilters"
        :additionalFilters="additionalFilters"
        :priceWithVat="usePriceWithVat"
        :dateRange="settings.dateRange"
      />
    </div>
  </div>
</template>

<script>
import AppDateRange from '@/modules/common/components/dateRange2'
import initDateRange from './initDateRange.js'
import ReportService from '../../services/index.js'
import AppGroupBySettings from './groupBySettings.vue'
import AppPivotTable from './pivotTable.vue'
import AppOrdersTable from './ordersTable.vue'
import AppFilters from './filters.vue'

import {
  ADDITIONAL_FILTER_LIST,
  MAIN_FILTER_LIST,
  GROUP_BY_ITEMS,
} from './constants.js'

export default {
  name: 'GrossProfitReport',
  components: {
    AppDateRange,
    AppGroupBySettings,
    AppPivotTable,
    AppFilters,
    AppOrdersTable,
  },
  data() {
    return {
      loading: false,
      formName: 'grossProfitPivotReport',
      pivotData: {},
      groupItems: GROUP_BY_ITEMS,
      usePriceWithVat: true,
      settings: {
        dateRange: null,
        groupBy: 'client',
      },
      mainFilters: MAIN_FILTER_LIST,
      additionalFilters: ADDITIONAL_FILTER_LIST,
    }
  },
  computed: {
    daysInRange() {
      console.log(this.settings.dateRange)
      const start = new Date(this.settings.dateRange[0])
      const end = new Date(this.settings.dateRange[1])
      return Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    },
  },
  watch: {
    settings: {
      deep: true,
      handler: function () {
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
      const { settings, usePriceWithVat } =
        this.$store.getters.formSettingsMap.get(this.formName)
      this.settings = settings
      this.usePriceWithVat = usePriceWithVat
    } else {
      this.settings.dateRange = initDateRange()
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('setFormSettings', {
      formName: this.formName,
      settings: {
        settings: this.settings,
        usePriceWithVat: this.usePriceWithVat,
      },
    })
    next()
  },
  methods: {
    updateSelected(val) {
      const groupItem = GROUP_BY_ITEMS.find(
        (i) => i.value === this.settings.groupBy
      )
      this.additionalFilters[groupItem.filterName] = {
        values: val,
        cond: 'in',
      }
    },
    async getData() {
      try {
        this.loading = true
        const { pivot } = await ReportService.grossProfitPivot({
          dateRange: this.settings.dateRange,
          company: this.$store.getters.directoriesProfile,
          groupBy: this.settings.groupBy,
          mainFilters: this.mainFilters,
        })
        this.pivotData = pivot
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
  align-items: flex-start;
  width: 100%;
  gap: 10px;
}
#group-settings {
  grid-column: 1/2;
  grid-row: 2;
}

#main-filters {
  grid-column: 2/2;
  grid-row: 1/5;
}
#additional-filters {
  grid-column: 3/3;
  grid-row: 1/5;
}
</style>
