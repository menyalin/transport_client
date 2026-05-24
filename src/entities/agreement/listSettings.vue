<template>
  <div class="wrapper">
    <v-select
      v-model="settings.state"
      :items="stateItems"
      hide-details
      clearable
      :style="{ maxWidth: '200px' }"
      label="Состояние"
    />

    <v-autocomplete
      v-model="settings.executor"
      :items="carrierItems"
      item-title="name"
      item-value="_id"
      label="ТК Исполнитель"
      hide-details
      :style="{ maxWidth: '300px' }"
    />
    <v-autocomplete
      v-model="settings.clients"
      :items="clientItems"
      item-title="name"
      item-value="_id"
      hide-details
      clearable
      label="Клиенты"
      :style="{ maxWidth: '400px' }"
      multiple
    />
    <!-- <vat-rate-select
      label="НДС"
      v-model="settings.vatRate"
      hide-details
      clearable
      :style="{ maxWidth: '200px' }"
    /> -->
    <v-text-field v-model="settings.search" label="Поиск" hide-details clearable />
  </div>
</template>

<script setup>
// import { VatRateSelect } from '@/shared/ui'

const settings = defineModel('settings')

defineProps({
  clientItems: {
    type: Array,
    default: () => [],
  },
  carrierItems: {
    type: Array,
    required: true,
  },
})

const stateItems = [
  { value: 'all', title: 'Все' },
  { value: 'opened', title: 'Открытые' },
  { value: 'closed', title: 'Закрытые' },
]
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: row;
  gap: 15px;
  padding: 10px;
}
</style>
