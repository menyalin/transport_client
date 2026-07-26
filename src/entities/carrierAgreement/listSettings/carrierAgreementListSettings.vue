<template>
  <ListSettingsWrapper>
    <AppTableColumnSetting
      :allHeaders="allHeaders"
      listSettingsName="carrierAgreementListSettings"
      @change="updateHeadersHandler"
    />

    <v-text-field
      v-model.lazy="settings.search"
      label="Поиск"
      clearable
      hide-details
      :style="{ maxWidth: '400px' }"
    />
  </ListSettingsWrapper>
</template>
<script setup>
import allHeaders from './allHeaders.js'
import { AppTableColumnSetting, ListSettingsWrapper } from '@/shared/ui'

const emit = defineEmits(['updateHeaders'])
const settings = defineModel('settings', { type: Object })

function updateHeadersHandler(val) {
  emit('updateHeaders', val)
}
</script>
