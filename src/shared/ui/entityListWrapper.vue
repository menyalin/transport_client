<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <slot />
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'EntityListWrapper',
})
</script>
<style></style>
