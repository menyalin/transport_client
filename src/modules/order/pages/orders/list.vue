<!-- eslint-disable vue/html-indent -->
<template>
  <div>
    <app-buttons-panel
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
        v-if="accountingMode"
        v-model="settings.docStatus"
        label="Документ"
        :items="docStatuses"
        dense
        hide-details
        outlined
        clearable
        :style="{ 'max-width': '220px' }"
        @change="settings.listOptions.page = 1"
      />
      <v-select
        v-if="accountingMode"
        v-model="settings.docsGetted"
        label="Докумены сданы"
        :items="docsGettedItems"
        dense
        hide-details
        outlined
        clearable
        :style="{ 'max-width': '190px' }"
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
    <div class="table-wrapper">
      <v-data-table
        :headers="filteredHeaders"
        dense
        :loading="loading"
        :items="preparedOrders"
        fixed-header
        height="68vh"
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

        <template v-slot:[`item.truck`]="{ item }">
          {{
            !!item.confirmedCrew &&
            !!item.confirmedCrew.truck &&
            trucksMap.has(item.confirmedCrew.truck)
              ? trucksMap.get(item.confirmedCrew.truck).regNum
              : '-'
          }}
        </template>
        <template v-slot:[`item.trailer`]="{ item }">
          {{
            !!item.confirmedCrew &&
            !!item.confirmedCrew.trailer &&
            trucksMap.has(item.confirmedCrew.trailer)
              ? trucksMap.get(item.confirmedCrew.trailer).regNum
              : ''
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
        <template v-slot:[`item.docStatus`]="{ item }">
          <b :style="{ color: item.docStatus.fontColor }">
            {{ item.docStatus.text }}
          </b>
        </template>
        <template v-slot:[`item.docsGetted`]="{ item }">
          <v-simple-checkbox
            :value="item.docsState ? item.docsState.getted : false"
            :disabled="!!item.docs && !!item.docs.length"
            color="primary"
            @input="setDocStateStatus($event, item._id)"
          />
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            color="primary"
            icon
            small
            dark
            @click="openDocsDialog(item._id)"
          >
            <v-icon small> mdi-file-document-multiple </v-icon>
          </v-btn>
        </template>
      </v-data-table>
      <v-dialog v-model="docDialog" max-width="1300" persistent>
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
import dayjs from 'dayjs'
import service from '@/modules/order/services/order.service'
import AppTableColumnSettings from '@/modules/common/components/tableColumnSettings'
import AppDateRange from '@/modules/common/components/dateRange'
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import AppPartnerAutocomplete from '@/modules/common/components/partnerAutocomplete'
import AppAddressAutocomplete from '@/modules/common/components/addressAutocomplete'
import AppDocListForm from '../../components/docListForm/index.vue'
import _putTableToClipboard from './_putTableToClipboard.js'
import { ALL_ORDER_LIST_HEADERS, DEFAULT_HEADERS } from './constants.js'
import { useOrderListUtils } from '../../hooks/useOrderListUtils.js'
import { useListColumnSettings } from '@/modules/common/hooks/useListColumnSettings.js'
import { debounce } from '@/modules/common/helpers/utils.js'
import { mapGetters } from 'vuex'
import socket from '@/socket'

const _initPeriod = () => {
  const todayM = dayjs()
  return [
    todayM.add(-5, 'd').format('YYYY-MM-DD'),
    todayM.add(3, 'd').format('YYYY-MM-DD'),
  ]
}

export default {
  name: 'ListOrder',
  components: {
    AppTableColumnSettings,
    AppDateRange,
    AppButtonsPanel,
    AppPartnerAutocomplete,
    AppAddressAutocomplete,
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
    orders: [],
  }),
  setup() {
    const {
      getOrderDocStatus,
      docStatuses,
      setDocStateStatus,
      docsGettedItems,
      minDate,
    } = useOrderListUtils()

    const {
      defaultHeaders,
      listSettingsName,
      activeHeaders,
      allHeaders,
      headers,
    } = useListColumnSettings({
      listSettingsName: 'orderList',
      allHeaders: ALL_ORDER_LIST_HEADERS,
      defaultHeaders: DEFAULT_HEADERS,
    })
    return {
      getOrderDocStatus,
      docStatuses,
      setDocStateStatus,
      docsGettedItems,
      minDate,
      defaultHeaders,
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
        docStatus: this.getOrderDocStatus(order.docs),
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
    partnersMap() {
      return this.$store.getters.partnersMap
    },
    orderAnalyticTypeMap() {
      return this.$store.getters.orderAnalyticTypesMap
    },
    trucksMap() {
      return this.$store.getters.trucksMap
    },
    trailers() {
      return this.$store.getters
        .trucksForSelect({
          type: 'trailer',
          tkName: this.settings.tkName,
        })
        .map((t) => ({
          ...t,
          value: t._id,
          text: t.regNum,
        }))
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
      // eslint-disable-next-line no-unused-vars
      let order = this.orders.find((item) => item._id === data._id)
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
    async openDocsDialog(orderId) {
      if (!orderId) return null
      this.editableOrderId = orderId
      const order = await service.getById(orderId)
      this.editableDocs = order.docs
      this.$nextTick(() => {
        this.docDialog = true
      })
    },

    cancelDocDialog() {
      this.editableDocs = []
      this.editableOrderId = null
      this.$nextTick(() => {
        this.docDialog = false
      })
    },

    async saveDocDialog(val) {
      await service.setDocs(this.editableOrderId, val)
      this.cancelDocDialog()
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
          trailer: this.settings.trailer,
          address: this.settings.address,
          driver: this.settings.driver,
          docStatus: this.settings.docStatus,
          tkName: this.settings.tkName,
          status: this.settings.status,
          searchNum: this.settings.searchNum,
          loadingZone: this.settings.loadingZone,
          docsGetted: this.settings.docsGetted,
          profile: this.directoriesProfile,
          startDate: dayjs(this.settings.period[0]).toISOString(),
          endDate: dayjs(this.settings.period[1]).toISOString(),
          accountingMode: this.accountingMode || null,
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
