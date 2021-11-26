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
        <div class="filter-wrapper">
          <app-date-range v-model="settings.period" />
        </div>
        <v-data-table
          :headers="headers"
          :items="list"
          :loading="loading"
          height="73vh"
          dense
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
      period: _initPeriod(),
      listOptions: {
        page: 1,
        itemsPerPage: 50,
      },
    },
    list: [],
    headers: [
      { value: 'title', text: 'Заголовок' },
      { value: 'type', text: 'Тип' },
      { value: 'truck', text: 'Грузовик' },
      { value: 'startPositionDate', text: 'Начало' },
      { value: 'endPositionDate', text: 'Конец' },
      { value: 'note', text: 'Примечание' },
    ],
  }),
  computed: {
    ...mapGetters([, 'directoriesProfile']),
    downtimeTypesHash() {
      return this.$store.getters.downtimeTypesHash
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
      try {
        this.loading = true
        this.list = await service.getList({
          company: this.directoriesProfile,
          startDate: this.settings.period[0],
          endDate: this.settings.period[1],
          skip:
            this.settings.listOptions.itemsPerPage *
            (this.settings.listOptions.page - 1),
          limit: this.settings.listOptions.itemsPerPage,
        })
        this.loading = false
      } catch (e) {
        this.loading = false
        this.$store.commit('setError', e.message)
      }
    },
  },
}
</script>
<style></style>
