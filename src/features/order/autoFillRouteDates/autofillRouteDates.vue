<template>
  <div>
    <TopButtonsPanel
      :disabled="disabledSubmit"
      @submit="autoFillDatesHandler"
    />

    <v-alert type="info" text dismissible>
      {{ infoText }}
    </v-alert>

    <DateRangeInput v-model="settings.period" />
    <v-text-field
      dense
      type="number"
      min="10"
      outlined
      label="Время в пути, в минутах"
      v-model.number="settings.tripDurationInMinutes"
      class="mt-3"
      :style="{ maxWidth: '300px' }"
    />
    <v-text-field
      dense
      min="10"
      outlined
      type="number"
      label="Время погрузки/разгрузки, в минутах"
      v-model.number="settings.unloadingDurationInMinutes"
      :style="{ maxWidth: '300px' }"
    />
    <v-autocomplete
      outlined
      multiple
      multi-line
      chips
      auto-select-first
      deletable-chips
      color="primary"
      clearable
      label="Грузовики"
      :items="truckItems"
      v-model="settings.truckIds"
      :style="{ maxWidth: '600px' }"
      hide-details
    />
    <v-btn small class="ma-2" color="primary" @click="selectAllTrucks">
      Выбрать все
    </v-btn>
    <v-alert
      v-for="(message, idx) in messages"
      :key="idx"
      :type="message.type"
      dismissible
      dense
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
