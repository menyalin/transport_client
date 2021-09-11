<template>
  <div>
    {{ title }}
  </div>
</template>
<script>
export default {
  name: 'TruckTitleCell',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
}
</script>
<style></style>
