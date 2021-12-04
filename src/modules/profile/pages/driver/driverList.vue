<template>
  <v-container fluid>
    <v-row class="data-table-wrapper">
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
          :search="settings.search"
          :loading="loading"
          fixed-header
          height="71vh"
          dense
          :footer-props="{
            'items-per-page-options': [50, 100, 200],
          }"
          :options.sync="settings.listOptions"
          @dblclick:row="dblClickRow"
        >
          <template v-slot:[`item.medBookState.validDays`]="{ item }">
            <v-chip
              v-if="item.medBookState.validDays"
              small
              class="my-0 mx-4"
              :color="item.medBookState.color"
            >
              {{ item.medBookState.validDays }}
            </v-chip>
          </template>
          <template v-slot:top>
            <div class="filter-wrapper">
              <v-select
                v-model="settings.tkNameFilter"
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
                v-model="settings.search"
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
    formName: 'DriverList',
    settings: {
      listOptions: {},
      search: null,
      tkNameFilter: null,
    },

    headers: [
      { value: 'tkName.name', text: 'ТК' },
      { value: 'fullName', text: 'ФИО' },
      { value: 'phone', text: 'Телефон' },
      { value: 'phone2', text: 'Телефон2' },
      
      {
        value: 'medBookState.validDays',
        text: 'Мед.книжка, дней',
        align: 'center',
      },
    ],
  }),
  computed: {
    ...mapGetters(['drivers', 'loading', 'directoriesProfile', 'tkNames']),
    filteredDrivers() {
      const tpmDrivers = this.drivers.slice()
      return tpmDrivers.filter((item) =>
        this.settings.tkNameFilter
          ? item.tkName?._id === this.settings.tkNameFilter
          : true
      )
    },
  },

  created() {
    if (this.$store.getters.formSettingsMap.has(this.formName))
      this.settings = this.$store.getters.formSettingsMap.get(this.formName)
    this.$store.dispatch('getDrivers')
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('setFormSettings', {
      formName: this.formName,
      settings: { ...this.settings },
    })
    next()
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
