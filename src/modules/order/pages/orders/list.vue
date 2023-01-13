<!-- eslint-disable vue/html-indent -->
<template>
  <div>
    <buttons-panel
      panel-type="list"
      :disabled-refresh="!directoriesProfile"
      :disabledSubmit="!$store.getters.hasPermission('order:daysForWrite')"
      @submit="create"
      @refresh="refresh"
    />
    <div class="filter-wrapper">
      <app-table-column-settings
        v-model="activeHeaders"
        :allHeaders="allHeaders"
        :listSettingsName="listSettingsName"
      />
      <app-date-range
        v-model="settings.period"
        :min="minDate"
        class="mx-3"
        :style="{ 'max-width': '250px' }"
      />
      <v-select
        v-if="!accountingMode"
        v-model="settings.status"
        label="Статус"
        :items="orderStatuses"
        dense
        :disabled="accountingMode"
        hide-details
        outlined
        clearable
        :style="{ 'max-width': '220px' }"
        @change="settings.listOptions.page = 1"
      />

      <v-select
        v-model="settings.docStatus"
        label="Документы"
        :items="docStatuses"
        dense
        hide-details
        outlined
        clearable
        :style="{ 'max-width': '220px' }"
        @change="settings.listOptions.page = 1"
      />

      <app-partner-autocomplete
        v-model="settings.client"
        label="Клиент"
        outlined
        dense
        only-clients
        hide-details
        hide-append-icon
        :style="{ 'max-width': '220px' }"
        @change="settings.listOptions.page = 1"
      />
      <v-select
        v-model="settings.tkName"
        label="ТК"
        :items="$store.getters.tkNames"
        item-value="_id"
        item-text="name"
        dense
        hide-details
        outlined
        clearable
        :style="{ 'max-width': '200px' }"
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
        :style="{ 'max-width': '200px' }"
        @change="settings.listOptions.page = 1"
      />
      <v-autocomplete
        v-model="settings.trailer"
        dense
        clearable
        :items="trailers"
        outlined
        hide-details
        label="Прицеп"
        :style="{ 'max-width': '200px' }"
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
        :style="{ 'max-width': '300px' }"
        @change="settings.listOptions.page = 1"
      />
      <v-autocomplete
        v-model="settings.loadingZone"
        label="Зона погрузки"
        dense
        :items="$store.getters.zones"
        clearable
        item-value="_id"
        item-text="name"
        outlined
        hide-details
        :style="{ 'max-width': '210px' }"
        @change="settings.listOptions.page = 1"
      />

      <app-address-autocomplete
        v-model="settings.address"
        label="Адрес"
        dense
        hideAppendIcon
        outlined
        hide-details
        :style="{ 'min-width': '550px', 'max-width': '900px' }"
        @change="settings.listOptions.page = 1"
      />
      <v-text-field
        v-model.lazy="settings.searchNum"
        label="Поиск по номеру"
        dense
        hideAppendIcon
        outlined
        hide-details
        :style="{ 'max-width': '300px' }"
        @change="settings.listOptions.page = 1"
      />
      <v-switch
        v-if="availableAccountantMode"
        v-model="settings.accountingMode"
        label="Бухгалтер"
      />
      <v-btn
        v-if="$store.getters.hasPermission('order:groupCreate')"
        color="primary"
        text
        small
        to="/orders/group"
      >
        Создать группу рейсов
      </v-btn>
      <v-btn
        v-if="availableAccountantMode && accountingMode"
        color="primary"
        text
        small
        @click="putTableToClipboard"
      >
        Поместить в буфер обмена
      </v-btn>
    </div>
    <orders-table
      :headers="filteredHeaders"
      :loading="loading"
      :items="preparedOrders"
      :count="count"
      :settings="settings"
      :missingOrders="missingOrders"
      :onCheckOrders="onCheckOrders"
      :needFixOrders="needFixOrders"
      :acceptedOrders="acceptedOrders"
    />
  </div>
</template>
<script>
import dayjs from 'dayjs'

import socket from '@/socket'
import { OrderService } from '@/shared/services'
import AppTableColumnSettings from '@/modules/common/components/tableColumnSettings'
import AppDateRange from '@/modules/common/components/dateRange'
import AppPartnerAutocomplete from '@/modules/common/components/partnerAutocomplete'
import AppAddressAutocomplete from '@/modules/common/components/addressAutocomplete'
import AppDocListForm from '../../components/docListForm/index.vue'
import _putTableToClipboard from './_putTableToClipboard.js'
import { ALL_ORDER_LIST_HEADERS, DEFAULT_HEADERS } from './constants.js'
import { useOrderListUtils } from '../../hooks/useOrderListUtils.js'
import { ButtonsPanel } from '@/shared/ui'
import { useListColumnSetting } from '@/shared/hooks'
import { OrdersTable } from '@/widgets'
import { debounce } from '@/modules/common/helpers/utils.js'
import { mapGetters } from 'vuex'

const _initPeriod = () => {
  const todayM = dayjs()
  return [
    todayM.add(-10, 'd').format('YYYY-MM-DD'),
    todayM.add(3, 'd').format('YYYY-MM-DD'),
  ]
}

export default {
  name: 'ListOrder',
  components: {
    OrdersTable,
    AppTableColumnSettings,
    AppDateRange,
    ButtonsPanel,
    AppPartnerAutocomplete,
    AppAddressAutocomplete,
    AppDocListForm,
  },
  data: () => ({
    formName: 'orderList',
    editableDocs: [],
    editableOrderId: null,
    loading: false,
    settings: {
      client: null,
      tkName: null,
      truck: null,
      trailer: null,
      address: null,
      loadingZone: null,
      driver: null,
      searchNum: null,
      status: null,
      docStatus: null,
      accountingMode: !!parseInt(localStorage.getItem('orders:accontingMode')),
      period: _initPeriod(),
      listOptions: {
        page: 1,
        itemsPerPage: 50,
      },
    },
    count: 0,
    acceptedOrders: 0,
    needFixOrders: 0,
    onCheckOrders: 0,
    missingOrders: 0,
    orders: [],
  }),
  setup() {
    
    const { getOrderDocStatus, docStatuses, setDocStateStatus, minDate } =
      useOrderListUtils()

    const { listSettingsName, activeHeaders, allHeaders, headers } =
      useListColumnSetting({
        listSettingsName: 'orderList',
        allHeaders: ALL_ORDER_LIST_HEADERS,
        defaultHeaders: DEFAULT_HEADERS,
      })

    return {
      getOrderDocStatus,
      docStatuses,
      setDocStateStatus,
      minDate,
      listSettingsName,
      activeHeaders,
      allHeaders,
      headers,
    }
  },
  computed: {
    ...mapGetters(['directoriesProfile', 'orderStatuses']),
    accountingMode() {
      return this.settings.accountingMode
    },
    availableAccountantMode() {
      return this.$store.getters.hasPermission('orderListForAccountant')
    },
    filteredHeaders() {
      return this.headers.filter((item) =>
        this.accountingMode ? true : !item.forAccountingMode
      )
    },
    preparedOrders() {
      if (!this.orders) return []
      return this.orders.map((order) => ({
        ...order,
        driver:
          this.$store.getters.driversMap.get(order.confirmedCrew.driver)
            ?.fullName || null,
        tk:
          order.confirmedCrew.tkName &&
          this.$store.getters.tkNamesMap.has(order.confirmedCrew.tkName)
            ? this.$store.getters.tkNamesMap.get(order.confirmedCrew.tkName)
                .name
            : '-',
        docStatus: this.getOrderDocStatus(order.docs, order.docsState?.getted),
        plannedDate: new Date(order.route[0].plannedDate).toLocaleString(),
        loadingZones: order._loadingZones.map((i) => i.name).join(', '),
        loadingPoints: order.route
          .filter((p) => p.type === 'loading')
          .map((p) => this.$store.getters.addressMap.get(p.address)?.shortName),
        unloadingPoints: order.route
          .filter((p) => p.type === 'unloading')
          .map((p) => this.$store.getters.addressMap.get(p.address)?.shortName),
      }))
    },
  },
  watch: {
    settings: {
      deep: true,
      handler: async function () {
        await this.debounceGetData()
      },
    },
    ['settings.accountingMode']: {
      handler: function (val) {
        localStorage.setItem('orders:accontingMode', val ? '1' : '0')
      },
    },
  },


  created() {
    this.debounceGetData = debounce(async () => await this.getData(), 300)
    if (this.$store.getters.formSettingsMap.has(this.formName))
      this.settings = this.$store.getters.formSettingsMap.get(this.formName)
    socket.on('order:updated', (data) => {
      let order = this.orders.find((item) => item._id === data._id)
      if (!order) return null
      order = Object.assign(order, data)
    })
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('setFormSettings', {
      formName: this.formName,
      settings: { ...this.settings },
    })
    next()
  },
  methods: {
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
        const data = await OrderService.getList({
          client: this.settings.client,
          truck: this.settings.truck,
          trailer: this.settings.trailer,
          address: this.settings.address,
          driver: this.settings.driver,
          docStatus: this.settings.docStatus,
          tkName: this.settings.tkName,
          status: this.settings.status,
          searchNum: this.settings.searchNum,
          loadingZone: this.settings.loadingZone,
          profile: this.directoriesProfile,
          startDate: dayjs(this.settings.period[0]).toISOString(),
          endDate: dayjs(this.settings.period[1]).toISOString(),
          accountingMode: this.accountingMode || null,
          skip:
            this.settings.listOptions.itemsPerPage *
            (this.settings.listOptions.page - 1),
          limit: this.settings.listOptions.itemsPerPage,
          sortBy: this.settings.listOptions.sortBy,
          sortDesc: this.settings.listOptions.sortDesc,
        })
        this.orders = data.items
        this.count = data.count
        this.acceptedOrders = data.acceptedDocs
        this.needFixOrders = data.needFixDocs
        this.onCheckOrders = data.onCheckDocs
        this.missingOrders = data.missingDocs
        this.loading = false
      } catch (e) {
        this.loading = false
        this.$store.commit('setError', e.message)
      }
    },
    putTableToClipboard() {
      _putTableToClipboard({
        items: this.preparedOrders,
        orderTypesMap: this.$store.getters.orderAnalyticTypesMap,
      })
    },
  },
}
</script>
<style scoped>
.filter-wrapper {
  margin: 10px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}
.table-wrapper {
  user-select: none;
}
</style>
