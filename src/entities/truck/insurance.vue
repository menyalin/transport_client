<template>
  <div>
    <BlockTitle>
      {{ title }}
    </BlockTitle>
    <div v-if="truckType === 'truck'" class="fields-row">
      <v-text-field v-model="item.osagoNum" label="Осаго №" class="field-md" />
      <v-text-field v-model="item.osagoCompany" label="Страховая компания" class="field-lg" />
      <DateTimeInput v-model="item.osagoExpDate" label="Дата окончания" class="field-date" />
    </div>
    <div class="fields-row">
      <v-text-field v-model="item.kaskoNum" label="Каско №" class="field-md" />
      <v-text-field v-model="item.kaskoCompany" label="Страховая компания" class="field-lg" />
      <DateTimeInput v-model="item.kaskoExpDate" label="Дата окончания" class="field-date" />
    </div>
    <v-text-field
      v-model="item.leasingСompany"
      label="Лизинговая компания"
      class="field-lg"
      single-line
    />
  </div>
</template>
<script setup>
import { BlockTitle, DateTimeInput } from '@/shared/ui'

defineOptions({ name: 'TruckInsurance' })

const item = defineModel({ type: Object, default: () => ({}) })

defineProps({
  title: String,
  truckType: String,
})
</script>
<style scoped>
.fields-row {
  display: flex;
  gap: 10px;
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
