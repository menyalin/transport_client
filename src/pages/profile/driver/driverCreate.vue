<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <DriverForm @submit="submit" @cancel="cancel" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'

import { DriverForm } from '@/entities/driver'

export default defineComponent({
  name: 'DriverCreate',
  components: { DriverForm },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    submit(driver) {
      this.loading = true
      this.$store
        .dispatch('driverCreate', driver)
        .then(() => {
          this.loading = false
          this.$router.push({ name: 'DriverList' })
        })
        .catch((e) => {
          this.loading = false
          this.$store.commit('setError', e)
        })
    },
    cancel() {
      this.$router.go(-1)
    },
  },
})
</script>
<style></style>
