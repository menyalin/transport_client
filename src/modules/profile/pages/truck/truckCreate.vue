<template>
  <v-container>
    <v-row>
      <v-col>
        <app-truck-form @submit="submit" @cancel="cancel" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppTruckForm from '@/modules/profile/components/truckForm'

export default {
  name: 'truckCreate',
  data() {
    return {
      loading: false,
    }
  },
  components: {
    AppTruckForm,
  },
  methods: {
    submit(truck) {
      this.loading = true
      this.$store
        .dispatch('truckCreate', truck)
        .then(() => {
          this.loading = false
          this.$router.push({ name: 'TruckList' })
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
