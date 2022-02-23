<template>
  <div>
    <app-buttons-panel
      panel-type="list"
      :disabled-refresh="!directoriesProfile"
      @submit="create"
      @refresh="refresh"
    />
    <div class="filter-wrapper">
      <app-date-range v-model="settings.period" />
      <v-select
        v-model="settings.status"
        label="Статус"
        :items="orderStatuses"
        dense
        hide-details
        outlined
        clearable
        @change="settings.listOptions.page = 1"
      />
      <v-autocomplete
        v-model="settings.truck"
        dense
        clearable
        :items="trucks"
        outlined
        hide-details
        label="Грузовик"
        @change="settings.listOptions.page = 1"
      />
      <v-autocomplete
        v-model="settings.driver"
        dense
        item-value="_id"
        item-text="fullName"
        clearable
        :items="drivers"
        outlined
        hide-details
        label="Водитель"
        @change="settings.listOptions.page = 1"
      />
      <app-partner-autocomplete
        v-model="settings.client"
        label="Клиент"
        outlined
        dense
        only-clients
        hide-details
        @change="settings.listOptions.page = 1"
      />
      <v-switch
        v-model="settings.accountingMode"
        label="Бухгалтер"
      />
      <v-btn
        color="primary"
        text
        small
        to="/orders/group"
      >
        Создать группу рейсов
      </v-btn>
    </div>
    <div class="table-wrapper">
      <v-data-table
        :headers="filteredHeaders"
        dense
        :loading="loading"
        :items="preparedOrders"
        fixed-header
        height="72vh"
        :serverItemsLength="count"
        :footer-props="{
          'items-per-page-options': [50, 100, 200],
        }"
        :options.sync="settings.listOptions"
        @dblclick:row="dblClickRow"
      >
        <template v-slot:[`item.state.status`]="{ item }">
          {{ getStatusText(item.state.status) }}
        </template>
        <template v-slot:[`item.plannedDate`]="{ item }">
          {{ new Date(item.route[0].plannedDate).toLocaleString() }}
        </template>
        <template v-slot:[`item.truck`]="{ item }">
          {{
            !!item.confirmedCrew &&
              !!item.confirmedCrew.truck &&
              trucksMap.has(item.confirmedCrew.truck)
              ? trucksMap.get(item.confirmedCrew.truck).regNum
              : '-'
          }}
        </template>
        <template v-slot:[`item.client.client`]="{ item }">
          {{
            !!item.client && partnersMap.has(item.client.client)
              ? partnersMap.get(item.client.client).name
              : '-'
          }}
        </template>
        <template v-slot:[`item.analytics.type`]="{ item }">
          {{
            !!item.analytics &&
              !!item.analytics.type &&
              orderAnalyticTypeMap.has(item.analytics.type)
              ? orderAnalyticTypeMap.get(item.analytics.type)
              : ''
          }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                icon
                small
                dark
                v-bind="attrs"
                v-on="on"
                @click="openDocsDialog(item._id)"
              >
                <v-icon small>
                  mdi-file-document-multiple
                </v-icon>
              </v-btn>
            </template>
            <span>Сопроводительные документы</span>
          </v-tooltip>
        </template>
      </v-data-table>
      <v-dialog
        v-model="docDialog"
        max-width="800"
      >
        <app-doc-list-form
          :docs="editableDocs"
          :orderId="editableOrderId"
          @cancel="cancelDocDialog"
          @save="saveDocDialog"
        />
      </v-dialog>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import service from '@/modules/order/services/order.service'
import AppDateRange from '@/modules/common/components/dateRange'
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import AppPartnerAutocomplete from '@/modules/common/components/partnerAutocomplete'
import AppDocListForm from '../../components/docListForm/index.vue'

import { mapGetters } from 'vuex'

const _initPeriod = () => {
  const todayM = moment()
  return [
    todayM.add(-3, 'd').format('YYYY-MM-DD'),
    todayM.add(6, 'd').format('YYYY-MM-DD'),
  ]
}

export default {
  name: 'ListOrder',
  components: {
    AppDateRange,
    AppButtonsPanel,
    AppPartnerAutocomplete,
    AppDocListForm,
  },
  data: () => ({
    formName: 'orderList',
    docDialog: false,
    editableDocs: [],
    editableOrderId: null,
    loading: false,
    settings: {
      client: null,
      truck: null,
      driver: null,
      status: null,
      accountingMode: true,
      period: _initPeriod(),
      listOptions: {
        page: 1,
        itemsPerPage: 50,
      },
    },
    count: 0,
    orders: [],
    allHeaders: [
      {
        value: 'plannedDate',
        text: 'Дата погрузки',
        sortable: false,
        width: '12rem',
      },
      {
        value: 'analytics.type',
        text: 'Тип рейса',
        sortable: false,
        width: '10rem',
      },
      {
        value: 'truck',
        text: 'Грузовик',
        sortable: false,
        align: 'center',
        width: '10rem',
      },
      {
        value: 'loadingPoints',
        text: 'Погрузка',
        sortable: false,
        //width: '10rem',
      },
      {
        value: 'unloadingPoints',
        text: 'Разгрузка',
        sortable: false,
        //width: '10rem',
      },
      { value: 'state.status', text: 'Статус', sortable: false },
      { value: 'client.client', text: 'Клиент', sortable: false },
      {
        value: 'client.num',
        text: 'Номер клиента',
        sortable: false,
        forAccountingMode: true,
      },
      {
        value: 'agreement.name',
        text: 'Соглашение',
        sortable: false,
        forAccountingMode: true,
      },
      {
        value: 'actions',
        text: 'Действия',
        sortable: false,
        forAccountingMode: true,
      },
    ],
  }),
  computed: {
    ...mapGetters(['directoriesProfile', 'orderStatuses']),
    accountingMode() {
      return this.settings.accountingMode
    },
    filteredHeaders() {
      return this.allHeaders.filter((item) =>
        this.accountingMode ? true : !item.forAccountingMode
      )
    },
    preparedOrders() {
      if (!this.orders) return []
      return this.orders.map((order) => ({
        ...order,
        loadingPoints: order.route
          .filter((p) => p.type === 'loading')
          .map((p) => this.$store.getters.addressMap.get(p.address)?.shortName),
        unloadingPoints: order.route
          .filter((p) => p.type === 'unloading')
          .map((p) => this.$store.getters.addressMap.get(p.address)?.shortName),
      }))
    },
    partnersMap() {
      return this.$store.getters.partnersMap
    },
    orderAnalyticTypeMap() {
      return this.$store.getters.orderAnalyticTypesMap
    },
    trucksMap() {
      return this.$store.getters.trucksMap
    },
    trucks() {
      return this.$store.getters
        .trucksForSelect({
          type: 'truck',
          tkName: this.settings.tkName,
        })
        .map((t) => ({
          ...t,
          value: t._id,
          text: t.regNum,
        }))
    },
    drivers() {
      return this.$store.getters.drivers
    },
  },
  watch: {
    settings: {
      deep: true,
      handler: async function (newVal, oldVal) {
        await this.getData()
      },
    },
  },
  created() {
    if (this.$store.getters.formSettingsMap.has(this.formName))
      this.settings = this.$store.getters.formSettingsMap.get(this.formName)
    // this.getData()
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('setFormSettings', {
      formName: this.formName,
      settings: { ...this.settings },
    })
    next()
  },
  methods: {
    async openDocsDialog(orderId) {
      const { docs } = await service.getById(orderId)
      this.docDialog = true
    },
    cancelDocDialog() {
      this.docDialog = false
    },
    saveDocDialog() {
      console.log('save docs')
      this.docDialog = false
    },
    create() {
      this.$router.push({ name: 'CreateOrder' })
    },
    getStatusText(status) {
      return this.$store.getters.orderStatusesMap.get(status) || ' --- '
    },
    refresh() {
      this.getData()
    },
    async getData() {
      try {
        if (!this.$store.getters.directoriesProfile) {
          this.$router.push('/profile')
          return null
        }
        this.loading = true
        const data = await service.getList({
          client: this.settings.client,
          truck: this.settings.truck,
          driver: this.settings.driver,
          status: this.settings.status,
          profile: this.directoriesProfile,
          startDate: moment(this.settings.period[0]).toISOString(),
          endDate: moment(this.settings.period[1]).toISOString(),
          accountingMode: this.accountingMode,
          skip:
            this.settings.listOptions.itemsPerPage *
            (this.settings.listOptions.page - 1),
          limit: this.settings.listOptions.itemsPerPage,
        })
        this.orders = data.items
        this.count = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
        this.$store.commit('setError', e.message)
      }
    },
    dblClickRow(_, { item }) {
      if (item) this.$router.push(`orders/${item._id}`)
    },
  },
}
</script>
<style scoped>
.filter-wrapper {
  display: grid;
  gap: 10px;
  grid-template-columns: 300px 250px 250px 300px 250px 150px;
  align-items: center;
}
</style>
