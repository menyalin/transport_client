<template>
  <div>
    <AppBlockTitle>{{ title }}</AppBlockTitle>
    <div class="fields-row">
      <template v-if="truckType === 'truck'">
        <v-text-field v-model="item.osagoNum" label="Осаго №" class="field-md" />
        <DateTimeInput v-model="item.osagoExpDate" label="Дата окончания" class="field-date" />
        <v-text-field v-model="item.osagoCompany" label="Страховая компания" class="field-lg" />
      </template>
      <v-text-field v-model="item.kaskoNum" label="Каско №" class="field-md" />
      <DateTimeInput v-model="item.kaskoExpDate" label="Дата окончания" class="field-date" />
      <v-text-field v-model="item.kaskoCompany" label="Страховая компания" class="field-lg" />
      <v-text-field v-model="item.leasingСompany" label="Лизинговая компания" class="field-lg" />
    </div>
  </div>
</template>
<script setup>
// import { watch } from 'vue'
import { BlockTitle as AppBlockTitle } from '@/shared/ui'
import { DateTimeInput } from '@/shared/ui'

defineOptions({ name: 'TruckInsurance' })

const item = defineModel({ type: Object, default: () => ({}) })

defineProps({
  title: String,
  truckType: String,
})

// const defaults = {
//   osagoNum: null,
//   osagoExpDate: null,
//   osagoCompany: null,
//   kaskoNum: null,
//   kaskoExpDate: null,
//   kaskoCompany: null,
//   leasingСompany: null,
// }

// watch(
//   item,
//   (val) => {
//     if (!val) item.value = {}
//     Object.keys(defaults).forEach((key) => {
//       if (!(key in item.value)) item.value[key] = defaults[key]
//     })
//   },
//   { immediate: true }
// )
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
  flex: 0 0 220px;
  min-width: 220px;
  max-width: 220px;
}
</style>
