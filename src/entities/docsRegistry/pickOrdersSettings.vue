<template>
  <div class="settings-wrapper">
    <v-btn @click="refreshHandler"> Обновить</v-btn>
    <app-table-column-setting
      :allHeaders="allHeaders"
      listSettingsName="pickOrdersTable"
      @change="updateHeadersHandler"
    />
    <v-select
      v-model="settings.docStatus"
      label="Документы"
      :items="docStatuses"
      dense
      hide-details
      outlined
      clearable
      :style="{ 'max-width': '220px' }"
      @change="settings.listOptions.page = 1"
    />
    <v-autocomplete
      v-model="settings.truck"
      dense
      clearable
      auto-select-first
      :items="trucks"
      outlined
      hide-details
      label="Грузовик"
      :style="{ 'max-width': '200px' }"
      @change="settings.listOptions.page = 1"
    />
    <v-autocomplete
      v-model="settings.driver"
      dense
      auto-select-first
      item-value="_id"
      item-text="fullName"
      clearable
      :items="drivers"
      outlined
      hide-details
      label="Водитель"
      :style="{ 'max-width': '300px' }"
      @change="settings.listOptions.page = 1"
    />
    <v-checkbox
      v-model="settings.onlySelectable"
      label="Только доступные рейсы"
      hide-details
      class="ml-2"
      dense
    />
  </div>
</template>
<script>
import { AppTableColumnSetting } from '@/shared/ui'
import { useOrderListSettingsData } from '@/shared/hooks'
export default {
  name: 'PickOrdersSettings',
  model: {
    prop: 'settings',
    event: 'change',
  },
  components: { AppTableColumnSetting },
  props: {
    settings: Object,
    allHeaders: Array,
  },
  setup(props, { emit }) {
    const { orderStatuses, docStatuses, trailers, trucks, drivers } =
      useOrderListSettingsData()
    const refreshHandler = () => {
      emit('refresh')
    }

    function updateHeadersHandler(val) {
      emit('updateHeaders', val)
    }

    function updateSettings(value, field) {
      emit('change', Object.assign({}, props.settings, { [field]: value }))
    }

    return {
      refreshHandler,
      updateHeadersHandler,
      updateSettings,
      orderStatuses,
      docStatuses,
      trailers,
      trucks,
      drivers,
    }
  },
}
</script>
<style scoped>
.settings-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
