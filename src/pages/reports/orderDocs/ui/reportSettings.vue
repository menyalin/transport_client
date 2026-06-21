<template>
  <div class="settings-wrapper">
    <app-table-column-setting
      :allHeaders="allHeaders"
      :listSettingsName="listSettingsName"
      @change="updateActiveHeaders"
    />
    <refresh-btn @click="$emit('refresh')" />
    <date-time-input v-model="settings.date" label="Дата (конец периода)" hide-details />

    <v-select
      v-model="settings.state"
      label="Документы"
      clearable
      multiple
      :items="stateItems"
      hide-details
      :style="{ minWidth: '230px' }"
    />

    <v-select
      v-model="settings.tks"
      item-title="name"
      item-value="_id"
      label="ТК"
      clearable
      multiple
      :items="tkNameItems"
      hide-details
      :style="{ minWidth: '230px' }"
    />

    <v-autocomplete
      v-model="settings.clients"
      item-title="name"
      item-value="_id"
      label="Клиенты"
      clearable
      auto-select-first
      multiple
      :items="clientItems"
      hide-details
      :style="{ minWidth: '280px' }"
    />

    <v-autocomplete
      v-model="settings.driver"
      item-title="fullName"
      item-value="_id"
      label="Водитель"
      clearable
      auto-select-first
      :items="driverItems"
      hide-details
      :style="{ minWidth: '300px' }"
    />
    <v-autocomplete
      v-model="settings.truck"
      item-title="regNum"
      item-value="_id"
      label="Грузовик"
      auto-select-first
      clearable
      :items="truckItems"
      hide-details
      :style="{ minWidth: '300px' }"
    />
    <v-select
      v-model="settings.getDocsDays"
      label="Сдача документов, дней"
      clearable
      multiple
      :items="daysIntervalItems"
      hide-details
      :style="{ minWidth: '300px' }"
    />
    <v-select
      v-model="settings.reviewDocsDays"
      label="Проверка документов, дней"
      clearable
      multiple
      :items="daysIntervalItems"
      hide-details
      :style="{ minWidth: '300px' }"
    />
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { RefreshBtn, AppTableColumnSetting, DateTimeInput } from '@/shared/ui'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'

defineOptions({ name: 'ReportSettings' })

const settings = defineModel()

defineProps({
  allHeaders: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['changeHeaders', 'refresh'])

const store = useStore()
const carrierStore = useCarrierStore()

const listSettingsName = 'orderDocsReportPage'

function updateActiveHeaders(value) {
  emit('changeHeaders', value)
}

const stateItems = [
  { title: 'Не получены', value: 'notGetted' },
  { title: 'На проверке', value: 'review' },
  { title: 'На исправлении', value: 'correction' },
]
const daysIntervalItems = [
  { title: '< 5', value: 1 },
  { title: '5 - 10', value: 2 },
  { title: '10 - 20', value: 3 },
  { title: '20 - 30', value: 4 },
  { title: ' > 30 ', value: 5 },
]

const tkNameItems = computed(() => carrierStore.carriers)

const driverItems = computed(() => store.getters.drivers)

const truckItems = computed(() => store.getters.trucks.filter((i) => i.type === 'truck'))

const clientItems = computed(() => store.getters.partners.filter((i) => i.isClient))
</script>
<style scoped>
.settings-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}
.settings-wrapper > * {
  flex: none;
}
</style>
