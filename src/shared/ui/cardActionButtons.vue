<template>
  <v-card-actions>
    <slot />
    <v-spacer />
    <v-btn @click="cancelHandler">Отмена</v-btn>
    <v-btn color="primary" :disabled="submitDisabled" @click="saveHandler">
      {{ submitBtnLabel }}
    </v-btn>
  </v-card-actions>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'CardActionButtons',
  props: {
    submitDisabled: { type: Boolean, default: false },
    submitBtnLabel: { type: String, default: 'Создать' },
  },
  emits: ['cancel', 'submit'],
  methods: {
    cancelHandler() {
      this.$emit('cancel')
    },
    saveHandler() {
      this.$emit('submit')
    },
  },
})
</script>
