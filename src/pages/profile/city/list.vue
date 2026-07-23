<template>
  <entity-list-wrapper>
    <buttons-panel
      panel-type="list"
      :disabled-refresh="!directoriesProfile"
      :disabledSubmit="!store.getters.hasPermission('city:write')"
      @submit="create"
      @refresh="refresh"
    />
    <ListSettingsWrapper>
      <v-text-field v-model="settings.search" label="Поиск" hide-details clearable />
    </ListSettingsWrapper>
    <v-data-table
      :headers="headers"
      :items="cities"
      :loading="loading"
      :search="settings.search"
      fixed-header
      height="73vh"
      :items-per-page-options="[50, 100, 200]"
      v-model:options="settings.listOptions"
      @dblclick:row="dblClickRow"
    />
  </entity-list-wrapper>
</template>
<script setup>
import { computed, reactive, onMounted } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { useStore } from 'vuex'
import { ButtonsPanel, EntityListWrapper, ListSettingsWrapper } from '@/shared/ui'

defineOptions({ name: 'CityList' })

const router = useRouter()
const store = useStore()

const formName = 'CityList'

const settings = reactive({
  search: null,
  listOptions: {},
})

const headers = [{ value: 'name', title: 'Наименование' }]

const cities = computed(() => store.getters.cities)
const loading = computed(() => store.getters.loading)
const directoriesProfile = computed(() => store.getters.directoriesProfile)

onMounted(() => {
  if (store.getters.formSettingsMap.has(formName))
    Object.assign(settings, store.getters.formSettingsMap.get(formName))
  store.dispatch('getCities')
})

onBeforeRouteLeave((_to, _from, next) => {
  store.commit('setFormSettings', {
    formName,
    settings: { ...settings },
  })
  next()
})

function create() {
  router.push({ name: 'CityCreate' })
}

function refresh() {
  store.dispatch('getCities', true)
}

function dblClickRow(_, { item }) {
  router.push(`cities/${item._id}`)
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
