<template>
  <div class="settings-wrapper">
    <app-table-column-setting
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
  </div>
</template>
<script setup>
import allHeaders from './allHeaders.js'
import { AppTableColumnSetting } from '@/shared/ui'

const emit = defineEmits(['updateHeaders'])
const settings = defineModel('settings')

function updateHeadersHandler(val) {
  emit('updateHeaders', val)
}
</script>
<style scoped>
.settings-wrapper {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 10px;
  gap: 15px;
}
</style>
