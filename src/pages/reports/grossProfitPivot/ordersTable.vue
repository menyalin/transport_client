<template>
  <div class="table-wrapper">
    <div>
      <v-btn color="primary" :loading="loading" :disabled="loading" @click="getData">
        Получить детальные записи
      </v-btn>
    </div>

    <v-data-table-server
      checkbox-color="primary"
      :headers="filteredHeaders"
      :items="preparedItems"
      :items-length="totalCount"
      :loading="loading"
      v-model:options="listOptions"
      :items-per-page="50"
      :items-per-page-options="[50, 100, 200]"
      @dblclick:row="dblClickRow"
    >
      <template #top>
        <div class="settings-wrapper">
          <AppTableColumnSettings
            v-model="activeHeaders"
            :allHeaders="allHeaders"
            :listSettingsName="listSettingsName"
          />
        </div>
      </template>
    </v-data-table-server>
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useOrderStore } from '@/entities/order/orderStore'
import { useRouter } from 'vue-router'
import { ALL_ORDER_TABLE_HEADERS } from './model/constants.js'
import AppTableColumnSettings from '@/shared/ui/tableColumnSettings/tableColumnSettings.vue'
import usePersistedRef from '@/shared/hooks/usePersistedRef'
import { ReportService } from '@/shared/services'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'
import { useAddressStore } from '@/entities/address'
import { sortingAdapterForOldApi } from '@/shared/utils/migrationUtils.js'

defineOptions({ name: 'OrdersTable' })

const props = defineProps({
  mainFilters: Object,
  additionalFilters: Object,
  dateRange: { type: Array, required: true },
  priceWithVat: Boolean,
})

const store = useStore()
const orderStore = useOrderStore()
const router = useRouter()
const carrierStore = useCarrierStore()
const addressStore = useAddressStore()

const listOptions = usePersistedRef({}, 'orders_table_list_options')

const loading = ref(false)
const items = ref([])
const totalCount = ref(0)

const listSettingsName = 'ordersDetailReportFields'
// const settings = usePersistedRef({}, listSettingsName)
// const defaultHeaders = DEFAULT_HEADERS
const activeHeaders = ref([])
const allHeaders = ALL_ORDER_TABLE_HEADERS

function getBasePrice(order, type, withVat) {
  if (!['prices', 'prePrices'].includes(type))
    throw new Error('ordersTable : getBasePrice : price type error!!!')

  const price = order[type]
  if (!price?.base) return 0

  return Intl.NumberFormat().format(Math.round(price.base[withVat ? 'price' : 'priceWOVat']))
}

const filteredHeaders = computed(() =>
  allHeaders.filter((i) => activeHeaders.value.includes(i.value))
)

const preparedItems = computed(() => {
  if (!Array.isArray(items.value)) return []
  return items.value.map((i) => ({
    ...i,
    status: orderStore.orderStatusesMap.get(i.status),
    orderDate: new Date(i.orderDate).toLocaleString(),
    client: store.getters.partnersMap.get(i.client)?.name || '-',
    truck: store.getters.trucksMap.get(i.truckId)?.regNum || '-',
    driver: store.getters.driversMap.get(i.driverId)?.fullName || '-',
    carrierId: carrierStore.carriersMap.get(i.carrierId)?.name || '-',
    orderType: orderStore.orderAnalyticTypesMap.get(i.orderType),
    addressesLoading: i.loadingAddressIds
      ?.map((a) => addressStore.addressMap.get(a)?.shortName)
      .join(', '),
    addressesUnloading: i.unloadingAddressIds
      ?.map((a) => addressStore.addressMap.get(a)?.shortName)
      .join(', '),
    regionsLoading: i.loadingRegions?.map((r) => store.getters.regionsMap.get(r)?.name).join(', '),
    regionsUnloading: i.unloadingRegions
      ?.map((r) => store.getters.regionsMap.get(r)?.name)
      .join(', '),
    zonesLoading: i.loadingZones?.map((r) => store.getters.zonesMap.get(r)?.name).join(', '),
    zonesUnloading: i.unloadingZones?.map((r) => store.getters.zonesMap.get(r)?.name).join(', '),
    citiesLoading: i.loadingCities?.map((r) => store.getters.citiesMap.get(r)?.name).join(', '),
    citiesUnloading: i.unloadingCities?.map((r) => store.getters.citiesMap.get(r)?.name).join(', '),
    capacityType: i.capacityType,
    truckKind: store.getters.truckKindsMap.get(i.truckKind),
    outsourceCostsWithVat: Intl.NumberFormat().format(i.outsourceCostsWithVat),
    outsourceCostsWOVat: Intl.NumberFormat().format(i.outsourceCostsWOVat),
    basePrePrice: getBasePrice(i, 'prePrices', props.priceWithVat),
    basePrice: getBasePrice(i, 'prices', props.priceWithVat),
    price: Intl.NumberFormat().format(
      Math.round(i[props.priceWithVat ? 'totalWithVat' : 'totalWOVat'])
    ),
    kPrice: Intl.NumberFormat().format(
      Math.round(i[props.priceWithVat ? 'totalWithVat' : 'totalWOVat'] / 1000)
    ),
  }))
})

watch(
  () => props.dateRange,
  () => {
    clearItems()
    getData()
  },
  { deep: true }
)

watch(
  () => props.mainFilters,
  () => {
    clearItems()
    getData()
  },
  { deep: true }
)

watch(
  () => props.additionalFilters,
  () => {
    listOptions.value = { ...listOptions.value, page: 1 }
  },
  { deep: true }
)

watch(
  listOptions,
  () => {
    getData()
  },
  { deep: true }
)

function clearItems() {
  items.value = []
  totalCount.value = 0
}

async function getData() {
  try {
    loading.value = true
    const result = await ReportService.grossProfitDetailsData({
      company: store.getters.directoriesProfile,
      dateRange: props.dateRange,
      mainFilters: props.mainFilters,
      additionalFilters: props.additionalFilters,
      listOptions: {
        ...listOptions.value,
        priceWithVat: props.priceWithVat,
        sortBy: sortingAdapterForOldApi(listOptions.value.sortBy).sortBy,
        sortDesc: sortingAdapterForOldApi(listOptions.value.sortBy).sortDesc,
      },
    })
    items.value = result.items || []
    totalCount.value = result.count || 0
    loading.value = false
  } catch (e) {
    loading.value = false
    store.commit('setError', e.message)
  }
}

function dblClickRow(_, { item }) {
  router.push(`/orders/${item._id}`)
}
</script>
<style scoped>
.table-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
