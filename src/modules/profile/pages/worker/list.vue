<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-buttons-panel
          panel-type="list"
          :disabled-refresh="!directoriesProfile"
          :disabledSubmit="!$store.getters.hasPermission('worker:write')"
          @submit="create"
          @refresh="refresh"
        />
        <div id="settings-wrapper">
          <v-text-field
            v-model="settings.search"
            label="Поиск"
            outlined
            hide-details
            dense
            clearable
            :style="{ 'max-width': '400px' }"
          />
        </div>
        <v-data-table
          :headers="headers"
          :items="prepareDocuments"
          :loading="loading"
          fixed-header
          :search="settings.search"
          height="73vh"
          dense
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
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import { useQuery } from 'vue-query'
import { mapGetters } from 'vuex'
import { WORKERS } from '@/constants/queryKeys'
import workerService from '../../services/worker.service'

export default {
  name: 'WorkerList',
  components: {
    AppButtonsPanel,
  },
  data: () => ({
    formName: 'WorkerList',
    settings: {
      search: null,
      listOptions: {},
    },
    headers: [
      { value: 'name', text: 'Имя' },
      { value: 'fullName', text: 'Полное имя' },
      { value: 'position', text: 'Должность' },
      { value: 'roles', text: 'Роли' },
      { value: 'note', text: 'Примечание' },
    ],
  }),
  setup() {
    const {data: workers, isLoading: loading, refetch: refetchWorkers} = useQuery(WORKERS, workerService.getByDirectoriesProfile, {staleTime: Infinity})
    return { workers, loading, refetchWorkers }
  },
  computed: {
    ...mapGetters(['directoriesProfile']),
    prepareDocuments() {
      if (!this.workers) return []
      return this.workers
        .map((i) => ({
          ...i,
          roles: i.roles.map(role => this.$store.getters.staffRolesMap.get(role)).join(', ')
        }))
    },
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
      this.$router.push({ name: 'WorkerCreate' })
    },
    refresh() {
      this.refetchWorkers()
    },
    dblClickRow(_, { item }) {
      this.$router.push(`workers/${item._id}`)
    },
  },
}
</script>
<style scoped>
#settings-wrapper {
  display: flex;
  flex-direction: row;
  gap: 10px;
}
</style>
