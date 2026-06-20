<template>
  <v-card-actions>
    <slot />
    <v-spacer />
    <v-btn @click="cancelHandler">Отмена</v-btn>
    <v-btn @click="saveHandler" color="primary" :disabled="submitDisabled">
      {{ submitBtnLabel }}
    </v-btn>
  </v-card-actions>
</template>
<script setup>
defineOptions({ name: 'CardActionButtons' })

defineProps({
  submitDisabled: { type: Boolean, default: false },
  submitBtnLabel: { type: String, default: 'Создать' },
})

const emit = defineEmits(['cancel', 'submit'])

function cancelHandler() {
  emit('cancel')
}

function saveHandler() {
  emit('submit')
}
</script>
