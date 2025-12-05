<template>
  <div class="settings-wrapper">
    <AppTableColumnSetting
      :allHeaders="allHeaders"
      :listSettingsName="listSettingsName"
      @change="updateActiveHeaders"
    />
    <RefreshBtn @click="$emit('refresh')" />
    <DateRangeInput :period="settings.period" @change="updateSettings($event, 'period')" />

    <v-select
      :modelValue="settings.tks"
      itemTitle="name"
      itemValue="_id"
      label="ТК"
      clearable
      chips
      closableChips
      multiple
      variant="outlined"
      density="compact"
      :items="tkNameItems"
      hideDetails
      :style="{ maxWidth: '300px' }"
      @update:model-value="updateSettings($event, 'tks')"
    />

    <v-autocomplete
      :modelValue="settings.agreements"
      itemTitle="name"
      itemValue="_id"
      label="Соглашения"
      clearable
      autoSelectFirst
      multiple
      variant="outlined"
      density="compact"
      chips
      closableChips
      :items="agreementItems"
      hideDetails
      :style="{ maxWidth: '500px' }"
      @update:model-value="updateSettings($event, 'agreements')"
    />
  </div>
</template>

<script>
  import store from '@/store'
  import { watch, ref, computed } from 'vue'
  import { AppTableColumnSetting, DateRangeInput, RefreshBtn } from '@/shared/ui'

  export default {
    name: 'ReportSettings',
    components: {
      RefreshBtn,
      AppTableColumnSetting,
      DateRangeInput,
    },
    model: {
      prop: 'settings',
      event: 'change',
    },
    props: {
      agreementItems: Array,
      settings: Object,
      allHeaders: {
        type: Array,
        required: true,
      },
    },
    setup(props, ctx) {
      const listSettingsName = 'orderDocsReportPage'
      const activeHeaders = ref([])

      function updateSettings(value, field) {
        ctx.emit('change', Object.assign({}, props.settings, { [field]: value }))
      }

      function updateActiveHeaders(value) {
        ctx.emit('changeHeaders', value)
      }

      const tkNameItems = computed(() => {
        return store.getters.tkNames
      })

      watch([activeHeaders], () => {
        ctx.emit('changeHeaders', activeHeaders.value)
      })
      return {
        updateActiveHeaders,
        updateSettings,
        listSettingsName,
        activeHeaders,
        tkNameItems,
      }
    },
  }
</script>

<style scoped>
  .settings-wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 20px;
  }
</style>
