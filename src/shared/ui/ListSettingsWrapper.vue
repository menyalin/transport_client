<script setup>
defineOptions({ name: 'ListSettingsWrapper' })
</script>

<template>
  <div class="wrapper">
    <slot />
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: row;
  gap: 15px;
}
.wrapper > div {
  flex: 0 1;
}
</style>
