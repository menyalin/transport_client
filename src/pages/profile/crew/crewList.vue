<template>
  <EntityListWrapper>
    <ButtonsPanel
      panel-type="list"
      :disabledSubmit="!canWrite"
      @submit="createHandler"
      @refresh="refreshHandler"
    >
      <v-btn color="primary" prepend-icon="mdi-download" @click="downloadHandler">
        Скачать отчет
      </v-btn>
    </ButtonsPanel>
    <ListSettingsWrapper>
      <DateRangeInput v-model="settings.period" class="mx-3" :style="{ 'max-width': '300px' }" />
      <v-autocomplete
        v-model="settings.tkName"
        hide-details
        label="ТК"
        :items="carrierItems"
        item-value="_id"
        item-title="name"
      />

      <v-select
        v-model="settings.crewStatus"
        :items="crewStatuses"
        hide-details
        label="Состояние экипажа"
      />
      <v-autocomplete
        v-model="settings.driver"
        :items="driverItems"
        hide-details
        label="Водитель"
      />
      <v-autocomplete v-model="settings.truck" :items="truckItems" hide-details label="Грузовик" />
    </ListSettingsWrapper>
    <v-data-table-server
      :headers="headers"
      :items="items"
      height="72vh"
      fixed-header
      :loading="loading"
      :items-length="totalCount"
      :items-per-page-options="[50, 100, 200]"
      v-model:options="listOptions"
      @dblclick:row="dblClickRowHandler"
    >
      <template #[`item.tkName`]="{ item }">
        {{ item.carrierName }}
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
    </v-data-table-server>
  </EntityListWrapper>
</template>
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { ButtonsPanel, DateRangeInput, EntityListWrapper, ListSettingsWrapper } from '@/shared/ui'
import { useListData } from './useListData'

defineOptions({ name: 'CrewList' })

const store = useStore()

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
  dblClickRowHandler,
  downloadHandler,
  carrierItems,
  driverItems,
  truckItems,
  getTruckName,
  getDriverName,
  isActualCrew,
} = useListData()

const canWrite = computed(() => store.getters.hasPermission('crew:write'))
</script>
<style scoped>
.filters {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 15px;
}
</style>
