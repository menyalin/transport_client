<template>
  <div>
    <v-snackbar v-model="error" multi-line color="warning">
      {{ error }}
      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs"> Close </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
export default {
  name: 'AppSnackbar',
  data() {
    return {
      timeout: 3000,
    }
  },
  computed: {
    error: {
      get() {
        return this.$store.getters.error
      },
      set() {
        this.$store.commit('clearError')
      },
    },
  },
}
</script>
<style></style>
