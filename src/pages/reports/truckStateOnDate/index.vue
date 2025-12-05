<template>
  <v-container>
    <v-row>
      <v-col>
        <ReportTitle title="Статус транспорта на дату" />
        <div id="report-settings">
          <v-btn icon @click.stop="getData">
            <v-icon>mdi-cached</v-icon>
          </v-btn>
          <DateTimeInput
            :modelValue="settings.date"
            label="Отчет на дату"
            outlined
            hideDetails
            dense
            type="datetime-local"
            :style="{ 'max-width': '200px' }"
          />
          <v-select
            :modelValue="settings.tkName"
            :items="$store.getters.tkNames"
            itemTitle="name"
            itemValue="_id"
            label="ТК"
            variant="outlined"
            density="compact"
            hideDetails
            clearable
            :style="{ 'max-width': '260px' }"
          />
        </div>
        <v-data-table
          :headers="headers"
          :items="filteredRows"
          :loading="loading"
          :search="settings.search"
          fixedHeader
          height="78vh"
          :footerProps="{
            'items-per-page-options': [50, 100, 200],
          }"
          @dblclick:row="dblClickRow"
        >
          <template #[`item.tkName`]="{ item }">
            {{ tkNamesMap.has(item.tkName) ? tkNamesMap.get(item.tkName).name : '' }}
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
            {{ !!item.crew && driversMap.has(item.crew.driver) ? driversMap.get(item.crew.driver).fullName : '' }}
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
  import { ref } from 'vue'
  import { mapGetters } from 'vuex'
  import { ReportService } from '@/shared/services'
  import { DateTimeInput, ReportTitle } from '@/shared/ui'
  import { usePersistedRef } from '@/shared/hooks'

  export default {
    name: 'TruckStateOnDate',
    components: {
      DateTimeInput,
      ReportTitle,
    },
    setup() {
      const loading = ref(false)
      const rows = ref([])
      const settings = usePersistedRef(
        {
          date: null,
          search: null,
          tkName: null,
          truckType: 'truck',
        },
        'TruckStateOnDateReport'
      )
      return {
        loading,
        rows,
        settings,
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
      tkNamesMap() {
        return this.$store.getters.tkNamesMap
      },
    },
    watch: {
      settings: {
        deep: true,
        immediate: true,
        handler: function () {
          this.getData()
        },
      },
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
