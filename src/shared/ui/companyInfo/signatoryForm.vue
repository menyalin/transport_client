<template lang="">
  <div class="signatory-form-wrapper">
    <div class="text-label-large pb-3">Подписант:</div>
    <v-text-field
      label="Должность"
      :model-value="modelValue.position"
      @update:model-value="changeHandler('position', $event)"
    />
    <v-text-field
      label="ФИО"
      :model-value="modelValue.fullName"
      @update:model-value="changeHandler('fullName', $event)"
    />
    <v-text-field
      label="Номер доверенности"
      :model-value="modelValue.number"
      @update:model-value="changeHandler('number', $event)"
    />
    <DateTimeInput
      type="date"
      label="Дата доверенности"
      :model-value="modelValue.date"
      @update:model-value="changeHandler('date', $event)"
    />
  </div>
</template>
<script setup>
import { DateTimeInput } from '@/shared/ui'

defineOptions({ name: 'SignatoryForm' })

const modelValue = defineModel({ type: Object })

const changeHandler = (field, value) => {
  modelValue.value = { ...modelValue.value, [field]: value }
}
</script>
<style scoped>
.signatory-form-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 30px;
  max-width: 700px;
}
</style>
