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
      outlined
      :items="driverItems"
      hide-details
      :style="{ maxWidth: '320px' }"
      @change="updateSettings($event, 'driver')"
    />
  </div>
</template>

<script>
import store from '@/store'
import { watch, ref, computed } from 'vue'
import { RefreshBtn } from '../../../shared/ui'

import { ALL_HEADERS } from '../index.js'

import { AppTableColumnSetting } from '@/shared/ui'

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
  },
  setup(props, ctx) {
    const listSettingsName = 'orderDocsReportPage'
    const allHeaders = ALL_HEADERS
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

    const tkNameItems = computed(() => {
      return store.getters.tkNames
    })

    const driverItems = computed(() => {
      return store.getters.drivers
    })

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
