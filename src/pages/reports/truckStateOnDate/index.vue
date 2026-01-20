<template>
  <v-container>
    <v-row>
      <v-col>
        <ReportTitle title="Статус транспорта на дату" />
        <div id="report-settings">
          <v-btn icon @click.stop="getData">
            <v-icon> mdi-cached </v-icon>
          </v-btn>
          <DateTimeInput
            v-model="settings.date"
            label="Отчет на дату"
            outlined
            hideDetails
            dense
            type="datetime-local"
            :style="{ 'max-width': '200px' }"
          />
          <v-select
            v-model="settings.tkName"
            :items="carrierStore.carriers"
            item-text="name"
            item-value="_id"
            label="ТК"
            dense
            outlined
            hide-details
            clearable
            :style="{ 'max-width': '260px' }"
          />
        </div>
        <v-data-table
          :headers="headers"
          :items="filteredRows"
          :loading="loading"
          :search="settings.search"
          fixed-header
          height="78vh"
          dense
          :footer-props="{
            'items-per-page-options': [50, 100, 200],
          }"
          @dblclick:row="dblClickRow"
        >
          <template #[`item.tkName`]="{ item }">
            {{
              carrierStore.carriersMap.has(item.tkName)
                ? carrierStore.carriersMap.get(item.tkName)?.name
                : ''
            }}
          </template>
          <template #[`item.truckNum`]="{ item }">
            {{ trucksMap.has(item._id) ? trucksMap.get(item._id).regNum : '' }}
          </template>
          <template #[`item.trailerNum`]="{ item }">
            {{
              !!item.crew && trucksMap.has(item.crew.transport.trailer)
                ? trucksMap.get(item.crew.transport.trailer).regNum
                : ''
            }}
          </template>
          <template #[`item.driverName`]="{ item }">
            {{
              !!item.crew && driversMap.has(item.crew.driver)
                ? driversMap.get(item.crew.driver).fullName
                : ''
            }}
          </template>
          <template #[`item.downtime`]="{ item }">
            {{ !!item.downtime ? item.downtime.title : '' }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import { ReportService } from '@/shared/services'
import { DateTimeInput, ReportTitle } from '@/shared/ui'
import { useCarrierStore } from '@/entities/carrier'

export default {
  name: 'TruckStateOnDate',
  components: {
    DateTimeInput,
    ReportTitle,
  },
  setup() {
    const carrierStore = useCarrierStore()
    return {
      carrierStore,
    }
  },
  data() {
    return {
      formName: 'TruckStateOnDateReport',
      loading: false,
      settings: {
        date: null,
        search: null,
        tkName: null,
        truckType: 'truck',
      },
      rows: [],
    }
  },
  computed: {
    ...mapGetters(['directoriesProfile']),
    headers() {
      return [
        { value: 'tkName', text: 'ТК' },
        { value: 'truckNum', text: 'Грузовик' },
        { value: 'trailerNum', text: 'Прицеп' },
        { value: 'driverName', text: 'Водитель' },
        { value: 'downtime', text: 'Примечание' },
      ]
    },
    filteredRows() {
      return this.rows
    },
    trucksMap() {
      return this.$store.getters.trucksMap
    },
    driversMap() {
      return this.$store.getters.driversMap
    },
  },
  watch: {
    settings: {
      deep: true,
      handler: function () {
        this.getData()
      },
    },
  },
  async created() {
    if (this.$store.getters.formSettingsMap.has(this.formName)) {
      this.settings = this.$store.getters.formSettingsMap.get(this.formName)
    } else {
      this.settings.date = new Date().toISOString()
    }
    await this.getData()
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('setFormSettings', {
      formName: this.formName,
      settings: this.settings,
    })
    next()
  },
  methods: {
    dblClickRow(_, { _item }) {},
    async getData() {
      this.loading = true
      this.rows = await ReportService.truckStateOnDate({
        company: this.directoriesProfile,
        date: new Date(this.settings.date).toISOString(),
        truckType: this.settings.truckType,
        tkName: this.settings.tkName,
      })
      this.loading = false
    },
  },
}
</script>
<style scoped>
#report-settings {
  display: flex;
  flex-direction: row;
  align-items: start;
  margin-top: 20px;
}
#report-settings > * {
  margin: 10px;
}
</style>
