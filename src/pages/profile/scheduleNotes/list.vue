<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <buttons-panel
          panel-type="list"
          :disabledSubmit="!$store.getters.hasPermission('scheduleNote:write')"
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
          <template #[`item.truck`]="{ item }">
            <span>{{
              trucksHash[item.truck] ? trucksHash[item.truck].regNum : '-'
            }}</span>
          </template>
          <template #[`item.startPositionDate`]="{ item }">
            <span>{{ new Date(item.startPositionDate).toLocaleString() }}</span>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import dayjs from 'dayjs'
import { ButtonsPanel } from '@/shared/ui'
import { ScheduleNoteService } from '@/shared/services'
import AppDateRange from '@/modules/common/components/dateRange'

const _initPeriod = () => {
  const todayM = dayjs()
  return [
    todayM.add(-10, 'd').format('YYYY-MM-DD'),
    todayM.add(10, 'd').format('YYYY-MM-DD'),
  ]
}

export default {
  name: 'ScheduleNoteList',
  components: {
    ButtonsPanel,
    AppDateRange,
  },
  data: () => ({
    formName: 'ScheduleNoteList',
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
      { value: 'text', text: 'Текст', sortable: false },
      { value: 'truck', text: 'Грузовик', sortable: true },
      { value: 'startPositionDate', text: 'Дата', sortable: true },
    ],
  }),
  computed: {
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
      this.$router.push({ name: 'ScheduleNoteCreate' })
    },
    refresh() {
      this.getData()
    },
    dblClickRow(_, { item }) {
      this.$router.push(`schedule_notes/${item._id}`)
    },
    async getData() {
      try {
        this.loading = true
        const data = await ScheduleNoteService.getList({
          company: this.$store.getters.directoriesProfile,
          startDate: new Date(this.settings.period[0]).toISOString(),
          endDate: new Date(this.settings.period[1]).toISOString(),
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
