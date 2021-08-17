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
          :items="filteredDrivers"
          :search="search"
          :loading="loading"
          dense
          :footer-props="{
            'items-per-page-options': [50, 100, 200],
          }"
          @dblclick:row="dblClickRow"
        >
          <template v-slot:top>
            <div class="filter-wrapper">
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
              <v-text-field
                v-model="search"
                outlined
                hide-details
                dense
                label="Быстрый поиск"
              />
            </div>
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
  name: 'DriverList',
  components: {
    AppButtonsPanel,
  },
  data: () => ({
    search: null,
    tkNameFilter: null,
    headers: [
      { value: 'surname', text: 'Фамилия' },
      { value: 'name', text: 'Имя' },
      { value: 'phone', text: 'Телефон' },
    ],
  }),
  computed: {
    ...mapGetters(['drivers', 'loading', 'directoriesProfile', 'tkNames']),
    filteredDrivers() {
      return this.drivers.filter((item) =>
        this.tkNameFilter ? item.tkName?._id === this.tkNameFilter : true
      )
    },
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
<style scoped>
.filter-wrapper {
  display: flex;
  flex-direction: row;
}
.filter-wrapper > * {
  padding: 0px 10px;
}
</style>
