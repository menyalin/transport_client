<template>
  <v-container>
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
  name: 'driverCreate',
  data() {
    return {
      loading: false,
    }
  },
  components: {
    AppDriverForm,
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
