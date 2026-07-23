<template>
  <entity-list-wrapper>
    <buttons-panel
      panel-type="list"
      :disabled-refresh="!directoriesProfile"
      :disabledSubmit="!store.getters.hasPermission('address:write')"
      @submit="createAddress"
      @refresh="refresh"
    />
    <ListSettingsWrapper>
      <app-table-column-settings
        v-model="activeHeaders"
        :allHeaders="allHeaders"
        :listSettingsName="listSettingsName"
      />
      <v-text-field
        v-model="settings.search"
        hide-details
        clearable
        label="Быстрый поиск"
        :style="{ 'max-width': '500px' }"
      />
    </ListSettingsWrapper>
    <v-data-table
      :search="settings.search"
      :headers="filteredHeaders"
      :items="prepareAddresses"
      :loading="loading"
      fixed-header
      height="72vh"
      :items-per-page-options="[50, 100, 200]"
      v-model:options="settings.listOptions"
      @dblclick:row="dblClickRow"
    >
      <template #[`item.isShipmentPlace`]="{ item }">
        <v-icon v-if="item.isShipmentPlace" color="green"> mdi-check </v-icon>
        <v-icon v-else> mdi-minus </v-icon>
      </template>
      <template #[`item.isDeliveryPlace`]="{ item }">
        <v-icon v-if="item.isDeliveryPlace" color="green"> mdi-check </v-icon>
        <v-icon v-else> mdi-minus </v-icon>
      </template>
      <template #[`item.region`]="{ item }">
        {{
          store.getters.regionsMap.has(item.region)
            ? store.getters.regionsMap.get(item.region).name
            : null
        }}
      </template>
      <template #[`item.city`]="{ item }">
        {{
          store.getters.citiesMap.has(item.city)
            ? store.getters.citiesMap.get(item.city).name
            : null
        }}
      </template>

      <template #[`item.zones`]="{ item }">
        <span v-if="Array.isArray(item.zones)">{{
          item.zones
            .map((i) => (store.getters.zonesMap.has(i) ? store.getters.zonesMap.get(i).name : null))
            .filter((i) => !!i)
            .join(', ')
        }}</span>
      </template>

      <template #[`item.isService`]="{ item }">
        <v-icon v-if="item.isService" color="green"> mdi-check </v-icon>
        <v-icon v-else> mdi-minus </v-icon>
      </template>

      <template #[`item.created`]="{ item }">
        {{ new Date(item.createdAt).toLocaleString() }}
      </template>

      <template #[`item.updated`]="{ item }">
        {{ new Date(item.updatedAt).toLocaleString() }}
      </template>
    </v-data-table>
  </entity-list-wrapper>
</template>
<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ButtonsPanel, EntityListWrapper, ListSettingsWrapper } from '@/shared/ui'
import AppTableColumnSettings from '@/modules/common/components/tableColumnSettings/index.vue'
import { useAddressStore } from '@/entities/address'
import { usePersistedRef } from '@/shared/hooks'

defineOptions({ name: 'AddressList' })

const router = useRouter()
const store = useStore()
const addressStore = useAddressStore()
const listSettingsName = 'AddressList:settings'
const settings = usePersistedRef({ search: null }, listSettingsName)

const activeHeaders = ref([])
// const defaultHeaders = [
//   'shortName',
//   'partnerName',
//   'name',
//   'region',
//   'city',
//   'zones',
//   'note',
//   'isShipmentPlace',
//   'isDeliveryPlace',
// ]

const allHeaders = [
  { value: 'shortName', title: 'Сокращенный адрес', default: true },
  { value: 'partnerName', title: 'Партнер', default: true },
  { value: 'name', title: 'Адрес', default: true },
  { value: 'region', title: 'Регион', default: true },
  { value: 'city', title: 'Город' },
  { value: 'zones', title: 'Зоны', sortable: false, default: false },
  { value: 'note', title: 'Примечание', default: true },
  // { value: 'label', title: 'Метки' },
  { value: 'isShipmentPlace', title: 'Погрузка', align: 'center', sortable: false, default: true },
  { value: 'isDeliveryPlace', title: 'Разгрузка', align: 'center', sortable: false, default: true },
  { value: 'created', title: 'Дата создания', sortable: true, default: false },
  { value: 'updated', title: 'Дата изменения', sortable: true, default: false },
  { value: 'isService', title: 'Сервис', align: 'center', sortable: false, default: false },
  { value: 'geo', title: 'Координаты', default: false },
]

const loading = computed(() => store.getters.loading)
const directoriesProfile = computed(() => store.getters.directoriesProfile)

const addresses = computed(() => addressStore.filteredAddresses)

const prepareAddresses = computed(() => {
  return addresses.value.map((i) => ({
    ...i,
    created: new Date(i.createdAt),
    updated: new Date(i.updatedAt),
  }))
})

const filteredHeaders = computed(() => {
  return allHeaders.filter((i) => activeHeaders.value.includes(i.value))
})

function createAddress() {
  router.push({ name: 'AddressCreate' })
}

function refresh() {
  addressStore.getAddresses(true)
}

function dblClickRow(_, { item }) {
  router.push(`address/${item._id}`)
}
</script>
