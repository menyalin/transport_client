<template>
  <EntityListWrapper>
    <ButtonsPanel
      panel-type="list"
      :disabled-submit="!store.getters.hasPermission('orderTemplate:write')"
      @submit="create"
      @refresh="refresh"
    />
    <div class="filter-wrapper">
      <v-text-field v-model="settings.search" label="Поиск" hide-details />
    </div>
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      height="73vh"
      :search="settings.search"
      fixed-header
      :items-per-page-options="[50, 100, -1]"
      v-model:options="settings.listOptions"
      @dblclick:row="dblClickRow"
    />
  </EntityListWrapper>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { useStore } from 'vuex'
import { ButtonsPanel, EntityListWrapper } from '@/shared/ui'
import { useListData } from './model'

defineOptions({ name: 'OrderTemplateList' })

const store = useStore()
const router = useRouter()
const { items, headers } = useListData()
const loading = ref(false)
const formName = 'OrderTemplateList'

const settings = reactive({
  search: null,
  listOptions: {
    page: 1,
    itemsPerPage: 50,
  },
})

const saved = store.getters.formSettingsMap.get(formName)
if (saved) {
  Object.assign(settings, saved)
}

onBeforeRouteLeave(() => {
  store.commit('setFormSettings', {
    formName,
    settings: { ...settings },
  })
})

function create() {
  router.push({ name: 'OrderTemplateCreate' })
}

function refresh() {
  store.dispatch('getOrderTemplates')
}

function dblClickRow(_, { item }) {
  router.push({ name: 'OrderTemplateDetails', params: { id: item._id } })
}
</script>

<style scoped>
.filter-wrapper {
  display: flex;
  align-items: center;
  gap: 15px;
}
</style>
