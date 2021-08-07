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
          :items="crews"
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
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import { mapGetters } from 'vuex'
export default {
  name: 'CrewList',
  components: {
    AppButtonsPanel,
  },
  data: () => ({
    headers: [
      { value: 'tkName.name', text: 'ТК' },
      { value: 'truckName', text: 'Грузовик' },
      { value: 'trailerName', text: 'Прицеп' },
      { value: 'driverName', text: 'Водитель' },
      { value: 'driver2Name', text: 'Водитель 2' },
      { value: 'startDate', text: 'Дата начала' },
      { value: 'note', text: 'Примечание' },
    ],
  }),
  computed: {
    ...mapGetters(['crews', 'loading', 'directoriesProfile']),
  },
  created() {
    this.$store.dispatch('getCrews')
  },
  methods: {
    create() {
      this.$router.push({ name: 'CrewCreate' })
    },
    refresh() {
      this.$store.dispatch('getCrews', true)
    },
    dblClickRow(_, { item }) {
      this.$router.push(`crews/${item._id}`)
    },
  },
}
</script>
<style></style>
