<template>
  <div class="settings-wrapper">
    <app-table-column-setting
      :allHeaders="allHeaders"
      :listSettingsName="listSettingsName"
      @change="updateActiveHeaders"
    />
    <refresh-btn @click.native="$emit('refresh')" />
    <v-text-field
      :model-value="settings.date"
      type="date"
      label="Дата (конец периода)"
      clearable
      hide-details
      :style="{ maxWidth: '230px' }"
      @change="updateSettings($event, 'date')"
    />

    <v-select
      :model-value="settings.state"
      label="Документы"
      clearable
      multiple
      :items="stateItems"
      hide-details
      :style="{ maxWidth: '230px' }"
      @update:model-value="updateSettings($event, 'state')"
    />

    <v-select
      :model-value="settings.tks"
      item-title="name"
      item-value="_id"
      label="ТК"
      clearable
      multiple
      :items="tkNameItems"
      hide-details
      :style="{ maxWidth: '230px' }"
      @update:model-value="updateSettings($event, 'tks')"
    />

    <v-autocomplete
      :model-value="settings.clients"
      item-title="name"
      item-value="_id"
      label="Клиенты"
      clearable
      auto-select-first
      multiple
      :items="clientItems"
      hide-details
      :style="{ maxWidth: '280px' }"
      @update:model-value="updateSettings($event, 'clients')"
    />

    <v-autocomplete
      :model-value="settings.driver"
      item-title="fullName"
      item-value="_id"
      label="Водитель"
      clearable
      auto-select-first
      :items="driverItems"
      hide-details
      :style="{ maxWidth: '320px' }"
      @update:model-value="updateSettings($event, 'driver')"
    />
    <v-autocomplete
      :model-value="settings.truck"
      item-title="regNum"
      item-value="_id"
      label="Грузовик"
      auto-select-first
      clearable
      :items="truckItems"
      hide-details
      :style="{ maxWidth: '320px' }"
      @update:model-value="updateSettings($event, 'truck')"
    />
    <v-select
      :model-value="settings.getDocsDays"
      label="Сдача документов, дней"
      clearable
      multiple
      :items="daysIntervalItems"
      hide-details
      :style="{ maxWidth: '200px' }"
      @update:model-value="updateSettings($event, 'getDocsDays')"
    />
    <v-select
      :model-value="settings.reviewDocsDays"
      label="Проверка документов, дней"
      clearable
      multiple
      :items="daysIntervalItems"
      hide-details
      :style="{ maxWidth: '200px' }"
      @update:model-value="updateSettings($event, 'reviewDocsDays')"
    />
  </div>
</template>

<script>
import store from '@/store'
import { watch, ref, computed } from 'vue'
import { RefreshBtn } from '@/shared/ui'
import { AppTableColumnSetting } from '@/shared/ui'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'

export default {
  name: 'ReportSettings',
  components: {
    RefreshBtn,
    AppTableColumnSetting,
  },
  model: {
    prop: 'settings',
    event: 'change',
  },
  props: {
    settings: Object,
    allHeaders: {
      type: Array,
      required: true,
    },
  },
  setup(props, ctx) {
    const listSettingsName = 'orderDocsReportPage'
    const carrierStore = useCarrierStore()
    const allHeaders = props.allHeaders
    const activeHeaders = ref([])

    function updateSettings(value, field) {
      ctx.emit('change', Object.assign({}, props.settings, { [field]: value }))
    }

    function updateActiveHeaders(value) {
      ctx.emit('changeHeaders', value)
    }

    const stateItems = [
      { text: 'Не получены', value: 'notGetted' },
      { text: 'На проверке', value: 'review' },
      { text: 'На исправлении', value: 'correction' },
    ]
    const groupByItems = [
      { text: 'Месяцам', value: 'month' },
      { text: 'Водителям', value: 'driver' },
    ]

    const daysIntervalItems = [
      { text: '< 5', value: 1 },
      { text: '5 - 10', value: 2 },
      { text: '10 - 20', value: 3 },
      { text: '20 - 30', value: 4 },
      { text: ' > 30 ', value: 5 },
    ]

    const tkNameItems = computed(() => {
      return carrierStore.carriers
    })

    const driverItems = computed(() => {
      return store.getters.drivers
    })

    const truckItems = computed(() => store.getters.trucks.filter((i) => i.type === 'truck'))

    const clientItems = computed(() => {
      return store.getters.partners.filter((i) => i.isClient)
    })

    watch([activeHeaders], () => {
      ctx.emit('changeHeaders', activeHeaders.value)
    })
    return {
      groupByItems,
      updateActiveHeaders,
      updateSettings,
      listSettingsName,
      allHeaders,
      activeHeaders,
      tkNameItems,
      clientItems,
      stateItems,
      driverItems,
      truckItems,
      daysIntervalItems,
    }
  },
}
</script>

<style scoped>
.settings-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
}
</style>
