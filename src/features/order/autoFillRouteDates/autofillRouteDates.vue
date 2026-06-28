<template>
  <div>
    <TopButtonsPanel :disabled="disabledSubmit" @submit="autoFillDatesHandler" />

    <v-alert type="info" variant="text" closable>
      {{ infoText }}
    </v-alert>

    <DateRangeInput v-model="settings.period" />

    <v-text-field
      type="number"
      min="10"
      label="Время в пути, в минутах"
      v-model.number="settings.tripDurationInMinutes"
      class="mt-3"
      :style="{ maxWidth: '300px' }"
    />
    <v-text-field
      min="10"
      type="number"
      label="Время погрузки/разгрузки, в минутах"
      v-model.number="settings.unloadingDurationInMinutes"
      :style="{ maxWidth: '300px' }"
    />
    <v-autocomplete
      multiple
      chips
      auto-select-first
      closable-chips
      color="primary"
      clearable
      label="Грузовики"
      :items="truckItems"
      v-model="settings.truckIds"
      :style="{ maxWidth: '600px' }"
      hide-details
    />
    <v-btn size="small" class="ma-2" color="primary" @click="selectAllTrucks"> Выбрать все </v-btn>
    <v-alert v-for="(message, idx) in messages" :key="idx" :type="message.type" closable>
      {{ message.content }}
    </v-alert>
  </div>
</template>
<script setup>
import { DateRangeInput } from '@/shared/ui'
import { useFeatureModel } from './model/model.js'
import TopButtonsPanel from './topButtonsPanel.vue'

defineOptions({ name: 'AutofillRouteDatesFeature' })

const {
  infoText,
  settings,
  truckItems,
  disabledSubmit,
  autoFillDatesHandler,
  messages,
  selectAllTrucks,
} = useFeatureModel()
</script>
