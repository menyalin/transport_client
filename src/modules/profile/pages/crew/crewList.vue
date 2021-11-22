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
          height="72vh"
          dense
          @dblclick:row="dblClickRow"
        >
          <template v-slot:[`item.startDate`]="{ item }">
            {{ new Date(item.startDate).toLocaleString() }}
          </template>
          <template v-slot:[`item.endDate`]="{ item }">
            {{ item.endDate ? new Date(item.endDate).toLocaleString() : null }}
          </template>
          <template v-slot:[`item.truck`]="{ item }">
            {{ getTruckName(item, 'truck') }}
          </template>
          <template v-slot:[`item.trailer`]="{ item }">
            {{ getTruckName(item, 'trailer') }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'

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
      { value: 'truck', text: 'Грузовик' },
      { value: 'trailer', text: 'Грузовик' },
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
  },
  created() {
    this.$store.dispatch('getCrews', {})
  },
  methods: {
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
    getTruckName(crew, field) {
      const lastIdx = crew.transport.length - 1
      const truckId = crew.transport[lastIdx][field]
      return truckId ? this.$store.getters.trucksMap.get(truckId).regNum : ' - '
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
