<template>
  <EntityListWrapper>
    <buttons-panel
      panel-type="list"
      :disabled-submit="!hasPermission"
      @submit="create"
      @refresh="refresh"
    />
    <ListSettingsWrapper>
      <app-table-column-settings
        v-model="activeHeaders"
        :allHeaders="allHeaders"
        :listSettingsName="listSettingsName"
      />
      <v-text-field
        v-model="settings.date"
        type="date"
        hide-details
        label="Тарифы на дату"
        :style="{ 'max-width': '220px' }"
      />
      <v-select
        v-model="settings.tk"
        label="ТК"
        :items="carriers"
        item-title="name"
        item-value="_id"
        clearable
        hide-details
        :style="{ 'max-width': '220px' }"
      />
      <v-select
        v-model="settings.type"
        :items="salaryTariffTypes"
        item-title="text"
        item-value="value"
        clearable
        hide-details
        label="Тип тарифа"
        :style="{ 'max-width': '250px' }"
      />
      <v-select
        v-model="settings.liftCapacity"
        :items="liftCapacityTypes"
        item-title="text"
        item-value="value"
        clearable
        hide-details
        label="Грузоподъемность"
        :style="{ 'max-width': '180px' }"
      />
    </ListSettingsWrapper>

    <v-data-table-server
      :headers="headers"
      :items="filteredList"
      :loading="loading"
      height="73vh"
      fixed-header
      :items-length="count"
      :items-per-page-options="[50, 100, 200]"
      v-model:options="settings.listOptions"
      @dblclick:row="dblClickRow"
    >
      <template #[`item._result`]="{ item }">
        <app-zones-cell v-if="item.type === 'zones'" :item="item" />
        <app-regions-cell v-else-if="item.type === 'regions'" :item="item" />
        <app-waiting-cell v-else-if="item.type === 'waiting'" :item="item" />
        <app-return-cell v-else-if="item.type === 'return'" :item="item" />
        <div v-else>{{ item._result }}</div>
      </template>
    </v-data-table-server>
    <salary-tariff-form
      v-model="editableItem"
      :carrierItems="carriers"
      :dialog="dialog"
      @cancel="cancelDialog"
      @update="updateItem"
      @deletedItem="deletedItem"
    />
  </EntityListWrapper>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import { ButtonsPanel } from '@/shared/ui'
import AppTableColumnSettings from '@/modules/common/components/tableColumnSettings/index.vue'
import { SalaryTariffForm } from '@/entities/salary'
import AppZonesCell from '@/modules/accounting/components/salaryTariffGroupList/zones.vue'
import AppRegionsCell from '@/modules/accounting/components/salaryTariffGroupList/regions.vue'
import AppWaitingCell from '@/modules/accounting/components/salaryTariffGroupList/waiting.vue'
import AppReturnCell from '@/modules/accounting/components/salaryTariffGroupList/return.vue'

import { SalaryTariffService } from '@/shared/services'
import { useListColumnSetting, usePersistedRef } from '@/shared/hooks'
import { useAddressStore } from '@/entities/address'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'
import { ALL_LIST_HEADERS, DEFAULT_HEADERS } from './constants'
import { ListSettingsWrapper, EntityListWrapper } from '@/shared/ui'
defineOptions({ name: 'SalaryTariffList' })

const router = useRouter()
const store = useStore()
const carrierStore = useCarrierStore()
const addressStore = useAddressStore()

const { listSettingsName, activeHeaders, allHeaders, headers } = useListColumnSetting({
  listSettingsName: 'salaryTariffList:columns',
  defaultHeaders: DEFAULT_HEADERS,
  allHeaders: ALL_LIST_HEADERS,
})

const loading = ref(false)
const dialog = ref(false)
const editableItem = ref({})
const list = ref([])
const count = ref(0)

const settings = usePersistedRef(
  {
    type: null,
    date: null,
    tk: null,
    liftCapacity: null,
    listOptions: {
      page: 1,
      itemsPerPage: 50,
      sortBy: [],
      sortDesc: [],
    },
  },
  'salaryTariffList:settings'
)

const hasPermission = computed(() => store.getters.hasPermission('salaryTariff:write'))
const directoriesProfile = computed(() => store.getters.directoriesProfile)
const salaryTariffTypes = computed(() => store.getters.salaryTariffTypes)
const salaryTariffTypesMap = computed(() => store.getters.salaryTariffTypesMap)
const liftCapacityTypes = computed(() => store.getters.liftCapacityTypes)
const addressMap = computed(() => addressStore.addressMap)
const partnersMap = computed(() => store.getters.partnersMap)
const partnerGroupsMap = computed(() => store.getters.partnerGroupsMap)
const carriers = computed(() => carrierStore.carriers)
const carriersMap = computed(() => carrierStore.carriersMap)

function getResultStrByType(item) {
  switch (item.type) {
    case 'points': {
      const loadingAddr = addressMap.value.get(item.loading)
      const unloadingAddr = addressMap.value.get(item.unloading)
      const loadingStr = loadingAddr?.shortName || loadingAddr?.name
      const unloadingStr = unloadingAddr?.shortName || unloadingAddr?.name
      return loadingStr + '  >>>  ' + unloadingStr
    }
    case 'directDistanceZones': {
      const loadingAddr = addressMap.value.get(item.loading)
      const loadingStr = loadingAddr?.shortName || loadingAddr?.name
      return `Погрузка: ${loadingStr}, до ${item.maxDistance}км`
    }
    default:
      return '-'
  }
}

const filteredList = computed(() => {
  return list.value.map((item) => ({
    ...item,
    _type: salaryTariffTypesMap.value.get(item.type),
    _date: new Date(item.date).toLocaleDateString(),
    _result: getResultStrByType(item),
    _tks: item.tks.map((tkId) => carriersMap.value?.get(tkId)?.name).join(', '),
    _sum: Intl.NumberFormat().format(item.sum),
    _clients: item.clients?.map((client) => partnersMap.value.get(client)?.name).join(', '),
    _consigneeTypes: item.consigneeTypes
      ?.map((type) => partnerGroupsMap.value.get(type))
      .join(', '),
    _liftCapacity: item.liftCapacity.join(', '),
  }))
})

async function getData() {
  try {
    loading.value = true
    const { items, count: totalCount } = await SalaryTariffService.getList({
      company: directoriesProfile.value,
      date: settings.value.date,
      type: settings.value.type,
      tk: settings.value.tk,
      liftCapacity: settings.value.liftCapacity,
      skip: settings.value.listOptions.itemsPerPage * (settings.value.listOptions.page - 1),
      limit: settings.value.listOptions.itemsPerPage,
      sortBy: settings.value.listOptions.sortBy?.[0] || null,
      sortDesc: settings.value.listOptions.sortDesc?.[0] || null,
    })

    list.value = items || []
    count.value = totalCount || 0
  } catch (e) {
    console.log(e)
    store.commit('setError', e.message)
  } finally {
    loading.value = false
  }
}

function create() {
  router.push({ name: 'SalaryTariffCreate' })
}

async function refresh() {
  await getData()
}

function dblClickRow(_, { item }) {
  const cleanItem = list.value.find((i) => i._id === item._id)
  editableItem.value = { ...cleanItem }
  dialog.value = true
}

function cancelDialog() {
  dialog.value = false
}

async function deletedItem(id) {
  try {
    loading.value = true
    await SalaryTariffService.deleteById(id)
    list.value = list.value.filter((i) => i._id !== id)
    dialog.value = false
  } catch (e) {
    store.commit('setError', e.message)
  } finally {
    loading.value = false
  }
}

async function updateItem(item) {
  try {
    loading.value = true
    const updatedItem = await SalaryTariffService.updateOne({
      _id: item._id,
      body: item,
    })

    const idx = list.value.findIndex((i) => i._id === item._id)
    if (idx !== -1) list.value.splice(idx, 1, updatedItem)
    dialog.value = false
  } catch (e) {
    store.commit('setError', e.message)
  } finally {
    loading.value = false
  }
}

watch(settings, getData, { deep: true })
</script>

<style scoped>
.filter-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 15px;
}
</style>
