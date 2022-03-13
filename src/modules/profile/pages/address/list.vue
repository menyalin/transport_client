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
          :headers="headers"
          :items="addresses"
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
          <template v-slot:[`item.isShipmentPlace`]="{ item }">
            <v-icon
              v-if="item.isShipmentPlace"
              color="green"
            >
              mdi-check
            </v-icon>
            <v-icon v-else>
              mdi-minus
            </v-icon>
          </template>
          <template v-slot:[`item.isDeliveryPlace`]="{ item }">
            <v-icon
              v-if="item.isDeliveryPlace"
              color="green"
            >
              mdi-check
            </v-icon>
            <v-icon v-else>
              mdi-minus
            </v-icon>
          </template>

          <template v-slot:top>
            <v-text-field
              v-model="settings.search"
              outlined
              hide-details
              dense
              label="Быстрый поиск"
            />
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import { mapGetters } from 'vuex'
export default {
  name: 'AddressList',
  components: {
    AppButtonsPanel,
  },
  data: () => ({
    formName: 'AddressList',
    settings: {
      search: null,
      listOptions: {},
    },

    headers: [
      { value: 'shortName', text: 'Сокращенный адрес' },
      { value: 'partnerName', text: 'Партнер' },
      { value: 'name', text: 'Адрес' },
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
      { value: 'geo', text: 'Координаты' },
    ],
  }),
  computed: {
    ...mapGetters(['addresses', 'loading', 'directoriesProfile']),
  },

  created() {
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
<style></style>
