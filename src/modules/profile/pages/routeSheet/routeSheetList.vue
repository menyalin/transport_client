<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-buttons-panel
          panel-type="list"
          :disabled-refresh="!directoriesProfile"
          @submit="create"
          @refresh="refresh"
        />
        <v-data-table
          :headers="headers"
          :items="routeSheets"
          :loading="loading"
          dense
          :footer-props="{ 'items-per-page-options': [50, 100, 200] }"
          @dblclick:row="dblClickRow"
        >
          <template v-slot:[`item.driverName`]="{ item }">
            <span> {{ item.driver.surname + ' ' + item.driver.name }} </span>
          </template>
          <template v-slot:[`item.driver2Name`]="{ item }">
            <span v-if="item.driver2">
              {{ item.driver2.surname + ' ' + item.driver2.name }}
            </span>
          </template>
          <template v-slot:[`item.truckName`]="{ item }">
            <span>
              {{ item.truck.name ? item.truck.name : item.truck.regNum }}
            </span>
          </template>
          <template v-slot:[`item.trailerName`]="{ item }">
            <span v-if="item.trailer">
              {{ item.trailer.name ? item.trailer.name : item.trailer.regNum }}
            </span>
            <v-icon v-else>
              mdi-minus
            </v-icon>
          </template>
          <template v-slot:[`item.startDate`]="{ item }">
            <span>
              {{ new Date(item.startDate).toLocaleString() }}
            </span>
          </template>
          <template v-slot:[`item.endDate`]="{ item }">
            <span v-if="item.endDate">
              {{ new Date(item.endDate).toLocaleString() }}
            </span>
            <v-icon v-else>
              mdi-minus
            </v-icon>
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
  name: 'RouteSheetList',
  components: {
    AppButtonsPanel,
  },
  data: () => ({
    headers: [
      { value: 'truckName', text: 'Грузовик' },
      { value: 'trailerName', text: 'Прицеп' },
      { value: 'driverName', text: 'Водитель' },
      { value: 'driver2Name', text: 'Водитель 2' },
      { value: 'startDate', text: 'Дата начала' },
      { value: 'endDate', text: 'Дата окончания' },
      { value: 'note', text: 'Примечание' },
    ],
  }),
  computed: {
    ...mapGetters(['routeSheets', 'loading', 'directoriesProfile']),
  },
  created() {
    this.$store.dispatch('getRouteSheets')
  },
  methods: {
    create() {
      this.$router.push({ name: 'RouteSheetCreate' })
    },
    refresh() {
      this.$store.dispatch('getRouteSheets', true)
    },
    dblClickRow(_, { item }) {
      this.$router.push(`routeSheets/${item._id}`)
    },
  },
}
</script>
<style></style>
