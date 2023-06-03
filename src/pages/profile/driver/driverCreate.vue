<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-driver-form @submit="submit" @cancel="cancel" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppDriverForm from '@/modules/profile/components/driverForm'

export default {
  name: 'DriverCreate',
  components: {
    AppDriverForm,
  },
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
}
</script>
<style></style>
