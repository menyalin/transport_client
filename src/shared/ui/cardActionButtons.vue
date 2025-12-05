<template>
  <v-card-actions>
    <slot></slot>
    <v-spacer />
    <v-btn @click="cancelHandler">Отмена</v-btn>
    <v-btn color="primary" :disabled="submitDisabled" @click="saveHandler">
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
