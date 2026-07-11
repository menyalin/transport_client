<template>
  <entity-list-wrapper>
    <buttons-panel
      panel-type="list"
      :disabled-refresh="!directoriesProfile"
      :disabledSubmit="!store.getters.hasPermission('downtime:write')"
      @submit="create"
      @refresh="refresh"
    />
    <div class="filter-wrapper">
      <DateRangeInput v-model="settings.period" />
      <v-autocomplete
        v-model="settings.truckFilter"
        label="Грузовик"
        :items="trucks"
        item-title="regNum"
        item-value="_id"
        hide-details
        clearable
        :style="{ maxWidth: '250px' }"
      />
      <v-autocomplete
        v-model="settings.partner"
        label="Партнер"
        :items="partners"
        item-title="name"
        item-value="_id"
        auto-select-first
        hide-details
        clearable
        :style="{ maxWidth: '350px' }"
      />
    </div>
    <v-data-table-server
      :headers="headers"
      :items="list"
      :loading="loading"
      height="73vh"
      fixed-header
      :items-length="count"
      :items-per-page-options="[50, 100, 200]"
      v-model:options="listOptions"
      @dblclick:row="dblClickRow"
    >
      <template #[`item.type`]="{ item }">
        <span>{{ downtimeTypesHash[item.type] }}</span>
      </template>
      <template #[`item.partner`]="{ item }">
        <span>{{
          store.getters.partnersMap.has(item.partner)
            ? store.getters.partnersMap.get(item.partner).name
            : null
        }}</span>
      </template>
      <template #[`item.truck`]="{ item }">
        <span>{{ trucksHash[item.truck] ? trucksHash[item.truck].regNum : '-' }}</span>
      </template>
      <template #[`item.startPositionDate`]="{ item }">
        <span>{{ new Date(item.startPositionDate).toLocaleString() }}</span>
      </template>
      <template #[`item.endPositionDate`]="{ item }">
        <span>{{ new Date(item.endPositionDate).toLocaleString() }}</span>
      </template>
    </v-data-table-server>
  </entity-list-wrapper>
</template>
<script setup>
import dayjs from 'dayjs'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { DowntimeService } from '@/shared/services'
import { ButtonsPanel, DateRangeInput, EntityListWrapper } from '@/shared/ui'
import { usePersistedRef } from '@/shared/hooks'
import { sortingAdapterForOldApi } from '@/shared/utils/migrationUtils'

defineOptions({ name: 'DowntimeList' })

const router = useRouter()
const store = useStore()

const loading = ref(false)
const count = ref(0)
const list = ref([])

const todayM = dayjs()
const listOptions = usePersistedRef({ page: 1, itemsPerPage: 50 }, 'DowntimeList:listOptions')
const settings = usePersistedRef(
  {
    truckFilter: null,
    partner: null,
    period: [todayM.add(-10, 'd').format('YYYY-MM-DD'), todayM.add(10, 'd').format('YYYY-MM-DD')],
  },
  'DowntimeList:settings'
)

const headers = [
  { value: 'title', title: 'Заголовок', sortable: false },
  { value: 'partner', title: 'Партнер', sortable: false },
  { value: 'type', title: 'Тип', sortable: false },
  { value: 'truck', title: 'Грузовик', sortable: true },
  { value: 'startPositionDate', title: 'Начало', sortable: true },
  { value: 'endPositionDate', title: 'Конец', sortable: false },
  { value: 'note', title: 'Примечание', sortable: false, maxWidth: '250px' },
]

const directoriesProfile = computed(() => store.getters.directoriesProfile)
const downtimeTypesHash = computed(() => store.getters.downtimeTypesHash)
const trucks = computed(() => store.getters.trucksForSelect({ type: 'truck' }))
const partners = computed(() => store.getters.partners.filter((i) => i.isService))
const trucksHash = computed(() => store.getters.trucksHash)

const queryParams = computed(() => ({
  company: directoriesProfile.value,
  ...settings.value,
  startDate: settings.value?.period[0],
  endDate: settings.value?.period[1],
  limit: listOptions.value.itemsPerPage,
  skip: listOptions.value.itemsPerPage * (listOptions.value.page - 1),
  ...sortingAdapterForOldApi(listOptions.value.sortBy),
}))

async function getData() {
  if (!directoriesProfile.value) {
    router.push('/profile')
    return null
  }
  try {
    loading.value = true
    console.log('queryParams.value: ', queryParams.value)
    const data = await DowntimeService.getList(queryParams.value)
    console.log('data', data)
    list.value = data?.items || []
    count.value = data?.count || 0
  } catch (e) {
    store.commit('setError', e.message)
  } finally {
    loading.value = false
  }
}

watch(
  settings,
  () => {
    listOptions.value = { ...listOptions.value, page: 1 }
  },
  { deep: true }
)
watch(listOptions, getData)

function create() {
  router.push({ name: 'DowntimeCreate' })
}

function refresh() {
  getData()
}

function dblClickRow(_, { item }) {
  router.push(`downtimes/${item._id}`)
}
</script>
<style scoped>
.filter-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}
</style>
