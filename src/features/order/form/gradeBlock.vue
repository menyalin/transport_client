<template>
  <div>
    <div>
      <BlockTitle>{{ title }}</BlockTitle>
    </div>
    <div class="grade-block">
      <v-rating v-model="model.grade" :disabled :length="3" size="small" color="red" />
      <v-textarea
        hide-details
        rows="4"
        v-model="model.note"
        :readonly="disabled"
        class="pt-3"
        label="Примечание"
        :style="{ width: '100%' }"
      />
    </div>
  </div>
</template>
<script setup>
import { BlockTitle } from '@/shared/ui'

defineOptions({ name: 'GradeBlock' })
const model = defineModel({ type: Object })
defineProps({
  title: String,
  disabled: {
    type: Boolean,
    default: true,
  },
})
</script>
<style scoped>
.grade-block {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
</style>
