<template>
  <EntityListWrapper>
    <buttons-panel
      panel-type="list"
      :disabledSubmit="!hasPermission"
      @submit="create"
      @refresh="refresh"
    />
    <ListSettingsWrapper>
      <DateRangeInput v-model="settings.period" />
      <v-autocomplete
        v-model="settings.truckFilter"
        label="Грузовик"
        :items="trucksForSelect"
        item-title="regNum"
        item-value="_id"
        hide-details
        clearable
      />
    </ListSettingsWrapper>
    <v-data-table-server
      :headers="headers"
      :items="list"
      :loading="loading"
      height="73vh"
      fixed-header
      :items-length="count"
      :items-per-page-options="[50, 100, 200]"
      v-model:options="settings.listOptions"
      @dblclick:row="dblClickRow"
    >
      <template #[`item.truck`]="{ item }">
        <span>{{ trucksHash[item.truck] ? trucksHash[item.truck].regNum : '-' }}</span>
      </template>
      <template #[`item.startPositionDate`]="{ item }">
        <span>{{ new Date(item.startPositionDate).toLocaleString() }}</span>
      </template>
    </v-data-table-server>
  </EntityListWrapper>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { useStore } from 'vuex'
import dayjs from 'dayjs'
import { ButtonsPanel, DateRangeInput, EntityListWrapper, ListSettingsWrapper } from '@/shared/ui'
import { ScheduleNoteService } from '@/shared/services'

defineOptions({ name: 'ScheduleNoteList' })

const router = useRouter()
const store = useStore()

const formName = 'ScheduleNoteList'

const _initPeriod = () => {
  const todayM = dayjs()
  return [todayM.add(-10, 'd').format('YYYY-MM-DD'), todayM.add(10, 'd').format('YYYY-MM-DD')]
}

const loading = ref(false)
const settings = ref({
  truckFilter: null,
  period: _initPeriod(),
  listOptions: {
    page: 1,
    itemsPerPage: 50,
  },
})
const count = ref(0)
const list = ref([])

const headers = [
  { key: 'text', title: 'Текст', sortable: false },
  { key: 'truck', title: 'Грузовик', sortable: true },
  { key: 'startPositionDate', title: 'Дата', sortable: true },
]

const hasPermission = computed(() => store.getters.hasPermission('scheduleNote:write'))
const trucksForSelect = computed(() => store.getters.trucksForSelect({ type: 'truck' }))
const trucksHash = computed(() => store.getters.trucksHash)
const directoriesProfile = computed(() => store.getters.directoriesProfile)

function create() {
  router.push({ name: 'ScheduleNoteCreate' })
}

function refresh() {
  getData()
}

function dblClickRow(_, { item }) {
  router.push(`schedule_notes/${item._id}`)
}

async function getData() {
  try {
    loading.value = true
    const data = await ScheduleNoteService.getList({
      company: directoriesProfile.value,
      startDate: new Date(settings.value.period[0]).toISOString(),
      endDate: new Date(settings.value.period[1]).toISOString(),
      truckFilter: settings.value.truckFilter,
      skip: settings.value.listOptions.itemsPerPage * (settings.value.listOptions.page - 1),
      limit: settings.value.listOptions.itemsPerPage,
      sortBy: settings.value.listOptions.sortBy?.length
        ? settings.value.listOptions.sortBy[0]
        : null,
      sortDesc: settings.value.listOptions.sortDesc?.length
        ? settings.value.listOptions.sortDesc[0]
        : null,
    })
    list.value = data.items
    count.value = data.count
  } catch (e) {
    store.commit('setError', e.message)
  } finally {
    loading.value = false
  }
}

if (store.getters.formSettingsMap.has(formName)) {
  settings.value = store.getters.formSettingsMap.get(formName)
}

onBeforeRouteLeave((_to, _from, next) => {
  store.commit('setFormSettings', {
    formName,
    settings: { ...settings.value },
  })
  next()
})

watch(
  settings,
  () => {
    getData()
  },
  { deep: true }
)
</script>
<style scoped>
.filter-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: row;
  gap: 15px;
}
</style>
