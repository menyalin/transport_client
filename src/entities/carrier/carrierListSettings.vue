<template>
  <div class="settings-wrapper">
    <v-select
      :model-value="settings.type"
      label="Тип перевозчика"
      :items="carrierTypes"
      density="compact"
      hide-details
      clearable
      variant="outlined"
      :style="{ maxWidth: '300px' }"
      @update:model-value="updateSettings($event, 'type')"
    />
    <v-text-field
      :model-value="settings.search"
      label="Поиск"
      density="compact"
      hide-details
      clearable
      variant="outlined"
      :style="{ maxWidth: '500px' }"
      @update:model-value="updateSettings($event, 'search')"
    />
  </div>
</template>
<script>
export default {
  name: 'CarrierListSettings',
  model: {
    prop: 'settings',
    event: 'change',
  },
  props: {
    settings: Object,
  },

  setup(props, ctx) {
    const carrierTypes = [
      { text: 'Все', value: 'all' },
      { text: 'Свой', value: 'own' },
      { text: 'Привлеченный', value: 'outsource' },
    ]
    function updateSettings(val, field) {
      ctx.emit(
        'change',
        Object.assign({}, props.settings.value, { [field]: val })
      )
    }
    return {
      carrierTypes,
      updateSettings,
    }
  },
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
