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
        <date-range-input v-model="settings.dateRange" />
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
        :agreements="agreements"
      />
      <app-filters
        id="additional-filters"
        v-model="additionalFilters"
        title="Дополнительный отбор"
        :agreements="agreements"
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
        :agreements="agreements"
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
import { useReportSettings } from './model/useReportSettings'

import { DateRangeInput } from '@/shared/ui'
import initDateRange from './initDateRange.js'

import AppGroupBySettings from './groupBySettings.vue'
import AppPivotTable from './pivotTable.vue'
import AppOrdersTable from './ordersTable.vue'
import AppFilters from './filters.vue'

export default {
  name: 'GrossProfitReport',
  components: {
    DateRangeInput,
    AppGroupBySettings,
    AppPivotTable,
    AppFilters,
    AppOrdersTable,
  },
  data() {},
  setup() {
    const {
      settings,
      groupItems,
      mainFilters,
      additionalFilters,
      pivotData,
      daysInRange,
      agreements,
      usePriceWithVat,
    } = useReportSettings()

    return {
      settings,
      groupItems,
      mainFilters,
      additionalFilters,
      pivotData,
      daysInRange,
      agreements,
      usePriceWithVat,
    }
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
  async mounted() {
    await this.getAgreements()
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
  methods: {},
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
