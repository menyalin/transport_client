import { AddressForm } from '@/entities/address';
<template>
  <div class="wrapper">
    <v-autocomplete
      :modelValue="settings.executor"
      :items="carrierItems"
      itemTitle="name"
      itemValue="_id"
      label="ТК Исполнитель"
     
      hideDetails
      clearable
      variant="outlined"
       density="compact"
      autoSelectFirst
      :style="{ maxWidth: '300px' }"
      @update:model-value="updateSettings($event, 'executor')"
    />
    <v-text-field
      :modelValue="settings.search"
      label="Поиск"
     
      hideDetails
      clearable
      variant="outlined"
       density="compact"
      @change="updateSettings($event, 'search')"
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
