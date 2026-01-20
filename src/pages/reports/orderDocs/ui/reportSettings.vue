<template>
  <div class="settings-wrapper">
    <app-table-column-setting
      :allHeaders="allHeaders"
      :listSettingsName="listSettingsName"
      @change="updateActiveHeaders"
    />
    <refresh-btn @click.native="$emit('refresh')" />
    <v-text-field
      :value="settings.date"
      type="date"
      label="Дата (конец периода)"
      dense
      clearable
      outlined
      hide-details
      :style="{ maxWidth: '230px' }"
      @change="updateSettings($event, 'date')"
    />

    <v-select
      :value="settings.state"
      label="Документы"
      dense
      clearable
      multiple
      outlined
      :items="stateItems"
      hide-details
      :style="{ maxWidth: '230px' }"
      @change="updateSettings($event, 'state')"
    />

    <v-select
      :value="settings.tks"
      item-text="name"
      item-value="_id"
      label="ТК"
      dense
      clearable
      multiple
      outlined
      :items="tkNameItems"
      hide-details
      :style="{ maxWidth: '230px' }"
      @change="updateSettings($event, 'tks')"
    />

    <v-autocomplete
      :value="settings.clients"
      item-text="name"
      item-value="_id"
      label="Клиенты"
      dense
      clearable
      auto-select-first
      multiple
      outlined
      :items="clientItems"
      hide-details
      :style="{ maxWidth: '280px' }"
      @change="updateSettings($event, 'clients')"
    />

    <v-autocomplete
      :value="settings.driver"
      item-text="fullName"
      item-value="_id"
      label="Водитель"
      dense
      clearable
      auto-select-first
      outlined
      :items="driverItems"
      hide-details
      :style="{ maxWidth: '320px' }"
      @change="updateSettings($event, 'driver')"
    />
    <v-autocomplete
      :value="settings.truck"
      item-text="regNum"
      item-value="_id"
      label="Грузовик"
      dense
      auto-select-first
      clearable
      outlined
      :items="truckItems"
      hide-details
      :style="{ maxWidth: '320px' }"
      @change="updateSettings($event, 'truck')"
    />
    <v-select
      :value="settings.getDocsDays"
      label="Сдача документов, дней"
      dense
      clearable
      multiple
      outlined
      :items="daysIntervalItems"
      hide-details
      :style="{ maxWidth: '200px' }"
      @change="updateSettings($event, 'getDocsDays')"
    />
    <v-select
      :value="settings.reviewDocsDays"
      label="Проверка документов, дней"
      dense
      clearable
      outlined
      multiple
      :items="daysIntervalItems"
      hide-details
      :style="{ maxWidth: '200px' }"
      @change="updateSettings($event, 'reviewDocsDays')"
    />
  </div>
</template>

<script>
import store from '@/store'
import { watch, ref, computed } from 'vue'
import { RefreshBtn } from '@/shared/ui'
import { AppTableColumnSetting } from '@/shared/ui'
import { useCarrierStore } from '@/entities/carrier'

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

    const truckItems = computed(() =>
      store.getters.trucks.filter((i) => i.type === 'truck')
    )

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
