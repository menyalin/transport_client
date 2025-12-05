<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <ButtonsPanel
          panelType="list"
          :disabledRefresh="!directoriesProfile"
          :disabledSubmit="!$store.getters.hasPermission('downtime:write')"
          @submit="create"
          @refresh="refresh"
        />
        <div class="filter-wrapper">
          <DateRangeInput :modelValue="settings.period" />
          <v-autocomplete
            :modelValue="settings.truckFilter"
            label="Грузовик"
            :items="trucks"
            itemTitle="regNum"
            itemValue="_id"
           
            variant="outlined"
       density="compact"
            hideDetails
            clearable
            :style="{ maxWidth: '250px' }"
          />
          <v-autocomplete
            :modelValue="settings.partner"
            label="Партнер"
            :items="partners"
            itemTitle="name"
            itemValue="_id"
            autoSelectFirst
           
            variant="outlined"
       density="compact"
            hideDetails
            clearable
            :style="{ maxWidth: '350px' }"
          />
        </div>
        <v-data-table
          v-model:options="settings.listOptions"
          :headers="headers"
          :items="list"
          :loading="loading"
          height="73vh"
         
          fixedHeader
          :itemsLength="count"
          :footerProps="{
            'items-per-page-options': [50, 100, 200],
          }"
          @dblclick:row="dblClickRow"
        >
          <template #[`item.type`]="{ item }">
            <span>{{ downtimeTypesHash[item.type] }}</span>
          </template>
          <template #[`item.partner`]="{ item }">
            <span>
              {{
                $store.getters.partnersMap.has(item.partner) ? $store.getters.partnersMap.get(item.partner).name : null
              }}
            </span>
          </template>
          <template #[`item.truck`]="{ item }">
            <span>{{ trucksHash[item.truck] ? trucksHash[item.truck].regNum : '-' }}</span>
          </template>
          <template #[`item.startPositionDate`]="{ item }">
            <span>{{ new Date(item.startPositionDate).toLocaleString() }}</span>
          </template>
          <template #[`item.endPositionDate`]="{ item }">
            <span>{{ new Date(item.endPositionDate).toLocaleString() }}</span>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
import { DowntimeService } from '@/shared/services'

import { ButtonsPanel, DateRangeInput } from '@/shared/ui'

const _initPeriod = () => {
  const todayM = dayjs()
  return [todayM.add(-10, 'd').format('YYYY-MM-DD'), todayM.add(10, 'd').format('YYYY-MM-DD')]
}

export default {
  name: 'DowntimeList',
  components: {
    ButtonsPanel,
    DateRangeInput,
  },
  data: () => ({
    formName: 'downtimeList',
    loading: false,
    settings: {
      truckFilter: null,
      partner: null,
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
      { value: 'partner', text: 'Партнер', sortable: false },
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
    partners() {
      return this.$store.getters.partners.filter(i => i.isService)
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
        const data = await DowntimeService.getList({
          company: this.directoriesProfile,
          startDate: this.settings.period[0],
          endDate: this.settings.period[1],
          truckFilter: this.settings.truckFilter,
          partner: this.settings.partner,
          skip: this.settings.listOptions.itemsPerPage * (this.settings.listOptions.page - 1),
          limit: this.settings.listOptions.itemsPerPage,
          sortBy: this.settings.listOptions.sortBy.length ? this.settings.listOptions.sortBy[0] : null,
          sortDesc: this.settings.listOptions.sortDesc.length ? this.settings.listOptions.sortDesc[0] : null,
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
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 15px;
    margin-bottom: 15px;
  }
</style>
