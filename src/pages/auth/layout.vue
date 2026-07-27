<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
<script setup lang="ts">
defineOptions({ name: 'AuthLayout' })
</script>
