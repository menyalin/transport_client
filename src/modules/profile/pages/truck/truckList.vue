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
          :search="settings.search"
          :headers="headers"
          dense
          fixed-header
          height="72vh"
          :footer-props="{
            'items-per-page-options': [50, 100, 200],
          }"
          :options.sync="settings.listOptions"
          :items="filteredTrucks"
          :loading="loading"
          @dblclick:row="dblClickRow"
        >
          <template v-slot:[`item.type`]="{ item }">
            <span>{{ truckTypesHash[item.type] }}</span>
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
              <v-select
                v-model="settings.truckFilter"
                dense
                outlined
                hide-details
                label="Тип транспорта"
                clearable
                :items="truckFilterOptions"
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
  name: 'TruckList',
  components: {
    AppButtonsPanel,
  },
  data: () => ({
    formName: 'TruckList',
    settings: {
      tkNameFilter: null,
      search: null,
      truckFilter: null,
      listOptions: {},
    },

    truckFilterOptions: [
      { text: 'Тягачи', value: '20tn' },
      { text: '10-ки', value: '10tn' },
      { text: 'Прицепы', value: 'trailers' },
    ],
    headers: [
      { value: 'tkName.name', text: 'ТК' },
      { value: 'type', text: 'Тип' },
      { value: 'regNum', text: 'Гос.номер' },
      { value: 'liftCapacityType', text: 'Груз-cть, т', width: '15rem' },
      { value: 'pltCount', text: 'Плт' },
      { value: 'brand', text: 'Марка' },
      {
        value: 'permanentDriverCount',
        text: 'Закреп. водители',
        align: 'center',
        width: '10rem',
      },
      {
        value: 'temporaryDriverCount',
        text: 'Времен. водители',
        align: 'center',
        width: '10rem',
      },
    ],
  }),
  computed: {
    ...mapGetters([
      'trucks',
      'loading',
      'directoriesProfile',
      'truckTypesHash',
      'tkNames',
    ]),
    filteredTrucks() {
      return this.trucks
        .filter((item) =>
          this.settings.tkNameFilter
            ? item.tkName._id === this.settings.tkNameFilter
            : true
        )
        .filter((item) => {
          switch (this.settings.truckFilter) {
            case '20tn':
              return item.type === 'truck' && item.liftCapacityType === 20
            case '10tn':
              return item.type === 'truck' && item.liftCapacityType === 10
            case 'trailers':
              return item.type === 'trailer'
            default:
              return true
          }
        })
    },
  },
  created() {
    if (this.$store.getters.formSettingsMap.has(this.formName))
      this.settings = this.$store.getters.formSettingsMap.get(this.formName)
    this.$store.dispatch('getTrucks')
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('setFormSettings', {
      formName: this.formName,
      settings: { ...this.settings },
    })
    next()
  },

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
