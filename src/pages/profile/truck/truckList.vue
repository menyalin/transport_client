<template>
  <EntityListWrapper>
    <ButtonsPanel
      panel-type="list"
      :disabled-refresh="!directoriesProfile"
      :disabled-submit="!store.getters.hasPermission('truck:write')"
      @submit="create"
      @refresh="refresh"
    />
    <ListSettingsWrapper>
      <AppTableColumnSettings
        v-model="activeHeaders"
        :allHeaders="allHeaders"
        :listSettingsName="listSettingsName"
      />
      <v-select
        v-model="settings.serviceStatus"
        label="Статус ТС"
        hide-details
        :items="serviceStatusItems"
      />
      <v-select
        v-model="settings.tkNameFilter"
        hide-details
        label="ТК"
        clearable
        :items="carrierStore.carriers"
        item-value="_id"
        item-title="name"
      />
      <v-select
        v-model="settings.truckFilter"
        multiple
        hide-details
        label="Тип транспорта"
        clearable
        :items="truckFilterOptions"
      />
      <v-text-field v-model="settings.search" hide-details label="Быстрый поиск" />
    </ListSettingsWrapper>
    <v-data-table
      :search="settings.search"
      :headers="filteredHeaders"
      fixed-header
      height="72vh"
      :items-per-page-options="[50, 100, 200]"
      v-model:options="settings.listOptions"
      :items="filteredTrucks"
      :loading="loading"
      @dblclick:row="dblClickRow"
    >
      <template #[`item.type`]="{ item }">
        <span>{{ truckTypesHash[item.type] }}</span>
      </template>

      <template #[`item.hasScans`]="{ item }">
        <v-icon v-if="item.hasScans" size="small" color="green"> mdi-check </v-icon>
        <v-icon v-else size="small" color="red"> mdi-minus </v-icon>
      </template>
    </v-data-table>
  </EntityListWrapper>
</template>
<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { CrewService } from '@/shared/services'
import { ButtonsPanel, EntityListWrapper, ListSettingsWrapper } from '@/shared/ui'
import AppTableColumnSettings from '@/shared/ui/tableColumnSettings/tableColumnSettings.vue'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'
import { allHeaders } from './listHeaders'

defineOptions({ name: 'TruckList' })

const router = useRouter()
const store = useStore()
const carrierStore = useCarrierStore()

const formName = 'TruckList'
const listSettingsName = 'truckListFields'

const serviceStatusItems = [
  { value: 'all', title: 'Все' },
  { value: 'active', title: 'Действующие' },
  { value: 'inactive', title: 'Вышедшие из эксплуатации' },
]

const loading = ref(false)
const crews = ref([])

const activeHeaders = ref([])

const defaultHeaders = [
  'order',
  'tkName.name',
  'type',
  'regNum',
  'liftCapacityType',
  'pltCount',
  'brand',
  'currentDriver',
  'permanentDriverCount',
  'temporaryDriverCount',
  'hasScans',
]

const settings = reactive({
  tkNameFilter: null,
  serviceStatus: 'active',
  search: null,
  truckFilter: [],
  listOptions: {},
})

const truckFilterOptions = [
  { title: 'Тягачи', value: '20tn' },
  { title: '10-ки', value: '10tn' },
  { title: 'Прицепы', value: 'trailers' },
]

const directoriesProfile = computed(() => store.getters.directoriesProfile)
const trucks = computed(() => store.getters.trucks)
const truckTypesHash = computed(() => store.getters.truckTypesHash)

const filteredHeaders = computed(() => {
  return allHeaders.filter((i) => activeHeaders.value.includes(i.value))
})

const crewsMapByTruck = computed(() => {
  return new Map(crews.value.map((cr) => [cr.transport.truck, { ...cr }]))
})

function getDriverName(truckId) {
  if (!crewsMapByTruck.value.has(truckId)) return null
  const driverId = crewsMapByTruck.value.get(truckId).driver
  return store.getters.driversMap.get(driverId)?.fullName || null
}

const filteredTrucks = computed(() => {
  return trucks.value
    .filter((item) => {
      if (!settings.tkNameFilter) return true
      return item.tkName?._id === settings.tkNameFilter
    })
    .filter((item) => {
      if (settings.truckFilter.length === 0) return true
      return settings.truckFilter.some((tFilter) => {
        switch (tFilter) {
          case '20tn':
            return item.type === 'truck' && item.liftCapacityType === 20
          case '10tn':
            return item.type === 'truck' && item.liftCapacityType === 10
          case 'trailers':
            return item.type === 'trailer'
        }
      })
    })
    .filter((item) => {
      switch (settings.serviceStatus) {
        case 'all':
          return true
        case 'active':
          return !item.endServiceDate
        case 'inactive':
          return item.endServiceDate
      }
    })
    .map((t) => ({
      ...t,
      currentDriver: getDriverName(t._id),
      brigadier: store.getters.driversMap.get(t.brigadier)?.surname,
    }))
})

async function getData() {
  loading.value = true
  crews.value = await CrewService.getActualCrewsOnCurrentDate({
    profile: directoriesProfile.value,
  })
  loading.value = false
}

function create() {
  router.push({ name: 'TruckCreate' })
}

function refresh() {
  store.dispatch('getTrucks', true)
  getData()
}

function dblClickRow(_, { item }) {
  router.push({ name: 'TruckDetails', params: { id: item._id } })
}

onMounted(() => {
  const savedFields = JSON.parse(localStorage.getItem(listSettingsName))
  if (savedFields && savedFields.length > 0) {
    activeHeaders.value = savedFields
  } else {
    activeHeaders.value = defaultHeaders
  }

  if (store.getters.formSettingsMap.has(formName)) {
    const saved = store.getters.formSettingsMap.get(formName)
    Object.assign(settings, saved)
  }

  store.dispatch('getTrucks')
  getData()
})

onBeforeUnmount(() => {
  store.commit('setFormSettings', {
    formName,
    settings: { ...settings },
  })
})
</script>
