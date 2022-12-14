<template>
    <div class="settings-wrapper">
    <app-table-column-setting
      :allHeaders="allHeaders"
      :listSettingsName="listSettingsName"
      @change="updateActiveHeaders"
    />
    
    <v-autocomplete
      :value="settings.clients"
      item-text="name"
      item-value="_id"
      label="Клиенты"
      dense
      clearable
      multiple
      outlined
      :items="clientItems"
      hide-details
      :style="{ maxWidth: '280px' }"
      @change="updateSettings($event, 'clients')"
    />

    
  </div>
</template>
<script>
export default {
  name: 'ListSettingsWidget',
}
</script>
<style></style>
