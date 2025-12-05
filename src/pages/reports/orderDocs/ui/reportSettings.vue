<template>
  <div class="settings-wrapper">
    <AppTableColumnSetting
      :allHeaders="allHeaders"
      :listSettingsName="listSettingsName"
      @change="updateActiveHeaders"
    />
    <RefreshBtn @click="$emit('refresh')" />
    <v-text-field
      :modelValue="settings.date"
      type="date"
      label="Дата (конец периода)"
      clearable
      variant="outlined"
      density="compact"
      hideDetails
      :style="{ maxWidth: '230px' }"
      @change="updateSettings($event, 'date')"
    />

    <v-select
      :modelValue="settings.state"
      label="Документы"
      clearable
      multiple
      variant="outlined"
      density="compact"
      :items="stateItems"
      hideDetails
      :style="{ maxWidth: '230px' }"
      @update:model-value="updateSettings($event, 'state')"
    />

    <v-select
      :modelValue="settings.tks"
      itemTitle="name"
      itemValue="_id"
      label="ТК"
      clearable
      multiple
      variant="outlined"
      density="compact"
      :items="tkNameItems"
      hideDetails
      :style="{ maxWidth: '230px' }"
      @update:model-value="updateSettings($event, 'tks')"
    />

    <v-autocomplete
      :modelValue="settings.clients"
      itemTitle="name"
      itemValue="_id"
      label="Клиенты"
      clearable
      autoSelectFirst
      multiple
      variant="outlined"
      density="compact"
      :items="clientItems"
      hideDetails
      :style="{ maxWidth: '280px' }"
      @update:model-value="updateSettings($event, 'clients')"
    />

    <v-autocomplete
      :modelValue="settings.driver"
      itemTitle="fullName"
      itemValue="_id"
      label="Водитель"
      clearable
      autoSelectFirst
      variant="outlined"
      density="compact"
      :items="driverItems"
      hideDetails
      :style="{ maxWidth: '320px' }"
      @update:model-value="updateSettings($event, 'driver')"
    />
    <v-autocomplete
      :modelValue="settings.truck"
      itemTitle="regNum"
      itemValue="_id"
      label="Грузовик"
      autoSelectFirst
      clearable
      variant="outlined"
      density="compact"
      :items="truckItems"
      hideDetails
      :style="{ maxWidth: '320px' }"
      @update:model-value="updateSettings($event, 'truck')"
    />
    <v-select
      :modelValue="settings.getDocsDays"
      label="Сдача документов, дней"
      clearable
      multiple
      variant="outlined"
      density="compact"
      :items="daysIntervalItems"
      hideDetails
      :style="{ maxWidth: '200px' }"
      @update:model-value="updateSettings($event, 'getDocsDays')"
    />
    <v-select
      :modelValue="settings.reviewDocsDays"
      label="Проверка документов, дней"
      clearable
      variant="outlined"
      density="compact"
      multiple
      :items="daysIntervalItems"
      hideDetails
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

  export default {
    name: 'ReportSettings',
    components: {
      RefreshBtn,
      AppTableColumnSetting,
    },
    props: {
      modelValue: {
        type: Object,
        default: () => ({}),
      },
      settings: {
        type: Object,
        default: () => ({}),
      },
      allHeaders: {
        type: Array,
        required: true,
      },
    },
    emits: ['update:modelValue', 'change', 'changeHeaders'],
    setup(props, ctx) {
      const listSettingsName = 'orderDocsReportPage'
      const activeHeaders = ref([])

      function updateSettings(value, field) {
        const currentSettings = props.modelValue || props.settings
        const newSettings = Object.assign({}, currentSettings, { [field]: value })
        ctx.emit('change', newSettings)
        ctx.emit('update:modelValue', newSettings)
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
        return store.getters.tkNames
      })

      const driverItems = computed(() => {
        return store.getters.drivers
      })

      const truckItems = computed(() => store.getters.trucks.filter(i => i.type === 'truck'))

      const clientItems = computed(() => {
        return store.getters.partners.filter(i => i.isClient)
      })

      watch([activeHeaders], () => {
        ctx.emit('changeHeaders', activeHeaders.value)
      })
      return {
        groupByItems,
        updateActiveHeaders,
        updateSettings,
        listSettingsName,
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
