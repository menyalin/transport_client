import { AddressForm } from '@/entities/address';
<template>
  <div class="wrapper">
    <v-autocomplete
      :value="settings.executor"
      :items="carrierItems"
      item-text="name"
      item-value="_id"
      label="ТК Исполнитель"
      dense
      hide-details
      clearable
      outlined
      auto-select-first
      @change="updateSettings($event, 'executor')"
      :style="{ maxWidth: '300px' }"
    />
    <v-autocomplete
      :value="settings.clients"
      item-text="name"
      item-value="_id"
      :items="clientItems"
      dense
      hide-details
      clearable
      outlined
      label="Клиенты"
      @change="updateSettings($event, 'clients')"
      :style="{ maxWidth: '400px' }"
      multiple
    />
    <vat-rate-select
      :value="settings.vatRate"
      dense
      hide-details
      clearable
      outlined
      label="НДС"
      @change="updateSettings($event, 'vatRate')"
      :style="{ maxWidth: '200px' }"
    />
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
import { VatRateSelect } from '@/shared/ui'
import { useCarriers } from '../carrier/useCarriers'

export default {
  name: 'AgreementListSettings',
  components: { VatRateSelect },
  model: {
    prop: 'settings',
    event: 'change',
  },
  props: {
    settings: Object,
    clientItems: {
      type: Array,
      default: () => [],
    },
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
