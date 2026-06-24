<template>
  <v-container fluid class="pa-3">
    <h4 class="mb-3">Валовая прибыль за период</h4>

    <v-row>
      <v-col cols="auto" class="d-flex flex-column ga-2">
        <div class="first-row-wrapper">
          <v-btn icon variant="text" @click.stop="getPivotData">
            <v-icon>mdi-cached</v-icon>
          </v-btn>
          <date-range-input v-model="settings.dateRange" />
          <v-checkbox v-model="usePriceWithVat" label="Цены с НДС" hide-details density="compact" />
          <v-checkbox
            v-model="showOutsourceCosts"
            label="Наемники"
            hide-details
            density="compact"
          />
          <v-checkbox v-model="withRound" label="Округление" hide-details density="compact" />
        </div>
        <app-group-by-settings v-model="settings.groupBy" :items="groupItems" />
      </v-col>

      <v-col>
        <app-filters v-model="mainFilters" title="Основной отбор" :agreements="agreements" />
      </v-col>

      <v-col>
        <app-filters
          v-model="additionalFilters"
          title="Дополнительный отбор"
          :agreements="agreements"
        />
      </v-col>
    </v-row>

    <v-progress-linear v-if="loading" indeterminate color="primary" striped rounded class="mt-3" />

    <div class="mt-3">
      <app-pivot-table
        :groupItems="groupItems"
        :groupBy="settings.groupBy"
        :pivotData="pivotData"
        @updateSelected="updateSelected"
        :daysCount="daysInRange"
        :agreements="agreements"
        :selectedGroups="selectedGroups"
        :showOutsourceCosts="showOutsourceCosts"
        :priceWithVat="usePriceWithVat"
        :withRound="withRound"
      />
    </div>
    <v-divider class="mt-3" />
    <div class="mt-3" style="width: 100%">
      <app-orders-table
        :mainFilters="mainFilters"
        :additionalFilters="additionalFilters"
        :priceWithVat="usePriceWithVat"
        :dateRange="settings.dateRange"
      />
    </div>
  </v-container>
</template>

<script setup>
import { useReportSettings } from './model/useReportSettings'
import { DateRangeInput } from '@/shared/ui'
import AppGroupBySettings from './groupBySettings.vue'
import AppPivotTable from './pivotTable.vue'
import AppOrdersTable from './ordersTable.vue'
import AppFilters from './filters.vue'
import usePersistedRef from '@/shared/hooks/usePersistedRef'

defineOptions({ name: 'GrossProfitReport' })

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
  loading,
  updateSelected,
  selectedGroups,
  getPivotData,
  withRound,
} = useReportSettings()
</script>
<style scoped>
.first-row-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 15px;
}
</style>
