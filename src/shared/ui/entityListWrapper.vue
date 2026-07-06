<template>
  <div class="list-wrapper">
    <slot />
  </div>
</template>
<script setup>
defineOptions({ name: 'EntityListWrapper' })
</script>
<style scoped>
.list-wrapper {
  margin: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 15px;
}
</style>
