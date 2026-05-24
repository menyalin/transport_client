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
