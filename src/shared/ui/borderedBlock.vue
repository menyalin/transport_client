<template>
  <div class="block">
    <div class="text-title-small mb-2">{{ title }}</div>
    <slot />
  </div>
</template>
<script setup>
defineOptions({ name: 'BorderedBlock' })

defineProps({
  title: String,
})
</script>
<style scoped>
.block {
  border: 1px solid gray;
  padding: 5px;
  position: relative;
  border-radius: 5px;
}
.title {
  position: absolute;
  font-size: small;
  color: #666666;
  line-height: 14px;
  padding: 0 8px;
  top: -8px;
  left: 25px;
  background-color: white;
  z-index: 1;
}
</style>
