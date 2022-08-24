<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-buttons-panel
          panel-type="list"
          :disabled-refresh="!directoriesProfile"
          :disabledSubmit="!$store.getters.hasPermission('fine:write')"
          @submit="create"
          @refresh="refetch"
        />
        <div class="filter-wrapper">
          <app-date-range v-model="settings.period" />
        </div>
        <v-data-table
          :headers="headers"
          :items="list"
          :loading="loading"
          height="73vh"
          dense
          fixed-header
          :serverItemsLength="count"
          :footer-props="{
            'items-per-page-options': [50, 100, 200],
          }"
          :options.sync="settings.listOptions"
          @dblclick:row="dblClickRow"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
import service from '@/modules/profile/services/fine.service'

import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import AppDateRange from '@/modules/common/components/dateRange'
import { reactive, computed } from '@vue/composition-api'
import { useQuery } from 'vue-query'
import { FINES } from '@/constants/queryKeys'
import store from '@/store'



export default {
  name: 'FineList',
  components: {
    AppButtonsPanel,
    AppDateRange,
  },

  setup() {
    const loading = false
    const headers = [
      { value: 'date', text: 'Дата постановления', sortable: false },
      { value: 'number', text: 'Номер постановления', sortable: false },
      { value: 'truck', text: 'Грузовик', sortable: false },
      { value: 'note', text: 'Примечание', sortable: false },
    ]
    const formName = 'fineList'
    const settings = reactive({
      period: [ dayjs().add(-45, 'd').format('YYYY-MM-DD'), dayjs().add(5, 'd').format('YYYY-MM-DD')], 
      listOptions: {
        page: 1,
        itemsPerPage: 50,
      },
    })
    const queryParams = computed(() => ({
          company: store.getters.directoriesProfile,
          startDate: settings.period[0],
          endDate: settings.period[1],
          skip:
            settings.listOptions.itemsPerPage *
            (settings.listOptions.page - 1),
          limit: settings.listOptions.itemsPerPage,
      })
    )

    const { data, refetch } = useQuery(
      [FINES, queryParams.value], 
      () => service.getList(queryParams.value),
      )
    
    const list = computed(() => data?.value?.items || [])
    const count = computed(() => data?.value?.count || 0)

    return { formName, settings, headers, loading, refetch, list, count }
  },
  computed: {
    ...mapGetters(['directoriesProfile'])
  },
  created() {
    if (this.$store.getters.formSettingsMap.has(this.formName))
      this.settings = this.$store.getters.formSettingsMap.get(this.formName)
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
      this.$router.push({ name: 'FineCreate' })
    },
   
    dblClickRow(_, { item }) {
      this.$router.push(`fines/${item._id}`)
    },
  },
}
</script>
<style scoped>
.filter-wrapper {
  display: grid;
  grid-template-columns: 300px 280px;
  align-items: center;
}
</style>