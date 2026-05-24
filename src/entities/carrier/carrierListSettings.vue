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
<script>
export default {
  name: 'CarrierListSettings',
  model: {
    prop: 'settings',
    event: 'change',
  },
  props: {
    settings: {
      type: Object,
      default: () => ({
        type: 'all',
        search: '',
      }),
    },
  },

  setup(props, ctx) {
    const carrierTypes = [
      { title: 'Все', value: 'all' },
      { title: 'Свой', value: 'own' },
      { title: 'Привлеченный', value: 'outsource' },
    ]
    function updateSettings(val, field) {
      console.log('props.settings: ', props.settings)
      ctx.emit('update:model-value', { ...props.settings, [field]: val })
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
