<template>
  <div class="settings-wrapper">
    <app-table-column-setting
      :allHeaders="allHeaders"
      listSettingsName="carrierAgreementListSettings"
      @update:model-value="updateHeadersHandler"
    />

    <v-text-field
      :model-value="settings.search"
      label="Поиск"
      density="compact"
      clearable
      variant="outlined"
      hide-details
      :style="{ maxWidth: '400px' }"
      @update:model-value="updateSettings($event, 'search')"
    />
  </div>
</template>
<script>
import allHeaders from './allHeaders.js'
import { AppTableColumnSetting } from '@/shared/ui'

export default {
  name: 'IncomingInvoiceListSettings',
  components: { AppTableColumnSetting },
  model: {
    prop: 'settings',
    event: 'change',
  },
  props: {
    settings: Object,
  },
  setup(props, ctx) {
    function updateSettings(value, field) {
      ctx.emit('change', Object.assign({}, props.settings, { [field]: value }))
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
