<template>
  <div>
    <app-buttons-panel
      panel-type="list"
      :disabled-refresh="!directoriesProfile"
      @submit="create"
      @refresh="refresh"
    />
    <div class="filter-wrapper">
      <app-date-range :period="datePeriod" />
    </div>
    <div class="table-wrapper">
      <v-data-table
        :headers="headers"
        dense
        :loading="loading"
        :items="orders"
        fixed-header
        height="72vh"
        :footer-props="{
          'items-per-page-options': [50, 100, 200],
        }"
        @dblclick:row="dblClickRow"
      >
        <template v-slot:[`item.createdAt`]="{ item }">
          {{ new Date(item.createdAt).toLocaleString() }}
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
import service from '@/modules/order/services/order.service'
import AppDateRange from '@/modules/common/components/dateRange'
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import { mapGetters } from 'vuex'

export default {
  name: 'ListOrder',
  components: {
    AppDateRange,
    AppButtonsPanel,
  },
  data: () => ({
    loading: false,
    datePeriod: ['2021-10-18', '2021-10-25'],
    orders: [],
    headers: [
      { value: 'createdAt', text: 'Создан' },
      { value: 'client.client', text: 'Клиент' },
      { value: 'client.num', text: 'Номер заказа клиента' },
    ],
  }),
  computed: {
    ...mapGetters(['directoriesProfile']),
    partnersMap() {
      return this.$store.getters.partnersMap
    },
  },
  created() {
    this.getOrders()
  },
  methods: {
    create() {
      this.$router.push({ name: 'CreateOrder' })
    },
    refresh() {
      this.getOrders()
    },
    async getOrders() {
      try {
        this.loading = true
        this.orders = await service.getByDirectoriesProfile({
          profile: this.directoriesProfile,
        })
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
  display: flex;
  flex-direction: row;
}
</style>
