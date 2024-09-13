<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="auto">
        <v-subheader>Загрузка... </v-subheader>
        <v-progress-circular
          :size="90"
          :width="5"
          color="primary"
          indeterminate
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'
export default defineComponent({})
</script>
<style></style>
