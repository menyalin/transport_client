<template>
  <v-container>
    <v-row>
      <v-col>
        <app-buttons-panel
          panelType="list"
          @submit="createDriver"
          @refresh="refresh"
          :disabledRefresh="!directoriesProfile"
        />
        <v-data-table
          :headers="headers"
          :items="drivers"
          :loading="loading"
          @dblclick:row="dblClickRow"
          dense
          :footer-props="{
            'items-per-page-options': [50, 100, 200],
          }"
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
    headers: [{ value: 'name', text: 'Имя' }],
  }),
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
  computed: {
    ...mapGetters(['drivers', 'loading', 'directoriesProfile']),
  },
  created() {
    this.$store.dispatch('getDrivers')
  },
}
</script>
<style></style>
