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
          :search="settings.search"
          :headers="filteredHeaders"
          dense
          fixed-header
          height="72vh"
          :footer-props="{
            'items-per-page-options': [50, 100, 200],
          }"
          :options.sync="settings.listOptions"
          :items="filteredTrucks"
          :loading="loading"
          @dblclick:row="dblClickRow"
        >
          <template v-slot:[`item.type`]="{ item }">
            <span>{{ truckTypesHash[item.type] }}</span>
          </template>
          <template v-slot:top>
            <div class="filter-wrapper">
              <app-table-column-settings
                v-model="activeHeaders"
                :allHeaders="allHeaders"
                :listSettingsName="listSettingsName"
              />
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
                v-model="settings.truckFilter"
                dense
                outlined
                hide-details
                label="Тип транспорта"
                clearable
                :items="truckFilterOptions"
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
import CrewService from '../../services/crew.service'
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import AppTableColumnSettings from '@/modules/common/components/tableColumnSettings'
import { mapGetters } from 'vuex'
export default {
  name: 'TruckList',
  components: {
    AppButtonsPanel,
    AppTableColumnSettings,
  },
  data: () => ({
    formName: 'TruckList',
    listSettingsName: 'truckListFields',
    loading: false,
    activeHeaders: [],
    defaultHeaders: [
      'order',
      'tkName.name',
      'type',
      'regNum',
      'liftCapacityType',
      'pltCount',
      'brand',
      'currentDriver',
      'permanentDriverCount',
      'temporaryDriverCount',
    ],
    crews: [],
    settings: {
      tkNameFilter: null,
      search: null,
      truckFilter: null,
      listOptions: {},
    },
    truckFilterOptions: [
      { text: 'Тягачи', value: '20tn' },
      { text: '10-ки', value: '10tn' },
      { text: 'Прицепы', value: 'trailers' },
    ],
    allHeaders: [
      { value: 'order', text: 'Индекс' },
      { value: 'tkName.name', text: 'ТК' },
      { value: 'type', text: 'Тип' },
      { value: 'regNum', text: 'Гос.номер' },
      { value: 'liftCapacityType', text: 'Груз-cть, т', width: '15rem' },
      { value: 'pltCount', text: 'Плт' },
      { value: 'brand', text: 'Марка' },
      { value: 'currentDriver', text: 'Водитель' },
      {
        value: 'permanentDriverCount',
        text: 'Закреп. водители',
        align: 'center',
        width: '10rem',
      },
      {
        value: 'temporaryDriverCount',
        text: 'Времен. водители',
        align: 'center',
        width: '10rem',
      },
      {
        value: 'additionalDetails.transponderNumber',
        text: 'Транспондер',
        align: 'center',
      },
      {
        value: 'additionalDetails.platonNumber',
        text: 'Платон',
        align: 'center',
      },
      {
        value: 'additionalDetails.fuelCardNumber',
        text: 'Топл.карта',
        align: 'center',
      },
      {
        value: 'sts',
        text: 'СТС',
        align: 'center',
      },
      {
        value: 'win',
        text: 'ВИН',
        align: 'center',
      },
      {
        value: 'owner',
        text: 'Собственник',
        align: 'center',
      },
      {
        value: 'issueYear',
        text: 'Год выпуска',
        align: 'center',
      },
    ],
  }),
  computed: {
    ...mapGetters([
      'trucks',
      'directoriesProfile',
      'truckTypesHash',
      'tkNames',
    ]),
    filteredHeaders() {
      return this.allHeaders.filter((i) => this.activeHeaders.includes(i.value))
    },
    filteredTrucks() {
      return this.trucks
        .filter((item) =>
          this.settings.tkNameFilter
            ? item.tkName._id === this.settings.tkNameFilter
            : true
        )
        .filter((item) => {
          switch (this.settings.truckFilter) {
            case '20tn':
              return item.type === 'truck' && item.liftCapacityType === 20
            case '10tn':
              return item.type === 'truck' && item.liftCapacityType === 10
            case 'trailers':
              return item.type === 'trailer'
            default:
              return true
          }
        })
        .map((t) => ({
          ...t,
          currentDriver: this.getDriverName(t._id),
        }))
    },
    crewsMapByTruck() {
      let tmpMap = new Map()
      this.crews.forEach((cr) => {
        tmpMap.set(cr.transport.truck, { ...cr })
      })
      return tmpMap
    },
  },
  created() {
    const fields = JSON.parse(localStorage.getItem(this.listSettingsName))
    if (!fields || fields.length === 0) this.activeHeaders = this.defaultHeaders
    else this.activeHeaders = fields

    if (this.$store.getters.formSettingsMap.has(this.formName))
      this.settings = this.$store.getters.formSettingsMap.get(this.formName)
    this.$store.dispatch('getTrucks')
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
    async getData() {
      this.loading = true
      this.crews = await CrewService.getActualCrewsOnCurrentDate({
        profile: this.directoriesProfile,
      })
      this.loading = false
    },
    create() {
      this.$router.push({ name: 'TruckCreate' })
    },
    refresh() {
      this.$store.dispatch('getTrucks', true)
      this.getData()
    },
    dblClickRow(_, { item }) {
      this.$router.push(`trucks/${item._id}`)
    },
    getDriverName(truckId) {
      if (!this.crewsMapByTruck.has(truckId)) return null
      const driverId = this.crewsMapByTruck.get(truckId).driver
      return this.$store.getters.driversMap.get(driverId)?.fullName || null
    },
  },
}
</script>
<style scoped>
.filter-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.filter-wrapper > * {
  padding: 0px 10px;
}
</style>
