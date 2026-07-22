<template>
  <div>
    <app-block-title>{{ title }}</app-block-title>
    <div class="fields-row">
      <v-text-field
        label="Номер"
        :model-value="params.number"
        hide-details
        class="field-md"
        @update:model-value="change($event, 'number')"
      />
      <DateTimeInput
        label="Дата выдачи"
        :model-value="params.issueDate"
        hideDetails
        class="field-date"
        @update:model-value="change($event, 'issueDate')"
      />
    </div>
    <div class="fields-row">
      <DateTimeInput
        label="Аттестация до"
        :model-value="params.certifiedBeforeDate"
        hideDetails
        class="field-date"
        @update:model-value="change($event, 'certifiedBeforeDate')"
      />
      <v-chip
        v-if="certificateValidityPeriod !== null"
        class="my-1 mx-4"
        :color="chipColor(certificateValidityPeriod)"
      >
        {{ certificateValidityPeriod }}
      </v-chip>
    </div>
    <div class="fields-row">
      <DateTimeInput
        label="Ежегодная комиссия от"
        :model-value="params.annualCommisionDate"
        hideDetails
        class="field-date"
        @update:model-value="change($event, 'annualCommisionDate')"
      />
      <v-chip
        v-if="daysBeforeMedExamination !== null"
        class="my-1 mx-4"
        :color="chipColor(daysBeforeMedExamination)"
      >
        {{ daysBeforeMedExamination }}
      </v-chip>
    </div>
    <div class="fields-row">
      <v-textarea
        label="Примечание"
        :model-value="params.note"
        hide-details
        class="field-fluid"
        @update:model-value="change($event, 'note')"
      />
    </div>
  </div>
</template>
<script setup>
import { reactive, watch, computed } from 'vue'
import dayjs from 'dayjs'
import { BlockTitle as AppBlockTitle } from '@/shared/ui'
import { DateTimeInput } from '@/shared/ui'

defineOptions({ name: 'MedBook' })

const modelValue = defineModel({ type: Object })
defineProps({ title: String })

const fields = ['number', 'issueDate', 'certifiedBeforeDate', 'annualCommisionDate', 'note']
const params = reactive({
  number: null,
  issueDate: null,
  certifiedBeforeDate: null,
  annualCommisionDate: null,
  note: null,
})

const certificateValidityPeriod = computed(() => {
  if (!params.certifiedBeforeDate) return null
  const todaySec = dayjs().unix()
  const certDateSec = dayjs(params.certifiedBeforeDate).unix()
  return Math.floor((certDateSec - todaySec) / (60 * 60 * 24))
})

const daysBeforeMedExamination = computed(() => {
  if (!params.annualCommisionDate) return null
  const lastDate = dayjs(params.annualCommisionDate).add(1, 'year').unix()
  const todaySec = dayjs().unix()
  return Math.floor((lastDate - todaySec) / (60 * 60 * 24))
})

watch(
  () => modelValue.value,
  (val) => {
    if (val) {
      fields.forEach((f) => {
        params[f] = val[f]
      })
    }
  },
  { immediate: true }
)

function change(val, field) {
  params[field] = val
  modelValue.value = { ...params }
}

function chipColor(days) {
  if (days < 14) return 'error'
  if (days < 30) return 'warning'
  return 'light-green'
}
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

.field-date {
  flex: 0 0 220px;
  min-width: 220px;
  max-width: 220px;
}

.field-fluid {
  flex: 1 1 100%;
  min-width: 100%;
  max-width: none;
}
</style>
