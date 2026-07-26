<template>
  <EntityListWrapper>
    <ButtonsPanel
      panel-type="list"
      :disabled-refresh="!directoriesProfile"
      :disabledSubmit="!store.getters.hasPermission('zone:write')"
      @submit="create"
      @refresh="refresh"
    />
    <ListSettingsWrapper>
      <v-text-field v-model="settings.search" label="Поиск" hide-details clearable />
    </ListSettingsWrapper>
    <v-data-table
      :headers="headers"
      :items="zones"
      :loading="loading"
      :search="settings.search"
      fixed-header
      height="73vh"
      :items-per-page-options="[50, 100, 200]"
      v-model:options="settings.listOptions"
      @dblclick:row="dblClickRow"
    />
  </EntityListWrapper>
</template>
<script setup>
import { computed, reactive, onMounted } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { useStore } from 'vuex'
import { ButtonsPanel, EntityListWrapper, ListSettingsWrapper } from '@/shared/ui'

defineOptions({ name: 'ZoneList' })

const router = useRouter()
const store = useStore()

const formName = 'ZoneList'

const settings = reactive({
  search: null,
  listOptions: {},
})

const headers = [{ value: 'name', title: 'Наименование' }]

const zones = computed(() => store.getters.zones)
const loading = computed(() => store.getters.loading)
const directoriesProfile = computed(() => store.getters.directoriesProfile)

onMounted(() => {
  if (store.getters.formSettingsMap.has(formName))
    Object.assign(settings, store.getters.formSettingsMap.get(formName))
  store.dispatch('getZones')
})

onBeforeRouteLeave(() => {
  store.commit('setFormSettings', {
    formName,
    settings: { ...settings },
  })
})

function create() {
  router.push({ name: 'ZoneCreate' })
}

function refresh() {
  store.dispatch('getZones', true)
}

function dblClickRow(_, { item }) {
  router.push({ name: 'ZoneDetails', params: { id: item._id } })
}
</script>
<style scoped>
#settings-wrapper {
  display: grid;
  grid-template-columns: 400px;
  gap: 10px;
  margin: 15px;
}
</style>
