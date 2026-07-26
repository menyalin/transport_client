<template>
  <v-container class="fill-height" fluid>
    <v-row class="align-center justify-center">
      <v-col cols="auto">
        <v-progress-circular :size="90" :width="5" color="primary" indeterminate />
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
defineOptions({ name: 'LoadSpinner' })
</script>
<style></style>
