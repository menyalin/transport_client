<template>
  <div class="settings-wrapper">
    <AppTableColumnSetting
      :allHeaders="allHeaders"
      listSettingsName="carrierAgreementListSettings"
      @change="updateHeadersHandler"
    />

    <v-text-field
      :modelValue="settings?.search"
      label="Поиск"
     
      clearable
      variant="outlined"
       density="compact"
      hideDetails
      :style="{ maxWidth: '400px' }"
      @change="updateSettings($event, 'search')"
    />
  </div>
</template>
<script>
import allHeaders from './allHeaders.js'
import { AppTableColumnSetting, DateRangeInput } from '@/shared/ui'

export default {
  name: 'IncomingInvoiceListSettings',
  components: { AppTableColumnSetting, DateRangeInput },
  model: {
    prop: 'settings',
    event: 'change',
  },
  props: {
    settings: Object,
  },
  setup(props, ctx) {
    function updateSettings(value, field) {
      const currentSettings = props.settings || {}
      ctx.emit('change', Object.assign({}, currentSettings, { [field]: value }))
    }

    function updateHeadersHandler(val) {
      ctx.emit('updateHeaders', val)
    }
    return {
      updateHeadersHandler,
      updateSettings,
      allHeaders,
    }
  },
}
</script>
<style scoped>
  .settings-wrapper {
    display: flex;
    flex-direction: row;
    padding: 10px;
    gap: 15px;
  }
</style>
