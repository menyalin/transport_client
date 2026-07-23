<template>
  <EntityListWrapper>
    <buttons-panel
      panel-type="list"
      :disabled-submit="!store.getters.hasPermission('agreement:write')"
      @submit="create"
      @refresh="refresh"
    />
    <AgreementListSettings
      v-model:settings="settings"
      :clientItems="clientItems"
      :carrierItems="carrierItems"
    />

    <v-data-table-server
      :headers="headers"
      :items="filteredList"
      :items-length="count"
      :loading="loading"
      :page="listOptions.page"
      :items-per-page="listOptions.itemsPerPage"
      item-value="_id"
      height="73vh"
      fixed-header
      @update:options="updateListOptionsHandler"
      @dblclick:row="dblClickRow"
    />
  </EntityListWrapper>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ButtonsPanel, EntityListWrapper } from '@/shared/ui'
import { AgreementListSettings } from '@/entities/agreement'
import { usePartners } from '@/entities/partner'
import { AgreementService } from '@/shared/services'
import { usePersistedRef } from '@/shared/hooks'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'

defineOptions({ name: 'AgreementListPage' })

const store = useStore()
const router = useRouter()
const carrierStore = useCarrierStore()
const { clients: clientItems } = usePartners()

const loading = ref(false)
const list = ref([])
const count = ref(0)
const listOptions = usePersistedRef({ page: 1, itemsPerPage: 25 }, 'agreement_list_options')
const settings = usePersistedRef(
  { search: null, executor: null, clients: [], state: 'opened' },
  'agreement_list_settings'
)

const headers = [
  { key: 'name', title: 'Название', sortable: false },
  { key: 'executorName', title: 'Наименование исполнителя', sortable: false },
  { key: 'executorCarrierName', title: 'ТК исполнитель', sortable: false },
  { key: 'clientsName', title: 'Клиенты', sortable: false },
  { key: 'date', title: 'Дата начала действия', sortable: false },
  { key: 'endDate', title: 'Дата завершения', sortable: false },
  { key: 'note', title: 'Примечание', sortable: false },
]

const carrierItems = computed(() => carrierStore.carriers)

const queryParams = computed(() => ({
  ...settings.value,
  company: store.getters.directoriesProfile,
  limit: listOptions.value.itemsPerPage,
  skip: (listOptions.value.page - 1) * listOptions.value.itemsPerPage,
  sortBy: listOptions.value.sortBy?.length ? listOptions.value.sortBy[0] : null,
  sortDesc: listOptions.value.sortDesc?.length ? listOptions.value.sortDesc[0] : null,
}))

const filteredList = computed(() => {
  if (!list.value) return []
  return list.value.map((i) => ({
    ...i,
    date: new Date(i.date).toLocaleDateString(),
    endDate: i.endDate ? new Date(i.endDate).toLocaleDateString() : null,
  }))
})

async function getData() {
  try {
    loading.value = true
    const data = await AgreementService.getList(queryParams.value)
    list.value = data.items ?? []
    count.value = data.count ?? 0
  } catch (e) {
    store.commit('setError', e.message)
  } finally {
    loading.value = false
  }
}

async function updateListOptionsHandler(options) {
  listOptions.value = options
  await getData()
}

async function refresh() {
  await getData()
}

function create() {
  router.push({ name: 'AgreementCreate' })
}

function dblClickRow(_, { item }) {
  router.push(`agreements/${item._id}`)
}

watch(
  settings,
  () => {
    updateListOptionsHandler({ ...listOptions.value, page: 1 })
  },
  { deep: true }
)
</script>
