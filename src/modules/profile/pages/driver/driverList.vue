<template>
  <v-container fluid>
    <v-row class="data-table-wrapper">
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
          fixed-header
          height="71vh"
          dense
          :footer-props="{
            'items-per-page-options': [50, 100, 200],
          }"
          @dblclick:row="dblClickRow"
        >
          <template v-slot:top>
            <div class="filter-wrapper">
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

              <v-select
                v-model="scheduleFilter"
                dense
                outlined
                hide-details
                clearable
                label="В работе / Выходной"
                :items="scheduleOptions"
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
      { value: 'tkName.name', text: 'ТК' },
      { value: 'fullName', text: 'ФИО' },
      { value: 'phone', text: 'Телефон' },
      { value: 'phone2', text: 'Телефон2' },
      { value: 'crewStatus', text: 'Смена' },
      { value: 'crewTruck', text: 'Тягач', sortable: false },
      { value: 'crewTrailer', text: 'Прицеп', sortable: false },
    ],
  }),
  computed: {
    ...mapGetters([
      'drivers',
      'trucks',
      'loading',
      'directoriesProfile',
      'tkNames',
      'actualCrews',
    ]),
    filteredDrivers() {
      const tpmDrivers = this.drivers.slice()
      tpmDrivers.forEach((driver) => {
        const crew = this.actualCrews.find((item) => item.driver === driver._id)
        if (!crew) {
          driver.crewStatus = 'Выходной'
        } else {
          driver.crewStatus = `C ${moment(crew.startDate).format(
            'DD.MM.YYYY HH:00'
          )}`
          const truck = this.trucks.find((item) => item._id === crew.truck)
          driver.crewTruck = truck?.regNum
          const trailer = this.trucks.find((item) => item._id === crew.trailer)
          driver.crewTrailer = trailer?.regNum
        }
      })
      return tpmDrivers
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
