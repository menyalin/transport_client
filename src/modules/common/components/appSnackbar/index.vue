<template>
  <div>
    <v-snackbar :value="localError" vertical :timeout="timeout">
      <div class="text-body-1">{{ error }}</div>
      <template v-slot:action="{ attrs }">
        <v-btn color="accent" text v-bind="attrs" @click="close">
          Закрыть
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AppSnackbar',
  data() {
    return {
      timeout: 3000,
      localError: null,
      timeoutInstance: null,
    }
  },
  computed: {
    ...mapGetters(['error']),
  },
  methods: {
    close() {
      this.timeoutInstance = null
      this.$store.commit('clearError')
    },
  },
  watch: {
    error: {
      immediate: true,
      handler: function (val) {
        if (val) {
          this.localError = val
          this.timeoutInstance = setTimeout(() => {
            this.$store.commit('clearError')
          }, this.timeout)
        } else {
          this.localError = null
          this.timeoutInstance = null
        }
      },
    },
  },
}
</script>
<style></style>
