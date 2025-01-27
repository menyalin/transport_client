import { AddressForm } from '@/entities/address';
<template>
  <div class="wrapper">
    <v-text-field
      :value="settings.search"
      label="Поиск"
      dense
      hide-details
      clearable
      outlined
      @change="updateSettings($event, 'search')"
    />
  </div>
</template>
<script>
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
    function updateSettings(value, field) {
      ctx.emit('change', { ...props.settings.value, [field]: value })
    }
    return {
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
