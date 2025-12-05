<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <ButtonsPanel
          panelType="list"
          :disabledSubmit="!$store.getters.hasPermission('crew:write')"
          @submit="createHandler"
          @refresh="refreshHandler"
        >
          <v-btn color="primary" @click="downloadHandler">
            <v-icon>mdi-download</v-icon>
            Скачать отчет
          </v-btn>
        </ButtonsPanel>
        <div class="filters">
          <DateRangeInput :modelValue="settings.period" class="mx-3" :style="{ 'max-width': '300px' }" />
          <v-autocomplete
            :modelValue="settings.tkName"
           
            variant="outlined"
       density="compact"
            hideDetails
            autoSelectFirst
            label="ТК"
            clearable
            :items="carrierItems"
            itemValue="_id"
            itemTitle="name"
          />

          <v-select
            :modelValue="settings.crewStatus"
           
            :items="crewStatuses"
            variant="outlined"
       density="compact"
            hideDetails
            label="Состояние экипажа"
          />
          <v-autocomplete
            :modelValue="settings.driver"
           
            clearable
            autoSelectFirst
            :items="driverItems"
            variant="outlined"
       density="compact"
            hideDetails
            label="Водитель"
          />
          <v-autocomplete
            :modelValue="settings.truck"
           
            clearable
            autoSelectFirst
            :items="truckItems"
            variant="outlined"
       density="compact"
            hideDetails
            label="Грузовик"
          />
        </div>
        <v-data-table
          v-model:options="listOptions"
          :headers="headers"
          :items="items"
          height="72vh"
          fixedHeader
          :loading="loading"
          :itemsLength="totalCount"
          :footerProps="{
            'items-per-page-options': [50, 100, 200],
          }"
         
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
