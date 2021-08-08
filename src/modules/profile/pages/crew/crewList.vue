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
          :items="filteredCrews"
          :loading="loading"
          dense
          :footer-props="{ 'items-per-page-options': [50, 100, 200] }"
          @dblclick:row="dblClickRow"
        >
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
          <template v-slot:top>
            <div class="filter-wrapper">
              <div class="date-filter">
                <app-date-time-input
                  v-model="dateFilter"
                  hideTimeInput
                  hide-details
                  hidePrependIcon
                  label="Экипажи на дату"
                />
              </div>
              <div class="tkname-filter">
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
              </div>
            </div>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import AppDateTimeInput from '@/modules/common/components/dateTimeInput'

import { mapGetters } from 'vuex'
import moment from 'moment'

const _crewStartDateCompare = (a, b) => {
  if (new Date(a.startDate) > new Date(b.startDate)) return -1
  if (new Date(a.startDate) < new Date(b.startDate)) return 1
}

export default {
  name: 'CrewList',
  components: {
    AppButtonsPanel,
    AppDateTimeInput,
  },
  data: () => ({
    dateFormat: 'YYYY-MM-DD',
    tkNameFilter: null,
    dateFilter: null,
    headers: [
      { value: 'tkName.name', text: 'ТК' },
      { value: 'truckName', text: 'Грузовик' },
      { value: 'trailerName', text: 'Прицеп' },
      { value: 'driver.fullName', text: 'Водитель' },
      { value: 'startDate', text: 'Дата начала' },
      { value: 'note', text: 'Примечание' },
    ],
  }),
  computed: {
    ...mapGetters(['crews', 'loading', 'directoriesProfile', 'tkNames']),
    filteredCrews() {
      return this.crewsOnDate.filter((item) =>
        this.tkNameFilter ? item.tkName._id === this.tkNameFilter : true
      )
    },
    crewsOnDate() {
      if (!this.dateFilter)
        return this.crews.slice().sort(_crewStartDateCompare).reverse()

      const truckIds = new Set(this.crews.map((item) => item.truck._id))
      let sortedCrews = this.crews
        .filter((item) => new Date(item.startDate) <= new Date(this.dateFilter))
        .sort(_crewStartDateCompare)
      let result = []
      for (let truckId of truckIds) {
        for (let crew of sortedCrews) {
          if (crew.truck._id === truckId) {
            result.push(crew)
            break
          }
        }
      }
      return result.reverse()
    },
  },
  created() {
    this.$store.dispatch('getCrews', {})
    this.dateFilter = moment().format(this.dateFormat)
  },
  methods: {
    create() {
      this.$router.push({ name: 'CrewCreate' })
    },
    refresh() {
      this.$store.dispatch('getCrews', { directiveUpdate: true })
    },
    dblClickRow(_, { item }) {
      this.$router.push(`crews/${item._id}`)
    },
  },
}
</script>
<style>
.filter-wrapper {
  display: flex;
  flex-direction: row;
  padding: 10px;
}
.tkname-filter {
  padding: 10px;
  max-width: 15rem;
}
.date-filter {
  max-width: 8 rem;
  padding: 10px;
}
</style>
