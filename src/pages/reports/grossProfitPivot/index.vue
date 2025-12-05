<template>
  <div id="wrapper">
    <div id="header">
      <h4>Валовая прибыль за период</h4>
    </div>
    <div id="settings">
      <div id="period-settings">
        <v-btn icon @click.stop="getPivotData">
          <v-icon>mdi-cached</v-icon>
        </v-btn>
        <DateRangeInput :modelValue="settings.dateRange" />
        <v-checkbox v-model="usePriceWithVat" label="Цены с НДС" hideDetails class="ml-3" />
        <v-checkbox v-model="showOutsourceCosts" label="Наемники" hideDetails class="ml-3" />
        <v-checkbox v-model="withRound" label="Округление" hideDetails class="ml-3" />
      </div>

      <AppGroupBySettings id="group-settings" :modelValue="settings.groupBy" :items="groupItems" />
      <AppFilters id="main-filters" v-model="mainFilters" title="Основной отбор" :agreements="agreements" />
      <AppFilters
        id="additional-filters"
        v-model="additionalFilters"
        title="Дополнительный отбор"
        :agreements="agreements"
      />
    </div>
    <v-progress-linear v-if="loading" indeterminate color="primary"
striped rounded />
    <div class="report-body">
      <AppPivotTable
        :groupItems="groupItems"
        :groupBy="settings.groupBy"
        :pivotData="pivotData"
        :daysCount="daysInRange"
        :agreements="agreements"
        :selectedGroups="selectedGroups"
        :showOutsourceCosts="showOutsourceCosts"
        :priceWithVat="usePriceWithVat"
        :withRound="withRound"
        @updateSelected="updateSelected"
      />
      <v-divider />
      <AppOrdersTable
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
import AppGroupBySettings from './groupBySettings.vue'
import AppPivotTable from './pivotTable.vue'
import AppOrdersTable from './ordersTable.vue'
import AppFilters from './filters.vue'
import usePersistedRef from '@/shared/hooks/usePersistedRef'

export default {
  name: 'GrossProfitReport',
  components: {
    DateRangeInput,
    AppGroupBySettings,
    AppPivotTable,
    AppFilters,
    AppOrdersTable,
  },
  setup() {
    const showOutsourceCosts = usePersistedRef(false, 'grossProfitPivot:showOutsourceCosts')
    const {
      settings,
      groupItems,
      mainFilters,
      additionalFilters,
      pivotData,
      daysInRange,
      agreements,
      usePriceWithVat,
      getData,
      loading,
      updateSelected,
      selectedGroups,
      getPivotData,
      withRound,
    } = useReportSettings()

    return {
      showOutsourceCosts,
      settings,
      groupItems,
      mainFilters,
      additionalFilters,
      pivotData,
      daysInRange,
      agreements,
      usePriceWithVat,
      getData,
      loading,
      updateSelected,
      selectedGroups,
      getPivotData,
      withRound,
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
