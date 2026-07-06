<template>
  <div class="settings-wrapper">
    <v-select
      :model-value="settings.type"
      label="Тип перевозчика"
      :items="carrierTypes"
      hide-details
      :style="{ maxWidth: '300px' }"
      @update:model-value="updateSettings($event, 'type')"
    />
    <v-text-field
      :model-value="settings.search"
      label="Поиск"
      hide-details
      clearable
      :style="{ maxWidth: '500px' }"
      @update:model-value="updateSettings($event, 'search')"
    />
  </div>
</template>
<script setup>
defineOptions({ name: 'CarrierListSettings' })

const settings = defineModel({
  type: Object,
  default: () => ({
    type: 'all',
    search: '',
  }),
})

const carrierTypes = [
  { title: 'Все', value: 'all' },
  { title: 'Свой', value: 'own' },
  { title: 'Привлеченный', value: 'outsource' },
]

function updateSettings(val, field) {
  settings.value = { ...settings.value, [field]: val }
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
