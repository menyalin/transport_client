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
          <app-date-time-input
            :value="dateFilter"
            @change="setDateFilter"
          />
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
import AppDateTimeInput from '@/modules/common/components/dateTimeInput'

import { mapGetters } from 'vuex'

export default {
  name: 'CrewList',
  components: {
    AppButtonsPanel,
    AppDateTimeInput,
  },
  data: () => ({
    dateFormat: 'YYYY-MM-DD HH:mm',
    headers: [
      { value: '_id', text: '_id' },
      { value: 'tkName.name', text: 'tkName' },
      { value: 'startDate', text: 'startDate' },
      { value: 'endDate', text: 'endDate' },
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
    setDateFilter(val) {
      this.$store.commit('setDateForCrews', val)
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
.group-title-wrapper {
  display: flex;
  flex-direction: row;
}
.group-title-wrapper > div {
  padding: 0px 30px;
}
.filters {
  display: flex;
  flex-direction: row;
}
.filters > div {
  padding: 0px 10px;
}
</style>
