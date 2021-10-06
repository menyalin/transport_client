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
          <div>
            <v-select
              :value="tkNameForCrews"
              dense
              outlined
              hide-details
              label="ТК"
              clearable
              :items="tkNames"
              item-value="_id"
              item-text="name"
              @change="setTkNameFilter"
            />
          </div>
        </div>
        <v-data-table
          :headers="headers"
          :items="crews"
          dense
          @dblclick:row="dblClickRow"
        >
          <template v-slot:[`item.startDate`]="{ item }">
            {{ new Date(item.startDate).toLocaleString() }}
          </template>
          <template v-slot:[`item.endDate`]="{ item }">
            {{ item.endDate ? new Date(item.endDate).toLocaleString() : null }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
// import AppDateTimeInput from '@/modules/common/components/dateTimeInput'

import { mapGetters } from 'vuex'

export default {
  name: 'CrewList',
  components: {
    AppButtonsPanel,
  },
  data: () => ({
    dateFormat: 'YYYY-MM-DD HH:mm',
    headers: [
      { value: 'tkName.name', text: 'ТК' },
      { value: 'startDate', text: 'Начало смены' },
      { value: 'endDate', text: 'Завершение смены' },
      { value: 'driver.fullName', text: 'Водитель' },
    ],
  }),
  computed: {
    ...mapGetters([
      'crewsByTruck',
      'directoriesProfile',
      'tkNames',
      'crews',
      'dateForCrews',
      'tkNameForCrews',
    ]),
    dateFilter() {
      if (!this.dateForCrews) return null
      return this.dateForCrews.format(this.dateFormat)
    },
  },
  created() {
    this.$store.dispatch('getCrews', {})
  },
  methods: {
    createWithCopy(crew) {
      this.$router.push({
        name: 'CrewCreate',
        params: {
          tkName: crew.tkName._id,
          truck: crew.truck._id,
          trailer: crew.trailer?._id,
          driver: crew.driver?._id,
        },
      })
    },
    setTkNameFilter(val) {
      this.$store.commit('setTkNameForCrews', val)
    },
    create() {
      this.$router.push({ name: 'CrewCreate' })
    },
    refresh() {
      this.$store.dispatch('getCrews', { directiveUpdate: true })
    },
    dblClickRow(_, { item }) {
      if (item) this.$router.push(`crews/${item._id}`)
    },
  },
}
</script>
<style>
.filters {
  display: flex;
  flex-direction: row;
}
.filters > div {
  margin: 0px 10px;
}
</style>
