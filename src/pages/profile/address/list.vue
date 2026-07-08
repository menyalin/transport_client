<template>
  <entity-list-wrapper>
    <buttons-panel
      panel-type="list"
      :disabled-refresh="!directoriesProfile"
      :disabledSubmit="!store.getters.hasPermission('address:write')"
      @submit="createAddress"
      @refresh="refresh"
    />
    <v-data-table
      :search="settings.search"
      :headers="filteredHeaders"
      :items="prepareAddresses"
      :loading="loading"
      fixed-header
      @update:options="settings.listOptions = $event"
      height="72vh"
      :footer-props="{
        'items-per-page-options': [50, 100, 200],
      }"
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

      <template #top>
        <div class="settings-wrapper">
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
        </div>
      </template>
    </v-data-table>
  </entity-list-wrapper>
</template>
<script setup>
import { computed, ref, reactive, onMounted } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { useStore } from 'vuex'
import { ButtonsPanel, EntityListWrapper } from '@/shared/ui'
import AppTableColumnSettings from '@/modules/common/components/tableColumnSettings/index.vue'
import { useAddressStore } from '@/entities/address'

defineOptions({ name: 'AddressList' })

const router = useRouter()
const store = useStore()
const addressStore = useAddressStore()

const formName = 'AddressList'
const listSettingsName = 'addressListFields'

const settings = reactive({
  search: null,
  listOptions: {},
})

const activeHeaders = ref([])
const defaultHeaders = [
  'shortName',
  'partnerName',
  'name',
  'region',
  'city',
  'zones',
  'note',
  'isShipmentPlace',
  'isDeliveryPlace',
]

const allHeaders = [
  { value: 'shortName', title: 'Сокращенный адрес' },
  { value: 'partnerName', title: 'Партнер' },
  { value: 'name', title: 'Адрес' },
  { value: 'region', title: 'Регион' },
  { value: 'city', title: 'Город' },
  { value: 'zones', title: 'Зоны', sortable: false },
  { value: 'note', title: 'Примечание' },
  { value: 'label', title: 'Метки' },
  { value: 'isShipmentPlace', title: 'Погрузка', align: 'center', sortable: false },
  { value: 'isDeliveryPlace', title: 'Разгрузка', align: 'center', sortable: false },
  { value: 'created', title: 'Дата создания', sortable: true },
  { value: 'updated', title: 'Дата изменения', sortable: true },
  { value: 'isService', title: 'Сервис', align: 'center', sortable: false },
  { value: 'geo', title: 'Координаты' },
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

onMounted(() => {
  const fields = JSON.parse(localStorage.getItem(listSettingsName))
  if (!fields || fields.length === 0) activeHeaders.value = defaultHeaders
  else activeHeaders.value = fields

  if (store.getters.formSettingsMap.has(formName))
    Object.assign(settings, store.getters.formSettingsMap.get(formName))

  addressStore.getAddresses()
})

onBeforeRouteLeave((_to, _from, next) => {
  store.commit('setFormSettings', {
    formName: formName,
    settings: { ...settings },
  })
  next()
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
<style scoped>
.settings-wrapper {
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: flex-start;
  align-items: center;
  margin: 15px;
}
</style>
