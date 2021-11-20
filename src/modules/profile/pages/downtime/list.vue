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
          :items="downtimes"
          :loading="loading"
          height="72vh"
          dense
          :footer-props="{
            'items-per-page-options': [50, 100, 200],
          }"
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
export default {
  name: 'DowntimeList',
  components: {
    AppButtonsPanel,
  },
  data: () => ({
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
    ...mapGetters(['downtimes', 'loading', 'directoriesProfile']),
    downtimeTypesHash() {
      return this.$store.getters.downtimeTypesHash
    },
    trucksHash() {
      return this.$store.getters.trucksHash
    },
  },
  created() {
    this.$store.dispatch('getDowntimes')
  },
  methods: {
    create() {
      this.$router.push({ name: 'DowntimeCreate' })
    },
    refresh() {
      this.$store.dispatch('getDowntimes', true)
    },
    dblClickRow(_, { item }) {
      this.$router.push(`downtimes/${item._id}`)
    },
  },
}
</script>
<style></style>
