<template>
  <EntityListWrapper>
    <ButtonsPanel
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
      v-model:options="listOptions"
      @dblclick:row="dblClickRow"
    />
  </EntityListWrapper>
</template>
<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ButtonsPanel, EntityListWrapper, ListSettingsWrapper } from '@/shared/ui'
import usePersistedRef from '@/shared/hooks/usePersistedRef'

defineOptions({ name: 'CityList' })

const router = useRouter()
const store = useStore()

const formName = 'CityList'

const settings = usePersistedRef({ search: null }, formName + ':settings')
const listOptions = usePersistedRef({}, formName + ':listOptions')

const headers = [{ value: 'name', title: 'Наименование' }]

const cities = computed(() => store.getters.cities)
const loading = computed(() => store.getters.loading)
const directoriesProfile = computed(() => store.getters.directoriesProfile)

function create() {
  router.push({ name: 'CityCreate' })
}

function refresh() {
  store.dispatch('getCities', true)
}

function dblClickRow(_, { item }) {
  router.push({ name: 'CityDetails', params: { id: item._id } })
}
</script>
