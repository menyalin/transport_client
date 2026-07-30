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
import { useZoneStore } from '@/entities/zone/zoneStore'
import { ButtonsPanel, EntityListWrapper, ListSettingsWrapper } from '@/shared/ui'

defineOptions({ name: 'ZoneList' })

const router = useRouter()
const store = useStore()
const zoneStore = useZoneStore()

const formName = 'ZoneList'

const settings = reactive({
  search: null,
  listOptions: {},
})

const headers = [{ value: 'name', title: 'Наименование' }]

const zones = computed(() => zoneStore.zones)
const loading = computed(() => store.getters.loading)
const directoriesProfile = computed(() => store.getters.directoriesProfile)

onMounted(() => {
  if (store.getters.formSettingsMap.has(formName))
    Object.assign(settings, store.getters.formSettingsMap.get(formName))
  zoneStore.fetchZones(directoriesProfile.value)
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
  zoneStore.fetchZones(directoriesProfile.value)
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
