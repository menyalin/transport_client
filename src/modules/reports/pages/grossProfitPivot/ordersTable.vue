<template>
  <div class="table-wrapper">
    <div>
      <v-btn
        color="primary"
        :loading="loading"
        :disabled="loading"
        @click="getData"
      >
        Получить детальные записи
      </v-btn>
    </div>

    <v-data-table
      checkbox-color="primary"
      :headers="filteredHeaders"
      :items="preparedItems"
      :server-items-length="totalCount"
      :loading="loading"
      :options.sync="listOptions"
      :items-per-page="50"
      dense
      :footer-props="{
        'items-per-page-options': [50, 100, 200],
      }"
      @dblclick:row="dblClickRow"
    >
      <template #top>
        <div class="settings-wrapper">
          <app-table-column-settings
            v-model="activeHeaders"
            :allHeaders="allHeaders"
            :listSettingsName="listSettingsName"
          />
        </div>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import { ALL_ORDER_TABLE_HEADERS, DEFAULT_HEADERS } from './model/constants.js'
import AppTableColumnSettings from '@/modules/common/components/tableColumnSettings'
import useHistorySettings from '@/shared/hooks/useHistorySettings'
import { ReportService } from '@/shared/services'

export default {
  name: 'OrdersTable',
  components: { AppTableColumnSettings },
  props: {
    mainFilters: Object,
    additionalFilters: Object,
    dateRange: { type: Array, required: true },
    priceWithVat: Boolean,
  },
  setup() {
    const listOptions = useHistorySettings({}, 'orders_table_list_options')
    return {
      listOptions,
    }
  },
  data() {
    return {
      loading: false,
      items: [],
      totalCount: 0,
      formName: 'ordersDetailReport',
      listSettingsName: 'ordersDetailReportFields',

      settings: {},
      activeHeaders: [],
      allHeaders: ALL_ORDER_TABLE_HEADERS,
      defaultHeaders: DEFAULT_HEADERS,
    }
  },
  computed: {
    filteredHeaders() {
      return this.allHeaders.filter((i) => this.activeHeaders.includes(i.value))
    },
    preparedItems() {
      if (!Array.isArray(this.items)) return []
      return this.items.map((i) => ({
        ...i,
        status: this.$store.getters.orderStatusesMap.get(i.status),
        orderDate: new Date(i.orderDate).toLocaleString(),
        client: this.$store.getters.partnersMap.get(i.client)?.name || '-',
        truck: this.$store.getters.trucksMap.get(i.truckId)?.regNum || '-',
        driver: this.$store.getters.driversMap.get(i.driverId)?.fullName || '-',
        tk: this.$store.getters.tkNamesMap.get(i.tkName)?.name || '-',
        orderType: this.$store.getters.orderAnalyticTypesMap.get(i.orderType),
        addressesLoading: i.loadingAddressIds
          ?.map((a) => this.$store.getters.addressMap.get(a)?.shortName)
          .join(', '),
        addressesUnloading: i.unloadingAddressIds
          ?.map((a) => this.$store.getters.addressMap.get(a)?.shortName)
          .join(', '),
        regionsLoading: i.loadingRegions
          ?.map((r) => this.$store.getters.regionsMap.get(r)?.name)
          .join(', '),
        regionsUnloading: i.unloadingRegions
          ?.map((r) => this.$store.getters.regionsMap.get(r)?.name)
          .join(', '),
        zonesLoading: i.loadingZones
          ?.map((r) => this.$store.getters.zonesMap.get(r)?.name)
          .join(', '),
        zonesUnloading: i.unloadingZones
          ?.map((r) => this.$store.getters.zonesMap.get(r)?.name)
          .join(', '),
        citiesLoading: i.loadingCities
          ?.map((r) => this.$store.getters.citiesMap.get(r)?.name)
          .join(', '),
        citiesUnloading: i.unloadingCities
          ?.map((r) => this.$store.getters.citiesMap.get(r)?.name)
          .join(', '),
        capacityType: i.capacityType,
        truckKind: this.$store.getters.truckKindsMap.get(i.truckKind),
        outsourceCostsWithVat: Intl.NumberFormat().format(
          i.outsourceCostsWithVat
        ),
        outsourceCostsWOVat: Intl.NumberFormat().format(i.outsourceCostsWOVat),
        basePrePrice: this.getBasePrice(i, 'prePrices', this.priceWithVat),
        basePrice: this.getBasePrice(i, 'prices', this.priceWithVat),
        price: Intl.NumberFormat().format(
          Math.round(i[this.priceWithVat ? 'totalWithVat' : 'totalWOVat'])
        ),
        kPrice: Intl.NumberFormat().format(
          Math.round(
            i[this.priceWithVat ? 'totalWithVat' : 'totalWOVat'] / 1000
          )
        ),
      }))
    },
  },
  watch: {
    dateRange: {
      deep: true,
      handler: function () {
        this.clearItems()
        this.getData()
      },
    },
    mainFilters: {
      deep: true,
      handler: async function () {
        this.clearItems()
        await this.getData()
      },
    },
    additionalFilters: {
      deep: true,
      handler: function () {
        this.listOptions.page = 1
        this.getData()
      },
    },
    listOptions: {
      handler: function () {
        this.getData()
      },
    },
  },
  created() {
    const fields = JSON.parse(localStorage.getItem(this.listSettingsName))
    if (!fields || fields.length === 0) this.activeHeaders = this.defaultHeaders
    else this.activeHeaders = fields

    if (this.$store.getters.formSettingsMap.has(this.formName))
      this.settings = this.$store.getters.formSettingsMap.get(this.formName)
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('setFormSettings', {
      formName: this.formName,
      settings: { ...this.settings },
    })
    next()
  },
  methods: {
    getBasePrice(order, type, withVat) {
      if (!['prices', 'prePrices'].includes(type))
        throw new Error('ordersTable : getBasePrice : price type error!!!')

      const price = order[type]
      if (!price?.base) return 0

      return Intl.NumberFormat().format(
        Math.round(price.base[withVat ? 'price' : 'priceWOVat'])
      )
    },

    clearItems() {
      this.items = []
      this.totalCount = 0
    },
    async getData() {
      try {
        this.loading = true
        const { items, count } = await ReportService.grossProfitDetailsData({
          company: this.$store.getters.directoriesProfile,
          dateRange: this.dateRange,
          mainFilters: this.mainFilters,
          additionalFilters: this.additionalFilters,
          listOptions: {
            ...this.listOptions,
            priceWithVat: this.priceWithVat,
          },
        })
        this.items = items || []
        this.totalCount = count || 0
        this.loading = false
      } catch (e) {
        this.loading = false
        this.$store.commit('setError', e.message)
      }
    },
    dblClickRow(_, { item }) {
      this.$router.push(`/orders/${item._id}`)
    },
  },
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
