<template>
  <v-card :elevation="elevation" :class="{ invalid: !valid }" :loading="loading">
    <div v-if="title || $slots.header" class="card-section-title pa-4 pb-0">
      <BlockTitle v-if="title">{{ title }}</BlockTitle>
      <div v-if="$slots.header" class="header-slot">
        <slot name="header" />
      </div>
    </div>
    <v-card-text>
      <slot />
    </v-card-text>
    <v-card-actions v-if="$slots.actions">
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>
<script setup>
import BlockTitle from '@/shared/ui/BlockTitle.vue'

defineOptions({ name: 'CardSection' })

defineProps({
  title: String,
  valid: { type: Boolean, default: true },
  elevation: { type: Number, default: 1 },
  loading: { type: Boolean, default: false },
})
</script>
<style scoped>
.card-section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.invalid {
  border: tomato 1px solid;
  box-shadow: inset 0 2px 8px rgba(255, 99, 71, 0.7);
}
</style>
