<template>
  <v-container>
    <ReportTitle title="Простой транспорта" />
    <div class="report-settings">
      <v-btn icon @click="getData" variant="text">
        <v-icon> mdi-cached </v-icon>
      </v-btn>
      <v-text-field
        v-model.trim="settings.search"
        label="Поиск"
        hideDetails
        :style="{ 'max-width': '300px' }"
      />
      <v-checkbox
        v-model="settings.selectedOnly"
        label="Только выделенные"
        hideDetails
        class="py-0 my-0"
      />
      <v-spacer />
      <v-btn
        v-if="showCopyButton"
        variant="text"
        :disabled="!filteredRows.length"
        @click="copyHandler"
      >
        скопировать в буфер
      </v-btn>
    </div>
    <v-data-table
      v-model="settings.selected"
      item-value="_id"
      :singleSelect="false"
      :headers="headers"
      :items="filteredRows"
      :loading="loading"
      :search="settings.search"
      fixed-header
      height="76vh"
      show-select
      :footer-props="{
        'items-per-page-options': [50, 100, 200],
      }"
      @dblclick:row="dblClickRow"
    />
  </v-container>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ReportService } from '@/shared/services'
import { ReportTitle } from '@/shared/ui'
import usePersistedRef from '@/shared/hooks/usePersistedRef'
import { copyToClipboard } from './copyToClipboard'

defineOptions({ name: 'OrdersInProgress' })

const store = useStore()
const router = useRouter()

const loading = ref(false)
const rows = ref([])

const settings = usePersistedRef(
  {
    search: null,
    selected: [],
    selectedOnly: false,
  },
  'OrdersInProgressReport:settings'
)

const headers = [
  { value: 'clientName', title: 'Заказчик' },
  { value: 'date', title: 'Дата рейса' },
  { value: 'loadingPoints', title: 'Погрузка' },
  { value: 'unloadingPoints', title: 'Разгрузка' },
  { value: 'truckNum', title: 'Грузовик' },
  { value: 'trailerNum', title: 'Прицеп' },
  { value: 'driverName', title: 'Водитель' },
  { value: 'driverPhone', title: 'Телефон' },
  { value: 'state', title: 'Статус' },
  { value: 'address', title: 'Адрес' },
]

const directoriesProfile = computed(() => store.getters.directoriesProfile)

const filteredRows = computed(() =>
  rows.value
    .filter((item) => {
      if (!settings.value.selectedOnly) return true
      return settings.value.selected.includes(item._id)
    })
    .map((item) => ({
      ...item,
      date: new Date(item.plannedDate).toLocaleDateString(),
      state: item.state === 'loading' ? 'На погрузке' : 'На выгрузке',
      address: item.currentPoint?.name || item.currentPoint?.address || '',
    }))
)

const showCopyButton = computed(() => !!window.ClipboardItem)

async function getData() {
  loading.value = true
  try {
    rows.value = await ReportService.ordersInProgress({
      profile: directoriesProfile.value,
    })
  } catch (e) {
    store.commit('setError', e?.message || 'Ошибка загрузки')
  } finally {
    loading.value = false
  }
}

function dblClickRow(_, { item }) {
  router.push(`/orders/${item._id}`)
}

async function copyHandler() {
  const ok = await copyToClipboard(headers, filteredRows.value)
  if (!ok) store.commit('setError', 'Не удалось скопировать в буфер')
}

getData()
</script>
<style scoped>
.report-settings {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.v-data-table {
  white-space: nowrap;
}
</style>
