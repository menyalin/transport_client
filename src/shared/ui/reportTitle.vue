<template>
  <h3>{{ title }}</h3>
</template>

<script>
export default {
  name: 'ReportTitle',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
}
</script>

<style></style>
