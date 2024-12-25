<template>
  <div class="settings-wrapper">
    <v-text-field
      :value="settings.search"
      label="Поиск"
      dense
      hide-details
      clearable
      outlined
      :style="{ maxWidth: '500px' }"
      @change="updateSettings($event, 'search')"
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
    function updateSettings(val, field) {
      ctx.emit(
        'change',
        Object.assign({}, props.settings.value, { [field]: val })
      )
    }
    return {
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
