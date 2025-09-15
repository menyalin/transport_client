import { AddressForm } from '@/entities/address';
<template>
  <div class="wrapper">
    <v-autocomplete
      :model-value="settings.executor"
      :items="carrierItems"
      item-title="name"
      item-value="_id"
      label="ТК Исполнитель"
      density="compact"
      hide-details
      clearable
      variant="outlined"
      auto-select-first
      :style="{ maxWidth: '300px' }"
      @update:model-value="updateSettings($event, 'executor')"
    />
    <v-text-field
      :model-value="settings.search"
      label="Поиск"
      density="compact"
      hide-details
      clearable
      variant="outlined"
      @update:model-value="updateSettings($event, 'search')"
    />
  </div>
</template>
<script>
import { useCarriers } from '../carrier/useCarriers'

export default {
  name: 'AgreementListSettings',
  model: {
    prop: 'settings',
    event: 'change',
  },
  props: {
    settings: Object,
  },
  setup(props, ctx) {
    const { allCarriers: carrierItems } = useCarriers()
    function updateSettings(value, field) {
      ctx.emit('change', { ...props.settings.value, [field]: value })
    }
    return {
      carrierItems,
      updateSettings,
    }
  },
}
</script>
<style scoped>
.wrapper {
  display: flex;
  flex-direction: row;
  gap: 15px;
  padding: 10px;
}
</style>
