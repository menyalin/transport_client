<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-buttons-panel
          panel-type="list"
          :disabled-refresh="!directoriesProfile"
          :disabledSubmit="!$store.getters.hasPermission('downtime:write')"
          @submit="create"
          @refresh="refresh"
        />
        <div class="filter-wrapper">
          <app-date-range v-model="settings.period" />
          <v-autocomplete
            v-model="settings.truckFilter"
            label="Грузовик"
            :items="trucks"
            item-text="regNum"
            item-value="_id"
            dense
            outlined
            hide-details
            clearable
          />
        </div>
        <v-data-table
          :headers="headers"
          :items="list"
          :loading="loading"
          height="73vh"
          dense
          fixed-header
          :serverItemsLength="count"
          :footer-props="{
            'items-per-page-options': [50, 100, 200],
          }"
          :options.sync="settings.listOptions"
          @dblclick:row="dblClickRow"
        >
          <template v-slot:[`item.type`]="{ item }">
            <span>{{ downtimeTypesHash[item.type] }}</span>
          </template>
          <template v-slot:[`item.truck`]="{ item }">
            <span>{{
              trucksHash[item.truck] ? trucksHash[item.truck].regNum : '-'
            }}</span>
          </template>
          <template v-slot:[`item.startPositionDate`]="{ item }">
            <span>{{ new Date(item.startPositionDate).toLocaleString() }}</span>
          </template>
          <template v-slot:[`item.endPositionDate`]="{ item }">
            <span>{{ new Date(item.endPositionDate).toLocaleString() }}</span>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import { mapGetters } from 'vuex'
import service from '@/modules/profile/services/downtime.service'
import moment from 'moment'
import AppDateRange from '@/modules/common/components/dateRange'

const _initPeriod = () => {
  const todayM = moment()
  return [
    todayM.add(-10, 'd').format('YYYY-MM-DD'),
    todayM.add(20, 'd').format('YYYY-MM-DD'),
  ]
}

export default {
  name: 'DowntimeList',
  components: {
    AppButtonsPanel,
    AppDateRange,
  },
  data: () => ({
    formName: 'downtimeList',
    loading: false,
    settings: {
      truckFilter: null,
      period: _initPeriod(),
      listOptions: {
        page: 1,
        itemsPerPage: 50,
      },
    },
    count: 0,
    list: [],
    headers: [
      { value: 'title', text: 'Заголовок', sortable: false },
      { value: 'type', text: 'Тип', sortable: false },
      { value: 'truck', text: 'Грузовик', sortable: true },
      { value: 'startPositionDate', text: 'Начало', sortable: true },
      { value: 'endPositionDate', text: 'Конец', sortable: false },
      { value: 'note', text: 'Примечание', sortable: false },
    ],
  }),
  computed: {
    ...mapGetters(['directoriesProfile']),
    downtimeTypesHash() {
      return this.$store.getters.downtimeTypesHash
    },
    trucks() {
      return this.$store.getters.trucksForSelect({ type: 'truck' })
    },
    trucksHash() {
      return this.$store.getters.trucksHash
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
      this.$router.push({ name: 'DowntimeCreate' })
    },
    refresh() {
      this.getData()
    },
    dblClickRow(_, { item }) {
      this.$router.push(`downtimes/${item._id}`)
    },
    async getData() {
      if (!this.directoriesProfile) {
        this.$router.push('/profile')
        return null
      }
      try {
        this.loading = true
        const data = await service.getList({
          company: this.directoriesProfile,
          startDate: this.settings.period[0],
          endDate: this.settings.period[1],
          truckFilter: this.settings.truckFilter,
          skip:
            this.settings.listOptions.itemsPerPage *
            (this.settings.listOptions.page - 1),
          limit: this.settings.listOptions.itemsPerPage,
          sortBy: this.settings.listOptions.sortBy.length
            ? this.settings.listOptions.sortBy[0]
            : null,
          sortDesc: this.settings.listOptions.sortDesc.length
            ? this.settings.listOptions.sortDesc[0]
            : null,
        })
        this.list = data.items
        this.count = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
        this.$store.commit('setError', e.message)
      }
    },
  },
}
</script>
<style scoped>
.filter-wrapper {
  display: grid;
  grid-template-columns: 300px 280px;
  align-items: center;
}
</style>
