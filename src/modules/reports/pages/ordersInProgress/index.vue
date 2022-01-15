<template>
  <v-container>
    <v-row>
      <v-col>
        <div id="report-settings">
          <v-btn
            icon
            @click.stop="getData"
          >
            <v-icon> mdi-cached </v-icon>
          </v-btn>
          <v-text-field
            v-model.trim="settings.search"
            label="Поиск"
            hideDetails
            outlined
            dense
          />
          <v-checkbox
            v-model="settings.selectedOnly"
            label="Только выделенные"
            hideDetails
            dense
          />
        </div>
        <v-data-table
          v-model="settings.selected"
          :itemKey="'_id'"
          :singleSelect="false"
          :headers="headers"
          :items="filteredRows"
          :loading="loading"
          :search="settings.search"
          fixed-header
          height="76vh"
          dense
          show-select
          :footer-props="{
            'items-per-page-options': [50, 100, 200],
          }"
          @dblclick:row="dblClickRow"
        >
          <template v-slot:[`item.plannedDate`]="{ item }">
            {{ new Date(item.plannedDate).toLocaleDateString() }}
          </template>
          <template v-slot:[`item.state`]="{ item }">
            {{ item.state === 'loading' ? 'На погрузке' : 'На выгрузке' }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import ReportService from '../../services/index.js'

export default {
  name: 'OrdersInProgress',
  data() {
    return {
      formName: 'OrdersInProgressReport',
      loading: false,
      settings: {
        search: null,
        selected: [],
        selectedOnly: false,
      },
      rows: [],
      headers: [
        { value: 'clientName', text: 'Клиент' },
        { value: 'plannedDate', text: 'Дата рейса' },
        { value: 'driverName', text: 'Водитель' },
        { value: 'driverPhone', text: 'Телефон' },
        { value: 'driverPhone2', text: 'Телефон 2' },
        { value: 'loadingPoints', text: 'Погрузка' },
        { value: 'unloadingPoints', text: 'Разгрузка' },
        { value: 'truckNum', text: 'Грузовик' },
        { value: 'trailerNum', text: 'Прицеп' },
        { value: 'state', text: 'Статус' },
      ],
    }
  },
  computed: {
    ...mapGetters(['directoriesProfile']),
    filteredRows() {
      return this.rows.filter((item) => {
        if (!this.settings.selectedOnly) return true
        return this.settings.selected.map((s) => s._id).includes(item._id)
      })
    },
  },
  watch: {
    ['settings.dayCount']: {
      deep: true,
      handler: function () {
        this.getData()
      },
    },
  },
  async mounted() {
    await this.getData()
  },
  created() {
    if (this.$store.getters.formSettingsMap.has(this.formName)) {
      this.settings = this.$store.getters.formSettingsMap.get(this.formName)
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('setFormSettings', {
      formName: this.formName,
      settings: this.settings,
    })
    next()
  },
  methods: {
    dblClickRow(_, { item }) {
      this.$router.push(`/orders/${item._id}`)
    },
    async getData() {
      this.loading = true
      this.rows = await ReportService.ordersInProgress({
        profile: this.directoriesProfile,
      })
      this.loading = false
    },
  },
}
</script>
<style scoped>
#report-settings {
  display: grid;
  grid-template-columns: 50px 300px 300px;
  gap: 10px;
}
</style>
