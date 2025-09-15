<template lang="">
  <div class="signatory-form-wrapper">
    <div class="text-subtitle-2 pb-3">Подписант:</div>
    <v-text-field
      label="Должность"
      :model-value="value.position"
      density="compact"
      @update:model-value="changeHandler('position', $event)"
    />
    <v-text-field
      :model-value="value.fullName"
      label="ФИО"
      density="compact"
      @update:model-value="changeHandler('fullName', $event)"
    />
    <v-text-field
      :model-value="value.number"
      label="Номер доверенности"
      density="compact"
      @update:model-value="changeHandler('number', $event)"
    />
    <DateTimeInput
      :value="value.date"
      type="date"
      label="Дата доверенности"
      density="compact"
      @update:model-value="changeHandler('date', $event)"
    />
  </div>
</template>
<script>
import { DateTimeInput } from '@/shared/ui'
export default {
  name: 'SignatoryForm',
  components: { DateTimeInput },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: Object,
  },
  setup(props, ctx) {
    const changeHandler = (field, value) => {
      ctx.emit('change', { ...props.value, [field]: value })
    }
    return { changeHandler }
  },
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
