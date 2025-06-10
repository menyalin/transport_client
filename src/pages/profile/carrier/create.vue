<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <CarrierForm :loading="loading" @submit="submit" @cancel="cancel" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { CarrierForm } from '@/entities/carrier'

export default {
  name: 'CarrierCreatePage',
  components: {
    CarrierForm,
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    submit(tkName) {
      this.loading = true
      this.$store
        .dispatch('createTkName', tkName)
        .then(() => {
          this.loading = false
          this.$router.push({ name: 'CarrierList' })
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
