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
          dense
          :footer-props="{
            'items-per-page-options': [50, 100, 200],
          }"
          :items="trucks"
          :loading="loading"
          @dblclick:row="dblClickRow" 
        >
          <template v-slot:item.type="{ item }">
            <span>{{ truckTypesHash[item.type] }}</span>
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
  name: 'TruckList',
  components: {
    AppButtonsPanel,
  },
  data: () => ({
    headers: [
      { value: 'name', text: 'Имя' },
      { value: 'type', text: 'Тип' },
      { value: 'regNum', text: 'Гос.номер' },
      { value: 'brand', text: 'Марка' },
      { value: 'model', text: 'Модель' },
      { value: 'tkName', text: 'ТК' },
      { value: 'owner', text: 'Собственник' },
    ],
  }),
  methods: {
    create() {
      this.$router.push({ name: 'TruckCreate' })
    },
    refresh() {
      this.$store.dispatch('getTrucks', true)
    },
    dblClickRow(_, { item }) {
      this.$router.push(`trucks/${item._id}`)
    },
  },
  computed: {
    ...mapGetters([
      'trucks',
      'loading',
      'directoriesProfile',
      'truckTypesHash',
    ]),
  },
  created() {
    this.$store.dispatch('getTrucks')
  },
}
</script>
<style></style>
