<template>
  <h3>{{ title }}</h3>
</template>

<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ReportTitle',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
})
</script>

<style></style>
