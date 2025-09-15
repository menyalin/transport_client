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
      density="compact"
      hide-details
      variant="outlined"
      :items="agreementItems"
      :style="{ maxWidth: '600px' }"
      @update:model-value="changeFieldHandler('agreements', $event)"
    />
    <v-text-field
      :model-value="settings.searchStr"
      label="Поиск"
      density="compact"
      hide-details
      clearable
      variant="outlined"
      :style="{ maxWidth: '300px' }"
      @update:model-value="changeFieldHandler('searchStr', $event)"
    />
  </div>
</template>
<script>
export default {
  name: 'TariffContractListSettings',
  model: {
    prop: 'settings',
    event: 'change',
  },
  props: {
    settings: Object,
    agreementItems: Array,
  },
  setup(props, ctx) {
    const changeFieldHandler = (field, value) => {
      ctx.emit('change', { ...props.settings, [field]: value })
    }

    return {
      changeFieldHandler,
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
