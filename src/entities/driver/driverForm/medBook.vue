<template>
  <div>
    <div>
      <app-block-title>{{ title }}</app-block-title>
    </div>
    <div class="med-book-wrapper">
      <div class="first-column">
        <v-text-field
          label="Номер"
          :model-value="params.number"
          hide-details
          @update:model-value="change($event, 'number')"
        />
        <DateTimeInput
          label="Дата выдачи"
          :model-value="params.issueDate"
          hideDetails
          @update:model-value="change($event, 'issueDate')"
        />
        <div class="date-input-row">
          <DateTimeInput
            label="Аттестация до"
            :model-value="params.certifiedBeforeDate"
            hideDetails
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
        <div class="date-input-row">
          <DateTimeInput
            label="Ежегодная комиссия от"
            :model-value="params.annualCommisionDate"
            hideDetails
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
      </div>
      <v-textarea
        label="Примечание"
        :model-value="params.note"
        hide-details
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
.med-book-wrapper {
  display: grid;
  grid-template-columns: 300px auto;
  margin: 10px;
  grid-gap: 15px;
}
.first-column {
  display: grid;
  grid-gap: 10px;
}
.date-input-row {
  display: grid;
  grid-template-columns: 3fr auto;
  justify-content: space-between;
  align-items: center;
}
</style>
