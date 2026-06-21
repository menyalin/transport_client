<template>
  <v-container>
    <ReportTitle title="Статус транспорта на дату" />
    <div class="report-settings">
      <v-btn icon @click.stop="getData" variant="text">
        <v-icon> mdi-cached </v-icon>
      </v-btn>
      <DateTimeInput
        v-model="settings.date"
        label="Отчет на дату"
        hideDetails
        type="datetime-local"
        :style="{ maxWidth: '250px' }"
      />
      <v-select
        v-model="settings.tkName"
        :items="carrierStore.carriers"
        item-title="name"
        item-value="_id"
        label="ТК"
        hide-details
        clearable
        :style="{ maxWidth: '350px' }"
      />
    </div>
    <v-data-table
      :headers="headers"
      :items="filteredRows"
      :loading="loading"
      :search="settings.search"
      fixed-header
      height="78vh"
    >
      <template #[`item.tkName`]="{ item }">
        {{
          carrierStore.carriersMap.has(item.tkName)
            ? carrierStore.carriersMap.get(item.tkName)?.name
            : ''
        }}
      </template>
      <template #[`item.truckNum`]="{ item }">
        {{ trucksMap.has(item._id) ? trucksMap.get(item._id).regNum : '' }}
      </template>
      <template #[`item.trailerNum`]="{ item }">
        {{
          !!item.crew && trucksMap.has(item.crew.transport.trailer)
            ? trucksMap.get(item.crew.transport.trailer).regNum
            : ''
        }}
      </template>
      <template #[`item.driverName`]="{ item }">
        {{
          !!item.crew && driversMap.has(item.crew.driver)
            ? driversMap.get(item.crew.driver).fullName
            : ''
        }}
      </template>
      <template #[`item.downtime`]="{ item }">
        {{ !!item.downtime ? item.downtime.title : '' }}
      </template>
    </v-data-table>
  </v-container>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { ReportService } from '@/shared/services'
import { DateTimeInput, ReportTitle } from '@/shared/ui'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'
import { usePersistedRef } from '@/shared/hooks'

defineOptions({ name: 'TruckStateOnDate' })

const carrierStore = useCarrierStore()
const store = useStore()

const loading = ref(false)
const settings = usePersistedRef(
  {
    date: new Date().toISOString(),
    search: null,
    tkName: null,
    truckType: 'truck',
  },
  'truckStateOnDate:settings'
)
const rows = ref([])

const directoriesProfile = computed(() => store.getters.directoriesProfile)

const headers = [
  { value: 'tkName', title: 'ТК' },
  { value: 'truckNum', title: 'Грузовик' },
  { value: 'trailerNum', title: 'Прицеп' },
  { value: 'driverName', title: 'Водитель' },
  { value: 'downtime', title: 'Примечание' },
]

const filteredRows = computed(() => rows.value)
const trucksMap = computed(() => store.getters.trucksMap)
const driversMap = computed(() => store.getters.driversMap)

watch(settings, getData, { deep: true, immediate: true })

async function getData() {
  try {
    loading.value = true
    rows.value = await ReportService.truckStateOnDate({
      company: directoriesProfile.value,
      date: settings.value.date,
      truckType: settings.value.truckType,
      tkName: settings.value.tkName,
    })
  } finally {
    loading.value = false
  }
}
</script>
<style scoped>
.report-settings {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 15px;
  gap: 10px;
}
</style>
