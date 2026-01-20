<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <DriverForm
          @submit="submit"
          @cancel="cancel"
          :carrierItems="carrierStore.carriers"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { DriverForm } from '@/entities/driver/index.js'
import { useCarrierStore } from '@/entities/carrier'

export default {
  name: 'DriverCreate',
  components: { DriverForm },
  setup() {
    const carrierStore = useCarrierStore()
    return {
      carrierStore,
    }
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
