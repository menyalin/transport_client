<template>
  <h5 class="mb-2">
    <slot />
  </h5>
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'DriverFormBlockTitle',
})
</script>
