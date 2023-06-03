<template>
  <v-container fluid>
    <v-row class="data-table-wrapper">
      <v-col>
        <buttons-panel
          panel-type="list"
          :disabledSubmit="!$store.getters.hasPermission('driver:write')"
          @submit="createDriver"
          @refresh="refresh"
        />
        <v-data-table
          :headers="headers"
          :items="filteredDrivers"
          :search="settings.search"
          :loading="loading"
          fixed-header
          height="71vh"
          dense
          :footer-props="{
            'items-per-page-options': [50, 100, 200],
          }"
          :options.sync="settings.listOptions"
          @dblclick:row="dblClickRow"
        >
          <template #[`item.medBookState.validDays`]="{ item }">
            <v-chip
              v-if="item.medBookState.validDays !== null"
              small
              class="my-0 mx-4"
              :color="item.medBookState.color"
            >
              {{ item.medBookState.validDays }}
            </v-chip>
          </template>

          <template #top>
            <div class="filter-wrapper">
              <v-select
                v-model="settings.tkNameFilter"
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
                v-model="settings.workState"
                label="Статус"
                :items="workStateItems"
                outlined
                dense
              />
              <v-select
                v-model="settings.stuffStatus"
                label="Сотрудники"
                :items="stuffStatusItems"
                outlined
                dense
              />
              <v-text-field
                v-model="settings.search"
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
import { CrewService } from '@/shared/services'
import { ButtonsPanel } from '@/shared/ui'
import { mapGetters } from 'vuex'

export default {
  name: 'DriverList',
  components: {
    ButtonsPanel,
  },
  data: () => ({
    formName: 'DriverList',
    loading: false,
    crews: [],
    stuffStatusItems: [
      { value: 'all', text: 'Все' },
      { value: 'employee', text: 'Действующие' },
      { value: 'fired', text: 'Уволены' },
    ],
    workStateItems: [
      { value: 'all', text: 'Все' },
      { value: 'active', text: 'В работе' },
      { value: 'holiday', text: 'Выходной' },
    ],
    settings: {
      workState: 'all',
      stuffStatus: 'employee',
      listOptions: {},
      search: null,
      tkNameFilter: null,
    },

    headers: [
      { value: 'tkName.name', text: 'ТК' },
      { value: 'fullName', text: 'ФИО' },
      { value: 'phone', text: 'Телефон' },
      { value: 'phone2', text: 'Телефон2' },
      { value: 'state', text: 'Текущее состояние', align: 'center' },
      { value: 'truckNumber', text: 'Грузовик', align: 'center' },
      { value: 'daysInWork', text: 'Дней в смене', align: 'center' },
      // {
      //   value: 'medBookState.validDays',
      //   text: 'Мед.книжка, дней',
      //   align: 'center',
      // },
    ],
  }),
  computed: {
    ...mapGetters(['drivers', 'directoriesProfile', 'tkNames']),
    filteredDrivers() {
      const tpmDrivers = this.drivers.slice()
      return tpmDrivers
        .filter((item) =>
          this.settings.tkNameFilter
            ? item.tkName?._id === this.settings.tkNameFilter
            : true
        )
        .filter(this.stateFilterHandler)
        .filter(this.stuffStatusFilterHandler)
        .map((d) => ({
          ...d,
          state: this.crewsMapByDriver.has(d._id) ? 'В работе' : 'Выходной',
          daysInWork: this.getDaysInWork(d._id),
          truckNumber: this.getTruckNumber(d._id),
        }))
    },
    crewsMapByDriver() {
      let tmpMap = new Map()
      this.crews.forEach((cr) => {
        tmpMap.set(cr.driver, { ...cr })
      })
      return tmpMap
    },
  },

  created() {
    if (this.$store.getters.formSettingsMap.has(this.formName))
      this.settings = this.$store.getters.formSettingsMap.get(this.formName)
    this.$store.dispatch('getDrivers')
    this.getData()
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('setFormSettings', {
      formName: this.formName,
      settings: { ...this.settings },
    })
    next()
  },
  methods: {
    createDriver() {
      this.$router.push({ name: 'DriverCreate' })
    },
    stateFilterHandler(driver) {
      if (this.settings.workState === 'all') return true
      if (this.settings.workState === 'holiday')
        return !this.crewsMapByDriver.has(driver._id)
      else return this.crewsMapByDriver.has(driver._id)
    },
    stuffStatusFilterHandler(driver) {
      if (this.settings.stuffStatus === 'all') return true
      if (this.settings.stuffStatus === 'employee') return !driver.dismissalDate
      if (this.settings.stuffStatus === 'fired') return driver.dismissalDate
    },
    async getData() {
      this.loading = true
      this.crews = await CrewService.getActualCrewsOnCurrentDate({
        profile: this.directoriesProfile,
      })
      this.loading = false
    },
    refresh() {
      this.$store.dispatch('getDrivers', true)
      this.getData()
    },
    dblClickRow(_, { item }) {
      this.$router.push(`drivers/${item._id}`)
    },
    getDaysInWork(driverId) {
      if (!this.crewsMapByDriver.has(driverId)) return null
      else {
        const startDate = new Date(
          this.crewsMapByDriver.get(driverId).startDate
        )
        const today = new Date()
        return Math.floor((today - startDate) / (1000 * 60 * 60 * 24))
      }
    },
    getTruckNumber(driverId) {
      if (!this.crewsMapByDriver.has(driverId)) return null
      else {
        const truckId = this.crewsMapByDriver.get(driverId).transport.truck
        return this.$store.getters.trucksMap.get(truckId)?.regNum || null
      }
    },
  },
}
</script>
<style scoped>
.filter-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 15px;
}
</style>
