<template>
  <h3>{{ title }}</h3>
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
