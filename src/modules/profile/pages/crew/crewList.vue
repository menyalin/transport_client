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
        <div class="filters">
          <v-select
            v-model="settings.tkName"
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
            v-model="settings.crewStatus"
            dense
            :items="crewStatuses"
            outlined
            hide-details
            label="Состояние экипажа"
          />
        </div>
        <v-data-table
          :headers="headers"
          :items="list"
          height="72vh"
          :loading="loading"
          :serverItemsLength="count"
          :footer-props="{
            'items-per-page-options': [50, 100, 200],
          }"
          :options.sync="settings.listOptions"
          dense
          @dblclick:row="dblClickRow"
        >
          <template v-slot:[`item.tkName`]="{ item }">
            {{ $store.getters.tkNamesMap.get(item.tkName).name }}
          </template>
          <template v-slot:[`item.startDate`]="{ item }">
            {{ new Date(item.startDate).toLocaleString() }}
          </template>
          <template v-slot:[`item.endDate`]="{ item }">
            {{ item.endDate ? new Date(item.endDate).toLocaleString() : null }}
          </template>
          <template v-slot:[`item.driver`]="{ item }">
            {{ getDriverName(item) }}
          </template>
          <template v-slot:[`item.truck`]="{ item }">
            {{ getTruckName(item, 'truck') }}
          </template>
          <template v-slot:[`item.trailer`]="{ item }">
            {{ getTruckName(item, 'trailer') }}
          </template>
          <template v-slot:[`item.isActual`]="{ item }">
            <v-icon>
              {{ isActualCrew(item) ? 'mdi-check' : 'mdi-minus' }}
            </v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import service from '@/modules/profile/services/crew.service'
import { mapGetters } from 'vuex'

export default {
  name: 'CrewList',
  components: {
    AppButtonsPanel,
  },
  data: () => ({
    formName: 'crewList',
    loading: false,
    list: [],
    count: null,
    settings: {
      tkName: null,
      crewStatus: 'active',
      listOptions: {
        page: 1,
        itemsPerPage: 50,
      },
    },
    crewStatuses: [
      { value: 'all', text: 'Все' },
      { value: 'active', text: 'В работе' },
      { value: 'inactive', text: 'Завершенные' },
    ],
    dateFormat: 'YYYY-MM-DD HH:mm',

    headers: [
      { value: 'tkName', text: 'ТК', sortable: false },
      { value: 'startDate', text: 'Начало смены', sortable: false },
      { value: 'endDate', text: 'Завершение смены', sortable: false },
      { value: 'driver', text: 'Водитель', sortable: false },
      { value: 'truck', text: 'Грузовик', sortable: false },
      { value: 'trailer', text: 'Прицеп', sortable: false },
      { value: 'isActual', text: 'В работе', sortable: false },
    ],
  }),
  computed: {
    ...mapGetters(['directoriesProfile', 'tkNames']),
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
    async getData() {
      try {
        this.loading = true
        const data = await service.getList({
          profile: this.directoriesProfile,
          skip:
            (this.settings.listOptions?.page - 1) *
            this.settings.listOptions?.itemsPerPage,
          limit: this.settings.listOptions?.itemsPerPage,
          tkName: this.settings.tkName,
          state: this.settings.crewStatus,
        })
        console.log(data)
        this.list = data.items
        this.count = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
        this.$store.commit('setError', e.message)
      }
    },

    create() {
      this.$router.push({ name: 'CrewCreate' })
    },
    refresh() {
      this.getData()
    },
    dblClickRow(_, { item }) {
      if (item) this.$router.push(`crews/${item._id}`)
    },
    getTruckName(crew, field) {
      const lastIdx = crew.transport.length - 1
      const truckId = crew.transport[lastIdx][field]
      return truckId ? this.$store.getters.trucksMap.get(truckId).regNum : ' - '
    },
    getDriverName(crew) {
      if (!!crew.driver && this.$store.getters.driversMap.has(crew.driver))
        return this.$store.getters.driversMap.get(crew.driver).fullName
      else return ' - '
    },
    isActualCrew(crew) {
      const lastIdx = crew.transport.length - 1
      return !crew.transport[lastIdx].endDate
    },
  },
}
</script>
<style>
.filters {
  display: grid;
  grid-template-columns: 250px 250px;
  gap: 10px;
}
.filters > div {
  margin: 0px 10px;
}
</style>
