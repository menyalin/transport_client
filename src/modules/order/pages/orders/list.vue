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
      />
      <v-autocomplete
        v-model="settings.truck"
        dense
        clearable
        :items="trucks"
        outlined
        hide-details
        label="Грузовик"
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
        :headers="headers"
        dense
        :loading="loading"
        :items="orders"
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
      </v-data-table>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import service from '@/modules/order/services/order.service'
import AppDateRange from '@/modules/common/components/dateRange'
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import { mapGetters } from 'vuex'

const _initPeriod = () => {
  const todayM = moment()
  return [
    todayM.add(-10, 'd').format('YYYY-MM-DD'),
    todayM.add(20, 'd').format('YYYY-MM-DD'),
  ]
}

export default {
  name: 'ListOrder',
  components: {
    AppDateRange,
    AppButtonsPanel,
  },
  data: () => ({
    formName: 'orderList',
    loading: false,
    settings: {
      truck: null,
      status: null,
      period: _initPeriod(),
      listOptions: {
        page: 1,
        itemsPerPage: 50,
      },
    },
    count: 0,
    orders: [],
    headers: [
      {
        value: 'plannedDate',
        text: 'Дата погрузки',
        sortable: false,
        width: '12rem',
      },
      {
        value: 'truck',
        text: 'Грузовик',
        sortable: false,
        align: 'center',
        width: '10rem',
      },
      { value: 'state.status', text: 'Статус', sortable: false },
      { value: 'client.client', text: 'Клиент', sortable: false },
      { value: 'client.num', text: 'Номер заказа клиента', sortable: false },
    ],
  }),
  computed: {
    ...mapGetters(['directoriesProfile', 'orderStatuses']),
    partnersMap() {
      return this.$store.getters.partnersMap
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
  },
  watch: {
    settings: {
      deep: true,
      handler: function () {
        this.getData()
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
          truck: this.settings.truck,
          status: this.settings.status,
          profile: this.directoriesProfile,
          startDate: moment(this.settings.period[0]).toISOString(),
          endDate: moment(this.settings.period[1]).toISOString(),
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
  grid-template-columns: 300px 250px 250px;
  align-items: start;
}
</style>
