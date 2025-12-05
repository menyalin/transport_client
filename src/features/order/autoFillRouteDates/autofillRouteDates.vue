<template>
  <div>
    <TopButtonsPanel :disabled="disabledSubmit" @submit="autoFillDatesHandler" />

    <v-alert type="info" text closable>
      {{ infoText }}
    </v-alert>

    <DateRangeInput :modelValue="settings.period" />
    <v-text-field
      v-model.number="settings.tripDurationInMinutes"
     
      type="number"
      min="10"
      variant="outlined"
       density="compact"
      label="Время в пути, в минутах"
      class="mt-3"
      :style="{ maxWidth: '300px' }"
    />
    <v-text-field
      v-model.number="settings.unloadingDurationInMinutes"
     
      min="10"
      variant="outlined"
       density="compact"
      type="number"
      label="Время погрузки/разгрузки, в минутах"
      :style="{ maxWidth: '300px' }"
    />
    <v-autocomplete
      :modelValue="settings.truckIds"
      variant="outlined"
       density="compact"
      multiple
      multiLine
      chips
      autoSelectFirst
      closableChips
      color="primary"
      clearable
      label="Грузовики"
      :items="truckItems"
      :style="{ maxWidth: '600px' }"
      hideDetails
    />
    <v-btn
size="small"
class="ma-2" color="primary" @click="selectAllTrucks"
>Выбрать все</v-btn>
    <v-alert v-for="(message, idx) in messages" :key="idx" :type="message.type"
closable>
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
