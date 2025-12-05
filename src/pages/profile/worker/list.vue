<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <ButtonsPanel
          panelType="list"
          :disabledRefresh="!$store.getters.directoriesProfile"
          :disabledSubmit="!$store.getters.hasPermission('worker:write')"
          @submit="create"
          @refresh="refresh"
        />
        <div id="settings-wrapper">
          <v-text-field
            :modelValue="settings.search"
            label="Поиск"
            variant="outlined"
       density="compact"
            hideDetails
           
            clearable
            :style="{ 'max-width': '400px' }"
          />
        </div>
        <v-data-table
          v-model:options="settings.listOptions"
          :headers="headers"
          :items="prepareDocuments"
          :loading="loading"
          fixedHeader
          :search="settings.search"
          height="73vh"
         
          :footerProps="{
            'items-per-page-options': [50, 100, 200],
          }"
          @dblclick:row="dblClickRow"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import store from '@/store'
import { ButtonsPanel } from '@/shared/ui'
import { WorkerService } from '@/shared/services'
import { computed, ref } from 'vue'

export default {
  name: 'WorkerList',
  components: {
    ButtonsPanel,
  },
    beforeRouteLeave(to, from, next) {
      this.$store.commit('setFormSettings', {
        formName: this.formName,
        settings: { ...this.settings },
      })
      next()
    },
  setup() {
    const workers = ref([])
    const loading = ref(false)
    const getWorkers = async () => {
      try {
        loading.value = true
        workers.value = await WorkerService.getByDirectoriesProfile()
        loading.value = false
      } catch (e) {
        loading.value = false
        store.commit('setError', e.message)
      }
    }
    const prepareDocuments = computed(() =>
      workers.value
        .map(i => ({
          ...i,
          roles: i.roles ? i.roles.map(role => store.getters.staffRolesMap.get(role)).join(', ') : null,
        }))
        .sort((a, b) => {
          if (a.name < b.name) return -1
          else return 1
        })
    )
    getWorkers()
    return { prepareDocuments, loading, refetchWorkers: getWorkers }
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
    created() {
      if (this.$store.getters.formSettingsMap.has(this.formName))
        this.settings = this.$store.getters.formSettingsMap.get(this.formName)
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
