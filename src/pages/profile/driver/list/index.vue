<template>
  <EntityListWrapper>
    <buttons-panel
      panel-type="list"
      :disabled-refresh="!directoriesProfile"
      :disabled-submit="!store.getters.hasPermission('driver:write')"
      @submit="createDriver"
      @refresh="refresh"
    />
    <ListSettingsWrapper>
      <app-table-column-settings
        v-model="activeHeaders"
        :allHeaders="allHeaders"
        :defaultHeaders="defaultHeaders"
        listSettingsName="driversTableColumns"
      />
      <v-select
        v-model="listSettings.tkNameFilter"
        hide-details
        label="ТК"
        clearable
        :items="carrierStore.carriers"
        item-value="_id"
        item-title="name"
      />
      <v-select
        v-model="listSettings.workState"
        hide-details
        label="Статус"
        :items="workStateItems"
      />
      <v-select
        v-model="listSettings.stuffStatus"
        hide-details
        label="Сотрудники"
        :items="stuffStatusItems"
      />
      <v-text-field v-model="listSettings.search" hide-details label="Быстрый поиск" />
    </ListSettingsWrapper>
    <v-data-table
      :search="listSettings.search"
      :headers="filteredHeaders"
      :items="filteredDrivers"
      fixed-header
      height="71vh"
      :items-per-page-options="[50, 100, 200]"
      v-model:options="listSettings.listOptions"
      :loading="loading"
      @dblclick:row="dblClickRow"
    >
      <template #[`item.hasScans`]="{ item }">
        <v-icon v-if="item.hasScans" size="small" color="green"> mdi-check </v-icon>
        <v-icon v-else size="small" color="red"> mdi-minus </v-icon>
      </template>
      <template #[`item.isCalcSalary`]="{ item }">
        <v-icon v-if="item.isCalcSalary" size="small" color="green"> mdi-check </v-icon>
        <v-icon v-else size="small" color="red"> mdi-minus </v-icon>
      </template>
    </v-data-table>
  </EntityListWrapper>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useDriverList } from './useDriverList'
import { ButtonsPanel, EntityListWrapper, ListSettingsWrapper } from '@/shared/ui'
import AppTableColumnSettings from '@/modules/common/components/tableColumnSettings/index.vue'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'

defineOptions({ name: 'DriverList' })

const router = useRouter()
const store = useStore()
const carrierStore = useCarrierStore()

const {
  allHeaders,
  stuffStatusItems,
  workStateItems,
  listSettings,
  loading,
  filteredDrivers,
  refresh,
  directoriesProfile,
} = useDriverList()

const activeHeaders = ref([])

const defaultHeaders = allHeaders.filter((i) => i.default).map((i) => i.value)

const filteredHeaders = computed(() => {
  return allHeaders.filter((i) => activeHeaders.value.includes(i.value))
})

onMounted(() => {
  const savedFields = JSON.parse(localStorage.getItem('driversTableColumns'))
  if (savedFields && savedFields.length > 0) {
    activeHeaders.value = savedFields
  } else {
    activeHeaders.value = defaultHeaders
  }
})

function createDriver() {
  router.push({ name: 'DriverCreate' })
}

function dblClickRow(_, { item }) {
  router.push(`drivers/${item._id}`)
}
</script>

<style scoped></style>
