<template>
  <entity-list-wrapper>
    <buttons-panel
      panel-type="list"
      :disabled-refresh="!directoriesProfile"
      :disabledSubmit="!store.getters.hasPermission('zone:write')"
      @submit="create"
      @refresh="refresh"
    />
    <v-data-table
      :headers="headers"
      :items="zones"
      :loading="loading"
      :search="settings.search"
      fixed-header
      height="73vh"
      :footer-props="{
        'items-per-page-options': [50, 100, 200],
      }"
      @update:options="settings.listOptions = $event"
      @dblclick:row="dblClickRow"
    >
      <template #top>
        <div id="settings-wrapper">
          <v-text-field v-model="settings.search" label="Поиск" hide-details clearable />
        </div>
      </template>
    </v-data-table>
  </entity-list-wrapper>
</template>
<script setup>
import { computed, reactive, onMounted } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { useStore } from 'vuex'
import { ButtonsPanel, EntityListWrapper } from '@/shared/ui'

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

onBeforeRouteLeave((_to, _from, next) => {
  store.commit('setFormSettings', {
    formName,
    settings: { ...settings },
  })
  next()
})

function create() {
  router.push({ name: 'ZoneCreate' })
}

function refresh() {
  store.dispatch('getZones', true)
}

function dblClickRow(_, { item }) {
  router.push(`zones/${item._id}`)
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
