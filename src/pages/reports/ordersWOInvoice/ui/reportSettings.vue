<template>
  <div class="settings-wrapper">
    <app-table-column-setting
      :allHeaders="allHeaders"
      :listSettingsName="listSettingsName"
      @update:model-value="updateActiveHeaders"
    />
    <refresh-btn @click="$emit('refresh')" />
    <DateRangeInput
      :period="settings.period"
      @update:model-value="updateSettings($event, 'period')"
    />

    <v-select
      :model-value="settings.tks"
      item-title="name"
      item-value="_id"
      label="ТК"
      density="compact"
      clearable
      chips
      closable-chips
      multiple
      variant="outlined"
      :items="tkNameItems"
      hide-details
      :style="{ maxWidth: '300px' }"
      @update:model-value="updateSettings($event, 'tks')"
    />

    <v-autocomplete
      :model-value="settings.agreements"
      item-title="name"
      item-value="_id"
      label="Соглашения"
      density="compact"
      clearable
      auto-select-first
      multiple
      variant="outlined"
      chips
      closable-chips
      :items="agreementItems"
      hide-details
      :style="{ maxWidth: '500px' }"
      @update:model-value="updateSettings($event, 'agreements')"
    />
  </div>
</template>

<script>
import store from '@/store'
import { watch, ref, computed } from 'vue'
import { AppTableColumnSetting, DateRangeInput, RefreshBtn } from '@/shared/ui'

export default {
  name: 'ReportSettings',
  components: {
    RefreshBtn,
    AppTableColumnSetting,
    DateRangeInput,
  },
  model: {
    prop: 'settings',
    event: 'change',
  },
  props: {
    agreementItems: Array,
    settings: Object,
    allHeaders: {
      type: Array,
      required: true,
    },
  },
  setup(props, ctx) {
    const listSettingsName = 'orderDocsReportPage'

    const activeHeaders = ref([])

    function updateSettings(value, field) {
      ctx.emit('change', Object.assign({}, props.settings, { [field]: value }))
    }

    function updateActiveHeaders(value) {
      ctx.emit('changeHeaders', value)
    }

    const tkNameItems = computed(() => {
      return store.getters.tkNames
    })

    watch([activeHeaders], () => {
      ctx.emit('changeHeaders', activeHeaders.value)
    })
    return {
      updateActiveHeaders,
      updateSettings,
      listSettingsName,

      activeHeaders,
      tkNameItems,
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
