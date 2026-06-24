<template>
  <div>
    <app-block-title>
      {{ title }}
    </app-block-title>
    <div class="fields-wrapper">
      <v-text-field
        label="Пропуск ДЕНЬ, №"
        :model-value="params.dayPermitNumber"
        hide-details
        @change="change($event, 'dayPermitNumber')"
      />
      <DateTimeInput
        label="Действует до"
        :model-value="params.dayPermitExpDate"
        @update:model-value="change($event, 'dayPermitExpDate')"
        hide-details
      />
      <v-text-field
        label="Зона действия"
        :model-value="params.dayPermitZone"
        hide-details
        @change="change($event, 'dayPermitZone')"
      />

      <v-text-field
        label="Пропуск НОЧЬ, №"
        :model-value="params.nightPermitNumber"
        hide-details
        @change="change($event, 'nightPermitNumber')"
      />
      <DateTimeInput
        label="Действует до"
        :model-value="params.nightPermitExpDate"
        @update:model-value="change($event, 'nightPermitExpDate')"
        hide-details
      />
      <v-text-field
        label="Зона действия"
        :model-value="params.nightPermitZone"
        hide-details
        @change="change($event, 'nightPermitZone')"
      />
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { BlockTitle as AppBlockTitle } from '@/shared/ui'
import { DateTimeInput } from '@/shared/ui'

defineOptions({ name: 'Permits' })

const item = defineModel({ type: Object })

defineProps({
  title: String,
  truckType: String,
})

const initialParams = {
  dayPermitNumber: null,
  dayPermitExpDate: null,
  dayPermitZone: null,
  nightPermitNumber: null,
  nightPermitExpDate: null,
  nightPermitZone: null,
  diagnosticCardExpDate: null,
}

const params = ref({ ...initialParams })

watch(
  item,
  (val) => {
    if (val) {
      const fields = Object.keys(initialParams)
      fields.forEach((f) => {
        params.value[f] = val[f]
      })
    }
  },
  { immediate: true }
)

function change(val, field) {
  params.value[field] = val
  item.value = { ...params.value }
}
</script>
<style scoped>
.fields-wrapper {
  display: grid;
  gap: 10px;
  grid-template-columns: 220px 200px 220px 220px 200px 220px;
  margin-bottom: 20px;
}
</style>
