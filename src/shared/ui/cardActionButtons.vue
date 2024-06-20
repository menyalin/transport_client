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
<script>
export default {
  name: 'CardActionButtons',
  props: {
    submitDisabled: { type: Boolean, default: false },
    submitBtnLabel: { type: String, default: 'Создать' },
  },
  methods: {
    cancelHandler() {
      this.$emit('cancel')
    },
    saveHandler() {
      this.$emit('submit')
    },
  },
}
</script>
