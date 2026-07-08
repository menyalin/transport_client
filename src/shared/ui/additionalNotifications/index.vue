<template>
  <AdditionalNotificationsContainer :items="items" :loading="loading" @change="handleChange" />
</template>

<script setup>
import AdditionalNotificationsContainer from './AdditionalNotificationsContainer.vue'

const items = defineModel({ type: Array, default: () => [] })

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
})

function handleChange(newItems) {
  items.value = newItems
}
</script>
