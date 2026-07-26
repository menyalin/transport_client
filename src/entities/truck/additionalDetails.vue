<template>
  <div>
    <AppBlockTitle>{{ title }}</AppBlockTitle>
    <div class="fields-row">
      <v-text-field v-model="item.platonNumber" label="Платон №" class="field-md" />
      <DateTimeInput v-model="item.platonDate" label="Дата замены" class="field-date" />
    </div>
    <div class="fields-row">
      <v-text-field v-model="item.tachographNumber" label="Тахограф №" class="field-md" />
      <DateTimeInput
        v-model="item.tachographExpDate"
        label="Дата сделующей калибровки"
        hide-details
        class="field-date"
      />
      <v-text-field v-model="item.tachographNote" label="Примечание (тахограф)" class="field-lg" />
    </div>

    <div class="fields-row">
      <v-text-field v-model="item.transponderNumber" label="Транспондер, №" class="field-md" />
      <DateTimeInput v-model="item.transponderDate" label="Дата выдачи" class="field-date" />
    </div>
    <div class="fields-row">
      <v-text-field v-model="item.fuelCardNumber" label="Топливная карта" class="field-md" />
      <DateTimeInput v-model="item.fuelCardDate" label="Дата выдачи карты" class="field-date" />
      <v-text-field
        v-model="item.fuelCardNote"
        label="Примечание (Топливная карта)"
        class="field-lg"
      />
    </div>
  </div>
</template>
<script setup>
import { watch } from 'vue'
import { BlockTitle as AppBlockTitle } from '@/shared/ui'
import { DateTimeInput } from '@/shared/ui'

defineOptions({ name: 'AdditionalDetails' })

const item = defineModel({ type: Object, default: () => ({}) })

defineProps({
  title: String,
  truckType: String,
})

const defaults = {
  diagnosticCardExpDate: null,
  diagnosticCardNote: null,
  platonNumber: null,
  platonDate: null,
  tachographNumber: null,
  tachographExpDate: null,
  tachographNote: null,
  transponderNumber: null,
  transponderDate: null,
  fuelCardNumber: null,
  fuelCardDate: null,
  fuelCardNote: null,
}

watch(
  item,
  (val) => {
    if (!val) item.value = {}
    Object.keys(defaults).forEach((key) => {
      if (!(key in item.value)) item.value[key] = defaults[key]
    })
  },
  { immediate: true }
)
</script>
<style scoped>
.fields-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 15px;
}

.fields-row + .fields-row {
  margin-top: 15px;
}

.field-md {
  flex: 1 1 220px;
  min-width: 220px;
  max-width: 320px;
}

.field-lg {
  flex: 1 1 320px;
  min-width: 320px;
  max-width: 450px;
}

.field-date {
  flex: 0 0 220px;
  min-width: 220px;
  max-width: 220px;
}
</style>
