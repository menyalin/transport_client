<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <buttons-panel
          panel-type="list"
          :disabledSubmit="!$store.getters.hasPermission('crew:write')"
          @submit="createHandler"
          @refresh="refreshHandler"
        >
          <v-btn color="primary" @click="downloadHandler">
            <v-icon>mdi-download</v-icon>
            Скачать отчет
          </v-btn>
        </buttons-panel>
        <div class="filters">
          <date-range-input
            v-model="settings.period"
            class="mx-3"
            :style="{ 'max-width': '300px' }"
          />
          <v-autocomplete
            v-model="settings.tkName"
            dense
            outlined
            hide-details
            auto-select-first
            label="ТК"
            clearable
            :items="carrierItems"
            item-value="_id"
            item-text="name"
          />

          <v-select
            v-model="settings.crewStatus"
            dense
            :items="crewStatuses"
            outlined
            hide-details
            label="Состояние экипажа"
          />
          <v-autocomplete
            v-model="settings.driver"
            dense
            clearable
            auto-select-first
            :items="driverItems"
            outlined
            hide-details
            label="Водитель"
          />
          <v-autocomplete
            v-model="settings.truck"
            dense
            clearable
            auto-select-first
            :items="truckItems"
            outlined
            hide-details
            label="Грузовик"
          />
        </div>
        <v-data-table
          :headers="headers"
          :items="items"
          height="72vh"
          fixed-header
          :loading="loading"
          :serverItemsLength="totalCount"
          :footer-props="{
            'items-per-page-options': [50, 100, 200],
          }"
          :options.sync="listOptions"
          dense
          @dblclick:row="dblClickRowHandler"
        >
          <template #[`item.tkName`]="{ item }">
            {{ getCarrierName(item.tkName) }}
          </template>
          <template #[`item.startDate`]="{ item }">
            {{ new Date(item.startDate).toLocaleString() }}
          </template>
          <template #[`item.endDate`]="{ item }">
            {{ item.endDate ? new Date(item.endDate).toLocaleString() : null }}
          </template>
          <template #[`item.driver`]="{ item }">
            {{ getDriverName(item) }}
          </template>
          <template #[`item.truck`]="{ item }">
            {{ getTruckName(item, 'truck') }}
          </template>
          <template #[`item.trailer`]="{ item }">
            {{ getTruckName(item, 'trailer') }}
          </template>
          <template #[`item.isActual`]="{ item }">
            <v-icon>
              {{ isActualCrew(item) ? 'mdi-check' : 'mdi-minus' }}
            </v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { ButtonsPanel, DateRangeInput } from '@/shared/ui'

import { useListData } from './useListData'

export default {
  name: 'CrewList',
  components: {
    ButtonsPanel,
    DateRangeInput,
  },
  setup() {
    const {
      settings,
      listOptions,
      crewStatuses,
      loading,
      items,
      headers,
      totalCount,
      createHandler,
      refreshHandler,
      getCarrierName,
      dblClickRowHandler,
      downloadHandler,
      carrierItems,
      driverItems,
      truckItems,
      getTruckName,
      getDriverName,
      isActualCrew,
    } = useListData()

    return {
      settings,
      listOptions,
      crewStatuses,
      loading,
      items,
      headers,
      totalCount,
      createHandler,
      refreshHandler,
      getCarrierName,
      dblClickRowHandler,
      downloadHandler,
      carrierItems,
      driverItems,
      truckItems,
      getTruckName,
      getDriverName,
      isActualCrew,
    }
  },
}
</script>
<style>
.filters {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 15px;
}
</style>
