<template>
  <EntityListWrapper>
    <buttons-panel
      panel-type="list"
      :disabled-refresh="!directoriesProfile"
      :disabledSubmit="!hasWritePermission"
      @submit="create"
      @refresh="refresh"
    />
    <ListSettingsWrapper>
      <v-text-field
        v-model="settings.search"
        label="Поиск"
        hide-details
        clearable
        :style="{ 'max-width': '400px' }"
      />
    </ListSettingsWrapper>
    <v-data-table
      :headers="headers"
      :items="prepareDocuments"
      :loading="loading"
      fixed-header
      :search="settings.search"
      height="73vh"
      :row-props="rowProps"
    />
  </EntityListWrapper>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ButtonsPanel, EntityListWrapper, ListSettingsWrapper } from '@/shared/ui'
import { WorkerService } from '@/shared/services'
import usePersistedRef from '@/shared/hooks/usePersistedRef'

const router = useRouter()
const store = useStore()

const settings = usePersistedRef({ search: null }, 'WorkerList:settings')

const headers = [
  { value: 'name', title: 'Имя' },
  { value: 'fullName', title: 'Полное имя' },
  { value: 'position', title: 'Должность' },
  { value: 'roles', title: 'Роли' },
  { value: 'note', title: 'Примечание' },
]

const workers = ref([])
const loading = ref(false)

const directoriesProfile = computed(() => store.getters.directoriesProfile)
const hasWritePermission = computed(() => store.getters.hasPermission('worker:write'))

const getWorkers = async () => {
  try {
    loading.value = true
    workers.value = await WorkerService.getByDirectoriesProfile()
    loading.value = false
  } catch (e) {
    loading.value = false
    store.commit('setError', e.message)
  }
}

const prepareDocuments = computed(() =>
  workers.value
    .map((i) => ({
      ...i,
      roles: i.roles
        ? i.roles.map((role) => store.getters.staffRolesMap.get(role)).join(', ')
        : null,
    }))
    .sort((a, b) => (a.name < b.name ? -1 : 1))
)

const rowProps = ({ item }) => ({
  style: { cursor: 'pointer' },
  onDblclick: () => router.push(`workers/${item._id}`),
})

function create() {
  router.push({ name: 'WorkerCreate' })
}

function refresh() {
  getWorkers()
}

onMounted(() => {
  getWorkers()
})
</script>
