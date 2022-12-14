<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-alert
          type="error"
          dismissible
          v-model="showError"
          transition="scale-transition"
        >
          {{ errorMessage }}
        </v-alert>
        <app-load-spinner v-if="loading" />
        <slot v-else />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { AppLoadSpinner } from '@/shared/ui'
export default {
  components: {
    AppLoadSpinner,
  },
  props: {
    showError: Boolean,
    errorMessage: Boolean,
  },
}
</script>

<style></style>
