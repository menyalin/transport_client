<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-buttons-panel
          panel-type="list"
          :disabled-refresh="!directoriesProfile"
          @submit="createDriver"
          @refresh="refresh"
        />
        <v-data-table
          :headers="headers"
          :items="filteredDrivers"
          :search="search"
          :loading="loading"
          dense
          :footer-props="{
            'items-per-page-options': [50, 100, 200],
          }"
          @dblclick:row="dblClickRow"
        >
          <template v-slot:top>
            <div class="filter-wrapper">
              <v-select
                v-model="scheduleFilter"
                dense
                outlined
                hide-details
                clearable
                label="В работе / Выходной"
                :items="scheduleOptions"
              />
              <v-select
                v-model="tkNameFilter"
                dense
                outlined
                hide-details
                label="ТК"
                clearable
                :items="tkNames"
                item-value="_id"
                item-text="name"
              />
              <v-text-field
                v-model="search"
                outlined
                hide-details
                dense
                label="Быстрый поиск"
              />
            </div>
          </template>
          <template v-slot:[`item.schedule`]="{ item }">
            {{ driverInCrew(item) }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  name: 'DriverList',
  components: {
    AppButtonsPanel,
  },
  data: () => ({
    search: null,
    scheduleFilter: null,
    scheduleOptions: [
      { value: 'busy', text: 'В работе' },
      { value: 'free', text: 'Выходной' },
    ],
    tkNameFilter: null,
    headers: [
      { value: 'fullName', text: 'ФИО' },
      { value: 'phone', text: 'Телефон' },
      { value: 'phone2', text: 'Телефон2' },
      { value: 'schedule', text: 'Смена' },
    ],
  }),
  computed: {
    ...mapGetters([
      'drivers',
      'loading',
      'directoriesProfile',
      'tkNames',
      'actualCrews',
    ]),
    filteredDrivers() {
      return this.drivers
        .filter((item) =>
          this.tkNameFilter ? item.tkName?._id === this.tkNameFilter : true
        )
        .filter(this.scheduleFilterHandler)
    },
  },
  created() {
    this.$store.dispatch('getDrivers', true)
  },
  methods: {
    scheduleFilterHandler(driver) {
      if (!this.scheduleFilter) return true
      if (this.scheduleFilter === 'free')
        return !this.actualCrews.find((crew) => crew.driver === driver._id)
      if (this.scheduleFilter === 'busy')
        return !!this.actualCrews.find((crew) => crew.driver === driver._id)
    },
    createDriver() {
      this.$router.push({ name: 'DriverCreate' })
    },
    refresh() {
      this.$store.dispatch('getDrivers', true)
    },
    dblClickRow(_, { item }) {
      this.$router.push(`drivers/${item._id}`)
    },
    driverInCrew(driver) {
      const crew = this.actualCrews.find((item) => item.driver === driver._id)
      if (crew) return `C ${moment(crew.startDate).format('DD.MM.YYYY HH:00')}`
      else return 'Выходной'
    },
  },
}
</script>
<style scoped>
.filter-wrapper {
  display: flex;
  flex-direction: row;
}
.filter-wrapper > * {
  padding: 0px 10px;
}
</style>
