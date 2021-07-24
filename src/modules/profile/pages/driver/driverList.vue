<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-buttons-panel
          panel-type="list"
          :disabled-refresh="!directoriesProfile"
          @submit="createDriver"
          @refresh="refresh"
        />
        <v-data-table
          :headers="headers"
          :items="drivers"
          :loading="loading"
          dense
          :footer-props="{
            'items-per-page-options': [50, 100, 200],
          }"
          @dblclick:row="dblClickRow"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import { mapGetters } from 'vuex'
export default {
  name: 'DriverList',
  components: {
    AppButtonsPanel,
  },
  data: () => ({
    headers: [
      { value: 'tkName', text: 'ТК' },
      { value: 'surname', text: 'Фамилия' },
      { value: 'name', text: 'Имя' },
      { value: 'phone', text: 'Телефон' },
    ],
  }),
  computed: {
    ...mapGetters(['drivers', 'loading', 'directoriesProfile']),
  },
  created() {
    this.$store.dispatch('getDrivers')
  },
  methods: {
    createDriver() {
      this.$router.push({ name: 'DriverCreate' })
    },
    refresh() {
      this.$store.dispatch('getDrivers', true)
    },
    dblClickRow(_, { item }) {
      this.$router.push(`drivers/${item._id}`)
    },
  },
}
</script>
<style></style>
