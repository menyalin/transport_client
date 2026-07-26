<template>
  <div class="settings-wrapper">
    <AppTableColumnSetting
      :allHeaders="allHeaders"
      :listSettingsName="listSettingsName"
      @change="updateActiveHeaders"
    />
    <RefreshBtn @click="$emit('refresh')" />
    <DateRangeInput v-model="settings.period" />

    <v-autocomplete
      v-model="settings.carriers"
      item-title="name"
      item-value="_id"
      label="ТК"
      multiple
      :items="carrierStore.carriers"
      hide-details
      :style="{ minWidth: '300px' }"
    />

    <v-autocomplete
      v-model="settings.agreements"
      item-title="name"
      item-value="_id"
      label="Соглашения"
      clearable
      multiple
      :items="agreementItems"
      hide-details
      :style="{ minWidth: '500px' }"
    />
  </div>
</template>
<script setup>
import { AppTableColumnSetting, DateRangeInput, RefreshBtn } from '@/shared/ui'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'

defineOptions({ name: 'ReportSettings' })

const settings = defineModel({ type: Object })

defineProps({
  agreementItems: Array,
  allHeaders: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['changeHeaders', 'refresh'])

const carrierStore = useCarrierStore()

const listSettingsName = 'orderDocsReportPage'

function updateActiveHeaders(value) {
  emit('changeHeaders', value)
}
</script>
<style scoped>
.settings-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
}
.settings-wrapper > * {
  flex: none;
}
</style>
