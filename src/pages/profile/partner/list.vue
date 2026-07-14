<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <buttons-panel
          panel-type="list"
          :disabled-refresh="!directoriesProfile"
          :disabledSubmit="!canWrite"
          @submit="create"
          @refresh="refresh"
        />
        <div class="settings-wrapper">
          <v-select
            v-model="settings.partnerType"
            :items="partnerTypeItems"
            item-title="text"
            item-value="value"
            hide-details
            :style="{ 'max-width': '400px' }"
          />
          <v-text-field v-model="settings.search" label="Поиск" hide-details clearable />
        </div>
        <v-data-table
          :headers="headers"
          :items="filteredPartners"
          :loading="loading"
          fixed-header
          :search="settings.search"
          height="73vh"
          :items-per-page-options="[50, 100, 200]"
          v-model:options="listOptions"
          @dblclick:row="dblClickRow"
        >
          <template #[`item.isClient`]="{ item }">
            <div>{{ item.isClient ? 'Да' : 'Нет' }}</div>
          </template>
          <template #[`item.created`]="{ item }">
            {{ new Date(item.createdAt).toLocaleString() }}
          </template>
          <template #[`item.updated`]="{ item }">
            {{ new Date(item.updatedAt).toLocaleString() }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import usePersistedRef from '@/shared/hooks/usePersistedRef'
import { ButtonsPanel } from '@/shared/ui'

defineOptions({ name: 'PartnerList' })

const router = useRouter()
const store = useStore()

const settings = usePersistedRef({ search: null, partnerType: 'all' }, 'PartnerList:settings')
const listOptions = usePersistedRef(
  { page: 1, itemsPerPage: 50, sortBy: [], sortDesc: [] },
  'PartnerList:listOptions'
)

const partnerTypeItems = [
  { value: 'all', text: 'Все' },
  { value: 'client', text: 'Заказчик' },
  { value: 'service', text: 'Сервис' },
]

const headers = [
  { key: 'name', title: 'Наименование' },
  { key: 'group', title: 'Группа' },
  { key: 'inn', title: 'ИНН' },
  { key: 'isClient', title: 'Заказчик' },
  { key: 'created', title: 'Дата создания', sortable: true },
  { key: 'updated', title: 'Дата изменения', sortable: true },
]

const loading = computed(() => store.getters.loading)
const directoriesProfile = computed(() => store.getters.directoriesProfile)
const canWrite = computed(() => store.getters.hasPermission('partner:write'))

const partnerTypeCondition = (partner) => {
  if (settings.value.partnerType === 'client') return partner.isClient
  if (settings.value.partnerType === 'service') return partner.isService
  return true
}

const filteredPartners = computed(() => {
  return store.getters.partners.filter(partnerTypeCondition).map((i) => ({
    ...i,
    group: store.getters.partnerGroupsMap.get(i.group),
    created: new Date(i.createdAt),
    updated: new Date(i.updatedAt),
  }))
})

function create() {
  router.push({ name: 'PartnerCreate' })
}

function refresh() {
  store.dispatch('getPartners', true)
}

function dblClickRow(_, { item }) {
  router.push(`partners/${item._id}`)
}

onMounted(() => {
  store.dispatch('getPartners')
})
</script>
<style scoped>
.settings-wrapper {
  display: flex;
  flex-direction: row;
  gap: 15px;
  padding-bottom: 20px;
}
</style>
