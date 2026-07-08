<template>
  <div class="wrapper">
    <v-autocomplete
      :model-value="settings.agreements"
      label="Соглашения"
      multiple
      auto-select-first
      clearable
      item-value="_id"
      item-title="name"
      hide-details
      :items="agreementItems"
      @update:model-value="changeFieldHandler('agreements', $event)"
      :style="{ maxWidth: '600px' }"
    />
    <v-text-field
      :model-value="settings.searchStr"
      label="Поиск"
      hide-details
      clearable
      @update:model-value="changeFieldHandler('searchStr', $event)"
      :style="{ maxWidth: '300px' }"
    />
  </div>
</template>
<script setup>
defineOptions({ name: 'TariffContractListSettings' })

const settings = defineModel({ type: Object })

defineProps({
  agreementItems: Array,
})

function changeFieldHandler(field, value) {
  settings.value = { ...settings.value, [field]: value }
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
