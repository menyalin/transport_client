<template>
  <div>
    <app-block-title>{{ title }}</app-block-title>
    <div class="fields-wrapper">
      <template v-if="truckType === 'truck'">
        <v-text-field
          label="Осаго №"
          :model-value="params.osagoNum"
          hide-details
          @change="change($event, 'osagoNum')"
        />
        <DateTimeInput
          label="Дата окончания"
          :model-value="params.osagoExpDate"
          @update:model-value="change($event, 'osagoExpDate')"
          hide-details
        />
        <v-text-field
          label="Страховая компания"
          :model-value="params.osagoCompany"
          hide-details
          @update:model-value="change($event, 'osagoCompany')"
        />
      </template>
      <v-text-field
        label="Каско №"
        :model-value="params.kaskoNum"
        hide-details
        @update:model-value="change($event, 'kaskoNum')"
      />
      <DateTimeInput
        label="Дата окончания"
        :model-value="params.kaskoExpDate"
        @update:model-value="change($event, 'kaskoExpDate')"
        hide-details
      />
      <v-text-field
        label="Страховая компания"
        :model-value="params.kaskoCompany"
        hide-details
        @update:model-value="change($event, 'kaskoCompany')"
      />
      <v-text-field
        label="Лизинговая компания"
        :model-value="params.leasingСompany"
        hide-details
        @update:model-value="change($event, 'leasingСompany')"
      />
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { BlockTitle as AppBlockTitle } from '@/shared/ui'
import { DateTimeInput } from '@/shared/ui'

defineOptions({ name: 'Insurance' })

const item = defineModel({ type: Object })

defineProps({
  title: String,
  truckType: String,
})

const initialParams = {
  osagoNum: null,
  osagoExpDate: null,
  osagoCompany: null,
  kaskoNum: null,
  kaskoExpDate: null,
  kaskoCompany: null,
  leasingСompany: null,
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
  grid-template-columns: 220px 200px 220px 220px 200px 220px 220px;
  margin-bottom: 20px;
}
</style>
