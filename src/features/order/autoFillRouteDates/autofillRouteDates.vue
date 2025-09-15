<template>
  <div>
    <TopButtonsPanel
      :disabled="disabledSubmit"
      @submit="autoFillDatesHandler"
    />

    <v-alert type="info" text closable>
      {{ infoText }}
    </v-alert>

    <DateRangeInput v-model="settings.period" />
    <v-text-field
      v-model.number="settings.tripDurationInMinutes"
      density="compact"
      type="number"
      min="10"
      variant="outlined"
      label="Время в пути, в минутах"
      class="mt-3"
      :style="{ maxWidth: '300px' }"
    />
    <v-text-field
      v-model.number="settings.unloadingDurationInMinutes"
      density="compact"
      min="10"
      variant="outlined"
      type="number"
      label="Время погрузки/разгрузки, в минутах"
      :style="{ maxWidth: '300px' }"
    />
    <v-autocomplete
      v-model="settings.truckIds"
      variant="outlined"
      multiple
      multi-line
      chips
      auto-select-first
      closable-chips
      color="primary"
      clearable
      label="Грузовики"
      :items="truckItems"
      :style="{ maxWidth: '600px' }"
      hide-details
    />
    <v-btn size="small" class="ma-2" color="primary" @click="selectAllTrucks">
      Выбрать все
    </v-btn>
    <v-alert
      v-for="(message, idx) in messages"
      :key="idx"
      :type="message.type"
      closable
      density="compact"
    >
      {{ message.content }}
    </v-alert>
  </div>
</template>
<script>
import { DateRangeInput } from '@/shared/ui'
import { useFeatureModel } from './model/model.js'
import TopButtonsPanel from './topButtonsPanel.vue'

export default {
  name: 'AutofillRouteDatesFeature',
  components: {
    DateRangeInput,
    TopButtonsPanel,
  },
  setup() {
    const {
      infoText,
      settings,
      operationToken,
      truckItems,
      disabledSubmit,
      autoFillDatesHandler,
      messages,
      selectAllTrucks,
    } = useFeatureModel()

    return {
      settings,
      infoText,
      operationToken,
      truckItems,
      disabledSubmit,
      autoFillDatesHandler,
      messages,
      selectAllTrucks,
    }
  },
}
</script>
<style scoped>
#settings {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
