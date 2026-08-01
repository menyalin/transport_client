<template>
  <div>
    <AppBlockTitle>
      {{ title }}
    </AppBlockTitle>
    <div class="fields-row">
      <v-text-field v-model="item.dayPermitNumber" label="Пропуск ДЕНЬ, №" class="field-md" />
      <v-text-field v-model="item.dayPermitZone" label="Зона действия" class="field-lg" />
      <DateTimeInput v-model="item.dayPermitExpDate" label="Действует до" class="field-date" />
    </div>
    <div class="fields-row">
      <v-text-field v-model="item.nightPermitNumber" label="Пропуск НОЧЬ, №" class="field-md" />
      <v-text-field v-model="item.nightPermitZone" label="Зона действия" class="field-lg" />
      <DateTimeInput v-model="item.nightPermitExpDate" label="Действует до" class="_field-date" />
    </div>
  </div>
</template>
<script setup>
import { watch } from 'vue'
import { BlockTitle as AppBlockTitle } from '@/shared/ui'
import { DateTimeInput } from '@/shared/ui'

defineOptions({ name: 'TruckPermits' })

const item = defineModel({ type: Object, default: () => ({}) })

defineProps({
  title: String,
  truckType: String,
})

const defaults = {
  dayPermitNumber: null,
  dayPermitExpDate: null,
  dayPermitZone: null,
  nightPermitNumber: null,
  nightPermitExpDate: null,
  nightPermitZone: null,
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
  flex: 0 0 250px;
  min-width: 250px;
  max-width: 250px;
}
</style>
