<template>
  <div class="settings-wrapper">
    <app-table-column-setting
      :allHeaders="allHeaders"
      :listSettingsName="listSettingsName"
      @change="updateActiveHeaders"
    />
    <refresh-btn @click.native="$emit('refresh')" />
    <DateRangeInput
      :period="settings.period"
      @change="updateSettings($event, 'period')"
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
      :value="settings.agreements"
      item-text="name"
      item-value="_id"
      label="Соглашения"
      dense
      clearable
      auto-select-first
      multiple
      outlined
      :items="agreementItems"
      hide-details
      :style="{ maxWidth: '280px' }"
      @change="updateSettings($event, 'agreements')"
    />
  </div>
</template>

<script>
import store from '@/store'
import { watch, ref, computed } from 'vue'
import { RefreshBtn } from '../../../shared/ui'
import { AppTableColumnSetting, DateRangeInput } from '@/shared/ui'

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
    const allHeaders = props.allHeaders
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
      allHeaders,
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
