<template>
  <div class="text-title-medium mb-4">{{ title }}</div>
</template>

<script setup>
defineOptions({ name: 'ReportTitle' })

defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<style></style>
