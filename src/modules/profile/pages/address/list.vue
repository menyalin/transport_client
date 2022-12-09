<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-buttons-panel
          panel-type="list"
          :disabled-refresh="!directoriesProfile"
          :disabledSubmit="!$store.getters.hasPermission('address:write')"
          @submit="createAddress"
          @refresh="refresh"
        />
        <v-data-table
          :search="settings.search"
          :headers="filteredHeaders"
          :items="prepareAddresses"
          :loading="loading"
          fixed-header
          :options.sync="settings.listOptions"
          height="72vh"
          dense
          :footer-props="{
            'items-per-page-options': [50, 100, 200],
          }"
          @dblclick:row="dblClickRow"
        >
          <template #[`item.isShipmentPlace`]="{ item }">
            <v-icon v-if="item.isShipmentPlace" color="green">
              mdi-check
            </v-icon>
            <v-icon v-else> mdi-minus </v-icon>
          </template>
          <template #[`item.isDeliveryPlace`]="{ item }">
            <v-icon v-if="item.isDeliveryPlace" color="green">
              mdi-check
            </v-icon>
            <v-icon v-else> mdi-minus </v-icon>
          </template>
          <template #[`item.region`]="{ item }">
            {{
              $store.getters.regionsMap.has(item.region)
                ? $store.getters.regionsMap.get(item.region).name
                : null
            }}
          </template>
          <template #[`item.city`]="{ item }">
            {{
              $store.getters.citiesMap.has(item.city)
                ? $store.getters.citiesMap.get(item.city).name
                : null
            }}
          </template>

          <template #[`item.zones`]="{ item }">
            <span v-if="Array.isArray(item.zones)">{{
              item.zones
                .map((i) =>
                  $store.getters.zonesMap.has(i)
                    ? $store.getters.zonesMap.get(i).name
                    : null
                )
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
                outlined
                dense
                hide-details
                clearable
                label="Быстрый поиск"
                :style="{ 'max-width': '500px' }"
              />
            </div>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import AppTableColumnSettings from '@/modules/common/components/tableColumnSettings'

import { mapGetters } from 'vuex'
export default {
  name: 'AddressList',
  components: {
    AppButtonsPanel,
    AppTableColumnSettings,
  },
  data: () => ({
    formName: 'AddressList',
    listSettingsName: 'addressListFields',
    settings: {
      search: null,
      listOptions: {},
    },
    activeHeaders: [],
    defaultHeaders: [
      'shortName',
      'partnerName',
      'name',
      'region',
      'city',
      'zones',
      'note',
      'isShipmentPlace',
      'isDeliveryPlace',
      // 'updated',
    ],
    allHeaders: [
      { value: 'shortName', text: 'Сокращенный адрес' },
      { value: 'partnerName', text: 'Партнер' },
      { value: 'name', text: 'Адрес' },
      { value: 'region', text: 'Регион' },
      { value: 'city', text: 'Город' },
      { value: 'zones', text: 'Зоны', sortable: false },
      { value: 'note', text: 'Примечание' },
      { value: 'label', text: 'Метки' },
      {
        value: 'isShipmentPlace',
        text: 'Погрузка',
        align: 'center',
        sortable: false,
      },
      {
        value: 'isDeliveryPlace',
        text: 'Разгрузка',
        align: 'center',
        sortable: false,
      },
      { value: 'created', text: 'Дата создания', sortable: true },
      { value: 'updated', text: 'Дата изменения', sortable: true },
      { value: 'isService', text: 'Сервис', align: 'center', sortable: false },
      { value: 'geo', text: 'Координаты' },
    ],
  }),
  computed: {
    ...mapGetters(['addresses', 'loading', 'directoriesProfile']),
    prepareAddresses() {
      return this.addresses.map((i) => ({
        ...i,
        created: new Date(i.createdAt),
        updated: new Date(i.updatedAt),
      }))
    },
    filteredHeaders() {
      return this.allHeaders.filter((i) => this.activeHeaders.includes(i.value))
    },
  },

  created() {
    const fields = JSON.parse(localStorage.getItem(this.listSettingsName))
    if (!fields || fields.length === 0) this.activeHeaders = this.defaultHeaders
    else this.activeHeaders = fields

    if (this.$store.getters.formSettingsMap.has(this.formName))
      this.settings = this.$store.getters.formSettingsMap.get(this.formName)
    this.$store.dispatch('getAddresses')
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('setFormSettings', {
      formName: this.formName,
      settings: { ...this.settings },
    })
    next()
  },
  methods: {
    createAddress() {
      this.$router.push({ name: 'AddressCreate' })
    },
    refresh() {
      this.$store.dispatch('getAddresses', true)
    },
    dblClickRow(_, { item }) {
      this.$router.push(`address/${item._id}`)
    },
  },
}
</script>
<style scoped>
.settings-wrapper {
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 15px;
}
</style>
