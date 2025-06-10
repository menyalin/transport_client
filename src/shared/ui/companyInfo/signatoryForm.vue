<template lang="">
  <div class="signatory-form-wrapper">
    <div class="text-subtitle-2 pb-3">Подписант:</div>
    <v-text-field
      label="Должность"
      :value="value.position"
      dense
      @change="changeHandler('position', $event)"
    />
    <v-text-field
      label="ФИО"
      v-model="value.fullName"
      dense
      @change="changeHandler('fullName', $event)"
    />
    <v-text-field
      label="Номер доверенности"
      v-model="value.number"
      dense
      @change="changeHandler('number', $event)"
    />
    <DateTimeInput
      type="date"
      label="Дата доверенности"
      v-model="value.date"
      dense
      @change="changeHandler('date', $event)"
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
