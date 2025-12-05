<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <TruckForm @submit="submit" @cancel="cancel" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { TruckForm } from '@/entities/truck'
export default {
  name: 'TruckCreate',
  components: {
    TruckForm,
  },
  data() {
    return {
      loading: false,
    }
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
        .catch(e => {
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
