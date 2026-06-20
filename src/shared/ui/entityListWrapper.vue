<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <slot />
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
defineOptions({ name: 'EntityListWrapper' })
</script>
<style></style>
